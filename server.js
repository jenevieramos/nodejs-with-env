// Loads variables from the .env file into process.env
require("dotenv").config();

const http = require("http");
const fs = require("fs");
const path = require("path");

// Settings come from environment variables (with safe fallbacks)
const PORT = process.env.PORT || 3000;
const SITE_NAME = process.env.SITE_NAME || "My Site";
const TAGLINE = process.env.TAGLINE || "";
const API_KEY = process.env.SECRET_API_KEY || "";

// Never show a full secret on a page. Mask all but the last 4 characters.
const maskedKey = API_KEY ? "••••••••" + API_KEY.slice(-4) : "(not set)";

// Read index.html and fill in the {{placeholders}} with our settings
function renderIndex() {
  const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  return html
    .replaceAll("{{SITE_NAME}}", SITE_NAME)
    .replaceAll("{{TAGLINE}}", TAGLINE)
    .replaceAll("{{PORT}}", PORT)
    .replaceAll("{{API_KEY}}", maskedKey);
}

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(renderIndex());
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
});

server.listen(PORT, () => {
  console.log(`${SITE_NAME} running at http://localhost:${PORT}`);
});
