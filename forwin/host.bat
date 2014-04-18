@echo off
set nhost=127.0.0.1 s1.mi-img.com land.xiaomi.net i.xiaomi.com
FOR /F "eol=# tokens=1 delims=" %%i in (%systemroot%\system32\drivers\etc\hosts) do if "%stHosts%"=="%%i" exit 
echo %nhost% >> %systemroot%\system32\drivers\etc\hosts
echo.
echo set host ad %nhost%