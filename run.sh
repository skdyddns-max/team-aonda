#!/bin/bash
# 팀아온다 로컬 미리보기
cd "$(dirname "$0")"
echo "→ http://localhost:8020  (Ctrl+C 종료)"
python3 -m http.server 8020
