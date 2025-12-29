# ArtaMiniCMS-Dashboard

ArtaMiniCMS-Dashboard is an admin dashboard application built to consume the RESTful API provided by ArtaMiniCMS.

This project acts purely as a frontend admin panel and does not include its own backend. All authentication and data operations are handled by the ArtaMiniCMS API.

## Backend API

This dashboard consumes the API from the following repository:

https://github.com/eLDoherty/ArtaMiniCMS

Make sure the API service is running and accessible before using this dashboard.

## UI Framework

This dashboard is built using Ant Design, providing a clean and consistent user interface with ready-to-use components suitable for admin dashboards.

## Features

- API-based authentication
- Content management (articles, pages, etc.)
- Fully API-driven and stateless
- Modern admin interface using Ant Design
- Decoupled frontend and backend architecture


## Purpose

This project is intended to:
- Serve as an admin dashboard for ArtaMiniCMS
- Demonstrate separation of concerns between frontend and backend
- Provide a base structure for building custom CMS dashboards

## Notes

- Ensure CORS and authentication settings are properly configured on the API side

## Usage

### 1. Pull the Repository
Clone this repository to your local machine:

git clone https://github.com/eLDoherty/ArtaMiniCMS-Dashboard.git

cd ArtaMiniCMS-Dashboard

### 2. Install Dependencies
Install all required dependencies using npm:

npm install

### 3. Run Development Server
Start the development server:

npm run dev

The application will be available at:

http://localhost:3001 (Since we run the back end on port 3000 -- it's editable on package.json)

### 4. Run Production Build
Build the application for production:

npm run build

Start the production server:

npm run start


