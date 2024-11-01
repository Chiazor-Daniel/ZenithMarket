/* eslint-disable */
import React, { Fragment, useEffect, useState } from "react";
import SideBar from "./SideBar";
import { useContext } from "react";
import NavHader from "./NavHader";
import Header from "./Header";
import { ThemeContext } from "../../../redux-contexts/context/ThemeContext";

const JobieNav = ({ title, onClick: ClickToAddEvent, onClick2, onClick3, onDarkModeChange, userType, superAdmin, asAdmin, setAsAdmin, setUserType }) => {
  const [toggle, setToggle] = useState("");
  const [dark, setDark] = useState("");
  const { setDemoTheme } = useContext(ThemeContext);
  // Function to handle changes to the dark state
  const handleDarkModeChange = (theme) => {
    setDark(theme); // Update the dark state
    // Pass the updated dark state to the parent component
    if (onDarkModeChange) {
      onDarkModeChange(theme);
    }
  };

  const onClick = (name) => setToggle(toggle === name ? "" : name);

  return (
    <Fragment>
      <NavHader userType={userType} superAdmin={superAdmin} setAsAdmin={setAsAdmin} asAdmin={asAdmin}/>
      <Header
          onNote={() => onClick("chatbox")}
          onNotification={() => onClick("notification")}
          onProfile={() => onClick("profile")}
          toggle={toggle}
          title={title}
          setAsAdmin={setAsAdmin}
          asAdmin={asAdmin}
          setUserType={setUserType}
          userType={userType}
          superAdmin={superAdmin}
          onBox={() => onClick("box")}
          onClick={() => ClickToAddEvent()}
          onThemeChange={(theme)=>handleDarkModeChange(theme)} // Pass the function to handle dark mode change
        /> 
      <SideBar userType={userType}  superAdmin={superAdmin} />
    </Fragment>
  );
};

export default JobieNav;
