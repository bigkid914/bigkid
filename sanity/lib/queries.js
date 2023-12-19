import { groq } from "next-sanity";
import { contentFragment, imageFragment } from "./fragments";

export const settingsQuery = groq`
  *[_type == "settings"][0]{
    globalTitle,
    globalOverview,
    ogImage,
  }
`;

export const homePageQuery = groq`
  *[_type == "home"][0]{
    _id,
    "sections": sectionOrder[] -> {
      _id,
      title,
      projects[] {
        _key,
        title,
        "previewVideo": preview.files[quality match "hls"][0].link,
	      "fullVideo": fullVideo.files[quality match "hls"][0].link,
        "previewWidth": preview.width,
        "previewHeight": preview.height,
        "fullWidth": fullVideo.width,
        "fullHeight": fullVideo.height,
        "size": fullVideo.files[] | order(size desc)[0].size,
        "date": fullVideo.release_time,
        "fps": fullVideo.files[quality match "hls"][0].fps
      }
    },
    about[],
    splashscreens[]{
        _key,
        ${imageFragment}
      }
  }
`;
