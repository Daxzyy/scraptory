/**
 * @project  : Shizuku-AI (FF Lobby Maker)
 * @author   : @ryuukaaaaaaa
 * @desc     : Create fake FF lobby with custom name using FFmpeg
 */

import { exec } from 'child_process'
import fs from 'fs'
import axios from 'axios'

const imageUrls = {
    1:  'https://cloud-fukushima.vercel.app/uploader/8fjhd6ftps.jpg',
    2:  'https://cloud-fukushima.vercel.app/uploader/oz8hb4ow75.jpg',
    3:  'https://cloud-fukushima.vercel.app/uploader/tvz1cie8df.jpg',
    4:  'https://cloud-fukushima.vercel.app/uploader/yo9sg4vmo3.jpg',
    5:  'https://files.catbox.moe/cuatgd.jpg',
    6:  'https://files.catbox.moe/kfl1lb.jpg',
    7:  'https://files.catbox.moe/8vyh2k.jpg',
    8:  'https://files.catbox.moe/jxzw2r.jpg',
    9:  'https://files.catbox.moe/mmgua4.jpg',
    10: 'https://files.catbox.moe/rcgn6z.jpg',
    11: 'https://files.catbox.moe/v2np8h.jpg'
}

const TOTAL = Object.keys(imageUrls).length

let handler = async (m, { conn, text, command }) => {
    // Menggunakan global.prefix sesuai permintaanmu
    const pref = global.prefix 
    
    if (!text) return m.reply(\`*Format salah!*\\n\\nContoh: \${pref + command} 1|Kyuu Depeloger\`)

    const match = text.trim().match(/^(\\d+)\\s[|\\uff5c\\/]\\s(.+)\$/)
    if (!match) return m.reply(\`*Format salah!*\\n\\nPastikan menggunakan pemisah | (pipe).\\nContoh: \${pref + command} 5|Kyuu\`)

    const num  = match[1]
    const name = match[2].trim()

    const imageUrl = imageUrls[parseInt(num)]
    if (!imageUrl) return m.reply(\`Template [ \${num} ] tidak tersedia. Pilih 1-\${TOTAL}.\`)

    const fontPath = \`/home/container/library/ff-solo/TeutonNormal.otf\`
    if (!fs.existsSync(fontPath)) return m.reply(\`Font system tidak ditemukan.\`)

    const timestamp     = Date.now()
    const tempImagePath = \`./tmp_raw_\${timestamp}.jpg\`
    const outputPath    = \`./tmp_ff_\${timestamp}.jpg\`

    const cleanup = () => {
        [tempImagePath, outputPath].forEach(f => {
            if (fs.existsSync(f)) fs.unlinkSync(f)
        })
    }

    try {
        await m.react('⏳')

        const res = await axios.get(imageUrl, { responseType: 'arraybuffer' })
        fs.writeFileSync(tempImagePath, Buffer.from(res.data))

        const nameLen  = name.length
        const fontSize = nameLen <= 6 ? 'w*0.055' : nameLen <= 10 ? 'w*0.045' : 'w*0.035'
        const safeName = name.trim().replace(/'/g, "\\\\'").replace(/:/g, '\\\\:')

        // FFmpeg Command - Drawing Name
        const ffCmd = [
            'ffmpeg -y',
            \`-i "\${tempImagePath}"\