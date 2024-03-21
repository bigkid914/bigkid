import { EyeOff, Film } from "lucide-react";
import React from "react";
import { defineArrayMember, defineField } from "sanity";

export default defineArrayMember({
  name: "projectObject",
  title: "Video",
  icon: <Film strokeWidth={2} size={16} />,
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
});
