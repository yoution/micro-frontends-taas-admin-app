import React, { useState } from "react";
import { usePopper } from "react-popper";
import PT from "prop-types";
import cn from "classnames";
import compStyles from "./styles.module.scss";

const Popup = ({ children, className, referenceElement }) => {
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom",
    strategy: "fixed",
    modifiers: [
      { name: "arrow", options: { element: arrowElement, padding: 10 } },
      { name: "offset", options: { offset: [0, 5] } },
      { name: "preventOverflow", options: { padding: 15 } },
    ],
  });

  return (
    <div
      ref={setPopperElement}
      className={cn(compStyles.container, styles.container, className)}
      style={styles.popper}
      {...attributes.popper}
    >
      {children}
      <div className="popup-arrow" ref={setArrowElement} style={styles.arrow} />
    </div>
  );
};

Popup.propTypes = {
  children: PT.node,
  className: PT.string,
  referenceElement: PT.object.isRequired,
};

export default Popup;
