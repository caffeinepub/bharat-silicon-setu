import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

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

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();
  let projects = Map.empty<Principal, [Project]>();
  let contacts = Map.empty<Principal, [ContactRequest]>();

  var totalUsers = 0;
  var totalProjects = 0;

  // Helper function to map app roles to access control roles
  private func mapToAccessControlRole(appRole : AppUserRole) : AccessControl.UserRole {
    switch (appRole) {
      case (#admin) { #admin };
      case (#student or #industryPartner) { #user };
    };
  };

  public shared ({ caller }) func register(name : Text, email : Text, role : AppUserRole) : async () {
    // Prevent anonymous principals from registering
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot register");
    };

    // Check if user already exists
    switch (userProfiles.get(caller)) {
      case (?_) { Runtime.trap("User already registered") };
      case (null) { () };
    };

    // Only existing admins can register new admin accounts
    // Exception: if no users exist yet, allow first admin registration
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

    // Assign role in access control system
    let acRole = mapToAccessControlRole(role);
    AccessControl.assignRole(accessControlState, caller, caller, acRole);

    totalUsers += 1;
  };

  public query ({ caller }) func getUserRole() : async ?AppUserRole {
    if (caller.isAnonymous()) {
      return null;
    };

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

    // Users can view their own profile or admins can view any profile
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };

    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };

    // Verify the profile being saved is for the caller
    if (profile.principalId != caller) {
      Runtime.trap("Unauthorized: Can only save your own profile");
    };

    // Get existing profile to verify role changes
    switch (userProfiles.get(caller)) {
      case (?existingProfile) {
        // Only admins can change roles
        if (existingProfile.role != profile.role) {
          if (not AccessControl.isAdmin(accessControlState, caller)) {
            Runtime.trap("Unauthorized: Only admins can change user roles");
          };
          // Update the AccessControl system with the new role
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

  public shared ({ caller }) func saveProject(project : Project) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can save projects");
    };

    let profile = switch (userProfiles.get(caller)) {
      case (?profile) { profile };
      case (null) { Runtime.trap("User not registered") };
    };

    // Verify the project creator matches the caller
    if (project.createdBy != caller) {
      Runtime.trap("Unauthorized: Can only create projects for yourself");
    };

    // Only industry partners and admins can create projects
    let canCreateProject = switch (profile.role) {
      case (#industryPartner or #admin) { true };
      case (#student) { false };
    };

    if (not canCreateProject) {
      Runtime.trap("Unauthorized: Only industry partners can create projects");
    };

    // Auto-approve for admins, require approval for industry partners
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

  public shared ({ caller }) func sendContactRequest(to : Principal, message : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can send contact requests");
    };

    // Verify sender is registered
    switch (userProfiles.get(caller)) {
      case (?_) { () };
      case (null) { Runtime.trap("Sender not registered") };
    };

    // Verify recipient exists
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

  public query func getApprovedProjects() : async [Project] {
    // Public endpoint - any user including guests can view approved projects
    // No authorization check needed as this is intentionally public information
    let allProjects = projects.values().flatMap(
        func(projectList : [Project]) : Iter.Iter<Project> {
          projectList.vals();
        }
      ).toArray();

    allProjects.vals().filter<Project>(
        func(p : Project) : Bool { p.approved }
      ).toArray();
  };

  public query ({ caller }) func getPlatformMetrics() : async (Nat, Nat) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view platform metrics");
    };
    (totalUsers, totalProjects);
  };

  public query ({ caller }) func getTotalUsers() : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view platform statistics");
    };
    totalUsers;
  };

  public query ({ caller }) func getTotalProjects() : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view platform statistics");
    };
    totalProjects;
  };
};
