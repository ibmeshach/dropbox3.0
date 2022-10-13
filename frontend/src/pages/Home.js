import React from "react"

import DropFileInput from "../components/drop-file-input/DropFileInput"
import MyFiles from "../components/MyFiles/MyFiles"
import Pinning from "../components/Pinning/Pinning"
import Join from "../components/Join/Join"
import Friends from "../components/Friends/Friends"
import Head from "../components/Head/Head"
import NftCta from "../components/NftCta/NftCta"

import frame from "../assets/frame.png"
import "./styles/Home.css"
import HistoryCta from "../components/HistoryCta/HistoryCta"

const Home = () => {
    const onFileChange = (files) => {
        console.log(files)
    }
    return (
        <div className="container">
            <Head />

            <div className="box">
                <span className="heroarea__span">
                    <img className="homepagelogo" src={frame} alt="logo" />
                </span>

                <DropFileInput onFileChange={(files) => onFileChange(files)} />
            </div>
            <MyFiles />
            <Pinning />
            <NftCta />
            <Join />
            <HistoryCta />
            <Friends />
        </div>
    )
}

export default Home
