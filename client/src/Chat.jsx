import { useContext, useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import { UserContext } from "./UserContext.jsx";
import {uniqBy} from "lodash";
import axios from "axios";
import Contact from "./Contact";

export default function Chat(){
    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [offlinePeople, setOfflinePeople] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const {username, id, setId, setUsername} = useContext(UserContext);
    const [newMessageText, setNewMessageText] = useState('');
    const [messages, setMessages] = useState([]);
    const divUnderMessages = useRef();
    useEffect(() => {
        connectToWs();
    }, []);
    
    function connectToWs(){
        const ws = new WebSocket('ws://localhost:4000');
        setWs(ws);
        ws.addEventListener('message', handleMessage);
        ws.addEventListener('close', () => {
            setTimeout(() => {
                connectToWs();
            }, 1000);
        });
    }

    function showOnlinePeople(peopleArray){
        const people = {};
        peopleArray.forEach(({userId, username}) => {
            people[userId] = username;
        });
        setOnlinePeople(people);
    }
    
    function handleMessage(ev){
        const messageData = JSON.parse(ev.data);
        if ('online' in messageData){
            showOnlinePeople(messageData.online);
        } else if ('text' in messageData){
            if (messageData.sender === selectedUserId){
                setMessages(prev => ([...prev, {...messageData}]));
            }
        }
    }

    function logout(ev){
        axios.post('/logout').then(() => {
            setWs(null);
            setId(null);
            setUsername(null);
        });
    }

    function sendMessage(ev, file = null){
        if (ev) ev.preventDefault();
        ws.send(JSON.stringify({
            recipient: selectedUserId,
            text: newMessageText,
            file,
        }));
        if (file) {
            axios.get('/messages/' + selectedUserId).then(res => {
                setMessages(res.data);
            });
        } else {
            setNewMessageText('');
            setMessages(prev => ([...prev, { 
                text: newMessageText, 
                sender: id, 
                recipient: selectedUserId,
                _id: Date.now(), 
            }]));
        }
    }
    
    function sendFile(ev){
        const reader = new FileReader();
        reader.readAsDataURL(ev.target.files[0]);
        reader.onload = () => {
            sendMessage(null, {
                name: ev.target.files[0].name,
                data: reader.result,
            })
        };
    }

    useEffect(() => {
        const div = divUnderMessages.current;
        if (div){
            div.scrollIntoView({behavior:'smooth', block:'end'});
        }
    }, [messages]);

    useEffect(() => {
        axios.get('/people').then(res => {
            const offlinePeopleArr = res.data
                .filter(p => p._id !== id)
                .filter(p => !Object.keys(onlinePeople).includes(p._id));
            const offlinePeople = {};
            offlinePeopleArr.forEach(p => {
                offlinePeople[p._id] = p;
            });
            setOfflinePeople(offlinePeople);
        });
    }, [onlinePeople]);

    useEffect(() => {
        if(selectedUserId){
            axios.get('/messages/' + selectedUserId).then(res => {
                setMessages(res.data);
            });
        }
    }, [selectedUserId]);

    const onlinePeopleExcOurUser = {...onlinePeople};
    delete onlinePeopleExcOurUser[id];

    const messagesWithoutDupes = uniqBy(messages, '_id');

    return(
        <div className="flex flex-col h-screen bg-neutral-700">
            <div className="flex items-center bg-neutral-800 border border-neutral-900 text-neutral-400">
                <div 
                    className="flex items-center justify-start px-3"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#000000 #000000',
                        msOverflowStyle: 'none',
                    }}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 m-2">
                            <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                    </svg>
                    {username}
                </div>
                <div className="flex flex-grow justify-center">
                    <Logo login = {false}/>
                </div>
                <div className="">
                    <button 
                        onClick={logout}
                        className="text-sm text-gray-600 bg-red-400 py-1 px-2 mx-2 rounded-sm">logout</button>
                </div>
            </div>
            <div className="flex flex-grow">
                <div className="bg-neutral-800 w-1/4 flex flex-col border border-neutral-900">
                    <div className="flex-grow">
                        {Object.keys(onlinePeopleExcOurUser).map(userId => (
                            <Contact 
                                key={userId}
                                id={userId} 
                                username={onlinePeopleExcOurUser[userId]}
                                onClick={() => setSelectedUserId(userId)}
                                selected={userId === selectedUserId}
                                online={true} />
                        ))}
                        {Object.keys(offlinePeople).map(userId => (
                            <Contact 
                                key={userId}
                                id={userId} 
                                username={offlinePeople[userId].username}
                                onClick={() => setSelectedUserId(userId)}
                                selected={userId === selectedUserId}
                                online={false} />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col w-3/4 p-2 border border-neutral-800">
                    <div className="flex-grow">
                        {!selectedUserId && (
                            <div className="flex h-full items-center justify-center">
                                <div className="text-gray-400 text-3xl">Select a chat</div>
                            </div>
                        )}
                        {!!selectedUserId && (
                            <div className="relative h-full">
                                <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                                    {messagesWithoutDupes.map((message) => (
                                        <div key={message._id} className={(message.sender === id ? 'text-right': 'text-left')}>
                                            <div className={"text-left inline-block p-2 my-2 rounded-md text-lg " +(message.sender === id ? 'bg-indigo-500 text-gray-200 mx-3':'bg-neutral-900 text-gray-200')}>
                                                {message.text}
                                                {message.file && (
                                                    <div>
                                                        <a target="_blank" className="underline flex items-center gap-1" href={axios.defaults.baseURL + '/uploads/' + message.file}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                                                            </svg>
                                                            {message.file}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={divUnderMessages}></div>
                                </div>
                            </div>
                        )}
                    </div>
                    {!!selectedUserId && (
                        <form className="flex gap-2" onSubmit={sendMessage}>
                            <input type="text" value={newMessageText} onChange={ev => setNewMessageText(ev.target.value)} placeholder="Enter Message" className="bg-neutral-800 text-gray-200 flex-grow p-2 rounded-full"/>
                            <label className="bg-green-400 p-2 text-gray-500 rounded-md border-gray-300 cursor-pointer">
                                <input type="file" className="hidden" onChange={sendFile}/>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                                </svg>
                            </label>
                            <button type="submit" className="bg-indigo-500 p-2 text-gray-200 rounded-md">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                </svg>
                            </button>
                        </form>
                    )}
                </div>
            </div>
            <style>
                {`
                /* WebKit browsers (Chrome, Safari) */
                ::-webkit-scrollbar {
                    width: 12px;
                }

                ::-webkit-scrollbar-thumb {
                    background-color: #000000;
                }

                /* Firefox */
                ::-moz-scrollbar {
                    width: 12px;
                }

                ::-moz-scrollbar-thumb {
                    background-color: #000000;
                }
                `}
            </style>
        </div>
    );
}