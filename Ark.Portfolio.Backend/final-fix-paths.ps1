# Final fix: Point to the actual index.ts file in Ark.Portfolio.Share

Get-ChildItem -Path "src" -Recurse -Include *.ts | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    
    # Calculate correct relative path based on file depth
    $relativePath = $_.FullName -replace [regex]::Escape("c:/Users/Criprtoswiss/source/repos/Ark.Portfolio/Ark.Portfolio.Backend/"), ""
    $depth = ($relativePath -split "/").Count - 1
    
    # Build correct path to Share index.ts
    $shareIndexPath = switch ($depth) {
        2 { "../../Ark.Portfolio.Share/index" }  # src/services/
        3 { "../../../Ark.Portfolio.Share/index" }  # src/database/repositories/
        default { "../../Ark.Portfolio.Share/index" }
    }
    
    # Replace the import
    $newContent = $content -replace "from '\.\./\.\./Ark\.Portfolio\.Share'", "from '$shareIndexPath'"
    $newContent = $newContent -replace "from '\.\./\.\./\.\./Ark\.Portfolio\.Share'", "from '$shareIndexPath'"
    
    if ($newContent -ne $content) {
        Set-Content -Path $_.FullName -Value $newContent -NoNewline
        Write-Host "Fixed: $relativePath -> $shareIndexPath"
    }
}

Write-Host "All paths now point to Ark.Portfolio.Share/index"
