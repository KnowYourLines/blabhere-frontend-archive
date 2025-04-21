import React, { useState, useRef } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { ConversationHeader } from "@chatscope/chat-ui-kit-react";
import nlp from "compromise";
import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";

export default function CreateChat({
  roomWs,
  setSearchInput,
  searchInput,
  setOpen,
  setMembers,
  setChatHistory,
}) {
  const [questionError, setQuestionError] = useState(false);
  const [questionErrorText, setQuestionErrorText] = useState("");
  const handleClose = () => setOpen(false);

  const matcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
  });

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
            {"New Chat"}
          </span>
        </ConversationHeader.Content>
      </ConversationHeader>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Stack
          component="form"
          sx={{ width: "50%", marginTop: "5%" }}
          spacing={2}
          noValidate
          autoComplete="off"
          onSubmit={(event) => {
            event.preventDefault();
            if (!searchInput) {
              setQuestionError(true);
              setQuestionErrorText("No chat question");
            } else {
              setQuestionError(false);
              setQuestionErrorText("");
            }
            const containsSingleQuestion =
              nlp(searchInput).questions().data().length === 1;
            if (!containsSingleQuestion) {
              setQuestionError(true);
              setQuestionErrorText("Ask one question only to start");
            } else if (matcher.hasMatch(searchInput)) {
              setQuestionError(true);
              setQuestionErrorText("Questions cannot contain profanities");
            } else {
              setQuestionError(false);
              setQuestionErrorText("");
            }
            if (
              containsSingleQuestion &&
              searchInput &&
              !matcher.hasMatch(searchInput)
            ) {
              setMembers([]);
              setChatHistory([]);
              roomWs.send(
                JSON.stringify({
                  command: "create_room",
                  question: searchInput,
                })
              );
              handleClose();
            }
          }}
        >
          <TextField
            required
            label="Ask a question"
            value={searchInput}
            error={questionError}
            helperText={questionErrorText}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
            onFocus={(event) => {
              event.target.select();
            }}
          />
          <Button variant="contained" type="submit">
            Start New Chat
          </Button>
        </Stack>
      </Box>
    </div>
  );
}
