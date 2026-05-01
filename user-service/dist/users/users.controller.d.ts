import { UsersService } from './users.service';
import { UserRole } from "../entities/user.entity";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(body: {
        email: string;
        password: string;
        role: UserRole;
    }): Promise<import("src/entities/user.entity").User>;
    login(body: {
        email: string;
        password: string;
    }): Promise<import("src/entities/user.entity").User | null>;
    findAll(): Promise<import("src/entities/user.entity").User[]>;
}
