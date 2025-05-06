'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { FaShoppingCart } from 'react-icons/fa';
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

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: book.id,
      title: book.title,
      price: roundPrice(book.price),
      thumbnail: book.thumbnail,
    });
  };

  const formattedPrice = formatPrice(book.price);

  return (
    <div className="group bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">
      <Link href={`/books/${book.id}`} className="block relative h-52 bg-gradient-to-br from-gray-100 to-gray-200">
        {book.thumbnail ? (
          <Image
            src={book.thumbnail}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-gray-400">
            No image available
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col justify-between h-[calc(100%-13rem)]">
        <div>
          <Link href={`/books/${book.id}`}>
            <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-primary-600 transition-colors">
              {book.title}
            </h3>
          </Link>

          <p className="text-gray-500 text-sm mb-3">
            {book.authors?.length > 0 ? book.authors.join(', ') : 'Unknown Author'}
          </p>
        </div>

        <div className="mt-auto">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800">{formattedPrice}</span>
            <button
              onClick={handleAddToCart}
              disabled={book.stock <= 0}
              className={`flex items-center space-x-1 px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                book.stock > 0
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
            >
              <FaShoppingCart size={14} />
              <span>{book.stock > 0 ? 'Add' : 'Out of Stock'}</span>
            </button>
          </div>

          {book.stock <= 5 && book.stock > 0 && (
            <p className="text-orange-600 text-xs mt-2">
              Only {book.stock} left in stock
            </p>
          )}
        </div>
      </div>
    </div>
  );
}