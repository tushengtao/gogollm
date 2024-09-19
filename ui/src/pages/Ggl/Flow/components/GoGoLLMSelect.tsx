import React, { useState, useRef, useEffect } from 'react';
import "./css/GoGoLLMSelect.less"

interface GoGoLLMSelectProps {
    width?: number;
    options: Array<{ label: string; value: any }>;
    placeholder?: string;
    defaultValue?: any;
    onChange: (label: string, value: any) => void;
    isMultifun?: boolean;
}

const GoGoLLMSelect: React.FC<GoGoLLMSelectProps> = ({ width, options, placeholder, defaultValue, onChange, isMultifun = true}) => {
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(defaultValue);
    const [inputValue, setInputValue] = useState('');
    const [filteredOptions, setFilteredOptions] = useState(options);
    const selectRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<HTMLUListElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleToggle = () => {
        setOpen(!open);
    };

    const handleSelect = (label: string, value: any) => {
        setSelectedValue(value);
        onChange(label, value);
        setOpen(false);
    };

    const handleWheel = (event: React.WheelEvent<HTMLUListElement>) => {
        const container = optionsRef.current;
        if (container) {
            container.scrollTop += event.deltaY;
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);
        setFilteredOptions(options.filter((option) => option.label.toLowerCase().includes(value.toLowerCase())));
    };

    const handleInputBlur = () => {
        if (!options.some((option) => option.value === inputValue) && inputValue !== '') {
            setSelectedValue(inputValue);
            onChange(inputValue, inputValue);
        }
        setInputValue('');
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleInputBlur();
        }
    };

    const handleClickInside = (event: React.MouseEvent) => {
        event.stopPropagation(); // 阻止事件冒泡
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    return (
        <div style={{ width: width || 300, height: 35 }} tabIndex={0} ref={selectRef} className="custom-select" onClick={handleToggle}>
            <div className="selected-value" style={{ fontWeight: "540", fontSize: "14px" }}>
                {selectedValue ? options.find((option) => option.value === selectedValue)?.label || selectedValue : placeholder || '选择LLM'}
            </div>
            {open && (
                <ul className="options" onWheel={handleWheel} ref={optionsRef} style={{ fontWeight: "500", fontSize: "14px" }}>
                    {isMultifun && ( <li key="input-option" className="option" onClick={handleClickInside}>
                            <input
                                className="custom-option-input"
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                onBlur={handleInputBlur}
                                onKeyDown={handleKeyDown}
                                placeholder="支持自定义输入&搜索，回车确定"
                                style={{ width: '100%'}}
                            />
                        </li>
                    )}
                    {filteredOptions.map((option, index) => (
                        <li
                            key={index}
                            className="option"
                            onClick={() => handleSelect(option.label, option.value)}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default GoGoLLMSelect;
