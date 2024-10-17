import React, { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { ConversationHeader } from "@chatscope/chat-ui-kit-react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function EditMemberLimit({ setOpen, oldLimit, ws, numMembers }) {
  const [newLimit, setNewLimit] = useState(oldLimit);
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
            Maximum Chat Members
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
            if (!newLimit && newLimit !== 0) {
              alert("Invalid: no limit entered");
            } else if (!Number.isInteger(newLimit)) {
              alert("Invalid: limit must be a whole number");
            } else if (newLimit < numMembers) {
              alert("Invalid: limit less than number of chat members");
            } else {
              ws.send(
                JSON.stringify({
                  command: "update_member_limit",
                  max_num_members: newLimit,
                })
              );
              handleClose();
            }
          }}
        >
          <Typography variant="h5" component="div" align="center">
            {oldLimit ? `Current limit: ${oldLimit}` : "No limit set"}
          </Typography>
          <TextField
            required
            id="outlined-required"
            label="Required"
            value={newLimit}
            onChange={(e) => {
              setNewLimit(Number(e.target.value));
            }}
            onFocus={(event) => {
              event.target.select();
            }}
            slotProps={{ htmlInput: { type: "number", min: numMembers } }}
          />
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </Stack>
      </Box>
    </div>
  );
}
