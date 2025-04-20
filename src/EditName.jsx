import React, { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { ConversationHeader } from "@chatscope/chat-ui-kit-react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

export default function EditName({
  setOpen,
  oldName,
  ws,
  title,
  nameError,
  errorText,
  setNameError,
  setErrorText,
}) {
  const [newName, setNewName] = useState(oldName);
  const handleClose = () => {
    setNameError(false);
    setErrorText("");
    setOpen(false);
  };
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
            {title}
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
          onSubmit={(event) => {
            event.preventDefault();
            if (!newName || !newName.trim()) {
              setNameError(true);
              setErrorText("No name entered");
            } else if (newName.length >= 35) {
              setNameError(true);
              setErrorText("New name must be 35 characters or less");
            } else {
              ws.send(
                JSON.stringify({
                  command: "update_display_name",
                  new_display_name: newName,
                })
              );
            }
          }}
        >
          <TextField
            required
            error={nameError}
            helperText={errorText}
            id="outlined-required"
            label="Required"
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
            }}
            onFocus={(event) => {
              event.target.select();
            }}
          />
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </Stack>
      </Box>
    </div>
  );
}
