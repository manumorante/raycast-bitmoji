import { Action, ActionPanel, Grid, Color, Icon, showHUD } from "@raycast/api";
import { emojis, friends, addID, pref, getImage, copyImage } from "./data";
import { Emoji } from "./types";
import { useEffect, useState } from "react";

export default function Command() {
  const [filter, setFilter] = useState("all");
  const [friend, setFriend] = useState("");
  const [results, setResults] = useState<Emoji[]>([]);

  // General filter
  useEffect(() => {
    let _results = emojis;
    let _friend = friend;

    // When `filter` is solo, filter by no friends
    if (filter === "solo") {
      _results = emojis.filter((item) => item.friends === false);
    }

    // When `filter` is a friend, filter by friends and set friend
    if (filter !== "all" && filter !== "solo") {
      _friend = filter;
      _results = emojis.filter((item) => item.friends === true);
    }

    _results = _results.map((item) => ({
      ...item,
      src: addID({ src: item.src, friend: _friend }),
    }));

    setFriend(_friend);
    setResults(_results);
  }, [filter]);

  return (
    <Grid
      columns={Number(pref.columns)}
      aspectRatio="1"
      fit={Grid.Fit.Contain}
      searchBarPlaceholder="Search for Emojis"
      searchBarAccessory={<Filter active={filter} onChange={(value) => setFilter(value)} />}
    >
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
                  <Action icon={Icon.Clipboard} title="Copy Image" onAction={() => handleCopy(src)} />
                  <Action.CopyToClipboard icon={Icon.Link} title="Copy URL" content={src} />
                  <Action.CopyToClipboard icon={Icon.Code} title="Copy Markdown" content={`![${title}](${src})`} />

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
    </Grid>
  );
}

const Filter = ({ active, onChange }: { active: string; onChange: (value: string) => void }) => {
  return (
    <Grid.Dropdown defaultValue={active} storeValue tooltip="People" onChange={onChange}>
      {friends.map(({ id, name }, i) => (
        <Grid.Dropdown.Item
          icon={{ source: Icon.Person, tintColor: active === id ? Color.PrimaryText : Color.SecondaryText }}
          key={id}
          value={id}
          title={`${name || `Friend ${i}`}`}
        />
      ))}
    </Grid.Dropdown>
  );
};

const handleCopy = async (src: string) => {
  await getImage(src);
  await copyImage();
  showHUD("Copied");
};
