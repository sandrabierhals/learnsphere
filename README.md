# Learnsphere 2.0 🌍

A backend project using Django, with the frontend fully integrated through HTML templates.

## 📦 Prerequisites

- Docker installed ([Linux install guide](https://docs.docker.com/engine/install/ubuntu/))

## 🚀 How to run the project

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/learnsphere.git
   cd learnsphere
   ```

2. Build the Docker image:
   ```bash
   docker build -t learnsphere .
   ```

3. Run the container:
   ```bash
   docker run -p 8888:8000 learnsphere
   ```

4. Open in your browser:
   ```
   http://localhost:8888/index.html
   ```

## 💡 Notes

- The backend runs on Django (port 8000 exposed to host port 8888)
- HTML templates are located in `learnsphere/templates/`
- Static files are located in `learnsphere/static/`

---

Made with 💙 by Sandra Bierhals