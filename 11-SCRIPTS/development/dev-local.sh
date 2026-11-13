#!/usr/bin/env bash
# Lance l'application branchée sur Supabase LOCAL, sans écrire de fichier de configuration.
# Prérequis : Docker Desktop démarré. Usage (racine du dépôt) : bash 11-SCRIPTS/development/dev-local.sh
set -euo pipefail
cd "$(dirname "$0")/../.."
npx supabase status >/dev/null 2>&1 || npx supabase start -x studio,mailpit,imgproxy,vector,logflare,supavisor,storage-api,realtime,edge-runtime,postgres-meta
eval "$(npx supabase status -o env | grep -E '^(API_URL|PUBLISHABLE_KEY)=')"
cd 01-FRONTEND
VITE_SUPABASE_URL="$API_URL" VITE_SUPABASE_PUBLISHABLE_KEY="$PUBLISHABLE_KEY" npm run dev
