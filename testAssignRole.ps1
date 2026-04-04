# Test assign role endpoint

Write-Host "Testing assign-role endpoint...`n" -ForegroundColor Cyan

try {
    # Login
    $loginBody = @{
        email = "admin@example.com"
        password = "Admin@123"
    } | ConvertTo-Json

    $login = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody

    $token = $login.accessToken
    Write-Host "✓ Login successful" -ForegroundColor Green
    Write-Host "  Token: $($token.Substring(0,20))...`n"

    # Get users
    $users = Invoke-RestMethod -Uri "http://localhost:5000/api/users" `
        -Method GET `
        -Headers @{ "Authorization" = "Bearer $token" }

    Write-Host "✓ Found $($users.Count) users" -ForegroundColor Green
    Write-Host "  Users:`n"
    $users | ForEach-Object { 
        Write-Host "    - $($_.username) (role count: $($_.roles.Count))"
    }
    Write-Host ""

    # Get first user (not admin_user)
    $targetUser = $users | Where-Object { $_.username -ne "admin_user" } | Select-Object -First 1

    if ($targetUser) {
        Write-Host "✓ Target user: $($targetUser.username) ($($targetUser._id))" -ForegroundColor Yellow
        Write-Host "  Current role count: $($targetUser.roles.Count)`n"

        # Assign moderator role
        Write-Host "Assigning MODERATOR role..." -ForegroundColor Cyan

        $assignBody = @{
            roleName = "moderator"
        } | ConvertTo-Json

        $result = Invoke-RestMethod -Uri "http://localhost:5000/api/users/$($targetUser._id)/assign-role" `
            -Method PATCH `
            -ContentType "application/json" `
            -Headers @{ "Authorization" = "Bearer $token" } `
            -Body $assignBody

        Write-Host "✅ SUCCESS!" -ForegroundColor Green
        Write-Host "`nResponse:`n"
        Write-Host $result | ConvertTo-Json -Depth 3

        # Verify in DB
        Write-Host "`n`nVerifying in database...`n" -ForegroundColor Cyan
        $verified = Invoke-RestMethod -Uri "http://localhost:5000/api/users/$($targetUser._id)" `
            -Method GET `
            -Headers @{ "Authorization" = "Bearer $token" }

        Write-Host "User: $($verified.username)"
        Write-Host "Roles in DB: $($verified.roles.Count)"
        Write-Host "Role IDs: $($verified.roles -join ', ')"

    } else {
        Write-Host "⚠️ No test user found" -ForegroundColor Yellow
    }

} catch {
    Write-Host "❌ ERROR!" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}
