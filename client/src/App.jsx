import { Routes, Route } from "react-router";
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';
import Signup from './pages/Signup';
import Login from './pages/Login';
import HomePage from './pages/HomePage'

export default function App() {
  return (
    <Routes>
        <Route index element={<LandingPage />} />
        <Route path='signup' element={<Signup />} />
        <Route path='login' element={<Login />} />
        <Route path='home' element={<HomePage />} />
        <Route path='*' element={<NotFound />} />
    </Routes>
  );
}