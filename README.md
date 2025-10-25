# Desert By The Sea Rentals Web System

The DBTSR repository includes the Frontend and Backend.
All sensitive data has been removed and will be shared only on a need-to-know basis.

Both ends come with their own README file on how to run their development servers.
The project implements the following technologies:

## Server

#### Go

Main server where most of the business logic runs. Routing is handled by Chi

#### Python

Sidecar for our Go server. This is where we run the OCR for our file scanning

## Client

#### React

We run base React with vite. Our API layer utilizes React Query


# Handwriting OCR MVP

Local-first pipeline for fixed-layout forms with handwritten fields.

## Run

```bash
docker compose up --build
```