const supabase = require('../config/supabase');
const s3Service = require('./s3Service');
const Boom = require('@hapi/boom');

class HistoryService {
  async getHistory(userId, page = 1, limit = 10, provinsi = null) {
    try {
      const offset = (page - 1) * limit;
      
      let query = supabase
        .from('scan_histories')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (provinsi) {
        query = query.ilike('provinsi', `%${provinsi}%`);
      }

      const { data: histories, error, count } = await query
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Get history error:', error);
        throw Boom.internal('Failed to get scan history');
      }

      return {
        data: histories,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: limit,
          hasNextPage: offset + limit < count,
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      if (error.isBoom) {
        throw error;
      }
      
      console.error('Get history service error:', error);
      throw Boom.internal('Failed to get scan history');
    }
  }

  async getHistoryById(historyId, userId) {
    try {
      const { data: history, error } = await supabase
        .from('scan_histories')
        .select('*')
        .eq('id', historyId)
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Get history by ID error:', error);
        throw Boom.notFound('History not found');
      }

      return history;
    } catch (error) {
      if (error.isBoom) {
        throw error;
      }
      
      console.error('Get history by ID service error:', error);
      throw Boom.internal('Failed to get history');
    }
  }

  async deleteHistory(historyId, userId) {
    try {
      const { data: history, error: getError } = await supabase
        .from('scan_histories')
        .select('image_url')
        .eq('id', historyId)
        .eq('user_id', userId)
        .single();

      if (getError || !history) {
        throw Boom.notFound('History not found');
      }

      const { error: deleteError } = await supabase
        .from('scan_histories')
        .delete()
        .eq('id', historyId)
        .eq('user_id', userId);

      if (deleteError) {
        console.error('Delete history error:', deleteError);
        throw Boom.internal('Failed to delete history');
      }

      if (history.image_url) {
        try {
          const urlParts = history.image_url.split('.amazonaws.com/');
          if (urlParts.length > 1) {
            const key = urlParts[1];
            await s3Service.deleteImage(key);
          }
        } catch (s3Error) {
          console.error('S3 delete error (non-critical):', s3Error);
        }
      }

      return { message: 'History deleted successfully' };
    } catch (error) {
      if (error.isBoom) {
        throw error;
      }
      
      console.error('Delete history service error:', error);
      throw Boom.internal('Failed to delete history');
    }
  }

  async deleteAllHistory(userId) {
    try {

      const { data: histories, error: getError } = await supabase
        .from('scan_histories')
        .select('image_url')
        .eq('user_id', userId);

      if (getError) {
        console.error('Get all history error:', getError);
        throw Boom.internal('Failed to get history for deletion');
      }

      const { error: deleteError } = await supabase
        .from('scan_histories')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        console.error('Delete all history error:', deleteError);
        throw Boom.internal('Failed to delete all history');
      }

      if (histories && histories.length > 0) {
        const deletePromises = histories.map(async (history) => {
          if (history.image_url) {
            try {
              const urlParts = history.image_url.split('.amazonaws.com/');
              if (urlParts.length > 1) {
                const key = urlParts[1];
                await s3Service.deleteImage(key);
              }
            } catch (s3Error) {
              console.error('S3 delete error (non-critical):', s3Error);
            }
          }
        });

        await Promise.allSettled(deletePromises);
      }

      return { 
        message: 'All history deleted successfully',
        deletedCount: histories ? histories.length : 0
      };
    } catch (error) {
      if (error.isBoom) {
        throw error;
      }
      
      console.error('Delete all history service error:', error);
      throw Boom.internal('Failed to delete all history');
    }
  }

  async getHistoryStats(userId) {
    try {
      // Get total count
      const { count: totalScans, error: countError } = await supabase
        .from('scan_histories')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (countError) {
        console.error('Get history count error:', countError);
        throw Boom.internal('Failed to get history stats');
      }

      const { data: provinsiStats, error: provinsiError } = await supabase
        .from('scan_histories')
        .select('provinsi')
        .eq('user_id', userId);

      if (provinsiError) {
        console.error('Get provinsi stats error:', provinsiError);
        throw Boom.internal('Failed to get provinsi stats');
      }

      const provinsiCount = {};
      provinsiStats.forEach(item => {
        provinsiCount[item.provinsi] = (provinsiCount[item.provinsi] || 0) + 1;
      });

      const { data: recentScan, error: recentError } = await supabase
        .from('scan_histories')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (recentError) {
        console.error('Get recent scan error:', recentError);
        throw Boom.internal('Failed to get recent scan');
      }

      return {
        totalScans: totalScans || 0,
        provinsiStats: Object.keys(provinsiCount).map(provinsi => ({
          provinsi,
          count: provinsiCount[provinsi]
        })).sort((a, b) => b.count - a.count),
        mostScannedProvinsi: Object.keys(provinsiCount).length > 0 
          ? Object.keys(provinsiCount).reduce((a, b) => 
              provinsiCount[a] > provinsiCount[b] ? a : b
            ) 
          : null,
        recentScan: recentScan && recentScan.length > 0 ? recentScan[0] : null
      };
    } catch (error) {
      if (error.isBoom) {
        throw error;
      }
      
      console.error('Get history stats service error:', error);
      throw Boom.internal('Failed to get history stats');
    }
  }

  async searchHistory(userId, query, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const { data: histories, error, count } = await supabase
        .from('scan_histories')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .or(`motif_name.ilike.%${query}%,provinsi.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Search history error:', error);
        throw Boom.internal('Failed to search history');
      }

      return {
        data: histories,
        query,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: limit,
          hasNextPage: offset + limit < count,
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      if (error.isBoom) {
        throw error;
      }
      
      console.error('Search history service error:', error);
      throw Boom.internal('Failed to search history');
    }
  }
}

module.exports = new HistoryService();