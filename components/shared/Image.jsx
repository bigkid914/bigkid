'use client'
import { SanityImage } from "sanity-image";
import clsx from "clsx";
import { dataset, projectId } from "@/sanity/lib/api";

const GenerateImage = (props) => {
	const baseUrl = `https://cdn.sanity.io/images/${[projectId]}/${dataset}/`;
	return <SanityImage baseUrl={baseUrl} {...props} />;
};

export const Image = ({ id, hotspot, crop, alt = '', preview, sizes = '100vw', mode = 'contain', width = 1500, className, loading = "lazy" }) => {
	if (!id) {
		throw new Error("Image _id is undefined.")
	}
	return (
		<GenerateImage
			id={id}
			width={width}
			mode={mode}
			hotspot={hotspot}
			crop={crop}
			alt={alt}
			preview={preview}
			className={clsx('h-full w-full', className)}
			sizes={sizes}
			loading={loading}
		/>
	)
}
