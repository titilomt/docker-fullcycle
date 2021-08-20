const express = require('express')
require('dotenv').config()

const app = express()

const port = process.env.PORT

const registerRouter = require('./src/router/register')

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.get('/', registerRouter)

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  console.error(err.message, err.stack)
  res.status(statusCode).json({'message': err.message})

  return
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})
