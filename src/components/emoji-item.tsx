import { Action, ActionPanel, Grid, Icon, showHUD } from "@raycast/api";
import { addID, friends, getAndCopy, imagePah } from "../data";
import { Emoji } from "../types";

export default function EmojiItem({
  item,
  friend,
  setFriend,
  setQuery,
  adUsed,
  removeUsed,
  clearUsed,
}: {
  item: Emoji;
  friend: string;
  setFriend: (value: string) => void;
  setQuery: (value: string) => void;
  adUsed: (value: string) => void;
  removeUsed: (value: string) => void;
  clearUsed: () => void;
}) {
  const { src, title, description, tags } = item;
  const SRC = addID({ src, friend });

  const handleCopy = async (src: string) => {
    await getAndCopy(src);
    showHUD("Copied");
  };

  return (
    <Grid.Item
      content={SRC}
      keywords={[title, description, ...tags]}
      actions={
        <ActionPanel>
          <ActionPanel.Section>
            <Action
              icon={Icon.Clipboard}
              title="Copy Image"
              onAction={() => {
                handleCopy(SRC);
                adUsed(src);
              }}
            />
            <Action.ShowInFinder title="Show in Finder" path={imagePah} shortcut={{ modifiers: ["cmd"], key: "s" }} />
          </ActionPanel.Section>

          <ActionPanel.Submenu icon={Icon.Person} title="Friends" shortcut={{ modifiers: ["cmd"], key: "f" }}>
            {friend && (
              <ActionPanel.Section>
                <Action icon={Icon.XMarkCircle} title="Solo" onAction={() => setFriend("")} />
              </ActionPanel.Section>
            )}

            {friends.map(({ id, name }) => (
              <Action icon={Icon.Person} key={id} onAction={() => setFriend(id)} title={name} />
            ))}
          </ActionPanel.Submenu>

          <ActionPanel.Submenu icon={Icon.Tag} title="Tags" shortcut={{ modifiers: ["cmd"], key: "t" }}>
            {tags.map((tag: string) => (
              <Action key={tag} icon={Icon.Tag} title={tag} onAction={() => setQuery(tag)} />
            ))}
          </ActionPanel.Submenu>

          <ActionPanel.Submenu icon={Icon.Info} title="More Info" shortcut={{ modifiers: ["cmd"], key: "i" }}>
            <Action.CopyToClipboard title={title} content={title} />
            {description && <Action.CopyToClipboard title={description} content={description} />}
          </ActionPanel.Submenu>

          <ActionPanel.Section title="Recently Used">
            <Action
              icon={Icon.XMarkCircle}
              title="Remove Item"
              onAction={() => {
                removeUsed(src);
                showHUD("Removed");
              }}
            />
            <Action icon={Icon.XMarkCircle} title="Clear All" onAction={clearUsed} />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}
