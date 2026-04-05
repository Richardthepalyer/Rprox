const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.use(express.static("public"));

app.get("*", async (req, res) => {
  let target = req.query.url;

  // If no ?url=, try using referer (previous page)
  if (!target) {
    const referer = req.headers.referer;

    if (referer && referer.includes("?url=")) {
      target = referer.split("?url=")[1];
    } else {
      return res.send("Use ?url=");
    }
  }

  try {
    const response = await fetch(target);
    const contentType = response.headers.get("content-type");

    res.set("Content-Type", contentType);
    let data = await response.text();

    // Rewrite links
    data = data.replace(/(href|src)="(.*?)"/g, (match, attr, link) => {
      if (link.startsWith("http")) {
        return `${attr}="/?url=${link}"`;
      } else {
        return `${attr}="/?url=${target}${link}"`;
      }
    });

    res.send(data);

  } catch (err) {
    res.send("Error loading site");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on " + PORT));
