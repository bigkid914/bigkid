import { defineField, defineType } from "sanity"
import { LinkInput } from "./LinkInput"
import { ExternalLink, FileSymlink, Link } from "lucide-react"

export const LINK_TYPES = [
  {
    title: "Internal",
    value: "internal",
    description: "Pages within Sanity",
    icon: FileSymlink,
  },
  {
    title: "External",
    value: "external",
    description: "URLs, Emails & Phone Numbers",
    icon: ExternalLink,
  },
]
export default defineType({
  name: "linkWithSelector",
  title: "Link",
  type: "object",
  icon: () => <Link strokeWidth={2} size={16} />,
  fields: [
    defineField({
      name: "type",
      type: "string",
      options: {
        list: LINK_TYPES.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      components: { input: LinkInput },
    }),
    defineField({
      name: "externalLink",
      type: "string",
      hidden: ({ parent, value }) =>
        !value && (parent?.type == "internal" || !parent.type),
    }),
    defineField({
      name: "reference",
      title: "Reference to Internal Page:",
      type: "reference",
      to: [{ type: "director" }],
      hidden: ({ parent, value }) =>
        !value && (parent?.type == "external" || !parent.type),
    }),
  ],
})
