# Deployment Status Checker
Write-Host "=== LibraLearn Deployment Status ===" -ForegroundColor Green

Write-Host "`n1. Testing Backend Connectivity..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "https://libralearn-production.up.railway.app/" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend Status: ONLINE" -ForegroundColor Green
    Write-Host "Response: $response"
} catch {
    Write-Host "❌ Backend Status: OFFLINE" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)"
    
    if ($_.Exception.Message -like "*502*") {
        Write-Host "💡 This usually means Railway is still deploying. Check your Railway dashboard." -ForegroundColor Yellow
    }
}

Write-Host "`n2. Testing Frontend Connectivity..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "https://libralearn.vercel.app/" -Method GET -TimeoutSec 5
    Write-Host "✅ Frontend Status: ONLINE" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend Status: OFFLINE" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)"
}

Write-Host "`n3. Next Steps:" -ForegroundColor Cyan
Write-Host "• Check Railway dashboard: https://railway.app/project/your-project-id" -ForegroundColor White
Write-Host "• Check Vercel dashboard: https://vercel.com/your-username/libralearn" -ForegroundColor White
Write-Host "• Set environment variables as shown in DEPLOYMENT_GUIDE.md" -ForegroundColor White
Write-Host "• Wait for deployments to complete before testing" -ForegroundColor White

Write-Host "`n=== End Status Check ===" -ForegroundColor Green
