const express = require("express");
const cors = require("cors");// to allow requests from a different location.
require("dotenv").config();

const { initDB } = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/posts", require("./routes/postsRoutes"));

const PORT = process.env.PORT || 3000;

(async () => {
    await initDB();

    app.listen(PORT, () => {
        console.log("Server running on " + PORT);
    });
})();
