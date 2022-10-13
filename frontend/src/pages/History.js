import React, { useState, useEffect } from "react"
import "./styles/History.css"
import { abi, abi_nft, contractAddresses_nft, contractAddresses } from "../constants"
import { useNavigate } from "react-router-dom"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { motion } from "framer-motion"
import { BsFileEarmarkText, BsPeopleFill, BsPersonCheckFill } from "react-icons/bs"
import { AiOutlineUser } from "react-icons/ai"
import { ImFilesEmpty } from "react-icons/im"
import { GrDriveCage } from "react-icons/gr"
import { FiSend } from "react-icons/fi"
import { RiFolderReceivedLine } from "react-icons/ri"
import { GiPinata } from "react-icons/gi"
import { ethers } from "ethers"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { MdContentCopy } from "react-icons/md"
import { BsFillEyeFill } from "react-icons/bs"
import { useNotification } from "web3uikit"

const History = () => {
    const dispatch = useNotification()
    const [copied, setCopied] = useState(false)
    const [my_Tx, setMy_Tx] = useState([])
    const [historyState, setHistoryState] = useState("pick")
    const [inputValue, setInputValue] = useState("")
    const [inputValueAdd, setInputValueAdd] = useState("")
    const [sentObj, setSentObj] = useState([])
    const [receivedObj, setReceivedObj] = useState([])
    const [state, setState] = useState(false)

    const [myUsername, setMyUsername] = useState("")
    const [mySize, setMySize] = useState(0)
    const [myFiles, setMyFiles] = useState(0)
    const [mySent, setMySent] = useState(0)
    const [myReceived, setMyReceived] = useState(0)
    const [myFriends, setMyFriends] = useState(0)
    const [myPinata, setMyPinata] = useState(0)
    const [myInfura, setMyInfura] = useState(0)
    const [myFilebase, setMyFilebase] = useState(0)
    const [nftNo, setNftNo] = useState(0)

    const { Moralis, account, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const raffleAddress1 =
        chainId in contractAddresses_nft ? contractAddresses_nft[chainId][0] : null

    const {
        runContractFunction: sendItem,
        data: enterTxResponse1,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "sendItem",
        params: {
            friend: inputValueAdd,
            files: inputValue,
            date: new Date().getTime().toString(),
        },
    })

    const { runContractFunction: getEmits } = useWeb3Contract({
        abi: abi_nft,
        contractAddress: raffleAddress1, // specify the networkId
        functionName: "get_My_Tx",
        params: {},
    })

    async function getAllMyTx() {
        const emits = await getEmits()

        const structuredTransactions = emits.map((transaction) => ({
            minter: transaction.user,
            amount: (parseInt(transaction.amount.toString()) / 10 ** 18).toFixed(3).toString(),
            timestamp: transaction.timestamp.toString(),
        }))

        setMy_Tx(structuredTransactions.reverse())
    }

    async function getSentItems() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const dropbox = new ethers.Contract(raffleAddress, abi, provider)
        const filesNo = await dropbox.getSentNumber(account)

        const fileArray = []
        for (let i = 0; i < parseInt(filesNo.toString()); i++) {
            const myFiles = await dropbox.getSentItems(account, i)

            fileArray.push(myFiles)
        }

        const promises = fileArray.map(async (item, index) => {
            const fileName = await dropbox.getNameOfFile(item)

            const fileSize = await dropbox.getSizeOfFile(account, item)
            const fileDate = await dropbox.getSentItemDate(account, item)

            const data = {
                fileId: index,
                fileName: fileName,

                fileCid: item,
                fileSize: fileSize.toString(),
                fileDate: fileDate.toString(),
            }

            return data
        })

        return Promise.all(promises)
    }

    async function getReceivedItems() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const dropbox = new ethers.Contract(raffleAddress, abi, provider)
        const filesNo = await dropbox.getReceivedNumber(account)

        const fileArray = []
        for (let i = 0; i < parseInt(filesNo.toString()); i++) {
            const myFiles = await dropbox.getReceivedItems(account, i)

            fileArray.push(myFiles)
        }

        const promises = fileArray.map(async (item, index) => {
            const fileName = await dropbox.getNameOfFile(item)

            const fileSize = await dropbox.getSizeOfFile(account, item)
            const fileDate = await dropbox.getReceivedItemDate(account, item)

            const data = {
                fileId: index,
                fileName: fileName,

                fileCid: item,
                fileSize: fileSize.toString(),
                fileDate: fileDate.toString(),
            }

            return data
        })

        return Promise.all(promises)
    }

    async function getStats() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const dropbox = new ethers.Contract(raffleAddress, abi, provider)
        const nft = new ethers.Contract(raffleAddress1, abi_nft, provider)
        const username = await dropbox.getUsername(account)
        const totalSize = await dropbox.getUserTotalSize(account)
        const totalFiles = await dropbox.getNumberOfFiles(account)
        const totalSentItems = await dropbox.getSentNumber(account)
        const totalReceivedItems = await dropbox.getReceivedNumber(account)
        const totalFriends = await dropbox.getFriendsNumber(account)
        const totalPinataFiles = await dropbox.getNumberOfPinataFiles(account)
        const totalInfuraFiles = await dropbox.getNumberOfInfuraFiles(account)
        const totalFilebaseFiles = await dropbox.getNumberOfFilebaseFiles(account)
        const noNft = await nft.getTokenCounter(account)

        setMyUsername(username)
        setMySize(totalSize)
        setMyFiles(totalFiles)
        setMySent(totalSentItems)
        setMyReceived(totalReceivedItems)
        setMyFriends(totalFriends)
        setMyPinata(totalPinataFiles)
        setMyInfura(totalInfuraFiles)
        setMyFilebase(totalFilebaseFiles)
        setNftNo(noNft)
    }

    const handleState = (e) => {
        setHistoryState(e.target.value)
    }

    const onInputChange = (event) => {
        const { value } = event.target
        setInputValue(value)
    }

    const onInputChangeAdd = (event) => {
        const { value } = event.target
        setInputValueAdd(value)
    }

    const renderClass = () => {
        let result
        historyState == "pick" ? (result = "closed__display") : (result = "history__service__info")

        return result
    }

    const renderState = () => {
        let state

        if (historyState == "sentItems") {
            state = "sentItems"
        } else if (historyState == "receivedItems") {
            state = "receivedItems"
        } else if (historyState == "stats") {
            state = "stats"
        } else if (historyState == "mintTransactions") {
            state = "mintTransactions"
        } else {
            state = "pick"
        }

        return state
    }

    const handleNewNotification = () => {
        dispatch({
            type: "success",
            message: "File Sent! Refresh To See Your Friends",
            title: "Sending File",
            position: "topR",
            icon: "bell",
        })
    }

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        setState(false)

        handleNewNotification(tx)
        getSentItems().then((res) => {
            console.log("my sent")
            console.log(res)

            setSentObj(res)
        })
    }

    const handleErrorNotification = (err) => {
        setState(false)

        dispatch({
            type: "error",
            message: ` Sending Error ${err.data.message}`,
            title: "Sending File",
            position: "topR",
            icon: "bell",
        })
    }

    const handleErrorNotification1 = () => {
        setState(false)

        dispatch({
            type: "error",
            message: ` Sending Error`,
            title: "Sending File",
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

    useEffect(() => {
        getSentItems().then((res) => {
            setSentObj(res)
        })

        getReceivedItems().then((res) => {
            setReceivedObj(res)
        })

        getStats()
        getAllMyTx()
    }, [isWeb3Enabled])

    async function sendFileFunc() {
        try {
            setState(true)
            await sendItem({
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

    const navigate = useNavigate()
    return (
        <div>
            <div className="history__container">
                <div className="history__header">
                    <h1 className="history__h1">History</h1>
                    <p className="history__p">Browse through your History</p>
                </div>

                <div className="history__selector">
                    <div className="selector__div">
                        <select onChange={handleState} value={historyState} className="selector">
                            <option value="pick" selected>
                                Select History Data
                            </option>
                            <option value="sentItems">Sent Items</option>
                            <option value="receivedItems">Received Items</option>
                            <option value="stats">Stats</option>
                            <option value="mintTransactions">Nff Mint Transactions</option>
                        </select>
                    </div>
                </div>
                {renderState() == "pick" ? <div>Select the History Data you want to view</div> : ""}

                {renderState() == "sentItems" ? (
                    <>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                sendFileFunc()
                            }}
                            className="history__input"
                        >
                            <div className="input__fields">
                                <input
                                    type="text"
                                    placeholder="Enter CID of file"
                                    value={inputValue}
                                    required
                                    onChange={onInputChange}
                                    className="text__input__history"
                                />
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter user wallet address"
                                    value={inputValueAdd}
                                    onChange={onInputChangeAdd}
                                    className="text__input__history"
                                />
                            </div>

                            <div className="enterbutton__div__history">
                                <button className="enter__button__history" disabled={state}>
                                    {state ? (
                                        <div className="loader"></div>
                                    ) : (
                                        <span className="button__text">Share</span>
                                    )}
                                </button>
                            </div>
                        </form>
                        <motion.div
                            whileInView={{ x: [-100, 0], opacity: [0, 1] }}
                            transition={{ duration: 0.5 }}
                            className="table__container__history"
                        >
                            <div className="history__service__header">
                                <h1 className="history__service__h1">Files Sent</h1>
                            </div>

                            <table className="table">
                                <thead className="thead">
                                    <tr className="tr">
                                        <th>NAME</th>
                                        <th>CID</th>
                                        <th>SIZE</th>
                                        <th>DATE</th>
                                        <th>VIEW</th>
                                    </tr>
                                </thead>

                                {sentObj.map((item, index) => {
                                    const d = new Date(parseInt(item.fileDate))

                                    return (
                                        <tbody key={index}>
                                            <tr>
                                                <td data-label="NAME">
                                                    {item.fileName.length > 15 ? (
                                                        <div className="component">
                                                            <CopyToClipboard
                                                                text={item.fileName}
                                                                onCopy={() => copySuccess()}
                                                            >
                                                                <MdContentCopy />
                                                            </CopyToClipboard>{" "}
                                                            {item.fileName.slice(0, 10)}...
                                                            {item.fileName.slice(
                                                                item.fileName.length - 5
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="component">
                                                            {item.fileName}
                                                        </div>
                                                    )}
                                                </td>

                                                <td data-label="CID">
                                                    {item.fileCid.length > 15 ? (
                                                        <div className="component">
                                                            <CopyToClipboard
                                                                text={item.fileCid}
                                                                onCopy={() => copySuccess()}
                                                            >
                                                                <MdContentCopy />
                                                            </CopyToClipboard>{" "}
                                                            {item.fileCid.slice(0, 10)}...
                                                            {item.fileCid.slice(
                                                                item.fileCid.length - 4
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="component">
                                                            {item.fileCid}
                                                        </div>
                                                    )}
                                                </td>
                                                <td data-label="SIZE">
                                                    {parseInt(item.fileSize) / 10 ** 6}MB
                                                </td>
                                                <td data-label="DATE">
                                                    {`${d.getDate()}/${
                                                        d.getMonth() + 1
                                                    }/${d.getFullYear()}`}
                                                </td>
                                                <td data-label="VIEW">
                                                    <a
                                                        target="_blank"
                                                        href={`https://ipfs.io/ipfs/${item.fileCid}`}
                                                    >
                                                        <BsFillEyeFill />
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    )
                                })}
                            </table>
                        </motion.div>
                    </>
                ) : (
                    ""
                )}

                {renderState() == "receivedItems" ? (
                    <>
                        <motion.div
                            whileInView={{ x: [-100, 0], opacity: [0, 1] }}
                            transition={{ duration: 0.5 }}
                            className="table__container__history"
                        >
                            <div className="history__service__header">
                                <h1 className="history__service__h1">Files Received</h1>
                            </div>

                            <table className="table">
                                <thead className="thead">
                                    <tr className="tr">
                                        <th>NAME</th>
                                        <th>CID</th>
                                        <th>SIZE</th>
                                        <th>DATE</th>
                                        <th>VIEW</th>
                                    </tr>
                                </thead>

                                {receivedObj.map((item, index) => {
                                    const d = new Date(parseInt(item.fileDate))

                                    return (
                                        <tbody key={index}>
                                            <tr>
                                                <td data-label="NAME">
                                                    {item.fileName.length > 15 ? (
                                                        <div className="component">
                                                            <CopyToClipboard
                                                                text={item.fileName}
                                                                onCopy={() => copySuccess()}
                                                            >
                                                                <MdContentCopy />
                                                            </CopyToClipboard>{" "}
                                                            {item.fileName.slice(0, 10)}...
                                                            {item.fileName.slice(
                                                                item.fileName.length - 5
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="component">
                                                            {item.fileName}
                                                        </div>
                                                    )}
                                                </td>

                                                <td data-label="CID">
                                                    {item.fileCid.length > 15 ? (
                                                        <div className="component">
                                                            <CopyToClipboard
                                                                text={item.fileCid}
                                                                onCopy={() => copySuccess()}
                                                            >
                                                                <MdContentCopy />
                                                            </CopyToClipboard>{" "}
                                                            {item.fileCid.slice(0, 10)}...
                                                            {item.fileCid.slice(
                                                                item.fileCid.length - 4
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="component">
                                                            {item.fileCid}
                                                        </div>
                                                    )}
                                                </td>
                                                <td data-label="SIZE">
                                                    {parseInt(item.fileSize) / 10 ** 6}MB
                                                </td>
                                                <td data-label="DATE">
                                                    {`${d.getDate()}/${
                                                        d.getMonth() + 1
                                                    }/${d.getFullYear()}`}
                                                </td>
                                                <td data-label="VIEW">
                                                    <a
                                                        target="_blank"
                                                        href={`https://ipfs.io/ipfs/${item.fileCid}`}
                                                    >
                                                        <BsFillEyeFill />
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    )
                                })}
                            </table>
                        </motion.div>
                    </>
                ) : (
                    ""
                )}

                {renderState() == "stats" ? (
                    <>
                        <div className="stats__history">
                            <div className="history__service__header">
                                <h1 className="history__service__h1">My Information</h1>
                            </div>

                            <motion.div
                                className="history__cards"
                                whileInView={{ x: [-100, 0], opacity: [0, 1] }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="history__card">
                                    <span className="history__profile">
                                        <AiOutlineUser className="history__pic" />
                                    </span>

                                    <div className="history__info">
                                        <p className="history__address">
                                            {`Address: ${account.slice(0, 10)}...
                                                            ${account.slice(account.length - 5)}`}
                                        </p>
                                        <p className="history__name">{`Username: ${myUsername}`}</p>
                                    </div>
                                </div>

                                <div className="history__card">
                                    <span className="history__profile">
                                        <ImFilesEmpty className="history__pic" />
                                    </span>

                                    <div className="history__info">
                                        <p className="history__address">
                                            {`Address: ${account.slice(0, 10)}...
                                                            ${account.slice(account.length - 5)}`}
                                        </p>

                                        <p className="history__no__files">
                                            {`Total Files: ${myFiles}`}
                                        </p>
                                    </div>
                                </div>

                                <div className="history__card">
                                    <span className="history__profile">
                                        <GrDriveCage className="history__pic" />
                                    </span>

                                    <div className="history__info">
                                        <p className="history__address">
                                            {`Address: ${account.slice(0, 10)}...
                                                            ${account.slice(account.length - 5)}`}
                                        </p>

                                        <p className="history__total__space">
                                            {`Total Size: ${parseInt(mySize) / 10 ** 6}MB`}
                                        </p>
                                    </div>
                                </div>

                                <div className="history__card">
                                    <span className="history__profile">
                                        <FiSend className="history__pic" />
                                    </span>

                                    <div className="history__info">
                                        <p className="history__address">
                                            {`Address: ${account.slice(0, 10)}...
                                                            ${account.slice(account.length - 5)}`}
                                        </p>

                                        <p className="history__total__space">
                                            {`Total Sent Files: ${mySent}`}
                                        </p>
                                    </div>
                                </div>

                                <div className="history__card">
                                    <span className="history__profile">
                                        <RiFolderReceivedLine className="history__pic" />
                                    </span>

                                    <div className="history__info">
                                        <p className="history__address">
                                            {`Address: ${account.slice(0, 10)}...
                                                            ${account.slice(account.length - 5)}`}
                                        </p>

                                        <p className="history__total__space">
                                            {`Total Received Files: ${myReceived}`}
                                        </p>
                                    </div>
                                </div>

                                <div className="history__card">
                                    <span className="history__profile">
                                        <BsPeopleFill className="history__pic" />
                                    </span>

                                    <div className="history__info">
                                        <p className="history__address">
                                            {`Address: ${account.slice(0, 10)}...
                                                            ${account.slice(account.length - 5)}`}
                                        </p>

                                        <p className="history__total__space">
                                            {`Total Friends: ${myFriends}`}
                                        </p>
                                    </div>
                                </div>

                                <div className="history__card">
                                    <span className="history__profile">NFTs</span>

                                    <div className="history__info">
                                        <p className="history__address">
                                            {`Address: ${account.slice(0, 10)}...
                                                            ${account.slice(account.length - 5)}`}
                                        </p>

                                        <p className="history__total__space">
                                            {`Total NFTs Minted: ${nftNo}`}
                                        </p>
                                    </div>
                                </div>

                                <div className="history__card">
                                    <span className="history__profile">
                                        <GiPinata className="history__pic" />
                                    </span>

                                    <div className="history__info">
                                        <p className="history__address">
                                            {`Address: ${account.slice(0, 10)}...
                                                            ${account.slice(account.length - 5)}`}
                                        </p>

                                        <p className="history__total__space">
                                            {`Pinata Files: ${myPinata}`}
                                        </p>
                                    </div>
                                </div>

                                <div className="history__card">
                                    <span className="history__profile">
                                        <BsFileEarmarkText className="history__pic" />
                                    </span>

                                    <div className="history__info">
                                        <p className="history__address">
                                            {`Address: ${account.slice(0, 10)}...
                                                            ${account.slice(account.length - 5)}`}
                                        </p>

                                        <p className="history__total__space">
                                            {`Infura Files: ${myInfura}`}
                                        </p>
                                    </div>
                                </div>

                                <div className="history__card">
                                    <span className="history__profile">
                                        <p className="history__pic">I</p>
                                    </span>

                                    <div className="history__info">
                                        <p className="history__address">
                                            {`Address: ${account.slice(0, 10)}...
                                                            ${account.slice(account.length - 5)}`}
                                        </p>

                                        <p className="history__total__space">
                                            I {`Filebase Files: ${myFilebase}`}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                ) : (
                    ""
                )}

                {renderState() == "mintTransactions" ? (
                    <>
                        <motion.div
                            whileInView={{ x: [-100, 0], opacity: [0, 1] }}
                            transition={{ duration: 0.5 }}
                            className="table__container__history"
                        >
                            <div className="history__service__header">
                                <h1 className="history__service__h1">Nft Minting Transactions</h1>
                            </div>

                            <table className="table">
                                <thead className="thead">
                                    <tr className="tr">
                                        <th>TO</th>
                                        <th>FROM</th>
                                        <th>AMOUNT</th>
                                        <th>DATE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {my_Tx.map((item, index) => (
                                        <tr key={index}>
                                            <td data-label="ADDRESS TO">
                                                <div className="component">
                                                    <CopyToClipboard
                                                        text={raffleAddress}
                                                        onCopy={() => copySuccess()}
                                                    >
                                                        <MdContentCopy />
                                                    </CopyToClipboard>{" "}
                                                    {raffleAddress.slice(0, 10)}
                                                    ...
                                                    {raffleAddress.slice(raffleAddress.length - 4)}
                                                </div>
                                            </td>
                                            <td data-label="ADDRESS FROM">
                                                <div className="component">
                                                    <CopyToClipboard
                                                        text={item.minter}
                                                        onCopy={() => copySuccess()}
                                                    >
                                                        <MdContentCopy />
                                                    </CopyToClipboard>{" "}
                                                    {item.minter.slice(0, 10)}
                                                    ...
                                                    {item.minter.slice(item.minter.length - 4)}
                                                </div>
                                            </td>

                                            <td data-label="AMOUNT">{item.amount} MATIC</td>
                                            <td data-label="DATE">
                                                {new Date(item.timestamp * 1000).toDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    </>
                ) : (
                    ""
                )}
            </div>
        </div>
    )
}

export default History
