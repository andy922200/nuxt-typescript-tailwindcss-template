#!/bin/bash

# 設定變數，抓取指令參數
API_BASE_URL=$1
ENV_NAME=$2
APP_BASE_URL=$3

# 檢查是否已安裝 pnpm
if ! command -v pnpm &> /dev/null; then
  echo "❌ 錯誤：pnpm 未安裝！"
  echo "👉 請執行以下指令安裝 pnpm："
  echo "   npm install -g pnpm"
  exit 1
fi

# 確保 API_BASE_URL 參數存在，否則終止執行
if [ -z "$1" ]; then
  echo "❌ 錯誤：請提供 API_BASE_URL！"
  echo "👉 使用方式：./server.sh <API_BASE_URL> <ENV_NAME> <APP_BASE_URL>"
  echo "   例如： ./server.sh https://staging-api.com staging /nuxt"
  exit 1
fi

# 確保 ENV_NAME 參數存在，否則終止執行
if [ -z "$2" ]; then
  echo "❌ 錯誤：請提供 ENV_NAME！"
  echo "👉 使用方式： ./server.sh <API_BASE_URL> <ENV_NAME> <APP_BASE_URL>"
  echo "   例如： ./server.sh https://staging-api.com staging /nuxt"
  exit 1
fi

# 確保 APP_BASE_URL 參數存在，否則終止執行
if [ -z "$3" ]; then
  echo "❌ 錯誤：請提供 APP_BASE_URL！"
  echo "👉 使用方式： ./server.sh <API_BASE_URL> <ENV_NAME> <APP_BASE_URL>"
  echo "   例如： ./server.sh https://staging-api.com staging /nuxt"
  exit 1
fi

# 進入 .output 目錄
cd "$(dirname "$0")/.output"

# 確保 .env 存在並覆寫內容
cat <<EOF > .env
  NUXT_APP_BASE_URL=$APP_BASE_URL
  NUXT_API_BASE_URL=$API_BASE_URL
  NUXT_PUBLIC_ENV_NAME=$ENV_NAME
  NUXT_PUBLIC_API_BASE_URL=$API_BASE_URL
EOF

# 載入 .env 變數到環境
export $(cat .env | xargs)

# 啟動伺服器
node ./server/index.mjs