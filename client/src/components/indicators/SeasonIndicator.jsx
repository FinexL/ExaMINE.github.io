import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Typography } from "@mui/material";

function SeasonIndicator({ variant = "body1", ...props }) {
  const [season, setSeason] = useState(null);

  useEffect(() => {
    const fetchSeason = async () => {
      try {
        const res = await api.get("/seasons/current");
        setSeason(res.data);
      } catch (err) {
        console.error(err);
        setSeason({ message: "Error fetching season" });
      }
    };
    fetchSeason();
  }, []);

  if (!season) return <Typography>Loading season...</Typography>;

  if (season.message) {
    return (
      <Typography color="error" variant="body2" {...props}>
        {season.message}
      </Typography>
    );
  }

  return (
    <Typography variant={variant} {...props}>
      {season.season_name}
    </Typography>
  );
}

export default SeasonIndicator;
