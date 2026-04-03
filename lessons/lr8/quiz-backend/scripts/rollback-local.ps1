@'
# rollback-local.ps1
Write-Host "=== Local Rollback Script ===" -ForegroundColor Yellow

# Get previous release tag (you can modify this logic)
$previousTag = "quiz-backend:latest"
Write-Host "Rolling back to: $previousTag" -ForegroundColor Yellow

# Stop current container
Write-Host "Stopping current container..." -ForegroundColor Yellow
docker stop quiz-backend 2>$null
docker rm quiz-backend 2>$null

# Run previous version
Write-Host "Starting previous version..." -ForegroundColor Yellow
docker run -d --name quiz-backend -p 3000:3000 --env-file .env $previousTag

# Smoke check
Start-Sleep -Seconds 5
$health = curl.exe -s http://localhost:3000/
if ($health -match "Quiz API") {
    Write-Host "✓ Rollback successful!" -ForegroundColor Green
} else {
    Write-Host "✗ Rollback failed!" -ForegroundColor Red
}
'@ | Out-File -FilePath scripts/rollback-local.ps1 -Encoding utf8