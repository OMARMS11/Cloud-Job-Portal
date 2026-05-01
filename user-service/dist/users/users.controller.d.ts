import { UsersService } from './users.service';
import { UserRole } from "../entities/user.entity";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(body: {
        email: string;
        password: string;
        role: UserRole;
    }): void;
    login(body: {
        email: string;
        password: string;
    }): void;
}
