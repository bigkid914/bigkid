import {  defineField, defineType } from "sanity"

export default defineType({
  name: "settings",
  title: "Settings",
  type: "document",
  fields: [
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
        defineField({
          name: "metadataBase",
          type: "url",
          description: (
            <a
              href="https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase"
              rel="noreferrer noopener"
            >
              More information
            </a>
          ),
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Settings",
      }
    },
  },
})
