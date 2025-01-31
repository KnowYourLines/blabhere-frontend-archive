import React, { useState, useRef, useEffect } from "react";
import { auth } from "./firebase.js";
import { sendEmailVerification } from "firebase/auth";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function SearchRooms({
  handleOpenModal,
  handleOpenTerms,
  isVerified,
  agreedTerms,
  roomWs,
}) {
  const [newTopic, setNewTopic] = useState(null);
  const [options, setOptions] = useState([]);
  const previousController = useRef();
  useEffect(() => {
    if (!isVerified) {
      const user = auth.currentUser;
      sendEmailVerification(user, { url: window.location.href })
        .then(() => {
          gtag_report_conversion();
        })
        .catch((error) => {
          console.error(error.message);
        });
      handleOpenModal();
    }
  }, [isVerified]);
  useEffect(() => {
    if (!agreedTerms) {
      handleOpenTerms();
    }
  }, [agreedTerms]);

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
              command: "find_rooms",
              topic: newTopic,
            })
          );
        }}
      >
        <Autocomplete
          onChange={(event, newValue) => {
            setNewTopic(newValue);
          }}
          value={newTopic}
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
            />
          )}
        />
        <Button variant="contained" type="submit">
          Search Chats
        </Button>
      </Stack>
    </Box>
  );
}
