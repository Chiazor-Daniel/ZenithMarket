import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">LottoLuck</h3>
            <p className="text-gray-400">Experience the thrill of winning with our exciting lottery games!</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Games</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Results</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">About Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Privacy Policy</a></li>
            </ul>
          </div>
          
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 LottoLuck. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;