import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { CivicReport, PublicCivicReport, ReportStatus, SafetyAnalysis } from "@/types/report";

type DbReport = {
  report_id: string;
  category: string | null;
  urgency: PublicCivicReport["urgency"];
  status: ReportStatus;
  location_label: string;
  created_at: string;
  updated_at: string;
};

export async function createPersistentReport(input: Omit<CivicReport, "id" | "createdAt" | "updatedAt" | "status">) {
  const supabase = getSupabaseAdmin();
  const reportId = `CS-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const { error } = await supabase.from("civic_reports").insert({
    report_id: reportId,
    description: input.description,
    location_label: input.incidentLocation?.label ?? input.location,
    latitude: input.incidentLocation?.latitude ?? null,
    longitude: input.incidentLocation?.longitude ?? null,
    duration: input.duration,
    affected_people: Number(input.affectedPeople) || null,
    extra_details: input.extraDetails ?? null,
    attachment_count: input.attachments?.length ?? 0,
    status: "ready-to-analyze",
    public_visible: true,
  });
  if (error) throw new Error(error.message);
  await addStatusEvent(reportId, "ready-to-analyze", "Report created and queued for analysis.");
  return reportId;
}

export async function savePersistentAnalysis(reportId: string, analysis: SafetyAnalysis) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("civic_reports").update({
    category: analysis.category,
    urgency: analysis.urgency,
    route_name: analysis.route.name,
    analysis: analysis,
    updated_at: new Date().toISOString(),
  }).eq("report_id", reportId);
  if (error) throw new Error(error.message);
}

export async function markPersistentDelivery(reportId: string, recipient: string, messageId?: string) {
  const supabase = getSupabaseAdmin();
  const sentAt = new Date().toISOString();
  const { error } = await supabase.from("civic_reports").update({
    status: "delivery-confirmed",
    email_recipient: recipient,
    gmail_message_id: messageId ?? null,
    email_sent_at: sentAt,
    updated_at: sentAt,
  }).eq("report_id", reportId);
  if (error) throw new Error(error.message);
  await addStatusEvent(reportId, "delivery-confirmed", "Email accepted by Gmail for delivery.");
}

export async function getPublicReports(limit = 30): Promise<PublicCivicReport[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("civic_reports")
    .select("report_id, category, urgency, status, location_label, created_at, updated_at")
    .eq("public_visible", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return ((data ?? []) as DbReport[]).map((report) => ({
    id: report.report_id,
    category: report.category,
    urgency: report.urgency,
    status: report.status,
    locationLabel: report.location_label,
    createdAt: report.created_at,
    updatedAt: report.updated_at,
  }));
}

async function addStatusEvent(reportId: string, status: ReportStatus, note: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("report_status_events").insert({ report_id: reportId, status, note, public_visible: true });
  if (error) throw new Error(error.message);
}
