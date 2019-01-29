
@echo off
set DIR=%~dp0
echo %DIR%
%DIR%..\..\..\tools\php\php.exe "%DIR%zzz_build.php"
rem %QUICK_V3_ROOT%\quick\bin\win32\php.exe "%DIR%zzz_build.php"
pause
