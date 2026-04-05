const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();

// Serve frontend
app.use(express.static("public"));

// Proxy endpoint
app.get("/proxy", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.send("Missing ?url=");
  }

  try {
    const response = await fetch(url);
    const contentType = response.headers.get("content-type");

    res.set("Content-Type", contentType);
    const data = await response.buffer();
    res.send(data);

  } catch (err) {
    res.send("Error loading site");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on " + PORT));
