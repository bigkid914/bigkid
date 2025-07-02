import { Suspense } from "react";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { settingsQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import { Header } from "@/components/header";

export async function generateMetadata() {
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
    stega: false,
  });

  const ogImage = resolveOpenGraphImage(settings?.seo?.ogImage);
  return {
    title: {
      template: `%s — ${settings?.seo?.ogTitle}`,
      default: settings?.seo?.ogTitle || process.env.NEXT_PUBLIC_PROJECT_NAME || "",
    },
    description: settings?.seo?.ogDescription,
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function NotFound() {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main className={"min-h-[calc(100vh-170px)] w-screen overflow-x-hidden px-4 pb-4 font-serif font-sm bg-white"}>
        <div className={"absolute w-screen h-svh flex justify-center items-center"}>
          <h1>Not Found</h1>
        </div>
      </main>
    </>
  );
}
