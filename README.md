# MFM - Mutual Fund Manager

A family-oriented mutual fund portfolio tracker with beautiful UI and cloud data persistence.

## Features

- 🔄 Real-time portfolio tracking
- 👨‍👩‍👧‍👦 Family member management
- 💼 Fund allocation tracking
- 📊 Portfolio growth simulator
- 🚀 Cloud data persistence with Vercel Edge Config
- 🔐 Simple login system (no password required)
- 📱 Fully responsive design

## Technologies Used

- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- Framer Motion
- Vercel Edge Config

## Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- npm or yarn or pnpm

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd mfm-portfolio-tracker
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Run the development server
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

1. Create a Vercel account if you don't have one at [vercel.com](https://vercel.com)

2. Install the Vercel CLI
   ```
   npm install -g vercel
   ```

3. Link your project to Vercel
   ```
   vercel link
   ```

4. Deploy to Vercel
   ```
   vercel deploy
   ```

5. Create an Edge Config store in the Vercel dashboard
   - Go to your project dashboard
   - Navigate to Storage tab
   - Select Edge Config
   - Create a new Edge Config store
   - Copy the connection string to your project settings

## License

MIT

## Credits

Created by [Your Name]
