import React, { useState, useEffect } from "react";
import { auth } from "./firebase.js";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import Conversations from "./Conversations.jsx";
import EditName from "./EditName.jsx";
import SignIn from "./SignIn.jsx";
import ChatRoom from "./ChatRoom.jsx";
import Home from "./Home.jsx";

export default function App() {
  const [room, setRoom] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isVerified, setIsVerified] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [yourName, setYourName] = useState("");
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [members, setMembers] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatPartner, setChatPartner] = useState(null);
  const [roomWs, setRoomWs] = useState(null);
  const [userWs, setUserWs] = useState(null);
  const [openYourName, setOpenYourName] = useState(false);
  const handleOpenYourName = () => setOpenYourName(true);
  const [openConvos, setOpenConvos] = useState(false);
  const handleOpenConvos = () => setOpenConvos(true);
  const [openSignIn, setOpenSignIn] = useState(false);
  const handleOpenSignIn = () => setOpenSignIn(true);
  const [isOnline, setOnline] = useState(true);
  const updateNetworkStatus = () => {
    setOnline(navigator.onLine);
  };
  window.addEventListener("offline", updateNetworkStatus);
  window.addEventListener("online", updateNetworkStatus);

  const connectRoomWs = () => {
    const backendUrl = new URL(import.meta.env.VITE_BACKEND_URL);
    const ws_scheme = backendUrl.protocol == "https:" ? "wss" : "ws";
    const path =
      ws_scheme +
      "://" +
      backendUrl.hostname +
      ":" +
      backendUrl.port +
      "/ws/room/?token=" +
      token;
    const roomWs = new WebSocket(path);
    roomWs.onopen = () => {
      console.log("Room WebSocket open");
      setChatHistory([]);
    };
    roomWs.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if ("members" in data) {
        setMembers(data.members);
      } else if ("display_name" in data) {
        setRoomName(data.display_name);
      } else if ("new_message" in data) {
        setChatHistory((oldChatHistory) => {
          const newMessage = data.new_message;
          if (
            oldChatHistory.length > 0 &&
            oldChatHistory[oldChatHistory.length - 1].id == newMessage.id
          ) {
            return [...oldChatHistory];
          }
          return [...oldChatHistory, newMessage];
        });
      } else if ("messages" in data) {
        setChatHistory((oldChatHistory) => {
          const prevMessages = data.messages;
          if (
            oldChatHistory.length > 0 &&
            prevMessages.length > 0 &&
            oldChatHistory[0].id == prevMessages[0].id
          ) {
            return [...oldChatHistory];
          }
          return [...prevMessages, ...oldChatHistory];
        });
      } else if ("refreshed_messages" in data) {
        setChatHistory(() => [...data.refreshed_messages]);
      } else if ("user_left_room" in data) {
        setMembers([]);
        setChatHistory([]);
        setRoom("");
      } else if ("room" in data) {
        setRoom(data.room);
      }
    };
    roomWs.onerror = (e) => {
      console.log(e.message);
    };
    roomWs.onclose = () => {
      console.log("Room WebSocket closed");
      connectRoomWs();
    };
    setRoomWs(roomWs);
  };

  const connectUserWs = () => {
    const backendUrl = new URL(import.meta.env.VITE_BACKEND_URL);
    const ws_scheme = backendUrl.protocol == "https:" ? "wss" : "ws";
    const path =
      ws_scheme +
      "://" +
      backendUrl.hostname +
      ":" +
      backendUrl.port +
      "/ws/user/" +
      username +
      "/?token=" +
      token;
    const userWs = new WebSocket(path);
    userWs.onopen = () => {
      console.log("User WebSocket open");
    };
    userWs.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if ("display_name" in data) {
        setYourName(data.display_name);
      } else if ("conversations" in data) {
        setConversations(data.conversations);
      } else if ("display_name_taken" in data) {
        alert(`Sorry! ${data.display_name_taken} is another user's name`);
      }
    };
    userWs.onerror = (e) => {
      console.log(e.message);
    };
    userWs.onclose = () => {
      console.log("User WebSocket closed");
      connectUserWs();
    };
    setUserWs(userWs);
  };
  useEffect(() => {
    const chatPartner = members.filter((member) => member != yourName)[0];
    setChatPartner(chatPartner);
  }, [members]);
  useEffect(() => {
    updateNetworkStatus();
  }, []);
  useEffect(() => {
    if (!isOnline) {
      alert("No internet connection!");
    }
  }, [isOnline]);
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setToken(token);
        setUsername(user.uid);
        setIsAnonymous(user.isAnonymous);
        setIsVerified(user.emailVerified);
      } else {
        signInAnonymously(auth);
      }
    });
  }, [token]);
  useEffect(() => {
    if (token && !roomWs) {
      connectRoomWs();
    }
  }, [token, roomWs]);
  useEffect(() => {
    if (username && token && !userWs) {
      connectUserWs();
    }
  }, [username, token, userWs]);

  if (openYourName) {
    return (
      <EditName
        setOpen={setOpenYourName}
        oldName={yourName}
        ws={userWs}
        title={"Your New Name"}
      ></EditName>
    );
  }

  if (openSignIn) {
    return <SignIn setOpen={setOpenSignIn}></SignIn>;
  }

  if (openConvos) {
    return (
      <Conversations
        currentRoom={room}
        setOpen={setOpenConvos}
        conversations={conversations}
        setMembers={setMembers}
        setChatHistory={setChatHistory}
        roomWs={roomWs}
        userWs={userWs}
      ></Conversations>
    );
  }

  if (room && roomWs && roomWs.readyState === WebSocket.OPEN) {
    return (
      <ChatRoom
        handleOpenConvos={handleOpenConvos}
        handleOpenSignIn={handleOpenSignIn}
        handleOpenYourName={handleOpenYourName}
        isAnonymous={isAnonymous}
        isOnline={isOnline}
        yourName={yourName}
        chatHistory={chatHistory}
        chatPartner={chatPartner}
        username={username}
        roomWs={roomWs}
        room={room}
        isVerified={isVerified}
        setMembers={setMembers}
        setChatHistory={setChatHistory}
      ></ChatRoom>
    );
  }

  if (roomWs && roomWs.readyState === WebSocket.OPEN) {
    return (
      <Home
        isVerified={isVerified}
        handleOpenConvos={handleOpenConvos}
        handleOpenSignIn={handleOpenSignIn}
        isAnonymous={isAnonymous}
        setMembers={setMembers}
        setChatHistory={setChatHistory}
        roomWs={roomWs}
      ></Home>
    );
  }
}
