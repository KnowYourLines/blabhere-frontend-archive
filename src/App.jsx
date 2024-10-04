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
} from "@chatscope/chat-ui-kit-react";

export default function App() {
  const [room, setRoom] = useState("");
  const [token, setToken] = useState("");

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
      if (room) {
        roomWs.send(
          JSON.stringify({
            command: "connect",
            room: room,
          })
        );
      }
    };
    roomWs.onerror = (e) => {
      console.log(e.message);
    };
    roomWs.onclose = () => {
      console.log("Room WebSocket closed");
      connectRoomWs();
    };
  };

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
    if (room && token) {
      connectRoomWs();
    }
  }, [room, token]);
  const chatHistory = [
    "hi",
    "hi",
    "how are you",
    "i am fine, thanks. How you doing",
    "im doing great.",
    "hi",
    "hi",
    "how are you",
    "i am fine, thanks. How you doing",
    "im doing great.",
    "hi",
    "hi",
    "how are you",
    "i am fine, thanks. How you doing",
    "im doing great.",
    "hi",
    "hi",
    "how are you",
    "i am fine, thanks. How you doing How you doingHow you doingHow you doingHow you doingHow you doing\n\nHow you doingHow you doing",
    "im doing great.",
    "hi",
    "hi",
    "how are you https://chatscope.io ",
    "i am fine, thanks. How you doing",
    "im doing great.",
  ];

  return (
    <div style={{ position: "relative", height: "500px" }}>
      <MainContainer>
        <ChatContainer>
          <MessageList>
            {chatHistory.map((elt, i) => (
              <Message
                key={i}
                model={{
                  message: elt,
                }}
              >
                <Message.Header><b>SomeRandomPersonNamedBilly</b></Message.Header>
                <Message.Footer>5 minutes ago</Message.Footer>
              </Message>
            ))}
          </MessageList>
          <MessageInput placeholder="Type message here" attachButton={false} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}
