import { Action, Color, Icon } from "@raycast/api";

export default function SectionFilterBy({ items, onAction }: { items: string[]; onAction: (item: string) => void }) {
  return (
    <>
      {items.map((item: string, i: number) => (
        <Action
          key={i}
          icon={{ source: Icon.Tag, tintColor: Color.SecondaryText }}
          title={item}
          onAction={() => onAction(item)}
        />
      ))}
    </>
  );
}
