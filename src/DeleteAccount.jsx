import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { auth } from "./firebase.js";
import { signOut } from "firebase/auth";

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

export default function DeleteAccount({ openModal, setOpenModal, userWs }) {
  const handleClose = () => {
    setOpenModal(false);
  };
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
              {"Delete this account?"}
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ mt: 2 }}
              align="center"
            >
              {
                "All your personal chats, messages and data will be erased. This cannot be undone."
              }
            </Typography>
            <Button variant="contained" type="submit">
              Delete
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
