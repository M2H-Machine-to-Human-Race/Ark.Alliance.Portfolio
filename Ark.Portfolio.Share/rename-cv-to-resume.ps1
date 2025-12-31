# PowerShell script to rename CV to Resume in resume.dto.ts

$filePath = "c:/Users/Criprtoswiss/source/repos/Ark.Portfolio/Ark.Portfolio.Share/dtos/resume.dto.ts"
$content = Get-Content $filePath -Raw

# Replace all variations of Cv with Resume
$content = $content -replace "AdminCv", "AdminResume"
$content = $content -replace "CvDto", "ResumeDto"
$content = $content -replace "CV/Resume", "Resume/CV"
$content = $content -replace " CV ", " Resume "
$content = $content -replace "CV DTOs", "Resume DTOs"

Set-Content -Path $filePath -Value $content -NoNewline

Write-Host "Renamed CV references to Resume in resume.dto.ts"
