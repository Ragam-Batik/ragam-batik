
import 'regenerator-runtime';
import App from './app';
import './styles/styles.css'; 

const app = new App({
  appShellContainer: document.getElementById('app-shell-container'), 
});


window.addEventListener('hashchange', () => {
  app.renderPage(); 
});


window.addEventListener('DOMContentLoaded', () => {
  app.renderPage();
});