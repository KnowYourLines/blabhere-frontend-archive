import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { auth } from "./firebase.js";
import { signOut } from "firebase/auth";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { ConversationHeader } from "@chatscope/chat-ui-kit-react";

export default function DeleteAccount({ setOpen, userWs }) {
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
            {"Account Deletion"}
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
            userWs.send(
              JSON.stringify({
                command: "delete_account",
              })
            );
            signOut(auth);
            window.location.reload();
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            align="center"
          >
            {
              "All your personal chats, messages and data will be erased. This cannot be undone."
            }
          </Typography>
          <Button variant="contained" type="submit">
            Delete My Account
          </Button>
        </Stack>
      </Box>
    </div>
  );
}
