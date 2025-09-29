import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(userData: Partial<User>): Promise<UserDocument>;
    findAll(): Promise<UserDocument[]>;
    findById(id: string): Promise<UserDocument>;
    findByEmail(email: string): Promise<UserDocument | null>;
    findByEmailOrThrow(email: string): Promise<UserDocument>;
    findByVerificationToken(token: string): Promise<UserDocument>;
    findByResetPasswordToken(token: string): Promise<UserDocument | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument>;
    remove(id: string): Promise<void>;
    getUserStats(): Promise<any>;
}
