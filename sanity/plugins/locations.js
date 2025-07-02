import { map } from "rxjs";
import { resolveHref } from "@/sanity/lib/utils";

export const locations = (params, context) => {

  if (params.type === "settings" || params.type === "section") {
    const doc$ = context.documentStore.listenQuery(
      `*[_id==$id || references($id)]{_type,slug,title}`,
      params,
      { perspective: "previewDrafts" },
    );
    return doc$.pipe(
      map((docs) => {
        const isReferencedBySettings = docs?.some(
          (doc) => doc._type === "settings",
        );
        switch (params.type) {
          case "settings":
            return {
              message: "This document is used across the bigkid site.",
              tone: "caution",
            };

          case "section":
            return {
              locations: docs
                ?.map((doc) => {
                  const href = resolveHref(doc._type, doc?.slug?.current);
                  return {
                    title: doc?.title || "Untitled",
                    href: href,
                  };
                })
                .filter((doc) => doc.href !== undefined),
              tone: isReferencedBySettings ? "positive" : "critical",
              message: isReferencedBySettings
                ? "This section is visible on the bigkid homepage."
                : "This section isn’t included on the bigkid homepage. Add this section to your home document to make it visible.",
            };

          default:
            return {
              message: "Unable to map document type to locations.",
              tone: "critical",
            };
        }
      }),
    );
  }

  return null;
};
