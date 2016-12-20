const ServerResponse = require('./../../utils/server-response')

module.exports = function (shopifyApp) {
  return (request, response, next) => {
    const hmac = request.headers['HTTP_X_SHOPIFY_HMAC_SHA256']
    const data = request.body.read
    const query = Object.assign({}, data, { hmac })
    const ok = shopifyApp.token.verifyHmac(query)
    if (!ok) return ServerResponse.unauthenticated.respond(response)

    const shop = request.headers['HTTP_X_SHOPIFY_SHOP_DOMAIN']
    return shopifyApp.getTokenFromDB(shop)
    .then(token => {
      if (!token) throw ServerResponse.unauthenticated()
      request.shopifyAPI = shopifyAPI(shop, token)
      next()
    })
    .catch(error => ServerResponse.build(error).respond(response))
  }
}
