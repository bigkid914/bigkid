import { map } from "rxjs";
import { resolveHref } from "@/sanity/lib/utils";

export const locate = (params, context) => {
  if (params.type === "settings") {
    return {
      message: "This document is used across the bigkid site.",
      tone: "caution",
    };
  }

  if (
    params.type === "home" ||
    params.type === "section" 
  ) {
    const doc$ = context.documentStore.listenQuery(
      `*[_id==$id || references($id)]{_type,slug,title}`,
      params,
      { perspective: "previewDrafts" },
    );
    return doc$.pipe(
      map((docs) => {
        const isReferencedByHome = docs?.some(
          (doc) => doc._type === "home",
        );
        switch (params.type) {
          case "home":
            return {
              message:
                "Used as the bigkid landing page.",
              tone: "positive",
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
              tone: isReferencedByHome ? "positive" : "critical",
              message: isReferencedByHome
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
