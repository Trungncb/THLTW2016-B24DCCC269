export namespace ClubModel {
  export interface Club {
    id: string;
    name: string;
    avatar?: string;
    foundedDate: string; // ISO 8601 date format
    description: string; // HTML content
    headmaster: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
  }

  export interface CreateClubRequest {
    name: string;
    avatar?: string;
    foundedDate: string;
    description: string;
    headmaster: string;
    active: boolean;
  }

  export interface UpdateClubRequest extends Partial<CreateClubRequest> {
    id: string;
  }

  export interface ClubResponse {
    data: Club;
    success: boolean;
    message: string;
  }

  export interface ClubListResponse {
    data: Club[];
    total: number;
    success: boolean;
    message: string;
  }
}
