import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from 'src/invitations/dto/create-invitation.dto';
import { AcceptInvitationDto } from 'src/invitations/dto/accept-invitation.dto';
export declare class InvitationsController {
    private readonly invitationsService;
    constructor(invitationsService: InvitationsService);
    createInvitation(body: CreateInvitationDto): Promise<{
        invitationId: any;
        invitationLink: string;
        invite: import("mongoose").Document<unknown, {}, import("../schemas/invitation.schema").InvitationDocument, {}, {}> & import("../schemas/invitation.schema").Invitation & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    getInvitation(id: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/invitation.schema").InvitationDocument, {}, {}> & import("../schemas/invitation.schema").Invitation & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    accept(body: AcceptInvitationDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/invitation.schema").InvitationDocument, {}, {}> & import("../schemas/invitation.schema").Invitation & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
