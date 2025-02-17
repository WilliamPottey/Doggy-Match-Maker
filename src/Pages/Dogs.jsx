import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Dogs.css";
import DogCard from "../Components/DogCard";
import NavBar from "../Components/Navbar";
import SearchBar from "../Components/SearchBar";
import MatchBox from "../Components/MatchBox";

function Dogs() {
  const [dogs, setDogs] = useState(null); // stores current list of Dog Objects to display
  const [favDogs, setFavDogs] = useState(null); // stores list of favorite dog objects
  const [favorites, setFavorites] = useState([]); // stores list of favorited dog ids for match making
  const [match, setMatch] = useState(null); // Stores the dog object of the Match found
  const [isPrevDisabled, setIsPrevDisabled] = useState(true); // Flag for showing the previous page button
  const [isNextDisabled, setIsNextDisabled] = useState(false); // flag for showing the next page button
  const [currentFilter, setCurrentFilter] = useState("");
  const [showOnlyFavs, setShowOnlyFavs] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const resultIdsRef = useRef(); // stores current list of Dog Ids
  const nextRef = useRef(); // stores suffix of API URL for next page of Dogs
  const prevRef = useRef(); // stores suffix of API URL for previous page of Dogs
  const sortDirectionRef = useRef("asc"); // stores the current sort direction, either "asc" for ascending or "desc" for descending

  const initialDogRequest_1 = new Request(
    `https://frontend-take-home-service.fetch.com/dogs/search?sort=breed:${sortDirectionRef.current}`,
    {
      method: "GET",
      credentials: "include",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
    }
  );

  // This is the request to get the array of dog IDs and the next/prev link
  const onEnter = async () => {
    try {
      const response = await fetch(initialDogRequest_1);
      const result = await response.json();
      resultIdsRef.current = result.resultIds;
      nextRef.current = result.next;
      prevRef.current = result.prev;
    } catch (error) {
      console.error("Error:", error);
      showTimeOutAlert();
    }

    // After getting the array of Ids, use that information to get array of Dog Objects for display purposes
    fetchDogObjects(resultIdsRef.current);
  };

  useEffect(() => {
    onEnter();
  }, []);

  // If user starts over after finding a match, reset fav and match states and reset Auth Cookie
  const resetAll = () => {
    setFavDogs(null);
    setFavorites([]);
    setMatch(null);
    setShowOnlyFavs(false);
    resetAuthCookie(location.state.name, location.state.email);
  };

  const resetAuthCookie = async (name, email) => {
    const loginRequest = new Request(
      "https://frontend-take-home-service.fetch.com/auth/login",
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ name: name, email: email }),
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
        }),
      }
    );
    return fetch(loginRequest);
  };

  // When the user selects the "Next" button, fetch data to display the next page of Dogs
  const getNextPageData = async () => {
    const nextPageRequest = new Request(
      `https://frontend-take-home-service.fetch.com${nextRef.current}`,
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
      const response = await fetch(nextPageRequest);
      const result = await response.json();
      resultIdsRef.current = result.resultIds;
      nextRef.current = result.next;
      prevRef.current = result.prev;
      fetchDogObjects(resultIdsRef.current);
      checkForNextRef();
      checkForPrevRef();
      window.scrollTo({ top: 0, behavior: "instant" });
    } catch {
      console.error("Error: Failed to get Next page");
      showTimeOutAlert();
    }
  };

  // When the user selects the "Previous" button, fetch data to display the previous page of Dogs
  const getPreviousPageData = async () => {
    const prevPageRequest = new Request(
      `https://frontend-take-home-service.fetch.com${prevRef.current}`,
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
      const response = await fetch(prevPageRequest);
      const result = await response.json();
      resultIdsRef.current = result.resultIds;
      nextRef.current = result.next;
      prevRef.current = result.prev;
      fetchDogObjects(resultIdsRef.current);
      checkForNextRef();
      checkForPrevRef();
      window.scrollTo({ top: 0, behavior: "instant" });
    } catch {
      console.error("Error: Failed to get Previous page");
      showTimeOutAlert();
    }
  };

  // gets list of dog objects based on the list of dog Ids previously retrieved
  const fetchDogObjects = async (dogsToFetch, calledFrom) => {
    const dogObjectRequest = new Request(
      "https://frontend-take-home-service.fetch.com/dogs",
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(dogsToFetch),
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
        }),
      }
    );

    try {
      const response = await fetch(dogObjectRequest);
      const result = await response.json();
      if (calledFrom === "fav") {
        setFavDogs(result);
      } else if (calledFrom === "match") {
        setMatch(result);
      } else {
        setDogs(result);
      }
    } catch (error) {
      console.error("Error:", error);
      showTimeOutAlert();
    }
  };

  // Adds a 'hearted' dog id to the user's list of favorite dogs used for match making
  const addToFavorites = (dogToAdd) => {
    if (favorites.length === 0) {
      setFavorites([dogToAdd]);
      return;
    }
    setFavorites([...favorites, dogToAdd]);
  };

  // Removes teh dog id of a dog that the user 'unhearted'
  const removeFromFavorites = (dogToRemove) => {
    const newFavoriteList = favorites.filter((item) => item !== dogToRemove);
    setFavorites(newFavoriteList);
  };

  // After the user selects "Apply" when filtering by breed, refresh DogCards with filtered dogs
  const getFilteredDogs = async (filterString) => {
    setCurrentFilter(filterString);
    const filteredDogRequest = new Request(
      `https://frontend-take-home-service.fetch.com/dogs/search?sort=breed:${sortDirectionRef.current}&${filterString}`,
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
      const response = await fetch(filteredDogRequest);
      const result = await response.json();
      resultIdsRef.current = result.resultIds;
      nextRef.current = result.next;
      prevRef.current = result.prev;
      fetchDogObjects(resultIdsRef.current);
      checkForNextRef();
      checkForPrevRef();
      window.scrollTo({ top: 0, behavior: "instant" });
    } catch {
      console.error("Error: Failed to get Filtered Dogs");
      showTimeOutAlert();
    }
  };

  // Checks if there is an availabke previous page to show the "Previous Page" Button
  const checkForPrevRef = () => {
    if (prevRef.current) {
      setIsPrevDisabled(false);
    } else {
      setIsPrevDisabled(true);
    }
  };

  // Checks if there is an available next page to show the "Next Page" Button
  const checkForNextRef = async () => {
    const nextPageRequest = new Request(
      `https://frontend-take-home-service.fetch.com${nextRef.current}`,
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
      const response = await fetch(nextPageRequest);
      const result = await response.json();
      if (result.resultIds.length === 0) {
        setIsNextDisabled(true);
      } else {
        setIsNextDisabled(false);
      }
    } catch {
      console.error("Error: Failed to get Next page");
      showTimeOutAlert();
    }
  };

  // Swaps between Ascending and Descending Breed Sort Order, then reloads the DogCards based on that sort order
  // Side effect is that the user is borught back to page 1
  const swapSortOrder = async () => {
    if (sortDirectionRef.current === "asc") {
      sortDirectionRef.current = "desc";
    } else if (sortDirectionRef.current === "desc") {
      sortDirectionRef.current = "asc";
    }
    const sortedDogRequest = new Request(
      `https://frontend-take-home-service.fetch.com/dogs/search?sort=breed:${sortDirectionRef.current}&${currentFilter}`,
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
      const response = await fetch(sortedDogRequest);
      const result = await response.json();
      resultIdsRef.current = result.resultIds;
      nextRef.current = result.next;
      prevRef.current = result.prev;
      fetchDogObjects(resultIdsRef.current);
      checkForNextRef();
      checkForPrevRef();
      window.scrollTo({ top: 0, behavior: "instant" });
    } catch {
      showTimeOutAlert();
    }
  };

  // Using the array of favorite dogs selected, pulls the dog ID of one of your favorites as a Match and stores it in the match state
  const getMatch = async () => {
    const matchRequest = new Request(
      "https://frontend-take-home-service.fetch.com/dogs/match",
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(favorites),
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
        }),
      }
    );
    try {
      let response = await fetch(matchRequest);
      let result = await response.json();
      fetchDogObjects([result.match], "match");
    } catch (error) {
      console.error("error getting match:", error);
      showTimeOutAlert();
    }
  };

  // Logic to dislplay favorite dogs when pressing the Show Favorites button
  const displayFavorites = () => {
    if (favorites.length > 0) {
      fetchDogObjects(favorites, "fav");
    }
    setShowOnlyFavs(true);
  };

  // Logic to display all Dogs after pressing the SHow All button
  const displayAll = () => {
    setShowOnlyFavs(false);
  };

  // If user's auth cookie has expired prior to selecting an action, alert the user and send back to login screen
  const showTimeOutAlert = () => {
    window.alert("Your Session Has Timed Out! Please Log In Again.");
    navigate("/login");
  };

  return (
    <>
      <div className="background"></div>
      <div className="fixed-top">
        <NavBar />
        <SearchBar
          name={location.state.name}
          filteredDogs={getFilteredDogs}
          sortOrder={swapSortOrder}
          sortOrderVal={sortDirectionRef.current}
        />
      </div>
      <div className={!showOnlyFavs ? "body" : "body-fav"}>
        <br />
        <br />
        <div className="flex-row">
          {!showOnlyFavs ? (
            <button
              disabled={favorites.length === 0}
              className={
                favorites.length === 0 ? "disabled-button" : "show-fav-button"
              }
              onClick={() => displayFavorites()}
            >
              Show Favorites
            </button>
          ) : (
            <button className="show-fav-button" onClick={() => displayAll()}>
              Show All
            </button>
          )}
          <button
            disabled={favorites.length === 0}
            className={
              favorites.length === 0 ? "disabled-button" : "match-button"
            }
            onClick={() => getMatch()}
          >
            {" "}
            MATCH ME
          </button>
        </div>
        {match !== null && <MatchBox matchData={match[0]} reset={resetAll} />}
        <div className="center">
          {!showOnlyFavs ? (
            <ol className="grid">
              {dogs?.map((item) => (
                <ul key={item.id}>
                  <DogCard
                    dogData={item} // Dog Object
                    addFavorite={addToFavorites} // Add favorite function
                    removeFavorite={removeFromFavorites} //remove favorite function
                    favoritesList={favorites} // list of favorite dogs
                  ></DogCard>
                </ul>
              ))}
            </ol>
          ) : (
            <div className="flex-row">
              <ol className="grid">
                {favDogs?.map((item) => (
                  <ul key={item.id}>
                    <DogCard
                      dogData={item} // Dog Object
                      addFavorite={addToFavorites} // Add favorite function
                      removeFavorite={removeFromFavorites} //remove favorite function
                      favoritesList={favorites} // list of favorite dogs
                    ></DogCard>
                  </ul>
                ))}
              </ol>
            </div>
          )}
        </div>
        {!showOnlyFavs && (
          <div className="page-buttons">
            {!isPrevDisabled && (
              <button
                className="page-change-button"
                onClick={() => getPreviousPageData()}
              >
                {"<-"} Previous Page
              </button>
            )}
            <div className="gap"></div>
            {!isNextDisabled && (
              <button
                className="page-change-button"
                onClick={() => getNextPageData()}
              >
                Next Page {"->"}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Dogs;
