const
  express     = require('express'),
  got         = require('got'),
  cors        = require('cors'),
  uuid        = require('uuid/v1'),
  fs          = require('fs'),
  path        = require('path'),
  token       = require('google-translate-token'),
  localtunnel = require('localtunnel'),
  languages   = require('./languages')

const
  app       = express(),
  port      = process.env.PORT || 1337,
  subdomain = 'nhapgicungduoc'

const tunnel = localtunnel(port, { subdomain }, (err, { url }) => {
  if(err) return console.log(err)
  console.log(url)
})

const message = text => ({
  "messages": [
    { text }
  ]
})

const audio = url => ({
  "messages": [
    {
      text: `Tải xuống tại đây ${url}`
    },
    {
      "attachment": {
        "type": "audio",
        "payload": { url }
      }
    }
  ]
})

app.use(cors())
app.use(express.static(path.join(__dirname, 'downloads')))

app.get('/', async (req, res) => {
  const { q, tl } = req.query

  if(!q || !tl) return res.send(message('Vui lòng nhập đủ các trường yêu cầu!'))
  if(!(tl in languages)) return res.send(message('Không hỗ trợ ngôn ngữ này :)'))

  const filename  = `${uuid()}.mp3`
  const { value } = await token.get(q)
  const stream    = await got.stream(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(q)}&tl=${tl}&total=1&idx=0&textlen=${q.length}&tk=${value}&client=t`)

  stream.pipe(fs.createWriteStream(`downloads/${filename}`))
  res.send(audio(`${tunnel.url}/${filename}`))
})

app.listen(port, () => console.log(`Server is listening on port ${port}`))
