"use client";
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope } from 'react-icons/fa';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated } = useAuth();

  return (
    <footer className="bg-[#111827] text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Logo + Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-8 h-8">
                <Image src="/logo.png" alt="BookNest Logo" fill className="object-contain" priority />
              </div>
              <h3 className="text-2xl font-bold text-white">BookNest</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Your one-stop destination for all your book needs. Browse, buy, and enjoy!
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition" title="Facebook">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaInstagram size={20} />
              </a>
              <a href="mailto:info@bookmanager.com" className="text-gray-400 hover:text-white transition">
                <FaEnvelope size={20} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/books" className="text-gray-400 hover:text-white transition">All Books</Link></li>
              <li><Link href="/categories" className="text-gray-400 hover:text-white transition">Categories</Link></li>
              <li><Link href="/new-releases" className="text-gray-400 hover:text-white transition">New Releases</Link></li>
              <li><Link href="/bestsellers" className="text-gray-400 hover:text-white transition">Bestsellers</Link></li>
            </ul>
          </div>

          {/* Customer Service Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition">Contact Us</Link></li>
              <li><Link href="/shipping" className="text-gray-400 hover:text-white transition">Shipping Policy</Link></li>
              <li><Link href="/returns" className="text-gray-400 hover:text-white transition">Returns & Refunds</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition">FAQs</Link></li>
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">My Account</h4>
            <ul className="space-y-2 text-sm">
              {!isAuthenticated && (
                <>
                  <li><Link href="/auth/login" className="text-gray-400 hover:text-white transition">Login</Link></li>
                  <li><Link href="/auth/register" className="text-gray-400 hover:text-white transition">Register</Link></li>
                </>
              )}
              <li><Link href="/orders" className="text-gray-400 hover:text-white transition">Orders</Link></li>
              <li><Link href="/profile" className="text-gray-400 hover:text-white transition">Profile</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {currentYear} BookNest. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}