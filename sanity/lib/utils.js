import createImageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/lib/api";

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || "",
  dataset: dataset || "",
});

export const urlForImage = (source) => {
  // Ensure that source image contains a valid reference
  if (!source?._id) {
    return undefined;
  }

  return imageBuilder?.image(source).auto("format").fit("max");
};

export function urlForOpenGraphImage(image) {
  return urlForImage(image)?.width(1200).height(627).fit("crop").url();
}

export function resolveHref(documentType, slug) {
  switch (documentType) {
    case "home":
      return "/";
    case "section":
      return "/";
    default:
      console.warn("Invalid document type:", documentType);
      return undefined;
  }
}
