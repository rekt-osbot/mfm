import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to{' '}
          <a className="text-primary" href="https://nextjs.org">
            Next.js!
          </a>
        </h1>

        <p className="mt-3 text-2xl">
          Get started by editing{' '}
          <code className="p-2 font-mono text-lg bg-gray-100 rounded-md">
            src/app/page.tsx
          </code>
        </p>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <a
            href="https://nextjs.org/docs"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-primary focus:text-primary"
          >
            <h3 className="text-2xl font-bold">Documentation &rarr;</h3>
            <p className="mt-4 text-xl">
              Find in-depth information about Next.js features and API.
            </p>
          </a>

          <a
            href="https://nextjs.org/learn"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-primary focus:text-primary"
          >
            <h3 className="text-2xl font-bold">Learn &rarr;</h3>
            <p className="mt-4 text-xl">
              Learn about Next.js in an interactive course with quizzes!
            </p>
          </a>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className="ml-2">
            Next.js
          </span>
        </a>
      </footer>
    </div>
  );
} 