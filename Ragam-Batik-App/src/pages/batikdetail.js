import '../styles/styles.css';
import '../styles/batikdetail.css'; 

import BatikApi from '../services/batik-api';
import UrlParser from '../routes/url-parser';
import placeholderImage from '../assets/images/profil.jpeg';

const BatikDetail = {
    async render() {
        return `
            <section class="batik-detail-page-container">
                <div id="batikDetailContent" class="detail-content">
                    <p id="loadingDetailMessage" class="status-message">Memuat detail batik...</p>
                    <p id="noDetailMessage" class="status-message" style="display: none;">Detail batik tidak ditemukan.</p>
                    <p id="errorDetailMessage" class="status-message error-message" style="display: none;">Terjadi kesalahan saat memuat detail batik.</p>
                    <div id="actualBatikDetail" style="display: none;"></div>
                </div>
                
                <section class="related-batiks-section">
                    <div id="relatedBatiksGrid" class="batik-grid">
                        <p id="loadingRelatedMessage" class="status-message"></p>
                        <p id="noRelatedMessage" class="status-message" style="display: none;">Tidak ada batik serupa ditemukan.</p>
                        <p id="errorRelatedMessage" class="status-message error-message" style="display: none;">Terjadi kesalahan saat memuat batik serupa.</p>
                    </div>
                </section>
            </section>
        `;
    },

    async afterRender() {
        const parsedUrl = UrlParser.parseActiveUrlWithoutCombiner();
        const batikId = parsedUrl.id;
        console.log('BatikDetail: ID Batik yang diambil dari URL:', batikId);

        const batikDetailContent = document.getElementById('batikDetailContent');
        const actualBatikDetail = document.getElementById('actualBatikDetail');
        const loadingDetailMessage = document.getElementById('loadingDetailMessage');
        const noDetailMessage = document.getElementById('noDetailMessage');
        const errorDetailMessage = document.getElementById('errorDetailMessage');

        const hideAllDetailMessages = () => {
            loadingDetailMessage.style.display = 'none';
            noDetailMessage.style.display = 'none';
            errorDetailMessage.style.display = 'none';
            actualBatikDetail.style.display = 'none';
        };

        hideAllDetailMessages();
        
        if (!batikId) {
            hideAllDetailMessages();
            noDetailMessage.style.display = 'block';
            noDetailMessage.textContent = 'ID batik tidak ditemukan di URL.';
            
            return;
        }

        loadingDetailMessage.style.display = 'block';
        let batikData = null;

        try {
            const detailResult = await BatikApi.getBatikDetail(batikId);

            loadingDetailMessage.style.display = 'none';

            if (detailResult.success && detailResult.data) {
                batikData = detailResult.data;
                const imageUrl = batikData.link_image || batikData.imageUrl || placeholderImage;

                actualBatikDetail.innerHTML = `
                    <div class="main-batik-info">
                        <img src="${imageUrl}" alt="${batikData.name}" class="main-batik-image">
                        <h1>${batikData.name || 'Motif Batik Tidak Dikenal'}</h1>
                        <p>${batikData.description || 'Deskripsi tidak tersedia.'}</p>
                        <p><strong>Asal Daerah:</strong> <br>${batikData.provinsi || 'Tidak diketahui'}</p>
                        ${batikData.occasion ? `<p><strong>Saran Penggunaan:</strong> <br>${batikData.occasion}</p>` : ''}
                        <p><strong>Sejarah:</strong> <br>${batikData.history || 'Tidak tersedia'}</p>
                        <p><a href="#/home" class="view-detail-link">Kembali</a></p>
                    </div>
                `;
                actualBatikDetail.style.display = 'block'; 
                console.log('BatikDetail: Detail batik utama berhasil dimuat:', batikData);
            } else {
                noDetailMessage.style.display = 'block';
                noDetailMessage.textContent = detailResult.message || 'Gagal memuat detail batik.';
                console.error('BatikDetail: Gagal memuat detail batik. Pesan:', detailResult.message);
                
                return;
            }
        } catch (error) {
            console.error('BatikDetail: Error fetching batik detail:', error);
            hideAllDetailMessages();
            errorDetailMessage.style.display = 'block';
            errorDetailMessage.textContent = `Terjadi kesalahan jaringan: ${error.message || 'Mohon coba lagi.'}`;
            
            return;
        }
        
        console.log('BatikDetail: Halaman selesai dirender.');
    },
};

export default BatikDetail;