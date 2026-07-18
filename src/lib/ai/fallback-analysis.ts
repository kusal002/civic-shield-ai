import { inferUrgency, routeIssue } from "@/lib/data/department-routing";
import type { CivicReport, SafetyAnalysis } from "@/types/report";

export function buildReportDetails(report: CivicReport) {
  const coordinates = report.incidentLocation
    ? `${report.incidentLocation.latitude.toFixed(5)}, ${report.incidentLocation.longitude.toFixed(5)}`
    : "Not available";
  const affectedCount = Number(report.affectedPeople);
  const details = [
    `Report reference: ${report.id}`,
    `Issue description: ${normaliseReportSentence(report.description)}`,
    `Confirmed location: ${report.incidentLocation?.label ?? report.location}`,
    `Coordinates: ${coordinates}`,
    `Time / duration: ${normaliseDuration(report.duration)}`,
  ];

  if (Number.isInteger(affectedCount) && affectedCount > 0) {
    details.push(`People affected (reported): ${affectedCount}`);
  }
  if (report.extraDetails?.trim()) {
    details.push(`Additional details: ${normaliseReportSentence(report.extraDetails)}`);
  }
  if (report.attachments?.length) {
    details.push(`Evidence attached: ${report.attachments.length} image/video file(s)`);
  }
  return details.join("\n");
}

function normaliseReportSentence(value: string) {
  let cleaned = value.trim().replace(/(.)\1{2,}/gi, "$1").replace(/\bpotholes{2,}\b/gi, "potholes");
  if (/\bpotholes?\b/i.test(cleaned) && /\bbig\b/i.test(cleaned)) {
    cleaned = cleaned.replace(/\bbig\b/gi, "large").replace(/\bmy area\b/gi, "the reported area");
  }
  if (/\bpotholes?\b/i.test(cleaned) && /\bvery\b/i.test(cleaned) && /\blarge\b/i.test(cleaned)) {
    cleaned = "Very large potholes";
  }
  if (/\blamp\s*lights?\b/i.test(cleaned) && /\b(broken|not working|non.?functional)\b/i.test(cleaned)) {
    cleaned = "Street lamps are not functioning";
  }
  cleaned = cleaned.replace(/\s+/g, " ").trim();
  if (!cleaned) return "Not provided";
  return `${cleaned.charAt(0).toUpperCase()}${cleaned.slice(1)}${/[.!?]$/.test(cleaned) ? "" : "."}`;
}

function normaliseDuration(value: string) {
  const cleaned = value
    .trim()
    .replace(/(\d)([a-zA-Z])/g, "$1 $2")
    .replace(/\b(may be|maybe|approx\.?|around)\b/gi, "Approximately")
    .replace(/\s+/g, " ");
  if (!cleaned) return "Not provided";
  return `${cleaned.charAt(0).toUpperCase()}${cleaned.slice(1)}`;
}

export function appendReportDetails(emailBody: string, report: CivicReport) {
  const cleanedDraft = emailBody
    .replace(/\n?The issue affects an unknown number of people\.?\s*/gi, "\n")
    .replace(/\[Your Name\]/gi, "A concerned citizen via CivicShield")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (cleanedDraft.includes("Report reference:")) return cleanedDraft;
  return `${cleanedDraft}\n\n--- Report details ---\n${buildReportDetails(report)}`;
}

export function createStructuredEmailDraft(report: CivicReport, routeName: string) {
  const coordinates = report.incidentLocation
    ? `${report.incidentLocation.latitude.toFixed(5)}, ${report.incidentLocation.longitude.toFixed(5)}`
    : "Not available";
  const affectedCount = Number(report.affectedPeople);
  const lines = [
    `Dear ${routeName},`,
    "",
    "I am writing to request inspection and necessary action on the civic issue described below.",
    "",
    "REPORT SUMMARY",
    `Report reference: ${report.id}`,
    `Issue reported: ${normaliseReportSentence(report.description)}`,
    `Confirmed location: ${report.incidentLocation?.label ?? report.location}`,
    `Coordinates: ${coordinates}`,
    `Reported duration: ${normaliseDuration(report.duration)}`,
  ];
  if (Number.isInteger(affectedCount) && affectedCount > 0) lines.push(`People affected (reported): ${affectedCount}`);
  if (report.extraDetails?.trim()) lines.push(`Additional details: ${normaliseReportSentence(report.extraDetails)}`);
  if (report.attachments?.length) lines.push(`Evidence attached: ${report.attachments.length} image/video file(s)`);
  lines.push("", "I request that the location be inspected and appropriate action be taken. Please share an acknowledgement or reference number, if available.", "", "Sincerely,", "A concerned citizen via CivicShield");
  return lines.join("\n");
}

export function createFallbackAnalysis(report: CivicReport, variation = 0): SafetyAnalysis {
  const route = routeIssue(`${report.description} ${report.location}`);
  const urgency = inferUrgency(report.description);
  const location = report.location;
  const detail = normaliseReportSentence(report.description);
  const reportDetails = buildReportDetails(report);
  const isUrgent = urgency === "high" || urgency === "critical";
  const opening = variation % 2 === 0 ? "I am writing to report" : "Please arrange an inspection for";

  return {
    category: route.category,
    urgency,
    route,
    generatedBy: "local-fallback",
    riskSummary: isUrgent
      ? "This report may present a public-safety risk and should be assessed promptly."
      : "This report needs civic attention to prevent inconvenience or a possible worsening condition.",
    immediateActions: isUrgent
      ? ["Keep people away from the affected area where possible.", "Do not attempt a repair or put yourself at risk.", "Call 112 if there is immediate danger to people."]
      : ["Avoid creating additional risk around the affected area.", "Keep a record of the location and time of the issue.", "Share the report with the responsible civic department."] ,
    publicAlert: `Civic alert: ${route.category} reported near ${location}. Please use caution and avoid the affected area if it appears unsafe.`,
    formalComplaint: `Subject: ${route.category} requiring attention at ${location}\n\nRespected Officer,\n\n${opening} ${route.category.toLowerCase()} at ${location}. ${detail}\n\n${reportDetails}\n\nI request that the location be inspected and the necessary action taken.\n\nSincerely,\nA concerned citizen`,
    emailSubject: `${route.category}: action requested at ${location}`,
    emailBody: createStructuredEmailDraft(report, route.name),
  };
}
