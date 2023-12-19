import { defineField } from "sanity";

export default defineField({
	name: "overview",
	type: "text",
	rows: 3,
	description: "Used as the description in search engine results.",
	validation: (Rule) => [
		Rule.required().warning(`Your page will use the default overview in Settings.`),
		Rule.min(50).warning(`Your overview should be a minimum of 50 characters.`),
		Rule.max(155).warning(`Your overview should be a max of 155 characters.`),
	],
});