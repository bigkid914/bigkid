"use client"
import { visionTool } from "@sanity/vision";
import { defineConfig, definePlugin, isDev } from "sanity";
import { presentationTool } from "sanity/presentation";
import { apiVersion, dataset, projectId } from "@/sanity/lib/api";
import { locations } from "@/sanity/plugins/locations";
import { pageStructure } from "@/sanity/plugins/settings";
import { structureTool } from "sanity/structure";

// Singletons
import settings from "@/sanity/schemas/singletons/settings";
import home from "@/sanity/schemas/singletons/home";

// Documents
import section from "@/sanity/schemas/documents/section";
import director from "@/sanity/schemas/documents/director";

// Objects
import linkWithSelector from "@/sanity/schemas/custom/link/linkWithSelector";
import overview from "@/sanity/schemas/objects/overview";
import photoObject from "@/sanity/schemas/objects/photoObject";

import vimeoObject from "@/sanity/schemas/objects/vimeoObject";

// Blocks
import basicBlock from "@/sanity/schemas/blocks/basicBlock";

const singletons = new Set([settings, home]);
const documents = new Set([section, director]);
const objects = new Set([
  linkWithSelector,
  overview,
  vimeoObject,
  photoObject
]);
const arrays = new Set([]);
const blocks = new Set([basicBlock]);
const modules = new Set([]);
const singletonDocs = new Set(Array.from(singletons).map((doc) => doc.name));
const singletonActions = new Set(["publish", "discardChanges", "restore"]);

// export const LINK_ITEMS = Array.from(new Set([director])).map((document) => ({
//   type: document.name,
// }));
// export const MENU_ITEMS = Array.from(new Set([director])).map((document) => ({
//   type: document.name,
// }));

import BigkidLogo from "@/app/apple-icon.png";

const analyticsPlugin = definePlugin({
  name: "sanity-plugin-analytics",
  tools: [
    {
      name: "analytics",
      title: "Analytics",
      icon: () => "📊",
      component: () => (
        <div className="w-full h-full">
          <iframe
            src={`${process.env.NEXT_PUBLIC_PLAUSIBLE_SHARED_LINK}&embed=true&theme=system&background=transparent`}
            loading="lazy"
            style={{ width: "1px", minWidth: "100%", height: "100%" }}
            title="Site Analytics Dashboard"
            aria-label="Analytics data visualization"
          ></iframe>
          <script async src="https://analytics.soup.work/js/embed.host.js"></script>
        </div>
      ),
    },
  ],
});

export default defineConfig({
  basePath: "/studio",
  projectId: projectId || "",
  dataset: dataset || "",
  title: "bigkid",
  icon: () => <img src={BigkidLogo.src} alt="" width={25} height={25} />,
  schema: {
    types: [
      ...singletons,
      ...documents,
      ...objects,
      ...arrays,
      ...blocks,
      ...modules,
    ],
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonDocs.has(schemaType)),
  },
  plugins: [
    presentationTool({
      resolve: {
        locations,
      },
      previewUrl: { previewMode: { enable: "/api/draft-mode/enable" } },
    }),
    structureTool({
      structure: pageStructure(),
    }),
    ...(isDev ? [visionTool({ defaultApiVersion: apiVersion })] : []),
  ],
  document: {
    actions: (input, context) =>
      singletonDocs.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
});
