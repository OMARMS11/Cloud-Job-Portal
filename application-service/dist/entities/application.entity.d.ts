export declare enum ApplicationStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED"
}
export declare class Application {
    id: number;
    jobId: number;
    userId: number;
    status: ApplicationStatus;
    createdAt: Date;
}
