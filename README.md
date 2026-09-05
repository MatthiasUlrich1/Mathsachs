# Mathsachs

Ein **lehrplanorientiertes Mathematik-Übungsprogramm** für das Gymnasium in
Sachsen (**Klasse 5 bis Jahrgangsstufe 11/12**). Schülerinnen und Schüler wählen
aus den Lernbereichen des Lehrplans einzelne Themen aus und üben sie entweder
direkt am Bildschirm oder erzeugen ausdruckbare Übungsblätter. Lehrkräfte können
daraus **Übungsklausuren** zusammenstellen und als Code oder Link an eine Klasse
verteilen. Gebaut mit React, TypeScript und Vite.

## Funktionen

- **Lehrplan-Themen** (Gymnasium Sachsen) für **Klasse 5, 6, 7, 8, 9, 10 und die
  Jahrgangsstufe 11/12 (Grundkurs)** als nachladbare Module. Jede Klasse ist in
  aufklappbaren Lernbereichen organisiert – von natürlichen Zahlen und Brüchen
  über rationale Zahlen, Terme und Gleichungen, Funktionen, Pythagoras und
  Trigonometrie bis hin zu Differential-/Integralrechnung, Vektoren und
  Binomialverteilung.
- **Themen-Suche**: Stichwortsuche über die geladenen Klassen –
  case-insensitive, teilstring-basiert und umlaut-tolerant (z. B. „Fläche“ ↔
  „flaeche“). Passt ein Stichwort zu einer verfügbaren, aber nicht geladenen
  Klasse, wird ein entsprechender Hinweis angezeigt.
- **Einheiten umrechnen**: Länge, Flächeninhalt, Volumen, Masse und Zeit mit
  eindeutiger Lösung und Erklärung des Umrechnungsfaktors.
- **Direkt üben** im Programm mit sofortiger Auswertung.
- **Erklärung anzeigen** bei falschen Aufgaben (Schritt-für-Schritt-Lösungsweg).
- **Übungsblätter drucken** (oder als PDF speichern) inklusive Lösungsteil.
- **Mehrere Benutzer**: Punkte werden pro Name gespeichert. In der Desktop-App
  gilt dieselbe Benutzerliste und derselbe Punktestand für den PC und für
  Tablets im WLAN. **Benutzer wechseln** steht unter **Einstellungen → Profil**.
- **Benutzerrollen:** Beim Anlegen und unter **Einstellungen → Profil** wählst
  du **Schüler**, **Eltern** oder **Lehrer**. Schüler sehen kein **Klausur
  erstellen** und können keine Klassencodes anlegen. Nur **Lehrer** legen
  einen **Klassenstufencode** an. Eltern erstellen weiter Klassencodes.
  Fehlt die Rolle (ältere Profile), gilt **Schüler** — außer es gibt bereits
  eigene Klassencodes, dann **Eltern**.
- **Einstellungen**: Untermenü mit Lehrplänen, Klassencode, WLAN-Zugang
  (Desktop) und Profil (Rolle und Benutzerwechsel). In den Einstellungen zeigt
  die Leiste **Zum Üben** links neben **Einstellungen** (hervorgehoben) und
  blendet Themen, Klausur und Punkteprotokoll aus. **Zurück** führt zur Liste.
  WLAN-Zugang nur unter Einstellungen, nicht auf der Benutzerauswahl.
- **Punkteprotokoll**: Auswertung je Thema in Prozent und Gesamtpunktzahl,
  plus Tag / Woche / Monat / Schuljahr aus den lokalen Übungen und den an
  eine Klasse gesendeten Punkten; ebenfalls druckbar.
- **Übungsklausur per Code**: Lehrkräfte stellen aus Lehrplan-Themen eine
  Klausur zusammen; Schülerinnen und Schüler lösen denselben Satz Aufgaben über
  einen Code oder Link (siehe [Übungsklausur per Code](#übungsklausur-per-code)).
- **WLAN-Zugang (Desktop-App)**: Läuft Mathsachs auf einem Rechner, können
  Tablets im selben WLAN die App im Browser öffnen (siehe
  [WLAN-Zugang](#wlan-zugang-desktop-app)).
- **Klassencode (online)**: Anonyme Klassen-Punktesummen über einen
  Cloudflare Worker (siehe [Klassencode](#klassencode-online)).
- **Klassenstufencode:** Lehrer ordnen Klassencodes einer Stufe zu. Alle
  Klassen der Stufe sehen denselben Wettbewerb (Klassennamen + Summen, keine
  Personendaten). Punkte gehen weiter nur an den eigenen Klassencode.
- **Erweiterbar** für weitere Klassenstufen und Fächer (Datenmodell mit
  Fach → Klassenstufe → Lernbereich → Thema).

Eine Übersicht aller Änderungen findet sich im [Changelog](CHANGELOG.md)
(aktuelle Version **0.1.22**).

Die App prüft beim Start die öffentlichen
[GitHub Releases](https://github.com/MatthiasUlrich1/Mathsachs/releases)
auf eine neuere Version (ohne Token). Ist ein Update da, erscheint ein
schließbarer Hinweis mit Versionsnummer, Release-Notes und Download. Im
Browser öffnet **Download** den passenden Installer bzw. die Releases-Seite;
die installierte Desktop-App kann das Update herunterladen und einspielen.

> Fachliche Grundlage: Sächsischer Lehrplan Gymnasium Mathematik. Die Aufgaben
> werden zufällig generiert und haben stets eindeutige, überprüfbare Lösungen.

## Übungsklausur per Code

Lehrkräfte stellen eine Übungsklausur aus konkreten Aufgaben des Lehrplans
zusammen. Die App erzeugt daraus einen **Klausurcode** (beginnt mit `MSX1:`).
Den Code kannst du kopieren oder per **E-Mail** bzw. **WhatsApp** versenden.
Es wird kein Server benötigt: Der Code enthält nur Verweise auf Thema und
Zufalls-Seed, die App erzeugt daraus auf jedem Gerät dieselben Aufgaben.

### Als Lehrkraft: Klausur erstellen

1. Unter **Einstellungen → Lehrpläne** die gewünschten Klassen laden (z. B. Klasse 6).
2. Reiter **Klausur erstellen** öffnen.
3. **Schritt 1 – Themen:** Lernbereiche aufklappen und die Themen per Checkbox
   vorauswählen.
4. **Schritt 2 – Aufgaben:** Pro Thema erscheinen fünf konkrete
   Vorschlagsaufgaben (mit Lösung zur Kontrolle). Per Checkbox die gewünschten
   Aufgaben auswählen, Punkte ggf. anpassen. „Neue Vorschläge“ erzeugt andere
   Zahlen zum selben Thema.
5. **Schritt 3 – Code:** Titel vergeben. Die App zeigt den Klausurcode zum
   Kopieren sowie **WhatsApp** und **Mail**.

### An die Klasse verteilen

Den **Klausurcode** kopieren oder per **E-Mail** bzw. **WhatsApp** teilen.
Schüler:innen öffnen die App, wählen **Klausur schreiben** und geben den Code
ein. Ein WLAN-Link wäre nur im selben Netz nutzbar und entfällt deshalb.

### Als Schülerin oder Schüler: Klausur schreiben

1. Mit dem eigenen Namen anmelden (Punkte werden unter diesem Namen gespeichert).
2. Den Reiter **Klausur schreiben** wählen und den Code einfügen (beginnt mit
   `MSX1:`).
3. Die Aufgaben der Reihe nach bearbeiten und die Klausur **abgeben**.
4. Die Auswertung zeigt je Aufgabe die eigene Antwort, die richtige Lösung und
   die Erklärung. Über **Ähnliche Aufgabe üben** kann dasselbe Thema mit neuen
   Zahlen weiter geübt werden.

> Der Code ist für **Übungsklausuren** gedacht, nicht für benotete Prüfungen:
> Aufgaben und Lösungen werden lokal erzeugt und sind nicht manipulationssicher.

## WLAN-Zugang (Desktop-App)

Die **installierte** Mathsachs-App startet automatisch einen kleinen Webserver
auf dem Rechner. Andere Geräte im **selben WLAN** können die Übungsoberfläche
dann im Browser nutzen — ohne eigene Installation und ohne öffentlichen
Internet-Host.

1. Mathsachs auf dem Windows-, macOS- oder Linux-Rechner starten und geöffnet
   lassen.
2. Unter **Einstellungen → WLAN-Zugang** die Adresse ansehen: dort stehen die Adresse
   (typisch `http://192.168.x.x:4747/`) und ein QR-Code.
3. Auf dem Tablet/Handy im Browser diese Adresse öffnen oder den QR-Code
   scannen. HTTP, nicht HTTPS.
4. Beim ersten Start kann die Firewall nachfragen — Zugriff im **privaten**
   Netz erlauben.

Hinweise:

- Gast-WLANs und viele Schulnetze trennen Clients voneinander
  (Client-Isolation). Dann sieht das Tablet den Rechner nicht.
- Es gibt **kein Passwort**. Wer im Netz die Adresse kennt, kann üben.
- **Benutzer und Punkte liegen auf dem PC** (nicht im localStorage des
  Tablets). Sobald Mathsachs auf dem Rechner läuft, sehen Tablets dieselbe
  Benutzerliste und dieselben Punkte; neue Übungen auf dem Tablet erscheinen
  auf dem Desktop und umgekehrt, ohne die App neu zu starten.
- Der Klausur**code** (`MSX1:…`) funktioniert in **Klausur schreiben** unabhängig
  vom WLAN-Zugang. Teile ihn per E-Mail oder WhatsApp, nicht als WLAN-Link.
- Der Entwicklungsserver `npm run dev` ist ein anderer Weg (Port 5173) und
  setzt Node.js plus Quellcode voraus. Ohne Desktop-App bleiben Benutzer
  dort nur lokal im Browser gespeichert.

## Klassencode (online)

Mathsachs hat **keine Nutzerkonten**. Zugang zur Klassenstatistik ist der
**Besitz des Codes**. Online liegen nur **Klassenname** und **aggregierte
Punkte** — keine Vornamen, keine Geräte-IDs. Wer den Code kennt, kann Stände
lesen und Punkte addieren. **Behandle den Code wie ein Passwort.**

Klassencodes, **Eigene Codes**, der aktive Code und das Opt-in **Punkte an
Klasse senden** gelten **pro angemeldetem Benutzer**. Andere Profile auf
demselben PC oder im WLAN sehen diese Liste nicht. Die Datei auf dem
Desktop kann trotzdem alle Benutzer enthalten.

Unter **Einstellungen → Klasse**:

1. **Code erstellen** (Eltern oder Lehrer): **in der App** den Klassennamen
   eingeben. Mathsachs erzeugt den Code selbst — niemand braucht dafür den
   Cloudflare-Account. **Schüler** sehen diesen Bereich nicht; sie können nur
   einen bestehenden Code eintragen und aktivieren.
2. **Code eintragen** und als einzigen Sammel-Code **aktivieren**.
3. Optional **Punkte an Klasse senden** (Opt-in). Nur mit aktivem Code und
   diesem Haken gehen neue Übungspunkte zusätzlich an die Klassensumme.
   Die App merkt sich das lokal im **Punkteprotokoll** (welche Klasse, wie
   viele Punkte, nach Zeitraum). Ohne Netz zählt der Eintrag trotzdem.
4. **Eigene Codes** mit Ständen **Tag / Woche / Monat / Schuljahr**,
   **Teilen** (Code kopieren, WhatsApp, Mail) und **Löschen** (entfernt die
   Klassensummen online). Codes, die der Server nicht mehr kennt, verschwinden
   aus der Liste (kein **Aktivieren** mehr).
   Schuljahr = 1. August bis 31. Juli, Zeitzone **Europe/Berlin**,
   **Serverzeit** des Workers.
5. **Klassenstufe** (nur Lehrer): Namen eingeben, Stufencode erzeugen,
   vorhandene Klassencodes zuordnen oder entfernen, Stufe löschen. Der
   Stufencode ist das Lehrer-Geheimnis — nicht an Schüler weitergeben.
6. **Stufen-Wettbewerb:** Sobald der aktive Klassencode einer Stufe
   zugeordnet ist, zeigt die App die Stände aller Klassen dieser Stufe
   (Einstellungen und Punkteprotokoll). Nur Klassennamen, keine Personen.

Öffentliche API (Standard, überschreibbar in `src/classCode/api.ts`):

`https://mathsachs-punkte.broad-heart-ad82.workers.dev`

| Methode | Pfad | Körper | Antwort |
| ------- | ---- | ------ | ------- |
| `GET` | `/` | — | `{ ok, service, hasClasses }` |
| `POST` | `/classes` | `{ name }` | `{ code, name, points, period }` |
| `GET` | `/classes/:code` | — | Klasse + Aufschlüsselung; bei Zuordnung `grade` (Namen + Summen, keine Mitgliedscodes) |
| `POST` | `/classes/:code/points` | `{ delta }` (1–100) | aktualisierte Klasse; Stufencode wird abgelehnt |
| `DELETE` | `/classes/:code` | — | `{ ok, deleted }` |
| `POST` | `/grades` | `{ name }` | `{ code, name, … }` (Lehrer-Stufencode) |
| `GET` | `/grades/:code` | — | Stufe + Klassenstände **ohne** Mitgliedscodes |
| `PUT` | `/grades/:code/classes` | `{ add?, remove? }` | Zuordnung; jeder `add` muss ein Klassencode sein |
| `DELETE` | `/grades/:code` | — | Stufe löschen; Klassencodes und ihre Punkte bleiben |

KV-Wert Klasse: `{ name, createdAt, days, gradeId? }`. KV-Wert Stufe:
`{ type: "grade", name, createdAt, classes }`. Woche/Monat/Jahr werden
server-seitig aus den Tages-Buckets der Mitgliedsklassen addiert. Die
Bindung heißt **`CLASSES`**. Keine Personendaten.

Rate-Limits je Client-IP / 60 s (siehe `cloudflare/worker.js`): **GET**
Klasse/Stufe 300, **DELETE** 30, **POST** neue Klasse 8, **POST** neue Stufe 8,
**PUT** Zuordnung 30, **POST** Punkte 60. `GET /` (Health) ist frei. Nach dem
Ändern der Worker-Datei einmal in Cloudflare **Deploy** klicken.

### Einmalig für Linus und Matthias (nicht für Schüler)

Der **Klassencode** entsteht in der App. Der **Worker-Code** ist etwas anderes:
das kleine Server-Programm hinter der URL, das Codes entgegennimmt. Schüler und
Lehrkräfte haben damit nichts zu tun und brauchen keinen Cloudflare-Account.

Aktuell antwortet `https://mathsachs-punkte.broad-heart-ad82.workers.dev/` noch
mit dem **Test-Programm** (jede Anfrage liefert nur `{ ok, service, hasClasses }`).
Deshalb erzeugt die App noch keine echten Codes, bis ihr **einmal** die echte
Datei einfügt:

1. [dash.cloudflare.com](https://dash.cloudflare.com) öffnen und einloggen.
2. **Workers & Pages** → Worker **`mathsachs-punkte`**.
3. **Edit Code**.
4. Alles löschen und den **gesamten** Inhalt von
   [`cloudflare/worker.js`](cloudflare/worker.js) einfügen.
5. **Settings → Bindings:** KV-Bindung genau **`CLASSES`**.
6. **Deploy**.
7. Kontrolle: `POST /classes` mit `{ "name": "Klasse 6a" }` muss einen
   8-stelligen `code` zurückgeben, nicht dasselbe JSON wie `GET /`.

### Optional: wrangler

Nur wenn Cloudflare-Zugangsdaten lokal liegen (meist nicht):

```bash
npx wrangler deploy --config cloudflare/wrangler.toml
```

Die KV-Bindung `CLASSES` muss in der Wrangler-Konfiguration bzw. im Dashboard
stehen. Ohne Credentials den Dashboard-Weg oben nutzen.

## Requirements

- Node.js 20+ (developed against Node 22)
- npm 10+

## Getting started

```bash
npm ci          # install exact, locked dependencies
npm run dev     # start the Vite dev server at http://localhost:5173
```

## Scripts

| Command             | Description                                  |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Start the dev server with hot reload.        |
| `npm run build`     | Type-check and produce a production build.    |
| `npm run preview`   | Preview the production build locally.         |
| `npm run typecheck` | Run the TypeScript compiler (no emit).        |
| `npm run lint`      | Lint the project with ESLint.                 |
| `npm run test`      | Run the Vitest unit suite once.              |

## Desktop app (installable setup)

Mathsachs can also be installed as a native desktop application via **Electron**.

### Install (end users)

Download the installer for your operating system from the project's
[GitHub Releases](https://github.com/MatthiasUlrich1/Mathsachs/releases) and run it:

| OS      | File                          | How to install                              |
| ------- | ----------------------------- | ------------------------------------------- |
| Windows | `Mathsachs-Setup-x.y.z.exe`   | Double-click and follow the setup wizard.   |
| macOS   | `Mathsachs-x.y.z.dmg`         | Open the `.dmg` and drag Mathsachs to Apps. |
| Linux   | `Mathsachs-x.y.z.AppImage`    | `chmod +x` then run it — no install needed. |
| Linux   | `mathsachs_x.y.z_amd64.deb`   | `sudo apt install ./mathsachs_*.deb`        |

**Windows-Hinweis (SmartScreen):** Weil die App von einer Privatperson kommt und
nicht mit einem kostenpflichtigen Code-Signing-Zertifikat signiert ist, warnt
Windows oft mit „Windows hat den PC geschützt“ bzw. unbekanntem Herausgeber.
Das ist bei diesem Setup erwartbar und kein Virenfund.

1. Den Installer **nur** von den offiziellen
   [GitHub Releases](https://github.com/MatthiasUlrich1/Mathsachs/releases)
   laden – nicht aus unbekannten Quellen.
2. Bei der Warnung **„Weitere Informationen“** klicken.
3. Dann **„Trotzdem ausführen“** wählen (manchmal **„Trotzdem installieren“**).

### Build installers yourself

Installers are produced by [`electron-builder`](https://www.electron.build/).
Each installer is built on its matching operating system:

```bash
npm run electron:dev          # run the desktop app in development
npm run electron:dist:linux   # build .AppImage + .deb   (run on Linux)
npm run electron:dist:win     # build .exe setup         (run on Windows)
npm run electron:dist:mac     # build .dmg               (run on macOS)
```

Output is written to the `release/` directory. Building the Debian package on
Linux requires `fakeroot` (`sudo apt-get install fakeroot`).

The cross-platform installers are produced automatically by the
[`release` GitHub Actions workflow](.github/workflows/release.yml), which builds
Windows, macOS, and Linux artifacts. Push a `v*` tag to attach them to a
GitHub Release, or run the workflow manually from the Actions tab.

## Project structure

```
src/
  lib/                # Reusable engine: rng, fractions, number parsing, storage
  classCode/          # Klassencode-API-Client, Code-Normalisierung, Berlin-Buckets
  curriculum/         # Lehrplan-Datenmodell, Klassen 5–12, Einheiten & Themen-Suche
  exam/               # Klausur-Code (Kodierung, Link, Auflösung der Aufgaben)
  lan/                # WLAN-Server-Status in der UI, Tests für den LAN-HTTP-Server
  legal/              # Impressum, Datenschutz-Hinweis, MIT-Lizenztext, Ideenmelder-mailto
  updates/            # GitHub-Releases-Updateprüfung (Semver, Assets, Banner)
  components/         # UI: Browser, Üben, Übungsblatt, Protokoll, Einstellungen (Lehrpläne, Klasse, WLAN, Profil), Klausur, Update-Hinweis, Rechtliches
  App.tsx             # Views, routing and user management
  App.css             # Component styles
  index.css           # Global theme
cloudflare/
  worker.js           # Copy-paste-ready Worker (Edit Code → Deploy)
  wrangler.toml       # Optional wrangler deploy (KV-Bindung CLASSES)
electron/
  main.cjs            # Electron main process (window, update check, LAN-Server, shared store)
  preload.cjs         # Preload bridge (desktop, updates, LAN-Status, shared storage)
  lanServer.cjs       # HTTP-Server für WLAN-Tablets plus /api/state
  sharedStore.cjs     # Gemeinsame Benutzer/Punkte/Klassencodes-Datei (userData)
  githubUpdate.cjs    # GitHub-Releases-Fallback für Updates
build/
  icon.svg / icon.png # App icon used by the installers
electron-builder.yml  # Desktop packaging config (win / mac / linux targets)
```

## Cloud Agent environment

`.cursor/environment.json` configures the Cursor Cloud Agent environment:
`npm ci` installs dependencies and the `dev` terminal runs the Vite dev server
on port 5173.

## Lizenz

Mathsachs steht unter der [MIT-Lizenz](LICENSE).
Copyright © 2026 Linus und Matthias Ulrich.

Den vollständigen Lizenztext findest du in der Datei [`LICENSE`](LICENSE)
und in der App unter **Lizenz**.

## Impressum

Linus und Matthias Ulrich  
Große Wallstraße 42  
04509 Delitzsch  
[info@my-smart-home-support.de](mailto:info@my-smart-home-support.de)

In der App ebenfalls unter **Impressum**.

Bei aktivem Klassencode speichert Mathsachs online nur den Klassennamen und
anonyme Punktesummen bei Cloudflare — keine Vornamen und keine Geräte-IDs.
Eine Klassenstufe speichert nur den Stufennamen und die zugeordneten
Klassencodes; der Wettbewerb zeigt Klassennamen plus Summen, nie Personen.
Der Code ist das Geheimnis. In der App unter **Datenschutz**.

## Idee / Feedback

Über **Idee / Feedback** in der App (oder den folgenden Link) öffnet sich das
Standard-Mailprogramm mit vorausgefülltem Empfänger und Betreff:

[Idee / Feedback zum Mathsachs Übungsprogramm.](mailto:info@my-smart-home-support.de?subject=Idee%20%2F%20Feedback%20zum%20Mathsachs%20%C3%9Cbungsprogramm.)

- An: `info@my-smart-home-support.de`
- Betreff: `Idee / Feedback zum Mathsachs Übungsprogramm.`
