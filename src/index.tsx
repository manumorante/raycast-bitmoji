import { Action, ActionPanel, Grid, Icon, Color, List } from "@raycast/api";
import { emojis } from "./data";
import { Template } from "./types";
import { useState } from "react";

export default function Command() {
  const [selectedCat, setSelectedCat] = useState<string | undefined>(undefined);
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const [selectedEmoji, setSelectedEmoji] = useState<Template | undefined>(undefined);
  const [gridColumns, setGridColumns] = useState("5");

  let results = emojis;

  if (selectedEmoji) {
    results = emojis.filter((emoji) => emoji.categories.includes(selectedEmoji.categories[0]));
  }

  if (selectedTag) {
    results = emojis.filter((emoji) => emoji.tags.includes(selectedTag));
  }

  if (selectedCat) {
    results = emojis.filter((emoji) => emoji.categories.includes(selectedCat));
  }

  const handleSelectEmoji = (emoji: Template) => {
    setSelectedTag(undefined);
    setSelectedEmoji(emoji);
  };

  const handleSelectTag = (tag: string) => {
    setSelectedEmoji(undefined);
    setSelectedTag(tag);
  };

  const handleSelectCat = (cat: string) => {
    setSelectedTag(undefined);
    setSelectedEmoji(undefined);
    setSelectedCat(cat);
  };

  const cuteCat = (cat: string) => {
    return cat.replaceAll("#mt_", "").replaceAll("_", " ");
  };

  return (
    <Grid
      columns={Number(gridColumns)}
      aspectRatio="1"
      fit={Grid.Fit.Fill}
      searchBarAccessory={<Dropdown onChange={(value: string) => setGridColumns(value)} />}
    >
      <Grid.Section
        title={selectedEmoji || selectedTag ? `${results.length} emojis filtering by` : `${results.length} emojis`}
        subtitle={
          selectedEmoji
            ? `${selectedEmoji.categories.map((cat: string) => cuteCat(cat)).join(", ")}`
            : selectedTag
            ? `${selectedTag}`
            : ``
        }
      >
        {results.map((emoji: Template) => {
          return (
            <Grid.Item
              key={emoji.src}
              keywords={emoji.tags}
              content={emoji.src}
              actions={
                <ActionPanel>
                  <Action.CopyToClipboard title="Copy" content={emoji.src} />

                  {(emoji.descriptive_alt_text || emoji.alt_text) && (
                    <ActionPanel.Section title="Alt text">
                      {emoji.alt_text && <Action.CopyToClipboard title={emoji.alt_text} content={emoji.alt_text} />}
                      {emoji.descriptive_alt_text && (
                        <Action.CopyToClipboard
                          title={emoji.descriptive_alt_text}
                          content={emoji.descriptive_alt_text}
                        />
                      )}
                    </ActionPanel.Section>
                  )}

                  <ActionPanel.Section title="Tags">
                    {emoji.tags.map((tag: string, index: number) => {
                      const isSelected = tag === selectedTag;
                      return (
                        <Action
                          key={index}
                          icon={{
                            source: Icon.Tag,
                            tintColor: isSelected ? Color.PrimaryText : Color.SecondaryText,
                          }}
                          title={tag}
                          onAction={() => handleSelectTag(tag)}
                        />
                      );
                    })}
                  </ActionPanel.Section>

                  <ActionPanel.Section title="Categories">
                    {selectedEmoji && (
                      <Action
                        icon={Icon.XMarkCircleFilled}
                        title="View All Categories"
                        onAction={() => setSelectedCat("all")}
                      />
                    )}
                    <Action icon={Icon.Eye} title="Select All" onAction={() => handleSelectEmoji(emoji)} />
                    {emoji.categories.map((cat: string) => {
                      const isSelected = cat === selectedCat;
                      return (
                        <Action
                          icon={{
                            source: isSelected ? Icon.CircleProgress100 : Icon.Circle,
                            tintColor: isSelected ? Color.PrimaryText : Color.SecondaryText,
                          }}
                          title={cuteCat(cat)}
                          onAction={() => handleSelectCat(cat)}
                          key={cat}
                        />
                      );
                    })}
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

function Dropdown(props: { onChange: (newValue: string) => void }) {
  return (
    <List.Dropdown
      filtering={false}
      tooltip="Grid columns"
      storeValue={true}
      onChange={(value) => props.onChange(value)}
    >
      <List.Dropdown.Section title="Grid">
        <List.Dropdown.Item icon={Icon.AppWindowGrid3x3} title="Small" value="8" />
        <List.Dropdown.Item icon={Icon.AppWindowGrid2x2} title="Medium" value="5" />
        <List.Dropdown.Item icon={Icon.AppWindowGrid2x2} title="Big" value="3" />
      </List.Dropdown.Section>
    </List.Dropdown>
  );
}
