const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();
const PORT = process.env.PORT || 3000;

async function scrapeJKT48Calendar() {
  try {
    const url = "https://jkt48.com/calendar/list?lang=id";
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let events = [];

    $(".calendarItem").each((index, element) => {
      const date = $(element).find(".date").text().trim();
      const title = $(element).find(".eventTitle").text().trim();
      const description = $(element).find(".eventDetail").text().trim();
      const time = $(element).find(".time").text().trim();

      events.push({
        date,
        title,
        time,
        description,
      });
    });

    return events;
  } catch (error) {
    console.error("Error scraping JKT48 Calendar:", error.message);
    return [];
  }
}
app.get("/api/jkt48/calendar", async (req, res) => {
  try {
    const events = await scrapeJKT48Calendar();
    res.status(200).json({
      status: 200,
      creator: "JazxCode",
      data: events,
    });
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data kalender JKT48" });
  }
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
