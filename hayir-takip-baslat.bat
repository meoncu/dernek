@echo off
title Hayir Takip - Gelistirme Sunucusu
color 0A

echo.
echo  ==========================================
echo   HAYIR TAKIP - Bagis ve Proje Yonetimi
echo  ==========================================
echo.
echo  Sunucu baslatiliyor...
echo  Adres: http://localhost:3748
echo.

cd /d "%~dp0"
start "" "http://localhost:3748"
npm run dev

pause
