const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const PORT = 8080;
const orderRoutes = require("./routes/orders");
dotenv.config();

app.use(cors());
app.use(express.json());

// Route test
app.get("/", (req, res) => {
  res.send("Hello Node.js!");
});

app.use("/api/paypal", orderRoutes);
// Lắng nghe cổng
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
