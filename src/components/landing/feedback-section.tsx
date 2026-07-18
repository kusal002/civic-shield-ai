"use client";

import { Send } from "lucide-react";
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

  return <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
    <div className="rounded-3xl border border-[#cfe6dd] bg-[#f4fbf8] p-6 sm:p-8 lg:grid lg:grid-cols-[0.8fr_1.2fr] lg:gap-12 lg:p-10">
      <div><p className="eyebrow">Help us improve</p><h2 className="mt-3 font-display text-3xl font-bold tracking-tight">Share feedback with the team.</h2><p className="mt-4 max-w-md leading-7 text-muted">Tell us what felt useful, confusing, or missing. Your message goes directly to the CivicShield project inbox.</p></div>
      <form className="mt-7 space-y-3 lg:mt-0" onSubmit={submitFeedback}>
        <textarea className="min-h-32 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-brand" value={message} onChange={(event) => setMessage(event.target.value)} maxLength={1500} minLength={8} required placeholder="Your feedback…" />
        <div className="flex flex-col gap-3 sm:flex-row"><input className="h-11 flex-1 rounded-xl border border-line bg-white px-3 text-sm outline-none transition focus:border-brand" type="email" value={replyTo} onChange={(event) => setReplyTo(event.target.value)} placeholder="Your email (optional, for a reply)" /><Button type="submit" disabled={sending}>{sending ? "Sending…" : <><Send size={16} /> Send feedback</>}</Button></div>
        {status ? <p className={`text-sm font-semibold ${status.startsWith("Thank") ? "text-brand" : "text-danger"}`} role="status">{status}</p> : null}
      </form>
    </div>
  </section>;
}
