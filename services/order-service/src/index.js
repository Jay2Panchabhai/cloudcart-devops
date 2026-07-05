require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const orderRoutes = require("./routes/orders");

const app = express();
const PORT = process.env.PORT || 3004;

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/orders", orderRoutes);
app.get("/health", (req, res) =>
  res.json({ status: "ok", service: "order-service" }),
);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Order Service running on port ${PORT}`);
});