import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import SignUp from './employee/authentication/SignUp';
import SignIn from './employee/authentication/SignIn';
import GuestRoute from './routes/GuestRoutes';
import EmployeeRoute from './routes/EmployeeRoutes';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<string> | null>(null);

  const handleLogin= (role: string) => {
    setUserRole(role);
  };

  return (
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />

           {/* Conditionally render routes based on userRole */}
            <Route path="/guest" element={userRole === 'guest' ? <GuestRoute /> : <Navigate to="/login" />} />
            <Route path="/employee" element={userRole === 'employee' ? <EmployeeRoute /> : <Navigate to="/login" />} />
            {/* <Route path="/admin" element={userRole === 'admin' ? <AdminPage /> : <Navigate to="/login" />} /> */}

        {/* Redirect to login if no role or invalid route */}
        <Route path="*" element={<Navigate to="/login" />} /> 
          </Routes>
  );
};

export default App;