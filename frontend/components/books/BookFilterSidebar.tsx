'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaFilter, FaDollarSign, FaUndo } from 'react-icons/fa';

export function BookFilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPrice = searchParams.get('price') || 'all';

  const [priceRange, setPriceRange] = useState(currentPrice);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (priceRange !== 'all') {
      params.set('price', priceRange);
    }

    const query = searchParams.get('q');
    if (query) {
      params.set('q', query);
    }

    router.push(`/books${params.toString() ? `?${params.toString()}` : ''}`);
    setShowMobileFilters(false);
  };

  const resetFilters = () => {
    setPriceRange('all');

    const query = searchParams.get('q');
    if (query) {
      router.push(`/books?q=${query}`);
    } else {
      router.push('/books');
    }

    setShowMobileFilters(false);
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters((prev) => !prev);
  };

  const priceOptions = [
    { value: 'all', label: 'All Prices' },
    { value: 'under-25', label: 'Under $25' },
    { value: '25-50', label: '$25 - $50' },
    { value: '50-75', label: '$50 - $75' },
    { value: 'over-75', label: '$75 - $100' },
  ];

  return (
    <aside className="bg-white rounded-2xl shadow-md p-6">
      {/* Mobile Toggle Button */}
      <button
        className="w-full flex items-center justify-between lg:hidden mb-4 text-gray-800 font-medium"
        onClick={toggleMobileFilters}
      >
        <span className="flex items-center">
          <FaFilter className="mr-2 text-primary-600" />
          Filters
        </span>
        <span className="text-xl">{showMobileFilters ? '−' : '+'}</span>
      </button>

      {/* Filters Section */}
      <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block`}>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 hidden lg:block">Filters</h2>

        {/* Price Range */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2 flex items-center">
            <FaDollarSign className="text-primary-600 mr-1" />
            Price Range
          </h3>
          <div className="space-y-2">
            {priceOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center cursor-pointer hover:text-primary-600 text-sm text-gray-700"
              >
                <input
                  type="radio"
                  name="price"
                  value={option.value}
                  checked={priceRange === option.value}
                  onChange={() => setPriceRange(option.value)}
                  className="mr-2 accent-primary-600"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={applyFilters}
            className="bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-all flex justify-center items-center"
          >
            <FaFilter className="mr-2" />
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100 transition-all flex justify-center items-center"
          >
            <FaUndo className="mr-2" />
            Reset Filters
          </button>
        </div>
      </div>
    </aside>
  );
}