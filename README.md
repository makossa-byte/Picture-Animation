
# Picture Animator AI

An AI-powered application to bring your static pictures to life. Upload an image, provide a prompt, and watch as Gemini generates a stunning animation using Google's generative AI models.

This project comes with a full suite of deployment and packaging scripts for web, desktop, and containerized environments.

## Features

-   **Image-to-Video Animation**: Convert static images into dynamic videos with a text prompt.
-   **AI-Powered**: Utilizes the Gemini API for high-quality video generation.
-   **Modern UI**: Clean, responsive, and user-friendly interface built with React and Tailwind CSS.
-   **Multi-Platform Deployment**:
    -   **Web**: One-click deployment to Vercel, Netlify, and GitHub Pages.
    -   **Desktop**: Cross-platform builds for Windows, macOS, and Linux via Electron.
    -   **Container**: Lightweight Docker container for private hosting or local testing.

## Getting Started

### Prerequisites

-   Node.js v18+ and npm v9+
-   Docker v20+ (for containerization)
-   A Google Gemini API Key.

### Installation & Local Development

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your Gemini API Key:**
    Create a `.env` file in the root directory and add your API key:
    ```
    API_KEY=your_gemini_api_key_here
    ```
    *Note: The application is configured to read this key via `process.env.API_KEY`. When deploying, you must set this environment variable in your hosting provider's settings.*

4.  **Run the development server:**
    ```bash
    npm start
    ```
    The app will be available at `http://localhost:3000`.

---

## 1. Web Deployment

The `scripts/build-web.sh` script prepares the application for web deployment.

### Build for Web

Run the build script:

```bash
sh scripts/build-web.sh
```

This command creates an optimized production build in the `build/` directory and prints deployment instructions.

### Deploying to Vercel

1.  Push your code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Import the project into [Vercel](https://vercel.com/new).
3.  Vercel will likely auto-detect the React setup. Use the following build settings:
    -   **Build Command**: `npm run build`
    -   **Output Directory**: `build`
4.  Add your `API_KEY` as an environment variable in the Vercel project settings.
5.  Deploy!

### Deploying to Netlify

1.  Push your code to a Git repository.
2.  Create a new site from Git on [Netlify](https://app.netlify.com/start).
3.  Use the following build settings:
    -   **Build Command**: `npm run build`
    -   **Publish Directory**: `build`
4.  Add your `API_KEY` as an environment variable in `Site settings > Build & deploy > Environment`.
5.  Deploy!

### Deploying to GitHub Pages

1.  **Update `package.json`**:
    Set the `homepage` field to your GitHub Pages URL.
    ```json
    "homepage": "https://<your-username>.github.io/<your-repo-name>/"
    ```

2.  **Deploy**:
    If using a package like `gh-pages`, you can add a script to `package.json`:
    ```json
    "scripts": {
      "predeploy": "npm run build",
      "deploy": "gh-pages -d build"
    }
    ```
    Then run `npm run deploy`. You must configure your `API_KEY` via GitHub Actions secrets if you have a CI/CD setup for deployment.

---

## 2. Desktop Application (Electron)

The `scripts/build-desktop.sh` script packages the app into executables for Windows, macOS, and Linux.

### Build for Desktop

Ensure you have installed `electron` and `electron-packager` as dev dependencies.

Run the desktop build script:

```bash
sh scripts/build-desktop.sh
```

This command will:
1.  Build the React app.
2.  Package it into executables inside the `release/` directory.

### Running the Desktop App

Navigate to the `release/` directory and find the executable for your operating system. For example, on macOS: `release/Picture-Animator-AI-darwin-x64/Picture-Animator-AI.app`.

**Note on API Keys for Desktop**: The Electron app will also need the `API_KEY`. This can be managed using a library like `dotenv` from within the `electron/main.js` or by setting it in the user's system environment variables before launching the app.

---

## 3. Docker Containerization

A `Dockerfile` and `docker-compose.yml` are provided for easy containerization.

### Building and Running with Docker

1.  **Build the Docker image:**
    ```bash
    docker build -t picture-animator-ai .
    ```

2.  **Run the Docker container:**
    You must pass the API key as an environment variable to the container.
    ```bash
    docker run -p 8080:80 -e API_KEY="your_gemini_api_key_here" --name picture-animator-app picture-animator-ai
    ```
    The app will be available at `http://localhost:8080`.

### Using Docker Compose

The `docker-compose.yml` file simplifies local testing.

1.  **Create a `.env` file** in the project root (if you haven't already) with your `API_KEY`. Docker Compose will automatically load it.
    ```
    API_KEY=your_gemini_api_key_here
    ```

2.  **Start the service:**
    ```bash
    docker-compose up --build
    ```
    Use the `-d` flag to run in detached mode.

3.  **Stop the service:**
    ```bash
    docker-compose down
    ```

---

## Troubleshooting

-   **`API_KEY` not found**: Ensure the `API_KEY` environment variable is correctly set in your deployment environment (Vercel, Netlify, Docker, `.env` file for local/Compose).
-   **GitHub Pages shows a blank page**: Verify the `homepage` property in `package.json` is correct and that asset paths are relative.
-   **Electron build fails**: Make sure `electron` and `electron-packager` are installed (`npm install --save-dev electron electron-packager`). Also, check for platform-specific build issues (e.g., code signing on macOS).
-   **Docker container exits immediately**: Check the container logs with `docker logs picture-animator-app` for errors. It's often due to a misconfigured Nginx or build issues.
