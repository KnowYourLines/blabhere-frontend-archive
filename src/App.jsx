import React, { useState, useEffect } from "react";
import { auth } from "./firebase.js";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import Conversations from "./Conversations.jsx";
import EditName from "./EditName.jsx";
import SignIn from "./SignIn.jsx";
import ChatRoom from "./ChatRoom.jsx";
import Home from "./Home.jsx";
import DeleteAccount from "./DeleteAccount.jsx";
import Block from "./Block.jsx";
import Report from "./Report.jsx";
import Members from "./Members.jsx";
import CreateChat from "./CreateChat.jsx";

export default function App() {
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isVerified, setIsVerified] = useState(true);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [reportedUser, setReportedUser] = useState(null);
  const [blockedUser, setBlockedUser] = useState(null);
  const [yourName, setYourName] = useState("");
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [members, setMembers] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsError, setSearchResultsError] = useState(false);
  const [searchResultsErrorText, setSearchResultsErrorText] = useState("");
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [roomWs, setRoomWs] = useState(null);
  const [userWs, setUserWs] = useState(null);
  const [searchInput, setSearchInput] = useState(null);
  const [openYourName, setOpenYourName] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [nameErrorText, setNameErrorText] = useState("");
  const handleOpenYourName = () => setOpenYourName(true);
  const [openMembers, setOpenMembers] = useState(false);
  const handleOpenMembers = () => setOpenMembers(true);
  const [openConvos, setOpenConvos] = useState(false);
  const handleOpenConvos = () => setOpenConvos(true);
  const [openSignIn, setOpenSignIn] = useState(false);
  const handleOpenSignIn = () => setOpenSignIn(true);
  const [isOnline, setOnline] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const [openBlock, setOpenBlock] = useState(false);
  const handleOpenBlock = () => setOpenBlock(true);
  const [openReport, setOpenReport] = useState(false);
  const handleOpenReport = () => setOpenReport(true);
  const [openCreateChat, setOpenCreateChat] = useState(false);
  const handleOpenCreateChat = () => setOpenCreateChat(true);
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
      if ("active_questions" in data) {
        setActiveQuestions(data.active_questions);
      } else if ("search_results" in data) {
        if (data.search_results.length == 0) {
          setSearchResultsError(true);
          setSearchResultsErrorText("No questions found");
        } else {
          setSearchResultsError(false);
          setSearchResultsError("");
        }
        setSearchResults(data.search_results);
      } else if ("members" in data) {
        setMembers(data.members);
      } else if ("question" in data) {
        setRoomName(data.question);
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
      } else if ("room" in data) {
        setRoom(data.room);
      } else if ("display_name" in data) {
        setRoomName(data.display_name);
      } else if ("suggested_questions" in data) {
        setSuggestedQuestions(data.suggested_questions);
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
        setNameError(false);
        setNameErrorText("");
        setOpenYourName(false);
      } else if ("conversations" in data) {
        setConversations(data.conversations);
      } else if ("display_name_taken" in data) {
        setNameError(true);
        setNameErrorText(
          `Sorry! ${data.display_name_taken} is another user's name`
        );
      } else if ("agreed_terms" in data) {
        setAgreedTerms(data.agreed_terms);
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
        nameError={nameError}
        setNameError={setNameError}
        errorText={nameErrorText}
        setErrorText={setNameErrorText}
      ></EditName>
    );
  }

  if (openReport && roomWs && roomWs.readyState === WebSocket.OPEN) {
    return (
      <Report
        setOpen={setOpenReport}
        roomWs={roomWs}
        reportedUser={reportedUser}
        setReportedUser={setReportedUser}
      />
    );
  }

  if (openBlock && roomWs && roomWs.readyState === WebSocket.OPEN) {
    return (
      <Block
        setOpen={setOpenBlock}
        roomWs={roomWs}
        blockedUser={blockedUser}
        setBlockedUser={setBlockedUser}
      />
    );
  }

  if (openDelete && userWs && userWs.readyState === WebSocket.OPEN) {
    return <DeleteAccount setOpen={setOpenDelete} userWs={userWs} />;
  }
  if (openMembers) {
    return (
      <Members
        setOpen={setOpenMembers}
        members={members}
        handleOpenReport={handleOpenReport}
        handleOpenBlock={handleOpenBlock}
        setReportedUser={setReportedUser}
        setBlockedUser={setBlockedUser}
        username={username}
      ></Members>
    );
  }

  if (openSignIn && userWs && userWs.readyState === WebSocket.OPEN) {
    return <SignIn setOpen={setOpenSignIn} userWs={userWs}></SignIn>;
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
        setRoom={setRoom}
        setRoomName={setRoomName}
      ></Conversations>
    );
  }

  if (openCreateChat) {
    return (
      <CreateChat
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        setOpen={setOpenCreateChat}
        setMembers={setMembers}
        setChatHistory={setChatHistory}
        roomWs={roomWs}
      ></CreateChat>
    );
  }

  if (
    room &&
    roomWs &&
    roomWs.readyState === WebSocket.OPEN &&
    userWs &&
    userWs.readyState === WebSocket.OPEN
  ) {
    return (
      <ChatRoom
        handleOpenConvos={handleOpenConvos}
        handleOpenYourName={handleOpenYourName}
        handleOpenBlock={handleOpenBlock}
        handleOpenMembers={handleOpenMembers}
        isOnline={isOnline}
        yourName={yourName}
        chatHistory={chatHistory}
        username={username}
        roomWs={roomWs}
        roomName={roomName}
        setRoom={setRoom}
        setSearchResults={setSearchResults}
      ></ChatRoom>
    );
  }

  if (
    roomWs &&
    roomWs.readyState === WebSocket.OPEN &&
    userWs &&
    userWs.readyState === WebSocket.OPEN
  ) {
    return (
      <Home
        isVerified={isVerified}
        agreedTerms={agreedTerms}
        handleOpenConvos={handleOpenConvos}
        handleOpenSignIn={handleOpenSignIn}
        handleOpenDelete={handleOpenDelete}
        handleOpenCreateChat={handleOpenCreateChat}
        isAnonymous={isAnonymous}
        setMembers={setMembers}
        setChatHistory={setChatHistory}
        roomWs={roomWs}
        userWs={userWs}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        searchResultsError={searchResultsError}
        searchResultsErrorText={searchResultsErrorText}
        setSearchResultsError={setSearchResultsError}
        setSearchResultsErrorText={setSearchResultsErrorText}
        activeQuestions={activeQuestions}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        setSuggestedQuestions={setSuggestedQuestions}
        suggestedQuestions={suggestedQuestions}
      ></Home>
    );
  }
}
