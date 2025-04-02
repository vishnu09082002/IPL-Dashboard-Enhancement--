import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";

import LatestMatch from "../LatestMatch";
import MatchCard from "../MatchCard";

import "./index.css";

const teamMatchesApiUrl = "https://apis.ccbp.in/ipl/";

const TeamMatches = () => {
  const { id } = useParams(); // ✅ Correct way to get the route parameter

  const [isLoading, setIsLoading] = useState(true);
  const [teamMatchesData, setTeamMatchesData] = useState({});

  useEffect(() => {
    getTeamMatches();
  }, [id]);

  const getFormattedData = (data) => ({
    umpires: data.umpires,
    result: data.result,
    manOfTheMatch: data.man_of_the_match,
    id: data.id,
    date: data.date,
    venue: data.venue,
    competingTeam: data.competing_team,
    competingTeamLogo: data.competing_team_logo,
    firstInnings: data.first_innings,
    secondInnings: data.second_innings,
    matchStatus: data.match_status,
  });

  const getTeamMatches = async () => {
    const response = await fetch(`${teamMatchesApiUrl}${id}`);
    const fetchedData = await response.json();
    const formattedData = {
      teamBannerURL: fetchedData.team_banner_url,
      latestMatch: getFormattedData(fetchedData.latest_match_details),
      recentMatches: fetchedData.recent_matches.map((eachMatch) =>
        getFormattedData(eachMatch)
      ),
    };

    setTeamMatchesData(formattedData);
    setIsLoading(false);
  };

  const renderRecentMatchesList = () => (
    <ul className="recent-matches-list">
      {teamMatchesData.recentMatches?.map((recentMatch) => (
        <MatchCard matchDetails={recentMatch} key={recentMatch.id} />
      ))}
    </ul>
  );

  const renderTeamMatches = () => (
    <div className="responsive-container">
      <img src={teamMatchesData.teamBannerURL} alt="team banner" className="team-banner" />
      <LatestMatch latestMatchData={teamMatchesData.latestMatch} />
      {renderRecentMatchesList()}
    </div>
  );

  const renderLoader = () => (
    <div testid="loader" className="loader-container">
      <TailSpin type="Oval" color="#ffffff" height={50} />
    </div>
  );

  const getRouteClassName = () => {
    switch (id) {
      case "RCB":
        return "rcb";
      case "KKR":
        return "kkr";
      case "KXP":
        return "kxp";
      case "CSK":
        return "csk";
      case "RR":
        return "rr";
      case "MI":
        return "mi";
      case "SH":
        return "srh";
      case "DC":
        return "dc";
      default:
        return "";
    }
  };

  return (
    <div className={`team-matches-container ${getRouteClassName()}`}>
      {isLoading ? renderLoader() : renderTeamMatches()}
    </div>
  );
};

export default TeamMatches;
