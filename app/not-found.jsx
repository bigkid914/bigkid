import { Suspense } from "react";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { settingsQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import { Header } from "@/components/Header";
import { NotFound } from "@/components/NotFound";

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

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

export default async function NotFoundRoute() {
  return (
    <div className={"h-svh overflow-y-auto bg-white dark:bg-black dark:text-white"}>
      <Suspense>
        <Header />
      </Suspense>
      <main
        className={
          "min-h-[calc(100vh-170px)] w-screen overflow-x-hidden px-4 pb-4 font-serif font-sm"
        }
      >
        <NotFound />
      </main>
    </div>
  );
}
