import { sanityFetch } from "@/sanity/lib/live";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { generateStaticSlugs } from "@/sanity/plugins/generateStaticSlugs";
import { pageQuery } from "@/sanity/lib/queries";
import { NotFound } from "@/components/NotFound";
import { Projects } from "@/components/Projects";

export function generateStaticParams() {
  return generateStaticSlugs("page");
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: page } = await sanityFetch({
    query: pageQuery,
    params: {
      slug: slug,
    },
    stega: false,
  });

  const ogImage = resolveOpenGraphImage(page?.seo?.ogImage);
  return {
    title: page?.seo?.ogTitle || "Page",
    description: page?.seo?.ogDescription || "",
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function PageSlugRoute({ params }) {
  const { slug } = await params;
  const { data } = await sanityFetch({
    query: pageQuery,
    params: {
      slug: slug,
    },
  });
  

  if (!data) {
    return <NotFound />;
  }

  return <Projects data={data} />;
}
