import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MessageDisplay from './components/MessageDisplay';
import MouseMoveEffect from "./components/MouseMoveEffect";

import Home from './routes/Home';
import About from './routes/About';
import Bingo from './routes/Bingo';
import Leaderboard from './routes/Leaderboard';
import LogIn from './routes/LogIn';
import LogOut from './routes/LogOut';
import NotFound from './routes/NotFound';
import SignUp from './routes/SignUp';
import User from './routes/User';

import './App.css';

function App() {
  return (
    <div className="bg-background text-foreground antialiased font-inter">
      <Router>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/bingo" element={<Bingo />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/log-in" element={<LogIn />} />
          <Route path="/log-out" element={<LogOut />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </Router>
      <MouseMoveEffect />
      <MessageDisplay />
    </div>
  );
}

export default App;
