'use client';
import { FaTwitter, FaLinkedin, FaGithub, FaFacebook, FaInstagram } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { subscribeUser } from '@/services/subscribe_service';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== 'undefined') {
      const storedUsername = sessionStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, []);

  const handleSubscribe = async () => {
    if (!username || !email) {
      toast.error('Please enter your name and email');
      return;
    }
    try {
      setLoading(true);
      await subscribeUser(username, email);
      toast.success('Thanks for subscribing!');
      setUsername('');
      setEmail('');
    } catch (err: any) {
      toast.error(err?.message || 'Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="w-full bg-gray-900 border-gray-800">
      <div className="mx-auto px-8 py-12 sm:px-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="text-2xl font-bold text-white">
                <Image
                    src="/assets/T_logo.png"
                    alt="Logo"
                    width={140}
                    height={140}
                    className="rounded-full"
                />
            </div>
            <p className="text-gray-400">
              Advanced AI-powered diagnostics for faster, more accurate medical imaging analysis.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <FaLinkedin className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <FaGithub className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <FaInstagram className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/home" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/chatbot" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/diseases" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Diseases
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-blue-500 transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MdEmail className="text-blue-500 text-xl mt-1 mr-3" />
                <span className="text-gray-400">contact@x-detai.com</span>
              </li>
              <li className="flex items-start">
                <MdPhone className="text-blue-500 text-xl mt-1 mr-3" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <MdLocationOn className="text-blue-500 text-xl mt-1 mr-3" />
                <span className="text-gray-400">123 AI Boulevard, Tech City</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Stay Updated</h4>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest in AI diagnostics.
            </p>
            <div className="space-y-2 md:flex-row md:space-y-0 md:space-x-2">
              <input
                type="text"
                placeholder="Your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full mb-2"
              />
              <div className='flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2' >
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-full md:w-auto"
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} X-DetAI. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-500 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-gray-500 hover:text-white text-sm transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}