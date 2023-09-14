import { getPreferenceValues } from "@raycast/api";
import { imoji } from "./data.json";

const preferences = getPreferenceValues();
const DEFAULT_AVATAR = "20246000_31-s1";

export const hasAvatar = preferences.avatarID !== undefined;
export const avatarID = hasAvatar ? preferences.avatarID : DEFAULT_AVATAR;
const uniqueTemplates = [...new Map(imoji.map((item) => [item.src, item])).values()];
export const templates = uniqueTemplates.map((template) => {
  template.src = template.src.replace("%s", avatarID);
  return template;
});
