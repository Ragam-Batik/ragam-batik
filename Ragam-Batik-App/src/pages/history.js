import '../styles/styles.css'; 
import BatikApi from '../services/batik-api';
import historyItemPlaceholder from '../assets/images/profil.jpeg'; 

const History = {
  async render() {
    return `
      <div class="history-page-container">
          <div class="history-title-bar">
              <h1>History</h1>
          </div>

          <section class="history-list-section">
              <h3>Riwayat Scan Anda</h3>
              <div class="history-grid" id="historyGrid">
                  <p class="loading-message">Memuat riwayat scan...</p>
              </div>
          </section>
      </div>
    `;
  },

async afterRender() {
    const historyGridElement = document.getElementById('historyGrid');
    
    try {
      console.log('History: Memanggil BatikApi.getHistory()');
      const historyResult = await BatikApi.getHistory(); 
      
      console.log('History: historyResult (objek lengkap dari BatikApi.getHistory()):', historyResult);
      console.log('History: historyResult.success:', historyResult.success);
      console.log('History: historyResult.data (isi properti data dari objek hasil):', historyResult.data);
      console.log('History: Apakah historyResult.data ini sebuah array? (Seharusnya false)', Array.isArray(historyResult.data));
      console.log('History: Panjang historyResult.data (jika array):', historyResult.data ? historyResult.data.length : 'N/A');

      const historyItems = historyResult.data.data; 

      if (historyResult.success && historyItems && historyItems.length > 0) {
        console.log('History: Kondisi TRUE. Menampilkan item riwayat.');
        
        historyGridElement.innerHTML = historyItems.map(item => {
            const imageUrl = item.image_url || historyItemPlaceholder; 
            const batikName = item.motif_name || 'Motif Batik Tidak Dikenal';
            const displayDate = item.created_at ? `Tanggal Scan: ${new Date(item.created_at).toLocaleDateString('id-ID')}` : 'Tanggal tidak diketahui';
            const provinsi = item.provinsi ? `Provinsi: ${item.provinsi}` : '';

            return `
              <div class="batik-history-card" data-id="${item.id}" data-batik-motif-id="${item.id}">
                  <div class="batik-history-image-placeholder">
                      <img src="${imageUrl}" alt="${batikName}">
                  </div>
                  <div class="batik-history-info">
                      <div class="batik-history-label"><strong>${batikName}</strong></div>
                      <div class="batik-history-date">${displayDate}</div>
                      ${provinsi ? `<div class="batik-history-provinsi">${provinsi}</div>` : ''}
                      
                  </div>
                  <a href="#/history/${item.id}" class="view-detail-link">Lihat Detail</a>
              </div>
            `;
          }).join('');

          document.querySelectorAll('.batik-history-card').forEach(card => {
            card.addEventListener('click', (e) => {
              if (e.target.tagName === 'A') return; 
              const motifId = card.dataset.batikMotifId; 
              if (motifId) {
                window.location.hash = `#/history/${motifId}`; 
              } else {
                console.warn('Motif ID tidak ditemukan untuk riwayat ini.');
              }
            });
          });

      } else {
        console.log('History: Kondisi FALSE. Menampilkan "Belum ada riwayat scan."');
        historyGridElement.innerHTML = '<p class="no-history-message">Belum ada riwayat scan.</p>';
      }
    } catch (error) {
      console.error('Error in History afterRender (list):', error);
      historyGridElement.innerHTML = `<p class="error-message" style="color: red;">Terjadi kesalahan saat memuat daftar riwayat.</p>`;
    }
  },

};

export default History;