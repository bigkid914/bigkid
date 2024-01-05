import Emoji from "a11y-react-emoji";

// The StructureResolver is how we're changing the DeskTool structure to linking to document (named Singleton)
// like how "Home" is handled.
export const pageStructure = (typeDefArray) => {
  return (S) => {
    // Goes through all of the singletons that were provided and translates them into something the
    // Desktool can understand
    const singletonItems = typeDefArray.map((typeDef) => {
      return S.listItem()
        .title(typeDef.title)
        .icon(typeDef.icon)
        .child(
          S.editor()
            .id(typeDef.name)
            .schemaType(typeDef.name)
            .documentId(typeDef.name),
        )
    })

    // The default root list items (except custom ones)
    const defaultListItems = S.documentTypeListItems().filter(
      (listItem) =>
        !typeDefArray.find((singleton) => singleton.name === listItem.getId()),
    )

    return S.list()
      .title("Content")
      .items([...singletonItems, S.divider(), ...defaultListItems])
  }
}

const documentIcons = [
  { name: "home", emoji: "🏠" },
  { name: "settings", emoji: "⚙️" },
  { name: "section", emoji: "📄" },
  { name: "director", emoji: "🎬" },
]

const createIcons = [...documentIcons].map((icon) => {
  return {
    [icon.name]: <Emoji style={{ fontSize: "1.5em" }} symbol={icon.emoji} label={icon.name} />,
  };
});

export const Icons = Object.assign(...createIcons)
