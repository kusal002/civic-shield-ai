"use client";
/* eslint-disable @next/next/no-img-element */

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Clock3, FileText, Info, MapPin, ShieldCheck, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LocationPicker } from "@/components/report/location-picker";
import { LiveCapture } from "@/components/report/live-capture";
import { saveLocalAttachments } from "@/lib/storage/attachments";
import { getLocalReportsSnapshot, saveLocalReport, subscribeToLocalReports } from "@/lib/storage/reports";
import type { CivicAttachment, IncidentLocation } from "@/types/report";

const reportSchema = z.object({
  description: z.string().trim().min(20, "Describe the problem in at least 20 characters.").max(900, "Keep the description under 900 characters for now."),
  location: z.string().trim().min(6, "Confirm a useful location or landmark.").max(180),
  duration: z.string().trim().min(2, "Add when this started or how long it has continued.").max(120),
  affectedPeople: z.string().trim().refine((value) => !value || /^[1-9]\d*$/.test(value), "Enter a whole number greater than zero, or leave this blank.").optional(),
  extraDetails: z.string().trim().max(360).optional(),
});

type ReportFormValues = z.infer<typeof reportSchema>;
type MediaPreview = { file: File; url: string; kind: "image" | "video" };

const defaultValues: ReportFormValues = { description: "", location: "", duration: "", affectedPeople: "", extraDetails: "" };

export function CivicReportForm() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<IncidentLocation | undefined>();
  const [media, setMedia] = useState<MediaPreview[]>([]);
  const [submissionError, setSubmissionError] = useState("");
  const reportsSnapshot = useSyncExternalStore(subscribeToLocalReports, getLocalReportsSnapshot, () => "[]");
  const savedReportsCount = parseSavedReportsCount(reportsSnapshot);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReportFormValues>({ resolver: zodResolver(reportSchema), defaultValues });

  useEffect(() => () => media.forEach((item) => URL.revokeObjectURL(item.url)), [media]);

  function updateLocation(location: IncidentLocation) {
    setSelectedLocation(location);
    setValue("location", location.label, { shouldValidate: true });
  }

  function addMedia(files: FileList | File[] | null) {
    if (!files) return;
    const nextMedia = Array.from(files)
      .filter((file) => file.type.startsWith("image/") || file.type.startsWith("video/"))
      .slice(0, 4)
      .map((file) => ({ file, url: URL.createObjectURL(file), kind: file.type.startsWith("video/") ? "video" as const : "image" as const }));
    setMedia((current) => [...current, ...nextMedia].slice(0, 4));
  }

  function addCapturedMedia(file: File) { addMedia([file]); }

  function removeMedia(url: string) {
    setMedia((current) => {
      const removed = current.find((item) => item.url === url);
      if (removed) URL.revokeObjectURL(removed.url);
      return current.filter((item) => item.url !== url);
    });
  }

  async function onSubmit(values: ReportFormValues) {
    if (!selectedLocation) {
      setError("location", { message: "Search, use current location, or pin the incident on the map before continuing." });
      return;
    }
    setSubmissionError("");
    const attachments: CivicAttachment[] = media.map(({ file, kind }, index) => ({
      id: `ATT-${Date.now()}-${index}`,
      name: file.name,
      type: file.type,
      size: file.size,
      kind,
    }));
    let reportId: string;
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report: { ...values, incidentLocation: selectedLocation, attachments } }),
      });
      const result = await response.json() as { reportId?: string; error?: string };
      if (!response.ok || !result.reportId) throw new Error(result.error ?? "The report could not be saved.");
      reportId = result.reportId;
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : "The report could not be saved. Please try again.");
      return;
    }
    const report = saveLocalReport({ ...values, id: reportId, incidentLocation: selectedLocation, attachments });
    try {
      await saveLocalAttachments(report.id, media.map(({ file }) => file), attachments);
    } catch {
      // The report remains usable even where IndexedDB is not available.
    }
    router.push(`/analysis/${report.id}`);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_23rem] lg:items-start">
      <Card className="overflow-hidden rounded-3xl">
        <CardHeader className="border-b border-line bg-[#fbfdfc] p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="eyebrow">Civic issue reporter</p>
              <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">Tell us what happened.</h1>
              <p className="mt-3 max-w-2xl leading-7 text-muted">Describe the issue, confirm the exact place, and add evidence before CivicShield prepares the next steps.</p>
            </div>
            <Badge tone="safe" className="w-fit gap-1.5"><ShieldCheck aria-hidden="true" size={14} /> Local-first MVP</Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <FormField error={errors.description?.message} helper="Example: The road near Central Market is waterlogged and an exposed wire is lying beside the footpath." label="What happened? Describe the problem in your own words.">
              <textarea className="min-h-40 w-full resize-y rounded-2xl border border-line bg-white px-4 py-3 text-base leading-7 text-ink shadow-sm transition focus:border-brand focus:outline-none" placeholder="Describe the issue, visible risk, and anything people nearby should know." {...register("description")} />
            </FormField>

            <LocationPicker error={errors.location?.message} value={selectedLocation} onChange={updateLocation} />

            <div className="grid gap-5 md:grid-cols-2">
              <FormField error={errors.duration?.message} icon={<Clock3 aria-hidden="true" size={16} />} label="Time or duration">
                <input className="h-12 w-full rounded-2xl border border-line bg-white px-4 text-sm text-ink shadow-sm transition focus:border-brand focus:outline-none" placeholder="Since morning, 3 days, after heavy rain..." {...register("duration")} />
              </FormField>
              <FormField error={errors.affectedPeople?.message} helper="Optional. We include this in the department email only when a number is provided." label="Number of people affected">
                <input className="h-12 w-full rounded-2xl border border-line bg-white px-4 text-sm text-ink shadow-sm transition focus:border-brand focus:outline-none" inputMode="numeric" min="1" placeholder="Example: 25" type="number" {...register("affectedPeople")} />
              </FormField>
            </div>

            <section className="rounded-2xl border border-line bg-[#fbfdfc] p-4 sm:p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-ink">Attach visual evidence</p>
                  <p className="mt-1 text-xs leading-5 text-muted">Add up to four images or videos. On supported phones, capture media live from the camera.</p>
                </div>
                <span className="text-xs font-semibold text-muted">{media.length}/4 selected</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-line bg-white px-3 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand">
                  <Upload aria-hidden="true" size={16} /> Choose image or video
                  <input className="sr-only" type="file" accept="image/*,video/*" multiple onChange={(event) => addMedia(event.target.files)} />
                </label>
                <LiveCapture onCapture={addCapturedMedia} />
              </div>
              {media.length ? <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {media.map((item) => <div key={item.url} className="group relative overflow-hidden rounded-xl border border-line bg-white">
                  {item.kind === "image" ? <img src={item.url} alt={item.file.name} className="aspect-square w-full object-cover" /> : <video src={item.url} className="aspect-square w-full object-cover" controls preload="metadata" />}
                  <button className="absolute right-1 top-1 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100" type="button" onClick={() => removeMedia(item.url)}>Remove</button>
                  <p className="truncate px-2 py-1.5 text-xs text-muted">{item.file.name}</p>
                </div>)}
              </div> : null}
            </section>

            <FormField error={errors.extraDetails?.message} label="Extra details">
              <textarea className="min-h-28 w-full resize-y rounded-2xl border border-line bg-white px-4 py-3 text-sm leading-6 text-ink shadow-sm transition focus:border-brand focus:outline-none" placeholder="Add nearby hazards, access notes, or repeated history. Avoid private personal details." {...register("extraDetails")} />
            </FormField>

            <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex gap-2 text-sm leading-6 text-muted"><Info aria-hidden="true" className="mt-1 shrink-0 text-brand" size={16} /> The report is saved for public status tracking; evidence stays on this device for now. Do not include private IDs or personal contact details.</p>
              <Button className="shrink-0" disabled={isSubmitting} size="lg" type="submit"><FileText aria-hidden="true" size={18} /> Analyze and prepare report</Button>
            </div>
            {submissionError ? <p className="rounded-xl border border-[#efbdb6] bg-[#fff4f1] px-4 py-3 text-sm font-medium text-danger" role="alert">{submissionError}</p> : null}
          </form>
        </CardContent>
      </Card>

      <aside className="space-y-5">
        <Card className="rounded-3xl"><CardContent className="p-6"><div className="flex items-center justify-between gap-4"><div><p className="eyebrow">Saved locally</p><p className="mt-2 font-display text-3xl font-bold">{savedReportsCount}</p></div><span className="grid size-11 place-items-center rounded-2xl bg-brand-soft text-brand"><FileText aria-hidden="true" size={21} /></span></div><p className="mt-4 text-sm leading-6 text-muted">Your report is stored in this browser before an AI result is generated.</p></CardContent></Card>
        <Card className="rounded-3xl border-[#ead9b8] bg-[#fffaf0]"><CardContent className="p-6"><Badge tone="caution" className="gap-1.5"><AlertTriangle aria-hidden="true" size={14} /> Safety note</Badge><h2 className="mt-4 font-display text-xl font-bold tracking-tight">Immediate danger needs a call first.</h2><p className="mt-3 text-sm leading-6 text-[#725019]">If there is fire, injury, collapse, or a live electrical danger, use emergency help and call 112—do not wait for this form.</p></CardContent></Card>
        <Button asChild className="w-full" variant="outline"><Link href="/"><MapPin aria-hidden="true" size={16} /> Back to home</Link></Button>
      </aside>
    </div>
  );
}

function parseSavedReportsCount(snapshot: string) {
  try { const reports = JSON.parse(snapshot); return Array.isArray(reports) ? reports.length : 0; } catch { return 0; }
}

function FormField({ children, error, helper, icon, label }: { children: React.ReactNode; error?: string; helper?: string; icon?: React.ReactNode; label: string }) {
  return <label className="block"><span className="flex items-center gap-2 text-sm font-bold text-ink">{icon}{label}</span><span className="mt-2 block">{children}</span>{helper ? <span className="mt-2 block text-xs leading-5 text-muted">{helper}</span> : null}{error ? <span className="mt-2 block text-xs font-semibold text-danger">{error}</span> : null}</label>;
}
