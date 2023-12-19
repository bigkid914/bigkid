export async function POST(req) {
	const query = await req.json();
	const params = query.params ? query.params : ""
	const res = await fetch(`https://api.vimeo.com/me/videos?${params}`, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `bearer ${process.env.VIMEO_API_KEY}`,
		},
	});
	const data = await res.json();

	return Response.json({ data });
}

export const revalidate = 60;
