"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileText,
  Info,
  MapPin,
  ShieldCheck,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getLocalReportsSnapshot, saveLocalReport, subscribeToLocalReports } from "@/lib/storage/reports";
import type { CivicReport } from "@/types/report";

const reportSchema = z.object({
  description: z
    .string()
    .trim()
    .min(20, "Describe the problem in at least 20 characters.")
    .max(900, "Keep the description under 900 characters for now."),
  location: z.string().trim().min(6, "Add a useful location or landmark.").max(180),
  duration: z.string().trim().min(2, "Add when this started or how long it has continued.").max(120),
  affectedPeople: z.string().trim().max(160).optional(),
  extraDetails: z.string().trim().max(360).optional(),
  photoName: z.string().optional(),
});

type ReportFormValues = z.infer<typeof reportSchema>;

const defaultValues: ReportFormValues = {
  description: "",
  location: "",
  duration: "",
  affectedPeople: "",
  extraDetails: "",
  photoName: "",
};

export function CivicReportForm() {
  const [savedReport, setSavedReport] = useState<CivicReport | null>(null);
  const reportsSnapshot = useSyncExternalStore(subscribeToLocalReports, getLocalReportsSnapshot, () => "[]");
  const savedReportsCount = parseSavedReportsCount(reportsSnapshot);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues,
  });

  function onSubmit(values: ReportFormValues) {
    const report = saveLocalReport(values);
    setSavedReport(report);
    reset(defaultValues);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_23rem] lg:items-start">
      <Card className="overflow-hidden rounded-3xl">
        <CardHeader className="border-b border-line bg-[#fbfdfc] p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="eyebrow">Civic issue reporter</p>
              <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Tell us what happened.
              </h1>
              <p className="mt-3 max-w-2xl leading-7 text-muted">
                Start with plain language. CivicShield will save the report locally for the next analysis milestone.
              </p>
            </div>
            <Badge tone="safe" className="w-fit gap-1.5">
              <ShieldCheck aria-hidden="true" size={14} />
              Local MVP
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              error={errors.description?.message}
              helper="Example: The road near Central Market is waterlogged and an exposed wire is lying beside the footpath."
              label="What happened? Describe the problem in your own words."
            >
              <textarea
                className="min-h-40 w-full resize-y rounded-2xl border border-line bg-white px-4 py-3 text-base leading-7 text-ink shadow-sm transition focus:border-brand focus:outline-none"
                placeholder="Describe the issue, visible risk, and anything people nearby should know."
                {...register("description")}
              />
            </FormField>

            <div className="grid gap-5 md:grid-cols-2">
              <FormField error={errors.location?.message} icon={<MapPin aria-hidden="true" size={16} />} label="Location or landmark">
                <input
                  className="h-12 w-full rounded-2xl border border-line bg-white px-4 text-sm text-ink shadow-sm transition focus:border-brand focus:outline-none"
                  placeholder="Street, locality, ward, campus gate..."
                  {...register("location")}
                />
              </FormField>

              <FormField error={errors.duration?.message} icon={<Clock3 aria-hidden="true" size={16} />} label="Time or duration">
                <input
                  className="h-12 w-full rounded-2xl border border-line bg-white px-4 text-sm text-ink shadow-sm transition focus:border-brand focus:outline-none"
                  placeholder="Since morning, 3 days, after heavy rain..."
                  {...register("duration")}
                />
              </FormField>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <FormField error={errors.affectedPeople?.message} label="Affected people or area">
                <input
                  className="h-12 w-full rounded-2xl border border-line bg-white px-4 text-sm text-ink shadow-sm transition focus:border-brand focus:outline-none"
                  placeholder="Pedestrians, residents, school route..."
                  {...register("affectedPeople")}
                />
              </FormField>

              <FormField error={errors.photoName?.message} icon={<Upload aria-hidden="true" size={16} />} label="Photo attachment">
                <label className="flex h-12 cursor-pointer items-center justify-between gap-3 rounded-2xl border border-dashed border-[#b8cdc6] bg-[#f8fdfb] px-4 text-sm font-medium text-muted transition hover:border-brand hover:text-brand">
                  <span className="truncate">Optional image for local reference</span>
                  <input
                    className="sr-only"
                    type="file"
                    accept="image/*"
                    onChange={(event) => setValue("photoName", event.target.files?.[0]?.name ?? "")}
                  />
                </label>
              </FormField>
            </div>

            <FormField error={errors.extraDetails?.message} label="Extra details">
              <textarea
                className="min-h-28 w-full resize-y rounded-2xl border border-line bg-white px-4 py-3 text-sm leading-6 text-ink shadow-sm transition focus:border-brand focus:outline-none"
                placeholder="Add nearby hazards, access notes, or repeated history. Avoid private personal details."
                {...register("extraDetails")}
              />
            </FormField>

            <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex gap-2 text-sm leading-6 text-muted">
                <Info aria-hidden="true" className="mt-1 shrink-0 text-brand" size={16} />
                Stored only in this browser for the MVP. Do not include private phone numbers, IDs, or sensitive information.
              </p>
              <Button className="shrink-0" disabled={isSubmitting} size="lg" type="submit">
                <FileText aria-hidden="true" size={18} />
                Analyze safety and create report
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <aside className="space-y-5">
        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Saved locally</p>
                <p className="mt-2 font-display text-3xl font-bold">{savedReportsCount}</p>
              </div>
              <span className="grid size-11 place-items-center rounded-2xl bg-brand-soft text-brand">
                <FileText aria-hidden="true" size={21} />
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">
              Reports saved here will be available to the upcoming dashboard and analysis flow.
            </p>
          </CardContent>
        </Card>

        {savedReport ? (
          <Card className="rounded-3xl border-[#c7e7dc] bg-[#f8fdfb]">
            <CardContent className="p-6">
              <Badge tone="safe" className="gap-1.5">
                <CheckCircle2 aria-hidden="true" size={14} />
                Report saved
              </Badge>
              <h2 className="mt-4 font-display text-2xl font-bold tracking-tight">{savedReport.id}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                This report is marked Ready to Analyze. AI analysis, complaint generation, and dashboard publishing come in the next planned steps.
              </p>
              <div className="mt-5 rounded-2xl border border-line bg-white p-4 text-sm">
                <p className="font-semibold text-ink">{savedReport.location}</p>
                <p className="mt-2 line-clamp-4 leading-6 text-muted">{savedReport.description}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="rounded-3xl border-[#ead9b8] bg-[#fffaf0]">
            <CardContent className="p-6">
              <Badge tone="caution" className="gap-1.5">
                <AlertTriangle aria-hidden="true" size={14} />
                Step 4 boundary
              </Badge>
              <h2 className="mt-4 font-display text-xl font-bold tracking-tight">This saves the report only.</h2>
              <p className="mt-3 text-sm leading-6 text-[#725019]">
                Emergency interruption, AI urgency analysis, complaint drafts, and public dashboard behavior are intentionally left for later milestones.
              </p>
            </CardContent>
          </Card>
        )}

        <Button asChild className="w-full" variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </aside>
    </div>
  );
}

function parseSavedReportsCount(snapshot: string) {
  try {
    const reports = JSON.parse(snapshot);
    return Array.isArray(reports) ? reports.length : 0;
  } catch {
    return 0;
  }
}

function FormField({
  children,
  error,
  helper,
  icon,
  label,
}: {
  children: React.ReactNode;
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
  label: string;
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-2 text-sm font-bold text-ink">
        {icon}
        {label}
      </span>
      <span className="mt-2 block">{children}</span>
      {helper ? <span className="mt-2 block text-xs leading-5 text-muted">{helper}</span> : null}
      {error ? <span className="mt-2 block text-xs font-semibold text-danger">{error}</span> : null}
    </label>
  );
}
