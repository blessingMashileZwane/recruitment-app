# README for the Server Application

This is the server component of the Recruitment App. It is built using Express and connects to a PostgreSQL database. 

## Getting Started

### Prerequisites

- Node.js
- Docker (for containerization)
- PostgreSQL (for the database)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd recruitment-app/server
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Running the Application

To run the server locally, use the following command:
```
npm start
```

### Docker

To build and run the server using Docker, execute:
```
docker build -t recruitment-app-server .
docker run -p 5000:5000 recruitment-app-server
```

### Database Configuration

Ensure that the PostgreSQL database is set up and the connection details are correctly configured in `src/config/database.ts`.

### API Endpoints

Refer to the documentation for available API endpoints and their usage.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.