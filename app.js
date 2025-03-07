require("dotenv").config();

const express = require("express");
const homeSliderRouter = require("./routes/homeSliderRouter");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/admin", homeSliderRouter);

app.get("/", (req, res) => {
  res.json({ msg: "Working" });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
