require("dotenv").config();

const express = require("express");
const cors = require("cors");

const adminHomeSliderRouter = require("./routes/adminHomeSliderRouter");
const adminUserRouter = require("./routes/adminUserRouter");
const adminHomeReviewRouter = require("./routes/adminHomeReviewRouter");
const clientRouter = require("./routes/clientRouter");
const adsRouter = require("./routes/adsRouter");
const flatRouter = require("./routes/flatRouter");
const projectRouter = require("./routes/adminProjectRouter");
const ownerRouter = require("./routes/adminOwnerRouter");
const landRouter = require("./routes/adminLandDetailsRouter");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// const corsOptions = {
//   origin: "http://localhost:3000",
//   methods: "GET,POST,PUT,DELETE",
//   allowedHeaders: "Content-Type,Authorization",
//   credentials: true,
// };

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://test.chirosobujgroup.com",
    "https://chirosobujgroup.com/",
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
};

app.use(cors(corsOptions));

app.use("/admin", adminHomeSliderRouter);
app.use("/admin", adminUserRouter);
app.use("/admin/client-review", adminHomeReviewRouter);
app.use("/admin/ads", adsRouter);
app.use("/admin/flat", flatRouter);
app.use("/admin/project", projectRouter);
app.use("/admin/owner", ownerRouter);
app.use("/admin/land-details", landRouter);
app.use("/", clientRouter);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
    console.log(`Server is running...`);
});
