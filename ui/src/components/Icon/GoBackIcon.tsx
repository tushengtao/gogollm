import React, { useState } from 'react';

const GoBackIcon = () => {
    const [fillColor, setFillColor] = useState('#54799C'); // 初始颜色

    const handleMouseEnter = () => {
        setFillColor('#1890ff'); // Ant Design 的主要蓝色
    };

    const handleMouseLeave = () => {
        setFillColor('#1F1F1F'); // 恢复为初始颜色
    };

    return (
        <svg   onMouseEnter={handleMouseEnter}
               onMouseLeave={handleMouseLeave} className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
            <path
                d="M209.92 988.16c-15.36 0-30.72-15.36-30.72-30.72s15.36-30.72 30.72-30.72h471.04c153.6 0 281.6-128 281.6-281.6s-128-281.6-281.6-281.6H102.4l220.16 220.16c5.12 5.12 10.24 10.24 10.24 20.48 0 5.12-5.12 15.36-10.24 20.48-5.12 5.12-10.24 10.24-20.48 10.24-5.12 0-15.36-5.12-20.48-10.24L10.24 353.28c-5.12-5.12-10.24-10.24-10.24-20.48 0-5.12 5.12-15.36 10.24-20.48L281.6 40.96c5.12-5.12 10.24-10.24 20.48-10.24 5.12 0 15.36 5.12 20.48 10.24 0 10.24 5.12 15.36 5.12 25.6 0 5.12-5.12 15.36-10.24 20.48L97.28 307.2h583.68a343.04 343.04 0 0 1 0 686.08H209.92z"
                fill={fillColor}

            />
        </svg>
    );
};

export default GoBackIcon;