import React, { useState, useRef } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { ConversationHeader } from "@chatscope/chat-ui-kit-react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid2";

export default function EditTopics({ setOpen, topics, userWs }) {
  const [newTopic, setNewTopic] = useState(null);
  const [options, setOptions] = useState([]);
  const handleClose = () => setOpen(false);
  const previousController = useRef();

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
            {"Your Favourite Topics"}
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
            userWs.send(
              JSON.stringify({
                command: "add_topic",
                topic: newTopic,
              })
            );
          }}
        >
          <Autocomplete
            onChange={(event, newValue) => {
              setNewTopic(newValue);
            }}
            noOptionsText={"Enter a topic"}
            options={options}
            onInputChange={onInputChange}
            filterOptions={(options) => options}
            getOptionLabel={(option) => option}
            style={{ width: "100%" }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="New chat topic"
                variant="outlined"
              />
            )}
          />
          <Button variant="contained" type="submit">
            Add
          </Button>
          <Grid
            style={{ maxHeight: "250px", overflow: "auto" }}
            container
            spacing={{ xs: 1, md: 2 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {topics.map((topic, i) => (
              <Grid size={{ xs: 2, sm: 4, md: 4 }} key={topic}>
                <Chip
                  label={topic}
                  onDelete={() => {
                    userWs.send(
                      JSON.stringify({
                        command: "remove_topic",
                        topic: topic,
                      })
                    );
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Box>
    </div>
  );
}
