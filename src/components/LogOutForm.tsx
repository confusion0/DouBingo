import { useNavigate } from 'react-router-dom';

import { useAuthToken } from '../context/AuthTokenContext';
import Button from './Button.tsx';
import { useMessage } from '../context/MessageContext';
import { useUsername } from '../context/UsernameContext.tsx';

export default function LogOutForm() {
    const { addMessage } = useMessage();
    const { setToken } = useAuthToken();
    const { setUsername: setLocalUsername } = useUsername();
    const navigate = useNavigate();

    const submitForm = async () => {
        addMessage("Successfully logged out!", "default", 3000);
        setToken(null);
        setLocalUsername(null);
        navigate("/");
    };
    
    return (
        <section className="container py-24 md:py-32">
            <div className="mx-auto max-w-[58rem] text-center">
                <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
                    Log Out
                </h2>

                <p className="mt-4 sm:text-lg" style={{ margin: "30px 0" }}></p>
            </div>

            <div className="mx-auto">
                <form className="app-form">
                    <Button type="button" onClick={submitForm}>
                        Log Out
                    </Button>
                </form>
            </div>
        </section>
    );
};
