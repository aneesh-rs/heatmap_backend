import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @ApiProperty()
  @Prop({ required: true, unique: true })
  id: string;

  @ApiProperty()
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ enum: ['Admin', 'User'] })
  @Prop({ required: true, enum: ['Admin', 'User'] })
  role: string;

  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  firstSurname: string;

  @ApiProperty()
  @Prop()
  secondSurname: string;

  @ApiProperty()
  @Prop()
  birthday: string;

  @ApiProperty()
  @Prop()
  photoURL?: string;

  @Prop()
  password?: string; // Hashed password for local auth

  @ApiProperty()
  @Prop({ default: false })
  emailVerified: boolean;

  @Prop()
  verificationToken?: string;

  @ApiProperty()
  @Prop({ default: Date.now })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
