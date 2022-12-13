import React, { useState } from "react";
import { v4 } from "uuid";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Home() {
    const [roomId, setroomId] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    function createRoom(event) {
        toast.success("Created a new room");
        setroomId(v4());
        const nextField = document.querySelector("input[name=username]");
        nextField.focus();
    }
    const enterRoom = () => {
        if (!roomId || !username) {
            toast.error("Enter RoomId and username");
            return;
        }
        navigate(`/editor/${roomId}`, {
            state: {
                username,
            },
        });
    }
    const handleKeyPress = (event) => {
        if (event.target.name === "roomId" && event.key === "Enter" && roomId.length > 0) {
            const nextField = document.querySelector("input[name=username]");
            nextField.focus();
        }
        else if (event.target.name === "username" && event.key === "Enter" && username.length > 0) {
            enterRoom();
        }
        return;
    }
    return (
        <div className="homePageWrapper">
            <div className="formWrapper">
                <img className="logoImage" src="/images/whatsapp.png" alt="" />
                <h4 className="mainLabel">Paste Invitation ROOM ID</h4>
                <div className="inputGroup">
                    <input name="roomId" onKeyDown={handleKeyPress} onChange={(event) => setroomId(event.target.value)} type="text" placeholder="ROOM ID" className="inputBox" value={roomId}></input>
                    <input name="username" onKeyDown={handleKeyPress} onChange={(event) => setUsername(event.target.value)} type="text" placeholder="USERNAME" className="inputBox" value={username}></input>
                    <button onClick={enterRoom} type="submit" className="btn joinBtn">Join</button>
                    <span className="inputInfo">
                        If you don't have an invite then create &nbsp;
                        <button onClick={createRoom} className="createNewBtn">new room</button>
                    </span>
                </div>
            </div>
            <footer>
                Built with love by Milind
            </footer>
        </div>
    );
}

export default Home;