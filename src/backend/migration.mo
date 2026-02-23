import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  type AppUserRole = {
    #student;
    #industryPartner;
    #admin;
  };

  type UserProfile = {
    principalId : Principal.Principal;
    role : AppUserRole;
    registrationTimestamp : Time.Time;
    name : Text;
    email : Text;
  };

  type Project = {
    title : Text;
    description : Text;
    skillsRequired : [Text];
    createdBy : Principal.Principal;
    approved : Bool;
  };

  type ContactRequest = {
    from : Principal.Principal;
    to : Principal.Principal;
    message : Text;
  };

  type ProjectApplication = {
    student : Principal.Principal;
    project : Principal.Principal;
    status : Text;
    timestamp : Time.Time;
  };

  type AnalyticsData = {
    projectApplicantCounts : [(Principal.Principal, Nat)];
    activeProjects : Nat;
    engagementRate : Float;
  };

  type RevenueData = {
    totalRevenue : Float;
    timestamp : Time.Time;
  };

  type ReportData = {
    dailyActiveUsers : Nat;
    projectApplications : Nat;
    messagesSent : Nat;
    startDate : Time.Time;
    endDate : Time.Time;
  };

  type PlatformConfig = {
    siteName : Text;
    maintenanceMode : Bool;
    registrationOpen : Bool;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal.Principal, UserProfile>;
    projects : Map.Map<Principal.Principal, [Project]>;
    contacts : Map.Map<Principal.Principal, [ContactRequest]>;
    totalUsers : Nat;
    totalProjects : Nat;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal.Principal, UserProfile>;
    projects : Map.Map<Principal.Principal, [Project]>;
    contacts : Map.Map<Principal.Principal, [ContactRequest]>;
    projectApplications : Map.Map<Principal.Principal, [ProjectApplication]>;
    platformRevenue : Map.Map<Nat, RevenueData>;
    activityReports : Map.Map<Nat, ReportData>;
    totalUsers : Nat;
    totalProjects : Nat;
    platformConfig : ?PlatformConfig;
  };

  public func run(old : OldActor) : NewActor {
    {
      userProfiles = old.userProfiles;
      projects = old.projects;
      contacts = old.contacts;
      projectApplications = Map.empty<Principal.Principal, [ProjectApplication]>();
      platformRevenue = Map.empty<Nat, RevenueData>();
      activityReports = Map.empty<Nat, ReportData>();
      totalUsers = old.totalUsers;
      totalProjects = old.totalProjects;
      platformConfig = ?{
        siteName = "IndustryConnect";
        maintenanceMode = false;
        registrationOpen = true;
      };
    };
  };
};
