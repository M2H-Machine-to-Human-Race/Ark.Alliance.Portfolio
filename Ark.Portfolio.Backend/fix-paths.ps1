# Fix relative paths - services are 2 levels deep from src, need 3 ../ to reach parent
# Structure: Ark.Portfolio.Backend/src/services/*.ts -> ../../../Ark.Portfolio.Share

$filesToFix = @{
    # Controllers: src/controllers/ -> need ../../
    "src/controllers/admin.controller.ts"          = "../../Ark.Portfolio.Share"
    
    # Repositories: src/database/repositories/ -> need ../../../
    "src/database/repositories/menu.repository.ts" = "../../../Ark.Portfolio.Share"
    
    # Services: src/services/ -> need ../../
    "src/services/admin-carousel.service.ts"       = "../../Ark.Portfolio.Share"
    "src/services/admin-cv.service.ts"             = "../../Ark.Portfolio.Share"
    "src/services/admin-media.service.ts"          = "../../Ark.Portfolio.Share"
    "src/services/admin-menu.service.ts"           = "../../Ark.Portfolio.Share"
    "src/services/admin-project.service.ts"        = "../../Ark.Portfolio.Share"
    "src/services/admin-style.service.ts"          = "../../Ark.Portfolio.Share"
    "src/services/admin-widget.service.ts"         = "../../Ark.Portfolio.Share"
    "src/services/ai.service.ts"                   = "../../Ark.Portfolio.Share"
    "src/services/dashboard.service.ts"            = "../../Ark.Portfolio.Share"
    "src/services/profile.service.ts"              = "../../Ark.Portfolio.Share"
}

foreach ($file in $filesToFix.Keys) {
    $fullPath = "c:/Users/Criprtoswiss/source/repos/Ark.Portfolio/Ark.Portfolio.Backend/$file"    
    $correctPath = $filesToFix[$file]
    
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw
        
        # Fix any incorrect paths
        $content = $content -replace "from '\.\./\.\./Ark\.Portfolio\.Share'", "from '$correctPath'"
        $content = $content -replace "from '\.\./\.\./\.\./Ark\.Portfolio\.Share'", "from '$correctPath'"
        
        Set-Content -Path $fullPath -Value $content -NoNewline
        Write-Host "Fixed: $file -> $correctPath"
    }
    else {
        Write-Host "Not found: $file"
    }
}

Write-Host "Done! All relative paths corrected."
