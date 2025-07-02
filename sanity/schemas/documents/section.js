import { defineArrayMember, defineField, defineType } from "sanity";

async function isSlugUnique(slug, context) {
  const { document, getClient } = context;
  const client = getClient({ apiVersion: "2022-12-07" });
  const id = document._id.replace(/^drafts\./, "");
  const params = {
    draft: `drafts.${id}`,
    published: id,
    slug,
  };
  const query = `!defined(*[!(_id in [$draft, $published]) && slug.current == $slug && _type == "section"][0]._id)`;
  const result = await client.fetch(query, params);
  return result;
}

export default defineType({
  type: "document",
  name: "section",
  title: "Section",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
        slugify: (input) => input.toLowerCase().replace(/\s+/g, "-"),
        isUnique: isSlugUnique,

      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: "array",
      name: "projects",
      of: [
        defineArrayMember({
          name: "projectObject",
          title: "Video",
          type: "object",
          fieldsets: [
            {
              name: "video",
              title: "Video",
              options: {
                columns: 2,
              },
            },
          ],
          fields: [
            defineField({
              name: "title",
              type: "string",
            }),
            defineField({
              name: "director",
              type: "reference",
              to: [{ type: "director" }],
            }),
            defineField({
              name: "preview",
              type: "vimeoObject",
              fieldset: "video",
            }),
            defineField({
              name: "fullVideo",
              type: "vimeoObject",
              fieldset: "video",
            }),
          ],
          preview: {
            select: {
              title: "title",
              media: "fullVideo",
              subtitle: "director.name"
            },
            prepare({ title, media, subtitle}) {
              return {
                title: title || "Project",
                media: media?.pictures?.base_link ? (
                  <img src={media.pictures.base_link} alt={title} style={{width: "100%", height: "100%", objectFit: "cover"}}/>
                ) : (
                  <EyeOff strokeWidth={1.5} size={25} />
                ),
                subtitle
              };
            },
          },
        })
        // {
        //   type: "photoObject",
        // },
      ],
    }),
    defineField({
      type: "object",
      name: "seo",
      title: "SEO",
      fields: [
        defineField({
          name: "ogTitle",
          title: "Open Graph Title",
          type: "string",
          description: "Displayed as the title in search engine results.",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "ogDescription",
          title: "Open Graph Description",
          type: "text",
          rows: 3,
          description: "Displayed as the description in search engine results.",
          validation: (Rule) => [
            Rule.required().warning(`Your page will use the default overview in Settings.`),
            Rule.min(50).warning(`Your overview should be a minimum of 50 characters.`),
            Rule.max(155).warning(`Your overview should be a max of 155 characters.`),
          ],
        }),
        defineField({
          name: "ogImage",
          title: "Open Graph Image",
          type: "image",
          description:
            "Displayed on social cards and in search engine results. Will be cropped to 1.91:1/1200x627px.",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: title || "Section",
      };
    },
  },
});
