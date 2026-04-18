import React from 'react';

export default function About() {
  return (
    <div className="bg-gray-100 min-h-screen py-16 px-4">
      <h1 className="text-4xl font-bold text-green-500 text-center mb-8">About Starphone</h1>
      
      <p className="max-w-3xl mx-auto text-lg text-gray-700 mb-6 leading-relaxed">
        Starphone is a leading retailer of the latest smartphones and accessories. 
        We are committed to providing our customers with high-quality products at competitive prices. 
        Our team carefully selects each device and ensures that you get the best experience when shopping with us.
      </p>

      <p className="max-w-3xl mx-auto text-gray-700 text-lg mb-12 leading-relaxed">
        Founded in 2026, Starphone has rapidly grown into a trusted brand for tech enthusiasts. 
        Whether you are looking for the newest smartphones, accessories, or expert advice, our team is here to help you make the right choice.
      </p>

      <div className="flex flex-wrap justify-center gap-8">
        {/* Mission Card */}
        <div className="bg-white p-6 rounded-xl shadow-md w-72">
          <h3 className="text-green-500 font-semibold text-xl mb-2">Our Mission</h3>
          <p className="text-gray-700">To bring the latest smartphone technology to everyone with excellent service and affordable prices.</p>
        </div>

        {/* Vision Card */}
        <div className="bg-white p-6 rounded-xl shadow-md w-72">
          <h3 className="text-green-500 font-semibold text-xl mb-2">Our Vision</h3>
          <p className="text-gray-700">To be the most trusted and innovative smartphone retailer in the country.</p>
        </div>

        {/* Values Card */}
        <div className="bg-white p-6 rounded-xl shadow-md w-72">
          <h3 className="text-green-500 font-semibold text-xl mb-2">Our Values</h3>
          <p className="text-gray-700">Customer satisfaction, quality, innovation, and integrity in everything we do.</p>
        </div>
      </div>
    </div>
  );
}
