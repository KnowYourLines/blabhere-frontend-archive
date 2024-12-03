import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { ConversationHeader } from "@chatscope/chat-ui-kit-react";

export default function Report({
  setOpen,
  roomWs,
  reportedUser,
  setReportedUser,
}) {
  const handleClose = () => setOpen(false);
  return (
    <div style={{ position: "fixed", height: "100%", width: "100%" }}>
      <ConversationHeader>
        <ConversationHeader.Back
          key="1"
          onClick={() => {
            handleClose();
            setReportedUser(null);
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
            {"Report User"}
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
                command: "report_user",
                username: reportedUser.username,
              })
            );
            handleClose();
            setReportedUser(null);
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            align="center"
          >
            {"This chat will be reviewed to see if it breaches our "}
            <Link
              target="_blank"
              rel="noopener"
              href="https://blabhere-backend.onrender.com/terms/"
            >
              terms & conditions
            </Link>
          </Typography>
          <Button variant="contained" type="submit">
            Report
          </Button>
        </Stack>
      </Box>
    </div>
  );
}
