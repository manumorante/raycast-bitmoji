import { getPreferenceValues, environment } from "@raycast/api";
export { default as emojis } from "../data/emojis.json";
export { default as brands } from "../data/brands.json";
export { default as outfits } from "../data/outfits.json";
import _friends from "../data/friends.json";
import { image } from "image-downloader";
import { runAppleScript } from "run-applescript";

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
  ..._friends,
];

export const addID = ({ src, friend }: { src: string; friend?: string }) => {
  if (!pref.myID) return src;

  friend = friend || pref.myID;

  // Replace user ID pattern with '%s' placeholder
  src = src.replace(/\d{9}_1(_|-)s1/, "%s");

  // Replace placeholder with my user ID
  src = src.replace("%s", pref.myID);

  // Replace second placeholder with friend's user ID
  if (friend) src = src.replace(/%s/g, friend);

  return src;
};

const imagePah = `${environment.supportPath}/bitmoji.png`;

export const getImage = async (src: string) => {
  await image({ url: src, dest: imagePah }).catch((e) => console.log("Error", e));
};

export const copyImage = async () => {
  await runAppleScript(`set the clipboard to POSIX file "${imagePah}"`);
};
