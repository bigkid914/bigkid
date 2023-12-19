import { Icons } from "@/sanity/plugins/settings";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "home",
  title: "Home",
  type: "document",
  icon: () => Icons.home,
  fields: [
    defineField({
      name: "sectionOrder",
      description: "Add, remove and control the order of sections here.",
      type: "array",
      of: [
        defineArrayMember({
          title: "Reference",
          type: "reference",
          to: [
            {
              type: "section",
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "splashscreens",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          name: "splashscreen",
        }),
      ],
    }),
    defineField({
      name: "about",
      type: "basicBlock",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Home",
      };
    },
  },
});
