import React from 'react'
import './Join.css'
import { motion } from 'framer-motion';

import { BiWallet} from 'react-icons/bi';
import { GiArchiveRegister} from 'react-icons/gi';
import { AiOutlineFileText} from 'react-icons/ai';
import { AiOutlineCloudUpload} from 'react-icons/ai';


const Join = () => {
  return (
    <div className='join'>
        <div className='join__head'>
            <h1 className='join__h1'>It's Easy to store your files on the blockchain</h1>
            <p className='join__para'>Store, share and pin your files on the blockchain<br /> and never loose them </p>
        </div>
        <motion.div 
        whileInView={{ x: [-100, 0], opacity: [0, 1] }}
        transition={{ duration: 0.5 }}
        className='join__steps'
        >
          
                <div className='join__icons'>
                    <div className="icons__div">
                        <span className='icon__div'>
                            <BiWallet className='join__icon' />
                        </span>
                   
                    </div>

                    
                   

                    <div className='icon__text'>
                        <h1 className='icon__h1'>Connect Wallet</h1>

                        <p className='icon__para'>Connect your Wallet by using any of the wallet provider at the top</p>
                    </div>

                </div>
               

                <div className='join__icons'>
                    <div className="icons__div">
                        <span className='icon__div'>
                            <GiArchiveRegister className='join__icon' />
                        </span>
                        
                    </div>
                   

                    <div className='icon__text'>
                        <h1 className='icon__h1'>Register your Account</h1>

                        <p className='icon__para'>Input the username you want other users to see and register</p>
                    </div>

                </div>
          
                <div className='join__icons'>
                    <div className="icons__div">
                        <span className='icon__div'>
                            <AiOutlineFileText className='join__icon' />
                        </span>
                        
                    </div>
                   

                    <div className='icon__text'>
                        <h1 className='icon__h1'>Select your File</h1>

                        <p className='icon__para'>Click on the dropbox or drag and drop to select the file to upload</p>
                    </div>

                </div>

                <div className='join__icons'>
                    <div className="icons__div">
                        <span className='icon__div'>
                            <AiOutlineCloudUpload className='join__icon' />
                        </span>
                        
                    </div>
                   

                    <div className='icon__text'>
                        <h1 className='icon__h1'>Upload the File</h1>

                        <p className='icon__para'>Upload the file and wait for your file to be store on the blockchain</p>
                    </div>

                </div>
                   

                        
               
            
                <div className='join__words'>
                   




                </div>


            
              
                
             


         
             
              
           



            
        </motion.div>
    </div>
  )
}

export default Join