/* eslint-disable */
import React, { useContext, useEffect, useReducer, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Link, NavLink } from "react-router-dom";
import { AdminMenuList, AdminMenuList2, MenuList } from './Menu';
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { ThemeContext } from "../../../redux-contexts/context/ThemeContext";
import { useResponsive } from "../../../redux-contexts/context/responsive";
import { Collapse } from "react-bootstrap";
const reducer = (previousState, updatedState) => ({
  ...previousState,
  ...updatedState,
});

const initialState = {
  active: "",
  activeSubmenu: "",
}

const SideBar = ({ userType, superAdmin }) => {
  const {isMobile} = useResponsive();
  const {
    iconHover,
    sidebarposition,
    headerposition,
    sidebarLayout,
  } = useContext(ThemeContext);

  const [state, setState] = useReducer(reducer, initialState);

  const [hideOnScroll, setHideOnScroll] = useState(true)
  useScrollPosition(
    ({ prevPos, currPos }) => {
      const isShow = currPos.y > prevPos.y
      if (isShow !== hideOnScroll) setHideOnScroll(isShow)
    },
    [hideOnScroll]
  )

  useEffect(() => {
    // Your effect code here
  }, []);

  useEffect(() => {
    // Check if path matches any menu item and update active state
    let path = window.location.pathname;
    path = path.split("/");
    path = path[path.length - 1];

    MenuList.forEach((data) => {
      if (data.to === path && state.active !== data.title) {
        setState({ active: data.title });
      }
    });
  }, [state.active]);

  let path = window.location.pathname;
  path = path.split("/");
  path = path[path.length - 1];

  const handleMenuActive = (status) => {
    setState({ active: status });
    if (state.active === status) {
      setState({ active: "" });
    }
  }

  return (
    <div
      style={{backgroundColor: isMobile ? '#131722' : 'rgba(243, 243, 243, 0.04)'}}
      className={`deznav ${iconHover} ${sidebarposition.value === "fixed" &&
        sidebarLayout.value === "horizontal" &&
        headerposition.value === "static"
        ? hideOnScroll > 120
          ? "fixed"
          : ""
        : ""
        }`}
    >
      <PerfectScrollbar className="deznav-scroll">
        <ul className="metismenu" id="menu">
          {userType == "user" &&
            MenuList.map((data, index) => {
              let menuClass = data.classsChange;
              if (menuClass === "menu-title") {
                return (
                  <Link to={data.to} key={index}>
                    <li className={menuClass}>{data.title}</li>
                  </Link>
                )
              } else {
                return (
                  <li className={` ${state.active === data.title ? 'mm-active' : ''}`}
                    key={index}
                    style={{ backgroundColor: path === data.to ? 'black' : '' }}
                    onClick={() => handleMenuActive(data.title)} // Added onClick handler
                  >
                    {data.content && data.content.length > 0 ?
                      <>
                        <Link to={"#"} className="has-arrow">
                          {data.iconStyle}
                          <span className="nav-text">{data.title}</span>
                        </Link>
                        <Collapse in={state.active === data.title ? true : false}>
                          <ul className={`${menuClass === "mm-collapse" ? "mm-show" : ""}`}>
                            {data.content && data.content.map((data, index) => {
                              return (
                                <li key={index}
                                  className={`${state.activeSubmenu === data.title ? "mm-active" : ""}`}
                                >
                                  {data.content && data.content.length > 0 ?
                                    <>
                                      <NavLink to={data.to} className={data.hasMenu ? 'has-arrow' : ''}
                                      >
                                        {data.title}
                                      </NavLink>
                                      <Collapse in={state.activeSubmenu === data.title ? true : false}>
                                        <ul className={`${menuClass === "mm-collapse" ? "mm-show" : ""}`}>
                                          {data.content && data.content.map((data, index) => {
                                            return (
                                              <>
                                                <li key={index}>
                                                  <Link className={`${path === data.to ? "mm-active" : ""}`} to={`data.to/:${data.content.p}`}>{data.title}</Link>
                                                </li>
                                              </>
                                            )
                                          })}
                                        </ul>
                                      </Collapse>
                                    </>
                                    :
                                    <Link to={data.to}>
                                      {data.title}
                                    </Link>
                                  }

                                </li>

                              )
                            })}
                          </ul>
                        </Collapse>
                      </>
                      :
                      <NavLink to={data.to}>
                        {data.iconStyle}
                        <span className="nav-text">{data.title}</span>
                      </NavLink>
                    }
                  </li>
                )
              }
            })

          }
          {userType === "admin" && superAdmin && (
            AdminMenuList.map((data, index) => {
              let menuClass = data.classsChange;
              if (menuClass === "menu-title") {
                return (
                  <Link to={data.to} key={index}>
                    <li className={menuClass}>{data.title}</li>
                  </Link>
                )
              } else {
                return (
                  <li className={` ${state.active === data.title ? 'mm-active' : ''}`}
                    key={index}
                    style={{ backgroundColor: path === data.to ? 'black' : '' }}
                    onClick={() => handleMenuActive(data.title)}
                  >
                    {data.content && data.content.length > 0 ?
                      <>
                        <Link to={"#"} className="has-arrow">
                          {data.iconStyle}
                          <span className="nav-text">{data.title}</span>
                        </Link>
                        <Collapse in={state.active === data.title}>
                          <ul className={`${menuClass === "mm-collapse" ? "mm-show" : ""}`}>
                            {data.content.map((subData, subIndex) => (
                              <li key={subIndex} className={`${state.activeSubmenu === subData.title ? "mm-active" : ""}`}>
                                {subData.content && subData.content.length > 0 ?
                                  <>
                                    <NavLink to={subData.to} className={subData.hasMenu ? 'has-arrow' : ''}>
                                      {subData.title}
                                    </NavLink>
                                    <Collapse in={state.activeSubmenu === subData.title}>
                                      <ul className={`${menuClass === "mm-collapse" ? "mm-show" : ""}`}>
                                        {subData.content.map((innerData, innerIndex) => (
                                          <li key={innerIndex}>
                                            <Link className={`${path === innerData.to ? "mm-active" : ""}`} to={`data.to/:${innerData.content.p}`}>{innerData.title}</Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </Collapse>
                                  </>
                                  :
                                  <Link to={subData.to}>{subData.title}</Link>
                                }
                              </li>
                            ))}
                          </ul>
                        </Collapse>
                      </>
                      :
                      <NavLink to={data.to}>
                        {data.iconStyle}
                        <span className="nav-text">{data.title}</span>
                      </NavLink>
                    }
                  </li>
                )
              }
            })
          )}
          {(!superAdmin && userType === "admin") && (
            AdminMenuList2.map((data, index) => {
              let menuClass = data.classsChange;
              if (menuClass === "menu-title") {
                return (
                  <Link to={data.to} key={index}>
                    <li className={menuClass}>{data.title}</li>
                  </Link>
                )
              } else {
                return (
                  <li className={` ${state.active === data.title ? 'mm-active' : ''}`}
                    key={index}
                    style={{ backgroundColor: path === data.to ? 'black' : '' }}
                    onClick={() => handleMenuActive(data.title)}
                  >
                    {data.content && data.content.length > 0 ?
                      <>
                        <Link to={"#"} className="has-arrow">
                          {data.iconStyle}
                          <span className="nav-text">{data.title}</span>
                        </Link>
                        <Collapse in={state.active === data.title}>
                          <ul className={`${menuClass === "mm-collapse" ? "mm-show" : ""}`}>
                            {data.content.map((subData, subIndex) => (
                              <li key={subIndex} className={`${state.activeSubmenu === subData.title ? "mm-active" : ""}`}>
                                {subData.content && subData.content.length > 0 ?
                                  <>
                                    <NavLink to={subData.to} className={subData.hasMenu ? 'has-arrow' : ''}>
                                      {subData.title}
                                    </NavLink>
                                    <Collapse in={state.activeSubmenu === subData.title}>
                                      <ul className={`${menuClass === "mm-collapse" ? "mm-show" : ""}`}>
                                        {subData.content.map((innerData, innerIndex) => (
                                          <li key={innerIndex}>
                                            <Link className={`${path === innerData.to ? "mm-active" : ""}`} to={`data.to/:${innerData.content.p}`}>{innerData.title}</Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </Collapse>
                                  </>
                                  :
                                  <Link to={subData.to}>{subData.title}</Link>
                                }
                              </li>
                            ))}
                          </ul>
                        </Collapse>
                      </>
                      :
                      <NavLink to={data.to}>
                        {data.iconStyle}
                        <span className="nav-text">{data.title}</span>
                      </NavLink>
                    }
                  </li>
                )
              }
            })
          )}
        </ul>
      </PerfectScrollbar>
    </div>
  );
};

export default SideBar;
