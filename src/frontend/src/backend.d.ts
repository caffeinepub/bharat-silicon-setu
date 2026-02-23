import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface AnalyticsData {
    activeProjects: bigint;
    engagementRate: number;
    projectApplicantCounts: Array<[Principal, bigint]>;
}
export interface ContactRequest {
    to: Principal;
    from: Principal;
    message: string;
}
export type Time = bigint;
export interface ReportData {
    endDate: Time;
    messagesSent: bigint;
    dailyActiveUsers: bigint;
    projectApplications: bigint;
    startDate: Time;
}
export interface ProjectApplication {
    status: string;
    timestamp: Time;
    student: Principal;
    project: Principal;
}
export interface Project {
    title: string;
    createdBy: Principal;
    skillsRequired: Array<string>;
    description: string;
    approved: boolean;
}
export interface RevenueData {
    timestamp: Time;
    totalRevenue: number;
}
export interface UserProfile {
    name: string;
    role: AppUserRole;
    email: string;
    registrationTimestamp: Time;
    principalId: Principal;
}
export interface PlatformConfig {
    maintenanceMode: boolean;
    siteName: string;
    registrationOpen: boolean;
}
export enum AppUserRole {
    admin = "admin",
    student = "student",
    industryPartner = "industryPartner"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addReport(report: ReportData): Promise<void>;
    addRevenue(amount: number): Promise<void>;
    applyForProject(projectCreator: Principal, projectIndex: bigint): Promise<void>;
    approveProject(projectCreator: Principal, projectIndex: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearReportsData(): Promise<void>;
    clearRevenueData(): Promise<void>;
    getAllProjects(): Promise<Array<[Principal, Array<Project>]>>;
    getAllReports(): Promise<Array<ReportData>>;
    getAllRevenue(): Promise<Array<RevenueData>>;
    getAllUsers(): Promise<Array<UserProfile>>;
    getAnalyticsData(): Promise<AnalyticsData>;
    getApprovedProjects(): Promise<Array<Project>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactRequests(): Promise<Array<ContactRequest>>;
    getMonthlyRevenue(month: bigint, year: bigint): Promise<number>;
    getPlatformConfig(): Promise<PlatformConfig>;
    getPlatformMetrics(): Promise<[bigint, bigint]>;
    getProjectApplications(): Promise<Array<ProjectApplication>>;
    getReportsByDateRange(startDate: Time, endDate: Time): Promise<Array<ReportData>>;
    getStudentApplications(): Promise<Array<ProjectApplication>>;
    getTotalRevenue(): Promise<number>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserProjects(): Promise<Array<Project>>;
    getUserRole(): Promise<AppUserRole | null>;
    isCallerAdmin(): Promise<boolean>;
    register(name: string, email: string, role: AppUserRole): Promise<void>;
    rejectProject(projectCreator: Principal, projectIndex: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveProject(project: Project): Promise<void>;
    sendContactRequest(to: Principal, message: string): Promise<void>;
    updateApplicationStatus(student: Principal, newStatus: string): Promise<void>;
    updatePlatformConfig(newConfig: PlatformConfig): Promise<void>;
}
