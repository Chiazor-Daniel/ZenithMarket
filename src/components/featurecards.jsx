import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { RiShieldLine, RiUserLine, RiExchangeDollarLine, RiLineChartLine } from 'react-icons/ri';

const FeatureCard = ({ icon, title, variants }) => (
  <motion.div 
    variants={variants}
    className="hover:bg-gray-700/40 duration-200 cursor-pointer border border-gray-700 rounded p-4 flex flex-col items-center justify-center text-center"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {icon}
    </motion.div>
    <motion.h3 
      className="mt-4 text-lg font-semibold text-white"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {title}
    </motion.h3>
  </motion.div>
);

const CryptoFeatures = () => {
  const features = [
    { icon: <RiShieldLine className="text-5xl text-[#A068FD]" />, title: "Secure Asset" },
    { icon: <RiUserLine className="text-5xl text-[#A068FD]" />, title: "Expert Investment" },
    { icon: <RiExchangeDollarLine className="text-5xl text-[#A068FD]" />, title: "Streamlined Trading" },
    { icon: <RiLineChartLine className="text-5xl text-[#A068FD]" />, title: "Real-Time Analysis" },
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
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
      className="w-full mx-auto"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-10"
        variants={containerVariants}
      >
        {features.map((feature, index) => (
          <FeatureCard key={index} icon={feature.icon} title={feature.title} variants={itemVariants} />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default CryptoFeatures;