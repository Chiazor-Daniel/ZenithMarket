/* eslint-disable */
import React, { useContext, useEffect, useState } from "react";
/// React router dom
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../redux-contexts/context/ThemeContext";

//images
import logo1 from './../../../assets/images/logo/logo.png';
import SetLogo from "../../../setLogo";

import { useResponsive } from "../../../redux-contexts/context/responsive";
export function NavMenuToggle() {
  let mainwrapper = document.querySelector("#main-wrapper");
  setTimeout(() => {
    if (mainwrapper.classList.contains('menu-toggle')) {
      mainwrapper.classList.remove("menu-toggle");
    } else {
      mainwrapper.classList.add("menu-toggle");
    }
  }, 200);
}

const NavHader = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const [toggle, setToggle] = useState(false);
  const { navigationHader, openMenuToggle, background } = useContext(
    ThemeContext
  );
  
  
  return (
    <div className="nav-header" style={{backgroundColor: 'rgba(243, 243, 243, 0.04)'}}>
      <Link to="/dashboard" className="brand-logo">
        {
          !isMobile && (
            <SetLogo w={!toggle? 150: 100} h={120}/>
          )
        }
        {/* <img src={logotext1} className="brand-title" alt=""/>
		<img src={logoColor} className="logo-color" alt="" />
		<img src={logoColorText} className="brand-title color-title" alt="" /> */}
      </Link>

      <div
        className="nav-control"
        onClick={() => {
          setToggle(!toggle);
          //openMenuToggle();
          NavMenuToggle();
        }}
      >
        <div className={`hamburger ${toggle ? "is-active" : ""}`}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="22" y="11" width="4" height="4" rx="2" fill="#2A353A" />
            <rect x="11" width="4" height="4" rx="2" fill="#2A353A" />
            <rect x="22" width="4" height="4" rx="2" fill="#2A353A" />
            <rect x="11" y="11" width="4" height="4" rx="2" fill="#2A353A" />
            <rect x="11" y="22" width="4" height="4" rx="2" fill="#2A353A" />
            <rect width="4" height="4" rx="2" fill="#2A353A" />
            <rect y="11" width="4" height="4" rx="2" fill="#2A353A" />
            <rect x="22" y="22" width="4" height="4" rx="2" fill="#2A353A" />
            <rect y="22" width="4" height="4" rx="2" fill="#2A353A" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NavHader;
