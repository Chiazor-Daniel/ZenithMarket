import React from 'react';

const FinancialSteps = () => {
  const steps = [
    { number: 1, title: 'Connect Your Accounts', description: 'Lorem ipsum dolor amet consectetur. Tristique aliquam pretium.', buttonText: 'Get Started', highlight: true },
    { number: 2, title: 'Explore Markets', description: 'Lorem ipsum dolor amet consectetur. Tristique aliquam pretium.' },
    { number: 3, title: 'Analyze Trends', description: 'Lorem ipsum dolor amet consectetur. Tristique aliquam pretium.' },
    { number: 4, title: 'Execute Trades', description: 'Lorem ipsum dolor amet consectetur. Tristique aliquam pretium.' },
  ];

  return (
    <div className="flex flex-col md:flex-row bg-gray-900 text-white">
      {steps.map((step, index) => (
        <div key={step.number} className={`flex-1 p-6 ${step.highlight ? 'bg-emerald-400 text-gray-900' : ''}`}>
          <div className={`inline-block px-2 py-1 mb-4 text-sm font-bold ${step.highlight ? 'bg-white' : 'bg-emerald-400 text-gray-900'}`}>
            {step.number}
          </div>
          <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
          <p className="mb-4">{step.description}</p>
          {step.buttonText && (
            <button className="bg-white text-gray-900 px-4 py-2 rounded-full inline-flex items-center">
              {step.buttonText}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default FinancialSteps;
