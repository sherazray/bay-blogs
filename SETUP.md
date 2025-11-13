# Quick Setup Guide

Follow these steps to get BayBlogs running:

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
```

**Important**: Generate a secure random string for `NEXTAUTH_SECRET`. You can use:
```bash
openssl rand -base64 32
```

## 3. Initialize Database

```bash
npx prisma generate
npx prisma db push
```

## 4. Start Development Server

```bash
npm run dev
```

## 5. Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

## First Steps

1. **Create an account**: Click "Sign Up" and create your account
2. **Create a post**: Click "New Post" to write your first blog post
3. **Explore**: Browse posts, leave comments, and customize your profile

## Troubleshooting

### Database Issues
- If you get database errors, try: `npx prisma db push --force-reset`
- Note: This will delete all data!

### Authentication Issues
- Make sure `NEXTAUTH_SECRET` is set in your `.env` file
- Clear browser cookies if you're having session issues

### Build Issues
- Run `npm install` again to ensure all dependencies are installed
- Delete `node_modules` and `.next` folders, then reinstall

## Production Deployment

For production:
1. Change `DATABASE_URL` to a production database (PostgreSQL recommended)
2. Set a strong `NEXTAUTH_SECRET`
3. Update `NEXTAUTH_URL` to your production domain
4. Run `npm run build` to test the production build

