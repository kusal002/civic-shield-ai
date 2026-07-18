import directory from "@/lib/data/department-directory.json";
import type { CivicReport, DepartmentRoute } from "@/types/report";

export interface DepartmentContact {
  authority: string;
  email: string;
  sourceUrl: string;
  lastVerified: string;
}

type DirectoryEntry = DepartmentContact & {
  categories: string[];
  locationMatchers: string[];
};

export function findDepartmentContact(report: CivicReport, route: DepartmentRoute): DepartmentContact | null {
  const location = `${report.incidentLocation?.label ?? ""} ${report.location}`.toLowerCase();
  const entries = directory as DirectoryEntry[];
  const match = entries.find((entry) =>
    entry.categories.includes(route.category) && entry.locationMatchers.some((matcher) => location.includes(matcher)),
  );
  return match ? pickContact(match) : null;
}

function pickContact({ authority, email, sourceUrl, lastVerified }: DirectoryEntry): DepartmentContact {
  return { authority, email, sourceUrl, lastVerified };
}
