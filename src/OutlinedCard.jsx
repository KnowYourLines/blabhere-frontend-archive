import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export default function OutlinedCard({ cardContent }) {
  return (
    <Box sx={{ minWidth: 275, marginBottom: "1%" }}>
      <Card variant="outlined">
        <React.Fragment>
          <CardContent align="center">{cardContent}</CardContent>
        </React.Fragment>
      </Card>
    </Box>
  );
}
