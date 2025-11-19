# AGENTS.md

## Project Overview
`vs-dotgrid` is a Three.js implementation of the Visual Studio 2019 splash screen animation. It renders a grid of dots that move in a wave-like pattern using custom GLSL shaders.

## Tech Stack
- **Language**: TypeScript
- **Build Tool**: Vite
- **3D Library**: Three.js
- **Styling**: CSS (minimal)

## Key Files & Directories
- **`src/main.ts`**: The main entry point.
    - Initializes the Three.js scene, camera, and renderer.
    - Creates the particle system (`THREE.Points`) with custom geometry and material.
    - Handles the animation loop (`animate` function) and window resizing.
    - Updates particle positions and scales in the render loop based on sine/cosine waves.
- **`src/shaders/`**: Contains GLSL shader files.
    - `vertex.glsl`: Vertex shader for the particles.
    - `fragment.glsl`: Fragment shader for the particles.
- **`index.html`**: The HTML entry point.
- **`vite.config.js`**: Vite configuration.

## Architecture
The application uses a single Three.js scene.
- **Particles**: Created using `THREE.BufferGeometry` with custom attributes for position and scale.
- **Material**: `THREE.ShaderMaterial` is used to render the particles, allowing for custom vertex and fragment processing.
- **Animation**: The wave effect is achieved by updating the `position` and `scale` attributes of the particles in the `render` function in `src/main.ts`.

## Commands
- **Install Dependencies**: `npm install`
- **Start Dev Server**: `npm start` (runs `vite`)
- **Build for Production**: `npm run build` (runs `vite build`)
- **Preview Production Build**: `npm run preview` (runs `vite preview`)
- **Deploy to GitHub Pages**: `npm run deploy` (runs `npm run build` and `gh-pages -d dist`)
