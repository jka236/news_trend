import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import TrendChart from "./components/trendChart";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import news_trend from "./asset/news_trend.png";

function App() {
  const [words, setWords] = useState();
  const [loading, setLoading] = useState(true);

  function formatDate(d) {
    var month = "" + (d.getMonth() + 1);
    var day = "" + d.getDate();
    var year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  var weekAgo = new Date(new Date().setDate(new Date().getDate() - 6));
  var current_date = new Date();

  var today = formatDate(current_date);
  weekAgo = formatDate(weekAgo);

  // get total days between two dates
  var days = Math.floor(current_date / 86400000);
  // var days = 19155;

  useEffect(() => {
    axios
      //.get("https://news-trend-tracking.herokuapp.com/aggregated")
      .get("http://localhost:8000/aggregated")
      .then((res) => {
        setLoading(false);
        setWords(res.data.data[0]);
        console.log('Data')
        console.log(res.data.data[0])
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <React.Fragment>
      <>
        <main>
          <Container maxWidth="sm">
            <Box sx={{ my: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Top 10 Most Frequent Keywords From Last 7 Days
              </Typography>
              <Typography variant="h5" component="h1" gutterBottom>
                From {weekAgo} To {today}
              </Typography>
              <Typography variant="h6" component="h1" gutterBottom>
                Please bear with a slow loading. This is on a free tier server
              </Typography>
              {loading && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "50px",
                  }}
                >
                  <CircularProgress />
                </div>
              )}
              {!loading && (
                <TrendChart
                  width={640}
                  height={400}
                  data={words}
                  fromDate={days - 7}
                  toDate={days}
                />
              )}
            </Box>
            <div>
              <h2>
                Tech Stack{" "}
                <a href="https://github.com/jka236/news_trend">Github</a>
              </h2>

              <img
                src={news_trend}
                alt="news_trend"
                style={{ width: "100%" }}
              />
            </div>
          </Container>
        </main>
      </>
    </React.Fragment>
  );
}

export default App;
