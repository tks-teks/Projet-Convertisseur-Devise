import React from "react";
import "./Devise_Selectionner.css";

const Devise_Selectionner = ({ label, currency, currencies, onChange }) => {
  return (
    <div className="currency-select-container">
      <label className="currency-label">{label}</label>
      <select
        className="currency-select"
        value={currency}
        onChange={(e) => onChange(e.target.value)}
      >
        {currencies.map((curr) => (
          <option key={curr[0]} value={curr[0]}>
            {curr[0]} - {curr[1]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Devise_Selectionner;