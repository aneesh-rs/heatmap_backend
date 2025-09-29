import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type InvitationDocument = Invitation & Document;

@Schema({ timestamps: true })
export class Invitation {
  @ApiProperty()
  @Prop({ required: true, unique: true })
  id: string;

  @ApiProperty()
  @Prop({ required: true })
  inviterId: string;

  @ApiProperty({ enum: ['Admin', 'User'] })
  @Prop({ required: true, enum: ['Admin', 'User'] })
  role: string;

  @ApiProperty({ enum: ['pending', 'verification_sent', 'accepted'] })
  @Prop({
    required: true,
    enum: ['pending', 'verification_sent', 'accepted'],
    default: 'pending',
  })
  status: string;

  @ApiProperty()
  @Prop()
  reservedEmail?: string;

  @ApiProperty()
  @Prop()
  acceptedBy?: string;

  @ApiProperty()
  @Prop({ default: Date.now })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);
