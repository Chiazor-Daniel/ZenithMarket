import React from 'react'

const NavBar = () => {
    const navLinks = ['Home', 'Raffles', 'Games', 'Contact'];
    return (
        <nav
            className='absolute top-0 left-0 w-full rounded-b-full flex justify-around p-4 backdrop-blur-lg bg-black/30'
        >
            <div className='flex justify-around w-full items-center'>
                <div className='flex gap-10'>
                    {navLinks.map((link, index) => (
                        <a
                            key={index}
                            href={`#${link.toLowerCase()}`}
                            className='text-white text-lg font-semibold hover:text-gray-300'
                        >
                            {link}
                        </a>
                    ))}
                </div>
                <button className="bg-black text-white font-bold py-2 px-8 rounded-full text-xl hover:from-blue-600 hover:to-teal-600 transition duration-300">
                    Join Us
                </button>
            </div>
        </nav>
    )
}

export default NavBar