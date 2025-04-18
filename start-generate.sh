#!/bin/bash

# 設定變數，抓取指令參數
API_BASE_URL=$1
ENV_NAME=$2
APP_BASE_URL=$3

# 時間搓記（格式：20250327_153842）
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ZIP_NAME="${ENV_NAME}-${TIMESTAMP}.zip"
ZIP_DIR="dist-zip"

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
  echo "👉 使用方式： ./generate.sh <API_BASE_URL> <APP_BASE_URL>"
  echo "   例如： ./generate.sh https://staging-api.com staging /nuxt"
  exit 1
fi

# 確保 ENV_NAME 參數存在，否則終止執行
if [ -z "$2" ]; then
  echo "❌ 錯誤：請提供 ENV_NAME！"
  echo "👉 使用方式： ./generate.sh <API_BASE_URL> <ENV_NAME> <APP_BASE_URL>"
  echo "   例如： ./generate.sh https://staging-api.com staging /nuxt"
  exit 1
fi

# 確保 APP_BASE_URL 參數存在，否則終止執行
if [ -z "$3" ]; then
  echo "❌ 錯誤：請提供 APP_BASE_URL！"
  echo "👉 使用方式： ./generate.sh <API_BASE_URL> <ENV_NAME> <APP_BASE_URL>"
  echo "   例如： ./generate.sh https://staging-api.com staging /nuxt"
  exit 1
fi

# 生成 .env 檔案
echo "NUXT_APP_BASE_URL="$APP_BASE_URL"" > .env 
echo "NUXT_PUBLIC_ENV_NAME=$ENV_NAME" >> .env
echo "NUXT_PUBLIC_API_BASE_URL=$API_BASE_URL" >> .env

echo "✅ .env 已建立，內容如下："
cat .env

# 執行 Nuxt 生成靜態檔案
echo "🚀 開始執行 nuxi generate..."
pnpm generate

# 壓縮成 zip
echo "📦 開始壓縮為 $ZIP_DIR/$ZIP_NAME ..."
mkdir -p "$ZIP_DIR"
(cd .output/public && zip -rq "../../$ZIP_DIR/$ZIP_NAME" .)

echo "✅ 壓縮完成：$ZIP_DIR/$ZIP_NAME"

# 清理 .env 檔案，避免影響其他環境
rm .env

echo "🧹 .env 已刪除，確保環境乾淨"
echo "✅ 預渲染完成！"

exit 0