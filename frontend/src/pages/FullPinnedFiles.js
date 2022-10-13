import React, { useState, useEffect } from "react"
import "./styles/FullPinnedFiles.css"
import { abi, contractAddresses } from "../constants"
import { useNavigate } from "react-router-dom"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { motion } from "framer-motion"
import axios from "axios"
import { ethers } from "ethers"
import { BsFillEyeFill } from "react-icons/bs"
import { MdContentCopy } from "react-icons/md"
import { GrStatusGoodSmall } from "react-icons/gr"
import { CopyToClipboard } from "react-copy-to-clipboard"

import { useNotification } from "web3uikit"
import { create } from "ipfs-http-client"

const Pinning = (props) => {
    const dispatch = useNotification()
    const [pinstate, setPinstate] = useState("pick")
    const [copied, setCopied] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const [pinataFilesObj, setPinataFilesObj] = useState([])
    const [state, setState] = useState(false)
    const [infuraFilesObj, setInfuraFilesObj] = useState([])
    const [filebaseFilesObj, setFilebaseFilesObj] = useState([])

    const [pinataObj, setPinataObj] = useState({
        IpfsHash: "",
        Timestamp: "",
    })

    const [infuraObj, setInfuraObj] = useState({
        IpfsHash: "",
        Timestamp: "",
    })

    const [filebaseObj, setFilebaseObj] = useState({
        IpfsHash: "",
        Timestamp: "",
    })

    function checkPinataIndex(data) {
        return data.fileId > pinataFilesObj.length - 5
    }

    function checkInfuraIndex(data) {
        return data.fileId > infuraFilesObj.length - 5
    }

    function checkFilebaseIndex(data) {
        return data.fileId > filebaseFilesObj.length - 5
    }

    const { Moralis, account, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const handleState = (e) => {
        setPinstate(e.target.value)
    }

    const onInputChange = (event) => {
        const { value } = event.target
        setInputValue(value)
    }

    const renderClass = () => {
        let result
        pinstate === "pick" ? (result = "closed__display") : (result = "pinning__service__info")

        return result
    }

    const renderState = () => {
        let state

        if (pinstate == "pinata") {
            state = "pinata"
        } else if (pinstate == "infura") {
            state = "infura"
        } else if (pinstate == "filebase") {
            state = "filebase"
        } else {
            state = "pick"
        }

        return state
    }

    // infura

    const sendCidToInfura = async (cid) => {
        setState(true)
        const auth =
            "Basic " +
            Buffer.from(
                `${process.env.REACT_APP_INFURA_PROJECT_ID}` +
                    ":" +
                    `${process.env.REACT_APP_INFURA_PROJECT_SECRET}`
            ).toString("base64")
        const client = create({
            host: "ipfs.infura.io",
            port: 5001,
            protocol: "https",
            apiPath: "/api/v0",
            headers: {
                authorization: auth,
            },
        })
        try {
            const resFile = await client.pin.add(`${cid}`)

            console.log("ahahah")
            console.log(resFile)
            setInfuraObj({
                IpfsHash: cid,
                Timestamp: new Date().getTime(),
            })
        } catch (error) {
            console.log("Error sending File to IPFS with filebase: ")
            handleErrorNotification1()
            console.log(error)
        }
    }

    // filebase

    const sendCidToFilebase = async (cid) => {
        setState(true)
        const apiUrl = "https://api.filebase.io/v1/ipfs/"
        const authAxios = axios.create({
            baseURL: apiUrl,
            headers: {
                Authorization: `Bearer ${process.env.REACT_APP_FILEBASE_ACCESS_TOKEN}`,
            },
        })

        const formData1 = {
            cid: `${cid}`,
        }

        try {
            const resFile = await authAxios.post(`${apiUrl}/pins`, formData1)

            console.log("ahahah")
            console.log(resFile)

            setFilebaseObj({
                IpfsHash: cid,
                Timestamp: new Date().getTime(),
            })
        } catch (error) {
            console.log("Error sending File to IPFS with filebase: ")
            handleErrorNotification1()
            console.log(error)
        }
    }

    // pinata

    const sendFileToPinata = async (cid) => {
        setState(true)
        try {
            const formData = JSON.stringify({
                hashToPin: `${cid}`,
            })
            const resFile = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinByHash",
                data: formData,
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}`,
                    "Content-Type": "application/json",
                },
            })

            console.log(resFile)
            setPinataObj({
                IpfsHash: cid,
                Timestamp: new Date().getTime(),
            })
        } catch (error) {
            console.log("Error sending File to IPFS: ")
            handleErrorNotification1()
            console.log(error)
        }
    }

    async function callPinataContract() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const dropbox = new ethers.Contract(raffleAddress, abi, provider)
        const filesNo = await dropbox.getNumberOfPinataFiles(account)

        const fileArray = []
        for (let i = 0; i < parseInt(filesNo.toString()); i++) {
            const myFiles = await dropbox.getPinataUserFiles(account, i)

            fileArray.push(myFiles)
        }

        const promises = fileArray.map(async (item, index) => {
            const fileName = await dropbox.getNameOfFile(item)
            const fileDescription = await dropbox.getFileDescription(item)
            const fileSize = await dropbox.getSizeOfFile(account, item)
            const fileDate = await dropbox.getPinataPinDate(item)

            const data = {
                fileId: index,
                fileName: fileName,
                fileDescription: fileDescription,
                fileCid: item,
                fileSize: fileSize.toString(),
                fileDate: fileDate.toString(),
            }

            return data
        })

        return Promise.all(promises)
    }

    async function callInfuraContract() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const dropbox = new ethers.Contract(raffleAddress, abi, provider)
        const filesNo = await dropbox.getNumberOfInfuraFiles(account)

        const fileArray = []
        for (let i = 0; i < parseInt(filesNo.toString()); i++) {
            const myFiles = await dropbox.getInfuraUserFiles(account, i)

            fileArray.push(myFiles)
        }

        const promises = fileArray.map(async (item, index) => {
            const fileName = await dropbox.getNameOfFile(item)
            const fileDescription = await dropbox.getFileDescription(item)
            const fileSize = await dropbox.getSizeOfFile(account, item)
            const fileDate = await dropbox.getInfuraPinDate(item)

            const data = {
                fileId: index,
                fileName: fileName,
                fileDescription: fileDescription,
                fileCid: item,
                fileSize: fileSize.toString(),
                fileDate: fileDate.toString(),
            }

            return data
        })

        return Promise.all(promises)
    }

    async function callFilebaseContract() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const dropbox = new ethers.Contract(raffleAddress, abi, provider)
        const filesNo = await dropbox.getNumberOfFilebaseFiles(account)

        const fileArray = []
        for (let i = 0; i < parseInt(filesNo.toString()); i++) {
            const myFiles = await dropbox.getFilebaseUserFiles(account, i)

            fileArray.push(myFiles)
        }

        const promises = fileArray.map(async (item, index) => {
            const fileName = await dropbox.getNameOfFile(item)
            const fileDescription = await dropbox.getFileDescription(item)
            const fileSize = await dropbox.getSizeOfFile(account, item)
            const fileDate = await dropbox.getFilebasePinDate(item)

            const data = {
                fileId: index,
                fileName: fileName,
                fileDescription: fileDescription,
                fileCid: item,
                fileSize: fileSize.toString(),
                fileDate: fileDate.toString(),
            }

            return data
        })

        return Promise.all(promises)
    }

    const { runContractFunction: pinToPinata } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "pinFileToPinata",
        params: {
            file: pinataObj.IpfsHash.toString(),
            date: pinataObj.Timestamp.toString(),
        },
    })

    const { runContractFunction: pinToInfura } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "pinFileToInfura",
        params: {
            file: infuraObj.IpfsHash.toString(),
            date: infuraObj.Timestamp.toString(),
        },
    })

    const { runContractFunction: pinToFilebase } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "pinFileToFilebase",
        params: {
            file: filebaseObj.IpfsHash.toString(),
            date: filebaseObj.Timestamp.toString(),
        },
    })

    const renderPin = (cid) => {
        setState(true)
        if (pinstate == "pinata") {
            sendFileToPinata(cid)
        } else if (pinstate == "infura") {
            sendCidToInfura(cid)
        } else if (pinstate == "filebase") {
            sendCidToFilebase(cid)
        } else {
        }
    }

    const handleNewNotification = () => {
        dispatch({
            type: "success",
            message: "File Pinned!",
            title: "Pinata Pinning",
            position: "topR",
            icon: "bell",
        })
    }

    const handleNewNotification1 = () => {
        dispatch({
            type: "success",
            message: "File Pinned!",
            title: "Inufa Pinning",
            position: "topR",
            icon: "bell",
        })
    }

    const handleNewNotification2 = () => {
        dispatch({
            type: "success",
            message: "File Pinned!",
            title: "Filebase Pinning",
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
        callPinataContract().then((res) => {
            console.log("my res")
            console.log(res)

            setPinataFilesObj(res)
        })
    }

    const handleSuccess1 = async (tx) => {
        await tx.wait(1)
        setState(false)
        handleNewNotification1(tx)
        callInfuraContract().then((res) => {
            console.log("my res")
            console.log(res)

            setInfuraFilesObj(res)
        })
    }

    const handleSuccess2 = async (tx) => {
        await tx.wait(1)
        setState(false)
        handleNewNotification2(tx)
        callFilebaseContract().then((res) => {
            console.log("my res")
            console.log(res)

            setFilebaseFilesObj(res)
        })
    }

    const handleErrorNotification = (err) => {
        setState(false)
        dispatch({
            type: "error",
            message: `Pinning error ${err.data.message}`,
            title: "Pinning",
            position: "topR",
            icon: "bell",
        })
    }

    const handleErrorNotification1 = (err) => {
        setState(false)
        dispatch({
            type: "error",
            message: `Pinning error`,
            title: "Pinning",
            position: "topR",
            icon: "bell",
        })
    }

    const handleErrorNotification2 = () => {
        setState(false)
        dispatch({
            type: "error",
            message: `Select a Pinning Service`,
            title: "Pinning",
            position: "topR",
            icon: "bell",
        })
    }

    useEffect(() => {
        async function updatePinata() {
            await pinToPinata({
                onSuccess: handleSuccess,
                onError: (error) => {
                    handleErrorNotification(error)
                },
            })
        }

        updatePinata()
    }, [pinataObj])

    useEffect(() => {
        async function updateFilebase() {
            await pinToFilebase({
                onSuccess: handleSuccess2,
                onError: (error) => {
                    handleErrorNotification(error)
                },
            })
        }

        updateFilebase()
    }, [filebaseObj])

    useEffect(() => {
        async function updateInfura() {
            await pinToInfura({
                onSuccess: handleSuccess1,
                onError: (error) => {
                    handleErrorNotification(error)
                },
            })
        }

        updateInfura()
    }, [infuraObj])

    useEffect(() => {
        callPinataContract().then((res) => {
            console.log("my res")
            console.log(res)

            setPinataFilesObj(res)
        })

        callInfuraContract().then((res) => {
            console.log("my res")
            console.log(res)

            setInfuraFilesObj(res)
        })

        callFilebaseContract().then((res) => {
            console.log("my res")
            console.log(res)

            setFilebaseFilesObj(res)
        })
    }, [isWeb3Enabled])

    const navigate = useNavigate()

    return (
        <div className="fpf">
            {props.state == "pinata" && (
                <div className="pinning__service__header">
                    <h1 className="pinning__service__h1">Your Pinata pinned files</h1>
                </div>
            )}

            {props.state == "filebase" && (
                <div className="pinning__service__header">
                    <h1 className="pinning__service__h1">Your Filebase pinned files</h1>
                </div>
            )}

            {props.state == "infura" && (
                <div className="pinning__service__header">
                    <h1 className="pinning__service__h1">Your Infura pinned files</h1>
                </div>
            )}
            <div className="pinning__container">
                {props.state == "pinata" ? (
                    <div className="">
                        <motion.div
                            whileInView={{ x: [-100, 0], opacity: [0, 1] }}
                            transition={{ duration: 0.5 }}
                            className="table__container__pinning"
                        >
                            <table className="table">
                                <thead className="thead">
                                    <tr className="tr">
                                        <th>ID</th>
                                        <th>CID</th>

                                        <th>DATE</th>
                                        <th>VIEW</th>
                                        <th>STATUS</th>
                                    </tr>
                                </thead>

                                {pinataFilesObj.reverse().map((item, index) => {
                                    const d = new Date(parseInt(item.fileDate))

                                    return (
                                        <tbody key={index}>
                                            <tr>
                                                <td data-label="ID">{index}</td>
                                                <td data-label="CID">
                                                    {item.fileCid.length > 15 ? (
                                                        <div className="component">
                                                            <CopyToClipboard
                                                                text={item.fileCid}
                                                                onCopy={() => copySuccess()}
                                                            >
                                                                <MdContentCopy />
                                                            </CopyToClipboard>{" "}
                                                            {item.fileCid.slice(0, 10)}
                                                            ...
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
                                                <td data-label="DATE">
                                                    {`${d.getDate()}/${
                                                        d.getMonth() + 1
                                                    }/${d.getFullYear()}`}
                                                </td>

                                                <td data-label="VIEW">
                                                    <a
                                                        target="_blank"
                                                        href={`https://gateway.pinata.cloud/ipfs/${item.fileCid}`}
                                                    >
                                                        <BsFillEyeFill />
                                                    </a>
                                                </td>
                                                <td data-label="STATUS">
                                                    <div className="component">
                                                        Pinned{" "}
                                                        <GrStatusGoodSmall className="pinned" />{" "}
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    )
                                })}
                            </table>
                        </motion.div>
                    </div>
                ) : (
                    ""
                )}

                {props.state == "infura" ? (
                    <div className="">
                        <motion.div
                            whileInView={{ x: [-100, 0], opacity: [0, 1] }}
                            transition={{ duration: 0.5 }}
                            className="table__container__pinning"
                        >
                            <table className="table">
                                <thead className="thead">
                                    <tr className="tr">
                                        <th>ID</th>
                                        <th>CID</th>

                                        <th>DATE</th>
                                        <th>VIEW</th>
                                        <th>STATUS</th>
                                    </tr>
                                </thead>
                                {infuraFilesObj.reverse().map((item, index) => {
                                    const d = new Date(parseInt(item.fileDate))

                                    return (
                                        <tbody>
                                            <tr>
                                                <td data-label="ID">{index}</td>
                                                <td data-label="CID">
                                                    {item.fileCid.length > 15 ? (
                                                        <div className="component">
                                                            <CopyToClipboard
                                                                text={item.fileCid}
                                                                onCopy={() => setCopied(true)}
                                                            >
                                                                <MdContentCopy />
                                                            </CopyToClipboard>{" "}
                                                            {item.fileCid.slice(0, 10)}
                                                            ...
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
                                                <td data-label="DATE">
                                                    {`${d.getDate()}/${
                                                        d.getMonth() + 1
                                                    }/${d.getFullYear()}`}
                                                </td>

                                                <td data-label="VIEW">
                                                    <a
                                                        target="_blank"
                                                        href={`https://web3dropbox.infura-ipfs.io/ipfs/${item.fileCid}`}
                                                    >
                                                        <BsFillEyeFill />
                                                    </a>
                                                </td>
                                                <td data-label="STATUS">
                                                    <div className="component">
                                                        Pinned{" "}
                                                        <GrStatusGoodSmall className="pinned" />{" "}
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    )
                                })}
                            </table>
                        </motion.div>
                    </div>
                ) : (
                    ""
                )}

                {props.state == "filebase" ? (
                    <div className="">
                        <motion.div
                            whileInView={{ x: [-100, 0], opacity: [0, 1] }}
                            transition={{ duration: 0.5 }}
                            className="table__container__pinning"
                        >
                            <table className="table">
                                <thead className="thead">
                                    <tr className="tr">
                                        <th>Id</th>
                                        <th>CID</th>

                                        <th>DATE</th>
                                        <th>VIEW</th>
                                        <th>STATUS</th>
                                    </tr>
                                </thead>
                                {filebaseFilesObj.reverse().map((item, index) => {
                                    const d = new Date(parseInt(item.fileDate))

                                    return (
                                        <tbody>
                                            <tr>
                                                <td data-label="ID">{index}</td>
                                                <td data-label="CID">
                                                    {item.fileCid.length > 15 ? (
                                                        <div className="component">
                                                            <CopyToClipboard
                                                                text={item.fileCid}
                                                                onCopy={() => setCopied(true)}
                                                            >
                                                                <MdContentCopy />
                                                            </CopyToClipboard>{" "}
                                                            {item.fileCid.slice(0, 10)}
                                                            ...
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
                                                <td data-label="DATE">
                                                    {`${d.getDate()}/${
                                                        d.getMonth() + 1
                                                    }/${d.getFullYear()}`}
                                                </td>

                                                <td data-label="VIEW">
                                                    <a
                                                        target="_blank"
                                                        href={`https://ipfs.filebase.io/ipfs/${item.fileCid}`}
                                                    >
                                                        <BsFillEyeFill />
                                                    </a>
                                                </td>
                                                <td data-label="STATUS">
                                                    <div className="component">
                                                        Pinned{" "}
                                                        <GrStatusGoodSmall className="pinned" />
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    )
                                })}
                            </table>
                        </motion.div>
                    </div>
                ) : (
                    ""
                )}
            </div>
        </div>
    )
}

export default Pinning
