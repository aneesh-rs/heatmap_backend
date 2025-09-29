export declare class UpdateUserDto {
    email?: string;
    name?: string;
    firstSurname?: string;
    secondSurname?: string;
    role?: string;
    birthday?: string;
    photoURL?: string;
    emailVerified?: boolean;
    verificationToken?: string | null;
    resetPasswordToken?: string | null;
    resetPasswordExpires?: Date | null;
    password?: string | null;
}
