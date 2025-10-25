// routes/AdminRoutes.jsx - VERSIÓN DEFINITIVA
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/Admin/Layout/AdminLayout';
import Dashboard from '../components/Admin/Dashboard';
import UserList from '../components/Admin/Users/UserList';
import UserEdit from '../components/Admin/Users/UserEdit';
import HotelList from '../components/Admin/Hotels/HotelList';
import HotelEdit from '../components/Admin/Hotels/HotelEdit';
import SiteList from '../components/Admin/Sites/SiteList';
import SiteEdit from '../components/Admin/Sites/SiteEdit';
import ProtectedRoute from './ProtectedRoute';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route 
        path="/*" 
        element={
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
            <AdminLayout />
          </ProtectedRoute>
        } 
      >
        <Route path="" element={<Navigate to="dashboard" replace />} />
        
        <Route path="dashboard" element={<Dashboard />} />

        <Route 
          path="users" 
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <UserList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="users/new" 
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <UserEdit />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="users/edit/:id" 
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <UserEdit />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="hotels" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <HotelList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="hotels/new" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <HotelEdit />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="hotels/edit/:id" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <HotelEdit />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="sites" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <SiteList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="sites/new" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <SiteEdit />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="sites/edit/:id" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <SiteEdit />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;