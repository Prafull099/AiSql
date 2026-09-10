@echo off
setlocal
set "BASEDIR=%~dp0"
set "WRAPPER_JAR=%BASEDIR%.mvn\wrapper\maven-wrapper.jar"
java -Dmaven.multiModuleProjectDirectory="%BASEDIR%." -classpath "%WRAPPER_JAR%" org.apache.maven.wrapper.MavenWrapperMain %*
endlocal
