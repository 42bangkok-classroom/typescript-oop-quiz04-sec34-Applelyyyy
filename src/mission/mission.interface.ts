export interface IMission {
  id: string;
  codename: string;
  status: string;
  targetName: string;
  riskLevel: string;
  startDate: string;
  endDate: string | null;
}

export interface ICreateMission {
  codename: string;
  targetName: string;
  riskLevel: string;
  startDate: string;
}
