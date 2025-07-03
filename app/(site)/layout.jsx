import { draftMode } from "next/headers";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { VisualEditing } from "next-sanity";
import { Toaster } from "sonner";
import { handleError } from "@/app/client-utils";
import DraftModeToast from "@/components/DraftModeToast";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { settingsQuery } from "@/sanity/lib/queries";
import Splashscreen from "@/components/Splashscreen";

export const viewport = {
  themeColor: "#000",
};

export async function generateMetadata() {
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
    stega: false,
  });

  const ogImage = resolveOpenGraphImage(settings?.seo?.ogImage);
  return {
    title: {
      template: `%s — ${settings?.seo?.ogTitle}`,
      default:
        settings?.seo?.ogTitle || process.env.NEXT_PUBLIC_PROJECT_NAME || "",
    },
    description: settings?.seo?.ogDescription,
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function LayoutRoute(props) {
  const { isEnabled: isDraftMode } = await draftMode();
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
  });

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
      <Splashscreen data={settings} />
      <main
        className={
          "w-screen overflow-x-hidden px-4 pb-4 font-serif font-sm bg-white"
        }
      >
        {props.children}
      </main>
    </>
  );
}
