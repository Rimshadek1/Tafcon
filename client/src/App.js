import React, { useContext } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Transactions from './Pages/Transactions/Transactions';
import Bookings from './Pages/Bookings/Bookings';
import Settings from './Pages/Settings/Settings';
import Events from './Pages/Events.js/Events';
import Signup from './Pages/Signup/Signup';
import Login from './Pages/Login/Login';
import Addevents from './Pages/Admin/Addevents';
import Viewevents from './Pages/Admin/Viewevents';
import Editevent from './Pages/Admin/Editevent';
import Empinfo from './Pages/Admin/Empinfo';
import Editrole from './Pages/Admin/Editrole';
import SiteDetails from './Pages/Sitedetails/SiteDetails';
import Confirmedpdf from './Pages/Confirmedpdf/Confirmedpdf';
import Fine from './Pages/Admin/Fine';
import { UserContextProvider } from './Pages/UserContext/UserContext';
import axios from 'axios';
import Ot from './Pages/Admin/Ot';
import Withdraw from './Pages/Admin/Withdraw';
import ViewWithdraw from './Pages/Admin/ViewWithdraw';

function App() {
  axios.defaults.withCredentials = true;

  return (
    <div>

      <UserContextProvider>
        <Router>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/events" element={<Events />} />
            <Route path="/addevents" element={<Addevents />} />
            <Route path="/viewevents" element={<Viewevents />} />
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/viewwithdraw" element={<ViewWithdraw />} />
            <Route path="/editevents" element={<Editevent />} />
            <Route path="/editevents/:id" element={<Editevent />} />
            <Route path="/editrole/:id" element={<Editrole />} />
            <Route path="/empinfo" element={<Empinfo />} />
            <Route path="/sitedetails" element={<SiteDetails />} />
            <Route path="/confirmed/:id" element={<Confirmedpdf />} />
            <Route path="/fine/:user_id" element={<Fine />} />
            <Route path="/ot/:user_id" element={<Ot />} />
          </Routes>
        </Router>
      </UserContextProvider >
    </div>
  );
}

export default App;
