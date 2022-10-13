import { useMoralis, useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { ethers } from "ethers"

export const ListFiles = async (account) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const dropbox = new ethers.Contract(contractAddresses[31337], abi, provider)
    const filesNo = await dropbox.getNumberOfFiles(account)

    const fileArray = []

    for (let i = 0; i < parseInt(filesNo.toString()); i++) {
        const myFiles = await dropbox.getFiles(account, i)

        fileArray.push(myFiles)
    }

    const promises = fileArray.map(async (item) => {
        const fileName = await dropbox.getNameOfFile(item)
        const fileDescription = await dropbox.getFileDescription(item)
        const fileSize = await dropbox.getSizeOfFile(account, item)
        const fileDate = await dropbox.getDateOfFile(account, item)

        return {
            fileName: fileName,
            fileDescription: fileDescription,
            fileCid: item,
            fileSize: fileSize.toString(),
            fileDate: fileDate.toString(),
        }
    })

    return Promise.all(promises)
}
