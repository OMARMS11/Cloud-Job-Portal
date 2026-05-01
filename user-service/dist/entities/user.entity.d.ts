export declare enum UserRole {
    JOB_SEEKER = "JOB_SEEKER",
    EMPLOYER = "EMPLOYER"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
}
