import { Action, ActionPanel, Grid, Icon } from "@raycast/api";
import { emojis, preferences } from "./data";
import SectionFilterBy from "./SectionFilterBy";
import { Emoji } from "./types";
import { useState } from "react";

export default function Command() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("solo");

  let results = type === "solo" ? emojis.solo : emojis.friends;
  results = results.filter(({ tags, categories, alt_text }) => {
    if (!query) return true;
    return tags.includes(query) || alt_text?.includes(query) || categories.includes(query);
  });

  const handleSearch = (query: string) => setQuery(query);
  const handleReset = () => setQuery("");

  return (
    <Grid
      columns={Number(preferences.gridSize)}
      aspectRatio="1"
      fit={Grid.Fit.Fill}
      searchText={query}
      searchBarPlaceholder="Search for Emojis"
      onSearchTextChange={handleSearch}
      filtering={false}
      searchBarAccessory={
        <Grid.Dropdown tooltip="Select Emoji Category" storeValue={true} onChange={(newValue) => setType(newValue)}>
          <Grid.Dropdown.Item title="Emojis" value="solo" />
          <Grid.Dropdown.Item title="Friends" value="friends" />
          <Grid.Dropdown.Item title="Outfits" value="outfits" />
        </Grid.Dropdown>
      }
    >
      <Grid.Section title={`${results.length} emojis`}>
        {results.map((emoji: Emoji) => {
          return (
            <Grid.Item
              key={emoji.src}
              {...(preferences.showTitle ? { title: emoji.alt_text } : {})}
              content={{
                source: emoji.src,
                tooltip: emoji.alt_text,
              }}
              actions={
                <ActionPanel>
                  <Action.CopyToClipboard title="Copy Emoji" content={emoji.src} />

                  {query && (
                    <Action icon={Icon.XMarkCircleFilled} title="Reset Filters" onAction={() => handleReset()} />
                  )}

                  <ActionPanel.Section title="Filter">
                    <SectionFilterBy items={emoji.tags} onAction={handleSearch} />
                    <SectionFilterBy items={emoji.categories} onAction={handleSearch} />
                  </ActionPanel.Section>

                  {(emoji.descriptive_alt_text || emoji.alt_text) && (
                    <ActionPanel.Section title="Description">
                      {emoji.alt_text && <Action title={emoji.alt_text} />}
                      {emoji.descriptive_alt_text && <Action title={emoji.descriptive_alt_text} />}
                    </ActionPanel.Section>
                  )}
                </ActionPanel>
              }
            />
          );
        })}
      </Grid.Section>
    </Grid>
  );
}
