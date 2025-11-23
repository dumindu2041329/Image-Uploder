# 🖼️ Pixel Vault

A modern, secure image gallery application built with React, TypeScript, and Parse Server. Upload, share, and manage your photos with a beautiful, responsive interface.

![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## ✨ Features

- 🔐 **Secure Authentication** - User registration and login powered by Parse Server
- 📤 **Image Upload** - Upload images up to 5MB (JPEG/PNG supported)
- 🖼️ **Public Gallery** - Browse all uploaded images in a responsive grid layout
- 🗑️ **Delete Control** - Users can delete their own uploads
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development and builds
- 🔒 **Protected Routes** - Authentication-based route protection
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices

## 🚀 Tech Stack

### Frontend
- **React 19.1.0** - Modern UI library with latest features
- **TypeScript 5.8.3** - Type-safe development
- **Vite 6.3.5** - Next-generation build tool
- **React Router 7.9.6** - Client-side routing
- **TailwindCSS 3.4.1** - Utility-first CSS framework

### Backend
- **Parse Server** - Backend-as-a-Service (BaaS)
- **Back4App** - Parse Server hosting platform

### Key Libraries
- **React Hook Form** - Efficient form handling
- **Zod** - Schema validation
- **Lucide React** - Beautiful icon set
- **Axios** - HTTP client

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- A **Back4App** account (free tier available)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pixel-vault.git
   cd pixel-vault
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_PARSE_APPLICATION_ID=your_application_id
   VITE_PARSE_JAVASCRIPT_KEY=your_javascript_key
   VITE_PARSE_SERVER_URL=your_server_url
   ```

   Get these credentials from your Back4App dashboard:
   - Go to [Back4App](https://www.back4app.com/)
   - Create a new app or select an existing one
   - Navigate to App Settings → Security & Keys
   - Copy the Application ID, JavaScript Key, and Server URL

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The app will be available at `http://localhost:5173`

## 🎯 Usage

### For Users

1. **Sign Up** - Create a new account with username, email, and password
2. **Login** - Access your account
3. **Upload Images** - Navigate to the upload page and share your photos
   - Supported formats: JPEG, PNG
   - Maximum size: 5MB
4. **Browse Gallery** - View all public images on the home page
5. **Delete Images** - Remove your own uploads with a confirmation dialog

### For Developers

**Build for production:**
```bash
npm run build
# or
yarn build
```

**Preview production build:**
```bash
npm run preview
# or
yarn preview
```

**Run linter:**
```bash
npm run lint
# or
yarn lint
```

## 📁 Project Structure

```
Image-Uploader/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # Base UI components (Button, Card, Input, etc.)
│   │   ├── Navbar.tsx   # Navigation bar
│   │   └── ProtectedRoute.tsx
│   ├── context/         # React context providers
│   │   └── AuthContext.tsx
│   ├── hooks/           # Custom React hooks
│   │   └── use-toast.tsx
│   ├── lib/             # Utility functions and configurations
│   │   ├── parse.ts     # Parse SDK initialization
│   │   └── utils.ts     # Helper functions
│   ├── pages/           # Application pages
│   │   ├── Home.tsx     # Gallery page
│   │   ├── Login.tsx    # Login page
│   │   ├── SignUp.tsx   # Registration page
│   │   └── Upload.tsx   # Image upload page
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Application entry point
├── public/              # Static assets
├── .env                 # Environment variables (not in repo)
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## 🔧 Configuration

### Parse Server Classes

The app uses the following Parse classes:

**Gallery**
- `title` (String) - Image title
- `imageFile` (File) - Uploaded image file
- `user` (Pointer to _User) - User who uploaded the image
- `createdAt` (Date) - Upload timestamp (automatic)

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_PARSE_APPLICATION_ID` | Your Parse application ID | ✅ |
| `VITE_PARSE_JAVASCRIPT_KEY` | Your Parse JavaScript key | ✅ |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Your Name**
- GitHub: [@dumindu2041329](https://github.com/dumindu2041329)
- LinkedIn: [Dumindu Damsara](https://www.linkedin.com/in/dumindu-damsara-0049ab246/)

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI library
- [Parse Platform](https://parseplatform.org/) - Backend service
- [Back4App](https://www.back4app.com/) - Parse hosting
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Lucide](https://lucide.dev/) - Icon library
- [shadcn/ui](https://ui.shadcn.com/) - UI component inspiration

## 📧 Support

If you have any questions or need help, please open an issue or contact [dumindudamsara60@gmail.com](mailto:dumindudamsara60@gmail.com).

---

⭐ **Star this repo if you find it helpful!**
