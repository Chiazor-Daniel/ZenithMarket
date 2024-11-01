import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Target, Boxes, Smartphone, Bitcoin } from 'lucide-react';

const WhyChooseUsComponent = () => {
  const features = [
    {
      Icon: Target,
      title: 'Real Time Data',
      description: 'Access up-to-the-minute market data to make informed trading decisions. Our platform ensures you stay ahead with accurate and timely information.'
    },
    {
      Icon: Boxes,
      title: 'Blockchain Technology',
      description: 'Leverage the security and transparency of advanced blockchain technology. Our platform integrates cutting-edge features for optimal operational integrity.'
    },
    {
      Icon: Bitcoin,
      title: 'Crypto Mining',
      description: 'Engage in profitable crypto mining through our streamlined processes. Optimize your earnings with our efficient mining solutions designed for maximum yield.'
    },
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        when: "beforeChildren"
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
      className="bg-black text-white p-8 font-sans"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div className="space-y-4" variants={itemVariants}>
            <motion.img 
              src="https://images.pexels.com/photos/6770610/pexels-photo-6770610.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Trading screens" 
              className="w-full rounded-lg object-cover h-64" 
              variants={itemVariants}
            />
            <motion.div 
              className="flex items-center bg-green-400 text-black p-4 rounded-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <motion.span className="text-5xl font-bold mr-4">25</motion.span>
              <motion.span className="text-xl font-semibold">Years of Experience</motion.span>
            </motion.div>
          </motion.div>
          <motion.div className='h-full flex flex-col gap-4' variants={itemVariants}>
            <motion.h2 className="text-5xl font-bold mb-8" variants={itemVariants}>Why Should You Choose</motion.h2>
            <motion.div className="space-y-6" variants={containerVariants}>
              {features.map((feature, index) => (
                <motion.div key={index} className="flex items-start" variants={itemVariants}>
                  <motion.div 
                    className="bg-green-400 text-black p-2 rounded-lg mr-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <feature.Icon size={24} />
                  </motion.div>
                  <div>
                    <motion.h3 className="text-xl font-semibold mb-2">{feature.title}</motion.h3>
                    <motion.p className="text-gray-400">{feature.description}</motion.p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <motion.button 
              className="mt-6 flex items-center text-green-400 hover:text-green-300 transition-colors"
              variants={itemVariants}
              whileHover={{ x: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              View More <ArrowRight className="ml-2" size={20} />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default WhyChooseUsComponent;