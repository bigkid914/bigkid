import { HomePage } from "@/components/pages/home/HomePage";
import { notFound } from "next/navigation";
import { homePageQuery, settingsQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";

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

export default async function IndexRoute({ searchParams }) {
  const currSearchParams = await searchParams;
  const filters = currSearchParams?.filters?.split(",") || [];

  const { data } = await sanityFetch({
    query: homePageQuery,
    params: { filters },
  });

  if (!data) {
    return notFound();
  }

  return <HomePage data={data} />;
}
