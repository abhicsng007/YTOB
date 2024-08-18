import React from 'react';
import { useRouter } from 'next/navigation';

export const ListItems = () => {
  return (
    <div className="bg-gray-700 rounded-lg p-6 mt-8 text-left">
            <ul className="list-none">
              <li className="text-lg text-white flex items-center mb-2">
                <span className="text-green-400 mr-2">&#10003;</span> Convert Youtube videos to Blog         </li>
              <li className="text-lg text-white flex items-center mb-2">
                <span className="text-green-400 mr-2">&#10003;</span> Summarize long texts
              </li>
              <li className="text-lg text-white flex items-center mb-2">
                <span className="text-green-400 mr-2">&#10003;</span>Generate AI images for your blog
              </li>
              <li className="text-lg text-white flex items-center mb-2">
                <span className="text-green-400 mr-2">&#10003;</span>Find relevant images for your blog from Pexels and Unsplash
              </li>
              <li className="text-lg text-white flex items-center mb-2">
                <span className="text-green-400 mr-2">&#10003;</span>Generate Facebook/Insta Posts for your Blog
              </li>
              <li className="text-lg text-white flex items-center mb-2">
                <span className="text-green-400 mr-2">&#10003;</span>Convert long youtube videos to shorts.
              </li>
            </ul>
          </div>
  );
}

function LandingFooter() {
 const router = useRouter();

  const handleClick = () => {
    router.push('/sign-up');
  };

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
          <ListItems/>
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
        <p className="text-gray-400 text-center">Copy Youtube video url from Youtube</p>
      </div>
      
      {/* Step 2 */}
      <div className="flex flex-col items-center">
        <div className="rounded-full bg-blue-500 text-white w-12 h-12 flex items-center justify-center mb-2">2</div>
        <p className="text-white font-semibold">Step 2</p>
        <p className="text-gray-400 text-center">Paste Youtube video url in input box</p>
      </div>
      
      {/* Step 3 */}
      <div className="flex flex-col items-center">
        <div className="rounded-full bg-blue-500 text-white w-12 h-12 flex items-center justify-center mb-2">3</div>
        <p className="text-white font-semibold">Step 3</p>
        <p className="text-gray-400 text-center">Click Generate Button and Your Blog is ready</p>
      </div>
      
      {/* Step 4 */}
      <div className="flex flex-col items-center">
        <div className="rounded-full bg-blue-500 text-white w-12 h-12 flex items-center justify-center mb-2">4</div>
        <p className="text-white font-semibold">Step 4</p>
        <p className="text-gray-400 text-center">Click edit button to edit text and click image icon on top right to add screenshots and ai images</p>
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
            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-white mb-2 ">Neural</h3>
              <p className="text-2xl font-bold text-white mb-2">$9.99 <em className='text-xs text-gray-300'>(100 credits)</em></p>
              <p className="text-sm text-gray-400 mb-4">per month</p>
              <ListItems/>
              <button onClick={handleClick} className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Subscribe</button>
            </div>
            
            {/* Pricing Card 2 */}
            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-white mb-2">Synapse</h3>
              <p className="text-sm text-gray-400 mb-4"></p>
              <p className="text-2xl font-bold text-white mb-2">$29.99 <em className='text-xs text-gray-300'>(500 credits)</em></p>
              <p className="text-sm text-gray-400 mb-4">per month</p>
              <ListItems/>
              <button onClick={handleClick} className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Subscribe</button>
            </div>
            
            {/* Pricing Card 3 */}
            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-white mb-2">Quantum</h3>
              <p className="text-2xl font-bold text-white mb-2">$49.99 <em className='text-xs text-gray-300'>(1000 credits)</em></p>
              <p className="text-sm text-gray-400 mb-4">per month</p>
              <ListItems/>
              <button onClick={handleClick} className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Subscribe</button>
            </div>
          </div>
        </div>
      </section>

      <section id="footer" className="py-12 bg-gray-900 w-full">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      {/* Company Info */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-4">YTOB</h2>
        <p className="text-gray-400 mb-4">We are dedicated to providing the best service.</p>
        <p className="text-gray-400">© {new Date().getFullYear()} Company Name. All rights reserved.</p>
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
        <ul>
          <li className="mb-2"><a href="#home" className="text-gray-400 hover:text-white">Home</a></li>
          <li className="mb-2"><a href="#about" className="text-gray-400 hover:text-white">About Us</a></li>
          <li className="mb-2"><a href="#services" className="text-gray-400 hover:text-white">Services</a></li>
          <li className="mb-2"><a href="#contact" className="text-gray-400 hover:text-white">Contact</a></li>
        </ul>
      </div>

      {/* Resources */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Resources</h3>
        <ul>
          <li className="mb-2"><a href="#faq" className="text-gray-400 hover:text-white">FAQ</a></li>
          <li className="mb-2"><a href="#blog" className="text-gray-400 hover:text-white">Blog</a></li>
          <li className="mb-2"><a href="#support" className="text-gray-400 hover:text-white">Support</a></li>
        </ul>
      </div>

      {/* Social Media Links */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Follow Us</h3>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-400 hover:text-white">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </div>
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
