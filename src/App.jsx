import React, { useState, useEffect } from "react";
import { auth } from "./firebase.js";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import Conversations from "./Conversations.jsx";
import Members from "./Members.jsx";
import EditName from "./EditName.jsx";
import EditMemberLimit from "./EditMemberLimit.jsx";
import SignIn from "./SignIn.jsx";
import RoomSearch from "./RoomSearch.jsx";
import HomeSearch from "./HomeSearch.jsx";
import ChatRoom from "./ChatRoom.jsx";
import LeftChat from "./LeftChat.jsx";
import ChatFull from "./ChatFull.jsx";

export default function App() {
  const [room, setRoom] = useState("");
  const [leftRoom, setLeftRoom] = useState(false);
  const [isRoomFull, setIsRoomFull] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isRoomCreator, setIsRoomCreator] = useState(false);
  const [memberLimit, setMemberLimit] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [conversations, setConversations] = useState([]);
  const [roomSearchResults, setRoomSearchResults] = useState([]);
  const [yourName, setYourName] = useState("");
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [members, setMembers] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [roomWs, setRoomWs] = useState(null);
  const [userWs, setUserWs] = useState(null);
  const [sizeQuery, setSizeQuery] = useState("");
  const [nameQuery, setNameQuery] = useState("");
  const [openRoomSearch, setOpenRoomSearch] = useState(false);
  const handleOpenRoomSearch = () => setOpenRoomSearch(true);
  const [openYourName, setOpenYourName] = useState(false);
  const handleOpenYourName = () => setOpenYourName(true);
  const [openRoomName, setOpenRoomName] = useState(false);
  const handleOpenRoomName = () => setOpenRoomName(true);
  const [openMembers, setOpenMembers] = useState(false);
  const handleOpenMembers = () => setOpenMembers(true);
  const [openConvos, setOpenConvos] = useState(false);
  const handleOpenConvos = () => setOpenConvos(true);
  const [openMemberLimit, setOpenMemberLimit] = useState(false);
  const handleOpenMemberLimit = () => setOpenMemberLimit(true);
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
      if (room) {
        roomWs.send(
          JSON.stringify({
            command: "connect",
            room: room,
          })
        );
      }
    };
    roomWs.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if ("members" in data) {
        setMembers(data.members);
      } else if ("display_name" in data) {
        setRoomName(data.display_name);
      } else if ("new_message" in data) {
        setChatHistory((oldChatHistory) => [
          ...oldChatHistory,
          data.new_message,
        ]);
      } else if ("messages" in data) {
        setChatHistory((oldChatHistory) => [
          ...data.messages,
          ...oldChatHistory,
        ]);
      } else if ("refreshed_messages" in data) {
        setChatHistory(() => [...data.refreshed_messages]);
      } else if ("is_room_full" in data) {
        setIsRoomFull(data.is_room_full);
      } else if ("is_room_creator" in data) {
        setIsRoomCreator(data.is_room_creator);
      } else if ("member_limit" in data) {
        setMemberLimit(data.member_limit);
      } else if ("user_left_room" in data) {
        setLeftRoom(true);
      } else if ("display_name_taken" in data) {
        alert(`Sorry! ${data.display_name_taken} is another room's name`);
      } else if ("room_search_results" in data) {
        setRoomSearchResults((oldResults) => [
          ...oldResults,
          ...data.room_search_results,
        ]);
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
    updateNetworkStatus();
    const urlParams = new URLSearchParams(window.location.search);
    const currentRoom = urlParams.get("room");
    if (currentRoom) {
      setRoom(currentRoom);
    }
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

  if (leftRoom) {
    return (
      <LeftChat
        roomWs={roomWs}
        setLeftRoom={setLeftRoom}
        room={room}
      ></LeftChat>
    );
  }

  if (openMemberLimit) {
    return (
      <EditMemberLimit
        setOpen={setOpenMemberLimit}
        oldLimit={memberLimit}
        ws={roomWs}
        numMembers={members.length}
      ></EditMemberLimit>
    );
  }

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

  if (openRoomName) {
    return (
      <EditName
        setOpen={setOpenRoomName}
        oldName={roomName}
        ws={roomWs}
        title={"New Room Name"}
      ></EditName>
    );
  }

  if (openMembers) {
    return <Members setOpen={setOpenMembers} members={members}></Members>;
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
        setRoom={setRoom}
        setIsRoomFull={setIsRoomFull}
        setIsRoomCreator={setIsRoomCreator}
        setMemberLimit={setMemberLimit}
        setRoomName={setRoomName}
        setMembers={setMembers}
        setChatHistory={setChatHistory}
        roomWs={roomWs}
        userWs={userWs}
      ></Conversations>
    );
  }

  if (openRoomSearch) {
    return (
      <RoomSearch
        setOpen={setOpenRoomSearch}
        roomSearchResults={roomSearchResults}
        setRoom={setRoom}
        setIsRoomFull={setIsRoomFull}
        setIsRoomCreator={setIsRoomCreator}
        setMemberLimit={setMemberLimit}
        setRoomName={setRoomName}
        setMembers={setMembers}
        setChatHistory={setChatHistory}
        setRoomSearchResults={setRoomSearchResults}
        roomWs={roomWs}
        sizeQuery={sizeQuery}
        setSizeQuery={setSizeQuery}
        nameQuery={nameQuery}
        setNameQuery={setNameQuery}
      ></RoomSearch>
    );
  }

  if (isRoomFull) {
    return (
      <ChatFull
        handleOpenConvos={handleOpenConvos}
        handleOpenSignIn={handleOpenSignIn}
        handleOpenYourName={handleOpenYourName}
        handleOpenRoomSearch={handleOpenRoomSearch}
        isAnonymous={isAnonymous}
        yourName={yourName}
      ></ChatFull>
    );
  }
  if (room) {
    return (
      <ChatRoom
        handleOpenConvos={handleOpenConvos}
        handleOpenSignIn={handleOpenSignIn}
        handleOpenYourName={handleOpenYourName}
        handleOpenRoomName={handleOpenRoomName}
        handleOpenRoomSearch={handleOpenRoomSearch}
        handleOpenMembers={handleOpenMembers}
        handleOpenMemberLimit={handleOpenMemberLimit}
        isAnonymous={isAnonymous}
        isOnline={isOnline}
        yourName={yourName}
        roomName={roomName}
        chatHistory={chatHistory}
        isRoomCreator={isRoomCreator}
        username={username}
        roomWs={roomWs}
      ></ChatRoom>
    );
  }
  if (roomWs) {
    return (
      <HomeSearch
        handleOpenConvos={handleOpenConvos}
        handleOpenSignIn={handleOpenSignIn}
        isAnonymous={isAnonymous}
        roomSearchResults={roomSearchResults}
        setRoom={setRoom}
        setIsRoomFull={setIsRoomFull}
        setIsRoomCreator={setIsRoomCreator}
        setMemberLimit={setMemberLimit}
        setRoomName={setRoomName}
        setMembers={setMembers}
        setChatHistory={setChatHistory}
        setRoomSearchResults={setRoomSearchResults}
        roomWs={roomWs}
        sizeQuery={sizeQuery}
        setSizeQuery={setSizeQuery}
        nameQuery={nameQuery}
        setNameQuery={setNameQuery}
      ></HomeSearch>
    );
  }
}
