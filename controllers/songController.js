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
        const { from, to, pesan, song_id, title, artist, cover, spotify_url, preview_url } = req.body;

        // Validasi dasar
        if (!to || !pesan) {
            return res.status(400).json({ msg: 'Penerima dan Pesan tidak boleh kosong.' });
        }

        let finalSongData = null;

        // PRIORITAS 1: Coba gunakan data lagu yang sudah dikirim dari frontend (termasuk song_id)
        if (song_id && title && artist && cover) {
            finalSongData = {
                id: song_id, // Gunakan song_id dari frontend
                title: title,
                artist: artist,
                cover: cover,
                spotify_url: spotify_url,
                preview_url: preview_url
            };
            console.log('Menggunakan data lagu dari frontend.');
        } else if (title) {
            // PRIORITAS 2: Jika data dari frontend tidak lengkap, coba cari ulang berdasarkan judul
            console.log(`Data lagu dari frontend tidak lengkap, mencari ulang berdasarkan judul: ${title}`);
            const songs = await searchSpotify(title);
            if (!songs.length) {
                return res.status(404).json({ msg: 'Lagu tidak ditemukan di Spotify berdasarkan judul.' });
            }
            finalSongData = songs[0]; // Ambil hasil paling atas
        } else {
            // Jika tidak ada song_id/detail dari frontend dan tidak ada title untuk dicari
            return res.status(400).json({ msg: 'Tidak ada informasi lagu yang cukup untuk disimpan.' });
        }

        // Pastikan finalSongData sudah terisi
        if (!finalSongData || !finalSongData.id || !finalSongData.title || !finalSongData.artist || !finalSongData.cover) {
             return res.status(500).json({ msg: 'Gagal mendapatkan detail lagu yang valid.' });
        }

        const newMessage = new Message({
            from: from || 'Anonim',
            to,
            pesan,
            song_id: finalSongData.id,
            title: finalSongData.title,
            artist: finalSongData.artist,
            cover: finalSongData.cover,
            spotify_url: finalSongData.spotify_url,
            preview_url: finalSongData.preview_url,
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
  
  