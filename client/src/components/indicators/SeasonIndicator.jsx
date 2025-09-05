import { useEffect, useState } from "react";
import axios from "axios";
import { Typography } from "@mui/material";

function SeasonIndicator() {
  const [season, setSeason] = useState(null);

  useEffect(() => {
    const fetchSeason = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5202/api/seasons/current"
        );
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
      <Typography color="error" variant="body2">
        {season.message}
      </Typography>
    );
  }

  return <Typography>{season.season_name}</Typography>;
}

export default SeasonIndicator;
