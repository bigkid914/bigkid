import { visionTool } from "@sanity/vision";
import { defineConfig, isDev } from "sanity";
import { deskTool } from "sanity/desk";
import { presentationTool } from "sanity/presentation";
import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/lib/api";
import { locate } from "@/sanity/plugins/locate";
import { pageStructure } from "@/sanity/plugins/settings";
import "@/sanity/sanity.css";

// Singletons
import settings from "@/sanity/schemas/singletons/settings";
import home from "@/sanity/schemas/singletons/home";

// Documents
import section from "@/sanity/schemas/documents/section";
import director from "@/sanity/schemas/documents/director";

// Objects
import linkWithSelector from "@/sanity/schemas/custom/link/linkWithSelector";
import overview from "@/sanity/schemas/objects/overview";
import projectObject from "@/sanity/schemas/objects/projectObject";
import vimeoObject from "@/sanity/schemas/objects/vimeoObject";

// Blocks
import basicBlock from "@/sanity/schemas/blocks/basicBlock";

const singletons = new Set([settings, home]);
const documents = new Set([section, director]);
const objects = new Set([
  linkWithSelector,
  overview,
  projectObject,
  vimeoObject,
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

export default defineConfig({
  basePath: studioUrl,
  projectId: projectId || "",
  dataset: dataset || "",
  title: "bigkid",
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
    deskTool({
      structure: pageStructure(Array.from(singletons)),
    }),
    presentationTool({
      locate,
      previewUrl: {
        origin:
          typeof location === "undefined"
            ? "http://localhost:3000"
            : location.origin,
        draftMode: {
          enable: "/api/draft",
        },
      },
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
