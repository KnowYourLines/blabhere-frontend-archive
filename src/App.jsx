import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ProTip from "./ProTip";
import Copyright from "./Copyright";

export default function App() {
  const [room, setRoom] = useState("");
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
