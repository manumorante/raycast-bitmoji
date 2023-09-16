import { readFileSync, writeFileSync } from "fs";

const emojis = []
const brands = []
const outfits = []

const removeID = (str) => str.replace(/\d{9}_1(_|-)s1/, "%s")

const parse = ({item, friends}) => {
  return {
    "title": item.alt_text || item.tags.slice(0, 1).join(' '),    
    "description": item.descriptive_alt_text || '',
    "src": item.src,
    "tags": [...new Set(item.tags.map(tag => tag.replaceAll("*", "")))],
    "friends": friends,
  }
}

const data = JSON.parse(readFileSync('./templates.json', 'utf8'))

data.imoji.map(item => {
  emojis.push(parse({item, friends: false}))
})

data.friends.map(item => {
  emojis.push(parse({item, friends: true}))
})

data.outfits.male.brands.map(brand => {
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

writeFileSync('./emojis.json', JSON.stringify(uniqueEmojis, null, 2));
writeFileSync('./brands.json', JSON.stringify(uniqueBrands, null, 2));
writeFileSync('./outfits.json', JSON.stringify(uniqueOutfits, null, 2));