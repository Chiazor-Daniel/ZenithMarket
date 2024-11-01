import React from 'react'
import { motion } from 'framer-motion'
import Features from '../components/features'
import FinancialSteps from '../components/finance'
const Services = () => {
  return (
    <div className='py-10 overflow-auto min-h-screen'>
    <motion.div
        className='w-full flex flex-col items-center justify-center'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
    >
        <div className='p-10 lg:w-[70%] h-[400px]'>
        <h1 className='text-left text-3xl md:text-5xl leading-1 font-semibold text-white md:p-10 '>
            Discover your next <br /> digital asset opportunity
          </h1>
            <Features />
        </div>
    </motion.div>    
    </div>
  )
}

export default Services