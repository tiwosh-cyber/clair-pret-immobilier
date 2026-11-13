#!/usr/bin/env node
// Garde-fou PreToolUse pour Claude Code.
// Reçoit l'appel d'outil en JSON sur stdin, avant son exécution.
//   - exit 2 + message sur stderr  => appel BLOQUÉ (Claude reçoit le message)
//   - JSON "ask" sur stdout        => Claude Code te demande confirmation
//   - exit 0 sans sortie           => le circuit normal des permissions s'applique
// Ce script complète .claude/settings.json et le sandbox : il attrape les variantes
// d'écriture qu'une règle par préfixe laisse passer. Ce n'est pas une garantie absolue.

const path = require("path");

// Fail-closed : toute erreur inattendue du garde-fou bloque l'appel au lieu de le laisser passer.
process.on("uncaughtException", (e) => block("Garde-fou : erreur interne (" + (e && e.message) + "), appel bloqué par prudence."));

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let input;
  try {
    input = JSON.parse(raw || "{}");
  } catch {
    return block("Garde-fou : entrée illisible, appel bloqué par prudence.");
  }
  const tool = input.tool_name || "";
  const ti = input.tool_input || {};

  if (["Read", "Edit", "Write", "MultiEdit", "NotebookEdit"].includes(tool)) {
    const p = ti.file_path || ti.notebook_path || "";
    if (tool !== "Read" && isProtectedConfig(p)) {
      return block(`Modification refusée : ${p} fait partie de la configuration de sécurité (permissions, hook, agent de revue). Seul l'utilisateur la modifie, à la main.`);
    }
    if (isSecretFile(p)) {
      return block(`Accès refusé à ${path.basename(p)} : les fichiers de secrets ne sont jamais lus ni modifiés par Claude. Utilise .env.example (noms de variables uniquement).`);
    }
    return process.exit(0);
  }

  if (tool === "Bash" || tool === "PowerShell") {
    return checkCommand(String(ti.command || ""));
  }
  process.exit(0);
});

function isProtectedConfig(p) {
  const n = String(p).replace(/\\/g, "/").toLowerCase();
  return (
    /(^|\/)\.claude\/settings(\.local)?\.json$/.test(n) ||
    /(^|\/)\.claude\/hooks(\/|$)/.test(n) ||
    /(^|\/)\.claude\/agents\/security-reviewer\.md$/.test(n) ||
    /(^|\/)11-scripts\/checks\/test-garde-fou\.cjs$/.test(n)
  );
}

function isSecretFile(p) {
  const b = path.basename(String(p)).toLowerCase();
  if (b === ".env.example") return false;
  return (
    /^\.env(\..+)?$/.test(b) ||
    /\.(pem|key|p12|pfx)$/.test(b) ||
    /^service-account.*\.json$/.test(b) ||
    /^id_(rsa|ed25519|ecdsa)$/.test(b)
  );
}

function checkCommand(cmd) {
  // Normalisation : minuscules, espaces multiples, guillemets vides ("" ou '') supprimés.
  const low = cmd.toLowerCase().replace(/(""|'')/g, "");
  const c = low.replace(/\s+/g, " ").trim();
  // Découpage en sous-commandes : ; && || | & retours à la ligne, $( ), backticks.
  const parts = low.split(/;|&&|\|\||\||&|\n|\$\(|`/).map((s) => s.replace(/\s+/g, " ").trim()).filter(Boolean);

  // 0. Configuration de sécurité : aucune écriture via le shell, quelle que soit la commande.
  const touchesConfig =
    /garde-fou/.test(c) ||
    /security-reviewer/.test(c) ||
    (/\.claude\b/.test(c) && /(settings|hooks|agents|\*|\?)/.test(c)) ||
    /settings\.local\.json/.test(c);
  const writeIntent =
    />/.test(c) ||
    /\b(tee|sed|awk|perl|ruby|php|python3?|node|deno|bun|mv|cp|rm|ln|chmod|chown|truncate|dd|install|touch|unlink|patch|rsync|tar|unzip)\b/.test(c) ||
    /\bgit\b.*\b(checkout|restore|apply|stash|reset|mv|rm|am)\b/.test(c);
  // Seule exception : lancer la suite de tests du garde-fou, telle quelle (le script est lui-même protégé).
  const isHookTestRun = /^node (\.\/)?11-scripts\/checks\/test-garde-fou\.cjs$/.test(c);
  if (touchesConfig && writeIntent && !isHookTestRun) {
    return block("Commande bloquée : elle pourrait modifier la configuration de sécurité (.claude/settings*, .claude/hooks/, agent de revue, test du garde-fou). Seul l'utilisateur la modifie. Pour la lire, utilise l'outil Read.");
  }

  // 1. Secrets : toute mention d'un fichier .env (sauf .env.example) ou d'une clé privée.
  const envRef = /(^|[\s'"=\/(<>:])\.env(\.(?!example\b)[a-z0-9_-]+)?(?=$|[\s'")\/;|&<>])/;
  if (envRef.test(c) || /\b(id_rsa|id_ed25519)\b|\.pem\b/.test(c)) {
    return block("Commande bloquée : elle touche un fichier de secrets (.env, clé privée). Claude ne lit ni n'affiche jamais de secrets.");
  }

  for (const part of parts) {
    const bin = path.basename(firstProgram(part));

    // 2. Git : push et réécritures destructives.
    if (bin === "git") {
      const sub = gitSubcommand(part);
      if (sub === "push") return block("git push est interdit : l'envoi vers un dépôt distant se fait par toi, après validation.");
      if (sub === "reset" && /--hard\b/.test(part)) return block("git reset --hard est interdit : il efface du travail sans retour possible.");
      if (sub === "clean" && /\s-[a-z]*f/.test(part)) return block("git clean -f est interdit : il supprime des fichiers non suivis.");
      if (sub === "filter-branch" || sub === "filter-repo") return block("La réécriture d'historique Git est interdite.");
      if (sub === "branch" && /\s-d\b|\s-D\b|--delete/.test(cmd) && /\bmain\b|\bmaster\b/.test(part)) return block("Supprimer la branche main est interdit.");
      if ((sub === "checkout" || sub === "restore") && /(\s--\s+\.|\s\.$|--source)/.test(part)) {
        return ask("Cette commande Git peut annuler des modifications non commitées. Confirmes-tu ?");
      }
    }

    // 3. Suppression récursive forcée, quel que soit l'ordre des options.
    if (bin === "rm" || bin === "rmdir") {
      const flags = part.split(" ").filter((t) => t.startsWith("-")).join("");
      const recursive = /r|--recursive/i.test(flags);
      const force = /f|--force/.test(flags);
      if (recursive && force) return block("rm récursif forcé (rm -rf et variantes) est interdit. Supprime les fichiers un par un, avec ta confirmation.");
      if (recursive) return ask("Suppression récursive demandée. Confirmes-tu la liste exacte des fichiers ?");
    }
    if (bin === "find" && /\s-delete\b|-exec\s+rm\b/.test(part)) return block("find -delete / -exec rm est interdit.");

    // 4. Déploiement en production et publication : toujours faits par toi.
    const prodDeploy =
      /\bvercel\b.*(--prod\b|\bdeploy\b.*--prod)/.test(part) ||
      /\bnetlify\b.*\bdeploy\b.*--prod/.test(part) ||
      /\bsupabase\b.*\b(db\s+push|db\s+reset|functions\s+deploy|secrets\s+set)\b/.test(part) ||
      /\b(fly|flyctl)\b.*\bdeploy\b/.test(part) ||
      /\brailway\b.*\bup\b/.test(part) ||
      /\bfirebase\b.*\bdeploy\b/.test(part) ||
      /\b(npm|pnpm|yarn)\b.*\bpublish\b/.test(part) ||
      /\bdocker\b.*\bpush\b/.test(part) ||
      /\bterraform\b.*\b(apply|destroy)\b/.test(part);
    if (prodDeploy) {
      return block("Déploiement, migration distante ou publication bloqués pour Claude. Étape 6 : Claude prépare la commande exacte, c'est toi qui la lances après ton autorisation écrite.");
    }

    // 5. Exécution de code téléchargé.
    if (/\b(curl|wget)\b/.test(c) && /\|\s*(sudo\s+)?(ba|z)?sh\b/.test(cmd.toLowerCase())) {
      return block("Exécuter un script téléchargé (curl | sh) est interdit.");
    }
  }

  // 6. Formes obfusquées : on ne bloque pas, on te demande.
  if (/\beval\b|\b(ba|z)?sh\s+-c\b|base64\s+(-d|--decode)|\bpython3?\s+-c\b|\bnode\s+-e\b/.test(c)) {
    return ask("Commande indirecte (eval, sh -c, python -c, node -e, base64). Vérifie son contenu avant d'accepter.");
  }
  process.exit(0);
}

function firstProgram(part) {
  const wrappers = new Set(["sudo", "command", "env", "nohup", "time", "nice", "timeout", "stdbuf", "xargs", "exec"]);
  for (const t of part.split(" ")) {
    if (!t || wrappers.has(t) || /^-/.test(t) || /^\w+=/.test(t) || /^\d+[smh]?$/.test(t)) continue;
    return t.replace(/^["']|["']$/g, "");
  }
  return "";
}

function gitSubcommand(part) {
  const toks = part.split(" ");
  let i = toks.findIndex((t) => path.basename(t) === "git");
  for (i = i + 1; i < toks.length; i++) {
    const t = toks[i];
    if (t === "-c" || t === "-C" || t === "--git-dir" || t === "--work-tree") { i++; continue; }
    if (t.startsWith("-")) continue;
    return t;
  }
  return "";
}

function block(msg) {
  process.stderr.write(msg + "\n");
  process.exit(2);
}

function ask(reason) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "ask", permissionDecisionReason: reason },
  }));
  process.exit(0);
}
