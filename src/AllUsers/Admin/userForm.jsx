/* eslint-disable */
import React, { useState } from 'react';
import ToggleSwitch from '../../jsx/components/toggleSwitch';
// Row component to render each form field
const FormRow = ({ label, name, value, onChange }) => (
    <div className="mb-3 col-6">
        <label htmlFor={name} className="form-label">{label}</label>
        <input
            type="text"
            className="form-control"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
        />
    </div>
);

const UserForm = ({ user, onSubmit, userResetPassword }) => {
    const [formData, setFormData] = useState(user || {}); // Initialize with an empty object if user is undefined or null

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!user) return null; // Return null if user is undefined or null

    return (
        <form>
            <div className="row">
                {Object.entries(user).map(([key, value]) => {
                    if (key === 'can_auto_trade' || key === 'verified' || key === 'is_active') {
                        return (
                            <div key={key} className="mb-3 col-6">
                                <label htmlFor={key.replace(/_/g, ' ')} className="form-label">{key.replace(/_/g, ' ')}</label>
                                <ToggleSwitch
                                    checked={value}
                                    onChange={(newValue) => setFormData({ ...formData, [key]: newValue })}
                                />
                            </div>
                        );
                    } else if (key === 'date_of_birth') {
                        return (
                            <div key={key} className="mb-3 col-6">
                                <label htmlFor={key.replace(/_/g, ' ')} className="form-label">{key.replace(/_/g, ' ')}</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id={key}
                                    name={key}
                                    value={value}
                                    onChange={handleChange}
                                />
                            </div>
                        );
                    } else if (key === 'auto_trade_count' || key === 'id' || key === 'user_type' || key === 'assigned_to' || key === 'date_of_birth') {
                        // Exclude keys like "id", "auto_trade_count", and "assigned_to"
                        return null;
                    }
                     else {
                        return (
                            <FormRow
                                key={key}
                                label={key.replace(/_/g, ' ')}
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                            />
                        );
                    }
                })}
            </div>
            <button onClick={handleSubmit} className="btn btn-primary">Save Changes</button>
            <button className="btn btn-primary" style={{ marginLeft: "20px" }} onClick={(e) => { e.preventDefault(); userResetPassword() }}>Reset User password</button>
        </form>

    );
};

export default UserForm;
