'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-6 mt-6 text-center border rounded-xl w-96">
      <h3 className="text-2xl font-bold">Counter Example</h3>
      <p className="mt-4 text-4xl">{count}</p>
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => setCount(count - 1)}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
        >
          Decrease
        </button>
        <button
          onClick={() => setCount(0)}
          className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
        >
          Reset
        </button>
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
          Increase
        </button>
      </div>
    </div>
  );
} 