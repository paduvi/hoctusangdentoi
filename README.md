# Học từ sáng đến tối

**Project Overview**

This repository hosts the front‑end source code and data backup for the personal website **hoctusangdentoi.thanhhao.me**. The application is built with React and vanilla CSS, fetching content from the Hashnode headless CMS via GraphQL.

**Key Features**
- Dynamic retrieval of blog posts and categories from Hashnode.
- Responsive, modern UI with loading placeholders (shimmer effect).
- Automated build pipeline that bundles JavaScript with esbuild and minifies CSS.

**Prerequisites**
- Node.js (v14 or later)
- npm (comes with Node)

**Setup & Development**
```bash
# Clone the repository
git clone https://github.com/paduvi/hoctusangdentoi.git
cd hoctusangdentoi
```

**Build for Production**
```bash
# Generate minified assets in the `docs/dist` folder
# On Windows
./build_dist.bat
# On Linux/Mac
./build_dist.sh
```

**License**
This project is licensed under the MIT License.