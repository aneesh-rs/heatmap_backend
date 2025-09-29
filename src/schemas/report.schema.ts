import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ReportDocument = Report & Document;

class Location {
  @ApiProperty()
  lat: number;

  @ApiProperty()
  lng: number;

  @ApiProperty()
  address: string;
}

@Schema({ timestamps: true })
export class Report {
  @ApiProperty()
  @Prop({
    required: true,
    unique: true,
    default: () => new Types.ObjectId().toString(),
  })
  id: string;

  @ApiProperty()
  @Prop({ required: true })
  userId: string;

  @ApiProperty({
    enum: ['happy', 'neutral', 'confused', 'sad', 'angry', 'surprised'],
  })
  @Prop({
    required: true,
    enum: ['happy', 'neutral', 'confused', 'sad', 'angry', 'surprised'],
  })
  feeling: string;

  @ApiProperty({
    enum: ['rubbish', 'vandalism', 'hazard', 'traffic', 'others'],
  })
  @Prop({
    required: true,
    enum: ['rubbish', 'vandalism', 'hazard', 'traffic', 'others'],
  })
  category: string;

  @ApiProperty()
  @Prop({ required: true })
  reportText: string;

  @ApiProperty()
  @Prop({ required: true })
  firstName: string;

  @ApiProperty()
  @Prop({ required: true })
  lastName: string;

  @ApiProperty({ type: Location })
  @Prop({ type: Object, required: true })
  location: {
    lat: number;
    lng: number;
    address: string;
  };

  @ApiProperty({ enum: ['Pending', 'New', 'Closed'] })
  @Prop({ required: true, enum: ['Pending', 'New', 'Closed'], default: 'New' })
  reportStatus: string;

  @ApiProperty()
  @Prop({ default: Date.now })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
