'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import BookCard from './BookCard';
import Loader from '@/components/ui/Loader';
import { roundPrice } from '@/utils/formatters';

interface Book {
  id: string;
  title: string;
  authors: string[];
  price: number;
  description: string;
  thumbnail: string;
  stock: number;
}

interface BookListProps {
  featured?: boolean;
  limit?: number;
  searchQuery?: string;
}

export default function BookList({ featured = false, limit, searchQuery }: BookListProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const priceFilter = searchParams.get('price') || 'all';

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError('');

      try {
        let endpoint = searchQuery
          ? `/api/books/search?q=${encodeURIComponent(searchQuery)}`
          : '/api/books';

        endpoint += `${endpoint.includes('?') ? '&' : '?'}_t=${Date.now()}`;

        const { data } = await axios.get(endpoint, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
        });

        let filteredBooks = data.map((book: Book) => ({
          ...book,
          price: roundPrice(book.price),
        }));

        if (priceFilter !== 'all') {
          filteredBooks = filteredBooks.filter((book) => {
            const price = book.price;
            switch (priceFilter) {
              case 'under-25': return price < 25;
              case '25-50': return price >= 25 && price <= 50;
              case '50-75': return price > 50 && price <= 75;
              case 'over-75': return price > 75;
              default: return true;
            }
          });
        }

        if (featured) {
          filteredBooks.sort((a, b) => b.stock - a.stock);
        }

        if (limit && limit > 0) {
          filteredBooks = filteredBooks.slice(0, limit);
        }

        setBooks(filteredBooks);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Oops! Something went wrong while loading books.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [featured, limit, searchQuery, priceFilter]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="text-center text-red-500 py-10 bg-red-50 rounded-lg shadow">
        {error}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-100 rounded-lg shadow">
        <p className="text-gray-600 font-medium">No books found.</p>
        <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search term.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        Showing <strong>{books.length}</strong> book{books.length !== 1 && 's'}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}