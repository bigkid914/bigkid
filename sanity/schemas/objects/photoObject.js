import { EyeOff, Image } from "lucide-react";
import React from "react";
import { defineArrayMember, defineField } from "sanity";

export default defineArrayMember({
  name: "photoObject",
  title: "Photos",
  type: "object",
  icon: <Image strokeWidth={2} size={16} />,
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
      type: "array",
      name: "photos",
      of: [
        {
          type: "image",
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "photos.0.asset",
      subtitle: "director.name",
    },
    prepare({ title, media, subtitle }) {
      return {
        title: title || "Photos",
        media: media || <EyeOff strokeWidth={1.5} size={25} />,
        subtitle,
      };
    },
  },
});
