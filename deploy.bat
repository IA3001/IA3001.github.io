@echo off
echo === Hexo Deploy ===
call npx hexo clean
call npx hexo deploy
echo === Done ===
pause
