import { Action, ActionPanel, Grid, Icon } from "@raycast/api";
import { emojis, addID, pref } from "./data";
import FriendsDropdown from "./FriendsDropdown";
import { Emoji } from "./types";
import { useState } from "react";

export default function Command() {
  const [people, setPeople] = useState("all");
  const [friend, setFriend] = useState("");

  const results =
    people === "all"
      ? emojis
      : people === "solo"
      ? emojis.filter((item) => item.friends === false)
      : emojis.filter((item) => item.friends === true);
  results.sort(() => Math.random() - 0.5);

  const handlePeopleChange = (value: string) => {
    setPeople(value);

    // Change friend with id
    if (value !== "all" && value !== "solo") {
      setFriend(value);
    }
  };

  return (
    <Grid
      columns={Number(pref.columns)}
      aspectRatio="1"
      fit={Grid.Fit.Contain}
      searchBarPlaceholder="Search for Emojis"
      searchBarAccessory={<FriendsDropdown active={people} onChange={handlePeopleChange} />}
    >
      <Grid.Section title={`${results.length} emojis`}>
        {results.map((emoji: Emoji) => {
          const src = addID({ src: emoji.src, friend });

          return (
            <Grid.Item
              key={src}
              {...(pref.title ? { title: emoji.title } : {})}
              content={src}
              keywords={[...emoji.title, ...emoji.tags]}
              actions={
                <ActionPanel>
                  <Action.CopyToClipboard title="Copy Emoji" content={src} />

                  <ActionPanel.Section title="Tags">
                    {emoji.tags.map((tag: string) => (
                      <Action.CopyToClipboard key={tag} icon={Icon.Tag} title={tag} content={tag} />
                    ))}
                  </ActionPanel.Section>

                  {emoji.title && (
                    <ActionPanel.Section title="Description">
                      <Action title={emoji.title} />
                      {emoji.description && <Action title={emoji.description} />}
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
