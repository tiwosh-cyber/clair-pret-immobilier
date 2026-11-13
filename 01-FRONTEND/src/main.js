import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import htm from "htm";
import {
  Landmark,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ShieldCheck,
  LogOut,
  ChevronDown,
  SlidersHorizontal,
  Info,
  CircleAlert,
  Check,
  Users,
  UserRound,
  CalendarDays,
  Wallet,
  LoaderCircle,
  RefreshCw,
  Pencil,
} from "lucide-react";
import { validateNumber, computeLoan, toNumber, euro } from "./features/simulator/loan.js";
import { supabase } from "./services/supabase.js";
import { authErrorMessage, loadRole, validateCredentials } from "./services/auth.js";
// Police servie localement : aucune requête vers Google Fonts (revue sécu lot 01, RGPD).
import "@fontsource-variable/inter";
import "./styles/app.css";
const html = htm.bind(React.createElement);
const icon = (Component, props = {}) =>
  html`<${Component} aria-hidden="true" ...${props} />`;
function Notice({ children, error = false }) {
  return html`<div
    className=${`notice ${error ? "error" : ""}`}
    role=${error ? "alert" : "status"}
  >
    ${icon(error ? CircleAlert : Check)}
    <div>${children}</div>
  </div>`;
}
function Role({ role }) {
  return html`<span className=${`role ${role === "Manager" ? "manager" : ""}`}
    >${icon(role === "Manager" ? ShieldCheck : UserRound)}${role}</span
  >`;
}
function Steps({ page, session }) {
  const n = page === "/simulateur" ? 2 : page === "/profils" ? 3 : 1;
  const labels =
    session?.role === "Exécutant"
      ? ["Votre espace", "Simulation"]
      : ["Votre espace", "Simulation", "Profils"];
  return html`<ol className="steps" aria-label="Parcours du prototype">
    ${labels.map((label, i) => html`<li key=${label} className=${n === i + 1 ? "active" : n > i + 1 ? "complete" : ""} aria-current=${n === i + 1 ? "step" : undefined}><span className="step-circle">${n > i + 1 ? icon(Check, { size: 12 }) : `0${i + 1}`}</span>${label}</li>`)}
  </ol>`;
}
function Header({ session, page, navigate, logout }) {
  return html`<header className="header">
    <div className="header-inner">
      <a
        className="brand"
        href=${session ? "#/simulateur" : "#/inscription"}
        onClick=${(e) => {
          e.preventDefault();
          navigate(session ? "/simulateur" : "/inscription");
        }}
        aria-label="Clair, accueil"
      >
        <span className="brand-mark">${icon(Landmark)}</span
        ><span className="brand-word"
          >clair<span style=${{ color: "var(--primary)" }}>.</span></span
        ><span className="brand-divider"></span
        ><span className="brand-sub"
          >Votre projet,<br />en toute clarté.</span
        ></a
      >
      <div className="header-right">
        ${
          session
            ? html`<nav
                  className="header-nav"
                  aria-label="Navigation principale"
                >
                  <a
                    className=${`nav-link ${page === "/simulateur" ? "active" : ""}`}
                    aria-current=${page === "/simulateur" ? "page" : undefined}
                    href="#/simulateur"
                    onClick=${(e) => {
                      e.preventDefault();
                      navigate("/simulateur");
                    }}
                    >Simulateur</a
                  >${
                    session.role === "Manager" &&
                    html`<a
                      className=${`nav-link ${page === "/profils" ? "active" : ""}`}
                      aria-current=${page === "/profils" ? "page" : undefined}
                      href="#/profils"
                      onClick=${(e) => {
                        e.preventDefault();
                        navigate("/profils");
                      }}
                      >Gestion des profils</a
                    >`
                  }
                </nav>
                <div className="account">
                  <span className="avatar" aria-hidden="true"
                    >${session.email.slice(0, 2).toUpperCase()}</span
                  >
                  <div className="account-text">
                    <strong>${session.role}</strong>${session.email}
                  </div>
                  <button
                    className="icon-button"
                    onClick=${logout}
                    aria-label="Déconnexion"
                    title="Déconnexion"
                  >
                    ${icon(LogOut)}
                  </button>
                </div>`
            : html`<span className="proto-badge">SIMULATION PÉDAGOGIQUE</span>`
        }
      </div>
    </div>
  </header>`;
}
function Auth({
  mode,
  setMode,
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  busy,
  errors,
  notice,
}) {
  const [visible, setVisible] = useState(false);
  return html`<section className="screen">
    <div className="intro">
      <p className="eyebrow">UN PEU DE CLARTÉ POUR VOS PROJETS</p>
      <h1>Le premier pas vers<br />votre prochain projet.</h1>
      <p>
        Un espace simple pour comprendre votre prêt<br
          className="desktop-break"
        />
        et envisager la suite, sereinement.
      </p>
    </div>
    <div className="auth-card">
      <div className="card-top">
        <h2>
          ${mode === "signup" ? "Créez votre espace" : "Ravi de vous retrouver"}
        </h2>
        ${icon(LockKeyhole)}
      </div>
      ${notice && html`<${Notice} error=${!!errors.form}>${notice}</${Notice}>`}
      <form novalidate onSubmit=${onSubmit} aria-busy=${busy}>
        <div className="field">
          <label htmlFor="email">Adresse e-mail</label>
          <div className="input-wrap">
            ${icon(Mail)}<input
              id="email"
              className="text-input with-icon"
              type="email"
              autocomplete="email"
              autocapitalize="none"
              spellcheck=${false}
              placeholder="prenom@exemple.fr"
              value=${email}
              onChange=${(e) => setEmail(e.target.value)}
              aria-invalid=${!!errors.email}
              aria-describedby=${errors.email ? "email-error" : undefined}
              required
            />
          </div>
          ${errors.email && html`<p id="email-error" className="field-error" role="alert">${icon(CircleAlert)}${errors.email}</p>`}
        </div>
        <div className="field">
          <label htmlFor="password">Mot de passe</label>
          <div className="input-wrap">
            ${icon(LockKeyhole)}<input
              id="password"
              className="text-input with-icon"
              type=${visible ? "text" : "password"}
              autocomplete=${mode === "signup" ? "new-password" : "current-password"}
              placeholder="8 caractères minimum"
              value=${password}
              onChange=${(e) => setPassword(e.target.value)}
              aria-invalid=${!!errors.password}
              aria-describedby=${errors.password ? "password-error" : "password-hint"}
              required
            /><button
              type="button"
              className="show-password"
              aria-label=${visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              aria-pressed=${visible}
              onClick=${() => setVisible(!visible)}
            >
              ${icon(visible ? EyeOff : Eye)}
            </button>
          </div>
          ${errors.password ? html`<p id="password-error" className="field-error" role="alert">${icon(CircleAlert)}${errors.password}</p>` : html`<p id="password-hint" className="hint">8 caractères minimum. N’utilisez pas un mot de passe servant ailleurs.</p>`}
        </div>
        <button className="btn primary full" type="submit" disabled=${busy}>
          ${busy ? html`${icon(LoaderCircle, { className: "spinner" })}<span>Un instant…</span>` : html`<span>${mode === "signup" ? "S’inscrire" : "Se connecter"}</span>${icon(ArrowRight)}`}
        </button>
        <p className="signup-note">
          Démonstration pédagogique : votre e-mail et votre rôle sont enregistrés
          dans Supabase.<br />Utilisez une adresse de test.
        </p>
      </form>
      <div className="card-divider"></div>
      <div className="switch-auth">
        ${mode === "signup" ? "Déjà inscrit ?" : "Pas encore de compte ?"}<button
          className="text-button"
          onClick=${() => setMode(mode === "signup" ? "signin" : "signup")}
        >
          ${mode === "signup" ? "Se connecter" : "S’inscrire"}
        </button>
      </div>
    </div>
    <div className="assurance">
      ${icon(ShieldCheck)}<span
        >Simulation calculée sur votre appareil · Aucune offre bancaire</span
      >
    </div>
  </section>`;
}
function NumberControl({
  id,
  label,
  value,
  last,
  min,
  max,
  step,
  unit,
  error,
  onChange,
  Icon,
}) {
  return html`<div className="control">
    <div className="control-top">
      <label htmlFor=${id}>${label}</label>${icon(Icon)}
    </div>
    <div className=${`number-wrap ${error ? "invalid" : ""}`}>
      <input
        id=${id}
        type="text"
        inputmode="numeric"
        maxlength=${12}
        value=${value}
        onChange=${(e) => onChange(e.target.value)}
        aria-invalid=${!!error}
        aria-describedby=${`${id}-bounds ${error ? `${id}-error` : ""}`}
        autocomplete="off"
      /><span>${unit}</span>
    </div>
    <label className="sr-only" htmlFor=${`${id}-slider`}
      >${label} — curseur</label
    ><input
      className="range"
      id=${`${id}-slider`}
      type="range"
      min=${min}
      max=${max}
      step=${step}
      value=${last}
      onChange=${(e) => onChange(e.target.value)}
      style=${{ "--progress": `${((last - min) / (max - min)) * 100}%` }}
      aria-valuetext=${`${last} ${unit === "€" ? "euros" : "mois"}`}
    />
    <div className="range-bounds" id=${`${id}-bounds`}>
      <span>${min.toLocaleString("fr-FR")} ${unit}</span
      ><span>${max.toLocaleString("fr-FR")} ${unit}</span>
    </div>
    ${error && html`<p className="field-error" id=${`${id}-error`} role="alert">${icon(CircleAlert)}${error}</p>`}
  </div>`;
}
function Simulator({
  amount,
  setAmount,
  months,
  setMonths,
  valid,
  setValid,
  notice,
}) {
  const amountError = validateNumber(amount, "amount");
  const monthsError = validateNumber(months, "months");
  function update(kind, raw) {
    const nextAmount = kind === "amount" ? raw : amount;
    const nextMonths = kind === "months" ? raw : months;
    if (kind === "amount") setAmount(raw);
    else setMonths(raw);
    if (
      !validateNumber(nextAmount, "amount") &&
      !validateNumber(nextMonths, "months")
    )
      setValid({
        amount: toNumber(nextAmount),
        months: toNumber(nextMonths),
      });
  }
  const { interest, total, monthly } = computeLoan(valid.amount, valid.months);
  return html`<section className="screen">
    <div className="page-intro">
      <div>
        <p className="eyebrow">VOTRE PROJET PREND FORME</p>
        <h1>Voyez plus clair dans votre prêt.</h1>
        <p>Ajustez le montant et la durée. Le reste se calcule, simplement.</p>
      </div>
      <span className="pill">${icon(ShieldCheck)}Taux annuel fixe · 7 %</span>
    </div>
    ${notice && html`<${Notice}>${notice}</${Notice}>`}
    <div className="sim-card">
      <div className="sim-head">
        <span className="section-label"
          >${icon(SlidersHorizontal)}Votre simulation</span
        ><span>Calcul en temps réel</span>
      </div>
      <div className="controls">
        <${NumberControl}
          id="amount"
          label="Montant de votre prêt"
          value=${amount}
          last=${!amountError ? toNumber(amount) : valid.amount}
          min=${5000}
          max=${15000}
          step=${500}
          unit="€"
          error=${amountError}
          onChange=${(v) => update("amount", v)}
          Icon=${Wallet}
        /><${NumberControl}
          id="months"
          label="Durée de remboursement"
          value=${months}
          last=${!monthsError ? toNumber(months) : valid.months}
          min=${12}
          max=${72}
          step=${1}
          unit="mois"
          error=${monthsError}
          onChange=${(v) => update("months", v)}
          Icon=${CalendarDays}
        />
      </div>
      <div className="results" aria-live="polite" aria-atomic="true">
        <div className="monthly">
          <p className="result-label">Votre mensualité théorique</p>
          <output
            className="monthly-value result-update"
            key=${`${valid.amount}-${valid.months}`}
            >${euro(monthly)}<small>/ mois</small></output
          >
          <p className="hint">
            Pour ${euro(valid.amount)} sur ${valid.months} mois
          </p>
        </div>
        <div className="result-details">
          <div className="result-row">
            <span>Montant emprunté</span><strong>${euro(valid.amount)}</strong>
          </div>
          <div className="result-row">
            <span>Intérêts totaux</span><strong>${euro(interest)}</strong>
          </div>
          <div className="result-row total">
            <span>Total remboursé</span><strong>${euro(total)}</strong>
          </div>
        </div>
      </div>
      ${(amountError || monthsError) && html`<div style=${{ margin: "0 24px 24px" }}><${Notice} error=${true}>Dernière simulation valide conservée. Corrigez les champs pour actualiser les résultats.</${Notice}></div>`}
    </div>
    <p className="financial-warning">
      ${icon(Info)}<span
        >Simulation pédagogique à intérêts simples, non représentative d’une
        offre bancaire.</span
      >
    </p>
    <details className="method">
      <summary>
        ${icon(Info)}Comment cette simulation est-elle calculée
        ?${icon(ChevronDown)}
      </summary>
      <p>
        Les intérêts sont calculés sur le capital initial, à un taux annuel fixe
        de 7 %, sans amortissement. Ce calcul pédagogique ne tient compte ni des
        frais ni de l’assurance. Seul l’affichage est arrondi à deux décimales.
      </p>
      <div className="formula">
        <p>
          C = capital emprunté · N = durée en mois · I = intérêts · T = total
          remboursé · M = mensualité
        </p>
        <math display="block"
          ><mi>I</mi><mo>=</mo><mi>C</mi><mo>×</mo><mn>0,07</mn><mo>×</mo
          ><mfrac><mi>N</mi><mn>12</mn></mfrac></math
        ><math display="block"
          ><mi>T</mi><mo>=</mo><mi>C</mi><mo>+</mo><mi>I</mi
          ><mspace width="2em" /><mi>M</mi><mo>=</mo
          ><mfrac><mi>T</mi><mi>N</mi></mfrac></math
        >
      </div>
    </details>
  </section>`;
}
function RoleDialog({ target, close, confirm, busy }) {
  const ref = useRef(null);
  useEffect(() => {
    const trigger = document.activeElement;
    ref.current?.showModal();
    return () => trigger?.focus();
  }, []);
  const next = target.role === "Manager" ? "Exécutant" : "Manager";
  return html`<dialog
    ref=${ref}
    aria-labelledby="dialog-title"
    aria-describedby="dialog-description"
    onCancel=${(e) => {
      e.preventDefault();
      if (!busy) close();
    }}
    onClick=${(e) => {
      if (e.target === ref.current && !busy) {
        const b = ref.current.getBoundingClientRect();
        if (
          e.clientX < b.left ||
          e.clientX > b.right ||
          e.clientY < b.top ||
          e.clientY > b.bottom
        )
          close();
      }
    }}
  >
    <h2 id="dialog-title">Modifier ce rôle ?</h2>
    <p id="dialog-description">
      Le rôle de <strong>${target.email}</strong> sera modifié dans ce prototype
      uniquement.
    </p>
    <div className="role-change">
      <${Role} role=${target.role} />${icon(ArrowRight)}<${Role} role=${next} />
    </div>
    <p>
      ${next === "Manager" ? "Ce profil pourra accéder à la gestion des profils fictifs." : "Ce profil conservera uniquement l’accès au simulateur."}
    </p>
    <div className="dialog-actions">
      <button className="btn" onClick=${close} disabled=${busy} autofocus>
        Annuler</button
      ><button
        className="btn primary"
        onClick=${() => confirm(target)}
        disabled=${busy}
      >
        ${busy && icon(LoaderCircle, { className: "spinner" })}${busy ? "Modification…" : "Confirmer"}
      </button>
    </div>
  </dialog>`;
}
function Profiles({
  profiles,
  session,
  status,
  setStatus,
  target,
  setTarget,
  onConfirm,
  busy,
  notice,
  setNotice,
}) {
  return html`<section className="screen">
    <div className="page-intro">
      <div>
        <p className="eyebrow">UN ESPACE BIEN ORGANISÉ</p>
        <h1>Gestion des profils</h1>
        <p>Les bonnes personnes, avec le bon niveau d’accès.</p>
      </div>
      <span className="pill">${icon(ShieldCheck)}Espace Manager fictif</span>
    </div>
    ${notice && html`<${Notice} error=${notice.type === "error"}>${notice.text}</${Notice}>`}
    <div className="table-card">
      <div className="table-top">
        <h2>Les profils de démonstration</h2>
        <span
          >${status === "ready" ? `${profiles.length} profils` : status === "empty" ? "0 profil" : ""}</span
        >
      </div>
      ${
        status === "loading"
          ? html`<div role="status" aria-live="polite">
              <span className="sr-only">Chargement des profils…</span
              >${[1, 2, 3, 4].map((n) => html`<div className="loading-row" key=${n}><span className="skeleton"></span><span className="skeleton"></span></div>`)}
            </div>`
          : status === "error"
            ? html`<div className="empty-state" role="alert">
                ${icon(CircleAlert)}
                <h2>Les profils n’ont pas pu être chargés</h2>
                <p>
                  Il s’agit d’une erreur de démonstration. Vous pouvez relancer
                  le chargement fictif.
                </p>
                <button
                  className="btn"
                  onClick=${() => {
                    setStatus("loading");
                    setTimeout(() => setStatus("ready"), 650);
                  }}
                >
                  ${icon(RefreshCw)}Réessayer
                </button>
              </div>`
            : status === "empty"
              ? html`<div className="empty-state">
                  ${icon(Users)}
                  <h2>Aucun profil pour le moment</h2>
                  <p>
                    Les profils de démonstration apparaîtront ici. Aucune donnée
                    n’a été supprimée.
                  </p>
                  <button className="btn" onClick=${() => setStatus("ready")}>
                    Restaurer la liste fictive
                  </button>
                </div>`
              : html`<table>
                  <caption className="sr-only">
                    Liste des e-mails et rôles fictifs
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">E-mail</th>
                      <th scope="col">Rôle</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${profiles.map(
                      (p) =>
                        html`<tr key=${p.email}>
                          <td>
                            <div className="user-cell">
                              <span className="avatar" aria-hidden="true"
                                >${p.email.slice(0, 2).toUpperCase()}</span
                              ><span className="user-email"
                                >${p.email}${session.email === p.email && html`<span className="you">Vous</span>`}</span
                              >
                            </div>
                          </td>
                          <td><${Role} role=${p.role} /></td>
                          <td>
                            <button
                              className="btn small"
                              aria-label=${`Modifier le rôle de ${p.email}`}
                              onClick=${() => {
                                setNotice(null);
                                if (session.email === p.email)
                                  setNotice({
                                    type: "error",
                                    text: "Action interdite : vous ne pouvez pas rétrograder votre propre compte.",
                                  });
                                else setTarget(p);
                              }}
                            >
                              ${icon(session.email === p.email ? LockKeyhole : Pencil)}Modifier
                              le rôle
                            </button>
                          </td>
                        </tr>`,
                    )}
                  </tbody>
                </table>`
      }
    </div>
    <p className="table-note">
      ${icon(LockKeyhole)}Votre propre rôle est protégé : vous ne pouvez pas
      rétrograder votre compte.
    </p>
    ${target && html`<${RoleDialog} target=${target} close=${() => setTarget(null)} confirm=${onConfirm} busy=${busy} />`}
  </section>`;
}
function Forbidden({ navigate, session }) {
  return html`<section className="screen">
    <div className="intro">
      <p className="eyebrow">ACCÈS LIMITÉ</p>
      <h1>Cet espace est réservé aux Managers.</h1>
    </div>
    <div className="auth-card empty-state">
      ${icon(LockKeyhole)}
      <h2>Accès non autorisé</h2>
      <p>
        Votre profil ${session?.role || ""} ne peut pas consulter la gestion des
        profils.
      </p>
      <button className="btn primary" onClick=${() => navigate("/simulateur")}>
        ${icon(ArrowLeft)}Revenir au simulateur
      </button>
    </div>
  </section>`;
}
const PROTECTED = ["/simulateur", "/profils"];
const TITLES = {
  "/inscription": "Inscription · E-001",
  "/connexion": "Connexion · E-001",
  "/simulateur": "Simulateur · E-002",
  "/profils": "Profils · E-003",
};
function App() {
  const [page, setPage] = useState(location.hash.slice(1) || "/inscription");
  // session = { id, email, role } ; le rôle vient toujours de T-001, jamais du navigateur.
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(!!supabase);
  const mode = page === "/connexion" ? "signin" : "signup";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [authNotice, setAuthNotice] = useState(
    supabase ? "" : "Configuration Supabase manquante : renseignez VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY.",
  );
  const [notice, setNotice] = useState(null);
  const [profiles] = useState([]);
  const [status, setStatus] = useState("empty");
  const [target, setTarget] = useState(null);
  const [roleBusy] = useState(false);
  const [amount, setAmount] = useState("5000");
  const [months, setMonths] = useState("12");
  const [valid, setValid] = useState({ amount: 5000, months: 12 });
  function resetSimulator() {
    setAmount("5000");
    setMonths("12");
    setValid({ amount: 5000, months: 12 });
  }
  function navigate(raw, replace = false, keepNotice = false) {
    const route = raw.replace(/^#/, "").trim();
    setTarget(null);
    setNotice(null);
    setErrors({});
    if (!keepNotice) setAuthNotice("");
    if (replace) history.replaceState(null, "", "#" + route);
    else if (location.hash !== "#" + route)
      history.pushState(null, "", "#" + route);
    setPage(route);
  }
  // Ouvre l'espace seulement si le profil T-001 est lisible ; sinon la session est fermée.
  async function openSession(user) {
    try {
      const role = await loadRole(supabase, user.id);
      setSession({ id: user.id, email: user.email, role });
      return true;
    } catch (e) {
      await supabase.auth.signOut({ scope: "local" });
      setSession(null);
      setErrors({ form: true });
      setAuthNotice(
        e.message === "profile_missing"
          ? "Votre profil est indisponible : l’accès est refusé. Réessayez plus tard."
          : "Impossible de vérifier votre profil. Vérifiez votre connexion puis réessayez.",
      );
      return false;
    }
  }
  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase.auth
      .getSession()
      .then(async ({ data }) => {
        if (active && data.session) await openSession(data.session.user);
      })
      .finally(() => active && setChecking(false));
    // Session expirée, révoquée ou fermée dans un autre contexte : on retire tout accès local.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setSession(null);
        setTarget(null);
        resetSimulator();
      }
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    const sync = () => {
      setPage(location.hash.slice(1) || "/inscription");
      setTarget(null);
      setErrors({});
    };
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    if (!location.hash) history.replaceState(null, "", "#/inscription");
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
    };
  }, []);
  useEffect(() => {
    if (checking) return;
    if (PROTECTED.includes(page) && !session) {
      navigate("/connexion", true, true);
      setAuthNotice((n) => n || "Connectez-vous pour accéder à cet écran.");
    } else if (session && (page === "/connexion" || page === "/inscription")) {
      navigate("/simulateur", true);
    }
    document.title = "Clair — " + (TITLES[page] || "Page introuvable");
    requestAnimationFrame(() => {
      const heading = document.querySelector("main h1");
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    });
  }, [page, session, checking]);
  async function submit(e) {
    e.preventDefault();
    const next = validateCredentials(email, password);
    setErrors(next);
    setAuthNotice("");
    if (Object.keys(next).length) {
      document.getElementById(next.email ? "email" : "password")?.focus();
      return;
    }
    if (!supabase) return;
    setBusy(true);
    try {
      const credentials = { email: email.trim().toLowerCase(), password };
      const { data, error } =
        mode === "signin"
          ? await supabase.auth.signInWithPassword(credentials)
          : await supabase.auth.signUp(credentials);
      setPassword("");
      if (error || !data.session) {
        setErrors({ form: true });
        setAuthNotice(authErrorMessage(error));
        return;
      }
      if (await openSession(data.session.user)) navigate("/simulateur");
    } catch {
      setErrors({ form: true });
      setAuthNotice(authErrorMessage());
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    // Révoque la session côté Supabase ; en cas d'échec réseau, on ferme au moins la session locale.
    const { error } = await supabase.auth.signOut();
    if (error) await supabase.auth.signOut({ scope: "local" });
    setSession(null);
    setPassword("");
    setEmail("");
    navigate("/connexion");
    resetSimulator();
  }
  return html`<div className="shell">
    <${Header}
      session=${session}
      page=${page}
      navigate=${navigate}
      logout=${logout}
    />
    <main id="main" tabindex=${-1}>
      <${Steps} page=${page} session=${session} />${
        checking
          ? html`<section className="screen intro" role="status">
              <h1>Vérification de votre session…</h1>
            </section>`
          : page === "/inscription" || page === "/connexion"
            ? html`<${Auth}
                mode=${mode}
                setMode=${(v) => {
                  setPassword("");
                  navigate(v === "signin" ? "/connexion" : "/inscription");
                }}
                email=${email}
                setEmail=${setEmail}
                password=${password}
                setPassword=${setPassword}
                onSubmit=${submit}
                busy=${busy || !supabase}
                errors=${supabase ? errors : { form: true }}
                notice=${authNotice}
              />`
            : page === "/profils" && session?.role !== "Manager"
              ? html`<${Forbidden} session=${session} navigate=${navigate} />`
              : page === "/profils"
                ? html`<${Profiles}
                    profiles=${profiles}
                    session=${session}
                    status=${status}
                    setStatus=${setStatus}
                    target=${target}
                    setTarget=${setTarget}
                    onConfirm=${() => setTarget(null)}
                    busy=${roleBusy}
                    notice=${notice}
                    setNotice=${setNotice}
                  />`
                : page === "/simulateur" && session
                  ? html`<${Simulator}
                      amount=${amount}
                      setAmount=${setAmount}
                      months=${months}
                      setMonths=${setMonths}
                      valid=${valid}
                      setValid=${setValid}
                      notice=${notice?.text}
                    />`
                  : html`<section className="screen intro">
                      <h1>Page introuvable</h1>
                      <p>Cette adresse n’existe pas.</p>
                      <button
                        className="btn"
                        onClick=${() => navigate(session ? "/simulateur" : "/connexion")}
                      >
                        Revenir à votre espace
                      </button>
                    </section>`
      }
    </main>
    <footer className="footer">
      <span>© 2026 Clair. Un projet, une perspective.</span
      ><span className="footer-right"
        ><span></span>Simulation pédagogique · Sans engagement</span
      >
    </footer>
  </div>`;
}
createRoot(document.getElementById("root")).render(html`<${App} />`);
