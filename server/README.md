# HoppOn Server

Express.js backend server for the HoppOn ride-sharing application built with TypeScript and MongoDB.

## Features

- **Express.js** with TypeScript
- **MongoDB** with Mongoose ODM
- **JWT Authentication** 
- **Input Validation** with express-validator
- **Security** with Helmet and CORS
- **Error Handling** middleware
- **Logging** with Morgan
- **Hot Reload** with Nodemon

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn

### Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
DB_NAME=hoppon_db
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173
```

### Running the Server

#### Development Mode
```bash
npm run dev
```

#### Production Build
```bash
npm run build
npm start
```

### API Endpoints

#### Health Check
- `GET /health` - Server health status

#### API Info
- `GET /api` - API information and available endpoints

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.ts      # MongoDB connection
│   ├── middleware/
│   │   ├── errorHandler.ts  # Error handling middleware
│   │   └── notFound.ts      # 404 handler
│   ├── models/
│   │   ├── User.ts          # User model
│   │   └── Driver.ts        # Driver model
│   └── index.ts             # Main server file
├── dist/                    # Compiled JavaScript (generated)
├── .env                     # Environment variables
├── .gitignore
├── nodemon.json            # Nodemon configuration
├── package.json
├── tsconfig.json           # TypeScript configuration
└── README.md
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB connection string | Required |
| `DB_NAME` | Database name | `hoppon_db` |
| `JWT_SECRET` | JWT signing secret | Required |
| `CORS_ORIGIN` | CORS allowed origin | `http://localhost:5173` |

## Models

### User Model
- Basic user information
- Authentication fields
- Role-based access (user, driver, admin)

### Driver Model
- Driver-specific information
- Vehicle details
- Documents and banking info
- Status and rating system

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run clean` - Clean build directory

## Contributing

1. Follow TypeScript best practices
2. Use proper error handling
3. Add input validation for all endpoints
4. Write meaningful commit messages
5. Test your changes before submitting