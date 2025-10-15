import { Card, CardContent, Typography } from "@mui/material";

const TotalCards = ({ title, count }) => {
  return (
    <Card
      sx={{
        display: "flex",
        alignContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: 200,
        height: 100,
        mb: 2,
        backgroundColor: "primary.main",
        boxShadow: 2,
      }}
    >
      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="subtitle1" color="secondary.main">
          {title}
        </Typography>
        <Typography variant="h4" color="secondary.main">
          {count}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TotalCards;

//copy and paste
//<TotalCards title="name" count={rows.length} />
