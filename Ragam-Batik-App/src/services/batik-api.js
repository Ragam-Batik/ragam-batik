import CONFIG from '../utils/constants';
import AuthApi from './auth-api';

const BatikApi = {
    async classifyBatik(imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const accessToken = AuthApi.getAccessToken();
        console.log('BatikApi: Token yang akan dikirim untuk predict:', accessToken ? accessToken.substring(0, 50) + '...' : 'TIDAK ADA TOKEN');
        if (!accessToken) {
            console.error('BatikApi: Klasifikasi dibatalkan karena tidak ada access token.');
            throw new Error('Maaf, Anda perlu login terlebih dahulu untuk menggunakan fitur ini.');
        }

        try {
            const response = await fetch(`${CONFIG.BASE_URL}/api/predict`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Klasifikasi gagal. Coba lagi dengan gambar yang berbeda.');
            }
            return { success: true, data: data };
        } catch (error) {
            console.error('Error saat klasifikasi batik:', error);
            return { success: false, message: error.message || 'Terjadi masalah koneksi atau server. Mohon coba beberapa saat lagi.' };
        }
    },

    async getAllMotifs() {
        try {
            const response = await fetch(`${CONFIG.BASE_URL}/api/motif`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Gagal mengambil semua motif.');
            }
            return { success: true, data: data.motifs || data };
        } catch (error) {
            console.error('Error fetching all motifs:', error);
            return { success: false, message: error.message || 'Terjadi kesalahan jaringan' };
        }
    },

    async getPopularBatiks() {
        try {
            const response = await fetch(`${CONFIG.BASE_URL}/api/batik/popular`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Gagal mengambil batik populer');
            }
            return { success: true, data: data.batiks || data };
        } catch (error) {
            console.error('Error fetching popular batiks:', error);
            return { success: false, message: error.message || 'Terjadi kesalahan jaringan' };
        }
    },

    async searchBatiks(keyword) {
        const accessToken = AuthApi.getAccessToken();
        if (!accessToken) { throw new Error('Anda harus login untuk menggunakan fitur pencarian.'); }
        try {
            const response = await fetch(`${CONFIG.BASE_URL}/api/motif/search?q=${encodeURIComponent(keyword)}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Gagal mencari batik');
            }
            return { success: true, data: data.motifs || data.data || data };
        } catch (error) {
            console.error(`Error searching batiks for keyword ${keyword}:`, error);
            return { success: false, message: error.message || 'Terjadi kesalahan jaringan' };
        }
    },

    async getHistory() {
        const accessToken = AuthApi.getAccessToken();
        if (!accessToken) { throw new Error('Anda harus login untuk melihat riwayat.'); }
        try {
            const response = await fetch(`${CONFIG.BASE_URL}/api/history`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Gagal mengambil riwayat');
            }
            return { success: true, data: data.history || data };
        } catch (error) {
            console.error('Error fetching history:', error);
            return { success: false, message: error.message || 'Terjadi kesalahan jaringan' };
        }
    },

    async getHistoryStats() {
        const accessToken = AuthApi.getAccessToken();
        if (!accessToken) { throw new Error('Anda harus login untuk melihat statistik riwayat.'); }
        try {
            const response = await fetch(`${CONFIG.BASE_URL}/api/history/stats`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Gagal mengambil statistik riwayat.');
            }
            return { success: true, data: data };
        } catch (error) {
            console.error('Error fetching history stats:', error);
            return { success: false, message: error.message || 'Terjadi kesalahan jaringan.' };
        }
    },

    async getBatikDetail(id) {
        try {
            const response = await fetch(`${CONFIG.BASE_URL}/api/motif/${id}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Gagal mengambil detail batik');
            }
            return { success: true, data: data.data };
        } catch (error) {
            console.error(`Error fetching batik detail for ID ${id}:`, error);
            return { success: false, message: error.message || 'Terjadi kesalahan jaringan' };
        }
    },

    async getHistoryDetail(id) {
        const accessToken = AuthApi.getAccessToken();
        if (!accessToken) {
            console.error('BatikApi: Akses ke detail riwayat dibatalkan karena tidak ada access token.');
            throw new Error('Anda harus login untuk melihat detail riwayat.');
        }

        try {
            const response = await fetch(`${CONFIG.BASE_URL}/api/history/${id}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `Gagal mengambil detail riwayat untuk ID: ${id}.`);
            }
            return { success: true, data: data.data || data };
        } catch (error) {
            console.error(`Error fetching history detail for ID ${id}:`, error);
            return { success: false, message: error.message || 'Terjadi masalah koneksi atau server saat mengambil detail riwayat.' };
        }
    },

    async getRelatedBatiks(batikId) {
        try {
            const response = await fetch(`${CONFIG.BASE_URL}/api/batik-motifs/${batikId}/related`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Gagal mengambil batik terkait.');
            }
            return { success: true, data: data.relatedBatiks || data };
        } catch (error) {
            console.error(`Error fetching related batiks for ID ${batikId}:`, error);
            return { success: false, message: error.message || 'Terjadi kesalahan jaringan.' };
        }
    },

    async getMotifsGroupedByProvince() {
        const accessToken = AuthApi.getAccessToken();
        if (!accessToken) { throw new Error('Anda harus login untuk melihat motif berdasarkan provinsi.'); }
        try {
            const response = await fetch(`${CONFIG.BASE_URL}/api/motif/group/provinsi`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Gagal mengambil motif berdasarkan provinsi.');
            }
            return { success: true, data: data.groupedMotifs || data.data || data };
        } catch (error) {
            console.error('Error fetching motifs grouped by province:', error);
            return { success: false, message: error.message || 'Terjadi kesalahan jaringan.' };
        }
    },
};

export default BatikApi;