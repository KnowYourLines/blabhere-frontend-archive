import React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function SearchInput({
  roomWs,
  setSearchInput,
  searchInput,
  handleOpenCreateChat,
  searchResultsError,
  searchResultsErrorText,
  setSearchResultsError,
  setSearchResultsErrorText,
  setSearchResults,
  suggestedQuestions,
  setSuggestedQuestions,
}) {
  const getData = (searchTerm) => {
    roomWs.send(
      JSON.stringify({
        command: "suggest_questions",
        question: searchTerm,
      })
    );
  };

  const onInputChange = (event, value, reason) => {
    if (value && reason === "input") {
      setSearchInput(value);
      getData(value);
    }
  };
  return (
    <Box justifyContent="center" alignItems="center">
      <Stack
        component="form"
        sx={{ width: "50%" }}
        spacing={2}
        noValidate
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
          if (!searchInput) {
            setSearchResultsError(true);
            setSearchResultsErrorText("Enter your query");
            setSearchResults([]);
          } else {
            setSearchResultsError(false);
            setSearchResultsErrorText("");
          }
          roomWs.send(
            JSON.stringify({
              command: "find_rooms",
              question: searchInput,
            })
          );
        }}
      >
        <Autocomplete
          freeSolo
          onChange={(event, newValue) => {
            setSearchInput(newValue);
          }}
          value={searchInput}
          noOptionsText={"No questions found"}
          options={suggestedQuestions}
          onInputChange={onInputChange}
          filterOptions={(options) => options}
          getOptionLabel={(option) => option}
          style={{ width: "100%" }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Find chats about"
              variant="outlined"
              error={searchResultsError}
              helperText={searchResultsErrorText}
            />
          )}
        />
        <Stack justifyContent="center" spacing="2%" direction="row">
          <Button variant="contained" type="submit">
            Search Chats
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => {
              handleOpenCreateChat();
            }}
          >
            Create Chat
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
