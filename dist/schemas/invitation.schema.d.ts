import { Document } from 'mongoose';
export type InvitationDocument = Invitation & Document;
export declare class Invitation {
    id: string;
    inviterId: string;
    role: string;
    status: string;
    reservedEmail?: string;
    acceptedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const InvitationSchema: import("mongoose").Schema<Invitation, import("mongoose").Model<Invitation, any, any, any, Document<unknown, any, Invitation, any, {}> & Invitation & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Invitation, Document<unknown, {}, import("mongoose").FlatRecord<Invitation>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Invitation> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
