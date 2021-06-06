const stripe = require("stripe")(
  "sk_test_51IvQ82SJVrKhBkqWOULGtnq7aqACz1U7ZTsNkHtNQyMSzeqv8lkuEiuIGryJ8OaI6E1UEzCXEXC2m6W1N1OiDiDB008JHjEpGq"
);

exports.payment = async (req, res) => {
  const { product } = req.body;
  const domainURL = process.env.WEB_APP_URL;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: product.name,
          },
          unit_amount: product.price * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${domainURL}/checkout/success`,
    cancel_url: `${domainURL}/product/${product.category._id}`,
  });
  res.json({ id: session.id });
};
