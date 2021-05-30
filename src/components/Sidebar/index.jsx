import React, { useCallback } from "react";
import PT from "prop-types";
import cn from "classnames";
import NavMenu from "components/NavMenu";
import styles from "./styles.module.scss";
import WorkPeriods from "components/Icons/WorkPeriods";
import Freelancers from "components/Icons/Freelancers";
import { APP_BASE_PATH } from "../../constants";

/**
 * Displays challenges' and gigs' menu and challenge filters.
 *
 * @param {Object} props component properties
 * @param {Object} props.children component children
 * @param {string} [props.className] optional class name to add to root element
 * @returns {JSX.Element}
 */
const Sidebar = ({ className, children }) => (
  <div className={cn(styles.container, className)}>
    <NavMenu className={styles.menu} items={NAV_ITEMS} />
    {children}
  </div>
);

Sidebar.propTypes = {
  children: PT.node,
  className: PT.string,
};

const NAV_ITEMS = [
  { icon: WorkPeriods, label: "Working Periods", path: APP_BASE_PATH },
  {
    icon: Freelancers,
    label: "Freelancers",
    path: `${APP_BASE_PATH}/freelancers`,
  },
];

export default Sidebar;
