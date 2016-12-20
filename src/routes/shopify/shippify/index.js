const Router = require('express').Router
const ShopifyApp = require('./../../../models/ShopifyApp')
const ServerResponse = require('./../../../utils/server-response')

const webhooksRouter = require('./webhooks')

const shopifyApp = ShopifyApp.shippify

const router = new Router()

router.get('/install', (request, response) => {
  const { shop } = request.query
  const authUrl = shopifyApp.token.generateAuthUrl(shop)
  return response.redirect(authUrl)
})

router.get('/auth', (request, response) => {
  const query = Object.assign({}, request.query)

  const ok = shopifyApp.token.verifyHmac(query)
  if (!ok) return ServerResponse.unauthenticated().respond(response)

  const { shop, code } = request.query
  return shopifyApp.token.getAccessToken(shop, code)
  .then(token => shopifyApp.setTokenToDB(shop, token)
    .then(() => shopifyApp.createWebhooksIfNeeded(shop, token))
    .then(() => {
      // TODO: Return redirect URL
    })
  )
  .catch(error => ServerResponse.build(error).respond(response))
})

router.use('/webhooks/', webhooksRouter)

module.exports = router
