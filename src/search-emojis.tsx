import { Action, ActionPanel, Grid, Icon, showHUD } from "@raycast/api";
import { emojis, categories, pref, addID, getAndCopy, imagePah } from "./data";
import { useEffect, useState } from "react";
import { Emoji } from "./types";

export default function Command() {
  const [query, setQuery] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [results, setResults] = useState<Emoji[]>([]);

  useEffect(() => {
    const filteredResults = emojis.filter(
      (e) =>
        (filterCat === "" || e.categories.includes(filterCat)) &&
        (e.tags.some((k) => k.includes(query)) || e.title.includes(query) || e.description.includes(query)),
    );
    setResults(filteredResults);
  }, [query, filterCat]);

  function EmojiItem({ emoji }: { emoji: Emoji }) {
    const { src, title, description, tags } = emoji;
    const SRC = addID({ src });

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
            <Action
              icon={Icon.Clipboard}
              title="Copy Image"
              onAction={() => {
                handleCopy(SRC);
              }}
            />
            <Action.ShowInFinder title="Show in Finder" path={imagePah} shortcut={{ modifiers: ["cmd"], key: "s" }} />

            <ActionPanel.Submenu icon={Icon.Tag} title="Tags" shortcut={{ modifiers: ["cmd"], key: "t" }}>
              {tags.map((tag: string) => (
                <Action key={tag} icon={Icon.Tag} title={tag} onAction={() => setQuery(tag)} />
              ))}
            </ActionPanel.Submenu>

            <ActionPanel.Submenu icon={Icon.Info} title="More Info" shortcut={{ modifiers: ["cmd"], key: "i" }}>
              <Action.CopyToClipboard title={title} content={title} />
              {description && <Action.CopyToClipboard title={description} content={description} />}
            </ActionPanel.Submenu>
          </ActionPanel>
        }
      />
    );
  }

  return (
    <Grid
      searchBarPlaceholder="Search for Emojis"
      onSearchTextChange={setQuery}
      searchText={query}
      filtering={false}
      columns={Number(pref.columns)}
      fit={Grid.Fit.Contain}
      aspectRatio="1"
      searchBarAccessory={
        <Grid.Dropdown
          value={filterCat}
          tooltip="Category"
          onChange={(cat) => {
            setQuery("");
            setFilterCat(cat);
          }}
        >
          <Grid.Dropdown.Item icon={Icon.Tag} value="" title="All categories" />

          {categories.map((cat) => (
            <Grid.Dropdown.Item key={cat.name} icon={Icon.Tag} value={cat.name} title={cat.name} />
          ))}
        </Grid.Dropdown>
      }
    >
      {results.length > 0 && (
        <Grid.Section title={"Emojis"} subtitle={`${results.length}`}>
          {results.map((emoji) => (
            <EmojiItem key={emoji.src} emoji={emoji} />
          ))}
        </Grid.Section>
      )}
    </Grid>
  );
}
