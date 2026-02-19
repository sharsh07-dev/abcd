# Polyglot Sandbox Environment

To enable secure, sandboxed execution of code (Python, Node.js, Java), follow these steps:

## 1. Prerequisites
- Install **Docker Desktop** (or Docker Engine) on your machine.
- Ensure the `docker` CLI is available in your PATH.

## 2. Build the Sandbox Image
Run the following command from the project root:

```bash
cd backend/sandbox
docker build -t autonomous-healing-sandbox:latest .
```

This builds a Docker image containing:
- Python 3.11 + pytest
- Node.js 20 + npm/yarn
- OpenJDK 17 + Maven + Gradle

## 3. Enable Sandboxing
Update your `.env` file or `config/settings.py`:

```bash
USE_DOCKER_SANDBOX=True
```

Restart the backend server. The agent will now execute tests inside the Docker container.
