# local-release.ps1
Write-Host "=== Local Release Script ===" -ForegroundColor Green

# 1. Build new image with tag
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$imageName = "quiz-backend:release-$timestamp"
Write-Host "Building image: $imageName" -ForegroundColor Yellow
docker build -t $imageName .
docker tag $imageName quiz-backend:latest

# 2. Stop and remove old container if exists
Write-Host "Stopping old container..." -ForegroundColor Yellow
docker stop quiz-backend 2>$null
docker rm quiz-backend 2>$null

# 3. Run new container
Write-Host "Starting new container..." -ForegroundColor Yellow
docker run -d --name quiz-backend -p 3000:3000 --env-file .env quiz-backend:latest

# 4. Smoke check
Write-Host "Waiting 5 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "Running smoke checks..." -ForegroundColor Yellow
$health = curl.exe -s http://localhost:3000/
if ($health -match "Quiz API") {
    Write-Host "вњ“ Smoke check passed!" -ForegroundColor Green
    Write-Host "Release successful! Tag: $imageName" -ForegroundColor Green
} else {
    Write-Host "вњ— Smoke check failed!" -ForegroundColor Red
    Write-Host "Rollback recommended!" -ForegroundColor Red
}
