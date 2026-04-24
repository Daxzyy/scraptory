import axios from "axios";
import * as cheerio from "cheerio";

const BASE_URL = "https://anichin.moe";

const createInstance = () => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
    },
    timeout: 30000,
  });
};

export class AnichinCare {
  constructor() {
    this.client = createInstance();
  }

  async home() {
    const response = await this.client.get("/");
    const \$ = cheerio.load(response.data);
    const data = {
      slider: [],
      popular: [],
      latest: [],
    };

    \$("#slidertwo .swiper-slide.item").each((_, el) => {
      const title =
        \$(el).find("h2 a").attr("data-jtitle") ||
        \$(el).find("h2 a").text().trim();
      const link = \$(el).find("h2 a").attr("href") || "";
      const backdrop =
        \$(el)
          .find(".backdrop")
          .attr("style")
          ?.match(/url\\(['"]?([^'")]+)/)?.[1] || null;
      const description = \$(el).find("p").not(":empty").last().text().trim();

      if (title && link) {
        data.slider.push({
          title,
          slug: this.extractSlug(link),
          url: link.startsWith("http") ? link : \`\${BASE_URL}\${link}\