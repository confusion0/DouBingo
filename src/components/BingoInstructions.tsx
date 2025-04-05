export default function BingoInstructions() {
    return (
        <section className="container">
            <div className="flex flex-col items-center justify-center py-8" style={{ paddingBottom: "0" }}>
                <h1 className="text-4xl font-bold mb-4">DouBingo Instructions</h1>
                
                <p className="text-lg mb-2">Welcome to DouBingo!</p>
                <p className="text-lg mb-2">Now, you may be wondering how to play our game...</p>

                <br />

                <ol className="list-decimal list-inside text-lg mb-4">
                    <li>Capture and upload an image of an animal using your camera!</li>
                    <li>If your image of an animal is in the DouBingo squares, the square will be marked. You get <span className="text-[#00d95b]">100 points</span> per square!</li>
                    <li>When you get three squares marked in a row, in any direction, you earn a <span className="text-[#00d95b]">DouBingo</span> and you gain <span className="text-[#00d95b]">1000 points</span>!</li>
                    <li>If you took the image during daytime and outside, you gain <span className="text-[#00d95b]">500 extra points</span> when you earn a DouBingo!</li>
                    <li>If you earn a DouBingo while moving (e.g. running, walking), you gain another <span className="text-[#00d95b]">500 extra points</span> when you earn a DouBingo!</li>
                </ol>

                <p>The name of the game is to go outside and connect with nature and the environment!</p>

                <br />

                <p>Have fun and enjoy the outdoors!</p>
                <p>And remember, <span className="text-[#00d95b]">#BinGoOutside!</span></p>

                <br />
            </div>
        </section>  
    );
}