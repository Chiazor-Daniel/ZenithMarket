import React, { useState } from 'react';
import { motion } from 'framer-motion';
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false);
    setIsError(false);

    try {
      // Replace with your form submission logic
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating a network request

      // On success
      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      // On error
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='bg-black min-h-screen flex flex-col items-center justify-center'>
      <motion.div
        className='h-[800px] w-full flex flex-col items-center justify-center'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className='mt-10 text-white font-bold text-3xl max-sm:p-4 md:text-5xl max-sm:text-center'>Get in touch</h1>
        <p className='text-md p-2 text-gray-400 '>
          Feel free to reach out
        </p>


        <motion.div
          className='w-full flex items-center flex-col gap-2'
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
        </motion.div>
        <div className='w-full md:w-1/2 p-4  md:p-8 bg-gray-700/50 rounded-lg shadow-lg mt-2'>
          <h1 className='text-2xl font-bold mb-6 text-white'>Contact Us</h1>
          {isSuccess && <p className='text-green-500 mb-4'>Message sent successfully!</p>}
          {isError && <p className='text-red-500 mb-4'>An error occurred. Please try again.</p>}
          <form onSubmit={handleSubmit} className='space-y-4 '>
            <div>
              <label htmlFor='name' className='block text-sm font-medium text-gray-200'>Name</label>
              <input
                type='text'
                id='name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
                className='mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </div>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-200'>Email</label>
              <input
                type='email'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                required
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </div>
            <div>
              <label htmlFor='subject' className='block text-sm font-medium text-gray-200'>Subject</label>
              <input
                type='text'
                id='subject'
                name='subject'
                value={formData.subject}
                onChange={handleChange}
                required
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </div>
            <div>
              <label htmlFor='message' className='block text-sm font-medium text-gray-200'>Message</label>
              <textarea
                id='message'
                name='message'
                value={formData.message}
                onChange={handleChange}
                required
                rows='4'
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              ></textarea>
            </div>
            <div>
              <button
                type='submit'
                disabled={isSubmitting}
                className='w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>



    </div>
  );
};

export default ContactForm;
