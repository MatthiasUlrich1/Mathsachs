# Mathsachs

**Lehrplanorientiertes Übungsprogramm** für Mathematik und Physik an
sächsischen Schulen. Schülerinnen und Schüler wählen Themen aus dem Lehrplan,
üben am Bildschirm oder drucken Übungsblätter. Lehrkräfte stellen
**Übungsklausuren** zusammen und verteilen sie per Code oder Link.

Aktuelle Version: **0.27.41** · [Changelog](CHANGELOG.md) ·
[Alle Releases](https://github.com/MatthiasUlrich1/Mathsachs/releases) ·
[Web-App](https://matthiasulrich1.github.io/Mathsachs/)

## Web-App (Browser)

Ohne Installation im Browser:
**https://matthiasulrich1.github.io/Mathsachs/**

Benutzer, Punkte und Einstellungen liegen im **Browser-localStorage** dieses
Geräts. Unter **Einstellungen → Benutzerverwaltung** kannst du Daten als
JSON **exportieren** und auf einem anderen Gerät **importieren**.

## Download

Installer der aktuellen Version:

- **Windows-Installer:**
  [Mathsachs-Setup-0.27.28.exe](https://github.com/MatthiasUlrich1/Mathsachs/releases/download/v0.27.28/Mathsachs-Setup-0.27.28.exe)
- **macOS-Installer (Apple Silicon):**
  [Mathsachs-0.27.28-arm64.dmg](https://github.com/MatthiasUlrich1/Mathsachs/releases/download/v0.27.28/Mathsachs-0.27.28-arm64.dmg)
- **Linux (AppImage):**
  [Mathsachs-0.27.28.AppImage](https://github.com/MatthiasUlrich1/Mathsachs/releases/download/v0.27.28/Mathsachs-0.27.28.AppImage)
- **Linux (Debian/Ubuntu):**
  [mathsachs_0.27.28_amd64.deb](https://github.com/MatthiasUlrich1/Mathsachs/releases/download/v0.27.28/mathsachs_0.27.28_amd64.deb)

**Windows-Hinweis (SmartScreen):** Weil die App von einer Privatperson kommt und
nicht mit einem Code-Signing-Zertifikat signiert ist, warnt Windows oft mit
„Windows hat den PC geschützt“. Das ist erwartbar und kein Virenfund.

1. Den Installer **nur** von den offiziellen GitHub-Releases laden.
2. Bei der Warnung **„Weitere Informationen“** wählen.
3. Dann **„Trotzdem ausführen“** (manchmal **„Trotzdem installieren“**).

Unter **Einstellungen → Auf Updates prüfen** meldet die App, wenn eine neuere
Version bereitsteht.

## Lehrpläne

Unter **Einstellungen → Lehrpläne** installierst, aktualisierst oder entfernst
du Pakete. Danach blendest du die gewünschten Klassenstufen ein.

Aktuell verfügbar:

| Paket | Inhalt |
| --- | --- |
| **Gymnasium Sachsen · Mathematik** | Klasse 5–10 und Jahrgangsstufe 11/12 (Grundkurs) |
| **Gymnasium Sachsen · Physik** | Klasse 6–10 und Jahrgangsstufe 11/12 (Grundkurs und Leistungskurs) |
| **Oberschule Sachsen · Mathematik · Hauptschulbildungsgang** | Klassen 5–9 |
| **Oberschule Sachsen · Mathematik · Realschulbildungsgang** | Klassen 5–10 |

Die Lernbereiche und Themen folgen den sächsischen Lehrplänen. Aufgaben werden
zufällig erzeugt und haben stets eindeutige, überprüfbare Lösungen. Ergänzungen
von Lehrkräften erscheinen mit dem Badge **Lehrer-Ergänzung**.

## Funktionen

### Üben und Erklären

- **Themen auswählen** und **direkt üben** — Auswertung sofort nach der Antwort.
- **Erklärung anzeigen** bei falschen Aufgaben: Schritt-für-Schritt-Lösungsweg.
- **Themen-Suche** über die geladenen Klassen (auch umlaut-tolerant, z. B.
  „Fläche“ ↔ „flaeche“).
- **Einheiten umrechnen** (Länge, Flächeninhalt, Volumen, Masse, Zeit) mit
  eindeutiger Lösung und Erklärung des Umrechnungsfaktors.
- **Übungsblätter drucken** (oder als PDF speichern) inklusive Lösungsteil.
- In Physik und Mathematik gibt es je nach Thema auch **interaktive Aufgaben**
  (z. B. Schieberegler, Sortieren, Anklicken in einer Abbildung).

### Mehrere Benutzer und Rollen

Punkte werden **pro Name** gespeichert. Unter **Einstellungen → Profil** kannst
du Benutzer wechseln und die Rolle wählen: **Schüler**, **Eltern**,
**Klassenlehrer** oder **Lehrer**.

Wechsel in **Lehrer** oder **Klassenlehrer** nur mit dem gemeinsamen
**Lehrercode** (ein Code für die Schule). Fehlt der Code, kannst du ihn in der
App anfordern — die Anfrage geht per E-Mail an uns.

Kurzüberblick der Rechte:

| | Schüler | Eltern | Klassenlehrer | Lehrer |
| --- | --- | --- | --- | --- |
| Themen üben | ✓ | ✓ | ✓ | ✓ |
| Klausur schreiben | ✓ | ✓ | — | ✓ |
| Klausur erstellen | — | ✓ | — | ✓ |
| Klassencode erstellen | — | ✓ | — | ✓ |
| Klassencode eintragen | ✓ | ✓ | ✓ | ✓ |
| Stufencode / Stufenchallenge | — | — | — | ✓ |
| Klassenchallenge anlegen | — | — | ✓ | ✓ |
| Aufgaben ergänzen | — | — | — | ✓ |

Die vollständige Rechte-Matrix steht in der App unter **Einstellungen → Profil**.

### Challenge

Lehrer legen eine **Klassen-** oder **Stufenchallenge** an (Themen, Zeitraum,
optionaler Gewinn). Klassenlehrer nur Klassenchallenge. Schüler üben die
Challenge-Themen; Punkte zählen für Klasse/Stufe **und** extra für die
Challenge. Online liegen nur anonyme Summen — keine Schülernamen.

### Punkteprotokoll

Auswertung je Thema in Prozent und Gesamtpunktzahl, plus Tag / Woche / Monat /
Schuljahr — aus lokalen Übungen und an die Klasse gesendeten Punkten; ebenfalls
druckbar.

### Aufgaben ergänzen

Nur **Lehrer** können unter **Einstellungen → Aufgaben ergänzen** Vorgaben für
neue Übungsaufgaben senden (Klassenstufe, Themengebiet, Titel, Beispiel). Die
Angaben gehen per E-Mail an uns.

## Übungsklausur per Code

Lehrkräfte stellen eine Übungsklausur aus konkreten Aufgaben des Lehrplans
zusammen. Die App erzeugt einen **Klausurcode** (beginnt mit `MSX1:`). Den Code
kannst du kopieren oder per E-Mail bzw. WhatsApp versenden. Es wird kein Server
benötigt: Der Code enthält Verweise auf Thema und Zufalls-Seed — auf jedem Gerät
entstehen dieselben Aufgaben.

### Als Lehrkraft: Klausur erstellen

1. Unter **Einstellungen → Lehrpläne** den Lehrplan installieren und die
   gewünschten Klassen einblenden.
2. Reiter **Klausur erstellen** öffnen.
3. Themen vorauswählen, konkrete Aufgaben auswählen (fünf Vorschläge je Thema,
   Punkte anpassbar), Titel vergeben.
4. Optional einer **Klasse zuordnen** (eigener Klassencode oder Klasse einer
   eingetragenen **Stufe** — nur Codes/IDs, keine Personendaten).
5. Klausurcode kopieren oder per WhatsApp / Mail teilen.

### Als Schülerin oder Schüler: Klausur schreiben

1. Mit dem eigenen Namen anmelden.
2. Reiter **Klausur schreiben** wählen und den Code einfügen.
3. Aufgaben bearbeiten und abgeben.
4. Auswertung zeigt Antwort, richtige Lösung und Erklärung. Über **Ähnliche
   Aufgabe üben** geht es mit neuen Zahlen weiter.

> Der Code ist für **Übungsklausuren** gedacht, nicht für benotete Prüfungen:
> Aufgaben und Lösungen werden lokal erzeugt und sind nicht manipulationssicher.

## WLAN-Zugang (Desktop-App)

Läuft Mathsachs auf einem Rechner, können Tablets im **selben WLAN** die App im
Browser öffnen — ohne eigene Installation.

1. Mathsachs auf dem Windows-, macOS- oder Linux-Rechner starten und geöffnet
   lassen.
2. Unter **Einstellungen → WLAN-Zugang** Adresse und QR-Code ansehen.
3. Auf dem Tablet die Adresse öffnen oder den QR-Code scannen.

Benutzer und Punkte liegen auf dem PC: Tablets sehen dieselbe Benutzerliste und
denselben Stand. In vielen Schul- oder Gast-WLANs trennt Client-Isolation die
Geräte — dann funktioniert der Zugang nicht.

## Klassencode (online)

Ohne Nutzerkonten: Zugang zur Klassenstatistik ist der **Besitz des Codes**.
Online liegen nur **Klassenname** und **aggregierte Punkte** — keine Vornamen,
keine Geräte-IDs. **Behandle den Code wie ein Passwort.**

Unter **Einstellungen → Klasse**:

1. **Code erstellen** (Eltern oder Lehrer) oder bestehenden Code **eintragen**
   und aktivieren.
2. Optional **Punkte an Klasse senden** (Opt-in).
3. **Klassenstufe** (nur Lehrer): Stufencode erzeugen oder eintragen, Klassen
   zuordnen und den **Stufen-Wettbewerb** sehen (Klassennamen und Summen, keine
   Personendaten). Mit eingetragenem Stufencode kannst du Übungsklausuren auch
   den Klassen dieser Stufe zuordnen.

## Idee / Feedback

Über **Idee / Feedback** in der App oder per Mail:

[Idee / Feedback zum Mathsachs Übungsprogramm.](mailto:info@my-smart-home-support.de?subject=Idee%20%2F%20Feedback%20zum%20Mathsachs%20%C3%9Cbungsprogramm.)

## Lizenz

Mathsachs steht unter der [MIT-Lizenz](LICENSE).
Copyright © 2026 Linus und Matthias Ulrich.

## Impressum

Linus und Matthias Ulrich  
Große Wallstraße 42  
04509 Delitzsch  
[info@my-smart-home-support.de](mailto:info@my-smart-home-support.de)

In der App ebenfalls unter **Impressum** und **Datenschutz**.
