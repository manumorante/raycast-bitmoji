import { Grid, Cache } from "@raycast/api";
import { emojis, pref } from "./data";
import CategoryFilter from "./components/category-filter";
import EmojiItem from "./components/emoji-item";
import { Emoji } from "./types";
import { useEffect, useState } from "react";

const cache = new Cache();

export default function Command() {
  const [query, setQuery] = useState("");
  const [friend, setFriend] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [results, setResults] = useState<Emoji[]>([]);

  const cached = cache.get("recently-used");
  const recentsSRC = cached ? JSON.parse(cached) : [];
  const recentsEmojis = emojis.filter((e) => recentsSRC.includes(e.src));

  const adUsed = (src: string) => {
    const recents = recentsSRC.filter((str: string) => str !== src);
    recents.unshift(src);
    cache.set("recently-used", JSON.stringify(recents));
  };

  const removeUsed = (src: string) => {
    const recents = recentsSRC.filter((str: string) => str !== src);
    cache.set("recently-used", JSON.stringify(recents));
  };

  const clearUsed = () => {
    cache.remove("recently-used");
  };

  useEffect(() => {
    const isFriend = !["solo", ""].includes(friend);

    setResults(
      emojis.filter(
        (e) =>
          e.friends === isFriend &&
          (filterCat === "" || e.categories.includes(filterCat)) &&
          (e.tags.some((k) => k.includes(query)) || e.title.includes(query) || e.description.includes(query))
      )
    );
  }, [query, filterCat, friend]);

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
        <CategoryFilter
          active={filterCat}
          onChange={(cat) => {
            setQuery("");
            setFilterCat(cat);
          }}
        />
      }
    >
      {recentsEmojis.length > 0 && (
        <Grid.Section columns={5} aspectRatio="3/2" title="Recently used" subtitle={`${recentsEmojis.length}`}>
          {recentsEmojis.slice(0, 5).map((item) => (
            <EmojiItem
              key={item.src}
              item={item}
              friend={friend}
              setFriend={setFriend}
              setQuery={setQuery}
              adUsed={adUsed}
              removeUsed={removeUsed}
              clearUsed={clearUsed}
            />
          ))}
        </Grid.Section>
      )}

      {results.length > 0 && (
        <Grid.Section title="Emojis" subtitle={`${results.length}`}>
          {results.map((item) => (
            <EmojiItem
              key={item.src}
              item={item}
              friend={friend}
              setFriend={setFriend}
              setQuery={setQuery}
              adUsed={adUsed}
              removeUsed={removeUsed}
              clearUsed={clearUsed}
            />
          ))}
        </Grid.Section>
      )}
    </Grid>
  );
}
