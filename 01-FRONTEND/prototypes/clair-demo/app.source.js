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
  FlaskConical,
  LoaderCircle,
  RefreshCw,
  Pencil,
  BadgeCheck,
} from "lucide-react";
const html = htm.bind(React.createElement);
const euro = (n) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
const DEMO_PASSWORD = "DemoClair2026";
const STORAGE_KEY = "clair-prototype-v2";
function restore() {
  try {
    const data = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    return data?.version === 2 && Array.isArray(data.profiles) ? data : null;
  } catch {
    return null;
  }
}
const initialProfiles = [
  { email: "manager@demo.fr", role: "Manager" },
  { email: "alice@demo.fr", role: "Exécutant" },
  { email: "bob@demo.fr", role: "Exécutant" },
  { email: "sophie@demo.fr", role: "Manager" },
];
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
                    <strong>${session.role} fictif</strong>${session.email}
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
            : html`<span className="proto-badge">PROTOTYPE INTERACTIF</span>`
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
              autocomplete="off"
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
          <label htmlFor="password">Mot de passe fictif</label>
          <div className="input-wrap">
            ${icon(LockKeyhole)}<input
              id="password"
              className="text-input with-icon"
              type=${visible ? "text" : "password"}
              autocomplete="off"
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
          ${errors.password ? html`<p id="password-error" className="field-error" role="alert">${icon(CircleAlert)}${errors.password}</p>` : html`<p id="password-hint" className="hint">8 caractères minimum. N’utilisez pas un vrai mot de passe.</p>`}
        </div>
        <button className="btn primary full" type="submit" disabled=${busy}>
          ${busy ? html`${icon(LoaderCircle, { className: "spinner" })}<span>Un instant…</span>` : html`<span>${mode === "signup" ? "S’inscrire" : "Se connecter"}</span>${icon(ArrowRight)}`}
        </button>
        <p className="signup-note">
          Un espace de démonstration, sans engagement.<br />Aucun compte réel ne
          sera créé.
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
    <div className="auth-card demo-credentials">
      <strong>Identifiants de démonstration</strong>
      <p>
        Manager : manager@demo.fr<br />Exécutant : alice@demo.fr<br />Mot de
        passe commun : <code>DemoClair2026</code>
      </p>
      <p>Choisissez « Se connecter » pour accéder à la suite.</p>
    </div>
    <div className="assurance">
      ${icon(ShieldCheck)}<span
        >Données fictives · Aucune donnée transmise</span
      >
    </div>
  </section>`;
}
function Confirmation({ email, confirm, resend, resent, busy, back }) {
  return html`<section className="screen">
    <div className="intro">
      <p className="eyebrow">PLUS QU’UNE ÉTAPE</p>
      <h1>Votre espace vous attend.</h1>
      <p>Une confirmation, et vous voilà prêt à simuler.</p>
    </div>
    <div className="auth-card confirmation">
      <div className="confirmation-icon">${icon(Mail)}</div>
      <h2>Confirmez votre adresse</h2>
      <p>
        Une confirmation fictive a été préparée pour<strong>${email}</strong>
      </p>
      <p className="mock-note">
        Aucun e-mail n’est envoyé. Le bouton ci-dessous simule la confirmation
        et ouvre le simulateur.
      </p>
      ${resent && html`<${Notice}>Confirmation renvoyée fictivement.</${Notice}>`}<button
        className="btn primary full"
        disabled=${busy}
        onClick=${confirm}
      >
        ${busy ? icon(LoaderCircle, { className: "spinner" }) : icon(BadgeCheck)}<span
          >${busy ? "Confirmation…" : "Simuler la confirmation"}</span
        ></button
      ><button className="text-button" disabled=${busy} onClick=${resend}>
        Renvoyer la confirmation fictive
      </button>
      <div className="card-divider"></div>
      <button className="btn quiet" onClick=${back}>
        ${icon(ArrowLeft)}Retour à l’inscription
      </button>
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
function validateNumber(raw, kind) {
  if (raw.trim() === "") return "Renseignez une valeur.";
  if (!/^\d+(?:[.,]\d+)?$/.test(raw.trim()))
    return "Saisissez une valeur numérique valide.";
  const n = Number(raw.replace(",", "."));
  if (!Number.isFinite(n)) return "Saisissez une valeur numérique valide.";
  if (kind === "amount") {
    if (n < 5000 || n > 15000)
      return "Le montant doit être compris entre 5 000 et 15 000 €.";
    if (n % 500 !== 0) return "Choisissez un montant par pas de 500 €.";
  } else {
    if (!Number.isInteger(n))
      return "La durée doit être un nombre entier de mois.";
    if (n < 12 || n > 72)
      return "La durée doit être comprise entre 12 et 72 mois.";
  }
  return "";
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
        amount: Number(nextAmount.replace(",", ".")),
        months: Number(nextMonths.replace(",", ".")),
      });
  }
  const interest = valid.amount * 0.07 * (valid.months / 12);
  const total = valid.amount + interest;
  const monthly = total / valid.months;
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
          last=${!amountError ? Number(amount.replace(",", ".")) : valid.amount}
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
          last=${!monthsError ? Number(months.replace(",", ".")) : valid.months}
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
      <p className="eyebrow">ACCÈS LIMITÉ DANS LE PROTOTYPE</p>
      <h1>Cet espace est réservé aux Managers.</h1>
    </div>
    <div className="auth-card empty-state">
      ${icon(LockKeyhole)}
      <h2>Accès non autorisé</h2>
      <p>
        Le profil ${session?.role || "non confirmé"} ne peut pas consulter la
        gestion des profils, y compris par la navigation simulée.
      </p>
      <button className="btn primary" onClick=${() => navigate("/simulateur")}>
        ${icon(ArrowLeft)}Revenir au simulateur
      </button>
    </div>
  </section>`;
}
function DemoPanel({
  session,
  chooseProfile,
  route,
  navigate,
  status,
  setStatus,
  mode,
  setMode,
}) {
  const [demoRole, setDemoRole] = useState("Exécutant");
  const [url, setUrl] = useState(route);
  useEffect(() => setUrl(route), [route]);
  return html`<div className="demo-wrap">
    <details className="demo">
      <summary>
        ${icon(FlaskConical)}<span className="demo-label">Mode démo</span
        ><span className="demo-sub"
          >Explorez les rôles et les états du prototype</span
        >${icon(ChevronDown, { className: "demo-chevron" })}
      </summary>
      <div className="demo-content">
        <div>
          <label htmlFor="demo-role">Compte fictif</label>
          <div className="demo-actions">
            <select
              id="demo-role"
              value=${demoRole}
              onChange=${(e) => setDemoRole(e.target.value)}
            >
              <option>Exécutant</option>
              <option>Manager</option></select
            ><button
              className="btn small"
              onClick=${() => chooseProfile(demoRole)}
            >
              ${session ? "Changer de compte" : "Préremplir le formulaire"}${icon(ArrowRight)}
            </button>
          </div>
          <p className="hint">
            ${session ? `Rôle actif : ${session.role} fictif` : "Comptes confirmés : connexion directe au simulateur."}
          </p>
        </div>
        <div>
          <label htmlFor="demo-url">Navigation simulée</label>
          <form
            className="demo-actions"
            onSubmit=${(e) => {
              e.preventDefault();
              navigate(url);
            }}
          >
            <input
              id="demo-url"
              value=${url}
              onChange=${(e) => setUrl(e.target.value)}
              placeholder="/profils"
            /><button className="btn small" type="submit">
              Aller${icon(ArrowRight)}
            </button>
          </form>
          <p className="hint">
            /inscription · /connexion · /confirmation · /simulateur · /profils
          </p>
        </div>
        ${
          session?.role === "Manager" &&
          route === "/profils" &&
          html`<div>
            <label htmlFor="demo-state">État de la liste</label
            ><select
              id="demo-state"
              value=${status}
              onChange=${(e) => setStatus(e.target.value)}
            >
              <option value="ready">Liste des profils</option>
              <option value="loading">Chargement (figé pour revue)</option>
              <option value="empty">Liste vide</option>
              <option value="error">Erreur de chargement</option>
            </select>
          </div>`
        }
        <p className="demo-disclaimer">
          Identifiants fictifs : manager@demo.fr (Manager) · alice@demo.fr
          (Exécutant). Mot de passe : DemoClair2026. Prototype UX uniquement :
          vérification locale simulée, aucun e-mail envoyé. Les comptes et la
          session sont conservés dans cet onglet jusqu’à sa fermeture. Le
          changement de rôle sert à la revue des écrans et ne constitue pas une
          véritable permission. Utilisez uniquement des données fictives.
        </p>
      </div>
    </details>
  </div>`;
}
function App() {
  const [saved] = useState(restore);
  const [page, setPage] = useState(location.hash.slice(1) || "/inscription");
  const [session, setSession] = useState(saved?.session || null);
  const mode = page === "/connexion" ? "signin" : "signup";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState(saved?.pending || null);
  const [resent, setResent] = useState(false);
  const [authNotice, setAuthNotice] = useState("");
  const [notice, setNotice] = useState(null);
  const [profiles, setProfiles] = useState(
    saved?.profiles ||
      initialProfiles.map((p) => ({
        ...p,
        password: DEMO_PASSWORD,
        confirmed: true,
      })),
  );
  const [status, setStatus] = useState("ready");
  const [target, setTarget] = useState(null);
  const [roleBusy, setRoleBusy] = useState(false);
  const [amount, setAmount] = useState("5000");
  const [months, setMonths] = useState("12");
  const [valid, setValid] = useState({ amount: 5000, months: 12 });
  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: 2, session, pending, profiles }),
      );
    } catch {}
  }, [session, pending, profiles]);
  function navigate(raw, replace = false) {
    const route = raw.replace(/^#/, "").trim();
    setTarget(null);
    setNotice(null);
    setErrors({});
    setAuthNotice("");
    if (replace) history.replaceState(null, "", "#" + route);
    else if (location.hash !== "#" + route)
      history.pushState(null, "", "#" + route);
    setPage(route);
  }
  useEffect(() => {
    const sync = () => {
      setPage(location.hash.slice(1) || "/inscription");
      setTarget(null);
      setErrors({});
      setAuthNotice("");
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
    if (["/simulateur", "/profils"].includes(page) && !session) {
      navigate("/connexion", true);
      setAuthNotice(
        "Connectez-vous à un compte fictif confirmé pour accéder à cet écran.",
      );
    } else if (page === "/confirmation" && !pending) {
      navigate("/connexion", true);
      setAuthNotice("Aucune confirmation fictive en attente.");
    }
    document.title =
      "Clair — " +
      ({
        "/inscription": "Inscription · E-001",
        "/connexion": "Connexion · E-001",
        "/confirmation": "Confirmation · E-001",
        "/simulateur": "Simulateur · E-002",
        "/profils": "Profils · E-003",
      }[page] || "Page introuvable");
    requestAnimationFrame(() => {
      const heading = document.querySelector("main h1");
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    });
  }, [page, session, pending]);
  function submit(e) {
    e.preventDefault();
    const next = {};
    const address = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address))
      next.email = "Saisissez une adresse e-mail valide.";
    if (password.length < 8) next.password = "Utilisez au moins 8 caractères.";
    setErrors(next);
    setAuthNotice("");
    if (Object.keys(next).length) {
      document.getElementById(next.email ? "email" : "password")?.focus();
      return;
    }
    const known = profiles.find((p) => p.email === address);
    const fail = (message) => {
      setErrors({ form: true });
      setAuthNotice(message);
    };
    if (mode === "signin") {
      if (!known)
        return fail(
          "Ce compte fictif n’existe pas. Inscrivez-vous ou utilisez un compte de démonstration.",
        );
      if (known.password !== password)
        return fail(
          "Identifiants incorrects. Vérifiez le mot de passe de démonstration.",
        );
      if (!known.confirmed) {
        setPending({ email: known.email, role: known.role });
        navigate("/confirmation");
        setAuthNotice(
          "Votre e-mail fictif n’est pas confirmé. Simulez la confirmation pour continuer.",
        );
        setPassword("");
        return;
      }
      setSession({ email: known.email, role: known.role });
      setPassword("");
      navigate("/simulateur");
    } else {
      if (known)
        return fail("Ce compte fictif existe déjà. Utilisez Se connecter.");
      const account = {
        email: address,
        password,
        role: "Exécutant",
        confirmed: false,
      };
      setProfiles((prev) => [...prev, account]);
      setPending({ email: address, role: "Exécutant" });
      setPassword("");
      setResent(false);
      navigate("/confirmation");
    }
  }
  function confirm() {
    if (!pending) return;
    setProfiles((prev) =>
      prev.map((p) =>
        p.email === pending.email ? { ...p, confirmed: true } : p,
      ),
    );
    setSession(pending);
    setPending(null);
    navigate("/simulateur");
  }
  function logout() {
    setSession(null);
    setPending(null);
    setPassword("");
    setEmail("");
    setTarget(null);
    setNotice(null);
    navigate("/connexion");
    setAmount("5000");
    setMonths("12");
    setValid({ amount: 5000, months: 12 });
  }
  function chooseProfile(role) {
    const chosen = {
      email: role === "Manager" ? "manager@demo.fr" : "alice@demo.fr",
      role,
    };
    setProfiles((prev) =>
      prev.map((p) => (p.email === chosen.email ? { ...p, role } : p)),
    );
    setTarget(null);
    setPending(null);
    if (session) {
      setSession(chosen);
      navigate("/simulateur");
    } else {
      navigate("/connexion");
      setEmail(chosen.email);
      setPassword(DEMO_PASSWORD);
      setAuthNotice(
        `Compte ${role} confirmé prérempli. Cliquez sur Se connecter.`,
      );
    }
  }
  function changeRole(p) {
    if (session?.role !== "Manager" || session.email === p.email) {
      setTarget(null);
      setNotice({
        type: "error",
        text: "Action interdite : ce rôle ne peut pas être modifié.",
      });
      return;
    }
    setRoleBusy(true);
    {
      const next = p.role === "Manager" ? "Exécutant" : "Manager";
      setProfiles((prev) =>
        prev.map((item) =>
          item.email === p.email ? { ...item, role: next } : item,
        ),
      );
      setRoleBusy(false);
      setTarget(null);
      setNotice({
        type: "success",
        text: `Modification réussie : ${p.email} est désormais ${next}.`,
      });
    }
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
        page === "/inscription" || page === "/connexion"
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
              busy=${busy}
              errors=${errors}
              notice=${authNotice}
            />`
          : page === "/confirmation"
            ? html`${authNotice && html`<div style=${{ marginTop: "24px" }}><${Notice}>${authNotice}</${Notice}></div>`}<${Confirmation}
                  email=${pending?.email}
                  confirm=${confirm}
                  resend=${() => setResent(true)}
                  resent=${resent}
                  busy=${busy}
                  back=${() => {
                    setPending(null);
                    navigate("/inscription");
                  }}
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
                    onConfirm=${changeRole}
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
                      <p>Cette adresse n’existe pas dans le prototype.</p>
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
        ><span></span>Prototype pédagogique · Sans engagement</span
      >
    </footer>
    <${DemoPanel}
      session=${session}
      chooseProfile=${chooseProfile}
      route=${page}
      navigate=${navigate}
      status=${status}
      setStatus=${setStatus}
      mode=${mode}
    />
  </div>`;
}
createRoot(document.getElementById("root")).render(html`<${App} />`);
