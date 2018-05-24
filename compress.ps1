$source = "C:\projects\identity-wallet\out"
$output = "C:\projects\identity-wallet\sk-windows.zip"
Add-Type -assembly "system.io.compression.filesystem"
[io.compression.zipfile]::CreateFromDirectory($source, $output)