import { Grid, Cache } from "@raycast/api";
import { emojis, pref } from "./data";
import CategoryFilter from "./components/category-filter";
import EmojiItem from "./components/emoji-item";
import { Emoji } from "./types";
import { useEffect, useState } from "react";

const cache = new Cache();

export default function Command() {
  const [query, setQuery] = useState("");
  const [friend, setFriend] = useState({ id: "", name: "" });
  const [filterCat, setFilterCat] = useState("");
  const [results, setResults] = useState<Emoji[]>([]);

  const recentCached = cache.get("recent-emojis");
  const recentsSRC = recentCached ? JSON.parse(recentCached) : [];
  const recentsEmojis = emojis.filter((e) => recentsSRC.includes(e.src));

  const addRecent = (src: string) => {
    const recents = [src, ...recentsSRC.filter((str: string) => str !== src)];
    cache.set("recent-emojis", JSON.stringify(recents.slice(0, 5)));
  };

  const removeRecentItem = (src: string) => {
    const recents = recentsSRC.filter((str: string) => str !== src);
    cache.set("recent-emojis", JSON.stringify(recents));
  };

  const clearRecent = () => {
    cache.remove("recent-emojis");
  };

  useEffect(() => {
    const isFriend = !["solo", ""].includes(friend.id);

    const res = emojis.filter(
      (e) =>
        e.friends === isFriend &&
        (filterCat === "" || e.categories.includes(filterCat)) &&
        (e.tags.some((k) => k.includes(query)) || e.title.includes(query) || e.description.includes(query))
    );

    res.sort(() => Math.random() - 0.5);

    setResults(res);
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
          {recentsEmojis.map((item) => (
            <EmojiItem
              key={item.src}
              item={item}
              friend={friend}
              setFriend={setFriend}
              setQuery={setQuery}
              addRecent={addRecent}
              removeRecentItem={removeRecentItem}
              clearRecent={clearRecent}
            />
          ))}
        </Grid.Section>
      )}

      {results.length > 0 && (
        <Grid.Section title={friend.id ? `You & ${friend.name}` : "Emojis"} subtitle={`${results.length}`}>
          {results.map((item) => (
            <EmojiItem
              key={item.src}
              item={item}
              friend={friend}
              setFriend={setFriend}
              setQuery={setQuery}
              addRecent={addRecent}
              removeRecentItem={removeRecentItem}
              clearRecent={clearRecent}
            />
          ))}
        </Grid.Section>
      )}
    </Grid>
  );
}
