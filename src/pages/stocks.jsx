import React from 'react'
import { motion } from 'framer-motion'
import ForexView from '../components/tradingview/forex'
const Stocks = () => {
    return (
        <div className='pb-10'>
            <motion.div
                className='h-[800px] w-full flex flex-col items-center justify-center'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <h1 className='text-white font-bold text-3xl max-sm:p-4 md:text-5xl max-sm:text-center'>Stocks</h1>
                <motion.div
                    className='relative mt-10'
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <img src='https://template-kit.evonicmedia.com/layout93/wp-content/uploads/2024/07/Frame-93.png' className='' />
                    {/* <motion.img src='coin1.png' className='absolute top-0 right-0' initial={{ y: -50 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} /> */}
                    {/* <motion.img src='coin2.png' className='absolute bottom-10 right-[200px] hidden md:flex' initial={{ x: 50 }} animate={{ x: 0 }} transition={{ duration: 0.5, delay: 0.3 }} /> */}
                    <motion.img src='coin3.png' className='absolute top-6 left-[220px] hidden md:flex' initial={{ y: -50 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} />
                    {/* <motion.img src='coin4.png' className='absolute top-[100px] right-[220px] hidden md:flex' initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.5 }} /> */}
                    <motion.img src='coin5.png' className='absolute bottom-[100px]' initial={{ y: 50 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} />
                    {/* <motion.img src='coin6.png' className='absolute bottom-6 left-[250px] hidden md:flex' initial={{ x: -50 }} animate={{ x: 0 }} transition={{ duration: 0.5, delay: 0.7 }} /> */}
                </motion.div>
                <motion.div
                    className='w-full flex items-center flex-col gap-2'
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                </motion.div>
            </motion.div>
            <div className='lg:w-[80%] mx-auto'>
                <ForexView />
            </div>
        </div>
    )
}

export default Stocks