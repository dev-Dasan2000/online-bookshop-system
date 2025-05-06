'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import Loader from '@/components/ui/Loader';
import { formatPrice, roundPrice } from '@/utils/formatters';

interface Book {
  id: string;
  title: string;
  authors: string[];
  price: number;
  description: string;
  thumbnail: string;
  stock: number;
}

interface BookDetailProps {
  id: string;
}

export default function BookDetail({ id }: BookDetailProps) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const timestamp = Date.now();
        const endpoint = `/api/books/${id}?_t=${timestamp}`;

        const response = await axios.get(endpoint, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });

        const bookData = {
          ...response.data,
          price: roundPrice(response.data.price)
        };

        setBook(bookData);
      } catch (error) {
        setError('Failed to load book details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleAddToCart = () => {
    if (!book) return;
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: book.id,
        title: book.title,
        price: book.price,
        thumbnail: book.thumbnail,
      });
    }
    router.push('/cart');
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (book && newQuantity >= 1 && newQuantity <= book.stock) {
      setQuantity(newQuantity);
    }
  };

  if (loading) return <Loader />;

  if (error || !book) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg font-medium">{error || 'Book not found'}</p>
        <button 
          onClick={() => router.push('/books')}
          className="mt-6 px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Back to Books
        </button>
      </div>
    );
  }

  const formattedPrice = formatPrice(book.price);

  return (
    <div className="container mx-auto px-4 py-6">
      <button 
        onClick={() => router.back()}
        className="flex items-center text-primary-600 hover:text-primary-800 mb-8"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="relative aspect-[2/3] bg-gray-100 rounded-xl overflow-hidden">
          {book.thumbnail ? (
            <Image
              src={book.thumbnail}
              alt={book.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>

        <div>
          <h1 className="text-4xl font-extrabold mb-3 text-gray-900 leading-tight">{book.title}</h1>

          <p className="text-gray-500 text-base mb-5">
            {book.authors?.length > 0 ? book.authors.join(', ') : 'Unknown Author'}
          </p>

          <div className="text-3xl font-semibold text-gray-800 mb-6">{formattedPrice}</div>

          <div className="mb-8 space-y-6">
            <div className="bg-gray-50 p-5 rounded-lg border">
              <p className="font-semibold text-sm text-gray-700 mb-1">Availability:</p>
              {book.stock > 0 ? (
                <p className="text-green-600 font-medium">In Stock ({book.stock} available)</p>
              ) : (
                <p className="text-red-600 font-medium">Out of Stock</p>
              )}
            </div>

            {book.stock > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="px-3 py-1 bg-gray-200 rounded-l-md disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 bg-gray-100 border-y border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= book.stock}
                    className="px-3 py-1 bg-gray-200 rounded-r-md disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={book.stock <= 0}
              className="w-full flex items-center justify-center bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition"
            >
              <FaShoppingCart className="mr-2" />
              {book.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-900">Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {book.description || 'No description available.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}