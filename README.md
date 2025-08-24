# Siddhi - Modern React Application

A modern, responsive React application built with TypeScript, Tailwind CSS, Framer Motion, and Radix UI components.

## Features

- ⚡ **Vite** - Fast build tool and development server
- ⚛️ **React 19** with TypeScript for type safety
- 🎨 **Tailwind CSS** - Modern utility-first CSS framework
- 🎭 **Framer Motion** - Smooth animations and transitions
- 🧩 **Radix UI** - Accessible, unstyled UI components
- 🚀 **React Router** - Client-side routing
- 📱 **Responsive Design** - Mobile-first approach
- 🎯 **Modern Color Palette** - Mature and minimal design system

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Custom CSS Variables
- **UI Components**: Radix UI primitives
- **Animation**: Framer Motion
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge, class-variance-authority

## Getting Started

### Prerequisites

- Node.js 20.19.0 or higher
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Card, etc.)
│   └── layout/         # Layout components (Header, Footer, etc.)
├── pages/              # Page components
├── services/           # API services and utilities
├── lib/                # Utility functions
├── App.tsx             # Main app component
└── main.tsx           # Entry point
```

## Color Palette

The application uses a modern, mature, and minimal color palette:

- **Primary**: Slate gray tones for professional appearance
- **Accent**: Warm yellow for highlights and CTAs
- **Neutral**: Clean grays for text and backgrounds
- **Semantic**: Success (green), Warning (amber), Error (red)

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_API_URL=http://localhost:3001/api
VITE_API_KEY=your_api_key_here
VITE_NODE_ENV=development
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.