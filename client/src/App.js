import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';

// Import your components
import Home from './Pages/Home/Home';
import Transactions from './Pages/Transactions/Transactions';
import Bookings from './Pages/Bookings/Bookings';
import Events from './Pages/Events.js/Events';
import Settings from './Pages/Settings/Settings';
import Signup from './Pages/Signup/Signup';
import Login from './Pages/Login/Login';
import Addevents from './Pages/Admin/Addevents';
import Viewevents from './Pages/Admin/Viewevents';
import Editevent from './Pages/Admin/Editevent';
import Empinfo from './Pages/Admin/Empinfo';
import Editrole from './Pages/Admin/Editrole';
import SiteDetails from './Pages/Sitedetails/SiteDetails';
import Confirmedpdf from './Pages/Confirmedpdf/Confirmedpdf';
function App() {


  return (

    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/events" element={<Events />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/addevents" element={<Addevents />} />
          <Route path="/viewevents" element={<Viewevents />} />
          <Route path="/editevents" element={<Editevent />} />
          <Route path="/editevents/:id" element={<Editevent />} />
          <Route path="/editrole/:id" element={<Editrole />} />
          <Route path="/empinfo" element={<Empinfo />} />
          <Route path="/sitedetails" element={<SiteDetails />} />
          <Route path="/confirmed/:id" element={<Confirmedpdf />} />
        </Routes>
      </Router>
    </div >
  );
}

export default App;
