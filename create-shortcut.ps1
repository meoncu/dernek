$WshShell = New-Object -ComObject WScript.Shell
$ShortcutPath = "$env:USERPROFILE\Desktop\HayirTakip.lnk"
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = "C:\Windows\System32\cmd.exe"
# Run the batch file and keep the console open after execution
$Shortcut.Arguments = '/c "C:\Cursor\65_dernek\hayir-takip-baslat.bat"'
$Shortcut.WorkingDirectory = "C:\Cursor\65_dernek"
# Optional icon – use a placeholder if you have one
$Shortcut.IconLocation = "C:\Cursor\65_dernek\public\icons\icon-512.png"
$Shortcut.Save()
Write-Host "Shortcut created at $ShortcutPath"
