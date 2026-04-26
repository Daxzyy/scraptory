//HERXA
//BASE : https://instagram.com/
const { execSync } = require('child_process')

const RAW_COOKIES = [
  //UDH NYOLI BELUM
]

function stringify(cookies) {
  return cookies.map(c => `${c.name}=${c.value}`).join('; ')
}

function igdl(url) {
  const shortcode = url.match(/\/(reel|p)\/([A-Za-z0-9_-]+)/)?.[2]
  if (!shortcode) return { author: 'Herza', success: false, error: 'Invalid URL' }

  const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
  let n = BigInt(0)
  for (const c of shortcode) n = n * BigInt(64) + BigInt(alpha.indexOf(c))
  const mediaId = n.toString()

  const cookieStr = stringify(RAW_COOKIES)
  const csrftoken = RAW_COOKIES.find(c => c.name === 'csrftoken')?.value

  const cmd = `curl -s "https://www.instagram.com/api/v1/media/${mediaId}/info/" \
    -H "Cookie: ${cookieStr}" \
    -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36" \
    -H "X-CSRFToken: ${csrftoken}" \
    -H "X-IG-App-ID: 936619743392459" \
    -H "Referer: https://www.instagram.com/"`

  try {
    const raw = execSync(cmd, { maxBuffer: 10 * 1024 * 1024 }).toString()
    const json = JSON.parse(raw)

    if (!json.items?.[0]) return { author: 'Herza', success: false, error: json.message || 'Unknown error' }

    const item = json.items[0]
    const user = item.user
    const mediaType = item.media_type

    const parseMedia = (m) => {
      if (m.media_type === 2) {
        return {
          type: 'video',
          url: m.video_versions[0].url,
          thumbnail: m.image_versions2.candidates[0].url
        }
      }
      return {
        type: 'photo',
        url: m.image_versions2.candidates[0].url,
        thumbnail: m.image_versions2.candidates[0].url
      }
    }

    let media_metadata

    if (mediaType === 8) {
      media_metadata = {
        type: 'carousel',
        slides: item.carousel_media.map(parseMedia)
      }
    } else {
      media_metadata = parseMedia(item)
    }

    return {
      author: 'Herza',
      success: true,
      data: {
        author_metadata: {
          username: user.username,
          photo_profile: user.profile_pic_url
        },
        media_metadata: {
          likes: item.like_count,
          comments: item.comment_count,
          shares: item.media_repost_count ?? 0,
          repost: item.clips_metadata?.mashup_info?.non_privacy_filtered_mashups_media_count ?? 0,
          thumbnail: item.image_versions2.candidates[0].url,
          ...media_metadata
        }
      }
    }
  } catch (e) {
    return { author: 'Herza', success: false, error: e.message }
  }
}

module.exports = igdl