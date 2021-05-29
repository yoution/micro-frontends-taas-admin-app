import React, { useLayoutEffect } from "react";
import { Provider } from "react-redux";
import { Router } from "@reach/router";
import ReduxToastr from "react-redux-toastr";
import store from "store";
import { disableSidebarForRoute } from "@topcoder/micro-frontends-navbar-app";
import WorkPeriods from "routes/WorkPeriods";
import Freelancers from "routes/Freelancers";
import { APP_BASE_PATH } from "./constants";
import "styles/global.scss";

export default function Root() {
  useLayoutEffect(() => {
    disableSidebarForRoute(`${APP_BASE_PATH}/*`);
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <WorkPeriods path={APP_BASE_PATH} />
        <Freelancers path={`${APP_BASE_PATH}/freelancers`} />
      </Router>
      {/* <ReduxToastr
        timeOut={4000}
        position="bottom-left"
        transitionIn="fadeIn"
        transitionOut="fadeOut"
      /> */}
    </Provider>
  );
}
