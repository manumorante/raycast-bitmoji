import { getPreferenceValues, environment } from "@raycast/api";
import data from "./data.json";
export const emojis = data.emojis;
export const categories = data.categories;
export { default as friends } from "./friends.json";
import { image } from "image-downloader";
import { runAppleScript } from "run-applescript";

export const pref = getPreferenceValues();

export const addID = ({ src }: { src: string }) => {
  if (!pref.myID) return src;

  // Replace user ID pattern with '%s' placeholder
  src = src.replace(/\d{9}_1(_|-)s1/, "%s");

  // Replace placeholder with my user ID
  src = src.replace("%s", pref.myID);

  return src;
};

export const imagePah = `${environment.supportPath}/bitmoji.png`;

export const getAndCopy = async (src: string) => {
  await image({ url: src, dest: imagePah }).catch((e) => console.log("Error", e));
  await runAppleScript(`set the clipboard to POSIX file "${imagePah}"`);
};
