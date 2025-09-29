import { Model } from 'mongoose';
import { Invitation, InvitationDocument } from '../schemas/invitation.schema';
export declare class InvitationsService {
    private invitationModel;
    constructor(invitationModel: Model<InvitationDocument>);
    createInvitation(inviterId: string, role: 'Admin' | 'User', reservedEmail?: string): Promise<import("mongoose").Document<unknown, {}, InvitationDocument, {}, {}> & Invitation & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getInvitation(invitationId: string): Promise<import("mongoose").Document<unknown, {}, InvitationDocument, {}, {}> & Invitation & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    markVerificationSent(invitationId: string): Promise<import("mongoose").Document<unknown, {}, InvitationDocument, {}, {}> & Invitation & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    acceptInvitation(invitationId: string, acceptedByUserId: string, emailUsed: string): Promise<import("mongoose").Document<unknown, {}, InvitationDocument, {}, {}> & Invitation & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
