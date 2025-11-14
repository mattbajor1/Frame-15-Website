# Frame 15 Website

A modern, animation-rich portfolio website for Frame 15, a creative production studio specializing in cinematic storytelling, video production, and aerial cinematography.

## 🚀 Tech Stack

- **React 19** - Latest React with modern hooks and features
- **Vite 7** - Lightning-fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion 12** - Advanced animation library
- **Cloudinary** - Media management and CDN
- **Netlify Functions** - Serverless backend
- **React Router 7** - Client-side routing

## 📋 Features

- ✅ Fully responsive design
- ✅ Advanced animations with Framer Motion
- ✅ Lazy-loaded components for optimal performance
- ✅ Error boundaries for graceful error handling
- ✅ Cloudinary integration for scalable media delivery
- ✅ Netlify Forms for contact submissions
- ✅ SEO optimized with meta tags
- ✅ Accessibility improvements (ARIA labels, focus management)
- ✅ Easter eggs (Konami code, logo glitch)

## 🛠️ Development

### Prerequisites

- Node.js 18+ and npm
- Cloudinary account (for media)
- Netlify account (for deployment)

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Frame-15-Website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Cloudinary cloud name:
   ```env
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173)

### Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🔐 Environment Variables

### Client-side (`.env`)
These are exposed in the browser bundle:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### Server-side (Netlify Dashboard Only)
⚠️ **NEVER commit these to git!** Set in Netlify dashboard → Site settings → Environment variables:

```env
# Option 1: All-in-one URL
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME

# Option 2: Individual values
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📦 Project Structure

```
Frame-15-Website/
├── src/
│   ├── components/        # React components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── ErrorBoundary.jsx
│   │   └── ...
│   ├── pages/             # Page components
│   │   ├── Home.jsx
│   │   ├── OurWork.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Portfolio.jsx
│   │   └── BTS.jsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useCloudinaryAssets.js
│   │   ├── useEasterEggs.js
│   │   └── useDocumentTitle.js
│   ├── App.jsx            # Root component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── netlify/
│   └── functions/
│       └── cloudinary-list.mjs  # Serverless function
├── public/
│   ├── images/            # Static images
│   └── videos/            # Static videos
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
├── tailwind.config.cjs    # Tailwind configuration
└── package.json           # Dependencies
```

## 🎨 Pages & Sections

- **Home** (`#home`) - Hero video + brand philosophy
- **Our Services** (`#projects`) - Video, drone, photography services
- **About** (`#about`) - Team member profiles
- **Behind the Scenes** (`#bts`) - BTS carousel
- **Contact** (`#contact`) - Contact form
- **Portfolio** (`#portfolio`) - Full-page photo gallery modal

## 🚀 Deployment

### Netlify (Recommended)

1. **Connect repository to Netlify**
   - Create new site from Git
   - Select your repository

2. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

3. **Add environment variables**
   - Go to Site settings → Environment variables
   - Add Cloudinary credentials (see Environment Variables section)

4. **Deploy**
   - Netlify will auto-deploy on git push to main branch

### Manual Build

```bash
npm run build
```

The `dist/` folder contains the production build ready for deployment.

## 🔧 Recent Improvements

### Security
- ✅ Removed exposed Cloudinary API secrets from `.env`
- ✅ Created `.env.example` with proper documentation
- ✅ Improved error handling in Netlify functions

### Performance
- ✅ Added lazy loading for all page components
- ✅ Implemented code splitting
- ✅ Optimized Cloudinary hook with better error handling

### Code Quality
- ✅ Added ErrorBoundary for graceful error handling
- ✅ Updated all dependencies to latest versions
- ✅ Improved accessibility with ARIA labels
- ✅ Better loading states and user feedback

### SEO
- ✅ Added meta tags and Open Graph data
- ✅ Created `useDocumentTitle` hook for dynamic titles
- ✅ Fixed favicon references
- ✅ Added canonical URLs

## 🐛 Known Issues

- Hash-based routing limits SEO capabilities (consider migrating to proper routes)
- Some images in `/public/images/` could be migrated to Cloudinary

## 📝 TODO

- [ ] Migrate remaining static images to Cloudinary
- [ ] Add analytics (Google Analytics / Plausible)
- [ ] Implement proper routing instead of hash-based navigation
- [ ] Add image loading placeholders/blur-up
- [ ] Create 404 page
- [ ] Add unit tests for components

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

All rights reserved - Frame 15

## 🙋 Support

For issues or questions, contact [info@frame15.com](mailto:info@frame15.com)
