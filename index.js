const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const productsRoutes = require("./routes/product");
const authRoutes=require("./routes/auth");
const errorHandler = require("./middleware/errorhandler");
const app = express();
dotenv.config();
const PORT = process.env.PORT || 7000;

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "workinyrdydg"
    });
});
app.use("/auth",authRoutes)
app.use("/products", productsRoutes)

app.use((req, res) => {
    res.status(404).json({
        message: "Page not found fufuf"
    })
})
app.use(errorHandler);

app.listen(PORT, () => {
    connectDB();
    console.log(`server listening on http://localhost:${PORT}`);
})