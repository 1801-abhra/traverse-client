import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import DriverDashboard from './pages/DriverDashboard';
import RideHistory from './pages/RideHistory';
import AdminDashboard from './pages/AdminDashboard';

const PrivateRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  if (!user || !token) return <Navigate to='/login' />;
  if (role && user.role !== role) {
    // Redirect to correct dashboard instead of login
    if (user.role === 'student') return <Navigate to='/student' />;
    if (user.role === 'driver') return <Navigate to='/driver' />;
  }
  return children;
};

const AutoRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  if (!user || !token) return <Navigate to='/login' />;
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
        <Route path='/history' element={
          <PrivateRoute>
            <RideHistory />
          </PrivateRoute>
        } />
        <Route path='/admin' element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;