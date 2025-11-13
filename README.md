# BayBlogs - Modern Blogging Platform

A full-featured blogging website built with Next.js 14, featuring authentication, comments, rich text editing, and a beautiful modern UI.

## Features

- ✅ User Authentication (Sign up, Login, Logout) using NextAuth
- ✅ Blog Management (Create, Edit, Delete posts)
- ✅ Rich Text Editor (React Quill)
- ✅ Image Upload Functionality (File upload or URL)
- ✅ Public Blog Feed with Pagination
- ✅ User Profiles
- ✅ Comments System with Nested Replies
- ✅ Search and Filter (by title, content, author, category)
- ✅ Responsive Design (Mobile, Tablet, Desktop)
- ✅ Dark Mode Toggle
- ✅ SEO-friendly pages with metadata
- ✅ Server-side Rendering
- ✅ Loading Skeletons and Animations

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Prisma with SQLite
- **Authentication**: NextAuth.js
- **Rich Text Editor**: React Quill
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd bay-blogs
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
bay-blogs/
├── app/
│   ├── api/              # API routes
│   ├── create/           # Create post page
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   ├── posts/[id]/       # Post detail and edit pages
│   ├── profile/[id]/     # User profile page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/           # React components
├── lib/                  # Utility functions
├── prisma/               # Database schema
└── types/                # TypeScript types
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Prisma Studio

## Features in Detail

### Authentication
- Secure password hashing with bcrypt
- JWT-based session management
- Protected routes for authenticated users

### Blog Management
- Rich text editor with formatting options
- Image upload functionality (supports JPEG, PNG, GIF, WebP)
- Image URL support (alternative to upload)
- Image preview before publishing
- Category tagging
- Draft/Published status
- View count tracking

### Comments
- Threaded comments (nested replies)
- Real-time comment updates
- Author identification

### Search & Filter
- Full-text search across titles and content
- Filter by category
- Filter by author
- Pagination support

### UI/UX
- Fully responsive design
- Dark mode support
- Smooth animations
- Loading states
- Error handling
- Toast notifications

## Database Schema

- **User**: id, name, email, password, image, bio
- **Post**: id, title, content, excerpt, image, category, published, authorId, views
- **Comment**: id, content, postId, authorId, parentId (for replies)

## Image Upload

The application supports image uploads with the following features:
- **File Upload**: Upload images directly from your device (max 5MB)
- **Supported Formats**: JPEG, PNG, GIF, WebP
- **Image Preview**: See your image before publishing
- **URL Alternative**: Paste image URLs if you prefer
- **Storage**: Images are stored in `public/uploads/` directory

**Note**: For production, consider using cloud storage services like:
- Cloudinary
- AWS S3
- Vercel Blob Storage

## Future Enhancements

- Cloud storage integration (Cloudinary, S3)
- Image optimization and resizing
- Email notifications
- Social sharing
- Tags system
- Reading time estimation
- Bookmarking posts
- User following system

## License

MIT License

