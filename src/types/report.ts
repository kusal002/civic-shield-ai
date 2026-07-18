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

export interface CivicReport {
  id: string;
  description: string;
  location: string;
  duration: string;
  affectedPeople?: string;
  extraDetails?: string;
  photoName?: string;
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
  affectedPeople?: string;
  extraDetails?: string;
  photoName?: string;
}
