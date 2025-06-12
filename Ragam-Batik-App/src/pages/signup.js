import '../styles/form.css';

const SignUp = {
  async render() {
    const mainContent = `
      <div class="auth-form-container signup-container"> 
        <h1>Sign Up</h1>
        <form id="signUpForm"> 
            <div class="input-group">
                <label for="nama">Nama</label>
                <input type="text" id="nama" name="nama" required>
            </div>
            <div class="input-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="input-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="action-button signup-button">Sign Up</button>
        </form>
        <p class="auth-link signin-instead-link"> 
            Sudah Punya Akun? <a href="#/signin">Masuk Disini.</a>
        </p>
      </div>
    `;
    return mainContent;
  },

  async afterRender() {
    const signUpForm = document.getElementById('signUpForm');
    if (signUpForm) {
      signUpForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nama = document.getElementById('nama').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
          const response = await fetch('https://zu1jx5klr3.execute-api.ap-southeast-2.amazonaws.com/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email,
              password: password,
              fullName: nama,
            }),
          });

          const result = await response.json();

          if (response.ok) {
            alert(`Registrasi berhasil untuk ${nama} dengan email: ${email}! Silakan cek email untuk konfirmasi dan login.`);
            window.location.hash = '#/signin';
          } else {
            alert(`Registrasi gagal: ${result.message || 'Terjadi kesalahan.'}`);
          }
        } catch (error) {
          console.error('Error saat mendaftar:', error);
          alert('Terjadi kesalahan koneksi. Silakan coba lagi nanti.');
        }
      });
    }

    console.log('Event listeners untuk SignUp.js sudah aktif.');
  },
};

export default SignUp;
