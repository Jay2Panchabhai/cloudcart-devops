require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const productRoutes = require("./routes/products");

const app = express();
const PORT = process.env.PORT || 3002;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

app.use("/api/products", productRoutes);
app.get("/health", (req, res) =>
  res.json({ status: "ok", service: "product-service" }),
);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Product Service running on port ${PORT}`);
});