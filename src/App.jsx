import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
  Button,
} from "@chatscope/chat-ui-kit-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faUserGroup,
  faComments,
  faCommentMedical,
  faUserLock,
  faRotateRight,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import Conversations from "./Conversations.jsx";
import Members from "./Members.jsx";
import EditName from "./EditName.jsx";
import Moment from "react-moment";
import Linkify from "react-linkify";
import { isMobile } from "react-device-detect";
import EditMemberLimit from "./EditMemberLimit.jsx";
import OutlinedCard from "./OutlinedCard.jsx";

export default function App() {
  const [room, setRoom] = useState("");
  const [leftRoom, setLeftRoom] = useState(false);
  const [isRoomFull, setIsRoomFull] = useState(false);
  const [isRoomCreator, setIsRoomCreator] = useState(false);
  const [memberLimit, setMemberLimit] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [conversations, setConversations] = useState([]);
  const [yourName, setYourName] = useState("");
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [members, setMembers] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [roomWs, setRoomWs] = useState(null);
  const [userWs, setUserWs] = useState(null);
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
    const firebaseConfig = {
      apiKey: "AIzaSyD6HWYS1hbYXR7xvKgq7hQW-T4wSECWnss",
      authDomain: "blabhere-29279.firebaseapp.com",
      projectId: "blabhere-29279",
      storageBucket: "blabhere-29279.appspot.com",
      messagingSenderId: "304567083706",
      appId: "1:304567083706:web:25db98d0c4edb2326e9883",
      measurementId: "G-V5JWXF119M",
    };
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setToken(token);
        setUsername(user.uid);
      } else {
        signInAnonymously(auth);
      }
    });
  }, [token]);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const currentRoom = urlParams.get("room");
    if (!currentRoom) {
      const newRoom = uuidv4();
      const url = new URL(window.location.href.split("?")[0]);
      url.searchParams.set("room", newRoom);
      window.history.replaceState("", "", url);
      const newUrlParams = new URLSearchParams(window.location.search);
      setRoom(newUrlParams.get("room"));
    } else {
      setRoom(currentRoom);
    }
  }, [room]);
  useEffect(() => {
    if (room && token && !roomWs) {
      connectRoomWs();
    }
  }, [room, token, roomWs]);
  useEffect(() => {
    if (username && token && !userWs) {
      connectUserWs();
    }
  }, [username, token, userWs]);

  if (leftRoom) {
    return (
      <div style={{ position: "fixed", height: "100%", width: "100%" }}>
        <MainContainer>
          <ChatContainer>
            <ConversationHeader
              style={{ position: "fixed", height: "100%", width: "100%" }}
            >
              <ConversationHeader.Content>
                <span
                  style={{
                    alignSelf: "center",
                    fontSize: "16pt",
                  }}
                >
                  <Button
                    icon={<FontAwesomeIcon icon={faRotateRight} />}
                    onClick={() => {
                      roomWs.send(
                        JSON.stringify({
                          command: "connect",
                          room: room,
                        })
                      );
                      setLeftRoom(false);
                    }}
                  >
                    Rejoin
                  </Button>
                </span>
                <OutlinedCard text={"You have left this room."}></OutlinedCard>
              </ConversationHeader.Content>
            </ConversationHeader>
          </ChatContainer>
        </MainContainer>
      </div>
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

  if (isRoomFull) {
    return (
      <div style={{ position: "fixed", height: "100%", width: "100%" }}>
        <MainContainer>
          <ChatContainer>
            <ConversationHeader
              style={{ position: "fixed", height: "100%", width: "100%" }}
            >
              <ConversationHeader.Content>
                <span
                  style={{
                    alignSelf: "center",
                    fontSize: "16pt",
                  }}
                >
                  <Button
                    icon={
                      <FontAwesomeIcon
                        icon={faCommentMedical}
                        onClick={() => {
                          const url = new URL(window.location.href);
                          window.open(url.origin, "_blank");
                        }}
                      />
                    }
                  ></Button>
                  <Button
                    icon={
                      <FontAwesomeIcon
                        icon={faComments}
                        onClick={handleOpenConvos}
                      />
                    }
                  ></Button>
                </span>
                <span
                  style={{
                    alignSelf: "center",
                    color: "black",
                    fontSize: "16pt",
                  }}
                >
                  <Button
                    icon={<FontAwesomeIcon icon={faPenToSquare} />}
                    onClick={handleOpenYourName}
                  >
                    Your Name: {yourName}
                  </Button>{" "}
                </span>
                <OutlinedCard text={"Sorry, this room is full."}></OutlinedCard>
              </ConversationHeader.Content>
            </ConversationHeader>
          </ChatContainer>
        </MainContainer>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", height: "100%", width: "100%" }}>
      <MainContainer>
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Content>
              <span
                style={{
                  alignSelf: "center",
                  fontSize: "16pt",
                }}
              >
                <Button
                  icon={
                    <FontAwesomeIcon
                      icon={faCommentMedical}
                      onClick={() => {
                        const url = new URL(window.location.href);
                        window.open(url.origin, "_blank");
                      }}
                    />
                  }
                ></Button>
                <Button
                  icon={
                    <FontAwesomeIcon
                      icon={faComments}
                      onClick={handleOpenConvos}
                    />
                  }
                ></Button>
                <Button
                  icon={
                    <FontAwesomeIcon
                      icon={faUserGroup}
                      onClick={handleOpenMembers}
                    />
                  }
                ></Button>
                {navigator.canShare && (
                  <Button
                    icon={
                      <FontAwesomeIcon
                        icon={faUserPlus}
                        onClick={() => {
                          const shareData = {
                            url: window.location.href,
                          };
                          if (navigator.canShare(shareData)) {
                            navigator
                              .share(shareData)
                              .catch((e) => console.log(e));
                          }
                        }}
                      />
                    }
                  ></Button>
                )}
                {isRoomCreator && (
                  <Button
                    icon={
                      <FontAwesomeIcon
                        icon={faUserLock}
                        onClick={handleOpenMemberLimit}
                      />
                    }
                  ></Button>
                )}
              </span>
              <span
                style={{
                  alignSelf: "center",
                  color: "black",
                  fontSize: "16pt",
                }}
              >
                <Button
                  icon={<FontAwesomeIcon icon={faPenToSquare} />}
                  onClick={handleOpenRoomName}
                >
                  Room Name: {roomName}
                </Button>{" "}
              </span>
              <span
                style={{
                  alignSelf: "center",
                  color: "black",
                  fontSize: "16pt",
                }}
              >
                <Button
                  icon={<FontAwesomeIcon icon={faPenToSquare} />}
                  onClick={handleOpenYourName}
                >
                  Your Name: {yourName}
                </Button>{" "}
              </span>
            </ConversationHeader.Content>
          </ConversationHeader>

          <MessageList
            onYReachStart={() => {
              roomWs.send(
                JSON.stringify({
                  command: "fetch_prev_messages",
                  oldest_message_id: chatHistory[0].id,
                })
              );
            }}
          >
            {chatHistory.map((msg, i) => (
              <Message
                key={msg.id}
                model={{
                  position: "last",
                  direction:
                    username == msg.creator_username ? "outgoing" : "incoming",
                }}
              >
                <Message.CustomContent>
                  <Linkify
                    componentDecorator={(decoratedHref, decoratedText, key) => (
                      <a
                        target="blank"
                        rel="noopener"
                        href={decoratedHref}
                        key={key}
                      >
                        {decoratedText}
                      </a>
                    )}
                  >
                    {msg.content}
                  </Linkify>
                </Message.CustomContent>
                <Message.Header>
                  <b>{msg.creator_display_name}</b>
                </Message.Header>
                <Message.Footer>
                  <Moment unix fromNow>
                    {msg.created_at}
                  </Moment>
                </Message.Footer>
              </Message>
            ))}
          </MessageList>
          <MessageInput
            style={{ fontSize: "18px" }}
            disabled={!isOnline}
            placeholder="Type message here"
            attachButton={false}
            fancyScroll={false}
            sendOnReturnDisabled={isMobile}
            onSend={(innerHtml, textContent, innerText, nodes) => {
              roomWs.send(
                JSON.stringify({
                  command: "send_message",
                  message: innerText,
                })
              );
            }}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}
