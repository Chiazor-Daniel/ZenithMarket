import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const NavBar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Trade & Buy', path: '/trade-buy' },
    { name: 'Stocks & Market', path: '/stocks-market' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className='fixed box-border w-full h-[80px] flex justify-around items-center px-4 py-2 bg-black border-b border-gray-700' style={{zIndex: 9999}}>
      <img src="zenith.png" className='w-[80px] object-cover'/>
      
      {/* Mobile menu button */}
      <button 
        className='md:hidden text-white'
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop menu */}
      <div className='hidden md:flex space-x-8'>
        {navLinks.map((link, index) => (
          <a
            key={index}
            href={link.path}
            className={`text-lg cursor-pointer text-white ${index === activeIndex ? 'text-[#A068FD]' : ''} hover:text-[#A068FD]`}
            onClick={() => setActiveIndex(index)}
          >
            {link.name}
          </a>
        ))}
      </div>

      <div className='hidden md:block'>
        <button className='text-black px-4 py-2 hover:text-[#A068FD] bg-white border-none rounded-lg'>
          Get Started
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className='md:hidden absolute top-full left-0 right-0 bg-black border-b border-gray-700'>
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.path}
              className={`block py-2 px-4 text-lg cursor-pointer text-white ${index === activeIndex ? 'text-[#A068FD]' : ''} hover:text-[#A068FD]`}
              onClick={() => {
                setActiveIndex(index);
                setIsMenuOpen(false);
              }}
            >
              {link.name}
            </a>
          ))}
          <div className='p-4'>
            <button className='w-full text-black px-4 py-2 hover:text-[#A068FD] bg-white border-none rounded-lg'>
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
