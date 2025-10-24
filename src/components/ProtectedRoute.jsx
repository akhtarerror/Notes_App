import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAccessToken } from '../utils/network-data';

export function ProtectedRoute({ children }) {
  const token = getAccessToken();
  return token ? children : <Navigate to="/login" />;
}