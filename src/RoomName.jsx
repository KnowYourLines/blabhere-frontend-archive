import React, { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { ConversationHeader } from "@chatscope/chat-ui-kit-react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

export default function RoomName({ setOpen, oldRoomName, roomWs }) {
  const [newRoomName, setNewRoomName] = useState(oldRoomName);
  const handleClose = () => setOpen(false);
  return (
    <div style={{ position: "fixed", height: "100%", width: "100%" }}>
      <ConversationHeader>
        <ConversationHeader.Back key="1" onClick={handleClose} />
        <ConversationHeader.Content>
          <span
            style={{
              alignSelf: "center",
              color: "black",
              fontSize: "16pt",
            }}
          >
            New Room Name
          </span>
        </ConversationHeader.Content>
      </ConversationHeader>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="25vh"
      >
        <Stack
          component="form"
          sx={{ width: "20%" }}
          spacing={2}
          noValidate
          autoComplete="off"
        >
          <TextField
            required
            id="outlined-required"
            label="Required"
            value={newRoomName}
            onChange={(e) => {
              setNewRoomName(e.target.value);
              roomWs.send(
                JSON.stringify({
                  command: "update_display_name",
                  new_display_name: newRoomName,
                })
              );
            }}
          />
          <Button
            variant="contained"
            onClick={() => {
              if (!newRoomName || !newRoomName.trim()) {
                alert("No name entered!");
              } else {
                roomWs.send(
                  JSON.stringify({
                    command: "update_display_name",
                    new_display_name: newRoomName,
                  })
                );
                handleClose();
              }
            }}
          >
            Submit
          </Button>
        </Stack>
      </Box>
    </div>
  );
}
