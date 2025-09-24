import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<import("../schemas/user.schema").UserDocument[]>;
    getUserStats(): Promise<any>;
    getProfile(req: any): Promise<import("../schemas/user.schema").UserDocument>;
    findOne(id: string, req: any): Promise<import("../schemas/user.schema").UserDocument>;
    updateProfile(req: any, updateUserDto: UpdateUserDto): Promise<import("../schemas/user.schema").UserDocument>;
    update(id: string, updateUserDto: UpdateUserDto, req: any): Promise<import("../schemas/user.schema").UserDocument>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
