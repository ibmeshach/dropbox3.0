import React from 'react'
import './styles/about.css'
import p1 from '../assets/p1.png'
import p2 from '../assets/p2.png'
import p3 from '../assets/p3.png'
import hero from '../assets/blk.webp'

import { FaEthereum } from 'react-icons/fa';
import { SiBinance } from 'react-icons/si';
import { AiOutlineSafety } from 'react-icons/ai';
import { AiOutlinePushpin } from 'react-icons/ai';
import { GiQuickSlash } from 'react-icons/gi';
import { motion } from 'framer-motion';
import { FaStar } from "react-icons/fa";
import { BiWallet} from 'react-icons/bi';
import { MdPayment} from 'react-icons/md';

const About = () => {
  return (
    <motion.div
      whileInView={{ x: [300, 0], opacity: [0, 1] }}
      transition={{ duration: 0.7 }}
    >
      <div className='about'>
        <div className='main'>
          <img src={hero} />
          <div className='about-text'>
            <h1>About Us</h1>
            <h5>CodePeeps <span> Developers & Designers </span> </h5>
            <p>
                We are a team of software engineers that provide tech services to the public.
                Our team compromises of Web Developers, Blockchain Developers, UI/UX Designers
                Data Scientist, Mobile App Developers and many more. <br />
                Dropbox3.0, one of our numerous projects is a decentralized storage platform where you can store files on the blockchain
                and also share these files through the blockchain.
                Storing files on Dropbox3.0 eliminates the risk of loosing the files. Users can add friends and share their files with them.
                Users can also pin their files on ipfs and store on the blockchain.
            </p>
            <button type='buttton'>Let's Talk</button>
          </div>
        </div>
        <div className='service'>
          <h1>Why you Trust our sevices</h1>
          <div className='block'>
            <motion.div
              whileHover={{ scale: 0.97 }}
            >
              <div className='card'>
                <span className="icon-block">
                  <AiOutlineSafety className='icon' />
                </span>
                <h1>Safe and Secure</h1>
                <p>The whole process of storing files on Dropbox3.0 is completely decentralized</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 0.97 }}
            >
              <div className='card'>
                <span className="icon-block">
                  <AiOutlinePushpin className='icon' />
                </span>
                <h1>Other Pinning Service</h1>
                <p>Dropbox3.0 has multiple Pinning services that ensures the persistency of your files </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 0.97 }}
            >
              <div className='card'>
                <span className="icon-block">
                  <GiQuickSlash className='icon' />
                </span>
                <h1>Quick and Cheap</h1>
                <p>The whole is quick and cheap. All your do is pay gas fees to the nodes storing the files</p>
              </div>
            </motion.div>

          </div>
        </div>

        <div className='user'>
          <h1>What User Say About Us</h1>
          <div className="p-text">
            <p>
              Here are some of the testimonials from our users<br />
               
            </p>
          </div>

          <div className='block'>
            <motion.div
              whileHover={{ scale: 0.97 }}
            >
              <div className='card'>
                <span className='star'>
                  <FaStar color={"orange"} />
                  <FaStar color={"orange"} />
                  <FaStar color={"orange"} />
                  <FaStar color={"orange"} />
                </span>
                <p>I store my files on Dropbox3.0 without the fear of me loosing the files. It is just like having a hardrive on the net</p>
                <span className="img-block">
                  <img src={p3} alt="user picture" />
                  <div>
                    <h3 className="name">Ibmeshach</h3>
                    <p className="title">User</p>
                  </div>
                </span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 0.97 }}
            >
              <div className='card'>
                <span className='star'>
                  <FaStar color={"orange"} />
                  <FaStar color={"orange"} />
                  <FaStar color={"orange"} />
                  <FaStar color={"orange"} />
                </span>
                <p> Dropbox3.0 is cheap and easy to use. I do not need to pay any central server to store my files for me, I save money </p>
                <span className="img-block">
                  <img src={p1} alt="user picture" />
                  <div>
                    <h3 className="name">rodney</h3>
                    <p className="title">user</p>
                  </div>
                </span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 0.97 }}
            >
              <div className='card'>
                <span className='star'>
                  <FaStar color={"orange"} />
                  <FaStar color={"orange"} />
                  <FaStar color={"orange"} />
                  <FaStar color={"orange"} />
                </span>
                <p>I also use Dropbox3.0 to mint, pin my Nfts and also store them on the blockchain. it has been a really helpful tool.</p>
                <span className="img-block">
                  <img src={p2} alt="user picture" />
                  <div>
                    <h3 className="name">BigJoe</h3>
                    <p className="title">User</p>
                  </div>
                </span>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default About