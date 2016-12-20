require('dotenv').config()

const express = require('express')

const morgan = require('morgan')
const bodyParser = require('body-parser')
const shippifyShopifyRouter = require('./routes/shopify/shippify')

const app = express()

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/shippify', shippifyShopifyRouter)

const server = app.listen(3000)
