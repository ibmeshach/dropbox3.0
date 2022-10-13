import React, { useState, useEffect } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { abi_nft, contractAddresses_nft } from "../constants"
import "./styles/Withdraw.css"

const Withdrawal = () => {
    const [password, setPassword] = useState("")
    const [inputValue, setInputValue] = useState("")
    const onInputChange = (event) => {
        const { value } = event.target
        setInputValue(value)
    }

    const { Moralis, account, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)

    const raffleAddress =
        chainId in contractAddresses_nft ? contractAddresses_nft[chainId][0] : null

    const { runContractFunction: withdrawal } = useWeb3Contract({
        abi: abi_nft,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "withdraw",
        params: {},
    })
    return (
        <div className="with__con">
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    setPassword(inputValue.toString())
                }}
                action=""
            >
                <input
                    type="text"
                    required
                    placeholder="password"
                    value={inputValue}
                    onChange={onInputChange}
                    className="text__input__pinning"
                />
                <button>submit</button>
            </form>

            <div className="with__button">
                {password == "09052133562" && (
                    <button
                        onClick={async () => {
                            await withdrawal({})
                        }}
                    >
                        withdraw
                    </button>
                )}
            </div>
        </div>
    )
}

export default Withdrawal
