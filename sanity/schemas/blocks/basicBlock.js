import { defineField, defineArrayMember } from "sanity";

export default defineField({
  name: "basicBlock",
  title: "Text",
  type: "array",
  of: [
    defineArrayMember({
      lists: [],
      marks: {
        annotations: [{ type: "linkWithSelector" }],
        decorators: [],
      },
      styles: [{ title: "Normal", value: "normal" }],
      type: "block",
    }),
  ],
});
