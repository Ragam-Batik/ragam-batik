// src/components/footer/index.js
import footerLogoImage from '../../assets/images/Group 1000009803.png'; // Path relatif dari components/footer/ ke assets/images/

const Footer = {
    render() {
        return `
            <footer>
                <div class="footer-content">
                    <img src="${footerLogoImage}" alt="Ragam Batik Footer Logo">
                </div>
            </footer>
        `;
    },
    renderEmpty() {
        return '';
    }
};

export default Footer;