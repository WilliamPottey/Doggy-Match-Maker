import React from "react";
import "./MatchBox.css";

function Match(props) {
  console.log(props.matchData.img);
  const onClickStartOver = () => {
    props.reset();
  };

  return (
    <>
      <div className="match-box">
        <div className="match-content">
          <h1 className="match-text">
            You matched with {props.matchData.name}!
          </h1>
          <img src={props.matchData.img}></img>
        </div>
        <br />
        <button className="start-over-btn" onClick={() => onClickStartOver()}>
          Start Over
        </button>
      </div>
    </>
  );
}

export default Match;
