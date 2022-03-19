import axios from "axios";
import { useState, useEffect } from "react";
import classes from "./Search.module.css";
import { Link } from "react-router-dom";

function Search(props) {

    const [searchKey, setSearchKey] = useState("");
    const [artists, setArtists] = useState([]);
    let token = props.token;

      const logout = () => {
        token = "";
        setArtists([]);
        // <Link to="/"/>
      };

    const searchArtists = async (event) => {
        event.preventDefault();
        const {data} = await axios.get("/auth/search", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            q: searchKey,
            type: "artist",
          },
        });
        console.log(data.artists.items);
        setArtists(data.artists.items);
      };
    
    
    return(
        
        <div className={classes.app}>
       <span>gg</span>
       <div className={classes.search}>
         <div className={classes.searchLayer}>
       {token ? (
            <form onSubmit={searchArtists}>
              <input
                type="text"
                placeholder="Search artist..."
                onChange={(event) => setSearchKey(event.target.value)}
              />
            
              <button className={classes.searchBtn} type={"submit"}>
                Search
              </button>
              
            </form>
          ) : (
            <> </>
          )}
          </div>
          </div>
      <div className={classes.appHeader}>
        <>
       
         
            {/* <button className={classes.btn} onClick={logout}>LOGOUT</button> */}
            
        </>
              
      </div>

      {artists.map((artist) => (
        <div className={classes.container} key={artist.id}>
          <div className={classes.photo} >
            {artist.images.length ? (
              <img width={"100%"} src={artist.images[0].url} alt="" />
            ) : (
              <div className={classes.noimg}>No image</div>
            )}
          </div>
          <div className={classes.art}>
            <div className={classes.artname}> {artist.name}</div>
            <div className={classes.artgenre}> {artist.genres[0]} </div>
          </div>
        </div>
      ))}
    </div>
  );
        
}

export default Search;