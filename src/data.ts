import { getPreferenceValues } from "@raycast/api";
import data from "./data.json";

export const preferences = getPreferenceValues();

// Friends
const _friends = [...new Map(data.friends.map((emo) => [emo.src, emo])).values()];
_friends.sort(() => Math.random() - 0.5);
const friendsID = _friends.map((emo) => {
  emo.src = emo.src.replace("%s", preferences.avatarID).replace("%s", preferences.friendID || preferences.avatarID);
  return emo;
});

// Emojis
const _solos = [...new Map(data.imoji.map((emo) => [emo.src, emo])).values()];
_solos.sort(() => Math.random() - 0.5);
const solosID = _solos.map((emo) => {
  emo.src = emo.src.replace("%s", preferences.avatarID);
  return emo;
});

export const emojis = {
  solo: solosID,
  friends: friendsID,
};

export const cuteCat = (cat: string) => cat.replaceAll("#mt_", "").replaceAll("_", " ");
