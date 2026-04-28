import { defineArrayMember, defineField } from "sanity";
import { VimeoSelector } from "@/sanity/schemas/custom/vimeo/VimeoSelector";

export default defineField({
	type: "object",
	name: "vimeoObject",
	fields: [
		defineField({
			name: "name",
			type: "string",
		}),
		defineField({
			name: "uri",
			type: "string",
		}),
		defineField({
			name: "width",
			type: "number",
		}),
		defineField({
			name: "height",
			type: "number",
		}),
		defineField({
			name: "link",
			type: "url",
		}),
		defineField({
			name: "duration",
			type: "number",
		}),
		defineField({
			name: "release_time",
			type: "datetime",
		}),
		defineField({
			name: "stats",
			type: "object",
			fields: [
				defineField({
					name: "plays",
					type: "number",
				}),
			],
		}),
		defineField({
			name: "pictures",
			type: "object",
			fields: [
				defineField({
					name: "base_link",
					type: "url",
				}),
			],
		}),
	],
	components: {
		input: VimeoSelector,
	},
});
