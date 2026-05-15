#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

BLOCKED_REGEX='AGENT_CONTEXT|Codex|OpenAI|ChatGPT|AI[ -]generated|(^|[^[:alnum:]_])GPT([^[:alnum:]_]|$)'

matches=0
found_files=0
while IFS= read -r file; do
  found_files=1
  if rg -n -i --pcre2 "$BLOCKED_REGEX" "$file" >/tmp/openwave-public-scan.out 2>/dev/null; then
    if [[ "$file" == docs/assets/* ]] && rg -q 'sourceMappingURL|__VP_HASH_MAP__|__VP_SITE_DATA__' /tmp/openwave-public-scan.out; then
      continue
    fi
    echo "Blocked public-surface marker found in $file"
    cat /tmp/openwave-public-scan.out
    matches=1
  fi
done <<EOF
$(git ls-files \
  '*.md' '*.mdx' '*.html' '*.htm' '*.yaml' '*.yml' '*.json' '*.js' '*.ts' '*.css' '*.txt' \
  ':!:package-lock.json' \
  ':!:docs/public/*.png' \
  ':!:docs/public/*.jpg' \
  ':!:docs/public/*.jpeg' \
  ':!:docs/public/*.webp')
EOF

rm -f /tmp/openwave-public-scan.out

if ((found_files == 0)); then
  echo "No tracked public text files found."
  exit 0
fi

if ((matches)); then
  exit 1
fi

echo "Public surface check passed."
