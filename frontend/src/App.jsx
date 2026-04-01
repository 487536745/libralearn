import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import AvatarPage from "./components/AvatarPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import HumanRightsReading from "./components/HumanRightsReading";
import QuizGamePage from "./components/QuizGamePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/avatar" element={<AvatarPage />} />
        <Route path="/human-rights-reading" element={<HumanRightsReading />} />
        <Route path="/quiz-game" element={<QuizGamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
