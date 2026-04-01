import { RegistrationModel } from './registration';

export namespace MemberModel {
  export interface Member extends RegistrationModel.Registration {
    memberId: string;
    joinedDate: string;
  }

  export interface TransferMembersRequest {
    memberIds: string[];
    targetClubId: string;
  }

  export interface MemberListResponse {
    data: Member[];
    total: number;
    success: boolean;
    message: string;
  }

  export interface MemberTransferResponse {
    transferredCount: number;
    success: boolean;
    message: string;
  }
}
