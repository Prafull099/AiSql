@echo off
setlocal
for %%i in ("%~dp0") do set "BASEDIR=%%~si"
set "WRAPPER_JAR=%BASEDIR%.mvn\wrapper\maven-wrapper.jar"
java "-Dmaven.multiModuleProjectDirectory=%BASEDIR%" -classpath "%WRAPPER_JAR%" org.apache.maven.wrapper.MavenWrapperMain %*
endlocal
