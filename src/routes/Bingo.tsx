import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import BingoGame from '../components/BingoGame.tsx';
import Footer from '../components/Footer.tsx';
import MessageDisplay from '../components/MessageDisplay.tsx';
import Navbar from '../components/Navbar.tsx';

import { useAuthToken } from '../context/AuthTokenContext';

export default function Bingo() {
    const navigate = useNavigate();
    const { token } = useAuthToken();

    useEffect(() => {
        if(!token) {
            navigate("/log-in");
        }
    }, [token]);

    return (
        <div className="relative min-h-screen">
            <div className="pointer-events-none fixed inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
                <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-blue-500/10 blur-[100px]" />
                <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px]" />
            </div>

            <div className="relative z-10">
                <Navbar />
                <BingoGame />
                <MessageDisplay />
                <Footer />
            </div>
        </div>
    );
};
