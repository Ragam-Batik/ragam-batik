// src/components/header/headerlog.js
import headerLogoImage from '../../assets/images/Group 1000009757.png';

const HeaderLog = {
    // Ini adalah render method untuk header KETIKA USER BELUM LOGIN (untuk Sign In/Sign Up page)
    renderLoggedOut() {
        return `
            <header class="app-header main-header-loggedout"> <div class="header-content-wrapper-loggedout">
                    <div class="main-header">
                        <div class="header-logo-loggedout">
                            <a href="#/"> <img id="headerLogoLog" src="${headerLogoImage}" alt="Ragam Batik Logo">
                            </a>
                        </div>
                        
                        <button class="hamburger-menu" aria-label="Toggle navigation" id="hamburgerMenuLog">
                            <span class="bar"></span>
                            <span class="bar"></span>
                            <span class="bar"></span>
                        </button>

                        <nav id="navigation-drawer-loggedout" class="app-navigation navigation-drawer-loggedout"> <ul id="nav-list-loggedout" class="nav-list-loggedout">
                                <li><a href="#/">Beranda</a></li> 
                                <li><a href="#/signin">Sign In</a></li>
                                <li><a href="#/signup" class="sign-up-button">Sign Up &rarr;</a></li>
                            </ul>
                        </nav>
                        </div>
                </div> 
            </header>
        `;
    },

    // NEW: Render method untuk header yang sangat minimal (seperti di image_d6b895.jpg)
    renderSplashHeader() {
        return `
            <header class="splash-header-container">
                <div class="splash-header-main-wrapper">
                    <div class="splash-header-logo">
                        <a href="#/"> <img src="${headerLogoImage}" alt="Ragam Batik Logo">
                        </a>
                    </div>
                    <div class="splash-header-right-empty">
                        </div>
                </div> 
                <div class="splash-header-bottom-strip"></div>
            </header>
        `;
    },

    // --- afterRender untuk HeaderLog ---
    async afterRender() {
        // Ambil referensi elemen DOM untuk hamburger menu dan navigasi drawer
        // Gunakan ID yang spesifik untuk HeaderLog agar tidak bentrok dengan Header (logged-in)
        const hamburgerButtonLog = document.getElementById('hamburgerMenuLog');
        const navigationDrawerLog = document.getElementById('navigation-drawer-loggedout');
        const navListLog = document.getElementById('nav-list-loggedout'); // Untuk menutup menu saat link diklik

        // --- Setup Event Listener untuk Hamburger Menu HeaderLog ---
        if (hamburgerButtonLog && navigationDrawerLog) {
            hamburgerButtonLog.addEventListener('click', () => {
                hamburgerButtonLog.classList.toggle('active');
                navigationDrawerLog.classList.toggle('active');
                document.body.classList.toggle('no-scroll', navigationDrawerLog.classList.contains('active'));
            });

            // Tutup menu saat link navigasi diklik
            if (navListLog) {
                navListLog.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', () => {
                        if (navigationDrawerLog.classList.contains('active')) {
                            hamburgerButtonLog.classList.remove('active');
                            navigationDrawerLog.classList.remove('active');
                            document.body.classList.remove('no-scroll');
                        }
                    });
                });
            }
        } else {
            // Ini normal jika renderSplashHeader() yang dipanggil, karena tidak ada hamburger
            console.warn("Hamburger button atau navigation drawer untuk HeaderLog tidak ditemukan. Mungkin Anda berada di halaman splash.");
        }

        // --- Event Listener untuk Search (Jika ada di HeaderLog) ---
        // Jika Anda memutuskan untuk punya search bar di HeaderLog.renderLoggedOut()
        // Anda perlu menambahkan logika di sini (mirip dengan Header.js)
        /*
        const searchButtonLog = document.getElementById('searchButtonLog');
        const searchKeywordInputLog = document.getElementById('searchKeywordInputLog');
        if (searchButtonLog && searchKeywordInputLog) {
            searchButtonLog.addEventListener('click', () => {
                const keyword = searchKeywordInputLog.value.trim();
                if (keyword) {
                    window.location.hash = `#/hasilsearch/${encodeURIComponent(keyword)}`;
                } else {
                    alert('Mohon masukkan kata kunci pencarian!');
                }
            });
            searchKeywordInputLog.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    searchButtonLog.click();
                }
            });
        }
        */
    },
};

export default HeaderLog;