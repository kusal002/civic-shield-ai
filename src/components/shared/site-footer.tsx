import { BriefcaseBusiness, Code2, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";

const team = [
  {
    name: "Dipayan Maji",
    email: "thedipayanmaji@gmail.com",
    github: "https://github.com/dipayanmaji",
    linkedin: "https://www.linkedin.com/in/dipayanmaji/",
  },
  {
    name: "Kusal Laik",
    email: "kushalkg0000@gmail.com",
    github: "https://github.com/kusal002",
    linkedin: "https://www.linkedin.com/in/kusal-laik-16742928a/",
  },
];

export function SiteFooter() {
  return <footer className="border-t border-line bg-[#f7fbf9] px-5 py-10 text-ink lg:px-8">
    <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-[1fr_auto]">
      <div>
        <Link href="/" className="inline-flex items-center gap-2 font-display text-lg font-bold">
          <span className="grid size-8 place-items-center rounded-lg bg-brand text-white"><ShieldCheck size={17} /></span>
          CivicShield AI
        </Link>
        <p className="mt-3 max-w-md text-sm leading-6 text-muted">A hackathon project for clearer civic reporting, transparent follow-up, and safety-first action.</p>
        <Link href="/moderator" className="mt-4 inline-flex rounded-lg text-sm font-bold text-brand underline underline-offset-4 hover:text-[#045548]">Moderator / admin sign in</Link>
      </div>
      <div className="space-y-5">
        {team.map((member) => <section key={member.email}>
          <p className="font-display font-bold">{member.name.split(" ")[0]}</p>
          <div className="mt-3 flex gap-2">
            <a className="grid size-9 place-items-center rounded-lg border border-line text-muted transition hover:border-brand hover:text-brand" href={`mailto:${member.email}`} aria-label={`Email ${member.name}`} title={`Email ${member.name}`}><Mail size={16} /></a>
            <a className="grid size-9 place-items-center rounded-lg border border-line text-muted transition hover:border-brand hover:text-brand" href={member.github} target="_blank" rel="noreferrer" aria-label={`${member.name} on GitHub`} title={`${member.name} on GitHub`}><Code2 size={16} /></a>
            <a className="grid size-9 place-items-center rounded-lg border border-line text-muted transition hover:border-brand hover:text-brand" href={member.linkedin} target="_blank" rel="noreferrer" aria-label={`${member.name} on LinkedIn`} title={`${member.name} on LinkedIn`}><BriefcaseBusiness size={16} /></a>
          </div>
        </section>)}
      </div>
    </div>
  </footer>;
}
