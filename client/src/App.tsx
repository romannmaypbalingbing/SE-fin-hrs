import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import supabase from './supabaseClient';
import Loader from './components/Loader/Loader';

import GuestRoutes from './routes/GuestRoutes'; // Import guest-specific routes
import SignUp from './employee/authentication/SignUp';
import SignIn from './employee/authentication/SignIn';
import EmployeeRoute from './routes/EmployeeRoutes';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // see if the user is logged in
        const { data, error } = await supabase.auth.getUser();
        console.log(data);

        if (error) {
          console.error('Error fetching user:', error);
          setUserRole(null);
          setLoading(false);
          return;
        }

        if (data && data.user) {
          //get the user role
            setUserRole(data.user.user_metadata?.role || null);
            console.log(setUserRole);
          }

      
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
    })
        
        
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />

      {/* Conditional Guest or Employee Routes */}
      {userRole === 'guest' || userRole === null ? (
        // Render guest-specific routes
        <Route path="/*" element={<GuestRoutes />} />
      ) : (
        // Render employee-specific routes
        <Route
          path="/dashboard"
          element={userRole === 'employee' ? <EmployeeRoute /> : <Navigate to="/signin" />}
        />
      )}

      {/* Catch-All Redirect */}
      <Route path="*" element={<Navigate to="/signin" />} />
    </Routes>
  );
};

export default App;
