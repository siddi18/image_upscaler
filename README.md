# AI Image Upscaler 🎨✨

A modern, AI-powered image upscaling web application built with Next.js 14, featuring a beautiful gradient UI and real-time image enhancement capabilities.

![Next.js](https://img.shields.io/badge/Next.js-14.2.20-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)

## ✨ Features

- 🚀 **AI-Powered Upscaling** - Enhance image quality using advanced AI technology
- 🎨 **Modern Gradient UI** - Beautiful purple, pink, and blue gradient design
- 📱 **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
- 🖼️ **Before & After Comparison** - Side-by-side view of original and enhanced images
- 📂 **Multiple Format Support** - PNG, JPG, JPEG, and WebP
- 🔒 **File Validation** - Automatic format and size checking (max 5MB)
- 🎯 **Drag & Drop Upload** - Intuitive file upload with drag-and-drop support
- 📊 **Real-time Progress Tracking** - Visual progress bar with stage indicators
- ⚡ **Batch Processing** - Upload and process multiple images at once
- 💾 **Easy Download** - One-click download of enhanced images
- 🎛️ **Upscaling Options** - Choose between 2x and 4x quality (UI showcase)

## 🖼️ Screenshots

### Upload Interface
Modern, clean upload interface with gradient effects and glassmorphism

### Processing
Real-time progress tracking with animated spinners and percentage display

### Results
Side-by-side before/after comparison with detailed image cards

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- RapidAPI account with AI Image Upscaler API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ai-image-upscaler.git
cd ai-image-upscaler
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:
```env
AI_IMAGE_UPSCALER_API_KEY=your_rapidapi_key_here
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:3000
```

## 🔑 Getting Your API Key

1. Sign up at [RapidAPI](https://rapidapi.com)
2. Subscribe to [AI Image Upscaler API](https://rapidapi.com/ai-image-upscaler/api/ai-image-upscaler1)
3. Copy your API key from the dashboard
4. Add it to your `.env.local` file

## 🛠️ Tech Stack

- **Framework:** Next.js 14.2.20
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3.4
- **UI Components:** Radix UI
- **HTTP Client:** Axios
- **File Operations:** file-saver, JSZip
- **Icons:** Lucide React

## 📦 Project Structure

```
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Home page
│   ├── components/
│   │   └── ImageUploader.tsx     # Main uploader component
│   ├── hooks/
│   │   └── use-mobile.tsx        # Mobile detection hook
│   └── lib/
│       └── utils.ts              # Utility functions
├── public/                       # Static assets
├── .env.local                    # Environment variables (create this)
└── package.json                  # Dependencies
```

## 🎯 Usage

1. **Upload Images**
   - Click "Choose Images" button
   - Or drag and drop images anywhere on the page
   - Or paste images with Ctrl+V

2. **Select Quality**
   - Choose between 2x or 4x upscaling (UI showcase)

3. **Process**
   - Images are automatically validated and processed
   - Watch the progress bar for real-time updates

4. **Download**
   - View before/after comparison
   - Download enhanced images individually

## 🔒 File Validation

- **Supported Formats:** PNG, JPG, JPEG, WebP
- **Maximum File Size:** 5MB per file
- **Automatic Validation:** Invalid files are rejected with clear error messages

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variable: `AI_IMAGE_UPSCALER_API_KEY`
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🎨 Color Palette

- **Primary Gradient:** Purple (#7C3AED) → Pink (#EC4899) → Blue (#3B82F6)
- **Background:** Purple/Pink/Blue gradient (50 opacity)
- **Text:** Gray scale for readability
- **Accents:** White with transparency for glassmorphism


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- AI Image Upscaler API by RapidAPI
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Radix UI for accessible component primitives

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with ❤️ using Next.js and AI
