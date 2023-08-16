import Title from './components/Title';
import InputTab from './components/InputTab';
import world from '../assets/world.png';
import Image from "next/image";
import Creataccount from './components/Createaccount';
import Aboutsection from './components/Aboutsection';
import Herosecton from './components/Herosection'
import Community from './components/Community';
import Layout from '@/components/Layout';
import { useState } from 'react';
import { Spinner, Center } from '@chakra-ui/react';



export default function Home() {
  return (
    <Layout status={true} clicked='' secondClick=''>
    <div className='relative'>
      <div className='sm:hidden'>
        <Title />
      </div>
      <div  className=" xxl:hidden sm:w-[330px] sm:text-center xl:hidden">
          <h1 className="sm:text-[30px] sm:font-[900] satoshi sm:w-[330px] text-[#EEEEF0]">Verify <span className='text-[#B21888]'>Certifications</span>  in seconds</h1>
          <p className="sm:w-[300px] sm:font-[400] satoshi text-[#EEEEF0]">Decentralized and secure solution for issuing verifiable certificates to learners and professionals.</p>
        </div>
        <div className="xxl:hidden xl:hidden moving-div satoshi sm:mt-[20px]">For full functionality, please use a desktop browser with Metamask installed</div>

        <div className='relative z-50'>
        <InputTab />
        </div>
          <div className='absolute top-[-40px] xxl:w-[1000px] xl:absolute  xxl:left-[15%] xxl:right-[15%] xl:right-10 xl:left-10 sm:hidden'>
            <Image src={world} alt='world' className='xl:w-[1000px]' />
            </div>
         <Creataccount/>
         <Aboutsection />
         <Herosecton />
         <Community />
    </div>
    </Layout>
  )
}

