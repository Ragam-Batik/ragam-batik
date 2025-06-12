import UrlParser from './routes/url-parser';
import routes from './routes/routes';
import Header from './components/header/header'; 
import HeaderLog from './components/header/headerlog'; 
import Footer from './components/footer';
import AuthApi from './services/auth-api';

class App {
  constructor({ appShellContainer }) {
    this._appShellContainer = appShellContainer;
    this._currentPage = null;
    this._headerElement = null;
    this._mainContentElement = null;
    this._footerElement = null;
    this._navListElement = null;
    this._drawerButtonElement = null;
    this._searchKeywordInput = null;
    this._searchButton = null;
    this._searchContainer = null;
    this._boundLogoutHandler = null;
    this._toggleNavDrawer = null;
    this._closeNavDrawerOnLinkClick = null;
    this._handleSearchClick = null;
    this._handleSearchKeyPress = null;
    this._boundAuthChanged = null;
  }

  async _renderAppShell() {
    const accessToken = localStorage.getItem('accessToken');
    const isLoggedIn = !!accessToken;
    const currentHash = window.location.hash;
    const urlPath = UrlParser.parseActiveUrlWithCombiner(); 
    const fullShellPages = [
        '#/about', '#/home', '#/scan',
        '#/hasilscan', '#/hasilsearch', '#/history',
        '#/batik/:id'
    ];

    const isFullShellPage = fullShellPages.includes(currentHash) ||
                             currentHash.startsWith('#/hasilscan') ||
                             currentHash.startsWith('#/hasilsearch') ||
                             currentHash.startsWith('#/batik/');

    let headerHtml = '';
    let footerHtml = '';
    let headerComponentToRender = null; 
    if (isLoggedIn) {

        headerHtml = Header.renderLoggedIn();
        headerComponentToRender = Header;
    } else {

        if (urlPath === '/signin' || urlPath === '/signup' || urlPath === '/') {

            headerHtml = HeaderLog.renderLoggedOut();
            headerComponentToRender = HeaderLog;
        } else if (urlPath === '/') {

            headerHtml = HeaderLog.renderSplashHeader ? HeaderLog.renderSplashHeader() : HeaderLog.renderLoggedOut();
            headerComponentToRender = HeaderLog;
        } else {

            headerHtml = Header.renderLoggedOut();
            headerComponentToRender = Header;
        }
    }


    if (isFullShellPage) {
        footerHtml = Footer.render();
    } else {
        footerHtml = Footer.renderEmpty();
    }


    this._appShellContainer.innerHTML = `
        ${headerHtml}
        <main id="main-content" class="main-content" tabindex="-1"></main>
        ${footerHtml}
    `;


    this._headerElement = document.querySelector('header');
    this._mainContentElement = document.getElementById('main-content');
    this._footerElement = document.querySelector('footer');


    if (headerComponentToRender && typeof headerComponentToRender.afterRender === 'function') {
        await headerComponentToRender.afterRender();
    }

    this._setupEventListeners(); 
  }

  _setupEventListeners() {

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {

        if (this._boundLogoutHandler) {
            logoutButton.removeEventListener('click', this._boundLogoutHandler);
        }
        this._boundLogoutHandler = async (e) => {
            e.preventDefault();
            const confirmLogout = confirm('Apakah Anda yakin ingin keluar?');
            if (confirmLogout) {
                const result = await AuthApi.logout(); 
                if (result.success) {
                    console.log(result.message);
                    alert('Anda telah berhasil logout!');
                } else {
                    console.error(result.message);
                    alert(`Logout gagal: ${result.message}`);
                }

                window.location.hash = '#/';
                document.dispatchEvent(new Event('authStatusChanged')); 
            }
        };
        logoutButton.addEventListener('click', this._boundLogoutHandler);
    }


    this._drawerButtonElement = document.getElementById('drawer-button');
    this._navListElement = document.getElementById('nav-list');
    if (this._drawerButtonElement && this._navListElement) {

        if (this._toggleNavDrawer) {
            this._drawerButtonElement.removeEventListener('click', this._toggleNavDrawer);
        }
        this._toggleNavDrawer = () => this._navListElement.classList.toggle('open');
        this._drawerButtonElement.addEventListener('click', this._toggleNavDrawer);

        if (this._closeNavDrawerOnLinkClick) {
            this._navListElement.removeEventListener('click', this._closeNavDrawerOnLinkClick);
        }
        this._closeNavDrawerOnLinkClick = (event) => {
            if (event.target.tagName === 'A') { this._navListElement.classList.remove('open'); }
        };
        this._navListElement.addEventListener('click', this._closeNavDrawerOnLinkClick);
    }


    this._searchKeywordInput = document.getElementById('searchKeywordInput');
    this._searchButton = document.getElementById('searchButton');
    this._searchContainer = document.querySelector('.search-container');
    if (this._searchButton && this._searchKeywordInput) {
          this._searchButton.removeEventListener('click', this._handleSearchClick);
          this._searchKeywordInput.removeEventListener('keypress', this._handleSearchKeyPress);

          this._handleSearchClick = () => {
              const keyword = this._searchKeywordInput.value.trim();
              if (keyword) {
                  window.location.hash = `#/hasilsearch/${encodeURIComponent(keyword)}`;
                  this._searchKeywordInput.value = ''; 
              } else {
                  alert('Mohon masukkan kata kunci pencarian!');
              }
          };
          this._searchButton.addEventListener('click', this._handleSearchClick);

          this._handleSearchKeyPress = (e) => {
              if (e.key === 'Enter') {
                  this._searchButton.click(); 
              }
          };
          this._searchKeywordInput.addEventListener('keypress', this._handleSearchKeyPress);
      }


      document.removeEventListener('authStatusChanged', this._boundAuthStatusChanged);
      this._boundAuthChanged = () => this.renderPage(); 
      document.addEventListener('authStatusChanged', this._boundAuthChanged);
  }
  
 
  async renderPage() {

    if (this._currentPage && typeof this._currentPage.unmount === 'function') {
      await this._currentPage.unmount();
    }
    await this._renderAppShell();

    const url = UrlParser.parseActiveUrlWithCombiner(); 
    const page = routes[url] || routes['/not-found'];

    const accessToken = localStorage.getItem('accessToken');
    const isLoggedIn = !!accessToken;

    const publicRoutes = ['/', '/signin', '/signup', '/beranda', '/about'];
    const currentPath = window.location.hash.slice(1).split('/')[0];
    let requiresAuth = !publicRoutes.includes(`/${currentPath}`);
    if (currentPath === '') {
        requiresAuth = false;
    }


    const authenticatedOnlyRoutes = [
        '/home', '/scan', '/hasilscan/:id', '/hasilsearch/:keyword',
        '/history', '/batik/:id'
    ];
    const currentHashForAuth = window.location.hash;

    const isAuthRequiredPage = authenticatedOnlyRoutes.some(route => {
        if (route.includes(':id') || route.includes(':keyword')) {
            const baseRoute = route.split('/')[1];
            return currentHashForAuth.startsWith(`#/${baseRoute}`);
        }
        return currentHashForAuth === `#${route}`
    });


    if (isAuthRequiredPage && !isLoggedIn) {
        window.location.hash = '#/signin';
        const signInPage = routes['/signin'];
        this._mainContentElement.innerHTML = await signInPage.render();
        await signInPage.afterRender();
        return;
    }

    this._mainContentElement.innerHTML = await page.render();
    await page.afterRender();
    this._currentPage = page;
  }
}

export default App;