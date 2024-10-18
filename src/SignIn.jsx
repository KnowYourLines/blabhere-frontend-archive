import React, { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { ConversationHeader } from "@chatscope/chat-ui-kit-react";
import {
  signInWithEmailAndPassword,
  linkWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail,
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
  const resetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Check your email inbox or spam to reset your password.");
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
            {toggleSignUp && !togglePasswordReset && "Sign Up"}
            {togglePasswordReset && !toggleSignUp && "Reset Password"}
            {!toggleSignUp && !togglePasswordReset && "Sign In"}
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
            }
            if (!toggleSignUp && !togglePasswordReset) {
              if (!password || !password.trim()) {
                alert("Invalid: no password entered");
              }
              signIn();
            } else if (toggleSignUp && !togglePasswordReset) {
              if (!password || !password.trim()) {
                alert("Invalid: no password entered");
              }
              signUp();
            } else if (togglePasswordReset && !toggleSignUp) {
              resetPassword();
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
          {!togglePasswordReset && (
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
          )}
          <Button variant="contained" type="submit">
            {toggleSignUp && !togglePasswordReset && "Sign Up"}
            {togglePasswordReset && !toggleSignUp && "Request password reset"}
            {!toggleSignUp && !togglePasswordReset && "Sign In"}
          </Button>
          {!togglePasswordReset && (
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
          )}
          {!toggleSignUp && (
            <Button
              variant="outlined"
              onClick={() => {
                setTogglePasswordReset(!togglePasswordReset);
              }}
            >
              {togglePasswordReset
                ? "Password changed? Sign In"
                : "Reset Password"}
            </Button>
          )}
        </Stack>
      </Box>
    </div>
  );
}
