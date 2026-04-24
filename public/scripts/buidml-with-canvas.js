import axios from "axios"

const API = "https://api.theresav.biz.id/game/ml/build"
const CANVAS = "https://api.theresav.biz.id/canvas/ml/build"

const APIKEY = global.apikey //Apikey silakan daftar di api.theresav.biz.id/register

async function getBuild(hero) {
  const { data } = await axios.get(
    \`\${API}?apikey=\${APIKEY}&hero=\${encodeURIComponent(hero)}\`
  )

  if (!data?.status) throw new Error("Hero tidak ditemukan")

  return data
}

let handler = async (m, { conn, text, usedPrefix, command }) => {

  if (!text) {
    return m.reply(\`Contoh:\\n\${usedPrefix + command} marcel\`)
  }

  // user pilih build
  if (text.includes("|")) {

    const [hero, id] = text.split("|")

    const img = \`\${CANVAS}?hero=\${hero}&id=\${id}\`

    await conn.sendMessage(
      m.chat,
      {
        image: { url: img },
        caption: \`🎮 *Mobile Legends Build*\\nHero: *\${hero}*\