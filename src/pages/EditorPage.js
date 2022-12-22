import React, { useState, useRef, useEffect } from "react";
import ACTIONS from "../Actions";
import Client from "../components/Client"
import Editor from "../components/Editor";
import { useLocation, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";


function showClient(Clientobj) {
    return (
        <Client key={Clientobj.socketId} username={Clientobj.username} />
    );
}

function EditorPage() {
    const navigate = useNavigate();
    const { roomId } = useParams();
    const [clients, setClients] = useState([]);
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    let location = useLocation();
    useEffect(() => {
        const init = () => {
            socketRef.current = io(process.env.REACT_APP_BACKEND_URL, { transports : ['websocket'] });
            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state.username,
            })

            //listening for joined event
            socketRef.current.on(ACTIONS.JOINED, ({ username, socketId, clients }) => {
                if (username !== location.state.username) {
                    toast.success(`${username} joined the room`);
                }
                setClients([...clients]);
                
                socketRef.current.emit(ACTIONS.SYNC_CODE,{
                    code : codeRef.current,
                    socketId,
                });
            })

            //listening for disconnected event
            socketRef.current.on(ACTIONS.DISCONNECTED, ({ username : removedUsername, socketId : removedSocketId, clients : clients }) => {
                console.log("removed");
                toast.success(`${removedUsername} left the room`);
                setClients(clients.filter(({ username, socketId }) => {
                    return removedUsername !== username && removedSocketId !== socketId;
                }));
            })
        };
        init();
    }, []);

    
    return (
        <div className="mainWrapper">
            <div className="sideBar">
                <div className="sideBarUpper">
                    <div className="sideBarSeprator">
                        <img className="sideBarLogo" src="/images/whatsapp.png" alt=""></img>
                    </div>
                    <h3>Connected</h3>
                    <div className="clientList">
                        {clients.map(showClient)}
                    </div>
                </div>
                <div className="sideBarLower">
                    <button onClick={() => {
                        navigator.clipboard.writeText(roomId);
                        toast.success("Copied Room ID")
                    }} className="btn copyBtn">Copy ROOM ID</button>
                    <button onClick={() => {
                        navigate('/');
                    }} className="btn leaveBtn">Leave</button>
                </div>
            </div>
            <div className="codeEditorWrap">
                <Editor socketRef={socketRef} onCodeChange = {
                    (code) => {
                        codeRef.current = code;
                    }
                } />
            </div>
        </div>
    );
}

export default EditorPage;
