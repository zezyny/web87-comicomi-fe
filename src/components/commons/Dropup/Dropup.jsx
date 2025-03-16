import React, { useState, useEffect } from "react";

import "./Dropup.css"

const Dropup = ({ children, onSelected, selected = null, values=[]}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(selected);

  useEffect(() => {
    if (selected) {
      setSelectedValue(selected);
    }
  }, [selected]);

  const toggleDropup = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelection = (value, ind) => {
    console.log(value)
    setSelectedValue(value.props.children);
    setIsOpen(false);
    if (onSelected) {
        if(values.length > 0){
            onSelected(values[ind])
        }else{
            onSelected(value);
        }
    }
  };

  return (
    <div className="dropup">
      <button onClick={toggleDropup} className="dropup-toggle">
        {selectedValue ? `${selectedValue}` : "select"}
      </button>
      <div className={`dropup-menu ${isOpen ? "show" : ""}`}>
        {React.Children.map(children, (child, index) =>
          React.cloneElement(child, {
            id: `dropup-item-${index}`, // Automatically assign an id
            onClick: () => handleSelection(child.props.children, index), // Default value to children if not specified
          })
        )}
      </div>
    </div>
  );
};

const DropupItem = ({ id, value, children, onClick }) => {
  return (
    <div id={id} className="dropup-item" onClick={onClick}>
      {children}
    </div>
  );
};

export default Dropup;
export { DropupItem };
