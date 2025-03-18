#!/bin/bash

# 進入 .output 目錄
cd "$(dirname "$0")/.output"

# 確保 .env 存在並覆寫內容
echo "NUXT_APP_BASE_URL="/"" > .env 
echo "NUXT_PUBLIC_ENV_NAME=production" >> .env
echo "NUXT_PUBLIC_API_BASE_URL=https://jsonplaceholder.typicode.com/posts" >> .env

# 載入 .env 變數到環境
export $(cat .env | xargs)

# 啟動 Nuxt 預覽模式
node ./server/index.mjs