import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { ConversationHeader } from "@chatscope/chat-ui-kit-react";

export default function Block({
  setOpen,
  roomWs,
  blockedUser,
  setBlockedUser,
}) {
  const handleClose = () => setOpen(false);
  return (
    <div style={{ position: "fixed", height: "100%", width: "100%" }}>
      <ConversationHeader>
        <ConversationHeader.Back
          key="1"
          onClick={() => {
            handleClose();
            setBlockedUser(null);
          }}
        />
        <ConversationHeader.Content>
          <span
            style={{
              alignSelf: "center",
              color: "black",
              fontSize: "16pt",
            }}
          >
            {"Block User"}
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
            roomWs.send(
              JSON.stringify({
                command: "block_user",
                username: blockedUser.username,
              })
            );
            handleClose();
            setBlockedUser(null);
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            align="center"
          >
            {
              "You will stop seeing each other's messages and you will never be put in the same group again."
            }
          </Typography>
          <Button variant="contained" type="submit">
            Block
          </Button>
        </Stack>
      </Box>
    </div>
  );
}
