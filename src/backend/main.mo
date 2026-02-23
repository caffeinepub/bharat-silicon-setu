import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  public type AppUserRole = {
    #student;
    #industryPartner;
    #admin;
  };

  public type UserProfile = {
    principalId : Principal;
    role : AppUserRole;
    registrationTimestamp : Time.Time;
    name : Text;
    email : Text;
  };

  public type Project = {
    title : Text;
    description : Text;
    skillsRequired : [Text];
    createdBy : Principal;
    approved : Bool;
  };

  public type ContactRequest = {
    from : Principal;
    to : Principal;
    message : Text;
  };

  public type ProjectApplication = {
    student : Principal;
    project : Principal;
    status : Text;
    timestamp : Time.Time;
  };

  public type AnalyticsData = {
    projectApplicantCounts : [(Principal, Nat)];
    activeProjects : Nat;
    engagementRate : Float;
  };

  public type RevenueData = {
    totalRevenue : Float;
    timestamp : Time.Time;
  };

  public type ReportData = {
    dailyActiveUsers : Nat;
    projectApplications : Nat;
    messagesSent : Nat;
    startDate : Time.Time;
    endDate : Time.Time;
  };

  public type PlatformConfig = {
    siteName : Text;
    maintenanceMode : Bool;
    registrationOpen : Bool;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();
  let projects = Map.empty<Principal, [Project]>();
  let contacts = Map.empty<Principal, [ContactRequest]>();
  let projectApplications = Map.empty<Principal, [ProjectApplication]>();
  let platformRevenue = Map.empty<Nat, RevenueData>();
  let activityReports = Map.empty<Nat, ReportData>();

  var totalUsers = 0;
  var totalProjects = 0;
  var platformConfig : ?PlatformConfig = ?{
    siteName = "IndustryConnect";
    maintenanceMode = false;
    registrationOpen = true;
  };

  private func mapToAccessControlRole(appRole : AppUserRole) : AccessControl.UserRole {
    switch (appRole) {
      case (#admin) { #admin };
      case (#student or #industryPartner) { #user };
    };
  };

  public shared ({ caller }) func register(name : Text, email : Text, role : AppUserRole) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot register");
    };

    switch (userProfiles.get(caller)) {
      case (?_) { Runtime.trap("User already registered") };
      case (null) { () };
    };

    if (role == #admin) {
      if (totalUsers > 0 and not AccessControl.isAdmin(accessControlState, caller)) {
        Runtime.trap("Unauthorized: Only admins can register admin accounts");
      };
    };

    let newUser : UserProfile = {
      principalId = caller;
      role;
      registrationTimestamp = Time.now();
      name;
      email;
    };

    userProfiles.add(caller, newUser);

    let acRole = mapToAccessControlRole(role);
    AccessControl.assignRole(accessControlState, caller, caller, acRole);

    totalUsers += 1;
  };

  public query ({ caller }) func getUserRole() : async ?AppUserRole {
    switch (userProfiles.get(caller)) {
      case (?profile) { ?profile.role };
      case (null) { null };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view profiles");
    };

    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view profiles");
    };

    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };

    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };

    if (profile.principalId != caller) {
      Runtime.trap("Unauthorized: Can only save your own profile");
    };

    switch (userProfiles.get(caller)) {
      case (?existingProfile) {
        if (existingProfile.role != profile.role) {
          if (not AccessControl.isAdmin(accessControlState, caller)) {
            Runtime.trap("Unauthorized: Only admins can change user roles");
          };
          let newAcRole = mapToAccessControlRole(profile.role);
          AccessControl.assignRole(accessControlState, caller, caller, newAcRole);
        };
      };
      case (null) {
        Runtime.trap("User not registered");
      };
    };

    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getAllUsers() : async [UserProfile] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };

    userProfiles.values().toArray();
  };

  public shared ({ caller }) func saveProject(project : Project) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can save projects");
    };

    let profile = switch (userProfiles.get(caller)) {
      case (?profile) { profile };
      case (null) { Runtime.trap("User not registered") };
    };

    if (project.createdBy != caller) {
      Runtime.trap("Unauthorized: Can only create projects for yourself");
    };

    let canCreateProject = switch (profile.role) {
      case (#industryPartner or #admin) { true };
      case (#student) { false };
    };

    if (not canCreateProject) {
      Runtime.trap("Unauthorized: Only industry partners can create projects");
    };

    let isApproved = switch (profile.role) {
      case (#admin) { true };
      case (_) { false };
    };

    let newProject = { project with approved = isApproved };

    let existingProjects = switch (projects.get(caller)) {
      case (?p) { p };
      case (null) { [] };
    };

    projects.add(caller, existingProjects.concat([newProject]));
    totalProjects += 1;
  };

  public query ({ caller }) func getUserProjects() : async [Project] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view projects");
    };

    switch (projects.get(caller)) {
      case (?p) { p };
      case (null) { [] };
    };
  };

  public query func getApprovedProjects() : async [Project] {
    let allProjects = projects.values().flatMap(
        func(projectList : [Project]) : Iter.Iter<Project> {
          projectList.vals();
        }
      ).toArray();

    allProjects.vals().filter<Project>(
        func(p : Project) : Bool { p.approved }
      ).toArray();
  };

  public query ({ caller }) func getAllProjects() : async [(Principal, [Project])] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all projects");
    };

    projects.entries().toArray();
  };

  public shared ({ caller }) func approveProject(projectCreator : Principal, projectIndex : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can approve projects");
    };

    let creatorProjects = switch (projects.get(projectCreator)) {
      case (?p) { p };
      case (null) { Runtime.trap("Project creator not found") };
    };

    if (projectIndex >= creatorProjects.size()) {
      Runtime.trap("Invalid project index");
    };

    var updatedProjects = creatorProjects.toVarArray<Project>();
    updatedProjects[projectIndex] := {
      creatorProjects[projectIndex] with approved = true
    };

    projects.add(projectCreator, updatedProjects.toArray());
  };

  public shared ({ caller }) func rejectProject(projectCreator : Principal, projectIndex : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can reject projects");
    };

    let creatorProjects = switch (projects.get(projectCreator)) {
      case (?p) { p };
      case (null) { Runtime.trap("Project creator not found") };
    };

    if (projectIndex >= creatorProjects.size()) {
      Runtime.trap("Invalid project index");
    };

    var updatedProjects = creatorProjects.toVarArray<Project>();
    updatedProjects[projectIndex] := {
      creatorProjects[projectIndex] with approved = false
    };

    projects.add(projectCreator, updatedProjects.toArray());
  };

  public query ({ caller }) func getPlatformMetrics() : async (Nat, Nat) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view platform metrics");
    };
    (totalUsers, totalProjects);
  };

  public shared ({ caller }) func sendContactRequest(to : Principal, message : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can send contact requests");
    };

    switch (userProfiles.get(caller)) {
      case (?_) { () };
      case (null) { Runtime.trap("Sender not registered") };
    };

    switch (userProfiles.get(to)) {
      case (?_) { () };
      case (null) { Runtime.trap("Recipient not found") };
    };

    let newRequest : ContactRequest = {
      from = caller;
      to;
      message;
    };

    let existingRequests = switch (contacts.get(to)) {
      case (?r) { r };
      case (null) { [] };
    };

    contacts.add(to, existingRequests.concat([newRequest]));
  };

  public query ({ caller }) func getContactRequests() : async [ContactRequest] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view contact requests");
    };

    switch (contacts.get(caller)) {
      case (?r) { r };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func applyForProject(projectCreator : Principal, projectIndex : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can apply for projects");
    };

    switch (userProfiles.get(caller)) {
      case (?user) {
        if (user.role != #student) {
          Runtime.trap("Unauthorized: Only students can apply for projects");
        };
      };
      case (null) { Runtime.trap("User not registered") };
    };

    let creatorProjects = switch (projects.get(projectCreator)) {
      case (?p) { p };
      case (null) {
        Runtime.trap("Project creator not found");
      };
    };

    if (projectIndex >= creatorProjects.size()) {
      Runtime.trap("Invalid project index");
    };

    let project = creatorProjects[projectIndex];

    if (not project.approved) {
      Runtime.trap("Cannot apply to unapproved project");
    };

    let application : ProjectApplication = {
      student = caller;
      project = projectCreator;
      status = "Applied";
      timestamp = Time.now();
    };

    let existingApplications = switch (projectApplications.get(caller)) {
      case (?apps) { apps };
      case (null) { [] };
    };

    projectApplications.add(
      caller,
      existingApplications.concat([application]),
    );
  };

  public query ({ caller }) func getStudentApplications() : async [ProjectApplication] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view applications");
    };

    switch (userProfiles.get(caller)) {
      case (?user) {
        if (user.role != #student) {
          Runtime.trap("Unauthorized: Only students can view their applications");
        };
      };
      case (null) { Runtime.trap("User not registered") };
    };

    switch (projectApplications.get(caller)) {
      case (?apps) { apps };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getProjectApplications() : async [ProjectApplication] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view project applications");
    };

    switch (userProfiles.get(caller)) {
      case (?user) {
        if (user.role != #industryPartner and user.role != #admin) {
          Runtime.trap("Unauthorized: Only project creators can view applications");
        };
      };
      case (null) { Runtime.trap("User not registered") };
    };

    let allApplications = projectApplications.values().flatMap(
      func(apps : [ProjectApplication]) : Iter.Iter<ProjectApplication> {
        apps.vals().filter(
          func(app : ProjectApplication) : Bool {
            app.project == caller;
          }
        );
      }
    ).toArray();

    allApplications;
  };

  public shared ({ caller }) func updateApplicationStatus(student : Principal, newStatus : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can update application status");
    };

    switch (userProfiles.get(caller)) {
      case (?user) {
        if (user.role != #industryPartner and user.role != #admin) {
          Runtime.trap("Unauthorized: Only project creators can update application status");
        };
      };
      case (null) { Runtime.trap("Caller not registered") };
    };

    switch (userProfiles.get(student)) {
      case (?_) { () };
      case (null) { Runtime.trap("Student not found") };
    };

    let studentApplications = switch (projectApplications.get(student)) {
      case (?apps) { apps };
      case (null) { Runtime.trap("No applications found for student") };
    };

    var found = false;
    let updatedApplications = studentApplications.vals().map(
      func(app : ProjectApplication) : ProjectApplication {
        if (app.project == caller) {
          found := true;
          {
            student = app.student;
            project = app.project;
            status = newStatus;
            timestamp = Time.now();
          };
        } else {
          app;
        };
      }
    ).toArray();

    if (not found) {
      Runtime.trap("Application not found for your project");
    };

    projectApplications.add(student, updatedApplications);
  };

  public query ({ caller }) func getAnalyticsData() : async AnalyticsData {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view analytics");
    };

    switch (userProfiles.get(caller)) {
      case (?user) {
        if (user.role != #industryPartner and user.role != #admin) {
          Runtime.trap("Unauthorized: Only industry partners can view analytics data");
        };
      };
      case (null) { Runtime.trap("User not registered") };
    };

    let callerProjects = switch (projects.get(caller)) {
      case (?p) { p };
      case (null) { [] };
    };

    var applicantCount = 0;
    let projectApplicationsVals = projectApplications.values().toArray();
    for (project in callerProjects.values()) {
      for (apps in projectApplicationsVals.values()) {
        if (apps.any(func(app) { app.project == caller })) {
          applicantCount += 1;
        };
      };
    };

    let projectApplicantCounts = [(caller, applicantCount)];

    let activeProjects = callerProjects.filter(
      func(p : Project) : Bool { p.approved }
    ).size();

    // All calculation operands must be floats
    let engagementRate : Float = if (activeProjects == 0) {
      0.0;
    } else {
      applicantCount.toFloat() / activeProjects.toFloat();
    };

    {
      projectApplicantCounts;
      activeProjects;
      engagementRate;
    };
  };

  public shared ({ caller }) func addRevenue(amount : Float) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add revenue");
    };

    let newRevenue : RevenueData = {
      totalRevenue = amount;
      timestamp = Time.now();
    };

    platformRevenue.add(platformRevenue.size(), newRevenue);
  };

  public query ({ caller }) func getTotalRevenue() : async Float {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view revenue");
    };

    var totalRevenue : Float = 0.0;
    let revenueValues = platformRevenue.values().toArray();
    for (revenue in revenueValues.values()) {
      totalRevenue += revenue.totalRevenue;
    };
    totalRevenue;
  };

  public query ({ caller }) func getMonthlyRevenue(month : Nat, year : Nat) : async Float {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view revenue");
    };

    let filteredRevenue = platformRevenue.filter(
      func(_timestamp, revenue) {
        let timestamp = revenue.timestamp;
        let extractedMonth = (timestamp / (1000 * 3600 * 24 * 30)).toNat() % 12 + 1;
        let extractedYear = (timestamp / (1000 * 3600 * 24 * 365)).toNat();
        extractedMonth == month and extractedYear == year;
      }
    );

    var monthlyTotal : Float = 0.0;
    let revenueValues = filteredRevenue.values().toArray();
    for (revenue in revenueValues.values()) {
      monthlyTotal += revenue.totalRevenue;
    };
    monthlyTotal;
  };

  public query ({ caller }) func getAllRevenue() : async [RevenueData] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view revenue");
    };

    platformRevenue.values().toArray();
  };

  public shared ({ caller }) func addReport(report : ReportData) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add reports");
    };

    activityReports.add(activityReports.size(), report);
  };

  public query ({ caller }) func getReportsByDateRange(startDate : Time.Time, endDate : Time.Time) : async [ReportData] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view reports");
    };

    let filteredReports = activityReports.filter(
      func(_timestamp, report) {
        report.startDate >= startDate and report.endDate <= endDate;
      }
    );

    filteredReports.values().toArray();
  };

  public query ({ caller }) func getAllReports() : async [ReportData] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view reports");
    };

    activityReports.values().toArray();
  };

  public shared ({ caller }) func updatePlatformConfig(newConfig : PlatformConfig) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update platform configuration");
    };

    platformConfig := ?newConfig;
  };

  public query ({ caller }) func getPlatformConfig() : async PlatformConfig {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view platform configuration");
    };

    switch (platformConfig) {
      case (?config) { config };
      case (null) { Runtime.trap("Platform configuration not found") };
    };
  };

  public shared ({ caller }) func clearReportsData() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can clear reports data");
    };

    activityReports.clear();
  };

  public shared ({ caller }) func clearRevenueData() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can clear revenue data");
    };

    platformRevenue.clear();
  };
};
