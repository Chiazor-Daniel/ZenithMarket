import { useEffect, useState } from 'react';
import './App.css';
import WheelOfFortune from './components/wheel';
import NavBar from './components/navbar';
import Footer from './components/footer';
import CountryCodeForm from './components/country';

function App() {
  const [showWheel, setShowWheel] = useState(false);

  const toggleWheel = () => {
    setShowWheel(!showWheel);
  };
  useEffect(()=> {
    setTimeout(()=>{
      setShowWheel(true)
    }, 1000)
  }, [])
  return (
    <div className="bg-black min-h-screen text-white">
      <NavBar />

      {/* Hero Section */}
      <section
        className="h-screen flex flex-col justify-center items-center px-4 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.pexels.com/photos/4677402/pexels-photo-4677402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)`,
        }}
      >
        <h1 className="text-6xl md:text-7xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-500 via-teal-500 to-pink-500 bg-clip-text text-transparent">
          Play Games & Win Big
        </h1>
        <p className="text-xl md:text-2xl text-center mb-8">
          Experience the thrill of winning with our exciting lottery games!
        </p>
        <button onClick={()=>toggleWheel()} className="bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold py-3 px-8 rounded-full text-xl hover:from-blue-600 hover:to-teal-600 transition duration-300">
          Play Now
        </button>
      </section>

      {/* Featured Games Section */}
      <section className="py-16 px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Featured Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {['Lucky Draw', 'Spin Wheel', 'Daily Jackpot'].map((game, index) => (
            <div key={index} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <img
                src={`https://images.pexels.com/photos/${[3279307, 1871508, 3279307][index]}/pexels-photo-${[3279307, 1871508, 3279307][index]}.jpeg`}
                alt={game}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{game}</h3>
                <p className="text-gray-400 mb-4">
                  {index === 0 ? "Draw your luck from our exciting pool of prizes!" :
                    index === 1 ? "Spin the wheel and win amazing rewards!" :
                      "Join our daily jackpot for a chance to win big!"}
                </p>
                <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
                  Play {game}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How to Play Section */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">How to Play</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Choose', desc: 'Select your lucky numbers', icon: '🔢' },
              { title: 'Purchase', desc: 'Buy your ticket online', icon: '💳' },
              { title: 'Win', desc: 'Match the numbers and win big', icon: '🏆' },
            ].map((step, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
          <button className="mt-12 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 px-8 rounded-full text-xl hover:from-pink-600 hover:to-purple-600 transition duration-300">
            Start Playing Now
          </button>
        </div>
      </section>

      {/* You can uncomment the WheelOfFortune component if you want to include it */}
      {showWheel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className=" p-8 rounded-lg relative">
          
            <WheelOfFortune showWheel={showWheel}/>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default App;