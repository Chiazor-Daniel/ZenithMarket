import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import bag from '../../public/bag.png'; // Ensure the path is correct
import phone from '../../public/phone.png';
import coin from '../../public/coin.png';
import buy from '../../public/buy.png';

const FeatureCard = ({ style, children, variants }) => (
  <motion.div
    className="flex flex-col p-5 rounded-xl h-full text-white text-left"
    style={style}
    variants={variants}
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300, damping: 10 }}
  >
    {children}
  </motion.div>
);

function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <motion.div 
      ref={ref}
      className=""
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <motion.div className="mx-auto grid md:grid-cols-3 gap-4 md:h-[800px] py-8" variants={containerVariants}>
        <FeatureCard 
          style={{ backgroundImage: `url(${bag})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          variants={itemVariants}
        >
          <div className='flex flex-col gap-4 py-6 px-4'>
            <motion.h3 className="text-4xl font-bold" variants={itemVariants}>ZenithMarket <br /> Wallet</motion.h3>
            <motion.p className='hidden md:flex' variants={itemVariants}>Securely store, manage, and exchange your digital currencies with ZenithMarket Wallet. Experience seamless crypto transactions at your fingertips.</motion.p>
            <motion.button 
              className="text-gray-400 p-4 w-1/3"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Get Started
            </motion.button>
          </div>
        </FeatureCard>

        <motion.div className='h-full flex flex-col gap-4' variants={itemVariants}>
          <FeatureCard 
            style={{ backgroundImage: `url(${phone})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            variants={itemVariants}
          >
            <div className='flex flex-col gap-1 py-6 px-4'>
              <motion.h3 className="text-4xl font-bold" variants={itemVariants}>Swift Trading</motion.h3>
              <motion.p variants={itemVariants}>Variety of assets</motion.p>
              <motion.button 
                className="text-gray-400 p-2 w-[100px]"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Get Started
              </motion.button>
            </div>
          </FeatureCard>

          <FeatureCard 
            style={{ backgroundImage: `url(${coin})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            variants={itemVariants}
          >
            <div className='flex flex-col gap-1 py-6 px-4'>
              <motion.h3 className="text-4xl font-bold" variants={itemVariants}>Spot Trading</motion.h3>
              <motion.p variants={itemVariants}>Flexible</motion.p>
              <motion.button 
                className="text-gray-400 p-2 w-[100px]"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Get Started
              </motion.button>
            </div>
          </FeatureCard>
        </motion.div>

        <FeatureCard 
          style={{ backgroundImage: `url(${buy})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          variants={itemVariants}
        >
          <div className='flex flex-col gap-4 py-6 px-4'>
            <motion.h3 className="text-4xl font-bold" variants={itemVariants}>Instant Buy <br /></motion.h3>
            <motion.p variants={itemVariants}>Securely store, manage, and exchange your digital currencies with ZenithMarket Wallet. Experience seamless crypto transactions at your fingertips.</motion.p>
            <motion.button 
              className="text-gray-400 p-4 w-1/3"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Get Started
            </motion.button>
          </div>
        </FeatureCard>
      </motion.div>
    </motion.div>
  );
}

export default Features;