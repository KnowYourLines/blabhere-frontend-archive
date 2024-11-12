import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "./firebase.js";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Unverified({
  openModal,
  setOpenModal,
  isAnonymous,
  handleOpenSignIn,
}) {
  const handleClose = () => {
    setSent(false);
    setOpenModal(false);
  };
  const [sent, setSent] = useState(false);
  return (
    <div>
      <Modal open={openModal} onClose={handleClose}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={style}
        >
          <Stack
            component="form"
            sx={{ width: "50%", marginTop: "5%" }}
            spacing={2}
            noValidate
            autoComplete="off"
            onSubmit={(event) => {
              event.preventDefault();
              if (isAnonymous) {
                handleOpenSignIn();
                handleClose();
              } else {
                const user = auth.currentUser;
                sendEmailVerification(user, { url: window.location.href })
                  .then(() => {
                    setSent(true);
                    gtag_report_conversion();
                  })
                  .catch((error) => {
                    console.error(error.message);
                  });
              }
            }}
          >
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              align="center"
            >
              {isAnonymous ? "Please sign in" : "Verify your email"}
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ mt: 2 }}
              align="center"
            >
              {sent
                ? "Check your email inbox or spam"
                : "Only users with verified emails can join chats"}
            </Typography>
            <Button variant="contained" type="submit">
              {sent && !isAnonymous && "Email me again"}
              {!sent && !isAnonymous && "Email me"}
              {isAnonymous && "Sign In"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                handleClose();
              }}
            >
              Close
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
