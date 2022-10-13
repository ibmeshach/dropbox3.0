import React, {useState, useEffect, useRef} from 'react'
import './NftCta.css'

import nftImage from '../../assets/nftImage.jpg';
import nftImage1 from '../../assets/nftImage1.jpg';
import nftImage2 from '../../assets/nftImage2.jpg';
import nftImage3 from '../../assets/nftImage3.jpg';
import TypeWriter from 'typewriter-effect'


import './NftCta.css'

const images = [nftImage, nftImage1, nftImage2, nftImage3]
const colors = ["#0088FE", "#00C49F", "#FFBB28"];


const NftCta = () => {

const delay = 2500;


  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === colors.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );

    return () => {
      resetTimeout();
    };
  }, [index]);

   

    return (
        <div className="NftCta__container">
            <div className="NftCta__info">
                <div className="NftCta__header">
                    <h1 className="NftCta__h1">Mint your first NFT on Dropbox3.0</h1>
                    <p className="NftCta__p">
                        <TypeWriter
                            options={{
                            autoStart: true,
                            loop: true,
                            delay: 40,
                            strings: [
                                "Mint NFTs",
                                "Add your NFT to your Dropbox3.0 collection",
                                "View your NFTs on OpenSea"
                            ]
                        }}/>
             </p>
                </div>
                
                <div className="enterbutton__div__NftCta">
                    <button className="enter__button__NftCta">
                        <span className="button__text">Mint</span>  
                    </button>
                </div>

            </div>
            <div className="NftCta__img">
                <div className="slideshow">
                    <div
                        className="slideshowSlider"
                        style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
                    >
                        {images.map((image, index) => (
                        <div
                            className="slide"
                            key={index}
                            
                        ><img src={image} alt="nftImage" className='nft' /></div>
                        ))}
                    </div>
            
                    <div className="slideshowDots">
                        {colors.map((_, idx) => (
                        <div
                            key={idx}
                            className={`slideshowDot${index === idx ? " active" : ""}`}
                            onClick={() => {
                            setIndex(idx);
                            }}
                        ></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
       
      );
    

}

export default NftCta