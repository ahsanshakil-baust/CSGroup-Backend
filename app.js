require("dotenv").config();

const express = require("express");
const cors = require("cors");

const homeSliderRouter = require("./routes/homeSliderRouter");
const adminRouter = require("./routes/adminRouter");
const clientRouter = require("./routes/clientRouter");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/admin", homeSliderRouter);
app.use("/admin", adminRouter);
app.use("/", clientRouter);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server is running...`);
});
