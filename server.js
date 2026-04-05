const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const MY_DOMAIN = "rprox.onrender.com";

app.use(express.static("public"));

function rewriteHTML(html, base) {
  return html.replace(/(href|src)="(.*?)"/g, (match, attr, link) => {
    if (!link || link.startsWith("#") || link.startsWith("javascript:")) {
      return match;
    }

    try {
      let newUrl;

      if (link.startsWith("http")) {
        newUrl = link;
      } else {
        newUrl = new URL(link, base).href;
      }

      return `${attr}="/proxy?url=${encodeURIComponent(newUrl)}"`;
    } catch {
      return match;
    }
  });
}

app.get("/proxy", async (req, res) => {
  let target = req.query.url;

  if (!target) return res.send("Missing URL");

  if (!target.startsWith("http")) {
    target = "https://" + target;
  }

  if (target.includes(MY_DOMAIN)) {
    return res.redirect("/");
  }

  try {
    const response = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const contentType = response.headers.get("content-type") || "";

    res.set("Content-Type", contentType);

    if (contentType.includes("text/html")) {
      let data = await response.text();

      data = rewriteHTML(data, target);

      res.send(data);
    } else {
      const buffer = await response.buffer();
      res.send(buffer);
    }

  } catch (err) {
    res.send("Error loading site");
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on " + PORT));
