# Urban Attire - E-commerce Backend API

A professional Node.js/Express backend API for the Urban Attire e-commerce platform.

## ✨ Recent Updates & Bug Fixes

### Bug Fixes
- ✅ Fixed typo: `singup` → `signup`
- ✅ Fixed typo: `varification` → `verification`
- ✅ Fixed typo: `isFistOrder` → `isFirstOrder`
- ✅ Fixed JWT middleware to properly handle role arrays
- ✅ Removed debug console.log statements
- ✅ Added proper error handling in auth service
- ✅ Fixed OTP expiration validation

### Security Improvements
- ✅ Added rate limiting middleware (100 req/15min)
- ✅ Added input sanitization (XSS & NoSQL injection prevention)
- ✅ Added security headers (XSS, clickjacking protection)
- ✅ Enhanced JWT authentication
- ✅ Enabled JWT auth on admin routes

### Performance Optimizations
- ✅ Added database indexes (users, products)
- ✅ Optimized query performance
- ✅ Improved error handling
- ✅ Better transaction management

## Features

- 🔐 RESTful API architecture
- 🗄️ MongoDB database with Mongoose ODM
- 🔑 JWT-based authentication with role-based access control
- 📁 File upload handling with image optimization
- 💳 Payment gateway integration (SSLCommerz)
- 📧 Email notifications (OTP, order confirmations)
- 📦 Order management with bulk operations
- 📊 Inventory management with warehouse support
- 🛍️ Product catalog with multi-level categories
- 🛒 Shopping cart and wishlist
- 🎫 Coupon and campaign management
- 🔒 Security: Rate limiting, input sanitization, CORS
- 📈 Sales reports and analytics

## Tech Stack

- **Runtime:** Node.js (>=16.0.0)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer
- **Email:** Nodemailer
- **Payment:** SSLCommerz
- **Validation:** Custom middleware
- **Logger:** Morgan

## Prerequisites

- Node.js >= 16.0.0
- MongoDB >= 5.0
- npm >= 8.0.0

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
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

4. Configure environment variables in `.env` file

5. Create uploads directory:
```bash
mkdir -p uploads
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## API Endpoints

Base URL: `http://localhost:5000/api/v1`

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token

### Products
- `GET /product` - Get all products
- `GET /product/:slug` - Get single product
- `POST /product` - Create product (Admin)
- `PUT /product/:id` - Update product (Admin)
- `DELETE /product/:id` - Delete product (Admin)

### Categories
- `GET /category` - Get all categories
- `POST /category` - Create category (Admin)

### Orders
- `GET /order` - Get user orders
- `POST /order` - Create new order
- `PATCH /order/:id` - Update order status (Admin)

### Cart
- `GET /cart` - Get user cart
- `POST /cart` - Add to cart
- `DELETE /cart/:id` - Remove from cart

*For complete API documentation, refer to the API documentation file.*

## Project Structure

```
server/
├── src/
│   ├── api/
│   │   ├── index.js              # Main router
│   │   └── routes/               # Route definitions
│   ├── config/                   # Configuration files
│   ├── middleware/               # Custom middleware
│   │   ├── auth/                 # Authentication middleware
│   │   ├── errors/               # Error handlers
│   │   ├── transactions/         # Transaction handlers
│   │   └── upload/               # File upload middleware
│   ├── models/                   # Mongoose models
│   ├── modules/                  # Business logic (controllers, services, repositories)
│   └── utils/                    # Utility functions
├── uploads/                      # Uploaded files
├── server.js                     # Application entry point
├── package.json
├── .env.example
└── README.md
```

## Environment Variables

See `.env.example` for all required environment variables.

## Error Handling

The application uses a centralized error handling mechanism:
- Custom error classes
- Global error handler middleware
- Proper HTTP status codes
- Detailed error messages in development mode

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation
- SQL injection prevention (MongoDB)
- XSS protection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC

## Support

For support, email support@urbanattire.com
