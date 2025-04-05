import { NavLink } from "react-router-dom";
import { Github } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t">
            <div className="container flex flex-col gap-8 py-8 md:flex-row md:py-12">
                <div className="flex-1 space-y-4">
                    <h2>動 <span className="font-bold">DouBingo</span></h2>

                    <p className="text-sm text-muted-foreground">
                        #BinGoOutside
                    </p>
                </div>

                <div className="grid flex-1 grid-cols-2 gap-12 sm:grid-cols-3">
                    <div className="space-y-4" />
                    
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Quick Links</h3>

                        <ul className="space-y-3 text-sm">
                            <li>
                                <NavLink to="/about" className="text-muted-foreground transition-colors hover:text-primary">
                                    About
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/leaderboard" className="text-muted-foreground transition-colors hover:text-primary">
                                    Bingo
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/about" className="text-muted-foreground transition-colors hover:text-primary">
                                    Leaderboard
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Connect</h3>

                        <div className="flex space-x-4">
                            <NavLink
                                to="https://github.com/confusion0/DouBingo"
                                className="text-muted-foreground transition-colors hover:text-primary"
                            >
                                <Github className="h-5 w-5" />

                                <span className="sr-only">GitHub</span>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
