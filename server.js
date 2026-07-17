const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());


app.get("/", (req, res) => {
    res.send("Kimchi API is online");
});


app.get("/search", async (req, res) => {

    const query = req.query.q;

    if (!query) {
        return res.json({
            error: "No search term"
        });
    }


    try {

        const response = await axios.get(
            "https://api.duckduckgo.com/",
            {
                params: {
                    q: query,
                    format: "json",
                    no_html: 1,
                    skip_disambig: 1
                },
                headers: {
                    "User-Agent": "Kimchi Search Engine"
                }
            }
        );


        res.json({
            search: query,
            overview: response.data.AbstractText || "No overview found",
            source: response.data.AbstractSource || "DuckDuckGo",
            sourceURL: response.data.AbstractURL || "",
            related: response.data.RelatedTopics || []
        });


    } catch (error) {

        console.log("DuckDuckGo error:");
        console.log(error.message);

        res.status(500).json({
            error: "DuckDuckGo search failed",
            details: error.message
        });

    }

});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Kimchi API running on port ${PORT}`);
});
