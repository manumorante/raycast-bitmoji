import { readFileSync, writeFileSync } from "fs";

console.clear()

const raw = JSON.parse(readFileSync('./templates.json', 'utf8'))

const emojis = []

const normalizeCats = (cats) => {
  return [...new Set(cats.map(cat => normalizeCat(cat)))]
}

const nokeys = [
  '#mt',
  'key',
  'venmo',
  'textless',
  'textess',
  'text',
  'com',
  'meme',
  'interactive',
  'removed',
  'removedfriend',
  'hold',
  'hometab',
  'batcha',
  'ko',
  'bust',
  'mood'
];

const mergeKeys = [
  { key: 'posvibes', merge: 'positive' },
  { key: 'ilove', merge: 'love' },
  { key: 'loveyou', merge: 'love' },
  { key: 'romance', merge: 'love' },
  { key: 'lovethisquicksend', merge: 'love' },
  { key: 'urwelcome', merge: 'hello' },
  { key: 'bdaycom', merge: 'bday' },
  { key: 'waaahquicksend', merge: 'waaah' },
  { key: 'yayquicksend', merge: 'yay' },
  { key: 'yayrandom', merge: 'yay' },
  { key: 'lolquicksend', merge: 'lol' },
  { key: 'waaaah', merge: 'waaah' },
]

const normalizeCat = (cat) => {
  const normalizedCat = [...new Set(cat.split('_').map(c => c.replace(/\d+$/, '')).filter(c => !nokeys.includes(c)))];
  const merged = normalizedCat.map(c => {
    const merge = mergeKeys.find(m => m.key === c);
    if(merge) return merge.merge;
    return c;
  });
  return merged.join('_');
}

const normalizeTags = (tags) => {
  return [...new Set(tags.map(tag => {
    tag = tag.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // remove accents
    // tag = tag.replaceAll(/(.)\1+/g, "$1"); // remove consecutive repeated characters
    return tag.replaceAll("*", ""); // remove asterisks
  }))];
}

const parse = ({item}) => {
  const tags = normalizeTags(item.tags)
  return {
    "title": item.alt_text || tags.slice(0, 1).join(),
    "description": item.descriptive_alt_text || '',
    "src": item.src,
    "tags": tags,
    "supertag": item.supertags[0].replace("#", ""),
    "categories": normalizeCats(item.categories),
  }
}

raw.imoji.map(item => {
  emojis.push(parse({item}))
})

const categoriesFlat = [
  ...new Set(
    emojis.flatMap((item) => item.categories)
  ),
];

const categories = []
categoriesFlat.map(cat => {
  categories.push({
    "name": cat,
    "count": emojis.filter(el =>
      el.categories.some(c => c.includes(cat))
    ).length
  })
})

categories.sort((a, b) => b.count - a.count)

console.log(categories)

const uniqueEmojis = [...new Map(emojis.map(item => [item.src, item])).values()]

const data = {
  "emojis": uniqueEmojis,
  "categories": categories,
}

writeFileSync('./data.json', JSON.stringify(data, null, 2));