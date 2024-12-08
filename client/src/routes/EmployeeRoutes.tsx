import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from '../components/Loader/Loader';
import PageTitle from '../components/PageTitle';
import Calendar from '../pages/Calendar';

import CreateBooking from '../pages/UiElements/CreateBooking';
import FormLayout from '../pages/Form/FormLayout';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Tables from '../pages/Tables';
import DefaultLayout from '../layout/DefaultLayout';
import Dashboard from '../pages/Dashboard/Dashboard';

function EmployeeRoutes() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  console.log(loading);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <Routes>
        <Route 
        path="/dashboard"
        element={
            <>
              <PageTitle title="Hotel Reservation Dashboard" />
              <Dashboard />
            </>
        }
        /> 
        <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Tables" />
              <Tables />
            </>
          }
        />
        <Route
          path="/calendar"
          element={
            <>
              <PageTitle title="Calendar" />
              <Calendar /></>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profile " />
              <Profile />
            </>
          }
        />
        <Route
          path="/create-booking"
          element={
            <>
              <PageTitle title="Create Booking " />
              <CreateBooking />
            </>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <>
              <PageTitle title="Form Layout  " />
              <FormLayout />
            </>
          }
        />
        
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Settings  " />
              <Settings />
            </>
          }
        />
       
      </Routes>
    </DefaultLayout>
  );
}

export default EmployeeRoutes;
