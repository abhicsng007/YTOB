import React from 'react';

function LandingFooter() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 py-6">
      <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-bold text-white mb-4 fade-in-down">
          Convert Videos to Blogs with AI
        </h1>

        <p className="text-lg text-gray-300 mb-8 fade-in-up">
          Effortlessly transform your video content into high-quality blog posts.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 fade-in-up">
          <a href="#features" className="p-6 border border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-2">Features &rarr;</h2>
            <p className="text-gray-400">Discover what our AI tool can do for you.</p>
          </a>

          <a href="#how-it-works" className="p-6 border border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-2">How It Works &rarr;</h2>
            <p className="text-gray-400">Learn how to convert your videos to blogs.</p>
          </a>

          <a href="#pricing" className="p-6 border border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-2">Pricing &rarr;</h2>
            <p className="text-gray-400">Choose a plan that suits your needs.</p>
          </a>

          <a href="#contact" className="p-6 border border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-2">Contact Us &rarr;</h2>
            <p className="text-gray-400">Get in touch with our support team.</p>
          </a>
        </div>
      </main>

      <section id="features" className="py-12 bg-gray-800 w-full my-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Features</h2>
          <p className="text-gray-400">Discover what our AI tool can do for you.</p>
          <div className="bg-gray-700 rounded-lg p-6 mt-8">
            <ul className="list-none">
              <li className="text-lg text-white flex items-center mb-2">
                <span className="text-green-400 mr-2">&#10003;</span> Feature 1
              </li>
              <li className="text-lg text-white flex items-center mb-2">
                <span className="text-green-400 mr-2">&#10003;</span> Feature 2
              </li>
              <li className="text-lg text-white flex items-center mb-2">
                <span className="text-green-400 mr-2">&#10003;</span> Feature 3
              </li>
              {/* Add more features as list items */}
            </ul>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-12 bg-gray-900 w-full">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
    <p className="text-gray-400 mb-8">Learn how to convert your videos to blogs.</p>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-center justify-center">
      {/* Step 1 */}
      <div className="flex flex-col items-center">
        <div className="rounded-full bg-blue-500 text-white w-12 h-12 flex items-center justify-center mb-2">1</div>
        <p className="text-white font-semibold">Step 1</p>
        <p className="text-gray-400 text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
      
      {/* Step 2 */}
      <div className="flex flex-col items-center">
        <div className="rounded-full bg-blue-500 text-white w-12 h-12 flex items-center justify-center mb-2">2</div>
        <p className="text-white font-semibold">Step 2</p>
        <p className="text-gray-400 text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
      
      {/* Step 3 */}
      <div className="flex flex-col items-center">
        <div className="rounded-full bg-blue-500 text-white w-12 h-12 flex items-center justify-center mb-2">3</div>
        <p className="text-white font-semibold">Step 3</p>
        <p className="text-gray-400 text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
      
      {/* Step 4 */}
      <div className="flex flex-col items-center">
        <div className="rounded-full bg-blue-500 text-white w-12 h-12 flex items-center justify-center mb-2">4</div>
        <p className="text-white font-semibold">Step 4</p>
        <p className="text-gray-400 text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
    </div>
  </div>
</section>


      <section id="pricing" className="py-12 bg-gray-800 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Pricing</h2>
          <p className="text-gray-400 mb-8">Choose a plan that suits your needs.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Pricing Card 1 */}
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Basic</h3>
              <p className="text-sm text-gray-400 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p className="text-2xl font-bold text-white mb-2">$9.99</p>
              <p className="text-sm text-gray-400 mb-4">per month</p>
              <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Subscribe</button>
            </div>
            
            {/* Pricing Card 2 */}
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Standard</h3>
              <p className="text-sm text-gray-400 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p className="text-2xl font-bold text-white mb-2">$14.99</p>
              <p className="text-sm text-gray-400 mb-4">per month</p>
              <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Subscribe</button>
            </div>
            
            {/* Pricing Card 3 */}
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Premium</h3>
              <p className="text-sm text-gray-400 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p className="text-2xl font-bold text-white mb-2">$19.99</p>
              <p className="text-sm text-gray-400 mb-4">per month</p>
              <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Subscribe</button>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-12 bg-gray-900 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Contact Us</h2>
          <p className="text-gray-400 mb-8">Get in touch with our support team.</p>
          <form className="max-w-lg mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-300 font-semibold mb-2">Your Name</label>
              <input type="text" id="name" name="name" className="block w-full border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-300 font-semibold mb-2">Your Email</label>
              <input type="email" id="email" name="email" className="block w-full border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-gray-300 font-semibold mb-2">Message</label>
              <textarea id="message" name="message" rows="4" className="block w-full border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
            </div>
            <div className="text-center">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Send Message</button>
            </div>
          </form>
        </div>
      </section>

      <footer className="w-full py-4 border-t border-gray-700 mt-8">
        <div className="flex justify-center items-center">
          <a
            href="https://yourcompany.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:underline"
          >
            Powered by YTOB
          </a>
        </div>
      </footer>
    </div>
  );
}

export default LandingFooter;
