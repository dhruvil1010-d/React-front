import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();

  // Animations
  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1, transition: { duration: 0.6 } },
    out: { opacity: 0, transition: { duration: 0.4 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <motion.div 
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className="min-h-screen bg-gray-50/50 relative overflow-hidden flex flex-col"
    >
      {/* Decorative Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 pointer-events-none"></div>

      {/* Navigation */}
      <nav className="p-6 relative z-10 max-w-7xl mx-auto w-full">
        <button 
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium"
        >
          <ArrowLeft size={20} /> Back to Home
        </button>
      </nav>

      <div className="flex-1 max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10 w-full flex flex-col items-center justify-center">
        
        {/* Header Section */}
        <motion.div 
          variants={titleVariants}
          initial="hidden"
          animate="show"
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">StarPhone</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-medium">
            Redefining the way you experience and purchase the latest smartphone technology. Premium devices, unmatched service.
          </p>
        </motion.div>

        {/* Content Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-24"
        >
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Founded in 2026, StarPhone has rapidly grown into a trusted brand for tech enthusiasts. 
            We are committed to providing our customers with high-quality products at competitive prices. 
            Our team carefully selects each device and ensures that you get the best experience when shopping with us.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Whether you are looking for the newest flagships, essential accessories, or expert advice, 
            our dedicated team is here to help you make the perfect choice for your digital lifestyle.
          </p>
        </motion.div>

        {/* Cards Section */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto"
        >
          {/* Mission Card */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -10 }}
            className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Target size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-500 leading-relaxed">
              To bring the latest smartphone technology to everyone with excellent service, transparent pricing, and unparalleled support.
            </p>
          </motion.div>

          {/* Vision Card */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -10 }}
            className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Eye size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-500 leading-relaxed">
              To be the most trusted, innovative, and customer-centric smartphone retailer in the country, setting the standard for the industry.
            </p>
          </motion.div>

          {/* Values Card */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -10 }}
            className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Sparkles size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
            <p className="text-gray-500 leading-relaxed">
              Customer satisfaction, uncompromising quality, continuous innovation, and deep integrity in everything we do.
            </p>
          </motion.div>
        </motion.div>

      </div>
    </motion.div>
  );
}
