import AuthApi from '../services/auth-api';
import '../styles/form.css'; 
import App from '../app'; 

const SignIn = {
    async render() {
        return `
            <div class="signin-container">
                <h1>Sign In</h1>
                <form id="loginForm"> 
                    <div class="input-group">
                        <label for="loginEmail">Email</label> 
                        <input type="email" id="loginEmail" name="email" required>
                    </div>
                    <div class="input-group">
                        <label for="loginPassword">Password</label> 
                        <input type="password" id="loginPassword" name="password" required>
                    </div>
                    <button type="submit" class="signin-button">Sign In</button>
                </form>
                <p class="signup-link">
                    Belum Punya Akun? <a href="#/signup">Daftar Disini.</a>
                </p>
                <p id="loginMessage" class="status-message"></p>
            </div>
        `;
    },

    async afterRender() {
        const loginForm = document.getElementById('loginForm'); 
        const loginEmail = document.getElementById('loginEmail'); 
        const loginPassword = document.getElementById('loginPassword'); 
        const loginMessage = document.getElementById('loginMessage'); 

        if (!loginForm || !loginEmail || !loginPassword || !loginMessage) {
            console.error('Error: Salah satu elemen DOM untuk Sign In tidak ditemukan. Pastikan ID sesuai di HTML.');
            return; 
        }

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 

            loginMessage.textContent = 'Memproses login...';
            loginMessage.style.color = 'white'; 
            loginMessage.style.fontSize = '15px'; 

            const email = loginEmail.value;
            const password = loginPassword.value;

            try {
                const result = await AuthApi.login({ email, password }); 

                if (result.success) {
                    AuthApi.setAccessToken(result.accessToken); 
                    localStorage.setItem('userEmail', email); 

                    loginMessage.textContent = result.message || 'Login berhasil!';
                    loginMessage.style.color = 'green';
                    loginForm.reset(); 

                    alert(`Login berhasil! Selamat datang, ${email}.`); 

                    document.dispatchEvent(new Event('authStatusChanged')); 
                    window.location.hash = '#/about'; 
                } else {
                    loginMessage.textContent = result.message || 'Login gagal. Email atau password salah.';
                    loginMessage.style.color = 'red';
                    alert(`Login gagal: ${result.message || 'Email atau password salah.'}`);
                }
            } catch (error) {
                console.error('Error saat login:', error);
                loginMessage.textContent = 'Terjadi kesalahan jaringan atau server. Mohon coba lagi.';
                loginMessage.style.color = 'red';
                alert('Terjadi kesalahan koneksi atau server. Silakan coba lagi nanti.');
            }
        });

        const signUpLink = document.querySelector('.signup-link a[href="#/signup"]');
        if (signUpLink) {
            signUpLink.addEventListener('click', (e) => {
                e.preventDefault(); 
                window.location.hash = '#/signup'; 
            });
        }
    },
};

export default SignIn;