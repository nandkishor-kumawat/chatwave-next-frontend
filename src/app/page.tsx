"use client"
import { motion } from "framer-motion";
import Link from "next/link";
import { FiPhoneCall } from "react-icons/fi";
import { MdOutlineMarkUnreadChatAlt, MdVideoCall } from "react-icons/md";

export default function LandingPage() {
  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="pb-16 bg-gradient-to-r from-blue-500 to-indigo-600 flex flex-col justify-center items-center text-white">
        <div className="min-h-dvh flex flex-col">
          {/* Navbar */}
          <nav className="w-full max-w-7xl flex justify-between p-6">
            <h1 className="text-3xl font-bold">ChatWave</h1>
            <div>
              <Link href="/login" className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-100 transition duration-300">
                Login
              </Link>
            </div>
          </nav>

          {/* Hero Section */}
          <section className="flex flex-col items-center flex-1 justify-center text-center space-y-6">
            <motion.h1
              className="text-5xl font-bold leading-tight"
              initial={{
                opacity: 0,
                y: 50,
                // scale: 0
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1
              }}
            >
              Real-Time Communication, Anytime, Anywhere
            </motion.h1>
            <motion.p
              initial={{
                opacity: 0,
                y: -80,
                // scale: 0
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1
              }}
              className="text-lg max-w-xl">
              Chat, video call, or voice call with friends and colleagues seamlessly on our platform. Stay connected with crystal-clear communication.
            </motion.p>
            <Link href="/signup" className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-100 transition duration-300">
              Get Started
            </Link>
          </section>
        </div>

        {/* Features Section */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl">
          <div className="p-6 bg-white text-indigo-600 rounded-lg shadow-lg text-center space-y-4">
            <MdOutlineMarkUnreadChatAlt className="h-16 mx-auto" size={28} />
            <h3 className="text-2xl font-bold">Real-Time Chat</h3>
            <p>Send messages instantly with friends, family, or colleagues. Keep conversations flowing without interruptions.</p>
          </div>
          <div className="p-6 bg-white text-indigo-600 rounded-lg shadow-lg text-center space-y-4">
            <MdVideoCall className="h-16 mx-auto" size={34} />
            <h3 className="text-2xl font-bold">Video Calls</h3>
            <p>Experience high-quality video calls for meetings, catch-ups, or online hangouts with zero lag.</p>
          </div>
          <div className="p-6 bg-white text-indigo-600 rounded-lg shadow-lg text-center space-y-4">
            <FiPhoneCall className="h-16 mx-auto" size={26} />
            <h3 className="text-2xl font-bold">Voice Calls</h3>
            <p>Make voice calls effortlessly with the highest quality sound, no matter where you are.</p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-16">
          <motion.div
            className="flex flex-col items-center space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-3xl font-bold">Join the Conversation</h2>
            <Link href="/signup" className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-100 transition duration-300">
              Sign Up Now
            </Link>
          </motion.div>
        </section>
      </div>
      {/* Footer */}
      <footer className="w-full p-2 bg-indigo-700 text-white/60 text-center">
        <p>&copy; 2024 ChatWave. All rights reserved.</p>
      </footer>
    </div>
  );
}
