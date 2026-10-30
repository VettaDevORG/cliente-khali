"use client";

import Link from "next/link";
import { useId, useState } from "react";
import Icon from "./Icon";
import { track } from "./Analytics";
import { buttonVariants } from "./ui";
import type { Strings } from "@/lib/strings";

/** Netlify Forms. The static twin of this form lives in public/__forms.html so Netlify registers it at deploy time. */
export const FORM_NAME = "contacto";

export default function ContactForm({
  t,
  services,
  whatsappHref,
  email,
  healthData,
}: {
  t: Strings["contact"];
  services: string[];
  whatsappHref: string;
  email: string;
  healthData: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  // Unique ids so the form can appear more than once on a page (the catalog renders every variant).
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const body = new URLSearchParams();
    body.append("form-name", FORM_NAME);
    for (const key of ["nombre", "contacto", "servicio", "mensaje", "bot-field"]) body.append(key, String(data.get(key) ?? ""));
    body.append("pagina", window.location.pathname);
    setStatus("sending");
    try {
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (res.ok) {
        setStatus("ok");
        track("form_submit", { service: String(data.get("servicio") ?? "") });
      } else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-card bg-surface p-8 text-center ring-1 ring-line shadow-card" role="status">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary-text">
          <Icon name="check" className="h-6 w-6" strokeWidth={3} />
        </span>
        <p className="mt-4 text-xl font-bold">{t.successTitle}</p>
        <p className="mt-2 text-ink-2">{t.successText}</p>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={`${buttonVariants.whatsapp} mt-5`}>
          <Icon name="whatsapp" className="h-5 w-5" />
          WhatsApp
        </a>
      </div>
    );
  }

  const input =
    "w-full rounded-[calc(var(--kit-radius-card)*0.6)] border border-line bg-white px-4 py-3 text-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-primary focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--brand-primary)_18%,transparent)]";
  const label = "mb-1.5 block text-sm font-semibold";

  return (
    <form name={FORM_NAME} method="POST" onSubmit={onSubmit} className="space-y-5 rounded-card bg-surface p-6 ring-1 ring-line shadow-card sm:p-8">
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <p className="hidden">
        <label>
          No rellenes esto: <input name="bot-field" />
        </label>
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={id("nombre")} className={label}>
            {t.name}
          </label>
          <input id={id("nombre")} name="nombre" required autoComplete="name" className={input} />
        </div>
        <div>
          <label htmlFor={id("contacto")} className={label}>
            {t.contactField}
          </label>
          <input id={id("contacto")} name="contacto" required placeholder={t.contactPlaceholder} autoComplete="tel email" className={input} />
        </div>
      </div>
      {services.length > 0 && (
        <div>
          <label htmlFor={id("servicio")} className={label}>
            {t.service}
          </label>
          <select id={id("servicio")} name="servicio" className={input} defaultValue="">
            <option value="">—</option>
            {services.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
            <option value={t.serviceOther}>{t.serviceOther}</option>
          </select>
        </div>
      )}
      <div>
        <label htmlFor={id("mensaje")} className={label}>
          {t.message}
        </label>
        <textarea id={id("mensaje")} name="mensaje" rows={4} placeholder={t.messagePlaceholder} className={input} />
        {healthData && <p className="mt-2 text-xs text-ink-3">{t.healthWarning}</p>}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" disabled={status === "sending"} className={`${buttonVariants.primary} disabled:opacity-60`}>
          {status === "sending" ? t.sending : t.submit}
          <Icon name="arrow" className="h-5 w-5" />
        </button>
        <p className="text-xs text-ink-3">
          {t.privacy}{" "}
          <Link href="/privacidad" className="underline underline-offset-4">
            {t.privacyLink}
          </Link>
        </p>
      </div>
      {status === "error" && (
        <p className="rounded-card bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {t.errorText}{" "}
          <a href={`mailto:${email}`} className="font-semibold underline">
            {email}
          </a>
          .
        </p>
      )}
    </form>
  );
}
