import { defineField, defineType } from "sanity";

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
      type: "array",
      name: "projects",
      of: [
        {
          type: "projectObject",
        },
        // {
        //   type: "photoObject",
        // },
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
