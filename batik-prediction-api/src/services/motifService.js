// File: src/services/motifService.js
const supabase = require('../config/supabase');
const Boom = require('@hapi/boom');

class MotifService {
  // Ambil semua motif (opsional: filter berdasarkan provinsi)
  async getAllMotifs(provinsi = null) {
    try {
      let query = supabase.from('motif_batik').select('*');

      if (provinsi) {
        query = query.ilike('provinsi', `%${provinsi}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data;
    } catch (err) {
      console.error('getAllMotifs error:', err);
      throw Boom.internal('Failed to get motifs from database');
    }
  }

  // Ambil satu motif berdasarkan ID
  async getMotifById(id) {
    try {
      const { data, error } = await supabase
        .from('motif_batik')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        throw Boom.notFound('Motif not found');
      }

      return data;
    } catch (error) {
      console.error('getMotifById error:', error);
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get motif');
    }
  }

  // Cari motif berdasarkan keyword secara realtime dari Supabase
  async searchMotifs(query, limit = 10) {
    try {
      if (!query || query.trim().length < 2) {
        throw Boom.badRequest('Search query must be at least 2 characters');
      }

      const { data, error } = await supabase
        .from('motif_batik')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,provinsi.ilike.%${query}%`)
        .limit(limit);

      if (error) throw error;

      return {
        data,
        query,
        totalResults: data.length
      };
    } catch (error) {
      console.error('searchMotifs error:', error);
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to search motifs');
    }
  }

  // Kelompokkan motif berdasarkan provinsi
  async getMotifsByProvinsi() {
    try {
      const { data, error } = await supabase
        .from('motif_batik')
        .select('*');

      if (error) throw error;

      const grouped = data.reduce((acc, motif) => {
        const prov = motif.provinsi || 'Tidak diketahui';
        if (!acc[prov]) acc[prov] = [];
        acc[prov].push(motif);
        return acc;
      }, {});

      return Object.entries(grouped)
        .map(([provinsi, motifs]) => ({
          provinsi,
          count: motifs.length,
          motifs
        }))
        .sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('getMotifsByProvinsi error:', error);
      throw Boom.internal('Failed to group motifs by provinsi');
    }
  }

  // Ambil list provinsi yang ada di data motif
  async getProvinsiList() {
    try {
      const { data, error } = await supabase
        .from('motif_batik')
        .select('provinsi');

      if (error) throw error;

      const countMap = data.reduce((acc, item) => {
        const prov = item.provinsi || 'Tidak diketahui';
        acc[prov] = (acc[prov] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(countMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('getProvinsiList error:', error);
      throw Boom.internal('Failed to get provinsi list');
    }
  }

  // Ambil motif acak dari database
  async getRandomMotifs(count = 5) {
    try {
      const { data, error } = await supabase
        .from('motif_batik')
        .select('*');

      if (error) throw error;

      const shuffled = [...data].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    } catch (error) {
      console.error('getRandomMotifs error:', error);
      throw Boom.internal('Failed to get random motifs');
    }
  }

  // Ambil motif yang dianggap populer (jika ada link_shop)
  async getPopularMotifs(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('motif_batik')
        .select('*')
        .not('link_shop', 'is', null)
        .neq('link_shop', '')
        .limit(limit);

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('getPopularMotifs error:', error);
      throw Boom.internal('Failed to get popular motifs');
    }
  }
}

module.exports = new MotifService();
