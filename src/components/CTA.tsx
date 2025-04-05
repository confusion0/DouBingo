import { Link } from "react-router-dom";

import Button from "./Button";

export default function CTA() {
    return (
        <section className="border-t">
            <div className="container flex flex-col items-center gap-4 py-24 text-center md:py-32">
                <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
                    Ready to get out there?
                </h2>
                
                <p className="max-w-[42rem] leading-normal sm:leading-8">
                    DouBingo combines the best of both worlds: bingo and being outdoors.
                </p>
                
                <p className="max-w-[42rem] leading-normal sm:leading-8">
                    Compete against other users to top the leaderboard of outdoorsiness.
                    Every uploaded picture might be worth points, and could even net you a bingo.
                </p>

                <Button size="lg" className="mt-4">
                    <Link to="/sign-up">
                        Get Started Today
                    </Link>
                </Button>
            </div>
        </section>
    );
};
