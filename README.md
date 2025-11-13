# Hanouty E-Commerce API Documentation

**Base URL:** `http://localhost:3000/api/v1`

**Version:** 1.0.0

---

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [User Endpoints](#user-endpoints)
3. [Product Endpoints](#product-endpoints)
4. [Order Endpoints](#order-endpoints)

---

## Authentication Endpoints

### 1. Register User

**Method:** `POST`  
**URL:** `/api/v1/auth/register`  
**Authentication:** Not required

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "role": "customer",
  "phone": "+966501234567"
}
```

**Validation Rules:**

- `email`: Valid email format (required)
- `password`: Minimum 8 characters (required)
- `name`: Minimum 2 characters (required)
- `role`: Either "customer" or "seller" (required)
- `phone`: Optional

**Success Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "customer",
      "isVerified": false,
      "phone": "+966501234567",
      "createdAt": "2025-11-13T10:00:00.000Z"
    }
  },
  "message": "User registered successfully"
}
```

**Error Responses:**

```json
// 422 Validation Error
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "path": ["body", "email"],
      "message": "Invalid email format"
    }
  ]
}

// 422 User Already Exists
{
  "success": false,
  "message": "User with this email already exists"
}
```

---

### 2. Login User

**Method:** `POST`  
**URL:** `/api/v1/auth/login`  
**Authentication:** Not required

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "customer",
      "isVerified": false,
      "phone": "+966501234567",
      "avatar": null,
      "createdAt": "2025-11-13T10:00:00.000Z"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600
  }
}
```

**Error Responses:**

```json
// 401 Unauthorized
{
  "success": false,
  "message": "Invalid credentials"
}

// 422 Validation Error
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "path": ["body", "email"],
      "message": "Invalid email format"
    }
  ]
}
```

---

### 3. Logout User

**Method:** `POST`  
**URL:** `/api/v1/auth/logout`  
**Authentication:** Required (Bearer Token)

**Headers:**

```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Error Response:**

```json
// 401 Unauthorized
{
  "success": false,
  "message": "Invalid token"
}
```

---

## User Endpoints

### 4. Get Current User Profile

**Method:** `GET`  
**URL:** `/api/v1/user/me`  
**Authentication:** Required (Bearer Token)

**Headers:**

```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer",
    "phone": "+966501234567",
    "avatar": "https://example.com/avatar.jpg",
    "isVerified": true,
    "createdAt": "2025-11-13T10:00:00.000Z",
    "updatedAt": "2025-11-13T10:00:00.000Z"
  }
}
```

**Error Responses:**

```json
// 401 Unauthorized
{
  "success": false,
  "message": "Invalid token"
}

// 404 Not Found
{
  "success": false,
  "message": "User not found"
}
```

---

### 5. Update User Profile

**Method:** `PUT`  
**URL:** `/api/v1/user/profile`  
**Authentication:** Required (Bearer Token)

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "name": "John Updated",
  "phone": "+966509876543",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "name": "John Updated",
    "role": "customer",
    "phone": "+966509876543",
    "avatar": "https://example.com/new-avatar.jpg",
    "isVerified": true,
    "createdAt": "2025-11-13T10:00:00.000Z",
    "updatedAt": "2025-11-13T11:30:00.000Z"
  },
  "message": "Profile updated successfully"
}
```

**Error Response:**

```json
// 401 Unauthorized
{
  "success": false,
  "message": "Invalid token"
}
```

---

## Product Endpoints

### 6. Get All Products (Seller's Products)

**Method:** `GET`  
**URL:** `/api/v1/products`  
**Authentication:** Required (Bearer Token - Seller/Admin only)

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Example Request:**

```
GET /api/v1/products?page=1&limit=20
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod-123e4567-e89b-12d3-a456-426614174000",
        "name": "Luxury Watch",
        "description": "Premium Swiss-made watch with leather strap",
        "price": 2500.0,
        "currency": "SAR",
        "stock": 15,
        "category": "Accessories",
        "sku": "WATCH-001",
        "sellerId": "123e4567-e89b-12d3-a456-426614174000",
        "images": [
          "https://example.com/images/watch1.jpg",
          "https://example.com/images/watch2.jpg"
        ],
        "status": "active",
        "createdAt": "2025-11-10T10:00:00.000Z",
        "updatedAt": "2025-11-10T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

**Error Response:**

```json
// 401 Unauthorized
{
  "success": false,
  "message": "Insufficient permissions"
}
```

---

### 7. Get Single Product

**Method:** `GET`  
**URL:** `/api/v1/products/:id`  
**Authentication:** Required (Bearer Token - Seller/Admin only)

**Headers:**

```
Authorization: Bearer <access_token>
```

**URL Parameters:**

- `id`: Product ID (UUID)

**Example Request:**

```
GET /api/v1/products/prod-123e4567-e89b-12d3-a456-426614174000
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "prod-123e4567-e89b-12d3-a456-426614174000",
    "name": "Luxury Watch",
    "description": "Premium Swiss-made watch with leather strap",
    "price": 2500.0,
    "currency": "SAR",
    "stock": 15,
    "category": "Accessories",
    "sku": "WATCH-001",
    "sellerId": "123e4567-e89b-12d3-a456-426614174000",
    "images": [
      "https://example.com/images/watch1.jpg",
      "https://example.com/images/watch2.jpg"
    ],
    "status": "active",
    "createdAt": "2025-11-10T10:00:00.000Z",
    "updatedAt": "2025-11-10T10:00:00.000Z"
  }
}
```

**Error Response:**

```json
// 404 Not Found
{
  "success": false,
  "message": "Product not found"
}
```

---

### 8. Create Product

**Method:** `POST`  
**URL:** `/api/v1/products`  
**Authentication:** Required (Bearer Token - Seller/Admin only)

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Luxury Watch",
  "description": "Premium Swiss-made watch with leather strap",
  "price": 2500.0,
  "stock": 15,
  "category": "Accessories",
  "sku": "WATCH-001",
  "images": [
    "https://example.com/images/watch1.jpg",
    "https://example.com/images/watch2.jpg"
  ]
}
```

**Validation Rules:**

- `name`: Minimum 3 characters (required)
- `description`: Minimum 10 characters (required)
- `price`: Positive number (required)
- `stock`: Non-negative integer (required)
- `category`: Required
- `sku`: Required (must be unique)
- `images`: Array of valid URLs, at least 1 image (required)

**Success Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "prod-123e4567-e89b-12d3-a456-426614174000",
    "name": "Luxury Watch",
    "description": "Premium Swiss-made watch with leather strap",
    "price": 2500.0,
    "currency": "SAR",
    "stock": 15,
    "category": "Accessories",
    "sku": "WATCH-001",
    "sellerId": "123e4567-e89b-12d3-a456-426614174000",
    "images": [
      "https://example.com/images/watch1.jpg",
      "https://example.com/images/watch2.jpg"
    ],
    "status": "active",
    "createdAt": "2025-11-13T10:00:00.000Z",
    "updatedAt": "2025-11-13T10:00:00.000Z"
  },
  "message": "Product created successfully"
}
```

**Error Response:**

```json
// 422 Validation Error
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "path": ["body", "price"],
      "message": "Price must be positive"
    }
  ]
}
```

---

### 9. Update Product

**Method:** `PUT`  
**URL:** `/api/v1/products/:id`  
**Authentication:** Required (Bearer Token - Seller/Admin only)

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**URL Parameters:**

- `id`: Product ID (UUID)

**Request Body:**

```json
{
  "name": "Luxury Watch - Updated",
  "description": "Premium Swiss-made watch with genuine leather strap",
  "price": 2700.0,
  "stock": 20,
  "status": "active"
}
```

**Note:** All fields are optional. Only send fields you want to update.

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "prod-123e4567-e89b-12d3-a456-426614174000",
    "name": "Luxury Watch - Updated",
    "description": "Premium Swiss-made watch with genuine leather strap",
    "price": 2700.0,
    "currency": "SAR",
    "stock": 20,
    "category": "Accessories",
    "sku": "WATCH-001",
    "sellerId": "123e4567-e89b-12d3-a456-426614174000",
    "images": [
      "https://example.com/images/watch1.jpg",
      "https://example.com/images/watch2.jpg"
    ],
    "status": "active",
    "createdAt": "2025-11-10T10:00:00.000Z",
    "updatedAt": "2025-11-13T11:00:00.000Z"
  },
  "message": "Product updated successfully"
}
```

**Error Responses:**

```json
// 404 Not Found
{
  "success": false,
  "message": "Product not found"
}

// 401 Unauthorized
{
  "success": false,
  "message": "Not authorized to update this product"
}
```

---

### 10. Delete Product

**Method:** `DELETE`  
**URL:** `/api/v1/products/:id`  
**Authentication:** Required (Bearer Token - Seller/Admin only)

**Headers:**

```
Authorization: Bearer <access_token>
```

**URL Parameters:**

- `id`: Product ID (UUID)

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

**Error Responses:**

```json
// 404 Not Found
{
  "success": false,
  "message": "Product not found"
}

// 401 Unauthorized
{
  "success": false,
  "message": "Not authorized to delete this product"
}
```

---

## Order Endpoints

### 11. Get All Orders (Customer's Orders)

**Method:** `GET`  
**URL:** `/api/v1/orders`  
**Authentication:** Required (Bearer Token)

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `status`: Filter by status (optional) - Values: `pending`, `processing`, `shipped`, `delivered`, `completed`, `cancelled`

**Example Request:**

```
GET /api/v1/orders?page=1&limit=20&status=pending
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "order-123e4567-e89b-12d3-a456-426614174000",
        "orderNumber": "ORD-1731500000000-ABC123XYZ",
        "customerId": "123e4567-e89b-12d3-a456-426614174000",
        "sellerId": "seller-123e4567-e89b-12d3-a456-426614174001",
        "items": [
          {
            "productId": "prod-123e4567-e89b-12d3-a456-426614174000",
            "name": "Luxury Watch",
            "quantity": 1,
            "price": 2500.0,
            "subtotal": 2500.0
          }
        ],
        "subtotal": 2500.0,
        "shippingCost": 20.0,
        "tax": 125.0,
        "total": 2645.0,
        "status": "pending",
        "shippingAddress": {
          "street": "123 Main St",
          "city": "Riyadh",
          "country": "Saudi Arabia",
          "postalCode": "12345"
        },
        "paymentMethod": "credit_card",
        "trackingNumber": null,
        "notes": null,
        "createdAt": "2025-11-13T10:00:00.000Z",
        "updatedAt": "2025-11-13T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

---

### 12. Get Single Order

**Method:** `GET`  
**URL:** `/api/v1/orders/:id`  
**Authentication:** Required (Bearer Token)

**Headers:**

```
Authorization: Bearer <access_token>
```

**URL Parameters:**

- `id`: Order ID (UUID)

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "order-123e4567-e89b-12d3-a456-426614174000",
    "orderNumber": "ORD-1731500000000-ABC123XYZ",
    "customerId": "123e4567-e89b-12d3-a456-426614174000",
    "sellerId": "seller-123e4567-e89b-12d3-a456-426614174001",
    "items": [
      {
        "productId": "prod-123e4567-e89b-12d3-a456-426614174000",
        "name": "Luxury Watch",
        "quantity": 1,
        "price": 2500.0,
        "subtotal": 2500.0
      }
    ],
    "subtotal": 2500.0,
    "shippingCost": 20.0,
    "tax": 125.0,
    "total": 2645.0,
    "status": "pending",
    "shippingAddress": {
      "street": "123 Main St",
      "city": "Riyadh",
      "country": "Saudi Arabia",
      "postalCode": "12345"
    },
    "paymentMethod": "credit_card",
    "trackingNumber": null,
    "notes": null,
    "createdAt": "2025-11-13T10:00:00.000Z",
    "updatedAt": "2025-11-13T10:00:00.000Z"
  }
}
```

**Error Responses:**

```json
// 404 Not Found
{
  "success": false,
  "message": "Order not found"
}

// 401 Unauthorized
{
  "success": false,
  "message": "Not authorized to view this order"
}
```

---

### 13. Create Order

**Method:** `POST`  
**URL:** `/api/v1/orders`  
**Authentication:** Required (Bearer Token)

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "items": [
    {
      "productId": "prod-123e4567-e89b-12d3-a456-426614174000",
      "quantity": 2
    },
    {
      "productId": "prod-456e7890-e89b-12d3-a456-426614174001",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Riyadh",
    "country": "Saudi Arabia",
    "postalCode": "12345"
  },
  "paymentMethod": "credit_card"
}
```

**Validation Rules:**

- `items`: Array with at least 1 item (required)
  - `productId`: Valid product UUID (required)
  - `quantity`: Positive integer (required)
- `shippingAddress`: Complete address object (required)
- `paymentMethod`: String (required)

**Success Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "order-123e4567-e89b-12d3-a456-426614174000",
    "orderNumber": "ORD-1731500000000-ABC123XYZ",
    "customerId": "123e4567-e89b-12d3-a456-426614174000",
    "sellerId": "seller-123e4567-e89b-12d3-a456-426614174001",
    "items": [
      {
        "productId": "prod-123e4567-e89b-12d3-a456-426614174000",
        "name": "Luxury Watch",
        "quantity": 2,
        "price": 2500.0,
        "subtotal": 5000.0
      },
      {
        "productId": "prod-456e7890-e89b-12d3-a456-426614174001",
        "name": "Leather Wallet",
        "quantity": 1,
        "price": 150.0,
        "subtotal": 150.0
      }
    ],
    "subtotal": 5150.0,
    "shippingCost": 20.0,
    "tax": 257.5,
    "total": 5427.5,
    "status": "pending",
    "shippingAddress": {
      "street": "123 Main St",
      "city": "Riyadh",
      "country": "Saudi Arabia",
      "postalCode": "12345"
    },
    "paymentMethod": "credit_card",
    "trackingNumber": null,
    "notes": null,
    "createdAt": "2025-11-13T10:00:00.000Z",
    "updatedAt": "2025-11-13T10:00:00.000Z"
  },
  "message": "Order created successfully"
}
```

**Error Responses:**

```json
// 404 Not Found
{
  "success": false,
  "message": "Product prod-123e4567-e89b-12d3-a456-426614174000 not found"
}

// 422 Validation Error
{
  "success": false,
  "message": "Insufficient stock for product Luxury Watch"
}
```

---

### 14. Update Order Status

**Method:** `PUT`  
**URL:** `/api/v1/orders/:id/status`  
**Authentication:** Required (Bearer Token - Seller only)

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**URL Parameters:**

- `id`: Order ID (UUID)

**Request Body:**

```json
{
  "status": "shipped",
  "trackingNumber": "TRACK123456789",
  "notes": "Package shipped via DHL"
}
```

**Available Status Values:**

- `pending`
- `processing`
- `shipped`
- `delivered`
- `completed`
- `cancelled`

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "order-123e4567-e89b-12d3-a456-426614174000",
    "orderNumber": "ORD-1731500000000-ABC123XYZ",
    "customerId": "123e4567-e89b-12d3-a456-426614174000",
    "sellerId": "seller-123e4567-e89b-12d3-a456-426614174001",
    "items": [
      {
        "productId": "prod-123e4567-e89b-12d3-a456-426614174000",
        "name": "Luxury Watch",
        "quantity": 1,
        "price": 2500.0,
        "subtotal": 2500.0
      }
    ],
    "subtotal": 2500.0,
    "shippingCost": 20.0,
    "tax": 125.0,
    "total": 2645.0,
    "status": "shipped",
    "shippingAddress": {
      "street": "123 Main St",
      "city": "Riyadh",
      "country": "Saudi Arabia",
      "postalCode": "12345"
    },
    "paymentMethod": "credit_card",
    "trackingNumber": "TRACK123456789",
    "notes": "Package shipped via DHL",
    "createdAt": "2025-11-13T10:00:00.000Z",
    "updatedAt": "2025-11-13T12:00:00.000Z"
  },
  "message": "Order status updated successfully"
}
```

**Error Responses:**

```json
// 404 Not Found
{
  "success": false,
  "message": "Order not found"
}

// 401 Unauthorized
{
  "success": false,
  "message": "Not authorized to update this order"
}
```

---

## Common HTTP Status Codes

- **200 OK**: Request succeeded
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request format
- **401 Unauthorized**: Authentication required or invalid token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **422 Unprocessable Entity**: Validation error
- **429 Too Many Requests**: Rate limit exceeded (100 requests per minute)
- **500 Internal Server Error**: Server error

---

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

The access token is obtained from the `/auth/login` endpoint and expires after 1 hour.

---

## Rate Limiting

API requests are limited to **100 requests per minute** per IP address. If exceeded, you'll receive a 429 status code:

```json
{
  "success": false,
  "message": "Too many requests, please try again later"
}
```

---

## Notes

1. **Currency**: All prices are in Saudi Riyal (SAR)
2. **Order Calculations**:
   - Fixed shipping cost: 20.00 SAR
   - Tax rate: 5% of subtotal
   - Total = Subtotal + Shipping + Tax
3. **Product Stock**: Automatically updated when orders are created
4. **Order Numbers**: Auto-generated in format `ORD-{timestamp}-{random}`
5. **Seller Authorization**: Only sellers can manage their own products and orders
