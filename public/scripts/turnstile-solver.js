#!/usr/bin/env node
"use strict";

const puppeteer = require('puppeteer-extra');
puppeteer.use(require('puppeteer-extra-plugin-stealth')());
const fs   = require('fs');
const path = require('path');

const FALLBACK_UA = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
];

const HTML_TEMPLATE = \`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Turnstile Solver</title>
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async></script>
<style>
body{display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:#f0f0f0;font-family:Arial}
.container{background:white;padding:30px;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,.1);text-align:center}
.turnstile-container{margin-top:20px}
#status{margin-top:20px;background:#f8f8f8;padding:10px;border-radius:6px}
</style>
<script>
function updateStatus(t){document.getElementById("status").innerText=t}
function checkToken(){const el=document.querySelector("[name='cf-turnstile-response']");if(el&&el.value)updateStatus("Token received ("+el.value.length+" chars)")}
window.onload=function(){setInterval(checkToken,500);updateStatus("Turnstile loading...")}
</script>
</head>
<body>
<div class="container">
<h2>Cloudflare Turnstile Test</h2>
<div class="turnstile-container"><!-- TURNSTILE_WIDGET --></div>
<div id="status">Initializing...</div>
</div>
</body>
</html>\`;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const rand  = (arr) => arr[Math.floor(Math.random() * arr.length)];

function getRandomUA() {
  try {
    const p = path.join("data", "useragents.txt");
    if (fs.existsSync(p)) {
      const uas = fs.readFileSync(p, "utf8").split("\\n").map(l => l.trim()).filter(Boolean);
      if (uas.length) return rand(uas);
    }
  } catch {}
  return rand(FALLBACK_UA);
}

function getRandomProxy() {
  try {
    const p = path.join("data", "proxies.txt");
    if (fs.existsSync(p)) {
      const proxies = fs.readFileSync(p, "utf8").split("\\n").map(l => l.trim()).filter(Boolean);
      if (proxies.length) return rand(proxies);
    }
  } catch {}
  return null;
}

class TurnstileSolver {
  constructor({ headless = true, threads = 1, useProxy = false, useragent = null } = {}) {
    this.headless  = headless;
    this.threads   = threads;
    this.useProxy  = useProxy;
    this.useragent = useragent || getRandomUA();
    this.pool      = []; // array of browser instances
  }

  async initialize() {
    for (let i = 0; i < this.threads; i++) {
      this.pool.push(await this._createBrowser());
    }
  }

  async _createBrowser() {
    const args = [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--disable-blink-features=AutomationControlled",
      "--disable-web-security",
      \`--user-agent=\${this.useragent}\