import { inferUrgency, routeIssue } from "@/lib/data/department-routing";
import type { CivicReport, SafetyAnalysis } from "@/types/report";

export function createFallbackAnalysis(report: CivicReport, variation = 0): SafetyAnalysis {
  const route = routeIssue(`${report.description} ${report.location}`);
  const urgency = inferUrgency(report.description);
  const location = report.location;
  const detail = report.description.trim();
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
    formalComplaint: `Subject: ${route.category} requiring attention at ${location}\n\nRespected Officer,\n\n${opening} ${route.category.toLowerCase()} at ${location}. ${detail} The issue has been present ${report.duration}. ${report.affectedPeople ? `It may affect ${report.affectedPeople}.` : ""}\n\nI request that the location be inspected and the necessary action taken.\n\nSincerely,\nA concerned citizen`,
    emailSubject: `${route.category}: action requested at ${location}`,
    emailBody: `Respected Officer,\n\n${opening} ${route.category.toLowerCase()} at ${location}.\n\nDetails: ${detail}\nDuration: ${report.duration}\n${report.affectedPeople ? `Affected area/people: ${report.affectedPeople}\n` : ""}\nI request an inspection and appropriate action. Please acknowledge this report and share the reference number, if available.\n\nSincerely,\nA concerned citizen`,
  };
}
