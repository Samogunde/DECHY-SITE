"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { captureLeadSource } from "@/lib/contact/lead-source";

/** Saves where the visit came from, so every form can send it with the lead. Renders nothing. */
export function LeadSourceCapture() {
  const pathname = usePathname();
  useEffect(() => {
    captureLeadSource();
  }, [pathname]);
  return null;
}
