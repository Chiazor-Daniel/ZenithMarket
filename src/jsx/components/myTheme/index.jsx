import React, { useState } from 'react';
import { GiFairyWand } from "react-icons/gi";
import { useContext } from 'react';
import { ThemeContext } from '../../../redux-contexts/context/ThemeContext';

const MyTheme = () => {
    const { setDemoTheme } = useContext(ThemeContext);
    const [rotation, setRotation] = useState(0);

    const handleClick = () => {
        setRotation(rotation + 360);
        const randomThemeIndex = Math.floor(Math.random() * 9);
        console.log("theme", randomThemeIndex)
        setTimeout(() => {
            setDemoTheme(randomThemeIndex, 'ltr');
        }, 220); // Delay the function execution by 600ms (0.6 seconds)
    };

    return (
        <div
            style={{
                padding: "13px",
                backgroundColor: "lightgray",
                borderRadius: "100%",
                cursor: "pointer",
                transition: "transform 1s ease-in-out",
                transform: `rotate(${rotation}deg)`,
                boxShadow: '0px 0px 12px gray'
            }}
            onClick={handleClick}
        >
            <GiFairyWand size={30} color="black" />
        </div>
    );
};

export default MyTheme;
