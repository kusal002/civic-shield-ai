export type UrgencyLevel = "low" | "medium" | "high" | "critical";

export type ReportStatus =
  | "draft"
  | "ready-to-analyze"
  | "submitted"
  | "delivery-confirmed"
  | "acknowledged"
  | "assigned"
  | "in-progress"
  | "department-resolved"
  | "verification-pending"
  | "verified-resolved"
  | "disputed"
  | "reopened"
  | "overdue";

export interface IncidentLocation {
  label: string;
  latitude: number;
  longitude: number;
  source: "search" | "current-location" | "map-pin" | "manual";
}

export interface CivicAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  kind: "image" | "video";
}

export interface DepartmentRoute {
  name: string;
  category: string;
  rationale: string;
}

export interface SafetyAnalysis {
  category: string;
  urgency: UrgencyLevel;
  riskSummary: string;
  immediateActions: string[];
  publicAlert: string;
  formalComplaint: string;
  emailSubject: string;
  emailBody: string;
  route: DepartmentRoute;
  generatedBy: "groq" | "local-fallback";
}

export interface CivicReport {
  id: string;
  description: string;
  location: string;
  incidentLocation?: IncidentLocation;
  duration: string;
  affectedPeople?: string;
  extraDetails?: string;
  attachments?: CivicAttachment[];
  analysis?: SafetyAnalysis;
  category?: string;
  urgency?: UrgencyLevel;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CivicReportInput {
  description: string;
  location: string;
  duration: string;
  incidentLocation?: IncidentLocation;
  affectedPeople?: string;
  extraDetails?: string;
  attachments?: CivicAttachment[];
}
