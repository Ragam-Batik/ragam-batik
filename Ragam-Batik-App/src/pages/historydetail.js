import '../styles/styles.css';
import '../styles/batikdetail.css';

import BatikApi from '../services/batik-api';
import UrlParser from '../routes/url-parser';
import placeholderImage from '../assets/images/profil.jpeg';

const HistoryDetail = {
    async render() {
        return `
            <section class="history-detail-page-container main-content"> <div id="historyDetailContent" class="detail-content">
                    <p id="loadingHistoryDetailMessage" class="status-message">Memuat detail riwayat...</p>
                    <p id="noHistoryDetailMessage" class="status-message" style="display: none;">Detail riwayat tidak ditemukan.</p>
                    <p id="errorHistoryDetailMessage" class="status-message error-message" style="display: none;">Terjadi kesalahan saat memuat detail riwayat.</p>
                    <div id="actualHistoryDetail" style="display: none;"></div>
                </div>
                
                <section class="related-batiks-section">
                    <h2 id="relatedSectionTitle" class="related-batiks-title" style="display: none;"></h2>
                    <div id="relatedBatiksGrid" class="batik-grid">
                        <p id="loadingRelatedMessage" class="status-message"></p>
                        <p id="noRelatedMessage" class="status-message" style="display: none;"></p>
                        <p id="errorRelatedMessage" class="status-message error-message" style="display: none;"></p>
                    </div>
                </section>
            </section>
        `;
    },

    async afterRender() {
        const parsedUrl = UrlParser.parseActiveUrlWithoutCombiner();
        const historyId = parsedUrl.id;
        console.log('HistoryDetail: ID Riwayat yang diambil dari URL:', historyId);

        const historyDetailContent = document.getElementById('historyDetailContent');
        const actualHistoryDetail = document.getElementById('actualHistoryDetail');
        const loadingHistoryDetailMessage = document.getElementById('loadingHistoryDetailMessage');
        const noHistoryDetailMessage = document.getElementById('noHistoryDetailMessage');
        const errorHistoryDetailMessage = document.getElementById('errorHistoryDetailMessage');

        const relatedSectionTitle = document.getElementById('relatedSectionTitle');
        const relatedBatiksGrid = document.getElementById('relatedBatiksGrid');
        const loadingRelatedMessage = document.getElementById('loadingRelatedMessage');
        const noRelatedMessage = document.getElementById('noRelatedMessage');
        const errorRelatedMessage = document.getElementById('errorRelatedMessage');
        
        const hideAllHistoryDetailMessages = () => {
            if (loadingHistoryDetailMessage) loadingHistoryDetailMessage.style.display = 'none';
            if (noHistoryDetailMessage) noHistoryDetailMessage.style.display = 'none';
            if (errorHistoryDetailMessage) errorHistoryDetailMessage.style.display = 'none';
            if (actualHistoryDetail) actualHistoryDetail.style.display = 'none';
        };

        const hideAllRelatedMessages = () => {
            if (loadingRelatedMessage) loadingRelatedMessage.style.display = 'none';
            if (noRelatedMessage) noRelatedMessage.style.display = 'none';
            if (errorRelatedMessage) errorRelatedMessage.style.display = 'none';
            if (relatedBatiksGrid) relatedBatiksGrid.innerHTML = '';
            if (relatedSectionTitle) relatedSectionTitle.style.display = 'none';
        };

        hideAllHistoryDetailMessages();
        hideAllRelatedMessages();

        if (!historyId) {
            hideAllHistoryDetailMessages();
            if (noHistoryDetailMessage) {
                noHistoryDetailMessage.style.display = 'block';
                noHistoryDetailMessage.textContent = 'ID riwayat tidak ditemukan di URL.';
            }
            return;
        }

        if (loadingHistoryDetailMessage) loadingHistoryDetailMessage.style.display = 'block';
        let historyData = null;

        try {
            const detailResult = await BatikApi.getHistoryDetail(historyId);

            if (loadingHistoryDetailMessage) loadingHistoryDetailMessage.style.display = 'none';
            
            if (detailResult.success && detailResult.data) {
                historyData = Array.isArray(detailResult.data) ? detailResult.data[0] : detailResult.data;
                
                if (!historyData) {
                    hideAllHistoryDetailMessages();
                    if (noHistoryDetailMessage) {
                        noHistoryDetailMessage.style.display = 'block';
                        noHistoryDetailMessage.textContent = 'Data detail riwayat tidak ditemukan.';
                    }
                    console.error('HistoryDetail: Data riwayat kosong setelah fetch.');
                    return;
                }

                const scannedImageUrl = historyData.image_url || placeholderImage;
                const motifName = historyData.motif_name || 'Tidak Dikenal';
                const provinsi = historyData.provinsi || 'Tidak Diketahui';
                const description = historyData.description || 'Deskripsi tidak tersedia.';
                const occasion = historyData.occasion || null;
                
                const confidence = historyData.confidence_score ? `${historyData.confidence_score.toFixed(2)}%` : 'N/A';
                const scannedAt = historyData.created_at ? new Date(historyData.created_at).toLocaleString('id-ID', {
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                }) : 'Tanggal tidak tersedia';
                const motifId = historyData.motif_id;

                if (actualHistoryDetail) {
                    actualHistoryDetail.innerHTML = `
                        <div class="main-batik-info"> <img src="${scannedImageUrl}" alt="Batik di-scan" class="main-batik-image">
                            <h1>${motifName}</h1>
                            <p>${description}</p>
                            <p><strong>Provinsi:</strong> ${provinsi}</p>
                            <p><strong>Tingkat Akurasi:</strong> ${confidence}</p>
                            <p><strong>Waktu Scan:</strong> ${scannedAt}</p>
                            ${occasion ? `<p><strong>Saran Penggunaan:</strong> ${occasion}</p>` : ''}
                            <p><a href="#/history" class="view-detail-link">Kembali</a></p>
                        </div>
                    `;
                    actualHistoryDetail.style.display = 'block';
                }
                console.log('HistoryDetail: Detail riwayat berhasil dimuat:', historyData);

                if (motifId && provinsi) {
                    await this._fetchBatiksByProvince(provinsi, motifId);
                } else {
                    console.warn('HistoryDetail: Motif ID atau Provinsi tidak ditemukan dari data riwayat, tidak dapat memuat batik serupa berdasarkan provinsi.');
                    if (noRelatedMessage) {
                        noRelatedMessage.style.display = 'block';
                        noRelatedMessage.textContent = 'Tidak ada batik serupa yang dapat ditampilkan.';
                    }
                }

            } else {
                hideAllHistoryDetailMessages();
                if (noHistoryDetailMessage) {
                    noHistoryDetailMessage.style.display = 'block';
                    noHistoryDetailMessage.textContent = detailResult.message || 'Gagal memuat detail riwayat.';
                }
                console.error('HistoryDetail: Gagal memuat detail riwayat. Pesan:', detailResult.message);
                return;
            }
        } catch (error) {
            console.error('HistoryDetail: Error fetching history detail:', error);
            hideAllHistoryDetailMessages();
            if (errorHistoryDetailMessage) {
                errorHistoryDetailMessage.style.display = 'block';
                errorHistoryDetailMessage.textContent = `Terjadi kesalahan jaringan: ${error.message || 'Mohon coba lagi.'}`;
            }
            return;
        }

        console.log('HistoryDetail: Halaman selesai dirender.');
    },

    async _fetchBatiksByProvince(provinceName, currentMotifId) {
        const relatedSectionTitle = document.getElementById('relatedSectionTitle');
        const relatedBatiksGrid = document.getElementById('relatedBatiksGrid');
        const loadingRelatedMessage = document.getElementById('loadingRelatedMessage');
        const noRelatedMessage = document.getElementById('noRelatedMessage');
        const errorRelatedMessage = document.getElementById('errorRelatedMessage');

        const hideAllRelatedMessages = () => {
            if (loadingRelatedMessage) loadingRelatedMessage.style.display = 'none';
            if (noRelatedMessage) noRelatedMessage.style.display = 'none';
            if (errorRelatedMessage) errorRelatedMessage.style.display = 'none';
            if (relatedBatiksGrid) relatedBatiksGrid.innerHTML = '';
            if (relatedSectionTitle) relatedSectionTitle.style.display = 'none';
        };

        hideAllRelatedMessages();
        
        if (loadingRelatedMessage) {
            loadingRelatedMessage.style.display = 'block';
            loadingRelatedMessage.textContent = `Memuat batik lainnya dari ${provinceName}...`;
        }
        if (relatedSectionTitle) {
            relatedSectionTitle.textContent = `Batik Lainnya dari ${provinceName}`;
            relatedSectionTitle.style.display = 'block';
        }

        try {
            const allMotifsResult = await BatikApi.getMotifsGroupedByProvince();

            hideAllRelatedMessages();

            if (allMotifsResult.success && allMotifsResult.data) {
                const groupedMotifs = allMotifsResult.data;
                const batiksInSameProvince = groupedMotifs[provinceName] || [];

                const filteredBatiks = batiksInSameProvince.filter(batik => 
                    (batik.motif_id || batik.id) !== currentMotifId
                );

                if (filteredBatiks.length > 0) {
                    if (relatedBatiksGrid) {
                        filteredBatiks.slice(0, 4).forEach(batik => {
                            const imageUrl = batik.link_image || batik.imageUrl || placeholderImage;
                            const batikCard = document.createElement('div');
                            batikCard.className = 'batik-card';
                            batikCard.innerHTML = `
                                <img src="${imageUrl}" alt="${batik.name}" class="batik-image-placeholder">
                                <div class="batik-card-info">
                                    <h3><a href="#/batik/${batik.motif_id || batik.id}">${batik.name || 'Batik Tidak Dikenal'}</a></h3>
                                    <p>${batik.provinsi || 'Provinsi tidak diketahui'}</p>
                                </div>
                            `;
                            relatedBatiksGrid.appendChild(batikCard);
                        });
                    }
                    console.log(`HistoryDetail: Batik lainnya dari ${provinceName} berhasil dimuat:`, filteredBatiks);
                } else {
                    if (noRelatedMessage) {
                        noRelatedMessage.style.display = 'block';
                        noRelatedMessage.textContent = `Tidak ada batik lain ditemukan dari ${provinceName}.`;
                    }
                    console.warn(`HistoryDetail: Tidak ada batik lain ditemukan dari ${provinceName}.`);
                }
            } else {
                if (noRelatedMessage) {
                    noRelatedMessage.style.display = 'block';
                    noRelatedMessage.textContent = allMotifsResult.message || `Gagal memuat motif berdasarkan provinsi.`;
                }
                console.error('HistoryDetail: Gagal memuat motif berdasarkan provinsi. Pesan:', allMotifsResult.message);
            }
        } catch (error) {
            console.error('HistoryDetail: Error fetching motifs grouped by province:', error);
            if (errorRelatedMessage) {
                errorRelatedMessage.style.display = 'block';
                errorRelatedMessage.textContent = `Terjadi kesalahan saat memuat batik lainnya: ${error.message || 'Mohon coba lagi.'}`;
            }
        }
    },
};

export default HistoryDetail;