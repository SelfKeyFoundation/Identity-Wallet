param([string]$output)
$source = "C:\projects\identity-wallet\out"
Add-Type -assembly "system.io.compression.filesystem"
[io.compression.zipfile]::CreateFromDirectory($source, $output)