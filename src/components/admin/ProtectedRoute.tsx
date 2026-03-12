import { Navigate } from "react-router-dom";
import { isAuthenticated } from "@/config/admin";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
