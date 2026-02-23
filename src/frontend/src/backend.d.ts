import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ContactRequest {
    to: Principal;
    from: Principal;
    message: string;
}
export type Time = bigint;
export interface Project {
    title: string;
    createdBy: Principal;
    skillsRequired: Array<string>;
    description: string;
    approved: boolean;
}
export interface UserProfile {
    name: string;
    role: AppUserRole;
    email: string;
    registrationTimestamp: Time;
    principalId: Principal;
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
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getApprovedProjects(): Promise<Array<Project>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactRequests(): Promise<Array<ContactRequest>>;
    getPlatformMetrics(): Promise<[bigint, bigint]>;
    getTotalProjects(): Promise<bigint>;
    getTotalUsers(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserProjects(): Promise<Array<Project>>;
    getUserRole(): Promise<AppUserRole | null>;
    isCallerAdmin(): Promise<boolean>;
    register(name: string, email: string, role: AppUserRole): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveProject(project: Project): Promise<void>;
    sendContactRequest(to: Principal, message: string): Promise<void>;
}
