const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
    res.send("Kimchi API is online");
});

app.get("/search", (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.json({
            error: "No search term"
        });
    }

    res.json({
        website: "Kimchi",
        search: query
    });
});

app.listen(3000, () => {
    console.log("Kimchi API running");
});
