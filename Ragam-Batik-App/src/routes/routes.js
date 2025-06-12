import Beranda from '../pages/beranda'; 
import SignIn from '../pages/signin';
import SignUp from '../pages/signup';
import About from '../pages/about';
import Home from '../pages/home'; 
import Scan from '../pages/scan';
import History from '../pages/history';
import HasilSearch from '../pages/hasilsearch';
import NotFound from '../pages/notfound'; 
import BatikDetail from '../pages/batikdetail'; 
import HistoryDetail from '../pages/historydetail';

const routes = {
  '/': Beranda, 
  '/beranda': Beranda,
  '/signin': SignIn,
  '/signup': SignUp,
  '/about': About,
  '/home': Home, 
  '/scan': Scan,
  '/history': History,
  '/hasilsearch/:keyword': HasilSearch, 
  '/not-found': NotFound, 
  '/batik/:id': BatikDetail,
  '/history/:id' : HistoryDetail,
};

export default routes;