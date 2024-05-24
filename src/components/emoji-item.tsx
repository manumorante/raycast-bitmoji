import { Action, ActionPanel, Grid, Icon, showHUD } from "@raycast/api";
import { addID, friends, getAndCopy, imagePah } from "../data";
import { Emoji, Friend } from "../types";

export default function EmojiItem({
  item,
  friend,
  setFriend,
  setQuery,
  addRecent,
  removeRecentItem,
  clearRecent,
}: {
  item: Emoji;
  friend: Friend;
  setFriend: (value: Friend) => void;
  setQuery: (value: string) => void;
  addRecent: (value: string) => void;
  removeRecentItem: (value: string) => void;
  clearRecent: () => void;
}) {
  const { src, title, description, tags } = item;
  const SRC = addID({ src, friend: friend.id });

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
                addRecent(src);
              }}
            />
            <Action.ShowInFinder title="Show in Finder" path={imagePah} shortcut={{ modifiers: ["cmd"], key: "s" }} />
          </ActionPanel.Section>

          {friend.id && (
            <ActionPanel.Section>
              <Action
                icon={Icon.XMarkCircle}
                title="Solo"
                onAction={() => setFriend({ id: "", name: "" })}
                shortcut={{ modifiers: ["cmd", "shift"], key: "f" }}
              />
            </ActionPanel.Section>
          )}

          <ActionPanel.Submenu icon={Icon.Person} title="Friends" shortcut={{ modifiers: ["cmd"], key: "f" }}>
            {friends.map((item) => (
              <Action icon={Icon.Person} key={item.id} onAction={() => setFriend(item)} title={item.name} />
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
                removeRecentItem(src);
                showHUD("Removed");
              }}
            />
            <Action icon={Icon.XMarkCircle} title="Clear All" onAction={clearRecent} />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}
