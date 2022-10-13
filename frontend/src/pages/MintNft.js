import React, { useRef, useState, useEffect } from "react"
import PropTypes from "prop-types"
import "./styles/MintNft.css"
import { abi_nft, contractAddresses_nft } from "../constants"
import { useNavigate } from "react-router-dom"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { motion } from "framer-motion"
import { ethers } from "ethers"

import { ImageConfig } from "../config/ImageConfig"
import uploadImg from "../assets/cloud-upload-regular-240.png"
import registerImg from "../assets/register.png"
import nftLogo from "../assets/nftLogo.png"
import { AiOutlinePlus } from "react-icons/ai"
import { AiFillDelete } from "react-icons/ai"

import axios from "axios"
import { useNotification } from "web3uikit"

const MintNft = (props) => {
    const dispatch = useNotification()
    const [state, setState] = useState(false)
    const [fileList, setFileList] = useState([])
    const [inputValueNftName, setInputValueNftName] = useState("")
    const [inputValueNftDescription, setInputValueNftDescription] = useState("")
    const [inputValueAttribute, setInputValueAttribute] = useState("")
    const [inputValueAttributeValue, setInputValueAttributeValue] = useState("")

    const [imgHash, setImgHash] = useState("")
    const [mintFee, setMintFee] = useState("0")
    const [jsonHash, setJsonHash] = useState("")

    const [attributeValues, setAttributeValues] = useState([])
    const [attributeValues1, setAttributeValues1] = useState([])

    const [images, setImages] = useState([])

    const [nftModal, setNftModal] = useState("modal-container__target")

    const [keyValue, setKeyValue] = useState({})

    const { Moralis, account, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress =
        chainId in contractAddresses_nft ? contractAddresses_nft[chainId][0] : null

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

    const onInputChangeNftName = (event) => {
        const { value } = event.target
        setInputValueNftName(value)
    }

    const onInputChangeNftDescription = (event) => {
        const { value } = event.target
        setInputValueNftDescription(value)
    }

    const onInputChangeAttribute = (event) => {
        const { value } = event.target
        setInputValueAttribute(value)
    }

    const onInputChangeAttributeValue = (event) => {
        const { value } = event.target
        setInputValueAttributeValue(value)
    }

    const sendAttributeValue = () => {
        setAttributeValues([
            ...attributeValues,
            {
                [`${inputValueAttribute}`]: `${inputValueAttributeValue}`,
            },
        ])
        setAttributeValues1([
            ...attributeValues1,
            {
                attribute: `${inputValueAttribute}`,
                value: `${inputValueAttributeValue}`,
            },
        ])

        setNftModal("modal-container__target")
    }

    const { runContractFunction: mintNft } = useWeb3Contract({
        abi: abi_nft,
        contractAddress: raffleAddress,
        functionName: "mintNft",
        msgValue: mintFee,
        params: {
            tokenUri: `ipfs://${jsonHash}`,
            imgUri: jsonHash,
        },
    })

    const { runContractFunction: getFee } = useWeb3Contract({
        abi: [
            {
                inputs: [],
                name: "getUsdPrice",
                outputs: [
                    {
                        internalType: "uint256",
                        name: "",
                        type: "uint256",
                    },
                ],
                stateMutability: "view",
                type: "function",
            },
        ],
        contractAddress: "0x10d33B83d57BFAABDeF4b51c1C2b260404B05b34", // specify the networkId
        functionName: "getUsdPrice",
        params: {},
    })

    const handleNewNotification = () => {
        dispatch({
            type: "success",
            message: "Nft Minted! Wait for your Nft to show",
            title: "Nft Minting",
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
        callUris().then((res) => {
            const finalArray = []
            res.map(async (item) => {
                try {
                    const result = await axios.get(`https://ipfs.io/ipfs/${item.nftUri}/`)
                    const finalObj = {
                        name: result.data.name,
                        description: result.data.description,
                        image: result.data.image.slice(7, result.data.image.length),
                        attribute: result.data.attribute,
                        counter: item.nftCounter,
                    }
                    finalArray.push(finalObj)
                    // console.log(result.data.image)
                    setImages(finalArray.reverse())
                } catch (error) {
                    console.log(error)
                    handleErrorNotification2()
                }
            })
        })
    }

    const handleErrorNotification = (err) => {
        setState(false)

        dispatch({
            type: "error",
            message: ` Nft Minting Error ${err.data.message}`,
            title: "Nft Minting",
            position: "topR",
            icon: "bell",
        })
    }

    const handleErrorNotification1 = () => {
        setState(false)

        dispatch({
            type: "error",
            message: ` Nft Minting Error`,
            title: "Nft Minting",
            position: "topR",
            icon: "bell",
        })
    }

    const handleErrorNotification2 = () => {
        setState(false)

        dispatch({
            type: "error",
            message: `Error Fetching Nft, Please Refresh`,
            title: "Nfts Fetching",
            position: "topR",
            icon: "bell",
        })
    }

    async function callUris() {
        const fee = (await getFee()).toString()
        const price = parseInt(fee) / 10 ** 18
        const price1 = Math.round((0.2 / price) * 10 ** 18).toString()
        setMintFee(price1)

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const nftMint = new ethers.Contract(raffleAddress, abi_nft, provider)
        const tokenCounter = await nftMint.getTokenCounter(account)

        const uriArray = []
        for (let i = 0; i < parseInt(tokenCounter.toString()); i++) {
            const uris = await nftMint.getUserUris(account, i)

            uriArray.push(uris)
        }

        const promises = uriArray.map(async (item, index) => {
            const tokenCounter = await nftMint.getUserUrisToCounter(account, item)

            const data = {
                nftId: index,
                nftUri: item,
                nftCounter: tokenCounter.toString(),
            }
            return data
        })

        return Promise.all(promises)
    }

    const sendFileToPinata = async () => {
        if (fileList[0]) {
            setState(true)
            try {
                const formData = new FormData()
                formData.append("file", fileList[0])
                const resFile = await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    headers: {
                        pinata_api_key: `${process.env.REACT_APP_PINATA_API_KEY}`,
                        pinata_secret_api_key: `${process.env.REACT_APP_PINATA_API_SECRET}`,
                        "Content-Type": "multipart/form-data",
                    },
                })

                console.log(resFile.data.IpfsHash)
                setImgHash(resFile.data.IpfsHash)
            } catch (error) {
                console.log("Error sending File to IPFS: ")
                handleErrorNotification1()
                console.log(error)
            }
        }
    }

    const sendJsonToPinata = async () => {
        try {
            const formData = JSON.stringify({
                name: inputValueNftName,
                description: inputValueNftDescription,
                image: `ipfs://${imgHash}`,
                attributes: attributeValues,
            })
            const resFile = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
                data: formData,
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}`,
                    "Content-Type": "application/json",
                },
            })

            console.log("rrrrrrrr")
            console.log(`ipfs/${resFile.data.IpfsHash}`)
            setJsonHash(resFile.data.IpfsHash)
        } catch (error) {
            console.log("Error sending File to IPFS: ")
            handleErrorNotification1()
            console.log(error)
        }
    }

    // useEffect(() => {
    //     try {
    //         const result = axios.get(
    //             "https://gateway.pinata.cloud/ipfs/QmVfG5XomPgf7HJLPK1Qv1k7Gdt5CEvhPgfXZcHqLzejQz"
    //         )

    //         result.then((res) => {
    //             console.log("result")
    //             console.log(res)
    //         })
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }, [isWeb3Enabled])

    useEffect(() => {
        callUris().then((res) => {
            const finalArray = []
            res.map(async (item) => {
                try {
                    const result = await axios.get(`https://ipfs.io/ipfs/${item.nftUri}/`)
                    const finalObj = {
                        name: result.data.name,
                        description: result.data.description,
                        image: result.data.image.slice(7, result.data.image.length),
                        attribute: result.data.attribute,
                        counter: item.nftCounter,
                    }
                    finalArray.push(finalObj)
                    // console.log(result.data.image)
                    setImages(finalArray.reverse())
                } catch (error) {
                    console.log(error)
                    handleErrorNotification2()
                }
            })
        })
    }, [isWeb3Enabled])

    useEffect(() => {
        if (imgHash) {
            sendJsonToPinata()
        }
    }, [imgHash])

    useEffect(() => {
        if (jsonHash) {
            async function updateUIValues() {
                await mintNft({
                    onSuccess: handleSuccess,
                    onError: (error) => {
                        handleErrorNotification(error)
                    },
                })
            }
            updateUIValues()
        }
    }, [jsonHash])

    const navigate = useNavigate()
    return (
        <div className="mintNft__container">
            <div className="mintNft__box">
                <span className="mintarea__span">
                    <img className="mintlogo" src={nftLogo} alt="logo" />
                </span>
                <div
                    ref={wrapperRef}
                    className="drop-file-input"
                    onDragEnter={onDragEnter}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                >
                    <div className="drop-file-input__label">
                        <img src={uploadImg} alt="" />
                        <p>Click or Drag & Drop your NFT here</p>
                        <p>Mint Fee: $0.2</p>
                    </div>
                    <input type="file" value="" onChange={onFileDrop} />
                </div>
                {fileList.length > 0 ? (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            sendFileToPinata()
                        }}
                        className="drop-file-preview"
                    >
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

                        <div className="mint__text__input">
                            <input
                                type="text"
                                required
                                placeholder="Enter NFT Name"
                                value={inputValueNftName}
                                onChange={onInputChangeNftName}
                                className="text__input__name"
                            />

                            <textarea
                                text="text"
                                required
                                placeholder="Enter NFT Description"
                                value={inputValueNftDescription}
                                onChange={onInputChangeNftDescription}
                                className="text__input__description"
                                rows="10"
                            ></textarea>
                            {attributeValues1.length > 0 ? (
                                <div>
                                    {attributeValues1.map((attribute, index) => (
                                        <div key={index} className="attr__input">
                                            <input
                                                type="text"
                                                placeholder={`${attribute.attribute}: ${attribute.value}`}
                                                className="text__input__attr"
                                                disabled
                                            />
                                            {/* <span
                                                className="attr__delete"
                                                onClick={() => {
                                                    const updatedList = [...attributeValues]
                                                    const updatedObj = { ...keyValue }
                                                    updatedList.splice(index, 1)

                                                    setAttributeValues(updatedList)
                                                }}
                                            >
                                                <AiFillDelete className="attr__delete__icon" />
                                            </span> */}
                                        </div>
                                    ))}
                                </div>
                            ) : null}

                            <div
                                onClick={() => {
                                    setNftModal("modal-container")
                                }}
                                className="add__attributes"
                            >
                                <div className="add__link">
                                    <span className="add__icon__span">
                                        <AiOutlinePlus className="add__icon" />
                                    </span>
                                    <div className="add__text">Add Attributes to your NFT</div>
                                </div>
                            </div>

                            <div className="nft__upload__div">
                                <button disabled={state} className="nft__upload">
                                    {state ? (
                                        <div className="loader"></div>
                                    ) : (
                                        <span className="button__text">Mint</span>
                                    )}
                                </button>
                            </div>
                            <p className="mintFee">Mint Fee: $0.2</p>
                        </div>
                    </form>
                ) : null}
            </div>
            <div className={nftModal}>
                <section class="modal">
                    <header class="modal-header">
                        <h2 class="modal-title">Add Attributes:</h2>
                        <span
                            onClick={() => {
                                setNftModal("modal-container__target")
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
                                sendAttributeValue()
                            }}
                            className="attribute__div"
                        >
                            <div className="attribute__input">
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter Attribute Name"
                                    value={inputValueAttribute}
                                    onChange={onInputChangeAttribute}
                                    className="attribute__input__name"
                                />

                                <input
                                    type="text"
                                    required
                                    placeholder="Enter Attribute Value"
                                    value={inputValueAttributeValue}
                                    onChange={onInputChangeAttributeValue}
                                    className="attribute__input__value"
                                />
                            </div>
                            <div className="attribute__button__div">
                                <button className="attribute__button">Add</button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
            <div className="nft__div">
                <h1 className="nft__h1">My NFT Collection</h1>
                <div className="nft__collections">
                    {images
                        ? images.reverse().map((item, index) => {
                              return (
                                  <div className="nft__div">
                                      <div key={index} className="nft__collection">
                                          <div className="nft__image">
                                              <img
                                                  src={`https://ipfs.io/ipfs/${item.image}`}
                                                  alt="nft"
                                                  className="nft"
                                              />
                                          </div>
                                          <div className="nft__details">
                                              <div className="nft__name">
                                                  <span className="title">Name: </span> {item.name}
                                              </div>
                                              <div className="nft__description">
                                                  <span className="title">
                                                      <b>Description:</b>
                                                  </span>{" "}
                                                  {item.description}
                                              </div>
                                              <div className="nft__button">
                                                  <button className="openSea">
                                                      <a
                                                          target="_blank"
                                                          href={`https://testnets.opensea.io/${account}`}
                                                      >
                                                          {" "}
                                                          View on OpenSea
                                                      </a>
                                                  </button>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              )
                          })
                        : ""}
                </div>
            </div>
        </div>
    )
}

export default MintNft
