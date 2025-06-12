import '../styles/beranda.css'; 
import heroImage from '../assets/images/Rectangle 5678.png';

const Beranda = {
  async render() {
    return `
      <section id="landingPage" class="page-section">
          <main class="hero-section">
              <div class="hero-image-container">
                  <img src="${heroImage}" alt="Ragam Batik Hero Image" class="hero-image">
              </div>
              <div class="hero-content">
                  <h1>Welcome To Ragam Batik</h1>
                  <h2>Budaya Tak Lekang <br> Oleh Waktu</h2>
                  <p>Temukan Keindahan Dan Filosofi Di Balik Setiap Motif Batik Indonesia. <br> <a href="#/signin">Login Sekarang</a> atau <a href="#/signup">Registrasi</a> Untuk Mulai Perjalananmu.</p>
              </div>
          </main>
      </section>
    `;
  },

  async afterRender() {
    const loginLink = document.querySelector('#landingPage a[href="#/signin"]');
    const registerLink = document.querySelector('#landingPage a[href="#/signup"]');

    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = '#/signin';
        });
    }

    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = '#/signup';
        });
    }
  },
};

export default Beranda;