import { sanityFetch } from "@/sanity/lib/live";
import HeaderLayout from "./HeaderLayout";
import { settingsQuery } from "@/sanity/lib/queries";

export async function Header() {
  const { data } = await sanityFetch({
    query: settingsQuery,
  });

  return <HeaderLayout data={data} />;
}
