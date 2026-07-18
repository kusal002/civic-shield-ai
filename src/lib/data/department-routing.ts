import type { DepartmentRoute, UrgencyLevel } from "@/types/report";

const ROUTES: Array<{ terms: string[]; route: DepartmentRoute }> = [
  {
    terms: ["wire", "electric", "electricity", "pole", "shock", "streetlight", "street light"],
    route: {
      name: "Municipal Electrical Maintenance Cell",
      category: "Electrical safety",
      rationale: "The report indicates a public electrical asset or possible electrical safety risk.",
    },
  },
  {
    terms: ["garbage", "waste", "sanitation", "trash", "litter"],
    route: {
      name: "Municipal Sanitation & Solid Waste Department",
      category: "Sanitation and waste",
      rationale: "The report concerns public sanitation or solid-waste collection.",
    },
  },
  {
    terms: ["water", "drain", "drainage", "flood", "waterlog", "leak", "sewage"],
    route: {
      name: "Municipal Drainage & Water Services Department",
      category: "Drainage and water",
      rationale: "The report concerns drainage, water supply, leakage, or waterlogging.",
    },
  },
  {
    terms: ["road", "pothole", "footpath", "pavement", "bridge"],
    route: {
      name: "Municipal Engineering / Public Works Department",
      category: "Roads and infrastructure",
      rationale: "The report concerns a public road, footpath, or civic infrastructure asset.",
    },
  },
  {
    terms: ["traffic", "signal", "junction", "crossing"],
    route: {
      name: "Traffic Engineering Cell",
      category: "Traffic safety",
      rationale: "The report concerns traffic operations or a road-safety hazard.",
    },
  },
];

export function routeIssue(text: string): DepartmentRoute {
  const normalized = text.toLowerCase();
  return ROUTES.find(({ terms }) => terms.some((term) => normalized.includes(term)))?.route ?? {
    name: "Municipal Public Grievance Cell",
    category: "General civic issue",
    rationale: "The issue needs municipal review before it can be assigned to a specialist department.",
  };
}

export function inferUrgency(text: string): UrgencyLevel {
  const normalized = text.toLowerCase();
  if (/fire|explosion|collapse|unconscious|electric shock|live wire|serious accident/.test(normalized)) return "critical";
  if (/exposed wire|waterlog|flood|unsafe|danger|accident|blocked|sewage/.test(normalized)) return "high";
  if (/broken|leak|garbage|pothole|streetlight|drain/.test(normalized)) return "medium";
  return "low";
}
