const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const cors = require("cors")
const stripe = require("stripe")(process.env.STRIPE_SECRET)
const helmet = require("helmet")

const adminRoutes = require("./routes/admin")
const userRoutes = require("./routes/user")
const productRoutes = require("./routes/product")
const categoryRoutes = require("./routes/category")
const orderRoutes = require("./routes/order")
const cartRoutes = require("./routes/cart")
const checkAuth = require("./middlewares/checkAuth")
const { errorHandler } = require("./utils")
const User = require("./models/user")

const app = express()

app.use(helmet())

app.use(express.json())

app.use(cors())

app.use("/admin", adminRoutes)
app.use("/user", userRoutes)
app.use("/product", productRoutes)
app.use("/category", categoryRoutes)
app.use("/order", orderRoutes)
app.use("/cart", cartRoutes)

// Creating PaymentIntent to send the ClientSecret to the client
app.post(
  "/create-payment-intent",
  checkAuth("user"),
  async (req, res, next) => {
    try {
      const user = await User.findById(req.userId)
      const paymentIntent = await stripe.paymentIntents.create({
        // Stripe accept the amount in cents
        amount: parseInt(user.cart.price * 100),
        currency: "usd"
      })
      res.json({ clientSecret: paymentIntent.client_secret })
    } catch (error) {
      errorHandler(next, error.message)
    }
  }
)

app.use((error, req, res, next) => {
  res.status(error.status).json({ message: error.message })
})
;(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  app.listen(process.env.PORT || 5000, () => console.log("Server started!"))
})()
