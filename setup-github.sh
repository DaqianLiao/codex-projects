#!/bin/bash
set -e

echo "=== 1/3: GitHub 登录 ==="
if ! gh auth status 2>/dev/null; then
  gh auth login
fi

echo ""
echo "=== 2/3: 推送代码 ==="
cd "$(dirname "$0")"
gh auth setup-git
git push -u origin master

echo ""
echo "=== 3/3: 配置自动推送 (每 10 分钟) ==="
SCRIPT_PATH="$(pwd)/auto-sync.sh"
cat > "$SCRIPT_PATH" << 'CRON'
#!/bin/bash
cd "$(dirname "$0")"
git add -A
git commit -m "auto: sync $(date '+%Y-%m-%d %H:%M:%S')" 2>/dev/null || true
git push 2>/dev/null || true
CRON
chmod +x "$SCRIPT_PATH"

# Add crontab entry if not already there
(crontab -l 2>/dev/null | grep -v "auto-sync.sh"; echo "*/10 * * * * $SCRIPT_PATH") | crontab -

echo ""
echo "======= 全部完成！======"
echo "代码已推送到 GitHub: https://github.com/DaqianLiao/codex-projects"
echo "自动推送脚本: $SCRIPT_PATH（每 10 分钟运行一次）"
