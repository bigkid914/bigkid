import {  defineField, defineType } from "sanity";

async function isSlugUnique(slug, context) {
    const { document, getClient } = context;
    const client = getClient({ apiVersion: "2022-12-07" });
    const id = document._id.replace(/^drafts\./, "");
    const params = {
      draft: `drafts.${id}`,
      published: id,
      slug,
    };
    const query = `!defined(*[!(_id in [$draft, $published]) && slug.current == $slug && _type == "director"][0]._id)`;
    const result = await client.fetch(query, params);
    return result;
  }

export default defineType({
  type: "document",
  name: "director",
  title: "Director",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
        name: "slug",
        type: "slug",
        options: {
          source: "name",
          isUnique: isSlugUnique,
        },
        validation: (rule) => rule.required(),
      }),
  ],
  preview: {
    select: {
      title: "name",
    },
    prepare({ title }) {
      return {
        title: title || "Director",
      };
    },
  },
});
