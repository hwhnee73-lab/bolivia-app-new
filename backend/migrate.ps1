$root = "c:\project_ai\bolivia-app\backend\src\main\java"
$srcBase = Join-Path $root "com\example\bolivia"
$dstBase = Join-Path $root "com\bolivia\app"

$allFiles = @(
    "dto\BillDto.java",
    "dto\BillAdminDto.java",
    "dto\MaintenanceDto.java",
    "dto\ReservationDto.java",
    "dto\CommunityDto.java",
    "dto\FinanceDto.java",
    "dto\TaskAdminDto.java",
    "dto\ProfileDto.java",
    "dto\UserBatchDto.java",
    "dto\ReservationAdminDto.java",
    "dto\CommunicationDto.java",
    "dto\AuthDto.java",
    "dto\UserAdminDto.java",
    "service\PaymentService.java",
    "service\MaintenanceService.java",
    "service\ReservationService.java",
    "service\CommunityService.java",
    "service\FinanceService.java",
    "service\BillAdminService.java",
    "service\UserAdminService.java",
    "service\UserBatchService.java",
    "service\TaskAdminService.java",
    "service\ReservationAdminService.java",
    "service\UserService.java",
    "controller\PaymentController.java",
    "controller\MaintenanceController.java",
    "controller\ReservationController.java",
    "controller\FinanceController.java",
    "controller\BillAdminController.java",
    "controller\UserAdminController.java",
    "controller\TaskAdminController.java",
    "controller\UserController.java",
    "security\CurrentUserId.java",
    "security\CurrentUserIdResolver.java"
)

foreach ($f in $allFiles) {
    $src = Join-Path $srcBase $f
    $dst = Join-Path $dstBase $f
    $dstDir = Split-Path $dst -Parent
    
    if (!(Test-Path $src)) {
        Write-Host "MISSING: $src"
        continue
    }
    if (!(Test-Path $dstDir)) {
        New-Item -ItemType Directory -Path $dstDir -Force | Out-Null
    }
    
    # Check if destination already exists 
    if (Test-Path $dst) {
        Write-Host "SKIP-EXISTS: $f"
        continue
    }
    
    # Read, replace package/imports, write
    $content = Get-Content $src -Raw -Encoding UTF8
    $content = $content -replace 'com\.example\.bolivia', 'com.bolivia.app'
    # Fix model.User -> entity.User references
    $content = $content -replace 'com\.bolivia\.app\.model\.User', 'com.bolivia.app.entity.User'
    $content = $content -replace 'com\.bolivia\.app\.model', 'com.bolivia.app.entity'
    
    [System.IO.File]::WriteAllText($dst, $content, [System.Text.Encoding]::UTF8)
    Write-Host "OK: $f"
}

Write-Host "--- Migration script complete ---"
