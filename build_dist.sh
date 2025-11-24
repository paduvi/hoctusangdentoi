#!/bin/bash

echo "Checking for Node.js..."
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed or not in your PATH."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "Creating dist directories..."
mkdir -p docs/dist/js
mkdir -p docs/dist/css

echo "Installing dependencies (if needed)..."
npm install --save-dev esbuild react react-dom

echo "Bundling and Minifying JS with esbuild..."
npx esbuild docs/src/js/app.jsx --bundle --minify --outfile=docs/dist/js/app.min.js --loader:.js=jsx

echo "Minifying CSS with esbuild..."
npx esbuild docs/src/css/app.css --minify --outfile=docs/dist/css/app.min.css

echo "Done."
