#!/bin/bash
set -e  # 遇到錯誤時自動中斷執行

# 設定遠端伺服器資訊
REMOTE_USER="user"                # 遠端伺服器使用者名稱
REMOTE_HOST="remote-server.com"   # 遠端伺服器 IP 或網域
REMOTE_PATH="/path/to/deploy"     # 遠端部署目錄

# 打包檔名
PACKAGE_NAME="deploy-package"

# 本地執行 `npm run build`
echo "📦 執行 Nuxt build..."
npm run build

# 打包 `.output` 和 `start-server.sh`
echo "🎁 打包 .output 和 start-server.sh..."
tar -czvf $PACKAGE_NAME.tar.gz .output start-server.sh

if [ "$TEST_MODE" = "true" ]; then
  echo "🚀 [測試模式] 跳過 SCP 和 SSH，模擬部署成功 ✅"
  rm $PACKAGE_NAME.tar.gz
  exit 0
fi

# 確保遠端伺服器可連線
ssh -q -o BatchMode=yes -o ConnectTimeout=3 $REMOTE_USER@$REMOTE_HOST || {
  echo "❌ 遠端伺服器 ($REMOTE_HOST) 無法連線，跳過部署"
  exit 1
}

# 上傳 `deploy-package.tar.gz` 到遠端伺服器
echo "🚀 上傳 $PACKAGE_NAME.tar.gz 到遠端伺服器..."
timeout 5s scp $PACKAGE_NAME.tar.gz $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH || { echo "❌ SCP 上傳失敗"; exit 1; }

# 遠端解壓縮並執行 `start-server.sh`
echo "📂 遠端解壓縮並啟動 Nuxt 伺服器..."
timeout 5s ssh $REMOTE_USER@$REMOTE_HOST << EOF
set -e
cd $REMOTE_PATH
tar -xzvf $PACKAGE_NAME.tar.gz
chmod +x start-server.sh
./start-server.sh
EOF 
|| { echo "❌ 遠端伺服器執行失敗，請檢查日誌"; exit 1; }

# 清理本地打包檔案
echo "🧹 清理本地暫存檔案..."
rm $PACKAGE_NAME.tar.gz || echo "⚠️ 無法刪除暫存檔案，但部署已完成"

echo "✅ 部署完成！"