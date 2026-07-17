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

        const response = await axios.get(
            "https://html.duckduckgo.com/html/",
            {
                params: {
                    q: query
                },

                headers: {
                    "User-Agent": "Mozilla/5.0 Kimchi Browser"
                },

                timeout: 10000
            }
        );


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
                    title: title,
                    url: url,
                    snippet: snippet
                });

            }

        });


        res.json({
            search: query,
            count: results.length,
            results: results
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
