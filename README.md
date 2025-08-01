# README.md for Recruitment App

# Recruitment App

This is a Recruitment App built with a React frontend and an Express backend, designed to manage recruitment processes efficiently. The application connects to a PostgreSQL database and is containerized using Docker for easy deployment.

## Project Structure

- **client/**: Contains the React frontend application.
- **server/**: Contains the Express backend application.
- **database/**: Contains database migration and seed files.
- **docker-compose.yml**: Defines the services for the application.

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Running the Application

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd recruitment-app
   ```

2. Build and run the application using Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:5000`

## Contributing

Feel free to submit issues or pull requests for any improvements or bug fixes.

## License

This project is licensed under the MIT License.