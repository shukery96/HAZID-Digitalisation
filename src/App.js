import "./App.css";
import "antd/dist/antd.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./components/HomePage";
import WorkshopCreationPage from "./components/WorkshopCreationPage";
import UploadDataPage from "./components/UploadDataPage";
import EditWorkshop from "./components/EditWorkshop";
import FacilitateWorkshopPage from "./components/FacilitateWorkshopPage";
import DisplayWorkshop from "./components/DisplayWorkshop";
import EditHazardsPage from "./components/EditHazardsPage";

import { Layout } from "antd";

function App() {
  return (
    <Router>
      <div className="App">
        <Layout style={{ height: "100vh" }}>
          <NavBar />
          <Route path="/" exact component={HomePage} />
          <Route
            path="/WorkshopCreationPage"
            exact
            component={WorkshopCreationPage}
          />
          <Route
            path="/FacilitateWorkshopPage"
            exact
            component={FacilitateWorkshopPage}
          />
          <Route
            path="/WorkshopCreationPage/EditWorkshop"
            exact
            component={EditWorkshop}
          />

          <Route
            path="/WorkshopCreationPage/UploadData"
            exact
            component={UploadDataPage}
          />
          <Route
            path="/WorkshopCreationPage/EditHazardsPage"
            exact
            component={EditHazardsPage}
          />
          <Route
            path="/FacilitateWorkshopPage/DisplayWorkshop/"
            exact
            component={DisplayWorkshop}
          />
        </Layout>
      </div>
    </Router>
  );
}

export default App;
