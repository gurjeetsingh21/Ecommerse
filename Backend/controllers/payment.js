const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const fs = require("fs");

exports.payment = async (req, res) => {
  const products = [...req.body.products];
  const lineItems = [];
  products.map((product) => {
    lineItems.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price * 100,
      },
      quantity: product.count ? product.count : 1,
    });
  });
  const domainURL = process.env.WEB_APP_URL;
  // const buffer = Buffer.from(req.product.photo.data.buffer);
  // fs.writeFileSync("assets/img/new-path.jpg", buffer);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_rates: ["shr_1J2InPSJVrKhBkqW0q0ZuqXo"],
    shipping_address_collection: {
      allowed_countries: ["IN"],
    },
    line_items: lineItems,
    mode: "payment",
    success_url: `${domainURL}/checkout/success`,
    cancel_url: `${domainURL}/home`,
  });
  res.json({ id: session.id });
};
