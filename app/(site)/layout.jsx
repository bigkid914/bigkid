import { draftMode } from "next/headers";
import { Suspense } from "react";
import { Header } from "@/components/header";
import { SanityLive } from "@/sanity/lib/live";
import { VisualEditing } from "next-sanity";
import { Toaster } from "sonner";
import { handleError } from "@/app/client-utils";
import DraftModeToast from "@/components/shared/DraftModeToast";

export const viewport = {
  themeColor: "#000",
};

export default async function LayoutRoute(props) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <>
      <Toaster />
      {isDraftMode && (
        <>
          <DraftModeToast />
          <VisualEditing />
        </>
      )}
      <SanityLive onError={handleError} />
      <Suspense>
        <Header />
      </Suspense>
      <main
        className={
          "min-h-[calc(100vh-170px)] w-screen overflow-x-hidden px-4 pb-4 font-serif font-sm bg-white"
        }
      >
        {props.children}
      </main>
    </>
  );
}
