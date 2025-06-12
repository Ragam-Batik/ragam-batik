const NotFound = {
  async render() {
    return `
      <section id="notFoundPage" class="page-section" style="text-align: center; padding: 50px;">
        <p>
          Halaman tidak ada, silahkan login kembali.
          <br><br>
          <a href="#/" class="primary-button">Kembali ke Beranda</a>
        </p>
      </section>
    `;
  },
  async afterRender() {
    document.querySelector('#notFoundPage a').addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = '#/';
    });
  },
};
export default NotFound;
