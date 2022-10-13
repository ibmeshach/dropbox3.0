import React, { useRef, useState } from "react"
import emailjs from "@emailjs/browser"
import { motion } from "framer-motion"
import { FaEnvelope, FaMapMarkedAlt } from "react-icons/fa"
import { AiFillPhone } from "react-icons/ai"

import "./styles/Contact.css"
import { MdOutlineEmail } from "react-icons/md"
import { RiH3, RiMessengerLine } from "react-icons/ri"
import { BsWhatsapp } from "react-icons/bs"
import { useNotification } from "web3uikit"
const scaleVariants = {
    whileInView: {
        scale: [0, 1],
        opacity: [0, 1],
        transition: {
            duration: 1,
            ease: "easeInOut",
        },
    },
}

const Contact = () => {
    const [state, setState] = useState(false)
    const dispatch = useNotification()
    const handleNewNotification = () => {
        setState(false)
        dispatch({
            type: "success",
            message: "Message Sent",
            title: "Sending Message",
            position: "topR",
            icon: "bell",
        })
    }

    const handleErrorNotification = () => {
        setState(false)

        dispatch({
            type: "error",
            message: ` Sending Error `,
            title: "Sending Message",
            position: "topR",
            icon: "bell",
        })
    }

    const form = useRef()

    const sendEmail = (e) => {
        e.preventDefault()
        setState(true)

        emailjs
            .sendForm(
                `${process.env.REACT_APP_EMAILJS_SERVICE_ID}`,
                `${process.env.REACT_APP_EMAILJS_TEMPLATE_ID}`,
                form.current,
                `${process.env.REACT_APP_EMAILJS_PUBLIC_KEY}`
            )
            .then(
                (result) => {
                    console.log(result.text)
                    handleNewNotification()
                },
                (error) => {
                    console.log(error.text)
                    handleErrorNotification()
                }
            )
    }
    return (
        <div className="contact-con">
            <div className="contact">
                <div className="contact-content">
                    <div className="left-side">
                        <div className="phone details">
                            <AiFillPhone className="icon-c" />
                            <div className="topic">Phone</div>
                            <div className="text-one">+2348113774767</div>
                            <div className="text-two">+2348148274833</div>
                        </div>

                        <div className="email details">
                            <FaEnvelope className="icon-c" />
                            <div className="topic">Email</div>
                            <div className="text-one">ibmeshach@gmail.com</div>
                            <div className="text-two">ehimeshach@gmail.com</div>
                        </div>
                    </div>

                    <div className="right-side">
                        <div className="topic-text">Send us a message</div>
                        <p>
                            If you have any suggestion or query related to this platform, you can
                            send a message.
                        </p>

                        <form ref={form} onSubmit={sendEmail}>
                            <div className="input-box">
                                <input
                                    required
                                    type="text"
                                    name="user_name"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div className="input-box">
                                <input
                                    required
                                    type="text"
                                    name="user_email"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="input-box message-box">
                                <textarea required name="message"></textarea>
                            </div>
                            <div className="button">
                                <button type="submit" value="Send">
                                    {state ? (
                                        <div className="loader"></div>
                                    ) : (
                                        <span className="button__text">Send Now</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
