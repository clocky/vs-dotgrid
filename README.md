# vs-dotgrid

A Three.js implementation of the Visual Studio 2019 splash screen animation. This project recreates the iconic wave effect using a grid of particles and custom shaders.

## Features

- **Three.js & TypeScript**: Built with modern web technologies.
- **Custom Shaders**: Uses GLSL vertex and fragment shaders for precise rendering control.
- **Responsive Design**: Automatically adjusts to window resizing.
- **High Performance**: Efficiently renders thousands of particles using `THREE.Points`.

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/clocky/vs-dotgrid.git
   cd vs-dotgrid
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Project

Start the development server:

```bash
npm start
```

Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

### Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

### Deployment

To deploy to GitHub Pages:

```bash
npm run deploy
```

This will build the project and push the `dist` folder to the `gh-pages` branch. The site will be available at `https://clocky.github.io/vs-dotgrid/`.

## License

ISC
