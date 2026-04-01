export namespace ReportModel {
  export interface RegistrationStatistics {
    totalPending: number;
    totalApproved: number;
    totalRejected: number;
  }

  export interface ClubStatistics {
    totalClubs: number;
  }

  export interface OverallStatistics {
    clubs: ClubStatistics;
    registrations: RegistrationStatistics;
  }

  export interface ClubRegistrationChart {
    clubId: string;
    clubName: string;
    pending: number;
    approved: number;
    rejected: number;
  }

  export interface ChartData {
    clubId: string;
    clubName: string;
    pending: number;
    approved: number;
    rejected: number;
  }

  export interface StatisticsResponse {
    data: OverallStatistics;
    success: boolean;
    message: string;
  }

  export interface ChartDataResponse {
    data: ChartData[];
    success: boolean;
    message: string;
  }
}
