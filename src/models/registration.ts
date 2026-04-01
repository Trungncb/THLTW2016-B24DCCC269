export namespace RegistrationModel {
  export enum RegistrationStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
  }

  export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER',
  }

  export interface Registration {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    gender: Gender;
    address: string;
    specialty: string;
    clubId: string;
    clubName?: string;
    reason: string; // Lý do đăng ký
    status: RegistrationStatus;
    rejectionReason?: string; // Lý do từ chối
    createdAt: string;
    updatedAt: string;
  }

  export interface CreateRegistrationRequest {
    fullName: string;
    email: string;
    phone: string;
    gender: Gender;
    address: string;
    specialty: string;
    clubId: string;
    reason: string;
  }

  export interface UpdateRegistrationRequest extends Partial<CreateRegistrationRequest> {
    id: string;
    status?: RegistrationStatus;
    rejectionReason?: string;
  }

  export interface ApproveRegistrationRequest {
    registrationIds: string[];
  }

  export interface RejectRegistrationRequest {
    registrationIds: string[];
    rejectionReason: string;
  }

  export interface RegistrationResponse {
    data: Registration;
    success: boolean;
    message: string;
  }

  export interface RegistrationListResponse {
    data: Registration[];
    total: number;
    success: boolean;
    message: string;
  }

  export interface ActionHistory {
    id: string;
    registrationId: string;
    action: 'APPROVED' | 'REJECTED' | 'CREATED' | 'UPDATED';
    adminId: string;
    adminName: string;
    timestamp: string;
    details: string; // Lý do từ chối hoặc chi tiết khác
  }

  export interface ActionHistoryListResponse {
    data: ActionHistory[];
    total: number;
    success: boolean;
    message: string;
  }
}
