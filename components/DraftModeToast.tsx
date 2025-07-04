"use client";

import { disableDraftMode } from "@/app/actions";
import { useDraftModeEnvironment, useIsPresentationTool } from "next-sanity/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { toast } from "sonner";

export default function DraftModeToast() {
  const isPresentationTool = useIsPresentationTool();
  const env = useDraftModeEnvironment();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (isPresentationTool === false) {
      /**
       * We delay the toast in case we're inside Presentation Tool
       */
      const toastId = toast("Draft Mode Enabled", {
        description:
          env === "live"
            ? "Content is live, refreshing automatically"
            : "Refresh manually to see changes",
        duration: Infinity,
        action: {
          label: "Disable",
          onClick: async () => {
            await disableDraftMode();
            startTransition(() => {
              router.refresh();
            });
          },
        },
      });
      return () => {
        toast.dismiss(toastId);
      };
    }
    return undefined;
  }, [env, router, isPresentationTool]);

  useEffect(() => {
    if (pending) {
      const toastId = toast.loading("Disabling draft mode...");
      return () => {
        toast.dismiss(toastId);
      };
    }
    return undefined;
  }, [pending]);

  return null;
}
