const redis = require('./../services/db/redis')
const shopify = require('./../services/shopify')

class ShopifyApp {
  constructor({ key: apiKey, secret: sharedSecret, redirect: redirectUri, scopes, webhooks = [] }) {
    this.key = apiKey
    this.token = new shopify.Token({ apiKey, sharedSecret, redirectUri, scopes })
    this.webhooks = webhooks
  }

  createShopTokenKey(shop) {
    return `shopify:app:${this.key}:shop:${shop}:token`
  }

  getTokenFromDB(shop) {
    return new Promise((resolve, reject) => {
      const shopTokenKey = this.createShopTokenKey(shop)
      redis.connect().get(shopTokenKey, (error, token) => {
        if (error) return reject(error)
        return resolve(token)
      })
    })
  }

  setTokenToDB(shop, token) {
    return new Promise((resolve, reject) => {
      const shopTokenKey = this.createShopTokenKey(shop)
      redis.connect().set(shopTokenKey, token, (error) => {
        if (error) return reject(error)
        return resolve()
      })
    })
  }

  api(shop, token) {
    return new shopify.API({
      shopName: shop.replace('.myshopify.com', ''),
      accessToken: token
    })
  }

  createWebhooksIfNeeded(shop, token) {
    const shopifyAPI = this.api(shop, token)
    return shopifyAPI.list()
    .then(webhooks => {
      const missingWebhooks = webhooks.filter(webhook => this.webhooks
        .some(myWebhook => myWebhook.topic === webhook.topic && myWebhook.address === webhook.address)
      )
      return Promise.all(
        missingWebhooks.map(({ topic, address }) => shopifyAPI.webhook.create({
          topic,
          address,
          format: 'json'
        }))
      )
    })
  }
}

const { APP_URL, SHOPIFY_SHIPPIFY_API_KEY, SHOPIFY_SHIPPIFY_API_SECRET } = process.env

ShopifyApp.shippify = new ShopifyApp({
  key: SHOPIFY_SHIPPIFY_API_KEY,
  secret: SHOPIFY_SHIPPIFY_API_SECRET,
  redirect: `https://${APP_URL}/shippify/auth`,
  scopes: ['read_orders'],
  webhooks: [
    { topic: 'orders/create', address: `https://${APP_URL}/shippify/orders/create` }
  ]
})

module.exports = ShopifyApp
