import React, { useEffect } from 'react';
import 'intl-tel-input/build/css/intlTelInput.css'; // Import the intl-tel-input CSS
import intlTelInput from 'intl-tel-input';

const CountryCodeForm = () => {
  useEffect(() => {
    const input = document.querySelector("#mobile_code");

    // Initialize intl-tel-input
    intlTelInput(input, {
      initialCountry: "in",
      separateDialCode: true,
      // Uncomment the next line if you need utilsScript
      // utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/11.0.4/js/utils.js"
    });
  }, []);

  return (
    <section className="pt-5 pb-5 bg-gray-100">
      <div className="container mx-auto text-center">
        <div className="mb-5">
          <h4>
            <a href="https://intl-tel-input.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              Country Code Selection
            </a>
          </h4>
        </div>

        <div className="flex justify-center">
            <form>
              <div className="mb-4">
                <input
                  type="text"
                  id="mobile_code"
                  className="w-full p-3 border border-gray-300 rounded-md text-gray-700 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Phone Number"
                />
              </div>
            </form>
        </div>
      </div>  
    </section>
  );
};

export default CountryCodeForm;
