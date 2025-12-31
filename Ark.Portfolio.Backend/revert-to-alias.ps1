# Revert to using tsconfig path alias since relative paths don't work in Node.js
# The path mapping in tsconfig.json already points @ark/portfolio-share to ../Ark.Portfolio.Share/index.ts

Get-ChildItem -Path "src" -Recurse -Include *.ts | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    
    # Replace all relative Share imports back to the alias
    $newContent = $content -replace "from '\.\./\.\./Ark\.Portfolio\.Share/index'", "from '@ark/portfolio-share'"
    $newContent = $newContent -replace "from '\.\./\.\./\.\./Ark\.Portfolio\.Share/index'", "from '@ark/portfolio-share'"
    $newContent = $newContent -replace "from '\.\./\.\./\.\./\.\./Ark\.Portfolio\.Share/enums/admin\.enums'", "from '@ark/portfolio-share'"
    
    if ($newContent -ne $content) {
        Set-Content -Path $_.FullName -Value $newContent -NoNewline
        $relativePath = $_.FullName -replace [regex]::Escape("C:\Users\Criprtoswiss\source\repos\Ark.Portfolio\Ark.Portfolio.Backend\"), ""
        Write-Host "Reverted: $relativePath"
    }
}

Write-Host "All imports now use @ark/portfolio-share alias (tsconfig path mapping)"
