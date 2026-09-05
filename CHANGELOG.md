# Changelog

Alle nennenswerten Änderungen an **Mathsachs** werden in dieser Datei
dokumentiert.

Das Format orientiert sich an
[Keep a Changelog](https://keepachangelog.com/de/1.1.0/), und das Projekt folgt
der [Semantischen Versionierung](https://semver.org/lang/de/).

## [Unreleased]

## [0.1.27] – 2026-09-05

### Geändert

- **Auf Updates prüfen:** Der Button sitzt direkt auf der
  **Einstellungen**-Übersicht (Lehrpläne, Klasse, WLAN-Zugang, Profil,
  Aufgaben ergänzen), nicht mehr unter **Profil**. Beim Start und einmal
  am Kalendertag (**Europe/Berlin**) prüft die App weiter automatisch.
  Der manuelle Button umgeht die Tages-Sperre. Ist ein Update da, erscheint
  der bekannte Hinweis.

## [0.1.26] – 2026-09-05

### Hinzugefügt

- **Aufgaben ergänzen:** Lehrer senden unter **Einstellungen → Aufgaben
  ergänzen** Vorgaben für neue Übungsaufgaben: **Klassenstufe**,
  **Themengebiet**, **Titel des Themas** und ein **Aufgabenbeispiel**. Die
  Angaben gehen per E-Mail an uns. Der Klassen-Server speichert nichts
  davon.

## [0.1.25] – 2026-09-05

### Hinzugefügt

- **Auf Updates prüfen:** Unter **Einstellungen → Profil** prüft ein Button
  jederzeit auf eine neue Version. Die Sperre „schon heute geprüft“ gilt nur
  für die automatische Prüfung. Ist ein Update da, erscheint der bekannte
  Hinweis. Sonst steht unter dem Button, dass du die aktuelle Version hast
  (oder dass die Prüfung fehlgeschlagen ist).

## [0.1.24] – 2026-09-05

### Hinzugefügt

- **Rolle Klassenlehrer:** Rechte wie Lehrer beim Mitmachen in der Klasse
  (Code eintragen, Stufen-Wettbewerb über die eigene Klasse), aber **ohne**
  Klausur erstellen/schreiben, ohne Klassencode oder Stufencode anzulegen
  und ohne Punkte an die Klasse zu senden.
- **Stufencode eintragen:** Andere **Lehrer** derselben Klassenstufe tragen
  denselben Stufencode ein (wie bisher das Geheimnis). Danach sehen sie den
  Wettbewerb aller Klassen (nur Namen und Summen) und können Klassencodes
  dieser Stufe zuordnen oder neu anlegen. Neu erstellte Codes werden nicht
  automatisch aktiv. Eltern legen weiter nur Klassencodes an, keine Stufe.
- **Rollen-Rechte-Matrix** unter **Einstellungen → Profil**: Übersicht aller
  Rechte je Rolle. **Challenge erstellen** ist für Lehrer und Klassenlehrer
  als **geplant** eingetragen, noch nicht in der App.

### Geändert

- Benutzerwahl und Profil bieten vier Rollen: Schüler, Eltern, Klassenlehrer,
  Lehrer. Profile ohne Rolle bleiben **Schüler**, mit eigenen Klassencodes
  **Eltern** — nie automatisch Lehrer.

## [0.1.23] – 2026-09-05

### Geändert

- **Klassencode erstellen:** Ein neuer Klassencode wird nicht mehr automatisch
  aktiv. Der bisher aktive Code bleibt aktiv. Aktivieren bleibt über
  **Aktivieren** bei den eigenen Codes oder über **Code eintragen**.

### Hinzugefügt

- **Update-Prüfung einmal täglich:** Bleibt Mathsachs über Nacht oder das
  Wochenende geöffnet, prüft die App nach dem Start erneut am nächsten
  Kalendertag (**Europe/Berlin**) auf GitHub-Releases. Der vorhandene
  Update-Hinweis erscheint, wenn eine neue Version da ist. An einem Tag
  höchstens eine Prüfung (der Zeitpunkt wird lokal gemerkt).

## [0.1.22] – 2026-09-05

### Geändert

- **Klausurerstellung:** Der WLAN-/Teilen-Link und der QR-Code entfallen —
  Schüler können den Link nur im selben Netz wie der Klausurersteller nutzen.
  Beim **Klausurcode** gibt es dafür **WhatsApp** und **Mail** (wie beim
  Klassencode). Kopieren bleibt. WLAN-Zugang unter den Einstellungen bleibt.

## [0.1.21] – 2026-09-05

### Behoben

- **Klassenname statt Klassencode:** In der Leiste neben dem Namen und im
  Punkteprotokoll („Punkte an …“) erscheint wieder der **Klassenname**
  (z. B. `6/6`), nicht der geheime Klassencode. Schüler tragen den Code nur
  ein; der Name kommt vom Klassen-Server und wird lokal gemerkt. Der
  Stufen-Wettbewerb zeigte die Namen bereits richtig.

## [0.1.20] – 2026-09-05

### Hinzugefügt

- **Klassenstufencode:** Nur **Lehrer** legen unter **Einstellungen → Klasse**
  eine Klassenstufe an und ordnen ihr Klassencodes zu. Der Stufencode bleibt
  beim Lehrer (kopieren zum Teilen unter Lehrkräften). **Eltern** erstellen
  weiter Klassencodes, aber keine Stufe. **Schüler** tragen nur einen
  Klassencode ein und senden Punkte nur dorthin.
- **Stufen-Wettbewerb:** Ist eine Klasse einer Stufe zugeordnet, sehen alle
  mit diesem Klassencode die Punktestände der anderen Klassen derselben Stufe
  (Tag / Woche / Monat / Schuljahr) — in den Einstellungen und im
  Punkteprotokoll. Es erscheinen nur **Klassennamen** und Summen, keine
  Personennamen.
- **Worker:** `POST /grades`, `GET /grades/:code`, `PUT /grades/:code/classes`,
  `DELETE /grades/:code`. `GET /classes/:code` liefert bei Zuordnung eine
  Stufenübersicht ohne Mitgliedscodes. Punkte nur per `POST /classes/:code/points`.
  Nach dem Update einmal [`cloudflare/worker.js`](cloudflare/worker.js) in
  Cloudflare einfügen und **Deploy**en.

## [0.1.19] – 2026-09-05

### Hinzugefügt

- **Benutzerrollen:** Beim Anlegen eines Profils und unter **Einstellungen →
  Profil** wählst du **Schüler**, **Eltern** oder **Lehrer**.
  - **Schüler:** Themen, Klausur schreiben, Punkteprotokoll, Einstellungen.
    Unter Klasse nur einen bestehenden Code eintragen und aktivieren — kein
    Erstellen, Teilen oder Löschen eigener Codes.
  - **Eltern** und **Lehrer:** zusätzlich Klausur erstellen und die volle
    Klassencode-Verwaltung wie bisher.
  Vorhandene Profile ohne gespeicherte Rolle gelten als **Schüler**. Haben sie
  bereits eigene Klassencodes, gilt **Eltern**. Die Rolle lässt sich jederzeit
  im Profil ändern; die Reiter passen sich sofort an.

## [0.1.18] – 2026-09-05

### Geändert

- **Einstellungen-Leiste:** In den Einstellungen (inkl. Untermenüs) zeigt die
  Leiste **Zum Üben** links neben **Einstellungen**. Themen, Klausur
  erstellen, Klausur schreiben und Punkteprotokoll sind dort ausgeblendet.
  Einstellungen bleibt hervorgehoben. **Zum Üben** in der Leiste öffnet die
  Themen. Der doppelte Knopf in der Karte entfällt; **Zurück** bleibt in den
  Untermenüs.
- **Benutzerauswahl:** WLAN-Zugang steht nicht mehr auf „Wer übt heute?“,
  sondern nur unter Einstellungen → WLAN-Zugang.

## [0.1.17] – 2026-09-05

### Geändert

- **Einstellungen-Untermenü:** Die Seite zeigt zuerst eine Liste (Lehrpläne,
  Klasse, WLAN-Zugang, Profil). Ein Eintrag öffnet nur diesen Bereich;
  **Zurück** führt zur Liste. **Zum Üben** verlässt die Einstellungen und
  öffnet die Themen. WLAN-Zugang bleibt auf dem Desktop aktiv; im Browser
  ein Hinweis. „Zu den Lehrplänen“ öffnet direkt den Lehrplan-Bereich.

## [0.1.16] – 2026-09-05

### Geändert

- **Einstellungen:** Lehrpläne, Klasse/Klassencode, WLAN-Zugang und Profil
  liegen auf einer Seite. Die Leiste zeigt Themen, Klausur erstellen,
  Klausur schreiben, Punkteprotokoll und **Einstellungen**. Der Name und die
  aktive Klasse bleiben in der Leiste; **Benutzer wechseln** steht nur noch
  unter Profil (keine Benutzerrollen). WLAN-Zugang nur, wenn die Desktop-App
  den LAN-Status liefert — im Browser ein kurzer Hinweis.

## [0.1.15] – 2026-09-05

### Hinzugefügt

- **Klassencodes pro Benutzer:** Erstellte Codes, aktiver Code und
  „Punkte an Klasse senden“ gehören zum angemeldeten Benutzer. User B sieht
  User A’s Codes nicht; Wechseln lädt den Klasse-Reiter neu. Die Leiste zeigt
  nur die aktive Klasse des aktuellen Benutzers. Vorhandene gemeinsame Codes
  wandern einmal zum aktuellen bzw. ersten Benutzer. Die WLAN-Datei speichert
  weiter alle Benutzer, die Oberfläche nur den eigenen Stand.

### Behoben

- **Löschen bleibt gelöscht:** Ein lokal gelöschter Klassencode kommt beim
  WLAN-Abgleich nicht wieder. Die App schreibt einen Tombstone, speichert,
  und löscht dann online. Tablets, die den Tombstone sehen, entfernen den
  Code ebenfalls.
- **Stände aktualisieren** läuft nach dem Löschen nicht in einer GET-Schleife
  (ein Abruf pro Listenänderung, In-Flight-Sperre, Pause nach 429).

## [0.1.14] – 2026-09-05

### Hinzugefügt

- **Aktive Klasse in der Leiste:** Neben dem Benutzernamen steht der Name der
  aktiven Klasse (aus den eigenen Codes, sonst der formatierte Klassencode).
  Ohne aktiven Code bleibt die Zeile leer.
- **Punkteprotokoll nach Zeitraum:** Tag / Woche / Monat / Schuljahr / Gesamt
  aus den lokalen Übungen (Europe/Berlin, Schuljahr 1. Aug.–31. Jul.) — unabhängig
  von der Online-Klassensumme.
- **Übertragene Klassenpunkte:** Beim Senden an den Klassencode legt Mathsachs
  ein lokales Protokoll an (Zeit, Code, Klassenname, Punkte). Das Protokoll zeigt
  die Summe und, wenn mehrere Codes genutzt wurden, die Aufteilung je Klasse —
  ebenfalls nach Tag / Woche / Monat / Schuljahr. Zählt schon beim Senden; ein
  späterer Netzfehler ändert die Übung nicht.

## [0.1.13] – 2026-09-05

### Behoben

- **Löschen** entfernt den Klassencode sofort aus **Eigene Codes** (und
  deaktiviert ihn lokal), auch wenn der Server mit 429 oder Netzwerkfehler
  antwortet. Die Liste bleibt nicht mit „Zu viele Anfragen“ und **Löschen**
  stehen. Ein kurzer Hinweis, falls der Server den Code noch haben kann.
- **Stände aktualisieren** läuft nicht mehr in einer GET-Schleife bei jeder
  Speicher-Benachrichtigung. Bei 429 eine Banner-Meldung und Pause, kein
  Entfernen des Eintrags. Nur bestätigtes `not_found` (404) löscht lokal.

### Geändert

- Cloudflare-Worker: GET-Limit 300/min, DELETE 30/min (vorher 120 / 8).
  POST-Punkte bleibt 60/min. Nach dem Update einmal `cloudflare/worker.js`
  in Cloudflare **Deploy**en.

## [0.1.12] – 2026-09-05

### Behoben

- **Eigene Codes:** Gelöschte oder unbekannte Klassencodes (Worker 404 /
  `not_found`) werden aus der lokalen Liste entfernt. War der Code aktiv,
  endet das Sammeln. **Aktivieren** prüft den Code zuerst per GET; fehlt er,
  bleibt kein Aktivieren übrig. Netzwerk-, Rate-Limit- und „nicht bereit“-
  Fehler lassen den Eintrag stehen.

## [0.1.11] – 2026-09-04

### Hinzugefügt

- **Klassencode löschen** in der App (Reiter Klasse). Löscht die Klassensummen
  online und den Eintrag auf dem Gerät. Schüler und Lehrkräfte brauchen dafür
  keinen Cloudflare-Account.
- **Klassencode teilen** in der Liste **Eigene Codes**: **Code kopieren**
  (Zwischenablage, Format `ABCD-2345`), **WhatsApp** und **Mail**. Auf Tablets
  mit Web Share API zusätzlich **Teilen**.

### Geändert

- Klare Trennung: **Klassencode** = in der App erzeugt; **Worker-Programm** =
  einmaliges Server-Skript nur für die Betreiber. Meldung, wenn noch das
  Cloudflare-Testprogramm läuft.

## [0.1.10] – 2026-09-04

### Hinzugefügt

- **Online-Klassencodes:** Im Reiter **Klasse** kann ein Klassencode mit
  Klassennamen erzeugt oder eingetragen werden. Punkte gehen nur nach
  ausdrücklichem Opt-in an die Klasse, und nur ein Code sammelt gleichzeitig.
  Stände: Tag / Woche / Monat / Schuljahr (1. Aug.–31. Jul., Zeitzone
  Europe/Berlin, Serverzeit). Online liegen nur Klassenname und Summen — keine
  Vornamen, keine Geräte-IDs. Der Code ist das Geheimnis.
- **Cloudflare Worker** in [`cloudflare/worker.js`](cloudflare/worker.js):
  einmal in dash.cloudflare.com unter Edit Code einfügen und Deploy klicken
  (KV-Bindung `CLASSES`). Bis dahin zeigt die App eine deutsche Fehlermeldung.

## [0.1.9] – 2026-09-04

### Hinzugefügt

- **Gemeinsame Benutzer und Punkte über WLAN:** Die Desktop-App speichert
  Benutzerliste und Punkteprotokoll auf dem PC. Tablets, die die App im
  Browser über den WLAN-Zugang öffnen, sehen dieselben Namen und Punkte.
  Änderungen (neuer Benutzer, Übung, Klausur) erscheinen auf den anderen
  Geräten, solange Mathsachs läuft — ohne Neustart.

## [0.1.8] – 2026-09-04

### Hinzugefügt

- **WLAN-Zugang in der Desktop-App:** Solange Mathsachs auf einem Rechner
  läuft, startet sie einen lokalen Webserver (Port 4747, bei Belegung der
  nächste freie Port). Tablets und Handys im **selben WLAN** öffnen die
  Übungs-App im Browser unter `http://<Rechner-IP>:4747/`. Die Adresse und ein
  QR-Code stehen in der App. Klausur-Links/QR-Codes nutzen diese WLAN-Adresse,
  damit sie auf dem Tablet funktionieren. Die App muss geöffnet bleiben;
  es gibt kein Passwort (nur Geräte im lokalen Netz).

## [0.1.7] – 2026-09-04

### Behoben

- **Ideenmelder-Betreff:** Tippfehler *Übeungsprogramm* korrigiert zu
  *Übungsprogramm*. Der mailto-Betreff lautet jetzt
  *Idee / Feedback zum Mathsachs Übungsprogramm.*

## [0.1.6] – 2026-09-04

### Behoben

- **Windows-Auto-Update (HTTP 404):** Der NSIS-Installer hieß bisher
  `Mathsachs Setup x.y.z.exe` (Leerzeichen). `electron-updater` schreibt in
  `latest.yml` den Namen mit Bindestrichen (`Mathsachs-Setup-x.y.z.exe`),
  GitHub macht aus Leerzeichen Punkte (`Mathsachs.Setup.x.y.z.exe`). Der
  Download schlug deshalb fehl. Die Artefaktnamen sind jetzt fest ohne
  Leerzeichen, damit Dateiname, `latest.yml` und GitHub-Asset
  übereinstimmen.

## [0.1.5] – 2026-09-04

### Hinzugefügt

- **Impressum** in der App (Fußzeile) und in der README: Linus und Matthias
  Ulrich, Große Wallstraße 42, 04509 Delitzsch,
  info@my-smart-home-support.de.
- **MIT-Lizenz**: Datei [`LICENSE`](LICENSE) (Copyright 2026 Linus und Matthias
  Ulrich), Abschnitt in der README und vollständiger Lizenztext in der App.
- **Ideenmelder**: Schaltfläche „Idee / Feedback“ öffnet das Standard-Mailprogramm
  (`mailto:`) an info@my-smart-home-support.de mit dem Betreff
  *Idee / Feedback zum Mathsachs Übeungsprogramm.*

## [0.1.4] – 2026-09-04

### Hinzugefügt

- **Update-Hinweis aus GitHub Releases**: Die App prüft die öffentlichen GitHub
  Releases auf eine neuere Version und zeigt ein Banner mit Versionsnummer,
  Release-Notes und einem Download-Link zur passenden Datei.
  In der Desktop-App kann das Update über `electron-updater` heruntergeladen
  und installiert werden (Fallback: Installer-Link der Plattform).

## [0.1.3] – 2026-09-04

### Hinzugefügt

- **Übungsklausur per Code (Variante A)**: Lehrkräfte wählen Themen aus dem
  Lehrplan voraus, picken konkrete Vorschlagsaufgaben per Checkbox und erzeugen
  einen kompakten, seed-basierten Klausur-Code plus teilbaren Link
  (`#klausur=…`) und QR-Code — zum Verteilen z. B. über die Schulwebseite.
- **Klausur schreiben**: Schülerinnen und Schüler lösen den Code ein (oder
  öffnen den Link), rechnen die festen Aufgaben durch und erhalten eine
  automatische Auswertung mit Lösung und Erklärung je Aufgabe.
- **Ähnliche Aufgabe üben** nach der Auswertung (gleiches Thema, neuer Seed).
- Das Datenschema ist vorbereitet für eine spätere **Variante B** (eingebetteter
  Aufgabeninhalt).

## [0.1.2] – 2026-09-03

### Hinzugefügt

- **Lehrpläne Klasse 7 bis Jahrgangsstufe 11/12** als nachladbare Module
  (Gymnasium Mathematik, Sachsen):
  - **Klasse 7** – Geometrie in der Ebene, Arbeiten mit rationalen Zahlen,
    Prismen und Pyramiden, Darstellen von Daten.
  - **Klasse 8** – Terme und Gleichungen, Zufallsversuche, Funktionen und
    lineare Gleichungssysteme, Ähnlichkeit, heuristische Strategien.
  - **Klasse 9** – Funktionen und Potenzen, Kreise/Zylinder/Kugeln,
    rechtwinklige Dreiecke (Pythagoras, Trigonometrie), Auswerten von Daten.
  - **Klasse 10** – Wachstum und Zinsrechnung, diskrete Zufallsgrößen,
    algebraisches Lösen geometrischer Probleme, funktionale Zusammenhänge.
  - **Jahrgangsstufe 11/12 (Grundkurs)** – Differential- und Integralrechnung,
    Vektoren, binomialverteilte Zufallsgrößen (bewusst auf wenige, eindeutig
    prüfbare Themen begrenzt).
- **Themen-Suchfunktion**: Stichwortsuche über die Themen der geladenen Klassen
  – case-insensitive, teilstring-basiert, umlaut-tolerant (z. B. „Fläche“ ↔
  „flaeche“) und über kuratierte Schlagwörter je Thema. Treffer werden mit
  Klasse und Lernbereich sowie den Aktionen „Üben“/„Übungsblatt“ angezeigt.
  Passt ein Stichwort zu einer verfügbaren, aber nicht geladenen Klasse, erscheint
  der Hinweis „In Klasse X verfügbar – im Reiter ‚Lehrpläne‘ laden“.
- **Einheiten-Umrechnen-Themen**: Länge (mm/cm/dm/m/km), Flächeninhalt
  (mm²/cm²/dm²/m²/a/ha/km²), Volumen (mm³/cm³/dm³/m³/l/ml), Masse (mg/g/kg/t)
  und Zeit (s/min/h) mit eindeutiger Lösung und Erklärung über den
  Umrechnungsfaktor – zugeordnet zu Klasse 5 (alle Größen) und Klasse 6
  (Flächen- und Längeneinheiten).

## [0.1.1] – 2026-09-03

### Hinzugefügt

- **Lehrplan Klasse 5** (Gymnasium Mathematik, Sachsen) als nachladbares Modul:
  natürliche Zahlen, gemeine Brüche und Dezimalzahlen, Lagebeziehungen,
  Rechtecke und Quader sowie Sachaufgaben aus dem Alltag.

## [0.1.0] – 2026-09-03

### Hinzugefügt

- **Erststart von Mathsachs**: lehrplanorientiertes Übungsprogramm für das
  Gymnasium in Sachsen mit **Klasse 6** (Brüche, Zuordnungen, Dreiecke und
  Vierecke, Prismen, Anteile).
- **Direktes Üben** mit sofortiger Auswertung, Schritt-für-Schritt-Erklärungen
  und druckbaren **Übungsblättern** inklusive Lösungsteil.
- **Mehrbenutzer-Punkteprotokoll** je Thema.
- **Desktop-App** (Electron) mit Installern für Windows, macOS und Linux.
- **Cloud-Agent-Umgebung** (`.cursor/environment.json`) für die Entwicklung.

[Unreleased]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.27...HEAD
[0.1.27]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.26...v0.1.27
[0.1.26]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.25...v0.1.26
[0.1.25]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.24...v0.1.25
[0.1.24]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.23...v0.1.24
[0.1.23]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.22...v0.1.23
[0.1.22]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.21...v0.1.22
[0.1.21]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.20...v0.1.21
[0.1.20]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.19...v0.1.20
[0.1.19]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.18...v0.1.19
[0.1.18]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.17...v0.1.18
[0.1.17]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.16...v0.1.17
[0.1.16]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.15...v0.1.16
[0.1.15]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.14...v0.1.15
[0.1.14]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.13...v0.1.14
[0.1.13]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.12...v0.1.13
[0.1.12]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.11...v0.1.12
[0.1.11]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.10...v0.1.11
[0.1.10]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.9...v0.1.10
[0.1.9]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.8...v0.1.9
[0.1.8]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.7...v0.1.8
[0.1.7]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.6...v0.1.7
[0.1.6]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/MatthiasUlrich1/Mathsachs/releases/tag/v0.1.0
