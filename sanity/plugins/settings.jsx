import { CogIcon, FolderIcon, HomeIcon, UserIcon } from "@sanity/icons";

export const pageStructure = () => {
  return (S) => {
    return S.list()
      .title("Content")
      .items([
        S.listItem()
          .title("Sections")
          .schemaType("section")
          .icon(FolderIcon)
          .child(() =>
            S.documentList()
              .schemaType("section")
              .title("Section")
              .filter("_type == 'section'")
              .child((id) => S.document().documentId(id).schemaType("section")),
          ),
        S.divider(),

        S.listItem()
          .title("Directors")
          .schemaType("director")
          .icon(UserIcon)
          .child(() =>
            S.documentList()
              .schemaType("director")
              .title("Director")
              .filter("_type == 'director'")
              .child((id) =>
                S.document().documentId(id).schemaType("director"),
              ),
          ),
        S.listItem()
          .title("Settings")
          .icon(CogIcon)
          .child(
            S.editor()
              .id("settings")
              .schemaType("settings")
              .documentId("settings"),
          ),
      ]);
  };
};
