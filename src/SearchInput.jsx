import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import SearchButton from "./SearchButton.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function SearchInput({
  sizeQuery,
  setSizeQuery,
  nameQuery,
  setNameQuery,
  roomWs,
}) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      marginTop="1%"
      marginBottom="1%"
    >
      <Stack
        component="form"
        direction="row"
        spacing={2}
        sx={{ width: "95%" }}
        noValidate
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
          if (sizeQuery && !Number.isInteger(sizeQuery)) {
            alert("Invalid: limit must be a whole number");
          } else if (Number.isInteger(sizeQuery) && sizeQuery < 1) {
            alert("Invalid: limit is too small");
          } else if (
            Number.isInteger(sizeQuery) ||
            typeof nameQuery === "string"
          ) {
            roomWs.send(
              JSON.stringify({
                command: "fetch_next_room_search_results",
                name: nameQuery,
                max_size: sizeQuery,
              })
            );
          }
        }}
      >
        <TextField
          label="Max Members"
          value={sizeQuery}
          onChange={(e) => {
            setSizeQuery(Number(e.target.value));
          }}
          onFocus={(event) => {
            event.target.select();
          }}
          slotProps={{ htmlInput: { type: "number", min: 2 } }}
        />
        <TextField
          fullWidth
          label="Room Name"
          value={nameQuery}
          onChange={(e) => {
            setNameQuery(e.target.value);
          }}
          onFocus={(event) => {
            event.target.select();
          }}
        />
        <SearchButton
          variant="contained"
          type="submit"
          startIcon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
        ></SearchButton>
      </Stack>
    </Box>
  );
}
