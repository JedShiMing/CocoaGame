set PATH=%PATH%;C:\Program Files (x86)\Tencent\微信web开发者工具;d:\CocosCreator
set srcPath=%cd%
echo module.exports = "releaseQQ" > .\src\Project\assets\framework\config\serverKey.js
CocosCreator.exe --path .\src\Project --build "platform=qqplay"

xcopy .\src\Project\build\platform_qq\*.*  .\src\Project\build\qqplay\ /s /e /y

echo module.exports = "" > .\src\Project\assets\framework\config\serverKey.js

.\tools\7zip\7z.exe a -tzip -r cmshow_game_5593.zip .\src\Project\build\qqplay\*

@echo off