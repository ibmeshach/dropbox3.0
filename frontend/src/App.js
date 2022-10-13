import "./App.css"
import React, { useState } from "react"
import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Contact from "./pages/Contact"
import About from "./pages/About"
import History from "./pages/History"
import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer"
import MintNft from "./pages/MintNft"
import FullFiles from "./pages/FullFiles"
import FullPinnedFiles from "./pages/FullPinnedFiles"
import Withdrawal from "./pages/Withdrawal"
import FullFriends from "./pages/FullFriends"
import { useRef } from "react"
import TawkMessengerReact from "@tawk.to/tawk-messenger-react"

function App() {
    const tawkMessengerRef = useRef()

    function handleMinimize() {
        tawkMessengerRef.current.minimize()
    }

    const [loading, setLoading] = useState(true)
    const spinner = document.getElementById("spinner")
    if (spinner) {
        setTimeout(() => {
            spinner.style.display = "none"
            setLoading(false)
        }, 2000)
    }

    return (
        !loading && (
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="nfts" element={<MintNft />} />
                    <Route path="history" element={<History />} />

                    <Route path="contact" element={<Contact />} />
                    <Route path="allFiles" element={<FullFiles />} />
                    <Route path="allPinataFiles" element={<FullPinnedFiles state="pinata" />} />
                    <Route path="allInfuraFiles" element={<FullPinnedFiles state="infura" />} />
                    <Route path="allFilebaseFiles" element={<FullPinnedFiles state="filebase" />} />
                    <Route path="allFriends" element={<FullFriends />} />
                    <Route path="codepeeps/ibmeshach" element={<Withdrawal />} />
                </Routes>

                <TawkMessengerReact
                    propertyId={`${process.env.REACT_APP_TAWK_PROJECT_ID}`}
                    widgetId={`${process.env.REACT_APP_TAWK_WIDGET_ID}`}
                    ref={tawkMessengerRef}
                />

                <Footer />
            </div>
        )
    )
}

export default App
