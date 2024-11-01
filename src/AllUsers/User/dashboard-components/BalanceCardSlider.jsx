import React from 'react';
import "swiper/css";
import TotalBalanceArea from './TotalBalanceArea';
import ProfitLossArea from './ProfitLossArea';
import { Swiper, SwiperSlide,  } from "swiper/react";
import TotaldipositChart from './TotaldipositChart';
import { useSelector } from 'react-redux';
import { useResponsive } from '../../../redux-contexts/context/responsive';

const BalanceCardSlider = ({ accountData }) => {
    const { isMobile, isTablet } = useResponsive();
    const { referral_balance, main_balance, bonus_balance } = useSelector(state => state.userAccount || {});

    const slidesData = [
        {
            countNum: `$ ${main_balance || (accountData && accountData.main_balance) || "***"}`,
            title: "Main Balance",
            info: "0",
            chartComponent: <TotalBalanceArea />
        },
        {
            countNum: `$ ${referral_balance || (accountData && accountData.referral_balance) || "***"}`,
            title: "Referral Balance",
            info: "",
            chartComponent: <ProfitLossArea />
        },
        {
            countNum: `$ ${bonus_balance || (accountData && accountData.bonus_balance) || "***"}`,
            title: "Bonuses",
            chartComponent: <TotaldipositChart />
        }
    ];

    return (
        <div className='row overflow-auto' style={{padding: isMobile ? "20px" : ""}}>
              <Swiper className="mySwiper"						
				speed= {1500}
				slidesPerView={isTablet ? (isMobile ? 0.5 : 1.5) : 3}
				spaceBetween= {1}
				loop={false}
				//autoplay= {{
				   //delay: 1200,
				//}}
				//modules={[ Autoplay ]}
				breakpoints = {{
					  300: {
						slidesPerView: 1,
						spaceBetween: 30,
					  },
					  416: {
						slidesPerView: 1,
						spaceBetween: 30,
					  },
					   768: {
						slidesPerView: 1,
						spaceBetween: 30,
					  },
					   1200: {
						slidesPerView: 3,
						spaceBetween: 10,
					  },
					  1788: {
						slidesPerView: 3,
						spaceBetween: 10,
					  },
				}}>
                {slidesData.map((slide, index) => (
                    <SwiperSlide  key={index}>
                        <div key={index} className="" style={{paddingLeft: '20px', paddingRight: '20px'}}>
                            <div className="card-wiget" style={{backgroundColor: 'rgba(243, 243, 243, 0.04)', borderRadius: '20px', height: '200px'}}>
                                <div className="card-body">
                                    <div className="card-wiget-info">
                                        <h4 className="count-num">{slide.countNum}</h4>
                                        <p>{slide.title}</p>
                                        {slide.info && (
                                            <div>
                                                <span className="text-success" style={{ opacity: 0 }}>{slide.info}</span>
                                            </div>
                                        )}
                                    </div>
                                    {slide.chartComponent}
                                </div>
                                <div className="back-icon"></div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
                </Swiper>
        </div>
    );
}
export default BalanceCardSlider;
