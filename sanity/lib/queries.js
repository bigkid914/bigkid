import { groq } from "next-sanity";
import { contentFragment, imageFragment } from "./fragments";

export const settingsQuery = groq`
  *[_type == "settings"][0]{
    globalTitle,
    globalOverview,
    ogImage,
  }
`;

export const headerQuery = groq`
  {

    "about":*[_type == "home"][0].about[],
    "globalTitle": *[_type == "settings"][0].globalTitle
  }
`;

export const homePageQuery = groq`
  *[_type == "home"][0]{
    _id,
    "sections": sectionOrder[] -> {
      _id,
      title,
      count($filters) > 0 => {
        "projects": projects[director->slug.current in $filters && defined(preview.files[quality match "hls"][0].link) && _type == "photoObject" || defined(fullVideo.files[quality match "hls"][0].link)] {
          _key,
          title,
          _type,
          "director": director->name,
          "previewVideo": preview.files[quality match "hls"][0].link,
          "fullVideo": fullVideo.files[quality match "hls"][0].link,
          "previewWidth": preview.width,
          "previewHeight": preview.height,
          "fullWidth": fullVideo.width,
          "fullHeight": fullVideo.height,
          "fullDuration": fullVideo.duration,
          "size": fullVideo.files[] | order(size desc)[0].size,
          "date": fullVideo.release_time,
          "fps": fullVideo.files[quality match "hls"][0].fps,
          photos[] {
            ${imageFragment}
          }
        }
    	},
      count($filters) == 0 => {
        "projects": projects[_type == "photoObject" || defined(preview.files[quality match "hls"][0].link) && defined(fullVideo.files[quality match "hls"][0].link)] {
          _key,
          title,
          _type,
          "director": director->name,
          "previewVideo": preview.files[quality match "hls"][0].link,
          "fullVideo": fullVideo.files[quality match "hls"][0].link,
          "previewWidth": preview.width,
          "previewHeight": preview.height,
          "fullWidth": fullVideo.width,
          "fullHeight": fullVideo.height,
          "fullDuration": fullVideo.duration,
          "size": fullVideo.files[] | order(size desc)[0].size,
          "date": fullVideo.release_time,
          "fps": fullVideo.files[quality match "hls"][0].fps,
          photos[] {
            ${imageFragment}
          }
        }
    	},
    },
    about[],
    splashscreens[]{
        _key,
        ${imageFragment}
    },
  }
`;

export const directorQuery = groq`
 *[_type == "director" && slug.current in *[_type == "section"].projects[].director->slug.current] | order(name asc) {
      _id,
      name,
      "slug": slug.current
  }
`;
