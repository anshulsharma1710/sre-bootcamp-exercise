# Variables
DB_CONTAINER_NAME = db-container
API_CONTAINER_NAME = rest-api-container
DB_IMAGE = postgres:15
API_IMAGE = api_image
DOCKER_COMPOSE = docker-compose

# Default target
.PHONY: start-api
start-api: start-db migrations build-api run-api

# Target 1: Start the database container
.PHONY: start-db

# Start the database container
start-db:
	@echo "Starting the database container..."
	docker-compose up -d db

# Run the database migrations
migrations:
	@echo "Running database migrations..."
	docker exec -i db-container psql -U student_user -d student_db -f /app/migrations/init.sql

# Build the REST API Docker image
build-api:
	@echo "Building the REST API docker image..."
	docker build -t myapi-image .

# Start the REST API container
start-api:
	@echo "Starting the REST API container..."
	docker-compose up -d api

# Clean up Docker containers
clean:
	@echo "Cleaning up Docker containers..."
	docker-compose down

# Default target (you can run `make` without specifying a target)
default: start-db migrations build-api start-api
