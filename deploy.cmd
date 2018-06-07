@echo off
if "%APPVEYOR_REPO_BRANCH%"=="dev" (
  powershell -command "Start-FileDownload 'http://slproweb.com/download/Win64OpenSSL-1_1_0h.exe'"
  powershell -command "Start-Process 'Win64OpenSSL-1_1_0h.exe' -ArgumentList '/silent /verysilent /sp- /suppressmsgboxes' -Wait"
  choco install gcloudsdk
  refreshenv
  gcloud.cmd components copy-bundled-python>>python_path.txt && SET /p CLOUDSDK_PYTHON=<python_path.txt && DEL python_path.txt
  gcloud.cmd components update --quiet
  gcloud.cmd components install beta --quiet
  C:\OpenSSL-Win64\bin\openssl aes-256-cbc -K "%encryptedkey%" -iv "%encryptediv%" -in client-secret.json.enc -out client-secret.json -d
  gcloud auth activate-service-account --key-file client-secret.json
  gsutil cp dist/*.zip gs://selfkey-builds/$APPVEYOR_REPO_COMMIT/
)