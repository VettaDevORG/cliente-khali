"use client";

import { useState } from "react";
import Icon from "./Icon";
import { track } from "./Analytics";
import { buttonVariants } from "./ui";

/**
 * Address card that loads the Google Maps iframe only when the visitor asks for it.
 * No API key, no third-party request and no cookie until the click.
 */
export default function MapOnClick({
  embedUrl,
  directionsUrl,
  address,
  labels,
}: {
  embedUrl: string;
  directionsUrl: string;
  address: string;
  labels: { seeMap: string; directions: string };
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-card ring-1 ring-line">
      {open ? (
        <iframe
          src={embedUrl}
          title={`Mapa: ${address}`}
          className="block h-72 w-full border-0 sm:h-80"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="flex h-72 flex-col items-center justify-center gap-4 bg-primary-light px-6 text-center sm:h-80">
          <Icon name="pin" className="h-8 w-8 text-primary-text" />
          <p className="max-w-sm text-sm text-ink-2">{address}</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setOpen(true);
                track("map_open", { place: "map" });
              }}
              className={`${buttonVariants.primary} !min-h-11 !px-5 text-sm`}
            >
              {labels.seeMap}
            </button>
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className={`${buttonVariants.light} !min-h-11 !px-5 text-sm`}>
              {labels.directions}
              <Icon name="external" className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
