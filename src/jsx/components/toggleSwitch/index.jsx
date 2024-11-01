import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';

const ToggleSwitch = ({ checked, onChange, disabled, onLabel, offLabel }) => {
    const [isChecked, setIsChecked] = useState(checked);

    const handleToggle = () => {
        if (!disabled) {
            const newValue = !isChecked;
            setIsChecked(newValue);
            if (onChange) {
                onChange(newValue);
            }
        }
    };

    return (
        <div className="toggle-switch">
            <Form.Check
                type="switch"
                id="custom-switch"
                label=""
                checked={isChecked}
                onChange={handleToggle}
                disabled={disabled}
            />
            <label className="toggle-switch-label">
                <span className={`toggle-switch-inner ${isChecked ? 'checked' : ''}`}>
                    {isChecked ? onLabel : offLabel}
                </span>
                <span className="toggle-switch-switch" />
            </label>
        </div>
    );
};

ToggleSwitch.propTypes = {
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    onLabel: PropTypes.string,
    offLabel: PropTypes.string,
};

ToggleSwitch.defaultProps = {
    disabled: false,
    onLabel: 'ON',
    offLabel: 'OFF',
};

export default ToggleSwitch;
