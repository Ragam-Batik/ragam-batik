// src/components/header/header.js (atau index.js sesuai nama file Anda)
import headerLogoImage from '../../assets/images/Group 1000009757.png'; 
import AuthApi from '../../services/auth-api'; // Import AuthApi jika logoutButton memanggil fungsi logout

const Header = {
    // --- Render metode untuk header ketika user SUDAH LOGIN (Navigasi LENGKAP) ---
    renderLoggedIn() {
        return `
            <header class="app-header"> <div class="header-content-wrapper-loggedin"> 
                    <div class="main-header">
                        <div class="header-logo">
                            <a href="#/home"> <img id="headerLogo" src="${headerLogoImage}" alt="Ragam Batik Logo">
                            </a>
                        </div>
                        
                        <button class="hamburger-menu" aria-label="Toggle navigation">
                            <span class="bar"></span>
                            <span class="bar"></span>
                            <span class="bar"></span>
                        </button>

                        <nav id="navigation-drawer" class="app-navigation"> <ul id="nav-list" class="nav-list">
                                <li><a href="#/about">About</a></li>
                                <li><a href="#/home">Home</a></li>
                                <li><a href="#/scan">Scan Feature</a></li>
                                <li><a href="#/history">History</a></li>
                                <li><a href="#/" id="logoutButton">Logout</a></li> 
                                
                                </ul>
                        </nav>
                        <div class="search-container">
                            <input type="text" id="searchKeywordInput" placeholder="Search...">
                            <button type="submit" id="searchButton">
                                <img width="24" height="24" src="https://img.icons8.com/ios-glyphs/30/search--v1.png" alt="Search Icon"/>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        `;
    },

    // --- Render metode untuk header ketika user BELUM LOGIN (Navigasi TERBATAS) ---
    renderLoggedOut() {
        return `
           <header class="app-header"> <div class="header-content-wrapper-loggedin"> 
                    <div class="main-header">
                        <div class="header-logo">
                            <a href="#/home"> <img id="headerLogo" src="${headerLogoImage}" alt="Ragam Batik Logo">
                            </a>
                        </div>

                        <button class="hamburger-menu" aria-label="Toggle navigation">
                            <span class="bar"></span>
                            <span class="bar"></span>
                            <span class="bar"></span>
                        </button>
                        
                        <nav id="navigation-drawer" class="app-navigation"> <ul id="nav-list" class="nav-list">
                                <li><a href="#/about">About</a></li>
                                <li><a href="#/signin" class="sign-up-button">Sign In</a></li> <li><a href="#/signup" class="sign-up-button">Sign Up</a></li> </ul>
                        </nav>
                        <div class="search-container">
                            <input type="text" id="searchKeywordInput" placeholder="Search...">
                            <button type="submit" id="searchButton">
                                <img width="24" height="24" src="https://img.icons8.com/ios-glyphs/30/search--v1.png" alt="Search Icon"/>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        `;
    },

    // --- afterRender untuk Menangani Event Listeners Setelah Header Dirender ---
    async afterRender(userStatus) { // Terima userStatus (loggedIn/loggedOut)
        // Dapatkan referensi elemen DOM setelah header dirender
        const hamburgerButton = document.querySelector('.hamburger-menu');
        const navigationDrawer = document.getElementById('navigation-drawer');
        const headerLogoLink = document.querySelector('.header-logo a'); // Ambil link logo

        // --- Setup Event Listener untuk Hamburger Menu ---
        if (hamburgerButton && navigationDrawer) {
            hamburgerButton.addEventListener('click', () => {
                hamburgerButton.classList.toggle('active');
                navigationDrawer.classList.toggle('active');
                // Opsional: nonaktifkan scroll body saat menu terbuka
                document.body.classList.toggle('no-scroll', navigationDrawer.classList.contains('active'));
            });

            // Tutup menu saat link navigasi diklik (penting untuk SPA)
            navigationDrawer.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    // Pastikan hanya tutup jika menu sedang terbuka dan bukan link yang sama
                    if (navigationDrawer.classList.contains('active')) {
                        hamburgerButton.classList.remove('active');
                        navigationDrawer.classList.remove('active');
                        document.body.classList.remove('no-scroll'); // Hapus no-scroll
                    }
                });
            });
        } else {
            console.warn("Hamburger button atau navigation drawer tidak ditemukan di header.");
        }

        // --- Setup Event Listener untuk Logout Button (jika user login) ---
        if (userStatus === 'loggedIn') {
            const logoutButton = document.getElementById('logoutButton');
            if (logoutButton) {
                logoutButton.addEventListener('click', async (e) => {
                    e.preventDefault(); // Mencegah navigasi default anchor
                    console.log('Logout button clicked');
                    const result = await AuthApi.logout(); // Panggil fungsi logout dari AuthApi
                    if (result.success) {
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('userEmail'); // Hapus juga info user dari localStorage
                        // Memicu event agar App.js bisa merespons dan merender ulang header (dan halaman)
                        document.dispatchEvent(new Event('authStatusChanged'));
                        window.location.hash = '#/home'; // Redirect ke halaman home setelah logout
                        alert('Anda telah berhasil logout.');
                    } else {
                        alert(result.message || 'Gagal logout. Silakan coba lagi.');
                    }
                });
            } else {
                console.warn("Logout button tidak ditemukan, padahal user logged in.");
            }
        }
        
        // --- Setup Event Listener untuk Search Button ---
        const searchButton = document.getElementById('searchButton');
        const searchKeywordInput = document.getElementById('searchKeywordInput');

        if (searchButton && searchKeywordInput) {
            searchButton.addEventListener('click', () => {
                const keyword = searchKeywordInput.value.trim();
                if (keyword) {
                    window.location.hash = `#/hasilsearch/${encodeURIComponent(keyword)}`;
                } else {
                    alert('Mohon masukkan kata kunci pencarian.');
                }
            });

            // Opsional: Pencarian juga bisa dipicu dengan menekan Enter di input
            searchKeywordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    searchButton.click(); // Simulasikan klik tombol pencarian
                }
            });
        } else {
            console.warn("Search button atau input tidak ditemukan.");
        }

        // --- Event Listener untuk Link Logo ---
        if (headerLogoLink) {
            headerLogoLink.addEventListener('click', (e) => {
                // e.preventDefault(); // Tidak perlu preventDefault jika link #/home
                // window.location.hash = '#/home'; // Jika ingin memastikan navigasi via JS
            });
        }
    },
};

export default Header;