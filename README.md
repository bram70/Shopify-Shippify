# Shopify shippify app

## ShopifyApp

ShopifyApp receives the API key and secret assigned by Shopify, and the URL of this server to authorize the app in a merchant store.

Determined by the nature of the app, the scopes must be defined as found in https://help.shopify.com/api/guides/authentication/oauth#scopes.

ShopifyApp is modeled as a class in /src/models/ShopifyApp.js

**Hint:** The shopify shippify app instance can be fetched as `ShopifyApp.shippify`.

### Webhooks

A ShopifyApp can make use of webhooks that are declared with a topic and an address. Webhook conditional creation is still being tested with the method `createWebhooksIfNeeded()`.

These endpoints should be in /src/routes/shopify/shippify/webhooks.js and referenced in the instantiation of the shopify shippify app at the end of the `/src/models/ShopifyApp.js` file.

## Flow

In https://app.shopify.com/services/partners/api_clients/1511087/edit, a shopify app is assigned an url which installs the app in a merchant store. This endpoint in the app server must redirect to a generated auth url in shopify domain, which then redirects to the auth endpoint in the app server to finalize and setup the app.

In the /auth endpoint after creating the webhooks, the server must redirect to the app front page.

Since shopify sends requests to the app server at the moment of installation, or execution of webhooks, our app must be reachable by the shopify platform. For this intent, we must download a tool like **ngrok** that creates a tunnel between the net and a local-bound app server during development.

## Getting started

1. Download ngrok from https://ngrok.com/.
2. Go to the download directory and run `./ngrok http 3000`.
  * In the console, ngrok will provide a domain with an unique identifier that will map to our local-bound server.
3. The provided domain must be setup in https://app.shopify.com/services/partners/api_clients/1511087/edit as App URL.
4. In the project's .env file APP_URL must also point to the same domain.
5. Run `npm start`.
6. To install and test the app in development, follow the instructions in https://help.shopify.com/api/guides#install-your-app-into-your-development-store.
