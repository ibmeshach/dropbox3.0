import React, { useState, useEffect } from "react"
import "./Friends.css"
import { abi, contractAddresses } from "../../constants"
import { useNavigate } from "react-router-dom"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { motion } from "framer-motion"
import { BsPersonCheckFill } from "react-icons/bs"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { MdContentCopy } from "react-icons/md"

const Friends = () => {
    const dispatch = useNotification()
    const [inputValue, setInputValue] = useState("")
    const [friendObj, setFriendObj] = useState([])
    const [state, setState] = useState(false)

    function checkIndex(data) {
        return data.fileId > friendObj.length - 5
    }

    const { Moralis, account, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const { runContractFunction: addFriend } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "addFriend",
        params: {
            friend: inputValue,
        },
    })

    async function getFriends() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const dropbox = new ethers.Contract(raffleAddress, abi, provider)
        const friendsNo = await dropbox.getFriendsNumber(account)

        const friendArray = []
        for (let i = 0; i < parseInt(friendsNo.toString()); i++) {
            const myFriends = await dropbox.getFriends(account, i)

            friendArray.push(myFriends)
        }

        const promises = friendArray.map(async (item, index) => {
            const filesNo = await dropbox.getNumberOfFiles(item)
            const friendName = await dropbox.getUsername(item)
            const friendFileSize = await dropbox.getUserTotalSize(item)

            const data = {
                fileId: index,
                friendAddress: item,
                friendFilesNo: filesNo.toString(),
                friendUsername: friendName,
                friendSize: friendFileSize.toString(),
            }

            return data
        })

        return Promise.all(promises)
    }

    const handleNewNotification = () => {
        dispatch({
            type: "success",
            message: "Friend Added! Refresh To See Your Friends",
            title: "Adding Friend",
            position: "topR",
            icon: "bell",
        })
    }

    const copySuccess = () => {
        dispatch({
            type: "info",
            message: "Copied!",
            title: "Copying",
            position: "topR",
            icon: "bell",
        })
    }

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        setState(false)

        handleNewNotification(tx)
        getFriends().then((res) => {
            setFriendObj(res)
        })
    }

    const handleErrorNotification = (err) => {
        setState(false)

        dispatch({
            type: "error",
            message: ` Adding Friend Error ${err.data.message}`,
            title: "Adding Friend",
            position: "topR",
            icon: "bell",
        })
    }

    const handleErrorNotification1 = () => {
        setState(false)

        dispatch({
            type: "error",
            message: ` Adding Friend Error`,
            title: "Adding Friend",
            position: "topR",
            icon: "bell",
        })
    }

    async function addFriendFunc() {
        try {
            setState(true)
            await addFriend({
                onSuccess: handleSuccess,
                onError: (error) => {
                    handleErrorNotification(error)
                },
            })
        } catch (error) {
            console.log(error)
            handleErrorNotification1()
        }
    }

    const onInputChange = (event) => {
        const { value } = event.target
        setInputValue(value)
    }

    const navigate = useNavigate()

    useEffect(() => {
        getFriends().then((res) => {
            setFriendObj(res)
        })
    }, [isWeb3Enabled])
    return (
        <div>
            <div className="friend__container">
                <div className="friend__header">
                    <h1 className="friend__h1">Add Friends</h1>
                    <p className="friend__p">
                        Share files to friends from anywhere using their registered wallet address
                    </p>
                </div>
                <form
                    className="friend__input"
                    action=""
                    onSubmit={(e) => {
                        e.preventDefault()
                        addFriendFunc()
                    }}
                >
                    <input
                        type="text"
                        placeholder="Enter Wallet address"
                        value={inputValue}
                        required
                        onChange={onInputChange}
                        className="text__input__friend"
                    />

                    <div className="enterbutton__div__friend">
                        <button className="enter__button__friend" disabled={state}>
                            {state ? (
                                <div className="loader"></div>
                            ) : (
                                <span className="button__text">Add</span>
                            )}
                        </button>
                    </div>
                </form>

                <div className="friend__services">
                    <div className="friend__service">
                        <div className="friend__service__header">
                            <h1 className="friend__service__h1">My Friends</h1>
                        </div>

                        <motion.div
                            className="friend__cards"
                            whileInView={{ x: [-100, 0], opacity: [0, 1] }}
                            transition={{ duration: 0.5 }}
                        >
                            {friendObj
                                .filter(checkIndex)
                                .reverse()
                                .map((item, index) => {
                                    return (
                                        <div key={index} className="friend__card">
                                            <span className="friend__profile">
                                                <BsPersonCheckFill className="friend__pic" />
                                            </span>

                                            <div className="friend__info">
                                                <p className="friend__address">
                                                    {`Address: ${item.friendAddress.slice(0, 10)}...
                                                            ${item.friendAddress.slice(
                                                                item.friendAddress.length - 5
                                                            )}`}
                                                    <CopyToClipboard
                                                        text={item.friendAddress}
                                                        onCopy={() => copySuccess()}
                                                    >
                                                        <MdContentCopy />
                                                    </CopyToClipboard>{" "}
                                                </p>
                                                <p className="friend__name">
                                                    {item.friendUsername.length > 15 ? (
                                                        <div className="component">
                                                            {`Username: ${item.friendUsername.slice(
                                                                0,
                                                                10
                                                            )}...
                                                            ${item.friendUsername.slice(
                                                                item.friendUsername.length - 5
                                                            )}`}
                                                            <CopyToClipboard
                                                                text={item.friendUsername}
                                                                onCopy={() => copySuccess()}
                                                            >
                                                                <MdContentCopy />
                                                            </CopyToClipboard>{" "}
                                                        </div>
                                                    ) : (
                                                        <>{`Username: ${item.friendUsername}`}</>
                                                    )}
                                                </p>
                                                <p className="friend__no__files">
                                                    {" "}
                                                    {`Total Files: ${item.friendFilesNo}`}
                                                </p>
                                                <p className="friend__total__space">
                                                    {`Total Space: ${
                                                        parseInt(item.friendSize) / 10 ** 6
                                                    }MB`}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            <div className="title__button__div">
                                <button
                                    onClick={() => navigate("allFriends")}
                                    className="title__button"
                                >
                                    View All
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Friends
