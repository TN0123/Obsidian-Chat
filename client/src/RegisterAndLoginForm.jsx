import { useContext, useState } from "react"
import axios from 'axios';
import { UserContext } from "./UserContext";
import Logo from "./Logo";

export default function RegisterAndLoginForm(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoginOrRegister, setIsLoginOrRegister] = useState('login');
    const {setUsername:setLoggedInUsername, setId} = useContext(UserContext);
    
    async function handleSubmit(ev) {
        ev.preventDefault();
        const url = isLoginOrRegister === 'register' ? 'register' : 'login';
        
        try{
            const {data} = await axios.post(url, {username, password}, { withCredentials: true });
            setLoggedInUsername(username);
            setId(data.id);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                const serverErrors = err.response.data.errors;

                const usernameTakenError = serverErrors.find(error => error === 'Username is already taken');
                const passwordError = serverErrors.find(error => error === 'Password must be at least 8 characters');

                if (usernameTakenError && passwordError) {
                    setError('Username is already taken');
                } else {
                    setError(usernameTakenError || passwordError || 'An error occurred. Please try again.');
                }
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    }

    async function handleModeChange(newMode) {
        setError('');
        setIsLoginOrRegister(newMode);
    }
    
    return(
        <div className="bg-neutral-900 h-screen flex flex-col items-center justify-center">
            <Logo 
            login = {true}
            />
            <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
                <input value={username} onChange={ev => setUsername(ev.target.value)} type="text" placeholder="Username" className="bg-gray-200 block w-full rounded-full p-2 mb-2 text-center"/>
                <input value={password} onChange={ev => setPassword(ev.target.value)} type="password" placeholder="Password" className="bg-gray-200 block w-full rounded-full p-2 mb-2 text-center"/>
                <button className="bg-indigo-500 text-gray-200 block w-full rounded-full p-2">
                    {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
                </button>
                {error && (
                    <div className="text-red-500 text-center mt-2">
                        {error}
                    </div>
                )}
                <div className="text-center mt-2">
                    {isLoginOrRegister === 'register' && (
                        <div className="text-gray-400">
                            Already a member?
                            <button className="underline ml-1" onClick={() => handleModeChange('login')}>Login</button>
                        </div>
                    )}
                    {isLoginOrRegister === 'login' && (
                        <div className="text-gray-400">
                            Don't have an account?
                            <button className="underline ml-1" onClick={() => handleModeChange('register')}> Register</button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    )
}