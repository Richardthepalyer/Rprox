const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const MY_DOMAIN = "rprox.onrender.com";

app.use(express.static("public"));

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
    const response = await fetch(target);
    const contentType = response.headers.get("content-type");

    res.set("Content-Type", contentType);
    let data = await response.text();

    // Rewrite links
    data = data.replace(/(href|src)="(.*?)"/g, (match, attr, link) => {
      if (link.startsWith("http")) {
        return `${attr}="/proxy?url=${link}"`;
      } else if (link.startsWith("/")) {
        return `${attr}="/proxy?url=${target}${link}"`;
      }
      return match;
    });

    res.send(data);
  } catch (err) {
    res.send("Error loading site");
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on " + PORT));
