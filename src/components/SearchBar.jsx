import React, { useState } from "react";

export default function SearchBar({onSearch, setCode}) {
  const [city, setCity] = useState("");
/*   const handleClick = (apiResponse) => {
    // Some API call returning the actual code value here //
    setCode(apiResponse)
  }
   */
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSearch(city);
      setCity("");
    }}>
      <input
        type="text"
        placeholder="Ciudad..."
        value={city}
        onChange={e => setCity(e.target.value)}
      />
   {/*    <input type="submit" value="Agregar" />
      <input
      onClick={() => handleClick("01n")}
      type="button"
      value="Change city"
    /> */}
    </form>
  );
}
