import React, { useState } from "react";
import "./Search.css";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
export default function SearchBar({ onSearch, setCode, city }) {
  const [Gcity, setCity] = useState("");
  /*   const handleClick = (apiResponse) => {
    // Some API call returning the actual code value here //
    setCode(apiResponse)
  }
   */
  //
  const history = useHistory();
  const { id } = useParams();

  return (
    <div className="wrap">
    <form className="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(Gcity);
        
        setCity("");
        history.push("/")
      }}
    >
      <input
      className="searchTerm"
        type="text"
        placeholder="Where would you like to go?..."
        value={Gcity}
        onChange={(e) => setCity(e.target.value)}
      />
      <input className="searchButton" type="submit" value="Let's Go!" />
      
      {/*    <input type="submit" value="Agregar" />
      <input
      onClick={() => handleClick("01n")}
      type="button"
      value="Change city"
    /> */}
    </form>
    </div>
  );
}
