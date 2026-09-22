# Saksham Sinha | Software & Systems Engineering Portfolio
Live URL: https://portfolio-yv50.onrender.com/

This repository contains the source code and deployment orchestration for my personal portfolio. 

While a static site generator could serve this content, I engineered this as a containerized multi-tier application to demonstrate proficiency in backend API development, reverse proxying, and Docker orchestration—mirroring the production environments I build for real-time diagnostics and distributed systems.

## 🏗️ Architecture & Trade-offs

The application is orchestrated via `docker-compose` and separated into distinct, isolated services:

* **Nginx (Reverse Proxy):** Handles static file serving for the frontend assets, which is significantly more performant than serving them through Node.js. It also acts as an API gateway, routing `/api` requests to the internal Express network.
* **Express.js (Backend API):** A decoupled backend service responsible for handling form submissions, rate-limiting, and validation. Keeping this isolated ensures the backend can be scaled independently or swapped without rebuilding the frontend.
* **Dockerized Environments:** Ensures environment parity across development and production, avoiding "it works on my machine" discrepancies.

## 🚀 Featured Technical Work

My primary focus lies in backend architecture, real-time media routing, and AI integrations. Key projects include:

* **Real-Time SFU Diagnostics Platform:** A containerized WebRTC video calling and diagnostic marker platform built with Node.js, Mediasoup, and WebSockets.
* **C++ Distributed Job Scheduler:** A multithreaded task execution engine featuring file-backed persistence.
* **Satya (AI Truth Meter):** An AI-powered news verification platform leveraging FastAPI and the Gemini API.
* **Plant Disease Segmentation:** Applied research utilizing nnU-Net v2 and PyTorch for leaf lesion segmentation.

## 🛠️ Local Development

1. Clone the repository.
2. Copy `.env.example` to `.env` and configure your local variables.
3. Run the orchestration:
   ```bash
   docker-compose up --build
