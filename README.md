# Bimi Admin Dashboard

Bimi Admin Dashboard is a web-based application for Program Managers of BudgIT’s AI backend (Bimi), which leverages Retrieval-Augmented Generation (RAG) to power a chatbot for querying and analyzing Nigerian fiscal data.

## Purpose

The dashboard enables Program Managers to:
- Upload new fiscal datasets to the Bimi backend
- Manage (view, update, delete) existing datasets
- Oversee and maintain the data that powers the AI chatbot

## Tech Stack
- **Frontend**: React (with Vite for fast development)
- **UI Library**: Material UI
- **State/API Management**: React Query, Axios
- **API Integration**: [Bimi API Documentation](https://bimixapi.budgit.org/docs)

## Key Features
- **Dataset Upload**: Upload new fiscal data files directly to the backend
- **Dataset Management**: View, update, or delete datasets
- **Secure API Integration**: All actions performed via the official Bimi API

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser at [http://localhost:5173](http://localhost:5173)

## API Reference
See the official [Bimi API Docs](https://bimixapi.budgit.org/docs) for available endpoints and usage details.

## License
MIT
