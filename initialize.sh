#!/bin/bash

git update-index --assume-unchanged initialize.sh

# 환경 변수 설정
API_KEY="{FILL}"
INTERNAL_IP="{FILL}"
REACT_APP_APIKEY="{FILL}"
REACT_APP_AUTHDOMAIN="{FILL}"
REACT_APP_PROJECTID="{FILL}"
REACT_APP_STORAGEBUCKET="{FILL}"
REACT_APP_MESSAGINGSENDERID="{FILL}"
REACT_APP_APPID="{FILL}"
REACT_APP_MEASUREMENTID="{FILL}"

# 프론트엔드 설정 및 빌드
cd frontend
npm install
cd ..

# 백엔드 설정 및 가상 환경 구성
cd backend
python3 -m venv myenv
source myenv/bin/activate
pip3 install -r requirements.txt
cd ..

# 환경변수를 백엔드 .env 파일에 저장
echo "API_KEY=${API_KEY}
INTERNAL_IP=${INTERNAL_IP}" > ./backend/.env

# 프론트엔드 환경 변수 설정
echo "REACT_APP_APIKEY=${REACT_APP_APIKEY}
REACT_APP_AUTHDOMAIN=${REACT_APP_AUTHDOMAIN}
REACT_APP_PROJECTID=${REACT_APP_PROJECTID}
REACT_APP_STORAGEBUCKET=${REACT_APP_STORAGEBUCKET}
REACT_APP_MESSAGINGSENDERID=${REACT_APP_MESSAGINGSENDERID}
REACT_APP_APPID=${REACT_APP_APPID}
REACT_APP_MEASUREMENTID=${REACT_APP_MEASUREMENTID}" > ./frontend/.env

echo "Shell 스크립트가 성공적으로 실행되었습니다."
