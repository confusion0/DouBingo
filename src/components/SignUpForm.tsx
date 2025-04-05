import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthTokenContext from '../context/AuthTokenContext';
import { useMessage } from '../context/MessageContext';
import { useUsername } from '../context/UsernameContext.tsx';

import Button from './Button.tsx';
import WorkingButton from './WorkingButton.tsx';

export default function SignUpForm() {
    const { addMessage } = useMessage();
    const { setToken } = useContext(AuthTokenContext);
    const { setUsername: setLocalUsername } = useUsername();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [didClick, setDidClick] = useState(false);

    const submitForm = async () => {
        setDidClick(true);
        setTimeout(doSignUp);
    };

    const doSignUp = async () => {
        try {
            addMessage("Signing up...", "default", 3000);
            const request = await fetch('http://localhost:8000/sign-up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    "username": username,
                    "password": password
                })
            });

            const data = await request.json();
            setDidClick(false);

            if(!request.ok) {
                addMessage(data.error, "default");
                return;
            }

            if(data.access_token) {
                setToken(data.access_token);
                setLocalUsername(username);
                addMessage("Successfully signed up!", "default");
                navigate("/user");
            }
        } catch(error) {
            addMessage("Error signing up: " + error, "default");
            setDidClick(false);
        }
    }
    
    return (
        <section className="container py-24 md:py-32">
            <div className="mx-auto max-w-[58rem] text-center">
                <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
                    Sign Up
                </h2>

                <p className="mt-4 sm:text-lg" style={{ margin: "30px 0" }}>
                    If you already have an account, you
                    can <Link className="app-link" to="/log-in">log in</Link> instead.
                </p>
            </div>

            <div className="mx-auto">
                <form className="app-form">
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <label htmlFor="username">
                                        Username:
                                    </label>
                                </td>
                                <td>
                                    <input
                                        name="username"
                                        type="text"
                                        value={username}
                                        onChange={ e => setUsername(e.target.value) }
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="password">
                                        Password:
                                    </label>
                                </td>
                                <td>
                                    <input
                                        name="password"
                                        type="password"
                                        value={password}
                                        onChange={ e => setPassword(e.target.value) }
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    {
                        didClick
                        ? <WorkingButton />
                        : <Button type="button" onClick={submitForm}>
                            Sign Up
                        </Button>
                    }
                </form>
            </div>
        </section>
    );
};
