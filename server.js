const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.use(express.static("public"));

// Catch ALL routes
app.get("*", async (req, res) => {
  let target = req.query.url;

  // First load (from input box)
  if (target) {
    if (!target.startsWith("http")) {
      target = "https://" + target;
    }
  } else {
    return res.send("Use ?url=");
  }

  try {
    const response = await fetch(target);
    const contentType = response.headers.get("content-type");

    res.set("Content-Type", contentType);
    const data = await response.text();

    // Rewrite links so they stay inside proxy
    const fixed = data.replace(/(href|src)="\/(.*?)"/g, (match, p1, p2) => {
      return `${p1}="/?url=${target}/${p2}"`;
    });

    res.send(fixed);

  } catch (err) {
    res.send("Error loading site");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on " + PORT));
