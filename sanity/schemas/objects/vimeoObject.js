import { defineField } from "sanity";
import { VimeoSelector } from "@/sanity/schemas/custom/vimeo/VimeoSelector";

export default defineField({
	type: "object",
	name: "vimeoObject",
	fields: [
		defineField({
			name: "name",
			type: "string",
		}),
	],
	components: {
		input: VimeoSelector,
	},
});
