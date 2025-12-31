# PowerShell script to convert package imports to relative imports
# Converts '@ark/portfolio-share' to relative path based on file location

$files = @(
    "src/controllers/admin.controller.ts",
    "src/database/entities/style-config.entity.ts",
    "src/database/repositories/menu.repository.ts",
    "src/services/admin-carousel.service.ts",
    "src/services/admin-cv.service.ts",
    "src/services/admin-media.service.ts",
    "src/services/admin-menu.service.ts",
    "src/services/admin-project.service.ts",
    "src/services/admin-style.service.ts",
    "src/services/admin-widget.service.ts",
    "src/services/ai.service.ts",
    "src/services/dashboard.service.ts",
    "src/services/profile.service.ts"
)

foreach ($file in $files) {
    $fullPath = "c:/Users/Criprtoswiss/source/repos/Ark.Portfolio/Ark.Portfolio.Backend/$file"
    
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw
        
        # Calculate relative path from file to Share layer
        # All these files are 3 levels deep from Backend root
        $relativePath = if ($file -match "src/controllers/") {
            "../../Ark.Portfolio.Share"
        } elseif ($file -match "src/database/") {
            "../../../Ark.Portfolio.Share"
        } elseif ($file -match "src/services/") {
            "../../Ark.Portfolio.Share"
        } else {
            "../../Ark.Portfolio.Share"
        }
        
        # Replace package import with relative import
        $content = $content -replace "from '@ark/portfolio-share'", "from '$relativePath'"
        
        Set-Content -Path $fullPath -Value $content -NoNewline
        Write-Host "Updated: $file"
    }
}

Write-Host "Done! Converted all files to use relative imports."
