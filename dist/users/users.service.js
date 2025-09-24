"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../schemas/user.schema");
let UsersService = class UsersService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(userData) {
        const createdUser = new this.userModel(userData);
        return createdUser.save();
    }
    async findAll() {
        return this.userModel.find().select('-password -verificationToken').exec();
    }
    async findById(id) {
        const user = await this.userModel
            .findOne({ id })
            .select('-password -verificationToken')
            .exec();
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async findByEmail(email) {
        const user = await this.userModel.findOne({ email }).exec();
        return user;
    }
    async findByEmailOrThrow(email) {
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) {
            throw new common_1.NotFoundException(`User with email ${email} not found`);
        }
        return user;
    }
    async findByVerificationToken(token) {
        const user = await this.userModel
            .findOne({ verificationToken: token })
            .exec();
        if (!user) {
            throw new common_1.NotFoundException(`User with verification token ${token} not found`);
        }
        return user;
    }
    async update(id, updateUserDto) {
        if (updateUserDto.email) {
            const existingUser = await this.userModel
                .findOne({
                email: updateUserDto.email,
                id: { $ne: id },
            })
                .exec();
            if (existingUser) {
                throw new common_1.BadRequestException('Email already exists');
            }
        }
        const updatedUser = await this.userModel
            .findOneAndUpdate({ id }, { ...updateUserDto, updatedAt: new Date() }, { new: true })
            .select('-password -verificationToken')
            .exec();
        if (!updatedUser) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return updatedUser;
    }
    async remove(id) {
        const result = await this.userModel.deleteOne({ id }).exec();
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
    }
    async getUserStats() {
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map