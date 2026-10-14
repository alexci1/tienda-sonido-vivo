// src/components/RutaProtegida.jsx
import { Navigate } from "react-router-dom";
import { estaAutenticado } from "../auth/auth.js";
 
export default function RutaProtegida({ children }) {
  if (!estaAutenticado()) {
    return <Navigate to="/login" replace />;
  }
 
  return children;
}