import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ProTip from "./ProTip";
import Copyright from "./Copyright";

export default function App() {
  const [room, setRoom] = useState("");
  const [token, setToken] = useState("");

  const connectRoomWs = () => {
    const backendUrl = new URL("http://localhost:8000");
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
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Material UI Vite.js example
        </Typography>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}
