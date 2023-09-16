import { getPreferenceValues } from "@raycast/api";
export { default as emojis } from "../data/emojis.json";
export { default as brands } from "../data/brands.json";
export { default as outfits } from "../data/outfits.json";

export const pref = getPreferenceValues();

export const friends = [
  {
    name: "All",
    id: "all",
  },
  {
    name: "Solo",
    id: "solo",
  },
  {
    name: pref.friendName,
    id: pref.friendID,
  },
  {
    name: "Juan",
    id: "0000",
  },
];

export const addID = ({ src, friend }: { src: string; friend?: string }) => {
  if (!pref.myID) return src;

  friend = friend || pref.friendID;

  // Replace user ID pattern with '%s' placeholder
  src = src.replace(/\d{9}_1(_|-)s1/, "%s");

  // Replace placeholder with my user ID
  src = src.replace("%s", pref.myID);

  // Replace second placeholder with friend's user ID
  if (friend) src = src.replace(/%s/g, friend);

  return src;
};
