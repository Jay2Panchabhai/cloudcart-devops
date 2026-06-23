require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cartRoutes = require("./routes/cart");

const app = express();
const PORT = process.env.PORT || 3003;

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/cart", cartRoutes);
app.get("/health", (req, res) =>
  res.json({ status: "ok", service: "cart-service" }),
);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Cart Service running on port ${PORT}`);
});