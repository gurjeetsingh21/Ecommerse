const stripe = require("stripe")(
  "sk_test_51IvQ82SJVrKhBkqWOULGtnq7aqACz1U7ZTsNkHtNQyMSzeqv8lkuEiuIGryJ8OaI6E1UEzCXEXC2m6W1N1OiDiDB008JHjEpGq"
);
const fs = require("fs");

exports.payment = async (req, res) => {
  const { product } = req.body;
  const domainURL = process.env.WEB_APP_URL;
  console.log(req.product);
  const buffer = Buffer.from(req.product.photo.data.buffer);
  fs.writeFileSync("assets/img/new-path.jpg", buffer);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: product.name,
            images: [`assets/img/new-path.jpg`],
          },
          unit_amount: product.price * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${domainURL}/checkout/success`,
    cancel_url: `${domainURL}/home`,
  });
  res.json({ id: session.id });
};
