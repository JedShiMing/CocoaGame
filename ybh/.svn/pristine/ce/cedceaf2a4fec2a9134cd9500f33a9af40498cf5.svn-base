set PATH=%PATH%;C:\Program Files (x86)\Tencent\微信web开发者工具;d:\CocosCreator
set srcPath=%cd%
echo module.exports = "releaseWX" > .\src\Project\assets\framework\config\serverKey.js
CocosCreator.exe --path .\src\Project --build "platform=wechatgame"
CocosCreator.exe --path .\src\wx-open-data  --build "platform=wechatgame"
xcopy .\src\wx-open-data\build\wx-open-data\*.*  .\src\Project\build\wechatgame\wx-open-data\ /s /e /y

echo module.exports = "" > .\src\Project\assets\framework\config\serverKey.js

@echo off 

if "%1"=="-p" (
cli -l %cd%\src\Project\build\wechatgame
cd /d %srcPath%
cli -p %cd%\src\Project\build\wechatgame 
cd /d %srcPath%
) else (
cli -o %cd%\src\Project\build\wechatgame
cd /d %srcPath%

)
