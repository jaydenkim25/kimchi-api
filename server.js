const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

app.use(cors());
app.use(express.json());


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

        console.log("Searching DuckDuckGo for:", query);


        const response = await axios.get(
            "https://html.duckduckgo.com/html/",
            {
                params: {
                    q: query
                },

                headers: {
                    "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",

                    "Accept":
                    "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
                },

                timeout: 30000
            }
        );


        console.log("DuckDuckGo responded");


        const $ = cheerio.load(response.data);

        let results = [];


        $(".result").each((index, element) => {

            const title = $(element)
                .find(".result__a")
                .text()
                .trim();


            const url = $(element)
                .find(".result__a")
                .attr("href");


            const snippet = $(element)
                .find(".result__snippet")
                .text()
                .trim();


            if (title && url) {

                results.push({
                    title,
                    url,
                    snippet
                });

            }

        });


        res.json({
            search: query,
            count: results.length,
            results
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
