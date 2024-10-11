import React, { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { ConversationHeader } from "@chatscope/chat-ui-kit-react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

export default function YourName({ setOpen, oldName, userWs }) {
  const [newName, setNewName] = useState(oldName);
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
            Your New Name
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
          sx={{ width: "50%", marginTop: "5%" }}
          spacing={2}
          noValidate
          autoComplete="off"
        >
          <TextField
            required
            id="outlined-required"
            label="Required"
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
            }}
          />
          <Button
            variant="contained"
            type="submit"
            onClick={() => {
              if (!newName || !newName.trim()) {
                alert("No name entered!");
              } else {
                userWs.send(
                  JSON.stringify({
                    command: "update_display_name",
                    new_display_name: newName,
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
