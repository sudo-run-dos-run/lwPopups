@echo off
set /p directory=Please enter the absolute location of the test directory (relative is "./lwPopups/test"): 
cd %directory%
@echo Working in directory: %CD%
mklink /d dist\ ..\dist\
mklink /d libs\ ..\libs\
mklink /d resources\ ..\resources\
set /p in=Please check if symlinks were created. Run as admin, if necessary.