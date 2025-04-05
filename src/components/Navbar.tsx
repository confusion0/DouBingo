import { NavLink } from "react-router-dom";

import Button from "./Button";

import { useAuthToken } from '../context/AuthTokenContext';
import { useUsername } from "../context/UsernameContext";

function LoggedInButtons({ username }: { username: string }) {
    return (
        <>
            <Button variant="ghost" size="sm">
                <NavLink to="/bingo">
                    Bingo
                </NavLink>
            </Button>
            <Button variant="ghost" size="sm">
                <NavLink to="/leaderboard">
                    Leaderboard
                </NavLink>
            </Button>
            <Button variant="ghost" size="sm">
                <NavLink to="/user">
                    { username }
                </NavLink>
            </Button>
            <Button size="sm">
                <NavLink to="/log-out">
                    Log Out
                </NavLink>
            </Button>
        </>
    );
}

function LoggedOutButtons() {
    return (
        <>
            <Button variant="ghost" size="sm">
                <NavLink to="/log-in">
                    Log In
                </NavLink>
            </Button>
            <Button size="sm">
                <NavLink to="/sign-up">
                    Sign Up
                </NavLink>
            </Button>
        </>
    );
}

export default function Navbar() {
    const isLoggedIn = useAuthToken().token !== null;
    const { username } = useUsername();
    console.log(isLoggedIn, username)

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <NavLink
                    to="/"
                    className="mr-6 flex items-center space-x-2"
                >
                    <span>動 <span className="font-bold">DouBingo</span></span>
                </NavLink>

                <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
                    <NavLink
                        to="/"
                        className="transition-colors hover:text-primary"
                    >
                        Home
                    </NavLink>
                </nav>

                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm">
                        <NavLink to="/about">
                            About
                        </NavLink>
                    </Button>
                    {
                        isLoggedIn
                        ? <LoggedInButtons username={ username ?? "User" } />
                        : <LoggedOutButtons />
                    }
                </div>
            </div>
        </header>
    );
};
