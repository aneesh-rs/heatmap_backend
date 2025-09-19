import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userData: Partial<User>): Promise<UserDocument> {
    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().select('-password -verificationToken').exec();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel
      .findOne({ id })
      .select('-password -verificationToken')
      .exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByVerificationToken(token: string): Promise<UserDocument> {
    return this.userModel.findOne({ verificationToken: token }).exec();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    // Check if email is being updated and if it already exists
    if (updateUserDto.email) {
      const existingUser = await this.userModel
        .findOne({
          email: updateUserDto.email,
          id: { $ne: id },
        })
        .exec();

      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }
    }

    const updatedUser = await this.userModel
      .findOneAndUpdate(
        { id },
        { ...updateUserDto, updatedAt: new Date() },
        { new: true },
      )
      .select('-password -verificationToken')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async getUserStats(): Promise<any> {
    const totalUsers = await this.userModel.countDocuments().exec();
    const admins = await this.userModel
      .countDocuments({ role: 'Admin' })
      .exec();
    const regularUsers = await this.userModel
      .countDocuments({ role: 'User' })
      .exec();
    const verifiedUsers = await this.userModel
      .countDocuments({ emailVerified: true })
      .exec();

    return {
      totalUsers,
      admins,
      regularUsers,
      verifiedUsers,
      unverifiedUsers: totalUsers - verifiedUsers,
    };
  }
}
