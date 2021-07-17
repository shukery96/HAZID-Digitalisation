import axios from "axios";

//Need to configure in the future
export function getHazardsFromDB() {
  axios.get("http://localhost:5000/workshop/hazard").then((response) => {
    console.log("Value from Backend service", response.data);
    // return response.data;
  });
}
