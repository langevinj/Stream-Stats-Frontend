import React from "react";
import './Home.css'
import bandcampLogo from './images/bandcamp-logo.svg'
import spotifyLogo from './images/spotify-for-artists-fill.png'
import distrokidLogo from './images/distrokid-logo.png' 

function Home() {
    return (
        <div className="Home">
            <div className="row" id="top-row">
                <div className="col-4"></div>
                <div className="col-4">
                    <h1 className="display-3">Our Mission:</h1>
                    <br></br>
                    <p className="description">Stream Stats is a tool for artists, musicians, and labels to visualize streaming data from multiple services all in one location.</p>
                    <br></br>
                    <h4 className="font-weight-bold">We currently support the following services:</h4>
                    <div className="container d-flex justify-content-center">
                        <div className="row mb-5">
                            <div className="col-3"></div>
                            <div className="col-6">
                            <ul>
                                <li className="m-2"><img src={bandcampLogo} id="bandcampLogo" className="img-fluid logo" alt="bandcamp"></img></li>
                                    <li className="m-2"><img src={spotifyLogo} alt="spotifyforarists" className="img-fluid logo" id="spotifyLogo"></img></li>
                                    <li className="m-2"><img src={distrokidLogo} id="distrokidLogo" className="img-fluid logo" alt="distrokid"></img></li>
                            </ul>
                            </div>
                            <div className="col-3"></div>
                        </div>
                        
                    </div>
                    
                </div>
                <div className="col-4"></div>
            </div>
        </div>
    )
}

export default Home;