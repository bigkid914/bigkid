'use client'
import { SanityImage } from "sanity-image";
import clsx from "clsx";
import { dataset, projectId } from "@/sanity/lib/api";

const GenerateImage = (props) => {
	const baseUrl = `https://cdn.sanity.io/images/${[projectId]}/${dataset}/`;
	return <SanityImage baseUrl={baseUrl} {...props} />;
};

export const Image = ({ _id, hotspot, crop, alt = '', preview, sizes = '100vw', mode = 'contain', width = 1500, className, loading = "lazy", dataSanity }) => {
	if (!_id) {
		throw new Error("Image _id is undefined.")
	}
	return (
		<GenerateImage
			id={_id}
			width={width}
			mode={mode}
			hotspot={hotspot}
			crop={crop}
			alt={alt}
			preview={preview}
			className={clsx('w-full', className)}
			sizes={sizes}
			loading={loading}
			data-sanity={dataSanity}
		/>
	)
}
