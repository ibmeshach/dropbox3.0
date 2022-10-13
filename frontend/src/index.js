import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"
import App from "./App"
import TawkMessengerReact from "@tawk.to/tawk-messenger-react"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <MoralisProvider initializeOnMount={false}>
                <NotificationProvider>
                    <App>
                        <TawkMessengerReact
                            propertyId={`${process.env.REACT_APP_TAWK_PROJECT_ID}`}
                            widgetId={`${process.env.REACT_APP_TAWK_WIDGET_ID}`}
                        />
                    </App>
                </NotificationProvider>
            </MoralisProvider>
        </BrowserRouter>
    </React.StrictMode>
)
