"use client";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useState, memo, useEffect } from 'react';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSignOutAlt, FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// SearchBar Component
const SearchBar = memo(({ onMobile = false }: { onMobile?: boolean }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/books/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative ${onMobile ? 'mb-4 w-full' : 'w-full'}`}>
      <input
        type="text"
        placeholder="Search books..."
        className={`${onMobile ? 'w-full py-2' : 'w-full py-1.5'} px-3 pr-10 rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-transparent transition-all duration-200`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button type="submit" title="Search" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors duration-200">
        <FaSearch size={16} />
      </button>
    </form>
  );
});
SearchBar.displayName = 'SearchBar';

// AuthLinks Component
const AuthLinks = memo(({ isMobile = false }: { isMobile?: boolean }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('.user-dropdown-container')) {
          setDropdownOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  if (isAuthenticated) {
    if (isMobile) {
      return (
        <>
          <Link href="/profile" className="text-gray-700 hover:text-teal-600 py-2 transition-colors duration-200">
            Profile
          </Link>
          <Link href="/orders" className="text-gray-700 hover:text-teal-600 py-2 transition-colors duration-200">
            Orders
          </Link>
          <button
            onClick={logout}
            className="text-left text-gray-700 hover:text-teal-600 py-2 flex items-center transition-colors duration-200"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </>
      );
    }

    return (
      <div className="relative user-dropdown-container">
        <button
          className="flex items-center space-x-2 text-gray-700 hover:text-teal-600 transition-colors duration-200 py-2 px-3 rounded-full hover:bg-gray-50"
          onClick={toggleDropdown}
        >
          <FaUser className="text-lg" />
          <span className="font-medium">{user?.name?.split(' ')[0]}</span>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-100">
            <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors duration-200">
              Profile
            </Link>
            <Link href="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors duration-200">
              Orders
            </Link>
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors duration-200 flex items-center"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        )}
      </div>
    );
  }

  if (isMobile) {
    return (
      <>
        <Link href="/auth/login" className="text-gray-700 hover:text-teal-600 py-2 transition-colors duration-200">
          Login
        </Link>
        <Link href="/auth/register" className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 inline-block transition-colors duration-200 font-medium">
          Sign Up
        </Link>
      </>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <Link href="/auth/login" className="text-gray-700 hover:text-teal-600 px-3 py-1.5 transition-colors duration-200">
        Login
      </Link>
      <Link href="/auth/register" className="bg-teal-600 text-white px-4 py-1.5 rounded-md hover:bg-teal-700 transition-colors duration-200 font-medium">
        Sign Up
      </Link>
    </div>
  );
});
AuthLinks.displayName = 'AuthLinks';

// Main Navbar
export default function Navbar() {
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-2 py-2 md:px-0">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-teal-600 flex items-center gap-2">
            <div className="relative w-8 h-8">
              <Image src="/logo.png" alt="BookNest Logo" fill className="object-contain" priority />
            </div>
            <span>BookNest</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/books" className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200">
              Books
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200">
              Categories
            </Link>
          </div>

          {/* SearchBar Desktop */}
          <div className="hidden md:block w-96 mx-4">
            <SearchBar />
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart" className="relative text-gray-700 hover:text-teal-600 transition-colors duration-200">
              <FaShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs rounded-full px-1.5 py-0.5">{totalItems}</span>
              )}
            </Link>
            <AuthLinks />
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={toggleMenu} className="md:hidden text-gray-700 hover:text-teal-600">
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-3">
            <Link href="/books" className="block text-gray-700 hover:text-teal-600 transition-colors duration-200">
              Books
            </Link>
            <Link href="/categories" className="block text-gray-700 hover:text-teal-600 transition-colors duration-200">
              Categories
            </Link>
            <SearchBar onMobile />
            <Link href="/cart" className="block text-gray-700 hover:text-teal-600 transition-colors duration-200">
              <div className="flex items-center">
                <FaShoppingCart className="mr-2" />
                Cart ({totalItems})
              </div>
            </Link>
            <AuthLinks isMobile />
          </div>
        )}
      </div>
    </nav>
  );
}