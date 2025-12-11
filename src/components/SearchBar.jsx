import React, { useState, useEffect, useRef } from "react";
import "./Search.css";
import { useHistory } from "react-router-dom";
import { COMMON_CITIES } from "../utils/commonCities";

export default function SearchBar({ onSearch }) {
  const [term, setTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);
  const history = useHistory();

  // Handle outside click to close suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleChange = (e) => {
    const value = e.target.value;
    setTerm(value);

    if (value.length > 1) {
      const filtered = COMMON_CITIES.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 10)); // Limit to 10
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting search:", term);
    if (term.trim()) {
      onSearch(term);
      setTerm("");
      setShowSuggestions(false);
      history.push("/");
    }
  };

  const handleSuggestionClick = (city) => {
    console.log("Suggestion clicked:", city); // Debug log
    onSearch(city);
    setTerm("");
    setShowSuggestions(false);
    history.push("/");
  };

  return (
    <div className="wrap" ref={wrapperRef}>
      <form className="search" onSubmit={handleSubmit}>
        <input
          className="searchTerm"
          type="text"
          placeholder="Buscar ciudad..."
          value={term}
          onChange={handleChange}
          onFocus={() => term.length > 1 && setShowSuggestions(true)}
        />
        <button className="searchButton" type="submit">Ir</button>
      </form>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((city, index) => (
            <li
              key={index}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(city)}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
