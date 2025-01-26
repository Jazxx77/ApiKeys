module.exports = function(app) {
    const axios = require('axios');
    const cheerio = require('cheerio');
  
    async function getJkt48Members() {
      try {
        const { data } = await axios.get('https://jkt48.com/member/list?lang=id');
        const $ = cheerio.load(data);
  
        const members = [];
        $('.member-card').each((index, element) => {
          const name = $(element).find('.name').text().trim();
          const imgUrl = $(element).find('img').attr('src');
          members.push({ name, imgUrl });
        });
  
        return members;
      } catch (error) {
        console.error('Error fetching JKT48 members:', error);
        return [];
      }
    }
  
    // Endpoint untuk Scraper Anggota JKT48
    app.get('/api/jkt48-members', async (req, res) => {
      try {
        const members = await getJkt48Members();
        res.status(200).json({
          status: 200,
          creator: "Nama Anda",
          data: members,
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
};
