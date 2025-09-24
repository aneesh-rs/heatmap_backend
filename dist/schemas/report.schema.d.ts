import { Document } from 'mongoose';
export type ReportDocument = Report & Document;
export declare class Report {
    userId: string;
    feeling: string;
    category: string;
    reportText: string;
    firstName: string;
    lastName: string;
    location: {
        lat: number;
        lng: number;
        address: string;
    };
    reportStatus: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ReportSchema: import("mongoose").Schema<Report, import("mongoose").Model<Report, any, any, any, Document<unknown, any, Report, any, {}> & Report & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Report, Document<unknown, {}, import("mongoose").FlatRecord<Report>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Report> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
