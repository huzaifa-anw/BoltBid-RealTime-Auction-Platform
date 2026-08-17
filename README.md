# BoltBid, A Real-Time Auction Platform

## Overview

BoltBid is a full-stack, real-time auction platform that allows users to create auctions, place bids, and compete with other users through live bid updates powered by WebSockets.

The project was built as a portfolio project to explore backend engineering concepts such as database transactions, concurrency control, real-time communication, REST API design, and PostgreSQL integration.

---

## Features

### Authentication

* User registration
* User login
* JWT-based authentication
* Protected API routes
* Protected Socket.IO connections

### Auction Management

* Create auctions
* Browse active auctions
* View auction details
* Delete auctions
* Extend auction duration
* View auction owners

### Real-Time Bidding

* Live bid updates using Socket.IO
* Automatic highest-bid updates
* Real-time bid history
* Auction room subscriptions
* Server-side bid validation

### Auction Lifecycle

* Automatic auction expiration
* Background sweeper process
* Active/inactive auction status management

---

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* Socket.IO Client
* date-fns
* Framer Motion
* React Icons

### Backend

* Node.js
* Express
* Socket.IO
* PostgreSQL
* Drizzle ORM
* JWT
* bcrypt
* express-validator

### Database & Infrastructure

* PostgreSQL
* Supabase

---

## Architecture

```text
Client (React)
        │
        ▼
REST API (Express)
        │
        ▼
PostgreSQL (Supabase)

        ▲
        │

Socket.IO Server
        │
        ▼

Live Bid Broadcasting
```

---

## Real-Time Bidding Flow

1. A user opens an auction page.
2. The frontend fetches the auction details.
3. The frontend fetches the bid history.
4. The client establishes a Socket.IO connection.
5. The client joins the auction room.
6. A user submits a bid.
7. The server validates the bid.
8. A database transaction begins.
9. The auction row is locked using `SELECT ... FOR UPDATE`.
10. The new bid is inserted into the database.
11. The highest bid is updated.
12. The transaction commits.
13. The server broadcasts the new bid to everyone connected to that auction room.
14. Every connected client receives the update instantly.

---

## Concurrency Control

BoltBid uses database transactions and row-level locking to prevent race conditions during simultaneous bids.

```sql
SELECT *
FROM auctions
WHERE id = ?
FOR UPDATE;
```

This ensures that multiple users cannot overwrite each other's bids.

---

## API Endpoints

### Authentication

```http
POST /api/v1/auth/signup
POST /api/v1/auth/login
```

### Users

```http
GET /api/v1/users/me
```

### Auctions

```http
GET    /api/v1/auctions
POST   /api/v1/auctions
GET    /api/v1/auctions/:id
PATCH  /api/v1/auctions/:id
DELETE /api/v1/auctions/:id
```

### Bids

```http
GET /api/v1/auctions/:id/bids
```

---

## Socket Events

### Client → Server

```text
join-auction
leave-auction
place-bid
```

### Server → Client

```text
bid-placed
place-bid-error
```

---

## Installation

### Clone the repository

```bash
git clone <repository-url>
```

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## Environment Variables

### Backend

```env
PORT=
DATABASE_URL=
ACCESS_TOKEN_SECRET=
```

### Frontend

```env
VITE_SERVER_URL=
VITE_WS_SERVER_URL=
```

---

## Future Improvements

* User wallet and balance system
* Payment integration
* Auction categories
* Search and filtering
* Image uploads instead of image URLs
* Pagination
* Auction analytics
* User profiles
* Email notifications
* Docker support
* Unit and integration tests
* CI/CD pipelines

---

## Lessons Learned

This project was an opportunity to explore several backend engineering concepts, including:

* REST API development
* JWT authentication
* PostgreSQL transactions
* Row-level locking
* Real-time communication
* Socket.IO
* State management in React
* Database design with Drizzle ORM
* Concurrency handling

---

## Screenshots

Add screenshots here.

```text
Landing Page

Dashboard

Auction Details

Live Bidding
```

---

## License

This project was built for educational and portfolio purposes.
