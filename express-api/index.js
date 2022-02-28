const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const stripe = require('stripe')('sk_test_51KVsFWG9loJoghgltEwmCYugnjnn6ROqXRB5VBhUU3ojWB7DP3EVUx7EoegIt7kVkbfZWCmsf2zsoGmiOMJlQp7F00jAqkDB3Z');
const port = 4500;
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.post('/pay', async (req, res) => {
  const { email } = req.body;
  console.log(email);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 109900,
    currency: 'usd',
    metadata: { integration_check: 'accept_a_payment' },
    receipt_email: email,
  });
  res.json({ 'client_secret': paymentIntent['client_secret'] })
})

app.post('/basicsubscription', async (req, res) => {
  const { email, payment_method } = req.body;
  const customer = await stripe.customers.create({
    payment_method: payment_method,
    email: email,
    invoice_settings: {
      default_payment_method: payment_method,
    },
  });
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ plan: 'price_1KXlScG9loJoghglEVETL6l0' }],
    expand: ['latest_invoice.payment_intent']
  });
  const status = subscription['latest_invoice']['payment_intent']['status']
  const client_secret = subscription['latest_invoice']['payment_intent']['client_secret']
  res.json({ 'client_secret': client_secret, 'status': status });
})

app.post('/premiumsubscription', async (req, res) => {
  const { email, payment_method } = req.body;
  const customer = await stripe.customers.create({
    payment_method: payment_method,
    email: email,
    invoice_settings: {
      default_payment_method: payment_method,
    },
  });
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ plan: 'price_1KXlUCG9loJoghglOv0DXH7c' }],
    expand: ['latest_invoice.payment_intent']
  });
  const status = subscription['latest_invoice']['payment_intent']['status']
  const client_secret = subscription['latest_invoice']['payment_intent']['client_secret']
  res.json({ 'client_secret': client_secret, 'status': status });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))