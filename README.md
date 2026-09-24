# TaskTrophy

**Das Klassen-Duell** â€” lehrplanorientiertes Ãœbungsprogramm fÃ¼r Mathematik und
Physik an sÃ¤chsischen Schulen. SchÃ¼lerinnen und SchÃ¼ler wÃ¤hlen Themen aus dem
Lehrplan, Ã¼ben am Bildschirm oder drucken ÃœbungsblÃ¤tter. LehrkrÃ¤fte stellen
**Ãœbungsklausuren** zusammen und verteilen sie per Code oder Link.

Aktuelle Version: **0.28.43** Â· [Changelog](CHANGELOG.md) Â·
Web: [app.tasktrophy.de](https://app.tasktrophy.de/) Â·
[Alle Releases](https://github.com/MatthiasUlrich1/Mathsachs/releases)

## Web-App (Browser)

Ohne Installation im Browser:
**https://app.tasktrophy.de/**

Benutzer, Punkte und Einstellungen liegen im **Browser-localStorage** dieses
GerÃ¤ts (pro Domain getrennt). Unter **Einstellungen â†’ Benutzerverwaltung** kannst du Daten als
JSON **exportieren** und auf einem anderen GerÃ¤t **importieren**.

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
â€žWindows hat den PC geschÃ¼tztâ€œ. Das ist erwartbar und kein Virenfund.

1. Den Installer **nur** von den offiziellen GitHub-Releases laden.
2. Bei der Warnung **â€žWeitere Informationenâ€œ** wÃ¤hlen.
3. Dann **â€žTrotzdem ausfÃ¼hrenâ€œ** (manchmal **â€žTrotzdem installierenâ€œ**).

Unter **Einstellungen â†’ Auf Updates prÃ¼fen** meldet die App, wenn eine neuere
Version bereitsteht.

## LehrplÃ¤ne

Unter **Einstellungen â†’ LehrplÃ¤ne** installierst, aktualisierst oder entfernst
du Pakete. Danach blendest du die gewÃ¼nschten Klassenstufen ein.

Aktuell verfÃ¼gbar:

| Paket | Inhalt |
| --- | --- |
| **Gymnasium Sachsen Â· Mathematik** | Klasse 5â€“10 und Jahrgangsstufe 11/12 (Grundkurs) |
| **Gymnasium Sachsen Â· Physik** | Klasse 6â€“10 und Jahrgangsstufe 11/12 (Grundkurs und Leistungskurs) |
| **Oberschule Sachsen Â· Mathematik Â· Hauptschulbildungsgang** | Klassen 5â€“9 |
| **Oberschule Sachsen Â· Mathematik Â· Realschulbildungsgang** | Klassen 5â€“10 |

Die Lernbereiche und Themen folgen den sÃ¤chsischen LehrplÃ¤nen. Aufgaben werden
zufÃ¤llig erzeugt und haben stets eindeutige, Ã¼berprÃ¼fbare LÃ¶sungen. ErgÃ¤nzungen
von LehrkrÃ¤ften erscheinen mit dem Badge **Lehrer-ErgÃ¤nzung**.

## Funktionen

### Ãœben und ErklÃ¤ren

- **Themen auswÃ¤hlen** und **direkt Ã¼ben** â€” Auswertung sofort nach der Antwort.
- **ErklÃ¤rung anzeigen** bei falschen Aufgaben: Schritt-fÃ¼r-Schritt-LÃ¶sungsweg.
- **Themen-Suche** Ã¼ber die geladenen Klassen (auch umlaut-tolerant, z. B.
  â€žFlÃ¤cheâ€œ â†” â€žflaecheâ€œ).
- **Einheiten umrechnen** (LÃ¤nge, FlÃ¤cheninhalt, Volumen, Masse, Zeit) mit
  eindeutiger LÃ¶sung und ErklÃ¤rung des Umrechnungsfaktors.
- **ÃœbungsblÃ¤tter drucken** (oder als PDF speichern) inklusive LÃ¶sungsteil.
- In Physik und Mathematik gibt es je nach Thema auch **interaktive Aufgaben**
  (z. B. Schieberegler, Sortieren, Anklicken in einer Abbildung).

### Mehrere Benutzer und Rollen

Punkte werden **pro Name** gespeichert. Unter **Einstellungen â†’ Profil** kannst
du Benutzer wechseln und die Rolle wÃ¤hlen: **SchÃ¼ler**, **Eltern**,
**Klassenlehrer** oder **Lehrer**.

Wechsel in **Lehrer** oder **Klassenlehrer** nur mit dem gemeinsamen
**Lehrercode** (ein Code fÃ¼r die Schule). Fehlt der Code, kannst du ihn in der
App anfordern â€” die Anfrage geht per E-Mail an uns.

KurzÃ¼berblick der Rechte:

| | SchÃ¼ler | Eltern | Klassenlehrer | Lehrer |
| --- | --- | --- | --- | --- |
| Themen Ã¼ben | âœ“ | âœ“ | âœ“ | âœ“ |
| Klausur schreiben | âœ“ | âœ“ | â€” | âœ“ |
| Klausur erstellen | â€” | âœ“ | â€” | âœ“ |
| Klassencode erstellen | â€” | âœ“ | â€” | âœ“ |
| Klassencode eintragen | âœ“ | âœ“ | âœ“ | âœ“ |
| Stufencode / Stufenchallenge | â€” | â€” | â€” | âœ“ |
| Klassenchallenge anlegen | â€” | â€” | âœ“ | âœ“ |
| Aufgaben ergÃ¤nzen | â€” | â€” | â€” | âœ“ |

Die vollstÃ¤ndige Rechte-Matrix steht in der App unter **Einstellungen â†’ Profil**.

### Challenge

Lehrer legen eine **Klassen-** oder **Stufenchallenge** an (Themen, Zeitraum,
optionaler Gewinn). Klassenlehrer nur Klassenchallenge. SchÃ¼ler Ã¼ben die
Challenge-Themen; Punkte zÃ¤hlen fÃ¼r Klasse/Stufe **und** extra fÃ¼r die
Challenge. Online liegen nur anonyme Summen â€” keine SchÃ¼lernamen.

### Punkteprotokoll

Auswertung je Thema in Prozent und Gesamtpunktzahl, plus Tag / Woche / Monat /
Schuljahr â€” aus lokalen Ãœbungen und an die Klasse gesendeten Punkten; ebenfalls
druckbar.

### Aufgaben ergÃ¤nzen

Nur **Lehrer** kÃ¶nnen unter **Einstellungen â†’ Aufgaben ergÃ¤nzen** Vorgaben fÃ¼r
neue Ãœbungsaufgaben senden (Klassenstufe, Themengebiet, Titel, Beispiel). Die
Angaben gehen per E-Mail an uns.

## Ãœbungsklausur per Code

LehrkrÃ¤fte stellen eine Ãœbungsklausur aus konkreten Aufgaben des Lehrplans
zusammen. Die App erzeugt einen **Klausurcode** (beginnt mit `MSX1:`). Den Code
kannst du kopieren oder per E-Mail bzw. WhatsApp versenden. Es wird kein Server
benÃ¶tigt: Der Code enthÃ¤lt Verweise auf Thema und Zufalls-Seed â€” auf jedem GerÃ¤t
entstehen dieselben Aufgaben.

### Als Lehrkraft: Klausur erstellen

1. Unter **Einstellungen â†’ LehrplÃ¤ne** den Lehrplan installieren und die
   gewÃ¼nschten Klassen einblenden.
2. Reiter **Klausur erstellen** Ã¶ffnen.
3. Themen vorauswÃ¤hlen, konkrete Aufgaben auswÃ¤hlen (fÃ¼nf VorschlÃ¤ge je Thema,
   Punkte anpassbar), Titel vergeben.
4. Optional einer **Klasse zuordnen** (eigener Klassencode oder Klasse einer
   eingetragenen **Stufe** â€” nur Codes/IDs, keine Personendaten).
5. Klausurcode kopieren oder per WhatsApp / Mail teilen.

### Als SchÃ¼lerin oder SchÃ¼ler: Klausur schreiben

1. Mit dem eigenen Namen anmelden.
2. Reiter **Klausur schreiben** wÃ¤hlen und den Code einfÃ¼gen.
3. Aufgaben bearbeiten und abgeben.
4. Auswertung zeigt Antwort, richtige LÃ¶sung und ErklÃ¤rung. Ãœber **Ã„hnliche
   Aufgabe Ã¼ben** geht es mit neuen Zahlen weiter.

> Der Code ist fÃ¼r **Ãœbungsklausuren** gedacht, nicht fÃ¼r benotete PrÃ¼fungen:
> Aufgaben und LÃ¶sungen werden lokal erzeugt und sind nicht manipulationssicher.

## WLAN-Zugang (Desktop-App)

LÃ¤uft TaskTrophy auf einem Rechner, kÃ¶nnen Tablets im **selben WLAN** die App im
Browser Ã¶ffnen â€” ohne eigene Installation.

1. TaskTrophy auf dem Windows-, macOS- oder Linux-Rechner starten und geÃ¶ffnet
   lassen.
2. Unter **Einstellungen â†’ WLAN-Zugang** Adresse und QR-Code ansehen.
3. Auf dem Tablet die Adresse Ã¶ffnen oder den QR-Code scannen.

Benutzer und Punkte liegen auf dem PC: Tablets sehen dieselbe Benutzerliste und
denselben Stand. In vielen Schul- oder Gast-WLANs trennt Client-Isolation die
GerÃ¤te â€” dann funktioniert der Zugang nicht.

## Klassencode (online)

Ohne Nutzerkonten: Zugang zur Klassenstatistik ist der **Besitz des Codes**.
Online liegen nur **Klassenname** und **aggregierte Punkte** â€” keine Vornamen,
keine GerÃ¤te-IDs. **Behandle den Code wie ein Passwort.**

Unter **Einstellungen â†’ Klasse**:

1. **Code erstellen** (Eltern oder Lehrer) oder bestehenden Code **eintragen**
   und aktivieren.
2. Optional **Punkte an Klasse senden** (Opt-in).
3. **Klassenstufe** (nur Lehrer): Stufencode erzeugen oder eintragen, Klassen
   zuordnen und den **Stufen-Wettbewerb** sehen (Klassennamen und Summen, keine
   Personendaten). Mit eingetragenem Stufencode kannst du Ãœbungsklausuren auch
   den Klassen dieser Stufe zuordnen.

## Idee / Feedback

Ãœber **Idee / Feedback** in der App oder per Mail:

[Idee / Feedback zum TaskTrophy Ãœbungsprogramm.](mailto:info@my-smart-home-support.de?subject=Idee%20%2F%20Feedback%20zum%20TaskTrophy%20%C3%9Cbungsprogramm.)

## Lizenz

TaskTrophy steht unter der [MIT-Lizenz](LICENSE).
Copyright Â© 2026 Linus und Matthias Ulrich.

## Impressum

Linus und Matthias Ulrich  
GroÃŸe WallstraÃŸe 42  
04509 Delitzsch  
[info@my-smart-home-support.de](mailto:info@my-smart-home-support.de)

In der App ebenfalls unter **Impressum** und **Datenschutz**.
