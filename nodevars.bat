@echo off

rem Ensure this Node.js and npm are first in the PATH
setx PATH "%CD%\npm;%~dp0;%PATH%"
setx PATH "%CD%;%~dp0;%PATH%"

setlocal enabledelayedexpansion
pushd "%~dp0"

rem Figure out the node version.
set print_version=.\node.exe -p -e "process.versions.node + ' (' + process.arch + ')'"
for /F "usebackq delims=" %%v in (`%print_version%`) do set version=%%v

rem Print message.
if exist npm.cmd (
  echo.
  echo Your environment has been set up for using Node.js !version! and npm.
) else (
  echo.
  echo Your environment has been set up for using Node.js !version!.
)

popd
endlocal