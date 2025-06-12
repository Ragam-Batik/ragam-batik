import '../styles/styles.css'; 
import BatikApi from '../services/batik-api';
import UrlParser from '../routes/url-parser';
import placeholderImage from '../assets/images/profil.jpeg'; 

const HasilSearch = {
    async render() {
        return `
            <main class="main-content">
                <div class="section-title-bar">
                    <h2>Hasil Pencarian <span id="searchQuery"></span></h2>
                </div>

                <div class="results-grid" id="searchResultsGrid">
                    </div>

                <p id="loadingMessage" class="status-message">Memuat hasil pencarian...</p>
                <p id="noResultsMessage" class="status-message" style="display: none;">Tidak ditemukan batik dengan kata kunci tersebut.</p>
                <p id="errorMessage" class="status-message error-message" style="display: none;">Terjadi kesalahan saat memuat data. Mohon coba lagi nanti.</p>

                <div class="pagination-container">
                    <button id="prevPageBtn" class="pagination-button" aria-label="Halaman Sebelumnya">←</button>
                    <button id="nextPageBtn" class="pagination-button" aria-label="Halaman Berikutnya">→</button>
                </div>
            </main>
        `;
    },

    async afterRender() {
        const parsedUrl = UrlParser.parseActiveUrlWithoutCombiner();
        const keyword = parsedUrl.id; 

        const searchQueryDisplay = document.getElementById('searchQuery');
        const searchResultsGrid = document.getElementById('searchResultsGrid');
        const loadingMessage = document.getElementById('loadingMessage');
        const noResultsMessage = document.getElementById('noResultsMessage');
        const errorMessage = document.getElementById('errorMessage');
        const prevPageBtn = document.getElementById('prevPageBtn');
        const nextPageBtn = document.getElementById('nextPageBtn');

        const resetDisplay = () => {
            loadingMessage.style.display = 'none';
            noResultsMessage.style.display = 'none';
            errorMessage.style.display = 'none';
            searchResultsGrid.innerHTML = '';
            prevPageBtn.style.display = 'none';
            nextPageBtn.style.display = 'none';
        };

        resetDisplay();

        function capitalizeWords(str) {
            if (!str) return '';
            return str.split(' ')
                       .map(word => {
                           if (word.length === 0) return '';
                           return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                       })
                       .join(' ');
        }

        if (keyword) {
            const formattedKeyword = capitalizeWords(decodeURIComponent(keyword));
            searchQueryDisplay.textContent = `Batik ${formattedKeyword}`;
            
            loadingMessage.style.display = 'block'; 

            try {
                console.log('HasilSearch: Memanggil BatikApi.searchBatiks() untuk keyword:', decodeURIComponent(keyword));
                const results = await BatikApi.searchBatiks(decodeURIComponent(keyword));
                
                console.log('HasilSearch: results (objek lengkap dari BatikApi.searchBatiks()):', results);
                console.log('HasilSearch: results.success:', results.success);
                console.log('HasilSearch: results.data (isi properti data dari objek hasil):', results.data);
                console.log('HasilSearch: Apakah results.data ini sebuah array?', Array.isArray(results.data));
                console.log('HasilSearch: Panjang results.data (jika array):', results.data ? results.data.length : 'N/A');

                loadingMessage.style.display = 'none'; 

                if (results.success && Array.isArray(results.data) && results.data.length > 0) {
                    console.log('HasilSearch: Kondisi TRUE. Menampilkan item pencarian.');
                    let batikCardsHtml = '';
                    results.data.forEach(batik => {
                        const imageUrl = batik.link_image || batik.imageUrl || placeholderImage;
                        const batikId = batik.id || null; 

                        batikCardsHtml += `
                            <div class="batik-result-card" data-id="${batikId}">
                                <div class="batik-result-image-placeholder">
                                    <img src="${imageUrl}" alt="${batik.name}" loading="lazy">
                                </div>
                                <div class="batik-result-label">${batik.name}</div>
                            </div>
                        `;
                    });
                    searchResultsGrid.innerHTML = batikCardsHtml;

                    document.querySelectorAll('.batik-result-card').forEach(card => {
                        card.addEventListener('click', (e) => {
                            if (e.target.tagName === 'A') return; 
                            const detailId = card.dataset.id;
                            if (detailId) {
                                window.location.hash = `#/batik/${detailId}`;
                            }
                        });
                    });

                } else if (results.success && Array.isArray(results.data) && results.data.length === 0) {
                    console.log('HasilSearch: Tidak ada hasil ditemukan untuk keyword ini.');
                    noResultsMessage.textContent = `Tidak ditemukan batik untuk kata kunci "${decodeURIComponent(keyword)}".`;
                    noResultsMessage.style.display = 'block'; 
                } else {
                    console.error('HasilSearch: API error atau format data tidak sesuai.', results);
                    errorMessage.textContent = `Terjadi kesalahan saat memuat hasil pencarian. Pesan: ${results.message || 'Data tidak valid.'}`;
                    errorMessage.style.display = 'block'; 
                }
            } catch (error) {
                console.error('HasilSearch: Error saat mengambil data pencarian:', error);
                loadingMessage.style.display = 'none'; 
                errorMessage.textContent = `Terjadi kesalahan jaringan atau server. Mohon coba lagi nanti. (${error.message || 'Unknown error'})`;
                errorMessage.style.display = 'block'; 
            }
        } else {
            console.log('HasilSearch: Tidak ada keyword dalam URL.');
            searchQueryDisplay.textContent = ''; 
            noResultsMessage.textContent = 'Silakan masukkan kata kunci pencarian.';
            noResultsMessage.style.display = 'block'; 
        }
    },
};

export default HasilSearch;