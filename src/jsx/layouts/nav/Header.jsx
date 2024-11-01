/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Button, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import LogoutPage from './Logout';
import { ThemeContext } from "../../../redux-contexts/context/ThemeContext";
import { useContext } from "react";
import avatar from "../../../assets/images/avatar/1.jpg";
import ToggleTheme from "../../components/toggleTheme/index.";
import { useNavigate } from "react-router-dom";
import { CiBellOn } from "react-icons/ci";
import { useSelector } from "react-redux";
import { TbDoorEnter } from "react-icons/tb";
import { FaCircle } from "react-icons/fa6";
import Avatar from "react-avatar";
import { BsMagic } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import MyTheme from "../../components/myTheme";
import { useResponsive } from "../../../redux-contexts/context/responsive";

const Header = ({ onNote, onThemeChange, userType, superAdmin, asAdmin, setAsAdmin, setUserType }) => {
	const navigate = useNavigate()
	const { isMobile } = useResponsive()
	const [rightSelect, setRightSelect] = useState('Eng');
	const { loading, userInfo, userToken, error, success } = useSelector(state => state.auth);
	const { referral_balance, main_balance, bonus_balance } = useSelector(state => state.userAccount || {});
	const [isDark, setDark] = useState(true);
	const { changeBackground } = useContext(ThemeContext);
	const [seeBal, setSeeBal] = useState(false)
	const [headerFix, setheaderFix] = useState(false);
	useEffect(() => {
		changeBackground({ value: "dark", label: "dark" })
	}, [isDark])
	useEffect(() => {
		window.addEventListener("scroll", () => {
			setheaderFix(window.scrollY > 50);
		});
	}, []);
	const handleThemeChange = (newTheme) => {
		setDark(newTheme);
		onThemeChange(newTheme);
	};

	var path = window.location.pathname.split("/");
	return (
		<div className={`header ${headerFix ? "is-fixed" : ""}`} style={{ backgroundColor: 'transparent', paddingTop: '10px' }}>
			{
				userType === "user" && (
					<div className="header-content" >
						<nav className="navbar navbar-expand">
							<div className="collapse navbar-collapse justify-content-between">
								<div className="" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '', width: '100%' }}>
									<div>
										<p style={{ margin: 'auto', fontSize: '1.4rem', color: 'white' }}>Finnovent Capitals</p>
									</div>
									{
										!isMobile && (
									<div
										// className="dashboard_bar"
										style={{ textTransform: "capitalize", display: "flex", alignItems: "center", gap: "20px" }}
									>

										<div style={{ display: 'flex', flexDirection: 'column', alignItems: '', justifyContent: 'space-between', backgroundColor: '' }}>
											<div>
												Total Balance
											</div>
											<div style={{ fontSize: '1.3rem', fontWeight: '400', color: 'white', fontFamily: 'monospace', display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
												<span>
												{
													seeBal ? (
														`${referral_balance + main_balance + bonus_balance}`
													): (
														"******"
													)
												}
												</span>
												<div>
													{
														seeBal ? (
															<FaEyeSlash onClick={()=>setSeeBal(!seeBal)}/>
															) : (
																<FaEye style={{margin: 'auto', cursor: 'pointer'}}  onClick={()=>setSeeBal(!seeBal)}/>
															)
													}

												</div>
											</div>

										</div>
										<div>
											<CiBellOn size={30} />
										</div>
										<Dropdown as="li" className="nav-item dropdown header-profile">
											<Dropdown.Toggle variant="" as="a" className="nav-link i-false c-pointer">

												<Avatar name={userInfo.first_name + " " + userInfo.last_name} size={40} round />
											</Dropdown.Toggle>
											<Dropdown.Menu align="right" className="dropdown-menu dropdown-menu-end">
												<Link to="/dashboard/profile" className="dropdown-item ai-icon">
													<svg id="icon-user1" xmlns="http://www.w3.org/2000/svg" className="text-primary me-1" width={18} height={18} viewBox="0 0 24 24" fill="none"
														stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
													>
														<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
														<circle cx={12} cy={7} r={4} />
													</svg>
													<span className="ms-2">Profile</span>
												</Link>

												<LogoutPage userType={userType} />
											</Dropdown.Menu>
										</Dropdown>
										<p style={{ fontSize: '1.3rem', margin: 'auto' }}>
											{userInfo.first_name + " " + userInfo.last_name}
										</p>
									</div>

										)
									}
								</div>
							</div>
						</nav>
						{
							asAdmin && (
								<Button style={{ width: "350px", marginRight: "20px", display: "flex", alignItems: "center", gap: "20px", marginLeft: '20px' }} onClick={() => {
									setAsAdmin(false);
									navigate("/admin/admin-dashboard");
									setUserType("admin");
									sessionStorage.removeItem('userToken');
									sessionStorage.removeItem('userInfo');
								}}
								><TbDoorEnter size={25} color="white" /><span>Admin Dashboard</span></Button>

							)
						}

						{/* <MyTheme /> */}

						{/* <ToggleTheme
							isDark={isDark}
							invertedIconLogic
							onChange={() => { setDark((prev) => !prev); onThemeChange(isDark) }}
						/> */}


					</div>
				)
			}
			{
				userType == "admin" && (
					<div className="header-content" >
						<nav className="navbar navbar-expand">
							<div className="collapse navbar-collapse justify-content-between">
								<div className="header-left">
									<div
										className="dashboard_bar"
										style={{ textTransform: "capitalize", display: "flex", alignItems: "center", gap: "20px" }}
									>
										{
											superAdmin ? "Super Admin" : "Admin"
										}
									</div>
								</div>
							</div>
						</nav>


						{/* <MyTheme /> */}
						{/* <ToggleTheme
							isDark={isDark}
							invertedIconLogic
							onChange={() => { setDark((prev) => !prev); onThemeChange(isDark) }}
						/> */}
						<Dropdown as="li" className="nav-item dropdown header-profile">
							<Dropdown.Toggle variant="" as="a" className="nav-link i-false c-pointer">
								<Avatar name={"A" + " " + "D"} size={50} round />
							</Dropdown.Toggle>
							<Dropdown.Menu align="right" className="dropdown-menu dropdown-menu-end">
								<Link to="/admin/admin-dashboard/profile" className="dropdown-item ai-icon">
									<svg id="icon-user1" xmlns="http://www.w3.org/2000/svg" className="text-primary me-1" width={18} height={18} viewBox="0 0 24 24" fill="none"
										stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
									>
										<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
										<circle cx={12} cy={7} r={4} />
									</svg>
									<span className="ms-2">Profile</span>
								</Link>
								<LogoutPage userType={userType} />
							</Dropdown.Menu>
						</Dropdown>
					</div>
				)
			}
		</div>
	);
};

export default Header;
