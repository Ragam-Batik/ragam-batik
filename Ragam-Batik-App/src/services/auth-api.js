import CONFIG from '../utils/constants';

const AuthApi = {
    async register({ email, password, fullName }) {
        try {
            const response = await fetch(`${CONFIG.BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, fullName }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Pendaftaran gagal');
            }
            return { success: true, message: data.message || 'Pendaftaran berhasil!' };
        } catch (error) {
            console.error('Error saat register:', error);
            return { success: false, message: error.message || 'Terjadi kesalahan jaringan' };
        }
    },

    async login({ email, password }) {
        try {
            const response = await fetch(`${CONFIG.BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Login gagal. Email atau password salah.');
            }

            const userData = data.data; 
            
            return { 
                success: true, 
                message: data.message || 'Login berhasil!', 
                accessToken: userData.access_token,
                user: userData.user
            };


        } catch (error) {
            console.error('Error saat login:', error);
            return { success: false, message: error.message || 'Terjadi kesalahan jaringan' };
        }
    },

    async logout() {
        const accessToken = this.getAccessToken(); 
        if (!accessToken) {
            return { success: true, message: 'Sudah logout atau tidak ada sesi aktif.' };
        }

        try {
            const response = await fetch(`${CONFIG.BASE_URL}/api/auth/logout`, { 
                method: 'POST',
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });

            this.removeAccessToken();
            localStorage.removeItem('userEmail');

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Gagal logout di server.');
            }
            
            return { success: true, message: 'Berhasil logout.' };
        } catch (error) {
            console.error('Error saat logout:', error);
            this.removeAccessToken();
            localStorage.removeItem('userEmail');
            return { success: true, message: error.message || 'Logout berhasil (ada masalah koneksi ke server).' };
        }
    },

    getAccessToken() {
        const token = localStorage.getItem('accessToken');
        console.log('AuthApi: Token dari localStorage:', token ? token.substring(0, 50) + '...' : 'TIDAK ADA');
        return token;
    },

    setAccessToken(token) {
        localStorage.setItem('accessToken', token);
        console.log('AuthApi: Token BARU disimpan ke localStorage:', token ? token.substring(0, 50) + '...' : 'TIDAK ADA');
    },

    removeAccessToken() {
        localStorage.removeItem('accessToken');
        console.log('AuthApi: Token dihapus dari localStorage.');
    }
};

export default AuthApi;