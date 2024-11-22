import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

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

export default function Report({ openModal, setOpenModal, roomWs }) {
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
              roomWs.send(
                JSON.stringify({
                  command: "report_other_user",
                })
              );
              handleClose();
            }}
          >
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              align="center"
            >
              {"Report this user?"}
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ mt: 2 }}
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
