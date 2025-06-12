import '../styles/styles.css'; 
import BatikApi from '../services/batik-api';
import heroLogoHome from '../assets/images/Rectangle 5678.png'; 
import motifPlaceholder from '../assets/images/profil.jpeg'; 

const Home = {
  async render() {
    return `
      <main>
          <section class="about-hero-section">
              <div class="about-hero-logo">
                  <img src="${heroLogoHome}" alt="Ragam Batik Logo Utama">
              </div>
              <div class="about-hero-tagline">
                  <h1>Budaya Tak Lekang<br>Oleh Waktu</h1>
              </div>
          </section>

          <section class="motif-section">
              <h2>Jelajahi Motif Batikmu Disini...</h2>
              <div class="motif-grid" id="homeMotifGrid"> <p class="loading-message">Memuat koleksi batik...</p>
              </div>
              <p id="homeErrorMessage" style="color: red; display: none; text-align: center; margin-top: 20px;">Gagal memuat batik. Mohon coba lagi nanti.</p>
              <p id="homeNoResultsMessage" style="display: none; text-align: center; margin-top: 20px;">Tidak ada koleksi batik yang ditemukan.</p>
          </section>
      </main>
    `;
  },

  async afterRender() {
    const homeMotifGrid = document.getElementById('homeMotifGrid');
    const errorMessage = document.getElementById('homeErrorMessage');
    const noResultsMessage = document.getElementById('homeNoResultsMessage');

    homeMotifGrid.innerHTML = '<p class="loading-message">Memuat koleksi batik...</p>';
    errorMessage.style.display = 'none';
    noResultsMessage.style.display = 'none';

    try {
      console.log('Home: Memanggil BatikApi.getAllMotifs()');
      const result = await BatikApi.getAllMotifs(); 
      
      console.log('Home: result (objek lengkap dari BatikApi.getAllMotifs()):', result);
      console.log('Home: result.success:', result.success);
      console.log('Home: result.data (isi properti data dari objek hasil):', result.data);
      console.log('Home: Apakah result.data ini sebuah array?', Array.isArray(result.data));
      console.log('Home: Panjang result.data (jika array):', result.data ? result.data.length : 'N/A');

      const allMotifs = result.data && Array.isArray(result.data.data) ? result.data.data : [];

      if (result.success && allMotifs.length > 0) {
        console.log('Home: Kondisi TRUE. Menampilkan koleksi batik.');
        
        const numberOfItemsToDisplay = 6; 
        const shuffledMotifs = allMotifs.sort(() => 0.5 - Math.random()); 
        const selectedMotifs = shuffledMotifs.slice(0, numberOfItemsToDisplay); 

        let motifCardsHtml = '';
        selectedMotifs.forEach(batik => {
            const imageUrl = batik.link_image || batik.imageUrl || motifPlaceholder; 
            const batikId = batik.id || null; 
            const createdAt = batik.created_at ? new Date(batik.created_at).toLocaleDateString('id-ID') : 'Tanggal tidak diketahui';

            motifCardsHtml += `
                <div class="motif-card" data-id="${batikId}">
                    <div class="motif-card-image">
                        <img src="${imageUrl}" alt="${batik.name}" loading="lazy">
                    </div>
                    <div class="motif-card-info"> <h3>${batik.name}</h3>
                    </div>
                </div>
            `;
        });
        homeMotifGrid.innerHTML = motifCardsHtml;

        document.querySelectorAll('.motif-card').forEach(card => { 
            card.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') return; 
                const batikId = card.dataset.id;
                if (batikId) {
                    window.location.hash = `#/batik/${batikId}`; 
                }
            });
        });

      } else {
        console.log('Home: Kondisi FALSE. Menampilkan "Tidak ada koleksi batik ditemukan."');
        homeMotifGrid.innerHTML = ''; 
        noResultsMessage.style.display = 'block'; 
      }
    } catch (error) {
      console.error('Error fetching all motifs for Home page:', error);
      homeMotifGrid.innerHTML = ''; 
      errorMessage.style.display = 'block';
      errorMessage.textContent = `Terjadi kesalahan saat memuat koleksi batik: ${error.message || 'Mohon coba lagi.'}`;
    }
  },
};

export default Home;