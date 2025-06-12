
import '../styles/styles.css'; 
import heroLogoAbout from '../assets/images/Rectangle 5678.png';
import batikCollageImage from '../assets/images/Group 1000009814.png';
import teamMemberPlaceholder from '../assets/images/profil.jpeg'; 
import teamMemberPlaceholder2 from '../assets/images/profil2.jpeg'; 

const About = {
  async render() {
    const mainContent = `
        <main>
        <section class="about-hero-section">
            <div class="about-hero-logo">
                <img src="${heroLogoAbout}" alt="Ragam Batik Logo Utama">
            </div>
            <div class="about-hero-tagline">
                <h1>Budaya Tak Lekang<br>Oleh Waktu</h1>
            </div>
        </section>

        <div class="section-title-bar">About Ragam Batik</div>
        <section class="about-content-section">
            <div class="about-images">
                <img src="${batikCollageImage}" alt="Batik Kanan" class="batik-image-2"> </div>
            <div class="about-text">
                <h3>What is 
                    <br> Ragam Batik?</h3>
                <p>
                    Selamat datang di <b>Ragam Batik</b>, platform digital yang didedikasikan untuk melestarikan dan mempopulerkan kekayaan budaya batik Indonesia. Kami percaya bahwa batik bukan hanya selembar kain, tetapi juga sebuah cerita, identitas, dan warisan yang tak ternilai harganya. Di sini, Anda dapat menjelajahi berbagai motif batik dari seluruh nusantara, mempelajari sejarah dan filosofinya, serta menemukan inspirasi untuk gaya berbusana Anda.
                </p>
                <p>
                    Kami berkomitmen untuk menjadi jembatan antara tradisi dan teknologi, memudahkan Anda mengakses informasi dan mengapresiasi keindahan batik kapan saja dan di mana saja.
                </p>
                <div class="features-highlight">
                    <div class="feature-item">
                        <span class="icon-placeholder"></span> Fitur Scan
                    </div>
                    <div class="feature-item">
                        <span class="icon-placeholder"></span> Fitur Search
                    </div>
                </div>
            </div>
        </section>

        <div class="section-title-bar">Our Team</div>
        <section class="team-grid">

            <div class="team-member-card">
                <div class="team-member-img-placeholder">
                    <img src="${teamMemberPlaceholder}" alt="Foto Savannah Nguyen">
                </div>
                <p>M. Farrel A.</p>
            </div>
                
            <div class="team-member-card">
                <div class="team-member-img-placeholder">
                    <img src="${teamMemberPlaceholder2}" alt="Foto Savannah Nguyen">
                </div>
                <p>Maulidina R.</p>
            </div>

            <div class="team-member-card">
                <div class="team-member-img-placeholder">
                    <img src="${teamMemberPlaceholder2}" alt="Foto Savannah Nguyen">
                </div>
                <p>Khansa F.R.</p>
            </div>

            <div class="team-member-card">
                <div class="team-member-img-placeholder">
                    <img src="${teamMemberPlaceholder}" alt="Foto Savannah Nguyen">
                </div>
                <p>Soultan A.M.</p>
            </div>

            <div class="team-member-card">
                <div class="team-member-img-placeholder">
                    <img src="${teamMemberPlaceholder}" alt="Foto Savannah Nguyen">
                </div>
                <p>Rahmat A. S.</p>
            </div>

            <div class="team-member-card">
                <div class="team-member-img-placeholder">
                    <img src="${teamMemberPlaceholder2}" alt="Foto Savannah Nguyen">
                </div>
                <p>Ramdhini N.S.</p>
            </div>

        </section>

    </main> 
    `;
   
    return mainContent;
  },

  async afterRender() {

    console.log('Halaman About selesai dirender.');
  },
};

export default About;