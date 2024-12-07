import { Routes, Route} from 'react-router-dom';

import GuestRoutes from './routes/GuestRoutes'; // Import guest-specific routes
import SignUp from './employee/authentication/SignUp';
import SignIn from './employee/authentication/SignIn';
import EmployeeRoute from './routes/EmployeeRoutes';

const App: React.FC = () => {
        
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/guest/*" element={<GuestRoutes />} />
      <Route path="/employee/*" element={<EmployeeRoute />} />

    </Routes>
  );
};

export default App;
