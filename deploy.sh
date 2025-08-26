# Deployment Script for EchoSphere

# Exit on error
set -e

# Print deployment steps
echo "==== EchoSphere Deployment Script ===="
echo "This script will deploy the EchoSphere application using Docker."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker before proceeding."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose before proceeding."
    exit 1
fi

# Ask for MongoDB Atlas URL or use the default
read -p "Enter your MongoDB Atlas URL (leave blank to use the default): " mongo_url
if [ -z "$mongo_url" ]; then
    mongo_url="mongodb+srv://asitshakya789:Fsi%401234@echosphere-db.2mzknvv.mongodb.net/?retryWrites=true&w=majority&appName=echosphere-db"
fi

# Ask for the production API URL
read -p "Enter your production API URL (e.g., http://your-server-ip:5000): " api_url
if [ -z "$api_url" ]; then
    api_url="http://localhost:5000"
fi

# Update the docker-compose.yml file
echo "Updating docker-compose.yml with your MongoDB URL and API URL..."
sed -i "s|MONGO_URL=mongodb+srv://.*|MONGO_URL=$mongo_url|g" docker-compose.yml
sed -i "s|REACT_APP_API_URL=http://localhost:5000|REACT_APP_API_URL=$api_url|g" docker-compose.yml

# Update the server/.env file
echo "Updating server/.env with your MongoDB URL..."
echo "PORT=5000
MONGO_URL=\"$mongo_url\"" > server/.env

# Build and start the containers
echo "Building and starting the Docker containers..."
docker-compose up --build -d

echo ""
echo "==== Deployment Complete ===="
echo "Your EchoSphere application should now be running!"
echo "- Frontend: http://your-server-ip:3000"
echo "- Backend API: $api_url"
echo ""
echo "To check the logs, run: docker-compose logs -f"
echo "To stop the application, run: docker-compose down"
