import React, { useState, useEffect } from "react"
import "./MyFiles.css"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../../constants"
import { ethers } from "ethers"
import { FiShare } from "react-icons/fi"
import { useNotification } from "web3uikit"
import { BsPinAngleFill } from "react-icons/bs"
import { BsFillEyeFill } from "react-icons/bs"
import { MdContentCopy } from "react-icons/md"
import { CopyToClipboard } from "react-copy-to-clipboard"
import axios from "axios"
import { create } from "ipfs-http-client"

const MyFiles = () => {
    const dispatch = useNotification()
    const [copied, setCopied] = useState(false)
    const [filesObj, setFilesObj] = useState([])
    const [state, setState] = useState(false)
    const [filesNumber, setFilesNumber] = useState(0)

    const [shareModal, setShareModal] = useState("modal-container__target")
    const [pinModal, setPinModal] = useState("modal-container__target")

    const [pinstate, setPinstate] = useState("pick")
    const [inputValueWalletAddress, setInputValueWalletAddress] = useState("")

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

    const handleState = (e) => {
        setPinstate(e.target.value)
    }
    const onInputWalletAddress = (event) => {
        const { value } = event.target
        setInputValueWalletAddress(value)
    }

    function checkIndex(data) {
        return data.fileId > filesObj.length - 5
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

    const renderClass = () => {
        let result
        pinstate === "pick" ? (result = "closed__button") : (result = "pinning__modal__button")

        return result
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

            console.log(error)
        }
    }

    // filebase

    const sendCidToFilebase = async (cid, name, size, date) => {
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
            name: `${name}`,
            meta: {
                size: `${size}`,
                date: `${date}`,
            },
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

            console.log(error)
        }
    }

    // pinata

    const sendFileToPinata = async (cid, name, size, date) => {
        setState(true)
        try {
            const formData = JSON.stringify({
                hashToPin: `${cid}`,
                pinataMetadata: {
                    name: `${name}`,
                    size: `${size}`,
                    date: `${date}`,
                },
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

            console.log(error)
        }
    }

    const navigate = useNavigate()
    const { Moralis, account, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const { runContractFunction: getNumberOfFiles } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "getNumberOfFiles",
        params: {
            user: account,
        },
    })

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

    const handleNewNotification = () => {
        dispatch({
            type: "success",
            message: "File Pinned! Refresh To See Your Files",
            title: "Pinata Pinning",
            position: "topR",
            icon: "bell",
        })
    }

    const handleNewNotification1 = () => {
        dispatch({
            type: "success",
            message: "File Pinned! Refresh To See Your Files",
            title: "Inufa Pinning",
            position: "topR",
            icon: "bell",
        })
    }

    const handleNewNotification2 = () => {
        dispatch({
            type: "success",
            message: "File Pinned! Refresh To See Your Files",
            title: "Filebase Pinning",
            position: "topR",
            icon: "bell",
        })
    }

    const handleNewNotification3 = () => {
        dispatch({
            type: "success",
            message: "File Shared!",
            title: "File Sharing",
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
        setPinModal("modal-container__target")
        handleNewNotification(tx)
        callContract().then((res) => {
            console.log("my res")
            console.log(res)

            setFilesObj(res)
        })
    }

    const handleSuccess1 = async (tx) => {
        await tx.wait(1)
        setState(false)
        setPinModal("modal-container__target")
        handleNewNotification1(tx)
        callContract().then((res) => {
            console.log("my res")
            console.log(res)

            setFilesObj(res)
        })
    }

    const handleSuccess2 = async (tx) => {
        await tx.wait(1)
        setState(false)
        setPinModal("modal-container__target")
        handleNewNotification2(tx)
        callContract().then((res) => {
            console.log("my res")
            console.log(res)

            setFilesObj(res)
        })
    }

    const handleSuccess3 = async () => {
        setState(false)
        handleNewNotification3()
        setShareModal("modal-container__target")
    }

    const handleErrorNotification = (err) => {
        setState(false)
        setPinModal("modal-container__target")
        dispatch({
            type: "error",
            message: `Pinning error ${err.data.message}`,
            title: "Pinning",
            position: "topR",
            icon: "bell",
        })
    }

    const handleErrorNotification1 = () => {
        setState(false)
        setShareModal("modal-container__target")
        dispatch({
            type: "error",
            message: `Sharing Error`,
            title: "Sharing",
            position: "topR",
            icon: "bell",
        })
    }

    async function updateUIValues() {
        const fileNo = await getNumberOfFiles()
        setFilesNumber(fileNo.toString())
    }

    async function sendFile(file) {
        try {
            setState(true)
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const dropbox = new ethers.Contract(raffleAddress, abi, provider.getSigner())
            const d = new Date().getTime()
            await dropbox.sendItem(inputValueWalletAddress, file, d)
            handleSuccess3()
        } catch (error) {
            console.log(error)
            handleErrorNotification1()
        }
    }
    async function callContract() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const dropbox = new ethers.Contract(raffleAddress, abi, provider)
        const filesNo = await dropbox.getNumberOfFiles(account)

        const fileArray = []
        for (let i = 0; i < parseInt(filesNo.toString()); i++) {
            const myFiles = await dropbox.getFiles(account, i)

            fileArray.push(myFiles)
        }

        const promises = fileArray.map(async (item, index) => {
            const fileName = await dropbox.getNameOfFile(item)
            const fileDescription = await dropbox.getFileDescription(item)
            const fileSize = await dropbox.getSizeOfFile(account, item)
            const fileDate = await dropbox.getDateOfFile(account, item)

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

    const renderPin = (cid, name, size, date) => {
        setState(true)
        if (pinstate == "pinata") {
            sendFileToPinata(cid, name, size, date)
        } else if (pinstate == "infura") {
            sendCidToInfura(cid)
        } else if (pinstate == "filebase") {
            sendCidToFilebase(cid, name, size, date)
        } else {
        }
    }

    useEffect(() => {
        updateUIValues()
    }, [isWeb3Enabled])

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
        callContract().then((res) => {
            setFilesObj(res)
        })
    }, [filesNumber])

    return (
        <motion.div
            whileInView={{ x: [-100, 0], opacity: [0, 1] }}
            transition={{ duration: 0.5 }}
            className="table__container"
        >
            <h1 className="table__h1">My Files</h1>

            <table className="table">
                <thead className="thead">
                    <tr className="tr">
                        <th>NAME</th>
                        <th>DESCRIPTION</th>
                        <th>CID</th>
                        <th>SIZE</th>
                        <th>DATE</th>
                        <th>VIEW</th>
                        <th>PIN</th>
                        <th>SHARE</th>
                    </tr>
                </thead>

                {filesObj
                    .filter(checkIndex)
                    .reverse()
                    .map((item, index) => {
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
                                                {item.fileName.slice(item.fileName.length - 5)}
                                            </div>
                                        ) : (
                                            <div className="component">{item.fileName}</div>
                                        )}
                                    </td>
                                    <td data-label="DESCRIPTION">
                                        {item.fileDescription.length > 15 ? (
                                            <div className="component">
                                                <CopyToClipboard
                                                    text={item.fileDescription}
                                                    onCopy={() => copySuccess()}
                                                >
                                                    <MdContentCopy />
                                                </CopyToClipboard>{" "}
                                                {item.fileDescription.slice(0, 15)}...
                                            </div>
                                        ) : (
                                            <div className="component">{item.fileDescription}</div>
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
                                                {item.fileCid.slice(item.fileCid.length - 4)}
                                            </div>
                                        ) : (
                                            <div className="component">{item.fileCid}</div>
                                        )}
                                    </td>
                                    <td data-label="SIZE">{parseInt(item.fileSize) / 10 ** 6}MB</td>
                                    <td data-label="DATE">
                                        {`${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`}
                                    </td>
                                    <td data-label="VIEW">
                                        <a
                                            target="_blank"
                                            href={`https://ipfs.io/ipfs/${item.fileCid}`}
                                        >
                                            <BsFillEyeFill />
                                        </a>
                                    </td>
                                    <td data-label="PIN">
                                        <BsPinAngleFill
                                            onClick={() => {
                                                setPinModal("modal-container")
                                            }}
                                        />
                                    </td>
                                    <td data-label="SHARE">
                                        <FiShare
                                            onClick={() => {
                                                setShareModal("modal-container")
                                            }}
                                        />
                                    </td>
                                </tr>

                                <div className={shareModal}>
                                    <section class="modal">
                                        <header class="modal-header">
                                            <h2 class="modal-title">Sharing This File:</h2>
                                            <span
                                                onClick={() => {
                                                    setShareModal("modal-container__target")
                                                }}
                                                class="modal-close"
                                            >
                                                Close
                                            </span>
                                        </header>
                                        <div class="modal-content">
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault()
                                                    sendFile(item.fileCid)
                                                }}
                                            >
                                                <div className="myfilesInput__div">
                                                    <div className="myfilesInput__input">
                                                        <input
                                                            type="text"
                                                            required
                                                            placeholder="Enter Wallet Address"
                                                            value={inputValueWalletAddress}
                                                            onChange={onInputWalletAddress}
                                                            className="myfilesInput__input__value"
                                                        />
                                                    </div>
                                                    <div className="myfilesInput__button__div">
                                                        <button
                                                            className="pin__button"
                                                            disabled={state}
                                                        >
                                                            {state ? (
                                                                <div className="loader"></div>
                                                            ) : (
                                                                <span className="button__text">
                                                                    Share
                                                                </span>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </section>
                                </div>

                                <div className={pinModal}>
                                    <section class="modal">
                                        <header class="modal-header">
                                            <h2 class="modal-title">Pinning This File:</h2>
                                            <span
                                                onClick={() => {
                                                    setPinModal("modal-container__target")
                                                }}
                                                class="modal-close"
                                            >
                                                Close
                                            </span>
                                        </header>
                                        <div class="modal-content">
                                            <div className="myfiles__modal__div">
                                                <div className="pinning__selector">
                                                    <div className="selector__div">
                                                        <select
                                                            onChange={handleState}
                                                            value={pinstate}
                                                            className="selector"
                                                        >
                                                            <option value="pick" selected>
                                                                Select pinning service
                                                            </option>
                                                            <option value="pinata">Pinata</option>
                                                            <option value="infura">Infura</option>
                                                            <option value="filebase">
                                                                Filebase
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className={renderClass()}>
                                                    <button
                                                        onClick={() => {
                                                            renderPin(
                                                                item.fileCid,
                                                                item.fileName,
                                                                item.fileSize,
                                                                item.fileDate
                                                            )
                                                        }}
                                                        className="pin__button"
                                                        disabled={state}
                                                    >
                                                        {state ? (
                                                            <div className="loader"></div>
                                                        ) : (
                                                            <span className="button__text">
                                                                Pin
                                                            </span>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </tbody>
                        )
                    })}
            </table>

            <div className="title__button__div">
                <button onClick={() => navigate("allFiles")} className="title__button">
                    View All
                </button>
            </div>
        </motion.div>
    )
}

export default MyFiles
