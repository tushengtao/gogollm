import React, { useState, useEffect, useRef } from 'react';
import { Button, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './css/SpeedDial.less';

interface Action {
    icon: React.ReactNode;
    name: string;
    onClick: () => void;
    angle: number;
}

const SpeedDial: React.FC<{ actions: Action[] }> = ({ actions }) => {
    const [open, setOpen] = useState(false);
    const speedDialRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => {
        setOpen(!open);
    };

    // 修改类型为 (event: MouseEvent) => void
    const handleGlobalClick = (event: MouseEvent) => {
        if (speedDialRef.current && !speedDialRef.current.contains(event.target as HTMLElement)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        if (open) {
            document.addEventListener('click', handleGlobalClick);
        }

        return () => {
            document.removeEventListener('click', handleGlobalClick);
        };
    }, [open]);

    return (
        <div className="speed-dial-container" ref={speedDialRef}>
            {actions.map((action, index) => (
                <Tooltip title={action.name} key={index}>
                    <Button
                        shape="circle"
                        icon={action.icon}
                        onClick={action.onClick}
                        className={`speed-dial-action ${open ? 'open' : ''}`}
                        style={{ transform: open ? `rotate(${action.angle}deg) translate(-60px) rotate(-${action.angle}deg)` : 'none' }}
                    />
                </Tooltip>
            ))}
            <Button
                type="dashed"
                shape="circle"
                icon={<PlusOutlined />}
                onClick={handleToggle}
                className="speed-dial-main"
            />
        </div>
    );
};

export default SpeedDial;
