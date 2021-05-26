import React from "react";

// reactstrap components
//import { Col
//} from "reactstrap";

// core components
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import LoginNavbar from "components/Navbars/LoginNavbar.js";
import IndexHeader from "components/Headers/IndexHeader.js";
import DarkFooter from "components/Footers/DarkFooter.js";
import { useDispatch } from "react-redux";
// sections for this page
import Images from "./index-sections/Images.js";
import BasicElements from "./index-sections/BasicElements.js";
import Navbars from "./index-sections/Navbars.js";
import Tabs from "./index-sections/Tabs.js";
import Pagination from "./index-sections/Pagination.js";
import Notifications from "./index-sections/Notifications.js";
import Typography from "./index-sections/Typography.js";
import Javascript from "./index-sections/Javascript.js";
import Carousel from "./index-sections/Carousel.js";
import NucleoIcons from "./index-sections/NucleoIcons.js";
import CompleteExamples from "./index-sections/CompleteExamples.js";
import Examples from "./index-sections/Examples.js";
import Download from "./index-sections/Download.js";
import axios from "axios";
import { authenticateUser } from "../_actions/user_action";
import Cookies from "js-cookie";
function Index() {
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = React.useState(false);
  const [userName, setUserName] = React.useState("");

  React.useEffect(() => {
    const token = Cookies.get("x_auth");
    dispatch(authenticateUser(token)).then((res) => {
      if (res.payload.authentication) {
        setUserName(res.payload.info);
        setIsLogin(true);
      } else setIsLogin(false);
      console.log(isLogin);
    });

    document.body.classList.add("index-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    return function cleanup() {
      document.body.classList.remove("index-page");
      document.body.classList.remove("sidebar-collapse");
    };
  });
  return (
    <>
      {isLogin ? (
        <LoginNavbar name={userName} />
      ) : (
        <IndexNavbar isLogin={isLogin} />
      )}

      <div className="wrapper">
        <IndexHeader />
        <div className="main"></div>
        <div className="mb-3"></div>
      </div>
    </>
  );
}

export default Index;
