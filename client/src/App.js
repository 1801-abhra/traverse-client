import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import DriverDashboard from './pages/DriverDashboard';
import RideHistory from './pages/RideHistory';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import FacultyDashboard from './pages/FacultyDashboard';
import DriverEarnings from './pages/DriverEarnings';

const PrivateRoute = ({ children, role }) => {
  let user = null;
  const token = localStorage.getItem('token');
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (e) {
    user = null;
  }
  if (!user || !token) return <Navigate to='/login' />;

  if (role && user.role !== role) {
    if (user.role === 'student') return <Navigate to='/student' />;
    if (user.role === 'faculty') return <Navigate to='/faculty' />;
    if (user.role === 'driver') return <Navigate to='/driver' />;
  }
  return children;
};

const AutoRedirect = () => {
  let user = null;
  const token = localStorage.getItem('token');
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (e) {
    user = null;
  }
  if (!user || !token) return <Navigate to='/login' />;
  if (user.role === 'faculty') return <Navigate to='/faculty' />;
  if (user.role === 'student') return <Navigate to='/student' />;
  if (user.role === 'driver') return <Navigate to='/driver' />;
  return <Navigate to='/login' />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<AutoRedirect />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/student' element={
          <PrivateRoute role='student'>
            <StudentDashboard />
          </PrivateRoute>
        } />
        <Route path='/driver' element={
          <PrivateRoute role='driver'>
            <DriverDashboard />
          </PrivateRoute>
        } />
        <Route path='/driver-earnings' element={
          <PrivateRoute role='driver'>
            <DriverEarnings />
          </PrivateRoute>
        } />
        <Route path='/history' element={
          <PrivateRoute>
            <RideHistory />
          </PrivateRoute>
        } />
        <Route path='/faculty' element={
          <PrivateRoute role='faculty'>
            <FacultyDashboard />
          </PrivateRoute>
        } />
        <Route path='/admin' element={<AdminDashboard />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password/:token' element={<ResetPassword />} />
        <Route path='*' element={<AutoRedirect />} />
      </Routes>
    </Router>
  );
}

export default App;
