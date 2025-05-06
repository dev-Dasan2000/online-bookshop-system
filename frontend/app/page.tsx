'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  FaChild,
  FaHandsHelping,
  FaFlask,
  FaStar,
  FaHistory,
  FaSearch,
  FaShoppingCart,
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
  FaBook,
  FaUserCircle,
  FaSignInAlt
} from 'react-icons/fa';

// Book Card Component
const BookCard = ({ book }) => {
  const { id, title, authors, price, thumbnail } = book;

  return (
    <div className="relative group w-full">
      <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded">
        SALE
      </div>
      <Link href={`/books/${id}`}>
        <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 group-hover:shadow-xl h-full flex flex-col">
          <div className="h-48 sm:h-56 md:h-64 overflow-hidden flex items-center justify-center bg-gray-100">
            {thumbnail ? (
              <img
                src={thumbnail.replace('http:', 'https:')}
                alt={title}
                className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full bg-gray-200">
                <FaBook className="text-gray-400 text-4xl md:text-6xl" />
              </div>
            )}
          </div>
          <div className="p-3 md:p-4 flex-grow flex flex-col">
            <h3 className="font-medium text-sm mb-1 line-clamp-2">{title}</h3>
            <p className="text-gray-600 text-xs mb-2 line-clamp-1">
              {authors ? authors[0] : 'Unknown Author'}
            </p>
            <div className="flex justify-between items-center mt-auto">
              <span className="font-bold text-primary-600">${price.toFixed(2)}</span>
              <span className="text-xs text-gray-400 line-through">
                ${(price * 1.2).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

// Book Carousel Component
const BookCarousel = ({ title, books, viewAllLink, bgColor = "bg-white" }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = direction === 'left' 
        ? container.scrollLeft - container.offsetWidth * 0.8
        : container.scrollLeft + container.offsetWidth * 0.8;

      container.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className={`py-6 sm:py-8 ${bgColor}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
          <Link href={viewAllLink} className="text-primary-600 hover:underline text-xs sm:text-sm font-medium">
            EXPLORE ALL
          </Link>
        </div>

        <div className="relative">
          <button 
            onClick={() => scroll('left')} 
            className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 text-primary-600 hover:bg-gray-100"
            aria-label="Scroll left"
          >
            <FaChevronLeft />
          </button>
          
          <div 
            className="flex overflow-x-auto gap-3 sm:gap-4 pb-2 sm:pb-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none' }}
            ref={scrollRef}
          >
            {books && books.map((book) => (
              <div key={book.id} className="min-w-[150px] sm:min-w-[160px] md:min-w-[180px] flex-shrink-0">
                <BookCard book={book} />
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => scroll('right')} 
            className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 text-primary-600 hover:bg-gray-100"
            aria-label="Scroll right"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

// Category Button Component
const CategoryButton = ({ icon, label, bgColor }) => (
  <Link href={`/books/category/${label.toLowerCase()}`} className="flex-shrink-0">
    <div className={`${bgColor} rounded-lg p-3 sm:p-4 text-center w-20 sm:w-24 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="text-2xl sm:text-3xl mb-1 sm:mb-2 text-center flex justify-center">
        {icon}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </div>
  </Link>
);

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/books');
        const allBooks = await response.json();

        // Shuffle and divide books for different sections
        const shuffled = [...allBooks].sort(() => 0.5 - Math.random());
        
        setFeaturedBooks(shuffled.slice(0, 8));
        setNewArrivals(shuffled.slice(8, 16));
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch books:", error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Dummy fiction books (you'll replace this with actual API data)
  const fictionBooks = featuredBooks.slice(0, 8);

  // Dummy children books
  const childrenBooks = newArrivals.slice(0, 8);

  return (
    <div className="bg-gray-50">
      {/* Hero Banner */}
      <section className="bg-primary-700 text-white">
        <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              Discover Your Next Favorite Book
            </h1>
            <p className="text-base sm:text-lg mb-4 sm:mb-6 opacity-90">
              Browse our extensive collection with new titles added regularly.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link 
                href="/books" 
                className="bg-white text-primary-700 px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm sm:text-base"
              >
                Browse Books
              </Link>
              {!isAuthenticated && (
                <Link 
                  href="/auth/register" 
                  className="bg-transparent border-2 border-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium hover:bg-white/10 transition-colors text-sm sm:text-base"
                >
                  Sign Up Now
                </Link>
              )}
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center mt-4 md:mt-0">
            <div className="relative">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {featuredBooks.slice(0, 4).map((book, index) => (
                  <div
                    key={book.id}
                    className="w-24 h-32 sm:w-32 sm:h-44 bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105"
                    style={{
                      transform: `rotate(${(index % 2 === 0 ? -5 : 5)}deg)`,
                      zIndex: 10 - index
                    }}
                  >
                    {book.thumbnail && (
                      <img
                        src={book.thumbnail.replace('http:', 'https:')}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Books */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading books...</p>
        </div>
      ) : (
        <>
          <BookCarousel 
            title="Featured Books" 
            books={featuredBooks} 
            viewAllLink="/books"
          />
          
          <BookCarousel 
            title="New Arrivals" 
            books={newArrivals} 
            viewAllLink="/books/new"
            bgColor="bg-gray-50"
          />
          
          <BookCarousel 
            title="Fiction" 
            books={fictionBooks} 
            viewAllLink="/books/category/fiction"
          />
          
          <BookCarousel 
            title="Children's Books" 
            books={childrenBooks} 
            viewAllLink="/books/category/children"
            bgColor="bg-gray-50"
          />
        </>
      )}
      
      {/* Publisher Banners */}
      <section className="py-6 sm:py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-orange-100 rounded-lg overflow-hidden shadow-md">
              <div className="flex flex-col sm:flex-row items-center p-4 sm:p-6">
                <div className="w-full sm:w-2/3 mb-4 sm:mb-0">
                  <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Featured Publishers</h3>
                  <p className="text-xs sm:text-sm mb-3 sm:mb-4">Discover our curated selection from top publishers.</p>
                  <button className="bg-orange-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded text-xs sm:text-sm font-medium hover:bg-orange-600 transition-colors">
                    SHOP NOW
                  </button>
                </div>
                <div className="w-full sm:w-1/3 flex justify-center">
                  <div className="h-24 sm:h-32 w-16 sm:w-24 bg-white shadow-md rounded transform rotate-3">
                    <div className="bg-gray-200 w-full h-full rounded flex items-center justify-center">
                      <FaBook className="text-2xl sm:text-3xl text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-teal-100 rounded-lg overflow-hidden shadow-md">
              <div className="flex flex-col sm:flex-row items-center p-4 sm:p-6">
                <div className="w-full sm:w-2/3 mb-4 sm:mb-0">
                  <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Special Collections</h3>
                  <p className="text-xs sm:text-sm mb-3 sm:mb-4">Explore our special themed collections and series.</p>
                  <button className="bg-teal-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded text-xs sm:text-sm font-medium hover:bg-teal-600 transition-colors">
                    SHOP NOW
                  </button>
                </div>
                <div className="w-full sm:w-1/3 flex justify-center">
                  <div className="h-24 sm:h-32 w-16 sm:w-24 bg-white shadow-md rounded transform -rotate-3">
                    <div className="bg-gray-200 w-full h-full rounded flex items-center justify-center">
                      <FaBook className="text-2xl sm:text-3xl text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="bg-gray-50 py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="p-2 sm:p-4">
              <div className="bg-primary-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
                </svg>
              </div>
              <h3 className="font-medium text-sm sm:text-base mb-1 sm:mb-2">24/7 Support</h3>
              <p className="text-xs sm:text-sm text-gray-600">Always here to help with your order</p>
            </div>
            
            <div className="p-2 sm:p-4">
              <div className="bg-primary-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="font-medium text-sm sm:text-base mb-1 sm:mb-2">Fast Delivery</h3>
              <p className="text-xs sm:text-sm text-gray-600">Get your books quickly</p>
            </div>
            
            <div className="p-2 sm:p-4">
              <div className="bg-primary-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="font-medium text-sm sm:text-base mb-1 sm:mb-2">Secure Payments</h3>
              <p className="text-xs sm:text-sm text-gray-600">Safe & protected checkout</p>
            </div>
            
            <div className="p-2 sm:p-4">
              <div className="bg-primary-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
              <h3 className="font-medium text-sm sm:text-base mb-1 sm:mb-2">Easy Returns</h3>
              <p className="text-xs sm:text-sm text-gray-600">Hassle-free return policy</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="bg-primary-700 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Subscribe to Our Newsletter</h2>
          <p className="mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
            Stay updated with the latest releases, exclusive offers, and literary events
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-2 sm:gap-0">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-2 rounded-lg sm:rounded-r-none text-gray-800 focus:outline-none text-sm sm:text-base"
            />
            <button className="bg-primary-600 hover:bg-primary-800 px-4 py-2 rounded-lg sm:rounded-l-none font-medium transition-colors text-sm sm:text-base">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}