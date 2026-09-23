import type { MouseEvent, ReactNode } from 'react'

/** Einstellungen → Über die App: Nutzerhandbuch (ohne Entwickler-Funktionen). */
const GUIDE_TOC = [
  { id: 'guide-start', title: 'Erste Schritte' },
  { id: 'guide-lehrplaene', title: 'Lehrpläne' },
  { id: 'guide-themen', title: 'Themen üben' },
  { id: 'guide-challenge', title: 'Challenge' },
  { id: 'guide-klausur', title: 'Übungsklausuren' },
  { id: 'guide-protokoll', title: 'Punkteprotokoll' },
  { id: 'guide-klasse', title: 'Klasse und Codes' },
  { id: 'guide-einstellungen', title: 'Einstellungen' },
  { id: 'guide-wlan', title: 'WLAN-Zugang (Desktop)' },
  { id: 'guide-updates', title: 'Updates' },
  { id: 'guide-homescreen', title: 'Zum Startbildschirm' },
  { id: 'guide-feedback', title: 'Feedback und Rechtliches' },
] as const

function scrollToGuideSection(event: MouseEvent<HTMLAnchorElement>, id: string) {
  event.preventDefault()
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function GuideHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h3 id={id} className="user-guide__heading">
      {children}
    </h3>
  )
}

export function AboutApp() {
  return (
    <section className="card user-guide" aria-label="Über die App">
      <div className="session__head">
        <div>
          <h2 className="section-title no-margin">Über die App</h2>
          <p className="muted small">
            Kurzanleitung zu TaskTrophy — dem Klassen-Duell. Alles, was du zum
            Üben, zu Klassen und Challenges brauchst.
          </p>
        </div>
      </div>

      <nav className="user-guide__toc" aria-label="Inhaltsverzeichnis">
        <p className="user-guide__toc-title">Inhaltsverzeichnis</p>
        <ol className="user-guide__toc-list">
          {GUIDE_TOC.map((item) => (
            <li key={item.id}>
              <a
                className="link user-guide__toc-link"
                href={`#${item.id}`}
                onClick={(event) => scrollToGuideSection(event, item.id)}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="user-guide__body">
        <GuideHeading id="guide-start">Erste Schritte</GuideHeading>
        <p>
          Beim Start wählst du, <strong>wer heute übt</strong>. Punkte und
          Fortschritt gehören zum <strong>Benutzernamen</strong> auf diesem
          Gerät — es gibt keine Online-Konten mit Passwort.
        </p>
        <ul className="user-guide__list">
          <li>
            Unter <strong>Einstellungen → Profil</strong> wechselst du die
            Rolle: Schüler, Eltern, Klassenlehrer oder Lehrer.
          </li>
          <li>
            Lehrer und Klassenlehrer brauchen den gemeinsamen{' '}
            <strong>Lehrercode</strong> der Schule. Fehlt er, kannst du ihn in
            der App per E-Mail anfordern.
          </li>
          <li>
            Die genaue Rechte-Übersicht steht in der Tabelle unter Profil.
          </li>
        </ul>

        <GuideHeading id="guide-lehrplaene">Lehrpläne</GuideHeading>
        <p>
          Unter <strong>Einstellungen → Lehrpläne</strong> installierst,
          aktualisierst oder entfernst du Pakete. Nach der Installation
          erscheinen die Themen unter dem Reiter <strong>Themen</strong>.
        </p>
        <p className="muted small">Aktuell verfügbare Pakete (Auswahl):</p>
        <ul className="user-guide__list">
          <li>Gymnasium Sachsen · Mathematik, Physik, Geschichte</li>
          <li>Oberschule Sachsen · Mathematik (Haupt- und Realschulbildungsgang)</li>
          <li>Gymnasium Sachsen-Anhalt · Mathematik</li>
          <li>
            Sekundarschule Sachsen-Anhalt · Mathematik (Haupt- und
            Realschulabschluss)
          </li>
        </ul>
        <p>
          Manche Themen sind noch gesperrt und werden nach und nach freigegeben.
          Lehrer können unter Profil die bevorzugten <strong>Fächer</strong>{' '}
          festlegen — Themen und Klausuren zeigen dann nur diese Fächer.
        </p>

        <GuideHeading id="guide-themen">Themen üben</GuideHeading>
        <p>
          Im Reiter <strong>Themen</strong> wählst du Klasse, Lernbereich und
          Thema. Du kannst am Bildschirm üben oder ein Übungsblatt drucken
          (bzw. als PDF speichern).
        </p>
        <ul className="user-guide__list">
          <li>Antworten werden sofort ausgewertet; bei Fehlern gibt es eine Erklärung.</li>
          <li>Die Suche findet Themen auch mit Umlauten (z.&nbsp;B. „Fläche“ / „Flaeche“).</li>
          <li>
            Manche Aufgaben sind interaktiv (Schieberegler, Sortieren, Anklicken
            in einer Abbildung).
          </li>
          <li>
            Wirkt eine Aufgabe falsch, kannst du sie melden. Deine Meldungen
            findest du unter <strong>Einstellungen → Meine Meldungen</strong>.
          </li>
        </ul>

        <GuideHeading id="guide-challenge">Challenge</GuideHeading>
        <p>
          Im Reiter <strong>Challenge</strong> siehst du laufende Klassen- oder
          Stufen-Challenges. Schüler üben die Challenge-Themen; Punkte zählen
          für Klasse bzw. Stufe und extra für die Challenge.
        </p>
        <ul className="user-guide__list">
          <li>
            <strong>Klassenlehrer</strong> und <strong>Lehrer</strong> legen
            Klassenchallenges an (Themen, Zeitraum, optionaler Gewinn).
          </li>
          <li>
            <strong>Lehrer</strong> können zusätzlich Stufenchallenges anlegen.
          </li>
          <li>
            Online liegen nur anonyme Punktesummen — keine Schülernamen.
          </li>
        </ul>

        <GuideHeading id="guide-klausur">Übungsklausuren</GuideHeading>
        <p>
          Lehrkräfte stellen Übungsklausuren aus konkreten Aufgaben zusammen.
          Der <strong>Klausurcode</strong> (beginnt mit <code>MSX1:</code>)
          enthält Thema und Zufalls-Seed — auf jedem Gerät entstehen dieselben
          Aufgaben, ohne Server.
        </p>
        <p>
          <strong>Klausur erstellen</strong> (Eltern und Lehrer): Themen und
          Aufgaben wählen, Punkte anpassen, optional einer Klasse zuordnen,
          Code teilen.
        </p>
        <p>
          <strong>Klausur schreiben</strong> (Schüler, Eltern, Lehrer): Code
          einfügen, Aufgaben bearbeiten, abgeben. Danach Auswertung und
          „Ähnliche Aufgabe üben“.
        </p>
        <p className="muted small">
          Klassenlehrer sehen die Klausur-Reiter nicht. Der Code ist für
          Übungsklausuren gedacht, nicht für benotete Prüfungen.
        </p>

        <GuideHeading id="guide-protokoll">Punkteprotokoll</GuideHeading>
        <p>
          Das <strong>Punkteprotokoll</strong> zeigt Auswertung je Thema
          (Prozent und Punkte) sowie Zeiträume Tag / Woche / Monat / Schuljahr —
          aus lokalen Übungen und an die Klasse gesendeten Punkten. Auch
          druckbar.
        </p>

        <GuideHeading id="guide-klasse">Klasse und Codes</GuideHeading>
        <p>
          Unter <strong>Einstellungen → Klasse</strong> arbeitest du mit
          Klassencodes. Der Code ist wie ein Passwort: Wer ihn kennt, gehört zur
          Klassenstatistik. Online liegen nur Klassenname und aggregierte
          Punkte — keine Vornamen.
        </p>
        <ul className="user-guide__list">
          <li>
            Code <strong>erstellen</strong> (Eltern oder Lehrer) oder
            bestehenden Code <strong>eintragen</strong> und aktivieren.
          </li>
          <li>
            Optional <strong>Punkte an Klasse senden</strong> (Opt-in).
          </li>
          <li>
            <strong>Klassenstufe</strong> (nur Lehrer): Stufencode erzeugen oder
            eintragen, Klassen zuordnen, Stufen-Wettbewerb sehen.
          </li>
        </ul>

        <GuideHeading id="guide-einstellungen">Einstellungen</GuideHeading>
        <p>Weitere Bereiche in den Einstellungen:</p>
        <ul className="user-guide__list">
          <li>
            <strong>Profil</strong> — Rolle, Lehrercode, Benutzer wechseln,
            umbenennen oder löschen; Übungsdaten als JSON exportieren/importieren.
          </li>
          <li>
            <strong>Aufgaben ergänzen</strong> (nur Lehrer) — Vorgaben für neue
            Übungsaufgaben per E-Mail senden.
          </li>
          <li>
            <strong>Meine Meldungen</strong> — Status deiner gemeldeten
            Aufgaben.
          </li>
          <li>
            <strong>Unterstützer</strong> — Organisationen, die TaskTrophy
            unterstützen.
          </li>
        </ul>

        <GuideHeading id="guide-wlan">WLAN-Zugang (Desktop)</GuideHeading>
        <p>
          Läuft TaskTrophy als <strong>Desktop-App</strong> auf einem Rechner,
          können Tablets im selben WLAN die App im Browser öffnen — ohne eigene
          Installation.
        </p>
        <ol className="user-guide__list user-guide__list--numbered">
          <li>Desktop-App starten und geöffnet lassen.</li>
          <li>
            Unter <strong>Einstellungen → WLAN-Zugang</strong> Adresse und
            QR-Code ansehen.
          </li>
          <li>Auf dem Tablet Adresse öffnen oder QR-Code scannen.</li>
        </ol>
        <p className="muted small">
          Benutzer und Punkte liegen auf dem PC. In manchen Schul-WLANs
          verhindert Client-Isolation den Zugang.
        </p>

        <GuideHeading id="guide-updates">Updates</GuideHeading>
        <p>
          Auf der Einstellungs-Übersicht prüfst du mit{' '}
          <strong>Auf Updates prüfen</strong>, ob eine neuere Version bereitsteht.
          Die Desktop-App kann Updates herunterladen und installieren; in der
          Web-App erscheint ein Hinweis zur neuen Version.
        </p>

        <GuideHeading id="guide-homescreen">Zum Startbildschirm</GuideHeading>
        <p>
          Die Web-App unter{' '}
          <a
            className="link"
            href="https://app.tasktrophy.de/"
            target="_blank"
            rel="noopener noreferrer"
          >
            app.tasktrophy.de
          </a>{' '}
          kannst du wie eine App auf dem Startbildschirm ablegen.
        </p>

        <h4 className="user-guide__subheading">Android (Chrome o.&nbsp;Ä.)</h4>
        <ol className="user-guide__list user-guide__list--numbered">
          <li>
            Öffne <strong>https://app.tasktrophy.de/</strong> im Browser
            (z.&nbsp;B. Chrome).
          </li>
          <li>Tippe auf das Menü (drei Punkte oben oder unten).</li>
          <li>
            Wähle <strong>App installieren</strong> oder{' '}
            <strong>Zum Startbildschirm hinzufügen</strong> /{' '}
            <strong>Zum Homescreen</strong>.
          </li>
          <li>Bestätige die Installation. Das Icon erscheint auf dem Startbildschirm.</li>
        </ol>

        <h4 className="user-guide__subheading">iPhone und iPad (Safari)</h4>
        <ol className="user-guide__list user-guide__list--numbered">
          <li>
            Öffne <strong>https://app.tasktrophy.de/</strong> in{' '}
            <strong>Safari</strong> (empfohlen).
          </li>
          <li>
            Tippe auf <strong>Teilen</strong> (Quadrat mit Pfeil nach oben).
          </li>
          <li>
            Scrolle zu <strong>Zum Home-Bildschirm</strong> (manchmal unter
            „Bearbeiten von Aktionen…“).
          </li>
          <li>
            Namen prüfen und mit <strong>Hinzufügen</strong> bestätigen.
          </li>
        </ol>
        <p className="muted small">
          Ab neueren iOS-Versionen geht das oft auch in anderen Browsern über
          deren Teilen-Menü. Daten bleiben im Browser dieses Geräts — für einen
          Wechsel zwischen Geräten nutze Export/Import unter Profil.
        </p>

        <GuideHeading id="guide-feedback">Feedback und Rechtliches</GuideHeading>
        <p>
          Im Fuß der App findest du <strong>Impressum</strong>,{' '}
          <strong>Lizenz</strong>, <strong>Datenschutz</strong> und{' '}
          <strong>Idee / Feedback</strong>. Ideen und Rückmeldungen gehen per
          E-Mail an uns — ohne Nutzerkonto.
        </p>
      </div>
    </section>
  )
}
