import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/authentication/Login";
import Signup from "./pages/authentication/Signup";

import HomePage from "./pages/home/HomePage";
import NewTests from "./pages/home/NewTests";
import AttemptedTests from "./pages/home/AttemptedTests";
import CodingTest from "./pages/home/CodingTest";
import Insights from "./pages/home/Insights";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

import Navbar from "./components/Navbar";

import useAuthStore from "./store/useAuthStore";

function App() {

  const { authUser } =
    useAuthStore();

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* Home Route */}
        <Route
          path="/"
          element={

            authUser

              ? (
                <Navigate
                  to="/new-tests"
                />
              )

              : (

                <HomePage />
              )
          }
        />

        {/* Public Routes */}
        <Route
          path="/login"
          element={

            authUser

              ? (
                <Navigate
                  to="/new-tests"
                />
              )

              : (
                <PublicRoute>
                  <Login />
                </PublicRoute>
              )
          }
        />

        <Route
          path="/signup"
          element={

            authUser

              ? (
                <Navigate
                  to="/new-tests"
                />
              )

              : (
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/new-tests"
          element={
            <ProtectedRoute>
              <NewTests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attempted-tests"
          element={
            <ProtectedRoute>
              <AttemptedTests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/test/:id"
          element={
            <ProtectedRoute>
              <CodingTest />
            </ProtectedRoute>
          }
        />

        <Route
          path="/insights/:submissionId"
          element={
            <ProtectedRoute>
              <Insights />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;