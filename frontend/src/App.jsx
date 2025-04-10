import { BrowserRouter, Route, Routes } from "react-router";
import ToastComponent from "./components/ToastContainer";
import HomePage from "./pages/HomePage";
import VideoInfoPage from "./pages/VideoInfoPage";
import AuthPage from "./pages/AuthPage";
import AuthProvider from "./Context/AuthContext";
import VideoProvider from "./Context/VideoContext";
import MyAccountPage from "./pages/MyAccountPage";
import { ErrorBoundary } from "react-error-boundary";
import ErrorNotFound from "./components/Error/ErrorNotFound";
import ConfirmPasswordComponent from "./components/Confirm-Password/ConfirmPasswordComponent";
import ChangePasswordComponent from "./components/Change-Password/ChangePasswordComponent";
import VerifyEmail from "./components/VerifyEmail/VerifyEmail";
import VerifyOTP from "./components/VerifyOTP/VerifyOTP";
import "./App.css";
import ResetPasswordComponent from "./components/Reset-Password/ResetPasswordComponent";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <ErrorBoundary fallback={<ErrorNotFound />}>
          <VideoProvider>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/videoInfo" element={<VideoInfoPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/account" element={<MyAccountPage />} />
                <Route path="/cnf-pwd" element={<ConfirmPasswordComponent />} />
                <Route
                  path="/change-pwd"
                  element={<ChangePasswordComponent />}
                />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/reset-pwd" element={<ResetPasswordComponent />} />
                <Route path="*" element={<ErrorNotFound />} />
              </Routes>
            </AuthProvider>
          </VideoProvider>
        </ErrorBoundary>
      </BrowserRouter>
      <ToastComponent />
    </>
  );
};

export default App;
