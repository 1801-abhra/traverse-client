import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import RideHistory from './pages/RideHistory';

const PrivateRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return <Navigate to='/login' />;
  if (role && user.role !== role) return <Navigate to='/login' />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to='/login' />} />
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