# README for Client Application

This is the client application for the Recruitment App, built using React and Vite. 

## Getting Started

To get started with the client application, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd recruitment-app/client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000` to view the application.

## Build

To create a production build of the application, run:
```bash
npm run build
```

## Docker

To build and run the client application using Docker, use the following command:
```bash
docker build -t recruitment-app-client .
```

Then, you can run the container:
```bash
docker run -p 3000:3000 recruitment-app-client
```

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.