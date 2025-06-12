export default async function loadDetailPage() {
  const app = document.getElementById('app');
  app.innerHTML = '<p>Memuat detail...</p>';

  const id = getIdFromHash();
  const data = await fetchBatikData();
  const batik = data.find(item => item.id == id);

  if (!batik) {
    app.innerHTML = '<p>Data tidak ditemukan</p>';
    return;
  }

  app.innerHTML = `
    <h1>${batik.nama_batik}</h1>
    <p><strong>Daerah:</strong> ${batik.daerah}</p>
    <p><strong>Makna:</strong> ${batik.makna_batik}</p>
    <p><strong>Harga Rata-Rata:</strong> ${batik.harga_rata_rata}</p>
    <button id="back-btn">← Kembali</button>
  `;

  document.getElementById('back-btn').addEventListener('click', () => {
    window.location.hash = '#/home';
  });
}
