import '../styles/styles.css';
import BatikApi from '../services/batik-api';
import decorativeScanImage from '../assets/images/Image (1).png';
import placeholderImage from '../assets/images/profil.jpeg';

let _currentSelectedFile = null;
let _cameraMediaStream = null;

const Scan = {
    async render() {
        return `
            <div class="scan-page-container">
                <main class="scan-main-container">

                    <div class="scan-header" id="scanHeader">
                        <div class="scan-header-text">
                            <h1>Scan Your Batik</h1>
                            <p>Unggah Foto Batikmu untuk Mengetahui Sejarahnya!</p>
                        </div>
                        <div class="scan-decorative-image">
                            <img src="${decorativeScanImage}" alt="Dekorasi Scan Batik">
                        </div>
                    </div>
                    <div class="camera-view-container" id="cameraViewContainer">
                        <div id="cameraPlaceholder" class="placeholder-content">
                            <p>Area untuk tampilan kamera</p>
                        </div>
                        <video id="cameraFeed" autoplay playsinline></video>
                        <div id="imagePreview"></div>
                    </div>

                    <div class="camera-buttons" id="cameraButtons">
                        <button type="button" id="startCameraButton" class="action-scan-button">Nyalakan Kamera</button>
                        <button type="button" id="stopCameraButton" class="action-scan-button">Matikan Kamera</button>
                        <button type="button" id="takePhotoButton" class="action-scan-button">Ambil Foto</button>
                    </div>

                    <div class="upload-button-container" id="uploadAreaContainer">
                        <button type="button" class="upload-button" id="uploadImageButton">
                            <span class="upload-icon"></span> Upload Image
                        </button>
                        <input type="file" id="imageUploadInput" accept="image/*" style="display: none;">
                    </div>
                    
                    <div class="scan-action-container">
                        <button type="button" class="action-scan-button" id="scanButton">Scan</button>
                    </div>
                    <div id="resultView" style="display: none;">
                        <p id="scanStatusMessage" class="status-message"></p>
                        <div class="scan-results-display" id="scanResultsDisplay">
                            <h2 class="results-title">HASIL SCAN</h2>
                            <div class="batik-display-card">
                                <div class="scanned-image-result-container" id="scannedImageResultContainer"></div>
                                <div class="batik-info-result-section" id="batikInfoResultSection"></div>
                            </div>
                            <div class="related-batiks-section">
                                <h3 class="related-batiks-title">Batik Serupa Lainnya</h3>
                                <div id="relatedBatiksGrid" class="batik-grid"></div>
                            </div>
                        </div>
                        <button id="scanAgainButton" class="action-scan-button">Scan Lagi</button>
                    </div>
                    
                    <canvas id="cameraCanvas" style="display: none;"></canvas>
                </main>
            </div>
        `;
    },

    async afterRender() {
        const dom = {
            scanHeader: document.getElementById('scanHeader'),
            cameraViewContainer: document.getElementById('cameraViewContainer'),
            cameraPlaceholder: document.getElementById('cameraPlaceholder'),
            cameraFeed: document.getElementById('cameraFeed'),
            imagePreview: document.getElementById('imagePreview'),
            cameraButtons: document.getElementById('cameraButtons'),
            startCameraButton: document.getElementById('startCameraButton'),
            stopCameraButton: document.getElementById('stopCameraButton'),
            takePhotoButton: document.getElementById('takePhotoButton'),
            uploadAreaContainer: document.getElementById('uploadAreaContainer'),
            uploadImageButton: document.getElementById('uploadImageButton'),
            imageUploadInput: document.getElementById('imageUploadInput'),
            scanButton: document.getElementById('scanButton'),
            resultView: document.getElementById('resultView'),
            scanStatusMessage: document.getElementById('scanStatusMessage'),
            scanResultsDisplay: document.getElementById('scanResultsDisplay'),
            scannedImageResultContainer: document.getElementById('scannedImageResultContainer'),
            batikInfoResultSection: document.getElementById('batikInfoResultSection'),
            relatedBatiksGrid: document.getElementById('relatedBatiksGrid'),
            scanAgainButton: document.getElementById('scanAgainButton'),
            cameraCanvas: document.getElementById('cameraCanvas'),
        };

        const setUIState = (state) => {
            dom.scanHeader.style.display = 'none';
            dom.cameraViewContainer.style.display = 'none';
            dom.cameraButtons.style.display = 'none';
            dom.uploadAreaContainer.style.display = 'none';
            dom.scanButton.style.display = 'none';
            dom.resultView.style.display = 'none';

            if (state === 'initial') {
                dom.scanHeader.style.display = 'flex';
                dom.cameraViewContainer.style.display = 'flex';
                dom.cameraButtons.style.display = 'block';
                dom.uploadAreaContainer.style.display = 'block';
                dom.scanButton.style.display = 'block';

                dom.cameraPlaceholder.style.display = 'flex';
                dom.cameraFeed.style.display = 'none';
                dom.imagePreview.style.display = 'none';
                dom.imagePreview.innerHTML = '';

                dom.startCameraButton.style.display = 'inline-block';
                dom.stopCameraButton.style.display = 'none';
                dom.takePhotoButton.style.display = 'none';
            } else if (state === 'cameraOn') {
                dom.scanHeader.style.display = 'flex';
                dom.cameraViewContainer.style.display = 'flex';
                dom.cameraButtons.style.display = 'block';
                dom.uploadAreaContainer.style.display = 'block';
                dom.scanButton.style.display = 'block';

                dom.cameraPlaceholder.style.display = 'none';
                dom.cameraFeed.style.display = 'block';
                dom.imagePreview.style.display = 'none';
                dom.imagePreview.innerHTML = '';
                _currentSelectedFile = null;

                dom.startCameraButton.style.display = 'none';
                dom.stopCameraButton.style.display = 'inline-block';
                dom.takePhotoButton.style.display = 'inline-block';
            } else if (state === 'preview') {
                dom.scanHeader.style.display = 'flex';
                dom.cameraViewContainer.style.display = 'flex';
                dom.cameraButtons.style.display = 'block';
                dom.uploadAreaContainer.style.display = 'block';
                dom.scanButton.style.display = 'block';

                dom.cameraPlaceholder.style.display = 'none';
                dom.cameraFeed.style.display = 'none';
                dom.imagePreview.style.display = 'block';
                
                dom.startCameraButton.style.display = 'inline-block';
                dom.stopCameraButton.style.display = 'none';
                dom.takePhotoButton.style.display = 'none';
            } else if (state === 'loading') {
                dom.scanHeader.style.display = 'none';
                dom.resultView.style.display = 'block';
                dom.scanResultsDisplay.style.display = 'none';
                dom.scanStatusMessage.style.display = 'block';
                dom.scanStatusMessage.textContent = 'Menganalisis gambar...';
                dom.scanStatusMessage.style.color = 'blue';
                dom.scanAgainButton.style.display = 'none';
            } else if (state === 'result') {
                dom.scanHeader.style.display = 'none';
                dom.resultView.style.display = 'block';
                dom.scanAgainButton.style.display = 'block';
            }
        };

        const handleFileSelection = (file) => {
            if (!file || !file.type.startsWith('image/')) {
                _currentSelectedFile = null;
                dom.imagePreview.innerHTML = '';
                setUIState('initial');
                return;
            }
            _currentSelectedFile = file;
            const reader = new FileReader();
            reader.onload = (e) => dom.imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            reader.readAsDataURL(file);
            setUIState('preview');
        };

        dom.startCameraButton.addEventListener('click', async () => {
            if (_cameraMediaStream) {
                _cameraMediaStream.getTracks().forEach(track => track.stop());
                _cameraMediaStream = null;
            }
            _currentSelectedFile = null;
            setUIState('cameraOn');
            try {
                _cameraMediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
                dom.cameraFeed.srcObject = _cameraMediaStream;
            } catch (err) {
                alert('Gagal mengakses kamera. Pastikan Anda memberikan izin.');
                setUIState('initial');
            }
        });

        dom.stopCameraButton.addEventListener('click', () => {
            if (_cameraMediaStream) {
                _cameraMediaStream.getTracks().forEach(track => track.stop());
                _cameraMediaStream = null;
            }
            setUIState('initial');
        });

        dom.takePhotoButton.addEventListener('click', () => {
            if (!_cameraMediaStream) return;
            const context = dom.cameraCanvas.getContext('2d');
            context.canvas.width = dom.cameraFeed.videoWidth;
            context.canvas.height = dom.cameraFeed.videoHeight;
            context.drawImage(dom.cameraFeed, 0, 0);

            if (_cameraMediaStream) {
                _cameraMediaStream.getTracks().forEach(track => track.stop());
                _cameraMediaStream = null;
            }

            context.canvas.toBlob((blob) => {
                handleFileSelection(new File([blob], "capture.png", { type: "image/png" }));
            });
        });

        dom.uploadImageButton.addEventListener('click', () => {
            dom.imageUploadInput.value = null; 
            dom.imageUploadInput.click();
        });
        dom.imageUploadInput.addEventListener('change', (e) => {
            if (_cameraMediaStream) {
                _cameraMediaStream.getTracks().forEach(track => track.stop());
                _cameraMediaStream = null;
            }
            handleFileSelection(e.target.files[0]);
        });
        
        dom.scanButton.addEventListener('click', async () => {
            if (!_currentSelectedFile) {
                alert('Silakan pilih gambar terlebih dahulu!');
                return;
            }
            setUIState('loading');
            try {
                const result = await BatikApi.classifyBatik(_currentSelectedFile);
                if (!result.success || !result.data?.data) {
                    throw new Error(result.message || 'Scan gagal, format respons tidak sesuai.');
                }
                setUIState('result');
                dom.scanStatusMessage.style.display = 'none';
                dom.scanResultsDisplay.style.display = 'block';
                await displayScanResults(result.data.data);
            } catch (error) {
                setUIState('result');
                console.error('Error saat klasifikasi:', error);
                dom.scanResultsDisplay.style.display = 'none';
                dom.scanStatusMessage.style.display = 'block';
                dom.scanStatusMessage.textContent = error.message;
                dom.scanStatusMessage.style.color = 'red';
            }
        });

        dom.scanAgainButton.addEventListener('click', () => {
            dom.imagePreview.innerHTML = '';
            _currentSelectedFile = null;
            setUIState('initial');
        });

        async function displayScanResults(data) {
            const scannedImageUrl = data.imageUrl || placeholderImage; 
            const prediction = data.prediction || {};
            const motifData = data.motifData || {};
            
            const batikName = prediction.motif_name || motifData.name || 'Motif Tidak Dikenal';
            const batikDescription = motifData.description || 'Deskripsi tidak tersedia.';
            const batikOrigin = motifData.provinsi || prediction.provinsi || '';
            const batikConfidence = prediction.confidence;
            const batikMotifId = prediction.motif_id || motifData.id;
            const batikHistory = motifData.history || "Informasi sejarah tidak tersedia.";
            const batikOccasion = motifData.occasion || "Informasi kegunaan tidak tersedia.";

            dom.scannedImageResultContainer.innerHTML = `
                <img src="${scannedImageUrl}" alt="Hasil Scan ${batikName}">
                <div class="motif-label-button">${batikName.toUpperCase()}</div>
                ${batikConfidence ? `<p class="confidence-score">Akurasi: ${Math.round(batikConfidence)}%</p>` : ''}
            `;

            dom.batikInfoResultSection.innerHTML = `
                <h2>${batikName}</h2>
                <p>${batikDescription}</p>
                <p><strong>Asal Daerah:</strong> ${batikOrigin || 'Tidak diketahui'}</p>
                <p><strong>Histori Batik:</strong> ${batikHistory}</p>
                <p><strong>Kegunaan Batik:</strong> ${batikOccasion}</p>
            `;
            
            let relatedBatiksHtml = '';
            let titleForRelated = 'Batik Serupa Lainnya';

            dom.relatedBatiksGrid.innerHTML = '<p class="loading-message">Memuat batik berdasarkan provinsi...</p>';
            try {
                const resultProvinsi = await BatikApi.getMotifsGroupedByProvince();
                if (resultProvinsi.success && resultProvinsi.data) {
                    const provincesArray = resultProvinsi.data;
                    
                    if (batikOrigin && provincesArray.find(p => p.provinsi === batikOrigin)) {
                        const targetProvinceObj = provincesArray.find(p => p.provinsi === batikOrigin);
                        const batiksInScannedProvince = targetProvinceObj.motifs;
                        
                        titleForRelated = `Batik Lainnya dari ${batikOrigin}`;

                        const filteredBatiks = batiksInScannedProvince.filter(batik =>
                            batik.id !== (motifData.id || prediction.motif_id)
                        );

                        if (filteredBatiks.length > 0) {
                            relatedBatiksHtml += filteredBatiks.map(batik => `
                                <div class="batik-card" data-id="${batik.id}">
                                    <div class="batik-card-image-placeholder">
                                        <img src="${batik.link_image || batik.imageUrl || placeholderImage}" alt="${batik.name}"/>
                                    </div>
                                    <div class="batik-card-label">${batik.name}</div>
                                </div>
                            `).join('');
                        } else {
                            if (batiksInScannedProvince.length === 1 && batiksInScannedProvince[0].id === (motifData.id || prediction.motif_id)) {
                                relatedBatiksHtml = `<p>Hanya satu motif dari ${batikOrigin} yang ditemukan dalam koleksi.</p>`;
                            } else {
                                relatedBatiksHtml = `<p>Tidak ada batik lain dari ${batikOrigin} dalam koleksi.</p>`;
                            }
                        }
                    } else {
                        relatedBatiksHtml = '<p>Tidak ditemukan batik dari provinsi asal batik yang di-scan.</p>';
                        titleForRelated = 'Batik Berdasarkan Provinsi Lainnya';
                    }

                    dom.relatedBatiksGrid.innerHTML = relatedBatiksHtml;
                    dom.scanResultsDisplay.querySelector('.related-batiks-section .related-batiks-title').textContent = titleForRelated; 
                    
                    const relatedBatikCards = dom.relatedBatiksGrid.querySelectorAll('.batik-card');
                    relatedBatikCards.forEach(card => {
                        card.addEventListener('click', (e) => {
                            e.preventDefault();
                            const newBatikId = card.dataset.id;
                            if (newBatikId) {
                                console.log('Mengklik kartu batik serupa, mengarahkan ke ID:', newBatikId);
                                window.location.hash = `#/batik/${newBatikId}`;
                            } else {
                                console.warn('ID batik tidak ditemukan pada kartu yang diklik.');
                            }
                        });
                    });

                } else {
                    console.warn('Gagal memuat motif berdasarkan provinsi dari API:', resultProvinsi.message);
                    dom.relatedBatiksGrid.innerHTML = '<p>Gagal memuat daftar motif berdasarkan provinsi.</p>';
                }
            } catch (error) {
                console.error('Error fetching motifs grouped by province:', error);
                dom.relatedBatiksGrid.innerHTML = '<p>Terjadi kesalahan saat memuat motif berdasarkan provinsi.</p>';
            }
            
            dom.scanResultsDisplay.style.display = 'block';
        }

        setUIState('initial');
    },
    async unmount() {
        console.log('Unmounting Scan page, stopping camera...');
        if (_cameraMediaStream) {
            _cameraMediaStream.getTracks().forEach(track => track.stop());
            _cameraMediaStream = null;
            console.log('Camera stream stopped successfully.');
        }
        return true;
    }
};

export default Scan;