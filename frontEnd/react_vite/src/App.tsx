import {
  Route,
  Routes,
} from "react-router-dom";
import Overview from "./pages/overview/AllRegion";
import ShortageReport from "./pages/shortage/ShortageReport";
import ExampleChart from "./pages/overview//Example/ExampleChart";
import Layout from "./layouts/Layout/Layout";
import "./App.scss";
import PrivateRoute from "./PrivateRoute";
import NoAccess from "./pages/NoAccess";
import { Login } from "./auth/Login";
import { Callback } from "./auth/Callback";
import FactoryLog from "./pages/Quality/FactoryLog";
import IssueTracker from "./pages/IssueTracker/IssueTracker";

const App = () => (
  
      <Routes>
        <Route path="/callback" element={<Callback />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
      <Route path="/" element={<PrivateRoute element={<Overview />} />}/>
      <Route path="/2T" element={<PrivateRoute element={<ExampleChart />} />} />
      <Route path="/shortage-report" element={<PrivateRoute element={<ShortageReport />} />} />
      <Route path="/factory-log" element={<PrivateRoute element={<FactoryLog />} />} />
      <Route path="/issue-tracker" element={<PrivateRoute element={<IssueTracker />} />} />
    </Route>
    <Route path="/noaccess" element={<NoAccess />} /> {/* 无权限页面 */}
      </Routes>
        
  );
export default App;