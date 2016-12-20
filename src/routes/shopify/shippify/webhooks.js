const Router = require('express').Router
const ShopifyApp = require('./../../../models/ShopifyApp')
const ServerResponse = require('./../../../utils/server-response')
const verifyShopifyWebhook = require('./../../middlewares/verify-shopify-webhook')

const verifyShippifyAppWebhook = verifyShopifyWebhook(ShopifyApp.shippify)

const router = new Router()

// TODO: Call Shippify API. Base on this https://help.shopify.com/api/reference/webhook

router.post('/orders/create', verifyShippifyAppWebhook, (request, response) => {
  return ServerResponse.noContent().respond(response)
})

module.exports = router
