import { Icons } from "@/sanity/plugins/settings"
import {  defineField, defineType } from "sanity"

export default defineType({
  name: "settings",
  title: "Settings",
  type: "document",
  icon: () => Icons.settings,
  fields: [
    defineField({
      name: "globalTitle",
      type: "string",
      description: "Used as the title in search engine results.",
      validation: (Rule) =>
        Rule.required().error(`A Global Title is required.`),
    }),
    defineField({
      name: "globalOverview",
      type: "overview",
      validation: (Rule) =>
        Rule.required().error(`A Global Overview is required.`),
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph Image",
      type: "image",
      description: "Displayed on social cards and search engine results.",
      options: {
        hotspot: true,
      },
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
