import { React, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

function SearchBar(props) {
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [filteredBreeds, setFilteredBreeds] = useState([]);
  const breedRef = useRef();
  const navigate = useNavigate();

  // Gets list of available breeds for filtering purposes
  useEffect(() => {
    const fetchBreeds = async () => {
      const breedRequest = new Request(
        "https://frontend-take-home-service.fetch.com/dogs/breeds",
        {
          method: "GET",
          credentials: "include",
          headers: new Headers({
            "Content-Type": "application/json",
            Accept: "application/json",
          }),
        }
      );

      try {
        const response = await fetch(breedRequest);
        const result = await response.json();
        console.log("breeds:", result);
        breedRef.current = result;
      } catch (error) {
        console.error("Error Fetching Breeds", error);
        showTimeOutAlert();
      }
    };
    fetchBreeds();
  }, []);

  // If user's auth cookie has expired prior to selecting an action, alert the user and send back to login screen
  const showTimeOutAlert = () => {
    window.alert("Your Session Has Timed Out! Please Log In Again.");
    navigate("/login");
  };

  // Toggles filterMenuVisible state to show the filtering menu
  const callFilterMenu = () => {
    setFilterMenuVisible(!filterMenuVisible);
  };

  // When the user selects a breed, add to the filteredBreeds array
  const addBreedToFilter = (breedToAdd) => {
    if (filteredBreeds[0] === null) {
      setFilteredBreeds([breedToAdd]);
    } else {
      let combinedList = [...filteredBreeds, breedToAdd];
      setFilteredBreeds(combinedList);
    }
  };

  // When user de-selects a breed. remove from the filteredBreeds array
  const removeBreedFromFilter = (breedToRemove) => {
    const newFilterList = filteredBreeds.filter(
      (item) => item !== breedToRemove
    );
    setFilteredBreeds(newFilterList);
  };

  // Logic for when the user applies their breed filters (by clicking the "Apply" button)
  const onClickApply = () => {
    let queryString = "";
    for (let i = 0; i < filteredBreeds.length; i++) {
      queryString += "breeds=" + filteredBreeds[i] + "&";
    }
    props.filteredDogs(queryString);
    setFilterMenuVisible(false);
  };

  const onClickClearFilters = () => {
    setFilteredBreeds([]);
  };

  const swapSortOrder = () => {
    props.sortOrder();
  };

  return (
    <>
      <div className="search">
        <div className="search-container">
          <div className="filter-flex-row">
            <button className="filter-btn" onClick={() => callFilterMenu()}>
              Filter By Breed
            </button>
          </div>
          <span className="welcome-msg">Welcome {props.name}!</span>
          <button
            title="Switch Sort Order"
            className="filter-btn filter-btn-sort"
            onClick={() => swapSortOrder()}
          >
            Sort Order: {props.sortOrderVal}
          </button>
        </div>

        {filterMenuVisible && (
          <div>
            <div className="filter-top-section bg-primary">
              <button className="filter-btn" onClick={() => onClickApply()}>
                Apply
              </button>
              <button
                className="filter-btn"
                onClick={() => onClickClearFilters()}
              >
                Clear All Filters
              </button>
            </div>
            <br />
            <br />
            <div className="filter-body">
              <div className="breed-buttons">
                {breedRef.current.map((item, index) => (
                  <ul key={index}>
                    {!filteredBreeds.includes(item) ? (
                      <button
                        className="breed-choice-box-unselected"
                        onClick={() => addBreedToFilter(item)}
                      >
                        {item}
                      </button>
                    ) : (
                      <button
                        className="breed-choice-box-selected"
                        onClick={() => removeBreedFromFilter(item)}
                      >
                        {item}
                      </button>
                    )}
                  </ul>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default SearchBar;
