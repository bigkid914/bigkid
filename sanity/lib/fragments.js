import { groq } from "next-sanity";

export const imageFragment = groq`
    "_id": asset._ref,
    "altText": asset->altText,
    crop,
    hotspot,
    "preview": asset->metadata.lqip
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
