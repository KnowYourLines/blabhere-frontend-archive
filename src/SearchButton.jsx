import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function SearchButton({}) {
  return (
    <Button
      variant="contained"
      type="submit"
      startIcon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
    ></Button>
  );
}
