export type UrgencyLevel = "low" | "medium" | "high" | "critical";

export type ReportStatus =
  | "draft"
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
  category?: string;
  urgency?: UrgencyLevel;
  status: ReportStatus;
  createdAt: string;
}
