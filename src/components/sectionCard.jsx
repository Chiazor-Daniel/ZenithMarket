import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export const SectionCard = ({ data }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.section 
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={`mt-10 text-white p-10 md:flex items-center justify-between space-y-8 md:space-y-0 w-full mx-auto ${!data.reverse ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {/* Left Section */}
      <motion.div className="md:w-1/2 space-y-6">
        <motion.h2 variants={itemVariants} className="text-4xl font-bold">{data.title}</motion.h2>
        <motion.p variants={itemVariants} className="text-gray-400 leading-relaxed">{data.description}</motion.p>
        <motion.ul variants={itemVariants} className="space-y-2">
          {data.points.map((point, index) => (
            <motion.li key={index} variants={itemVariants} className="flex items-center space-x-2">
              <span className="h-3 w-3 bg-green-400 rounded-full"></span>
              <span className='text-xl'>{point}</span>
            </motion.li>
          ))}
        </motion.ul>
        <motion.div variants={itemVariants} className="flex space-x-4">
          {data.buttons.map((button, index) => (
            <motion.a
              key={index}
              href={button.link}
              className={`px-6 py-3 rounded-lg font-semibold text-sm transition ${
                button.primary
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {button.text}
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
      {/* Right Section */}
      <motion.div 
        className="md:w-1/2 flex justify-center"
        variants={itemVariants}
      >
        <motion.div 
          className="relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <img
            src={data.image}
            alt="Economic Evolution"
            className="rounded-lg shadow-md w-[500px]"
          />
          <motion.div 
            className="absolute bottom-4 left-4 bg-green-500 p-3 rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};