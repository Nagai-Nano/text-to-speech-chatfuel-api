const
  express = require('express'),
  cors    = require('cors'),
  path    = require('path')

const
  app  = express(),
  port = process.env.PORT || 1337

app.use(cors())
app.use(express.static(path.join(__dirname, 'downloads')))

app.get('/', (req, res) => res.send('hello'))

app.listen(port, () => console.log(`Server is listening on port ${port}`))
