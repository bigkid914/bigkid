import { sanityFetch } from "@/sanity/lib/live";
import { indexQuery } from "@/sanity/lib/queries";
import { NotFound } from "@/components/NotFound";
import { Projects } from "@/components/Projects";

export default async function IndexRoute() {
  const { data } = await sanityFetch({
    query: indexQuery,
  });

  if (!data) {
    return <NotFound />;
  }

  const projects = data.sectionOrder.flatMap((section) => section.projects);

  return <Projects data={{ projects }} />;
}
