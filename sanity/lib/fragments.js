import { groq } from "next-sanity";

export const imageFragment = groq`
    "_id": asset._ref,
    "altText": asset->altText,
    crop,
    hotspot,
    "preview": asset->metadata.lqip,
    "metadata": asset-> {
        extension,
        "dimensions": string(metadata.dimensions.width) + "x" + string(metadata.dimensions.height),
        size
    }
    
`;

export const linkFragment = groq`
    markDefs[] {
        ..., 
        _type == 'internalLinkObject' => {
            "slug": reference-> slug.current
        }
    }
`;

export const blockFragment = groq`
    _type == 'block' => {
        ...,
        ${linkFragment},
    }`;
