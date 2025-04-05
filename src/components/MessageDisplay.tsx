import { useMessage } from '../context/MessageContext';

export default function MessageDisplay() {
    const { messages } = useMessage();

    return (
        <div className="fixed bottom-0 right-0 space-y-2 z-50 pb-4 pr-4 pointer-events-none">
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={
                        `p-4 rounded-md bg-accent animate-[alert-message_${message.durationS}s_ease-in-out_forwards] ` +
                        `right-[-100rem] bottom-[0rem] max-w-md`
                    }
                >
                    <p 
                        className={[
                            "text-wrap",
                            message.type === "loading" ? "animate-pulse" : "",
                        ].join(' ')}
                        style={{ color: "white" }}
                    >
                        {message.text}
                    </p>
                </div>
            ))}
        </div>
    );
};
