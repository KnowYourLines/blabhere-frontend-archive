import React, { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { ConversationHeader } from "@chatscope/chat-ui-kit-react";
import {
  signInWithEmailAndPassword,
  linkWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "./firebase.js";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

export default function SignIn({ setOpen }) {
  const handleClose = () => setOpen(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toggleSignUp, setToggleSignUp] = useState(false);
  const [togglePasswordReset, setTogglePasswordReset] = useState(false);

  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const signUp = () => {
    const anonUser = auth.currentUser;
    const credential = EmailAuthProvider.credential(email, password);
    linkWithCredential(anonUser, credential)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        alert(error.message);
      });
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
            {toggleSignUp ? "Sign Up" : "Sign In"}
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
            if (!email || !email.trim()) {
              alert("Invalid: no email entered");
            } else if (!password || !password.trim()) {
              alert("Invalid: no password entered");
            } else {
              if (!toggleSignUp) {
                signIn();
              } else {
                signUp();
              }
            }
          }}
        >
          <TextField
            required
            label="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            onFocus={(event) => {
              event.target.select();
            }}
          />
          <TextField
            required
            label="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            onFocus={(event) => {
              event.target.select();
            }}
          />
          <Button variant="contained" type="submit">
            {toggleSignUp ? "Sign Up" : "Sign In"}
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setToggleSignUp(!toggleSignUp);
            }}
          >
            {toggleSignUp
              ? "Already have an account? Sign In"
              : "Want a full account? Sign Up"}
          </Button>
        </Stack>
      </Box>
    </div>
  );
}
