# Deployment Script for EchoSphere (Windows PowerShell)

# Function to check if a command exists
function Test-CommandExists {
    param ($command)
    $oldPreference = $ErrorActionPreference
    $ErrorActionPreference = 'stop'
    try {
        if (Get-Command $command) { return $true }
    }
    catch { return $false }
    finally { $ErrorActionPreference = $oldPreference }
}

# Print deployment steps
Write-Host "==== EchoSphere Deployment Script ====" -ForegroundColor Cyan
Write-Host "This script will deploy the EchoSphere application using Docker."
Write-Host ""

# Check if Docker is installed
if (-not (Test-CommandExists docker)) {
    Write-Host "Docker is not installed. Please install Docker before proceeding." -ForegroundColor Red
    exit 1
}

# Check if Docker Compose is installed
if (-not (Test-CommandExists docker-compose)) {
    Write-Host "Docker Compose is not installed. Please install Docker Compose before proceeding." -ForegroundColor Red
    exit 1
}

# Ask for MongoDB Atlas URL or use the default
$mongo_url = Read-Host -Prompt "Enter your MongoDB Atlas URL (leave blank to use the default)"
if ([string]::IsNullOrEmpty($mongo_url)) {
    $mongo_url = "mongodb+srv://asitshakya789:Fsi%401234@echosphere-db.2mzknvv.mongodb.net/?retryWrites=true&w=majority&appName=echosphere-db"
}

# Ask for the production API URL
$api_url = Read-Host -Prompt "Enter your production API URL (e.g., http://your-server-ip:5000)"
if ([string]::IsNullOrEmpty($api_url)) {
    $api_url = "http://localhost:5000"
}

# Update the docker-compose.yml file
Write-Host "Updating docker-compose.yml with your MongoDB URL and API URL..." -ForegroundColor Yellow
$dockerComposeContent = Get-Content -Path "docker-compose.yml" -Raw
$dockerComposeContent = $dockerComposeContent -replace "MONGO_URL=mongodb\+srv://.*", "MONGO_URL=$($mongo_url)"
$dockerComposeContent = $dockerComposeContent -replace "REACT_APP_API_URL=http://localhost:5000", "REACT_APP_API_URL=$($api_url)"
Set-Content -Path "docker-compose.yml" -Value $dockerComposeContent

# Update the server/.env file
Write-Host "Updating server/.env with your MongoDB URL..." -ForegroundColor Yellow
$envContent = "PORT=5000`r`nMONGO_URL=`"$mongo_url`""
Set-Content -Path "server/.env" -Value $envContent

# Build and start the containers
Write-Host "Building and starting the Docker containers..." -ForegroundColor Yellow
docker-compose up --build -d

Write-Host ""
Write-Host "==== Deployment Complete ====" -ForegroundColor Green
Write-Host "Your EchoSphere application should now be running!"
Write-Host "- Frontend: http://your-server-ip:3000"
Write-Host "- Backend API: $api_url"
Write-Host ""
Write-Host "To check the logs, run: docker-compose logs -f"
Write-Host "To stop the application, run: docker-compose down"
