import React, {useState} from 'react'
import TypeWriter from 'typewriter-effect'
import './Head.css'

const Head = () => {
    const [state] = useState({
        title: "A Decentralized Storage DAPP",
        titleTwo: "that enables users",
        
    })


  return (
    <div className='head'>
        <div className="head-intro">
                <div className="head__titles">
                    <div className='head__h1'>{state.title}</div>
                    <div className='head__p'>{state.titleTwo}</div>
               
            
                </div>
                
            
            <div className="head__motion">
                <TypeWriter
                        options={{
                            autoStart: true,
                            loop: true,
                            delay: 40,
                            strings: [
                                "Store Files",
                                "Share Files",
                                "Mint NFTs"
                            ]
                    }}/>
                
            </div>
                
            
        </div>

    </div>
  )
}

export default Head