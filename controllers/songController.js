import { searchSpotify } from '../utils/fetchSpotify.js';
import Message from '../models/message-model.js';
export async function searchSong(req, res) {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ msg: 'Query kosong!' });

    const songs = await searchSpotify(query);
    res.json(songs);
} catch (err) {
    console.error('Spotify API error:', err.response?.data || err.message);
    res.status(500).json({
      msg: 'Gagal search lagu',
      error: err.response?.data || err.message,
    });
  }
}


export async function createMessage(req, res) {
    try {
      const { from, to, pesan, title } = req.body;
  
      if (  !to || !pesan || !title) {
        return res.status(400).json({ msg: 'Data tidak lengkap' });
      }
  
      // Cari lagu dari Spotify
      const songs = await searchSpotify(title);
      if (!songs.length) return res.status(404).json({ msg: 'Lagu tidak ditemukan di Spotify' });
  
      const song = songs[0]; // ambil hasil paling atas
  
      const newMessage = new Message({
        from: from || 'Anonim',
        to,
        pesan,
        title: song.title,
        artist: song.artist,
        cover: song.cover,
        spotify_url: song.spotify_url,
        preview_url: song.preview_url,
      });
  
      await newMessage.save();
  
      res.status(201).json({ msg: 'Pesan berhasil disimpan', data: newMessage });
    } catch (err) {
      console.error('Error simpan pesan:', err.message);
      res.status(500).json({ msg: 'Gagal simpan pesan', error: err.message });
    }
  }

  export async function getAllMessages(req, res) {
    try {
      const messages = await Message.find().sort({ createdAt: -1 }); // terbaru di atas
      res.status(200).json({ data: messages });
    } catch (err) {
      console.error('Error ambil semua pesan:', err.message);
      res.status(500).json({ msg: 'Gagal ambil pesan', error: err.message });
    }
  }
  
  export async function getRecentMessages(req, res) {
    try {
      const satuJamLalu = new Date(Date.now() - 1 * 60 * 60 * 1000); // 1 jam lalu
  
      const messages = await Message.find({
        createdAt: { $gte: satuJamLalu },
      }).sort({ createdAt: -1 });
  
      res.status(200).json({ data: messages });
    } catch (err) {
      console.error('Error ambil pesan 1 jam terakhir:', err.message);
      res.status(500).json({ msg: 'Gagal ambil pesan terbaru', error: err.message });
    }
  }
  

  export async function getMessageById(req, res) {
    try {
      const { id } = req.params;
  
      const message = await Message.findById(id);
      if (!message) {
        return res.status(404).json({ msg: 'Pesan tidak ditemukan' });
      }
  
      res.status(200).json({ data: message });
    } catch (err) {
      console.error('Error ambil pesan by ID:', err.message);
      res.status(500).json({ msg: 'Gagal ambil pesan', error: err.message });
    }
  }


  export async function getRandomMessages(req, res) {
    try {
      // Ambil 20 data terbaru berdasarkan waktu dibuat
      let messages = await Message.find()
        .sort({ createdAt: -1 }) // urutkan dari yang terbaru
        .limit(20);
  
      // Jika data kosong, ambil 20 data terakhir (tanpa filter waktu)
      if (!messages || messages.length === 0) {
        messages = await Message.find()
          .sort({ _id: -1 }) // fallback ke pengurutan berdasarkan _id
          .limit(20);
      }
  
      res.status(200).json({ data: messages });
    } catch (err) {
      console.error('Error ambil pesan terbaru:', err.message);
      res.status(500).json({ msg: 'Gagal ambil pesan terbaru', error: err.message });
    }
  }
  
  