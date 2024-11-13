import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function OutlinedCard({ text }) {
  return (
    <Box sx={{ minWidth: 275, marginBottom: "1%" }}>
      <Card variant="outlined">
        <React.Fragment>
          <CardContent>
            <Typography variant="h5" component="div" align="center">
              {text}
            </Typography>
          </CardContent>
        </React.Fragment>
      </Card>
    </Box>
  );
}
