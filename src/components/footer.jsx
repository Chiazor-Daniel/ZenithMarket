import React from 'react';
import { ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-between items-start mb-8">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-400 mr-2"></div>
              <div className="w-8 h-8 bg-green-400"></div>
              <h2 className="text-white text-2xl font-bold ml-2">Zenith Market</h2>
            </div>
            <p className="text-sm mb-4">
              Zenith Market is your trusted gateway to the world of cryptocurrency. Dive into a seamless trading experience and explore comprehensive market insights.
            </p>
            <div className="flex space-x-4">
              {/* Optional icons or links could be placed here */}
            </div>
          </div>

          <div className="w-full md:w-1/4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Home</h4>
                <h4 className="text-white font-semibold mb-2">Projects</h4>
                <h4 className="text-white font-semibold mb-2">About</h4>
                <h4 className="text-white font-semibold">Services</h4>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Bitcoin (BTC) Price</h4>
                <h4 className="text-white font-semibold mb-2">Ethereum (ETH) Price</h4>
                <h4 className="text-white font-semibold mb-2">Cardano (ADA) Price</h4>
                <h4 className="text-white font-semibold">More Prices</h4>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 text-sm">
          <div className="flex flex-wrap justify-between">
            <p>&copy; 2024 ZenithMarket. All rights reserved.</p>
            <div className="space-x-4">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
