import { Action, ActionPanel, Grid, Icon, showHUD } from "@raycast/api";
import { emojis, friends, addID, pref, imagePah, getAndCopy } from "./data";
import { Emoji } from "./types";
import { useEffect, useState } from "react";

export default function Command() {
  const [filter, setFilter] = useState("");
  const [friendSelected, setFriendSelected] = useState("");
  const [results, setResults] = useState<Emoji[]>([]);

  useEffect(() => {
    if (!filter) return;

    const isFriend = !["all", "solo"].includes(filter);
    const friend = isFriend ? filter : friendSelected;

    let newResults = isFriend
      ? emojis.filter((emo) => emo.friends === true)
      : filter === "solo"
      ? emojis.filter((emo) => emo.friends === false)
      : emojis;

    // Add our IDs
    newResults = newResults.map((emo) => ({
      ...emo,
      src: addID({ src: emo.src, friend }),
    }));

    newResults.sort(() => Math.random() - 0.5);

    if (isFriend) setFriendSelected(friend);
    setResults(newResults);
  }, [filter]);

  return (
    <Grid
      columns={Number(pref.columns)}
      aspectRatio="1"
      fit={Grid.Fit.Contain}
      searchBarPlaceholder="Search for Emojis"
      searchBarAccessory={<Filter onChange={(value) => setFilter(value)} />}
    >
      {results.length > 0 && (
        <Grid.Section title={`${results.length} emojis`}>
          {results.map(({ src, title, description, tags }: Emoji) => {
            return (
              <Grid.Item
                key={src}
                {...(pref.title ? { title: title } : {})}
                content={src}
                keywords={[...title, ...tags]}
                actions={
                  <ActionPanel>
                    <Action
                      icon={Icon.Clipboard}
                      title="Copy Image"
                      onAction={() => handleCopy(src)}
                      shortcut={{ modifiers: ["cmd"], key: "i" }}
                    />
                    <Action.CopyToClipboard
                      icon={Icon.Link}
                      title="Copy URL"
                      content={src}
                      shortcut={{ modifiers: ["cmd"], key: "u" }}
                    />
                    <Action.CopyToClipboard
                      icon={Icon.Code}
                      title="Copy Markdown"
                      content={`![${title}](${src})`}
                      shortcut={{ modifiers: ["cmd"], key: "m" }}
                    />
                    <Action.ShowInFinder
                      title="Show in Finder"
                      path={imagePah}
                      shortcut={{ modifiers: ["cmd"], key: "f" }}
                    />

                    <ActionPanel.Section title="Tags">
                      {tags.map((tag: string) => (
                        <Action.CopyToClipboard key={tag} icon={Icon.Tag} title={tag} content={tag} />
                      ))}
                    </ActionPanel.Section>

                    <ActionPanel.Section title="Description">
                      <Action title={title} />
                      {description && <Action title={description} />}
                    </ActionPanel.Section>
                  </ActionPanel>
                }
              />
            );
          })}
        </Grid.Section>
      )}
    </Grid>
  );
}

const Filter = ({ onChange }: { onChange: (value: string) => void }) => {
  return (
    <Grid.Dropdown storeValue tooltip="Filter friends" onChange={onChange}>
      <Grid.Dropdown.Section title="Filter friends">
        <Grid.Dropdown.Item icon={Icon.TwoPeople} value="all" title="All" />
        <Grid.Dropdown.Item icon={Icon.Person} value="solo" title="Solo" />

        {friends.map(({ id, name }, i) => (
          <Grid.Dropdown.Item icon={Icon.PersonCircle} key={id} value={id} title={`${name || `Friend ${i}`}`} />
        ))}
      </Grid.Dropdown.Section>
    </Grid.Dropdown>
  );
};

const handleCopy = async (src: string) => {
  await getAndCopy(src);
  showHUD("Copied");
};
