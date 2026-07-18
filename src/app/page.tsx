import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileText,
  MapPin,
  PhoneCall,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const civicSteps = [
  {
    number: "01",
    title: "Describe what happened",
    detail: "Use your own words. We turn the details into a structured civic report.",
  },
  {
    number: "02",
    title: "Understand the risk",
    detail: "See issue category, urgency, and practical safety-first next steps.",
  },
  {
    number: "03",
    title: "Create accountable action",
    detail: "Review a department-ready complaint and follow the report’s resolution status.",
  },
];

export default function Home() {
  return (
    <main className="overflow-hidden bg-canvas text-ink">
      <div className="border-b border-[#d9e6e1] bg-[#eff7f4] px-4 py-2.5 text-center text-xs font-medium text-[#31544b] sm:text-sm">
        In immediate danger? Call India&apos;s unified emergency number
        <a className="ml-1.5 font-bold text-brand underline underline-offset-4" href="tel:112">
          112
        </a>
      </div>

      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <Link className="flex items-center gap-2.5" href="/" aria-label="CivicShield AI home">
          <span className="grid size-10 place-items-center rounded-xl bg-brand text-white shadow-sm">
            <ShieldCheck aria-hidden="true" size={21} strokeWidth={2.4} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">CivicShield AI</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-muted md:flex" aria-label="Main navigation">
          <a className="transition-colors hover:text-brand" href="#services">
            Services
          </a>
          <a className="transition-colors hover:text-brand" href="#how-it-works">
            How it works
          </a>
          <a className="transition-colors hover:text-brand" href="#trust">
            Why CivicShield
          </a>
        </nav>

        <Button asChild className="hidden sm:inline-flex" size="sm">
          <Link href="/report">Start a report</Link>
        </Button>
      </header>

      <section className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-12 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-28 lg:pt-20">
        <div className="relative z-10 max-w-2xl">
          <Badge className="gap-1.5" tone="safe">
            <Sparkles aria-hidden="true" size={13} />
            AI-assisted civic action
          </Badge>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.03] tracking-[-0.045em] text-ink sm:text-6xl lg:text-7xl">
            Make public problems
            <span className="block text-brand">actionable.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted sm:text-xl">
            CivicShield turns an unclear local problem into a clear report, safer next steps, and an accountable path to resolution.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/report">
                Report a civic issue <ArrowRight aria-hidden="true" size={18} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/emergency">
                <Siren aria-hidden="true" size={18} /> I need emergency help
              </Link>
            </Button>
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted">
            <CheckCircle2 aria-hidden="true" className="text-brand" size={16} />
            Clear guidance. Citizen-approved action. No false closure claims.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:pt-3">
          <div className="absolute -right-16 top-14 -z-10 size-56 rounded-full bg-[#d9f1e8] blur-3xl" />
          <Card className="relative overflow-hidden rounded-[1.75rem] border-white/80 shadow-surface">
            <div className="border-b border-line bg-[#fbfdfc] px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">Civic safety brief</p>
                  <h2 className="mt-2 font-display text-xl font-bold tracking-tight">Waterlogging near Market Road</h2>
                </div>
                <Badge tone="urgent">High urgency</Badge>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-sm text-muted">
                <MapPin aria-hidden="true" size={15} /> Central Market, Ward 14
              </div>
            </div>
            <CardContent className="space-y-5 p-6">
              <div className="rounded-2xl border border-[#cbe8dd] bg-[#effaf5] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand">Safety recommendation</p>
                <p className="mt-2 text-sm leading-6 text-[#31544b]">
                  Avoid standing water near exposed electrical infrastructure. Keep pedestrians away and report the location immediately.
                </p>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-4 text-sm">
                <ClipboardCheck aria-hidden="true" className="text-brand" size={18} />
                <div>
                  <p className="font-semibold">Structured report created</p>
                  <p className="mt-0.5 text-muted">Category, urgency, and location captured.</p>
                </div>
                <FileText aria-hidden="true" className="text-brand" size={18} />
                <div>
                  <p className="font-semibold">Complaint ready for review</p>
                  <p className="mt-0.5 text-muted">The citizen approves before anything is sent.</p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-line pt-4 text-sm font-medium">
                <span className="text-muted">Resolution status</span>
                <span className="flex items-center gap-1 text-brand">Under review <ChevronRight size={15} /></span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="services" className="border-y border-line bg-surface/70 px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="eyebrow">Choose the right path</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">Two services. One safety-first principle.</h2>
            <p className="mt-4 text-lg leading-8 text-muted">
              Select the path that matches your situation. CivicShield makes the difference clear from the first screen.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <ServiceCard
              href="/report"
              icon={<MapPin aria-hidden="true" size={25} />}
              label="For a civic issue"
              title="Report a problem that needs attention"
              description="For sanitation, roads, drainage, streetlights, water leakage, unsafe public spaces, and infrastructure concerns."
              action="Start a civic report"
              points={["AI-assisted issue classification", "Formal complaint draft", "Transparent resolution tracking"]}
              tone="civic"
            />
            <ServiceCard
              href="/emergency"
              icon={<ShieldAlert aria-hidden="true" size={25} />}
              label="For immediate danger"
              title="Get emergency help without delay"
              description="For fire, serious injury, exposed live wiring, collapse, violence, or any situation where safety is at immediate risk."
              action="Open emergency help"
              points={["Call 112 is always the first action", "Instant safety checklist", "Optional follow-up hazard report"]}
              tone="emergency"
            />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            <p className="eyebrow">How it works</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">From observation to accountable action.</h2>
          </div>
          <p className="max-w-xl text-lg leading-8 text-muted">
            No complicated department forms. Begin with what you saw, then review every important action before it happens.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {civicSteps.map((step) => (
            <article key={step.number} className="rounded-2xl border border-line bg-surface p-6">
              <span className="font-display text-sm font-bold text-brand">{step.number}</span>
              <h3 className="mt-9 font-display text-xl font-bold tracking-tight">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{step.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="trust" className="mx-5 mb-20 rounded-[2rem] bg-[#133a33] px-6 py-10 text-white sm:mx-8 sm:px-10 lg:mx-auto lg:max-w-7xl lg:px-14 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#9ed8c6]">Built for honest accountability</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">A case is not “solved” just because someone says it is.</h2>
            <p className="mt-4 text-base leading-7 text-[#c6ddd6]">
              CivicShield separates an authority&apos;s closure update from community verification—so citizens can confirm, dispute, or reopen a report based on what actually happened on the ground.
            </p>
          </div>
          <div className="flex min-w-[13rem] items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4">
            <span className="grid size-10 place-items-center rounded-xl bg-[#a7e4d1] text-[#0a4c40]">
              <CheckCircle2 aria-hidden="true" size={21} />
            </span>
            <div>
              <p className="text-sm font-semibold">Community verified</p>
              <p className="mt-0.5 text-xs text-[#c6ddd6]">The standard for resolution</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-line px-5 py-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-semibold text-ink">
            <ShieldCheck aria-hidden="true" className="text-brand" size={18} /> CivicShield AI
          </div>
          <p>General guidance only. In immediate danger, call 112.</p>
        </div>
      </footer>
    </main>
  );
}

function ServiceCard({
  href,
  icon,
  label,
  title,
  description,
  action,
  points,
  tone,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  title: string;
  description: string;
  action: string;
  points: string[];
  tone: "civic" | "emergency";
}) {
  const isEmergency = tone === "emergency";

  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border p-7 transition duration-300 hover:-translate-y-1 hover:shadow-surface sm:p-8 ${
        isEmergency ? "border-[#efd5cf] bg-[#fffaf8]" : "border-[#cfe6dd] bg-[#f8fdfb]"
      }`}
    >
      <div className={`grid size-12 place-items-center rounded-2xl ${isEmergency ? "bg-[#ffe5de] text-danger" : "bg-brand-soft text-brand"}`}>
        {icon}
      </div>
      <p className={`mt-7 text-xs font-bold uppercase tracking-[0.12em] ${isEmergency ? "text-danger" : "text-brand"}`}>{label}</p>
      <h3 className="mt-2 max-w-md font-display text-2xl font-bold tracking-tight">{title}</h3>
      <p className="mt-3 max-w-xl leading-7 text-muted">{description}</p>
      <ul className="mt-6 space-y-2.5 text-sm text-[#426058]">
        {points.map((point) => (
          <li key={point} className="flex items-center gap-2">
            <CheckCircle2 aria-hidden="true" className={isEmergency ? "text-danger" : "text-brand"} size={16} />
            {point}
          </li>
        ))}
      </ul>
      <Button asChild className="mt-8" variant={isEmergency ? "danger" : "primary"}>
        <Link href={href}>
          {isEmergency && <PhoneCall aria-hidden="true" size={16} />}
          {action} <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </Button>
    </article>
  );
}
