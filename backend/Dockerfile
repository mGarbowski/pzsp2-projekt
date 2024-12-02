# Use an official Python runtime as a parent image
FROM python:3.12-slim as base

# Update apt repository
RUN apt update

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Set the working directory to /psi_backend
WORKDIR /pzsp_backend

# Copy project files
COPY pyproject.toml pdm.lock ./

# Add cbc
RUN apt-get install -y coinor-cbc coinor-libcbc-dev

# Install PDM
RUN pip install --no-cache-dir pdm

# Copy the application code
COPY src ./src

# Install production dependencies
RUN pdm install --prod --no-editable --no-lock

# Expose port 8000
EXPOSE 8000

# Run the application
CMD ["pdm", "start"]
