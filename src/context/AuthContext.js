// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  // Temporary mock state. 
  // Set this to 'student', 'teacher', or null to test different default states.
  const [userRole, setUserRole] = useState(null); 
  //   const role = 'student';
  // A temporary function to simulate logging in
  // Later, this function will take a username/password, hit your backend, 
  // get the DB user role, and then call setUserRole(dbRole).
  const mockLogin = (role) => {
    setUserRole(role);
  };

  const mockLogout = () => {
    setUserRole(null);
  };

  // The value object contains everything you want to access from other screens
  const value = {
    userRole,
    mockLogin,
    mockLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create a Custom Hook (Best Practice)
// This saves you from having to import useContext AND AuthContext on every screen.
export const useAuth = () => {
  return useContext(AuthContext);
};