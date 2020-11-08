const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user")
const categoryRoutes = require("./routes/category")
const productRoutes = require("./routes/product")

// app
const app = express();

//middlewares
app.use(morgan("dev")); //used to log requests on to the console
app.use(bodyParser.json()); // used to parse the body to the controllers
app.use(cookieParser()); 
app.use(expressValidator());

// routes middlewares
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes)

// db
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected"));
  
// defining the port number in .env file
const port = process.env.PORT || 8000;


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
