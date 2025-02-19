import React, { useState, useRef } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { ConversationHeader } from "@chatscope/chat-ui-kit-react";
import nlp from "compromise";

export default function CreateChat({
  roomWs,
  setSearchInput,
  searchInput,
  setOpen,
}) {
  const [options, setOptions] = useState([]);
  const [question, setQuestion] = useState("");
  const [questionError, setQuestionError] = useState(false);
  const [questionErrorText, setQuestionErrorText] = useState("");
  const [topicError, setTopicError] = useState(false);
  const [topicErrorText, setTopicErrorText] = useState("");
  const previousController = useRef();
  const handleClose = () => setOpen(false);

  const getData = (searchTerm) => {
    if (previousController.current) {
      previousController.current.abort();
    }
    const controller = new AbortController();
    const signal = controller.signal;
    previousController.current = controller;
    fetch("https://api.datamuse.com/sug?v=enwiki&s=" + searchTerm, {
      signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        const updatedOptions = myJson.map((p) => {
          return p.word;
        });
        setOptions(updatedOptions);
      })
      .catch(function (e) {
        console.log(e.message);
      });
  };

  const onInputChange = (event, value, reason) => {
    if (value && reason === "input") {
      getData(value);
    } else {
      setOptions([]);
    }
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
              setTopicError(true);
              setTopicErrorText("No chat topic");
            } else {
              setTopicError(false);
              setTopicErrorText("");
            }
            const containsSingleQuestion =
              nlp(question).questions().data().length === 1;
            if (!containsSingleQuestion) {
              setQuestionError(true);
              setQuestionErrorText("Ask a single question only");
            } else {
              setQuestionError(false);
              setQuestionErrorText("");
            }
          }}
        >
          <Autocomplete
            onChange={(event, newValue) => {
              setSearchInput(newValue);
            }}
            value={searchInput}
            noOptionsText={"No topics found"}
            options={options}
            onInputChange={onInputChange}
            filterOptions={(options) => options}
            getOptionLabel={(option) => option}
            style={{ width: "100%" }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Enter chat topic"
                variant="outlined"
                error={topicError}
                helperText={topicErrorText}
              />
            )}
          />
          <TextField
            required
            label="Ask a question"
            value={question}
            error={questionError}
            helperText={questionErrorText}
            onChange={(e) => {
              setQuestion(e.target.value);
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
