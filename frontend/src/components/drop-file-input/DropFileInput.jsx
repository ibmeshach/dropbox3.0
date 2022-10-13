import React, { useRef, useState, useEffect } from "react"
import PropTypes from "prop-types"
import "./drop-file-input.css"
import axios from "axios"
import { ImageConfig } from "../../config/ImageConfig"
import uploadImg from "../../assets/cloud-upload-regular-240.png"
import registerImg from "../../assets/register.png"
import { abi, contractAddresses } from "../../constants"
import { useNotification } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"

const apiToken = process.env.REACT_APP_WEB3_STORAGE_API_TOKEN
const apiUrlS = "https://api.web3.storage"
const authAxiosS = axios.create({
    baseURL: apiUrlS,
    headers: {
        Authorization: `Bearer ${apiToken}`,
    },
})

const DropFileInput = (props) => {
    const [fileList, setFileList] = useState([])
    const [boolReg, setBoolReg] = useState(false)
    const [state, setState] = useState(false)
    const [inputValueReg, setInputValueReg] = useState("")
    const [descriptionValue, setDescriptionValue] = useState("")
    const [nameValue, setNameValue] = useState("")
    const [username, setUsername] = useState("")

    const [storageObj, setStorageObj] = useState({
        IpfsHash: "",
        PinSize: "",
        Timestamp: "",
        FileName: "",
    })

    const { Moralis, account, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const dispatch = useNotification()

    const {
        runContractFunction: upload,
        data: enterTxResponse,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "upload",

        params: {
            file: storageObj.IpfsHash.toString(),
            size: storageObj.PinSize.toString(),
            date: storageObj.Timestamp.toString(),
            description: descriptionValue.toString(),
            fileName: storageObj.FileName.toString(),
        },
    })

    const {
        runContractFunction: register,
        data: enterTxResponse1,
        isLoading1,
        isFetching1,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "register",
        params: {
            username: inputValueReg.toString(),
        },
    })

    const { runContractFunction: getSuccessfulRegister } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "getSuccessfulRegister",
        params: {
            user: account,
        },
    })

    const { runContractFunction: getUsername } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "getUsername",
        params: {
            user: account,
        },
    })

    const handleNewNotification = () => {
        dispatch({
            type: "success",
            message: "File Uploaded!",
            title: "File Uploaded! Refresh to see your files below",
            position: "topR",
            icon: "bell",
        })
    }

    const handleNewNotification1 = () => {
        dispatch({
            type: "success",
            message: "User Registered Successfully!",
            title: "Registration",
            position: "topR",
            icon: "bell",
        })
    }

    const handleErrorNotification = (err) => {
        setState(false)
        dispatch({
            type: "error",
            message: `Uploading error ${err.data.message}`,
            title: "Uploading",
            position: "topR",
            icon: "bell",
        })
    }

    const handleErrorNotification1 = (err) => {
        setState(false)
        dispatch({
            type: "error",
            message: `Registration error ${err.data.message}`,
            title: "Registration",
            position: "topR",
            icon: "bell",
        })
    }

    const handleErrorNotification2 = () => {
        setState(false)
        dispatch({
            type: "error",
            message: `Uploading error`,
            title: "Uploading",
            position: "topR",
            icon: "bell",
        })
    }

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        setState(false)
        handleNewNotification(tx)
    }

    const handleSuccess1 = async (tx) => {
        await tx.wait(1)
        setState(false)
        updateUIValues()
        handleNewNotification1(tx)
    }

    async function updateUIValues() {
        const boolRegUser = await getSuccessfulRegister()
        const usersname = await getUsername()

        setBoolReg(boolRegUser)
        setUsername(usersname)
    }

    const wrapperRef = useRef(null)

    const onDragEnter = () => wrapperRef.current.classList.add("dragover")

    const onDragLeave = () => wrapperRef.current.classList.remove("dragover")

    const onDrop = () => wrapperRef.current.classList.remove("dragover")

    const onFileDrop = (e) => {
        const newFile = e.target.files[0]
        if (newFile) {
            const updatedList = [newFile]
            setFileList(updatedList)
            props.onFileChange(updatedList)
        }
    }

    const onInputChange = (event) => {
        const { value } = event.target
        setDescriptionValue(value)
    }

    const onInputNameChange = (event) => {
        const { value } = event.target
        setNameValue(value)
    }

    const onInputChangeReg = (event) => {
        const { value } = event.target
        setInputValueReg(value)
    }

    const sendFileToWeb3Storage = async (e) => {
        e.preventDefault()
        setState(true)
        if (fileList[0] && descriptionValue.length > 0) {
            try {
                const formData = new FormData()
                formData.append("file", fileList[0])

                const resFile = await authAxiosS.post(`${apiUrlS}/upload`, formData)

                setStorageObj({
                    IpfsHash: resFile.data.cid,
                    PinSize: fileList[0].size,
                    Timestamp: new Date().getTime(),
                    FileName: nameValue,
                })
            } catch (error) {
                handleErrorNotification2()
                console.log(error)
            }
        } else {
            console.log("no file")
        }
    }

    useEffect(() => {
        if (storageObj.IpfsHash != "") {
            async function update() {
                await upload({
                    onSuccess: handleSuccess,
                    onError: (error) => {
                        handleErrorNotification(error)
                    },
                })
            }

            update()
        }
    }, [storageObj])

    useEffect(() => {
        updateUIValues()
    }, [account])

    return (
        <>
            {!isWeb3Enabled || !boolReg ? (
                <>
                    <div className="drop-file-input">
                        <div className="drop-file-input__label">
                            <img src={registerImg} alt="register" />

                            <p>Register To Get Started</p>
                        </div>
                    </div>

                    <form
                        action=""
                        onSubmit={async (e) => {
                            e.preventDefault()
                            setState(true)

                            await register({
                                onSuccess: handleSuccess1,
                                onError: (error) => {
                                    handleErrorNotification1(error)
                                },
                            })
                        }}
                    >
                        <div className="drop-file-preview">
                            <input
                                required
                                type="text"
                                placeholder="Enter Username"
                                value={inputValueReg}
                                onChange={onInputChangeReg}
                                className="text__input"
                            />

                            <div className="enterbutton__div">
                                <button className="file__button" disabled={state}>
                                    {state ? (
                                        <div className="loader"></div>
                                    ) : (
                                        <span className="button__text">Register</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </>
            ) : (
                <>
                    <div
                        ref={wrapperRef}
                        className="drop-file-input"
                        onDragEnter={onDragEnter}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                    >
                        <div className="drop-file-input__label">
                            <img src={uploadImg} alt="" />
                            <p>Click or Drag & Drop your files here</p>
                            <p>{username}</p>
                        </div>
                        <input type="file" value="" onChange={onFileDrop} />
                    </div>
                    {fileList.length > 0 ? (
                        <form onSubmit={sendFileToWeb3Storage}>
                            <div className="drop-file-preview">
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter File Name"
                                    value={nameValue}
                                    onChange={onInputNameChange}
                                    className="text__input"
                                />
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter File Description"
                                    value={descriptionValue}
                                    onChange={onInputChange}
                                    className="text__input"
                                />
                                <p className="drop-file-preview__title">Ready to upload</p>
                                {fileList.map((item, index) => (
                                    <div key={index} className="drop-file-preview__item">
                                        <div className="drop-file-preview__item-div">
                                            <img
                                                src={
                                                    ImageConfig[item.type.split("/")[1]] ||
                                                    ImageConfig["default"]
                                                }
                                                alt=""
                                            />
                                            <div className="drop-file-preview__item__info">
                                                <p>{item.name}</p>
                                                <p>{item.size}B</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button className="file__button" disabled={state}>
                                    {state ? (
                                        <div className="loader"></div>
                                    ) : (
                                        <span className="button__text">Upload</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : null}
                </>
            )}
        </>
    )
}

DropFileInput.propTypes = {
    onFileChange: PropTypes.func,
}

export default DropFileInput
