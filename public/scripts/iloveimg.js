const axios = require('axios')
const fs = require('fs')
const FormData = require('form-data')

const config = ['2', '4']

async function gettoken() {
  const html = await axios.get('https://www.iloveimg.com/upscale-image').then(r => r.data)
  const token = html.match(/"token":"(eyJ[^"]+)"/)?.[1]
  const task = html.match(/ilovepdfConfig\\.taskId\\s*=\\s*'([^']+)'/)?.[1]
  return { token, task }
}

async function upimage(img, token, task) {
  const form = new FormData()
  form.append('name', img.split('/').pop())
  form.append('chunk', '0')
  form.append('chunks', '1')
  form.append('task', task)
  form.append('preview', '1')
  form.append('v', 'web.0')
  form.append('file', fs.createReadStream(img))

  const r = await axios.post('https://api29g.iloveimg.com/v1/upload',
    form,
    {
      headers: {
        ...form.getHeaders(),
        Authorization: \`Bearer \${token}\