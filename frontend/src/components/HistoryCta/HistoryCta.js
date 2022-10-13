import React, { useState, useEffect, useRef } from "react"
import TypeWriter from "typewriter-effect"
import "./HistoryCta.css"

import history2 from "../../assets/history2.jpg"
import { useNavigate } from "react-router-dom"

const images = [history2]

const HistoryCta = () => {
    const navigate = useNavigate()
    return (
        <div className="HistoryCta__container">
            <div className="HistoryCta__info">
                <div className="HistoryCta__header">
                    <h1 className="HistoryCta__h1">Browse Through your History</h1>
                    <p className="HistoryCta__p">
                        <TypeWriter
                            options={{
                                autoStart: true,
                                loop: true,
                                delay: 40,
                                strings: [
                                    "View Sent Files",
                                    "View Received Files",
                                    "Check your Personal Stats",
                                    "View your Nft Minting Transactions",
                                ],
                            }}
                        />
                    </p>
                </div>

                <div className="enterbutton__div__HistoryCta">
                    <button
                        onClick={() => navigate("history")}
                        className="enter__button__HistoryCta"
                    >
                        <span className="button__text">Browse</span>
                    </button>
                </div>
            </div>
            <div className="HistoryCta__img">
                <div className="slideshow">
                    <div>
                        {images.map((image, index) => (
                            <div className="slide" key={index}>
                                <img src={image} alt="nftImage" className="historyImg" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HistoryCta
