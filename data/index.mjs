import { readFileSync, writeFileSync } from "fs";

console.clear()

const raw = JSON.parse(readFileSync('./templates.json', 'utf8'))

const emojis = []
const brands = []
const outfits = []

// Utils
const removeID = (str) => str.replace(/\d{9}_1(_|-)s1/, "%s")

const normalizeCats = (cats) => {
  return [...new Set(cats.map(cat => normalizeCat(cat)))]
}

const normalizeCat = (cat) => {
  const nokeys = ['#mt', 'key', 'venmo', 'textless', 'textess', 'text', 'com', 'interactive', 'removed', 'hold', 'hometab'];
  const normalizedCat = [...new Set(cat.split('_').map(c => c.replace(/\d+$/, '')).filter(c => !nokeys.includes(c)))];
  return normalizedCat.join('_');
}

const normalizeTags = (tags) => {
  return [...new Set(tags.map(tag => {
    tag = tag.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // remove accents
    tag = tag.replaceAll(/(.)\1+/g, "$1"); // remove consecutive repeated characters
    return tag.replaceAll("*", ""); // remove asterisks
  }))];
}


const parse = ({item, friends}) => {
  const tags = normalizeTags(item.tags)
  return {
    "title": item.alt_text || tags.slice(0, 1).join(),
    "description": item.descriptive_alt_text || '',
    "src": item.src,
    "tags": tags,
    "supertag": item.supertags[0].replace("#", ""),
    "categories": normalizeCats(item.categories),
    "friends": friends,
  }
}

raw.imoji.map(item => {
  emojis.push(parse({item, friends: false}))
})

const categories = [...new Set(
  raw.imoji.reduce((acc, item) => {
    const itemCats = [...new Set(item.categories.map(cat => normalizeCat(cat)))];
    return [...acc, ...itemCats];
  }, [])
)];


const categoriesCount = []
categories.map(cat => {
  categoriesCount.push({
    "name": cat,
    "count": raw.imoji.filter(el =>
      el.categories.some(c => c.includes(cat))
    ).length
  })
})

categoriesCount.sort((a, b) => b.count - a.count)

// console.log(categoriesCount)

raw.friends.map(item => {
  emojis.push(parse({item, friends: true}))
})

raw.outfits.male.brands.map(brand => {
  brands.push({
    "id": `${brand.id}`,
    "title": brand.name,
    "src": brand.logo,
  })

  brand.outfits.map(outfit => {
    outfits.push({
      "brand": `${brand.id}`,
      "id": `${outfit.id}`,
      "src": removeID(outfit.image),
    })
  })
})

const uniqueEmojis = [...new Map(emojis.map(item => [item.src, item])).values()]
const uniqueBrands = [...new Map(brands.map(item => [item.id, item])).values()]
const uniqueOutfits = [...new Map(outfits.map(item => [item.src, item])).values()]

const data = {
  "emojis": uniqueEmojis,
  "categories": categoriesCount,
  "brands": uniqueBrands,
  "outfits": uniqueOutfits,
}

writeFileSync('./data.json', JSON.stringify(data, null, 2));