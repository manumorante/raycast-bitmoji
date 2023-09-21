import { Action, ActionPanel, Grid, Icon, showHUD, Cache } from "@raycast/api";
import { emojis, categories as allCategories, friends, addID, pref, imagePah, getAndCopy } from "./data";
import { Emoji } from "./types";
import { useEffect, useState } from "react";

const cache = new Cache();

export default function Command() {
  // const [filter, setFilter] = useState("");
  // const [friendSelected, setFriendSelected] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [results, setResults] = useState<Emoji[]>([]);

  // Cache for recently used
  const cached = cache.get("recently-used");
  const [used, setUsed] = useState<Emoji[]>(cached ? JSON.parse(cached) : []);

  const adUsed = (item: Emoji) => {
    const newUsed = [item, ...used.filter((emo) => emo.src !== item.src)];
    if (newUsed.length > 5) newUsed.splice(5);

    setUsed(newUsed);
    cache.set("recently-used", JSON.stringify(newUsed));
  };

  const clearUsed = () => {
    cache.remove("recently-used");
    setUsed([]);
  };

  useEffect(() => {
    if (!filterCategory) return;

    let newResults =
      filterCategory === "all" ? emojis : emojis.filter((emo) => emo.categories.includes(filterCategory));

    // Add our IDs
    newResults = newResults.map((emo) => ({
      ...emo,
      src: addID({ src: emo.src }),
    }));

    // newResults.sort(() => Math.random() - 0.5);

    setResults(newResults);
  }, [filterCategory]);

  // useEffect(() => {
  //   if (!filter) return;

  //   const isFriend = !["all", "solo"].includes(filter);
  //   const friend = isFriend ? filter : friendSelected;

  //   let newResults = isFriend
  //     ? emojis.filter((emo) => emo.friends === true)
  //     : filter === "solo"
  //     ? emojis.filter((emo) => emo.friends === false)
  //     : emojis;

  //   // Add our IDs
  //   newResults = newResults.map((emo) => ({
  //     ...emo,
  //     src: addID({ src: emo.src, friend }),
  //   }));

  //   newResults.sort(() => Math.random() - 0.5);

  //   if (isFriend) setFriendSelected(friend);
  //   setResults(newResults);
  // }, [filter]);

  const EmojiGridItem = ({ item }: { item: Emoji }) => {
    const { src, title, description, tags, categories } = item;

    return (
      <Grid.Item
        {...(pref.title ? { title: title } : {})}
        content={src}
        keywords={[...title, ...tags, ...categories]}
        actions={
          <ActionPanel>
            <ActionPanel.Section>
              <Action
                icon={Icon.Clipboard}
                title="Copy Image"
                onAction={() => {
                  handleCopy(src);
                  adUsed(item);
                }}
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
              <Action.ShowInFinder title="Show in Finder" path={imagePah} shortcut={{ modifiers: ["cmd"], key: "s" }} />
            </ActionPanel.Section>

            <ActionPanel.Submenu icon={Icon.Tag} title="Tags" shortcut={{ modifiers: ["cmd"], key: "t" }}>
              {tags.map((tag: string) => (
                <Action.CopyToClipboard key={tag} icon={Icon.Tag} title={tag} content={tag} />
              ))}
            </ActionPanel.Submenu>

            {categories.length > 0 && (
              <ActionPanel.Submenu icon={Icon.Tag} title="Categories">
                {categories.map((cat: string, i: number) => (
                  <Action.CopyToClipboard key={`cat-${i}`} icon={Icon.Tag} title={cat} content={cat} />
                ))}
              </ActionPanel.Submenu>
            )}

            <ActionPanel.Submenu icon={Icon.Info} title="More Info">
              <Action title={title} />
              {description && <Action title={description} />}
            </ActionPanel.Submenu>

            <ActionPanel.Section title="Recently Used">
              <Action icon={Icon.XMarkCircle} title="Remove From Recently Used" onAction={() => adUsed(item)} />
              <Action icon={Icon.XMarkCircle} title="Clear All Recently Used" onAction={clearUsed} />
            </ActionPanel.Section>
          </ActionPanel>
        }
      />
    );
  };

  const CategoryFilter = ({ onChange }: { onChange: (value: string) => void }) => {
    return (
      <Grid.Dropdown storeValue tooltip="Category" onChange={onChange}>
        <Grid.Dropdown.Section title="Category">
          <Grid.Dropdown.Item icon={Icon.Tag} value="all" title="All" />

          {allCategories.map((cat) => (
            <Grid.Dropdown.Item key={cat.name} icon={Icon.Tag} value={cat.name} title={cat.name} />
          ))}
        </Grid.Dropdown.Section>
      </Grid.Dropdown>
    );
  };

  // const Filter = ({ onChange }: { onChange: (value: string) => void }) => {
  //   return (
  //     <Grid.Dropdown storeValue tooltip="Filter friends" onChange={onChange}>
  //       <Grid.Dropdown.Section title="Filter friends">
  //         <Grid.Dropdown.Item icon={Icon.TwoPeople} value="all" title="All" />
  //         <Grid.Dropdown.Item icon={Icon.Person} value="solo" title="Solo" />

  //         {friends.map(({ id, name }, i) => (
  //           <Grid.Dropdown.Item icon={Icon.PersonCircle} key={id} value={id} title={`${name || `Friend ${i}`}`} />
  //         ))}
  //       </Grid.Dropdown.Section>
  //     </Grid.Dropdown>
  //   );
  // };

  const handleCopy = async (src: string) => {
    await getAndCopy(src);
    showHUD("Copied");
  };

  return (
    <Grid
      columns={Number(pref.columns)}
      aspectRatio="1"
      fit={Grid.Fit.Contain}
      searchBarPlaceholder="Search for Emojis"
      searchBarAccessory={<CategoryFilter onChange={(value) => setFilterCategory(value)} />}
    >
      {used.length > 0 && (
        <Grid.Section columns={5} aspectRatio="3/2" title="Recently used" subtitle={`${used.length}`}>
          {used.map((item) => (
            <EmojiGridItem key={item.src} item={item} />
          ))}
        </Grid.Section>
      )}

      {results.length > 0 && (
        <Grid.Section title="Emojis" subtitle={`${results.length}`}>
          {results.map((item) => (
            <EmojiGridItem key={item.src} item={item} />
          ))}
        </Grid.Section>
      )}
    </Grid>
  );
}
