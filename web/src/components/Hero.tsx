import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grain">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-indigo-950" />

      {/* Decorative shapes */}
      <div className="absolute top-20 -right-20 w-96 h-96 rounded-full bg-accent-green/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-accent-yellow/10 blur-3xl" />
      <div className="absolute top-1/3 left-1/4 w-64 h-64 border-2 border-accent-sky/10 rounded-full rotate-45" />

      {/* Angled accent bar */}
      <div className="absolute top-0 right-0 w-2/3 h-2 bg-gradient-to-r from-accent-green via-accent-yellow to-accent-sky transform -skew-x-12" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-2 mb-6 text-sm font-semibold tracking-widest uppercase bg-accent-green/20 text-accent-green rounded-full border border-accent-green/30">
            ACE BASKETBALL LEAGUE
          </span>
        </motion.div>

        <motion.h1
          className="font-heading text-6xl md:text-8xl lg:text-9xl font-black leading-none mb-6"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <span className="text-white">The</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-yellow via-accent-green to-accent-sky">
            Ace
          </span>
        </motion.h1>

        <motion.p
          className="max-w-xl mx-auto text-lg md:text-xl text-gray-300 mb-10 font-body"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          The ultimate basketball tournament for girls only. Showcase your
          skills, compete for glory, and be part of The Ace championship.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
        >
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold text-navy-900 bg-accent-yellow rounded-xl hover:bg-yellow-400 transition-all duration-300 shadow-lg shadow-accent-yellow/25 hover:shadow-accent-yellow/40 hover:-translate-y-0.5"
          >
            Register Now
            <ChevronRight className="w-5 h-5" />
          </Link>
          <a
            href="#event-info"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold text-white border-2 border-white/20 rounded-xl hover:border-accent-sky/50 hover:text-accent-sky transition-all duration-300"
          >
            Learn More
          </a>
        </motion.div>

        {/* Logo decorative element */}
        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <img
            src="/logo.png"
            alt="Basketball Competition Logo"
            className="w-40 h-40 md:w-56 md:h-56 object-contain drop-shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
