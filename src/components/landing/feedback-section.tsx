"use client";

import { MessageCircleHeart, Send } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function FeedbackSection() {
  const [message, setMessage] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  async function submitFeedback(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setStatus("");
    try {
      const response = await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message, replyTo }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Feedback could not be sent.");
      setMessage("");
      setReplyTo("");
      setStatus("Thank you — your feedback reached the CivicShield team.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Feedback could not be sent.");
    } finally {
      setSending(false);
    }
  }

  return <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8 lg:pb-20">
    <div className="overflow-hidden rounded-3xl border border-[#cfe6dd] bg-[#f4fbf8] shadow-sm lg:grid lg:grid-cols-[0.78fr_1.22fr]">
      <div className="border-b border-[#d9e9e2] p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10"><span className="grid size-11 place-items-center rounded-2xl bg-white text-brand shadow-sm"><MessageCircleHeart size={21} /></span><p className="mt-5 eyebrow">Help us improve</p><h2 className="mt-3 font-display text-3xl font-bold tracking-tight">Share feedback with the team.</h2><p className="mt-4 max-w-md leading-7 text-muted">Tell us what felt useful, confusing, or missing. Your message goes directly to the CivicShield project inbox.</p><p className="mt-5 text-sm font-semibold text-[#426058]">We read every message.</p></div>
      <form className="space-y-4 p-5 sm:p-8 lg:p-10" onSubmit={submitFeedback}>
        <label className="block"><span className="text-sm font-bold text-ink">Your feedback</span><textarea className="mt-2 min-h-36 w-full resize-y rounded-2xl border border-line bg-white px-4 py-3 text-base leading-6 outline-none transition hover:border-brand/50 focus:border-brand focus:ring-4 focus:ring-brand/10" value={message} onChange={(event) => setMessage(event.target.value)} maxLength={1500} minLength={8} required placeholder="What should CivicShield improve?" /></label>
        <label className="block"><span className="text-sm font-bold text-ink">Email for a reply <span className="font-normal text-muted">(optional)</span></span><input className="mt-2 h-12 w-full rounded-xl border border-line bg-white px-4 text-base outline-none transition hover:border-brand/50 focus:border-brand focus:ring-4 focus:ring-brand/10" type="email" value={replyTo} onChange={(event) => setReplyTo(event.target.value)} placeholder="you@example.com" /></label>
        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs leading-5 text-muted">Please do not include emergency or private information here.</p><Button className="w-full sm:w-auto" type="submit" disabled={sending}>{sending ? "Sending…" : <><Send size={16} /> Send feedback</>}</Button></div>
        {status ? <p className={`text-sm font-semibold ${status.startsWith("Thank") ? "text-brand" : "text-danger"}`} role="status">{status}</p> : null}
      </form>
    </div>
  </section>;
}
