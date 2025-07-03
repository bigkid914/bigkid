import { groq } from "next-sanity";
import { imageFragment } from "./fragments";

export const settingsQuery = groq`
  *[_type == "settings"][0]{
    title,
    about[],
    splashscreens[]{
        _key,
        ${imageFragment}
    },
    sectionOrder[] -> {
      _id,
      title,
      slug
    },
    seo {
      ogTitle,
      ogDescription,
      ogImage,
    }
  }
`;

export const directorQuery = groq`
 *[_type == "director" && slug.current in *[_type == "section"].projects[].director->slug.current] | order(name asc) {
      _id,
      name,
      "slug": slug.current
  }
`;

export const pageQuery = groq`
  *[_type == "section" && slug.current == $slug][0]{
    projects[_type == "photoObject" || defined(preview.files[quality match "hls"][0].link) && defined(fullVideo.files[quality match "hls"][0].link)]{
      _type == 'projectObject' => {
        _key,
        title,
        _type,
        "director": director->name,
        "credits": credits[],
        "previewVideo": preview.files[quality match "hls"][0].link,
        "fullVideo": fullVideo.files[quality match "hls"][0].link,
        "previewWidth": preview.width,
        "previewHeight": preview.height,
        "fullWidth": fullVideo.width,
        "fullHeight": fullVideo.height,
        "fullDuration": fullVideo.duration,
        "size": fullVideo.files[] | order(size desc)[0].size,
        "date": fullVideo.release_time,
        "fps": fullVideo.files[quality match "hls"][0].fps
      },
      _type == 'photoObject' => {
        _key,
        title,
        _type,
        photographer,
        date,
        photos[] {
          ${imageFragment}
        }
      }
    },
    "seo": {
      "ogTitle": coalesce(ogTitle, title),
      "ogDescription": coalesce(ogDescription, *[_type == "settings"][0].seo.ogDescription),
      "ogImage": coalesce(ogImage, *[_type == "settings"][0].seo.ogImage),
  	}
  }
`;
