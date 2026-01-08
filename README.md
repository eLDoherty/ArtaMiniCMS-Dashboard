# Arta Mini CMS Dashboard

Arta Mini CMS Dashboard is a web-based admin dashboard built with **Next.js**.  
This project is designed to **consume the REST API** provided by **ArtaMiniCMS** and serves as a centralized control panel for managing content, users, media, and site configuration.

API Repository:  
https://github.com/eLDoherty/ArtaMiniCMS

---

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- SCSS (Sass)
- Ant Design
- CKEditor 5
- Axios
- JWT-based Authentication
- Drag & Drop (hello-pangea/dnd)

---

## Features

### Authentication & Security
- JWT-based authentication
- Role-based access control
- Cookie-based session handling
- Protected admin routes

### Content Management
- Article management (CRUD)
- Page management with block-based layout
- Drag & drop page builder
- Rich text editor using CKEditor 5

### Media Management
- Media upload and management
- Media listing with pagination
- Media deletion
- Media reuse across pages and articles
- CKEditor media integration

### User Management
- User listing and management
- Role and permission handling
- User activation and deactivation
- Secure access control per role

### Site Settings
- Global site configuration
- SEO settings (meta title, description)
- Logo, favicon, and brand assets
- General site preferences

### Dashboard Analytics
- Content statistics overview
- Article and page activity summary
- Media usage insights
- Basic system and usage metrics

---

## Project Scripts

```bash
npm run dev     # Run development server on port 3001
npm run build   # Build for production
npm run start   # Start production server
npm run lint    # Run ESLint
