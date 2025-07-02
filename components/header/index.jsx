import { sanityFetch } from "@/sanity/lib/live";
import HeaderLayout from "./HeaderLayout";
import { headerQuery } from "@/sanity/lib/queries";

export async function Header() {
  const { data } = await sanityFetch({
    query: headerQuery,
  });

  return <HeaderLayout data={data} />;
}
