const axios = require('axios');
const express = require('express');

module.exports = function (app) {
  if (!app) {
    throw new Error("Instance Express tidak ditemukan. Pastikan Anda telah menginisialisasi Express sebelum menggunakan modul ini.");
  }

  // Middleware agar Express bisa membaca JSON (hanya diperlukan jika ada request body)
  app.use(express.json());

  // Fungsi untuk mengambil konten dari LuminAI
  async function fetchContent(content) {
    try {
      const response = await axios.post('https://luminai.my.id/', { content });
      return response.data;
    } catch (error) {
      console.error("Error fetching content from LuminAI:", error.response?.data || error.message);
      throw new Error("Gagal mengambil data dari LuminAI");
    }
  }

  // Endpoint untuk LuminAI
  app.get('/luminai', async (req, res) => {
    try {
      const { text } = req.query;
      if (!text) {
        return res.status(400).json({ error: 'Parameter "text" Tidak Ditemukan, Tolong Masukkan Perintah' });
      }

      const response = await fetchContent(text);
      res.status(200).json({
        status: 200,
        creator: "JazxCode",
        data: response,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};
