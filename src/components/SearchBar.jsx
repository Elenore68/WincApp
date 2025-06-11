import React from 'react';
import { IoSearchOutline } from "react-icons/io5";
import '../Auth.css';

const SearchBar = ({ onSearch, value, onChange, placeholder = "Search" }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(value);
    }
  };

  return (
    <div className="search-bar-container">
      <IoSearchOutline className="search-icon" size={20} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;
