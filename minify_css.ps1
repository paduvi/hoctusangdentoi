$inputPath = "docs/src/css/app.css"
$outputPath = "docs/src/css/app.min.css"

if (-not (Test-Path $inputPath)) {
    Write-Error "Input file not found: $inputPath"
    exit 1
}

$css = Get-Content -Path $inputPath -Raw

# Remove comments
$css = $css -replace '/\*[\s\S]*?\*/', ''

# Remove newlines and tabs
$css = $css -replace '[\r\n\t]+', ' '

# Remove multiple spaces
$css = $css -replace '\s+', ' '

# Remove space around symbols
$css = $css -replace '\s*([{:;,])\s*', '$1'

# Remove last semicolon in block
$css = $css -replace ';\}', '}'

Set-Content -Path $outputPath -Value $css -Encoding UTF8
Write-Host "Minified $inputPath to $outputPath"
