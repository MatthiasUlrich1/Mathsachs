# -*- coding: utf-8 -*-
"""
Themenreine Schulstoff-Banken für Geschichte-Gym-Topics ohne Qualitätsbank.
Inspiration (eigene Formulierungen, keine wörtlichen Übernahmen):
  Google: „[Thema] [Klasse] Gymnasium Sachsen Aufgaben“ / Arbeitsblatt / Übungen
  Schlaukopf Gym Geschichte; Lehrplan Sachsen lplanid=65
  typische Arbeitsblatt-Muster: Chronologie, Personen, Ursachen/Folgen, Quellen
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src/curriculum/geschichteSchulstoffDense.ts"
WEAK = json.loads((ROOT / "tmp/ge-weak-topics.txt").read_text(encoding="utf-8"))["ids"]

# (term, meaning, wissen_extra) — konkrete Schulstoff-Zeilen
POOLS: dict[str, list[tuple[str, str, str]]] = {
    "regional-sachsen": [
        ("Ostsiedlung", "mittelalterliche Besiedlung östlich der Elbe", "Bauern, Klöster und Stadtrechte prägten Sachsen."),
        ("Mark Meißen", "Kernlandschaft der sächsischen Herrschaft", "Ausgangspunkt späterer Kurfürstenmacht."),
        ("Stadtrecht", "rechtliche Selbstverwaltung einer Stadt", "Markt, Gericht und Mauern gehörten dazu."),
        ("Kurfürstentum", "Rang mit Kaiserwahlrecht", "Sachsen wurde 1423 kurfürstlich."),
        ("Lehnswesen", "Treue gegen Landleihe", "Grundlage mittelalterlicher Herrschaft."),
        ("Grundherrschaft", "Herrschaft über Bauern und Land", "Abgaben und Frondienste."),
        ("Zunft", "Organisation der Handwerker", "Qualität und Ausbildung regelten sie."),
        ("Kloster", "geistliche Gemeinschaft mit Wirtschaft", "Schriftkultur und Mission."),
        ("Burg", "Wehr- und Herrschaftssitz", "Symbol adeliger Macht."),
        ("Hanse", "Städtebund für Handel", "Ostsee- und Nordseehandel."),
        ("Urkunde", "schriftlicher Rechtsbeleg", "Herrschaft brauchte Schriftlichkeit."),
        ("Landesausbau", "Rodung und neue Dörfer", "Bevölkerung und Agrarfläche wuchsen."),
    ],
    "humanismus": [
        ("Humanismus", "Bildungsbewegung mit Antike als Vorbild", "Mensch und Bildung rückten ins Zentrum."),
        ("Renaissance", "kulturelle Erneuerung in Kunst und Wissenschaft", "Italien war ein Zentrum."),
        ("Buchdruck", "Druck mit beweglichen Lettern", "Ideen verbreiteten sich schneller."),
        ("Erasmus", "berühmter Humanist", "Kritik an Missständen der Kirche."),
        ("Vernunft", "menschliches Denkvermögen als Maßstab", "Wichtiger Leitbegriff der Epoche."),
        ("Bildung", "Kenntnisse und Urteilsfähigkeit", "Gymnasien und Universitäten wuchsen."),
        ("Antike", "griechisch-römische Vorbildkultur", "Texte wurden neu gelesen."),
        ("Individualität", "Betonung des einzelnen Menschen", "Porträtkunst und Biografien."),
        ("Kritik", "Prüfung überlieferter Lehren", "Voraussetzung für Reformation."),
        ("Latein", "Gelehrtensprache Europas", "Ermöglichte internationalen Austausch."),
        ("Universitas", "höhere Bildungseinrichtung", "Ort humanistischer Studien."),
        ("Weltbild", "Vorstellung von Mensch und Kosmos", "Veränderte sich in der Frühen Neuzeit."),
    ],
    "absolutismus-macht": [
        ("Absolutismus", "Herrschaft ohne ständische Machtteilung", "König beanspruchte alleinige Souveränität."),
        ("Ludwig XIV.", "französischer „Sonnenkönig“", "Versailles als Herrschaftszentrum."),
        ("Stehendes Heer", "dauerhaft unterhaltene Truppe", "Machtstütze absolutistischer Fürsten."),
        ("Beamtentum", "staatliche Verwaltung durch Beamte", "Ersetzte ständische Selbstverwaltung."),
        ("Merkantilismus", "staatliche Wirtschaftslenkung", "Export und Edelmetall im Fokus."),
        ("Hof", "Zentrum von Macht und Repräsentation", "Zeremoniell sicherte Rangordnung."),
        ("Gottesgnadentum", "Herrschaft als göttlicher Auftrag", "Kritik der Aufklärung setzte hier an."),
        ("Steuern", "staatliche Abgaben der Untertanen", "Finanzierung von Heer und Hof."),
        ("Zentralisierung", "Machtbündelung in der Hauptstadt", "Provinzen wurden stärker kontrolliert."),
        ("Adel", "privilegierte Oberschicht am Hof", "Oft abhängig von königlicher Gunst."),
        ("Intendanz", "königliche Aufsicht in den Provinzen", "Frankreich als Musterbeispiel."),
        ("Repräsentation", "sichtbare Darstellung von Macht", "Schlösser, Feste, Etikette."),
    ],
    "usa-revolution": [
        ("Unabhängigkeitserklärung", "1776 Absage an die britische Krone", "Rechte auf Leben, Freiheit, Glück."),
        ("Gewaltenteilung", "Legislative, Exekutive, Judikative", "Idee Montesquieus in der US-Verfassung."),
        ("Verfassung USA", "Grundordnung der Vereinigten Staaten", "Mit Bill of Rights ergänzt."),
        ("Boston Tea Party", "Protest gegen britische Steuerpolitik", "Symbol kolonialen Widerstands."),
        ("George Washington", "Oberbefehlshaber und erster Präsident", "Führungsfigur der Revolution."),
        ("Kolonien", "britische Siedlungen in Nordamerika", "Forderten Mitbestimmung und Rechte."),
        ("No taxation without representation", "keine Steuer ohne Vertretung", "Kernforderung der Kolonisten."),
        ("Checks and Balances", "gegenseitige Kontrolle der Gewalten", "Verhindert Machtkonzentration."),
        ("Bürgerrechte", "grundlegende Freiheiten der Bürger", "Schutz vor staatlicher Willkür."),
        ("Republik", "Herrschaft ohne erblichen Monarchen", "Volkssouveränität als Prinzip."),
        ("Föderalismus", "Teilung zwischen Bund und Staaten", "Kompromiss großer und kleiner Staaten."),
        ("Aufklärung", "Ideenfreiheit und Vernunft", "Intellektueller Hintergrund der Revolution."),
    ],
    "reichseinigung": [
        ("Reichseinigung", "deutsche Nationalstaatsbildung 1864–1871", "Unter preußischer Führung."),
        ("Otto von Bismarck", "preußischer Ministerpräsident", "„Blut und Eisen“-Politik."),
        ("Deutsch-Französischer Krieg", "1870/71 Krieg gegen Frankreich", "Führte zur Kaiserproklamation."),
        ("Kaiserproklamation", "1871 in Versailles", "Wilhelm I. wurde Deutscher Kaiser."),
        ("Kleindeutsche Lösung", "Einigung ohne Österreich", "Preußen dominierte."),
        ("Zollverein", "wirtschaftliche Vorstufe der Einigung", "Abbau von Binnenzöllen."),
        ("Nationalismus", "Idee der Nation als politische Einheit", "Triebkraft des 19. Jahrhunderts."),
        ("Frankfurter Nationalversammlung", "1848/49 in der Paulskirche", "Versuch einer Verfassungseinheit."),
        ("Realpolitik", "Machtpolitik statt Idealismus", "Bismarcks Methode."),
        ("Bundesstaat", "Staatenbund mit zentraler Gewalt", "Deutsches Kaiserreich als Bundesstaat."),
        ("Militär", "entscheidendes Machtmittel Preußens", "Siege gegen Dänemark, Österreich, Frankreich."),
        ("Nationalliberale", "Unterstützer der Einigung von oben", "Freiheit und Einheit in Spannung."),
    ],
    "reichsfeinde": [
        ("Kulturkampf", "Konflikt Staat–katholische Kirche", "Bismarck gegen Zentrumspartei."),
        ("Sozialistengesetz", "Repression gegen Sozialdemokratie", "1878–1890 Verbot von Vereinen."),
        ("Reichsfeinde", "von Bismarck bekämpfte Gruppen", "Katholiken und Sozialisten."),
        ("Zentrumspartei", "politische Vertretung der Katholiken", "Gegner im Kulturkampf."),
        ("Sozialdemokratie", "Arbeiterpartei im Kaiserreich", "Trotz Verbot wachsender Einfluss."),
        ("Pressezensur", "Einschränkung freier Meinungsäußerung", "Mittel autoritärer Politik."),
        ("Ausnahmegesetz", "Sonderrecht gegen Opposition", "Kennzeichen illiberaler Herrschaft."),
        ("Innenpolitik", "Politik innerhalb des Reiches", "Nach 1871 Fokus auf Integration."),
        ("Integration", "Einbindung widerständiger Gruppen", "Scheiterte teilweise am Zwang."),
        ("Parlamentswahl", "Wahl zum Reichstag", "Sozialdemokraten trotz Verbot stark."),
        ("Kirchenpolitik", "staatliche Regelung religiöser Fragen", "Kern des Kulturkampfs."),
        ("Autoritäres Regime", "eingeschränkte politische Freiheit", "Kaiserreich war kein voller Parlamentarismus."),
    ],
    "soziale-frage": [
        ("Soziale Frage", "Lage der Industriearbeiter", "Armut, Wohnungsnot, lange Arbeitszeiten."),
        ("Arbeiterbewegung", "Organisation der Lohnabhängigen", "Gewerkschaften und Parteien."),
        ("Gewerkschaft", "Interessenvertretung der Arbeiter", "Streik als Druckmittel."),
        ("Pauperismus", "Massenarmut im 19. Jahrhundert", "Folge frühen Industriekapitalismus."),
        ("Fabrikordnung", "Regeln in der Fabrik", "Disziplin und Kontrolle der Arbeit."),
        ("Kinderarbeit", "Erwerbsarbeit von Kindern", "Später durch Gesetze eingeschränkt."),
        ("Sozialgesetzgebung", "staatliche Absicherung", "Bismarcks Kranken- und Rentenversicherung."),
        ("Urbanisierung", "Wachstum der Städte", "Land-Stadt-Wanderung."),
        ("Wohnungsnot", "Mangel an menschenwürdigem Wohnraum", "Mietskasernen und Schlafgänger."),
        ("Klassengesellschaft", "Schichtung nach Besitz und Arbeit", "Bourgeoisie und Proletariat."),
        ("Streik", "Arbeitsniederlegung", "Mittel zur Lohn- und Zeitverbesserung."),
        ("Armenfürsorge", "Hilfen für Bedürftige", "Oft unzureichend und stigmatisierend."),
    ],
    "wettruesten": [
        ("Wettrüsten", "militärische Aufrüstung der Großmächte", "Vor 1914 Spannungen verschärft."),
        ("Flottenbau", "Ausbau der Kriegsmarine", "Deutsch-britischer Gegensatz."),
        ("Bündnissystem", "militärische Allianzen", "Entente und Mittelmächte."),
        ("Imperialismus", "globale Machtausdehnung", "Kolonien und Einflusszonen."),
        ("Nationalismus", "Überhöhung der eigenen Nation", "Feindbilder gegenüber Nachbarn."),
        ("Militarismus", "hohe Wertschätzung des Militärischen", "Gesellschaftlich und politisch."),
        ("Julikrise", "1914 Eskalation nach Sarajevo", "Weg in den Weltkrieg."),
        ("Schlieffenplan", "deutscher Angriffsplan im Westen", "Rechnete mit schnellem Sieg."),
        ("Rüstungswettlauf", "gegenseitige Steigerung der Waffen", "Sicherheitsdilemma."),
        ("Großmacht", "staat mit globalem Einflussanspruch", "Europa vor 1914 multipolar."),
        ("Allianz", "vertragliches Militärbündnis", "Automatismen der Bündnistreue."),
        ("Kriegsschuldfrage", "Debatte um Verantwortung für 1914", "Versailles belastete Deutschland."),
    ],
    "industrie-alltag": [
        ("Fabrik", "Ort maschineller Massenproduktion", "Takt und Schichtarbeit."),
        ("Dampfmaschine", "Antrieb der Industriellen Revolution", "Kohle als Energieträger."),
        ("Eisenbahn", "schneller Güter- und Personenverkehr", "Vernetzte Märkte und Regionen."),
        ("Arbeitsteilung", "Zerlegung der Arbeit in Teilschritte", "Höhere Produktivität, eintönige Arbeit."),
        ("Arbeiterfamilie", "Haushalt der Lohnabhängigen", "Oft mehrere Verdiener nötig."),
        ("Sonntagsruhe", "freier Tag als soziale Forderung", "Teil der Arbeiterbewegung."),
        ("Konsum", "Kauf von Waren des Alltags", "Wuchs mit Massenfabrikation."),
        ("Umweltbelastung", "Rauch, Abwasser, Lärm", "Frühe Industriefolgen."),
        ("Schichtarbeit", "Arbeit zu wechselnden Zeiten", "Belastete Gesundheit und Familie."),
        ("Maschinensturm", "Protest gegen Maschinen", "Angst vor Arbeitsplatzverlust."),
        ("Lohnarbeit", "Arbeit gegen Geldlohn", "Abhängigkeit vom Arbeitgeber."),
        ("Stadtviertel", "Arbeiter- und Bürgerquartiere", "Soziale Trennung im Raum."),
    ],
    "migration-industrie": [
        ("Binnenwanderung", "Umzug innerhalb des Landes", "Vom Land in die Industrieregion."),
        ("Ruhrgebiet", "Zentrum der Schwerindustrie", "Magnet für Arbeitskräfte."),
        ("Push-Faktor", "Grund zum Weggehen", "Armut, Landknappheit."),
        ("Pull-Faktor", "Anziehung eines Zielorts", "Arbeitsplätze und Löhne."),
        ("Saisonarbeit", "befristete Wanderarbeit", "Landwirtschaft und Bau."),
        ("Integration", "Eingliederung Zuwandernder", "Sprache, Arbeit, Wohnen."),
        ("Auswanderung", "Dauerhafter Wegzug ins Ausland", "Viele Deutsche nach Amerika."),
        ("Arbeitsmigration", "Wanderung wegen Erwerb", "Kern der Industriezeit."),
        ("Bevölkerungsdruck", "Wachstum ohne genug Ressourcen", "Trieb Migration an."),
        ("Heimatlosigkeit", "Verlust vertrauter Lebenswelt", "Soziale Folge der Wanderung."),
        ("Netzwerk", "Kontakte am Zielort", "Erleichterten Nachzug."),
        ("Urbanisierung", "Verstädterung durch Zuzug", "Städte wuchsen rasch."),
    ],
    "technikfolgen": [
        ("Technischer Fortschritt", "neue Maschinen und Verfahren", "Doppelgesicht: Wohlstand und Risiken."),
        ("Produktivität", "Output pro Arbeitseinheit", "Stieg durch Mechanisierung."),
        ("Umweltfolgen", "Belastung von Luft, Wasser, Boden", "Industriegesellschaftliche Kosten."),
        ("Beschleunigung", "schnellere Abläufe in Verkehr und Arbeit", "Historisch: Tempo der Moderne — nicht Physikformel."),
        ("Kommunikation", "Telegraf und Telefon", "Informationen über Distanz."),
        ("Rüstungstechnik", "militärische Anwendung von Technik", "Im Weltkrieg massenhaft."),
        ("Rationalisierung", "Effizienzsteigerung der Produktion", "Kann Arbeitsplätze ersetzen."),
        ("Energie", "Kohle, später Elektrizität und Öl", "Grundlage der Industrie."),
        ("Patente", "rechtlicher Schutz von Erfindungen", "Anreiz und Machtmittel."),
        ("Ingenieurswesen", "technische Planung und Bau", "Neue Berufsgruppe."),
        ("Alltagstechnik", "Technik im Haushalt und Verkehr", "Veränderte Lebensweisen."),
        ("Risiko", "Nebenfolgen technischer Systeme", "Unfälle, Abhängigkeit, Krieg."),
    ],
    "weimar-aufstieg": [
        ("Weimarer Verfassung", "demokratische Grundordnung 1919", "Reichspräsident mit starker Stellung."),
        ("Artikel 48", "Notverordnungsrecht des Präsidenten", "Später Wegbereiter der Präsidialkabinette."),
        ("Weltwirtschaftskrise", "ab 1929 globale Wirtschaftskrise", "Massenarbeitslosigkeit in Deutschland."),
        ("Präsidialkabinett", "Regierung ohne stabile Mehrheit", "Abhängig vom Reichspräsidenten."),
        ("Ermächtigungsgesetz", "1933 Ausschaltung des Parlaments", "Legalitätsfassade der Diktatur."),
        ("Gleichschaltung", "Unterwerfung von Institutionen", "Parteien, Länder, Verbände."),
        ("NSDAP", "nationalsozialistische Partei", "Nutze Krise und Propaganda."),
        ("Wahlverhalten", "Stimmenverschiebung zu Extremen", "NSDAP profitierte von der Krise."),
        ("Reichstagsbrand", "1933 Vorwand für Ausnahmezustand", "Verhaftungen und Verordnungen."),
        ("Hitler", "ab 1933 Reichskanzler", "Errichtete rasch eine Diktatur."),
        ("Terror", "Gewalt gegen politische Gegner", "SA und Gestapo."),
        ("Propaganda", "gezielte Meinungssteuerung", "Goebbels und Massenmedien."),
    ],
    "ns-alltag-widerstand": [
        ("Volksgemeinschaft", "NS-Ideologie der Zugehörigkeit", "Schloss viele Gruppen aus."),
        ("Holocaust", "systematischer Völkermord an Juden", "Und an weiteren Opfergruppen."),
        ("Konzentrationslager", "Haft- und Vernichtungsstätten", "Instrument des Terrors."),
        ("Widerstand", "Opposition gegen das NS-Regime", "Vom Nonkonformismus bis Attentat."),
        ("Weiße Rose", "studentischer Widerstand", "Flugblätter gegen das Regime."),
        ("20. Juli 1944", "Attentat auf Hitler", "Militärischer Widerstand."),
        ("Judenstern", "Kennzeichnung jüdischer Menschen", "Stufe der Ausgrenzung."),
        ("Nürnberger Gesetze", "1935 rassistische Entrechtung", "Entzug von Bürgerrechten."),
        ("Gestapo", "politische Geheimpolizei", "Überwachung und Verhaftung."),
        ("Hitlerjugend", "NS-Jugendorganisation", "Erziehung zur Ideologie."),
        ("Denunziation", "Anzeige von Nachbarn und Kollegen", "Alltag der Angst."),
        ("Erinnerungskultur", "Gedenken an Opfer und Verbrechen", "Gedenkstätten und Bildung."),
    ],
    "aussen-ns": [
        ("Appeasement", "britisch-französische Nachgiebigkeit", "Vor 1939 gegenüber Hitler."),
        ("Münchner Abkommen", "1938 Abtretung des Sudetenlands", "Kurzer Friede ohne Sicherheit."),
        ("Überfall auf Polen", "1. September 1939", "Beginn des Zweiten Weltkriegs in Europa."),
        ("Expansionspolitik", "gewaltsame Ausdehnung des Reichs", "Lebensraum-Ideologie."),
        ("Völkerbund", "Nachkriegsorganisation nach 1919", "Deutschland trat aus und unterlief ihn."),
        ("Aufrüstung", "Wiederbewaffnung entgegen Verträgen", "Bruch des Versailler Vertrags."),
        ("Anschluss Österreich", "1938 Eingliederung", "Schritt der Expansion."),
        ("Nonaggressionspakt", "Hitler-Stalin-Pakt 1939", "Ermöglichte den Polenfeldzug."),
        ("Kriegsziele", "politische Absichten im Krieg", "Vernichtungskrieg im Osten."),
        ("Neutralität", "Nichtbeteiligung am Konflikt", "Wurde von der Expansion bedroht."),
        ("Revision", "Änderung des Versailler Systems", "Frühes Ziel der NS-Außenpolitik."),
        ("Kollektive Sicherheit", "gemeinsame Friedenssicherung", "Scheiterte in den 1930ern."),
    ],
    "kaltkrieg": [
        ("Kalter Krieg", "Ost-West-Konflikt ohne direkten Hot War der Supermächte", "Ideologie, Rüstung, Stellvertreter."),
        ("Potsdamer Konferenz", "1945 Nachkriegsordnung der Alliierten", "Besatzungszonen in Deutschland."),
        ("Blockbildung", "Lagerbildung um USA und UdSSR", "NATO und Warschauer Pakt."),
        ("NATO", "westliches Verteidigungsbündnis", "Kollektive Sicherheit."),
        ("Warschauer Pakt", "östliches Militärbündnis", "Gegenstück zur NATO."),
        ("Stellvertreterkrieg", "Konflikt über Drittstaaten", "Korea, Vietnam, Afghanistan."),
        ("Mauerbau", "1961 Abriegelung West-Berlins", "Symbol der Teilung."),
        ("Feindbild", "ideologische Gegnerkonstruktion", "Kapitalismus vs. Kommunismus."),
        ("Abschreckung", "nukleare Abschreckungslogik", "Gleichgewicht des Schreckens."),
        ("Entspannungspolitik", "Abbau von Spannungen", "Ostverträge, KSZE."),
        ("Containment", "US-Strategie der Eindämmung", "Gegen sowjetischen Einfluss."),
        ("Berlin-Blockade", "1948/49 Sperrung West-Berlins", "Luftbrücke als Antwort."),
    ],
    "teilung-ddr": [
        ("SBZ", "Sowjetische Besatzungszone", "Vorläufer der DDR."),
        ("DDR", "sozialistischer deutscher Staat 1949–1990", "SED-Herrschaft."),
        ("BRD", "Bundesrepublik ab 1949", "Parlamentarische Demokratie."),
        ("Grundgesetz", "Verfassung der Bundesrepublik", "Grundrechte und Gewaltenteilung."),
        ("SED", "Staatspartei der DDR", "Führungsanspruch."),
        ("Stasi", "Ministerium für Staatssicherheit", "Überwachung der Bevölkerung."),
        ("Mauer", "innerdeutsche Grenze in Berlin", "Verhinderte Flucht."),
        ("Planwirtschaft", "staatlich gelenkte Wirtschaft", "Mangel und Quoten."),
        ("Friedliche Revolution", "1989 Proteste in der DDR", "„Wir sind das Volk!“."),
        ("Wiedervereinigung", "1990 staatliche Einheit", "Zwei-plus-Vier-Vertrag."),
        ("Opposition", "Widerstand gegen SED-Herrschaft", "Kirche, Bürgerrechtler."),
        ("Transformation", "Umbau nach 1990", "Wirtschaft, Recht, Erinnerung."),
    ],
    "aufklaerung-staat": [
        ("Aufklärung", "Vernunft als Leitidee", "Kritik an Stand und Dogma."),
        ("Gewaltenteilung", "Teilung der Staatsgewalt", "Montesquieu."),
        ("Gesellschaftsvertrag", "Herrschaft durch Zustimmung", "Locke und Rousseau."),
        ("Menschenrechte", "angeborene Rechte aller Menschen", "1776/1789 programmatisch."),
        ("Verfassungsstaat", "Herrschaft an Verfassung gebunden", "Gegen Willkür."),
        ("Bürgertum", "aufsteigende Mittelschicht", "Forderte Teilhabe und Eigentumsschutz."),
        ("Revolution", "Umsturz der politischen Ordnung", "USA, Frankreich als Beispiele."),
        ("Publizität", "öffentliche Debatte", "Zeitungen und Salons."),
        ("Toleranz", "Duldung anderer Überzeugungen", "Religiös und politisch."),
        ("Souveränität des Volkes", "Volk als Träger der Herrschaft", "Gegen Gottesgnadentum."),
        ("Rechtsstaat", "Bindung an Recht und Gesetz", "Schutz vor Willkür."),
        ("Quelle der Aufklärung", "Traktat, Flugschrift, Zeitung", "Quellenkritisch lesen."),
    ],
    "demokratie-diktatur": [
        ("Demokratie", "Herrschaft durch Volk und Vertretung", "Wahlen, Rechte, Opposition."),
        ("Diktatur", "unumschränkte Herrschaft", "Ohne freie Opposition."),
        ("Weimarer Krise", "politische und wirtschaftliche Instabilität", "Begünstigte Extremismus."),
        ("Propaganda", "Meinungslenkung", "In Diktaturen zentral."),
        ("Widerstandsethik", "moralische Begründung von Widerstand", "Gewissen vs. Gehorsam."),
        ("Opfergruppen", "von Verfolgung betroffene Menschen", "Juden, politische Gegner, Minderheiten."),
        ("Justizunrecht", "Recht als Instrument der Unterdrückung", "Sondergerichte."),
        ("Sicherheitsorgane", "Polizei und Geheimdienste", "In Diktaturen allgegenwärtig."),
        ("Planwirtschaft", "zentrale Wirtschaftslenkung", "DDR und UdSSR."),
        ("Opposition", "organisierter Widerspruch", "In Diktaturen riskant."),
        ("Vergleich", "Demokratie und Diktatur gegenüberstellen", "Kriterien: Rechte, Machtkontrolle."),
        ("Quellenarbeit", "Quellen kritisch auswerten", "Propaganda vs. Alltag."),
    ],
    "frieden-institutionen": [
        ("Völkerbund", "Versuch kollektiver Sicherheit nach 1919", "Scheiterte an Durchsetzung."),
        ("UNO", "Vereinte Nationen ab 1945", "Friedenssicherung und Menschenrechte."),
        ("Abrüstung", "Reduktion von Waffenarsenalen", "Verträge und Kontrolle."),
        ("Kriegsursachen", "strukturelle und situative Gründe für Krieg", "Macht, Ressourcen, Ideologie."),
        ("Friedensordnung", "Regelwerk nach Konflikten", "Verträge und Institutionen."),
        ("Kollektive Sicherheit", "gemeinsame Abwehr von Aggression", "Prinzip der UNO-Charta."),
        ("KSZE", "Konferenz über Sicherheit und Zusammenarbeit", "Entspannung in Europa."),
        ("Humanitäres Völkerrecht", "Schutz in bewaffneten Konflikten", "Genfer Konventionen."),
        ("Konfliktlösung", "friedliche Beilegung von Streit", "Diplomatie und Mediation."),
        ("Intervention", "Eingreifen in andere Staaten", "Umstritten und regelungsbedürftig."),
        ("Abrüstungskontrolle", "Überwachung von Vereinbarungen", "Vertrauen schaffen."),
        ("Aktuelle Konflikte", "gegenwärtige Kriege und Krisen", "Historisch einordnen."),
    ],
    "geschichtskultur-lk": [
        ("Geschichtskultur", "öffentlicher Umgang mit Vergangenheit", "Denkmale, Filme, Schule."),
        ("Erinnerungspolitik", "staatliche Steuerung von Gedenken", "Kann instrumentalisieren."),
        ("Narrativ", "Erzählung über die Vergangenheit", "Auswahl und Deutung."),
        ("Denkmal", "Erinnerungszeichen im öffentlichen Raum", "Werte und Botschaften."),
        ("Oral History", "Erinnerung Zeitzeuginnen und Zeitzeugen", "Perspektivisch und ergänzend."),
        ("Museum", "Ort der Ausstellung und Deutung", "Kuratorische Auswahl."),
        ("Identität", "Selbstverständnis einer Gruppe", "Oft historisch begründet."),
        ("Mythen", "vereinfachte Geschichtsbilder", "Kritisch prüfen."),
        ("Quellenkritik", "Prüfung von Herkunft und Absicht", "Methodische Grundlage."),
        ("Kontinuität", "was trotz Wandel bleibt", "Gegenbegriff: Zäsur."),
        ("Zäsur", "einschneidender Bruch", "z. B. 1918, 1945, 1989."),
        ("Multiperspektivität", "mehrere Standpunkte einbeziehen", "Gegen Einheitserzählung."),
    ],
    "partizipation-lk": [
        ("Partizipation", "politische Teilhabe", "Wahlen, Protest, Öffentlichkeit."),
        ("Bürgerrechte", "Rechte gegenüber dem Staat", "Meinung, Versammlung, Eigentum."),
        ("Wahlrecht", "Recht zur Teilnahme an Wahlen", "Historisch schrittweise erweitert."),
        ("Parlamentarismus", "Volksvertretung zentral", "Gesetzgebung und Kontrolle."),
        ("Öffentlichkeit", "Raum politischer Debatte", "Presse und Versammlung."),
        ("Revolution", "Umbruch der Ordnung", "Oft Forderung nach Teilhabe."),
        ("Verfassung", "verbindliche Grundregeln", "Schützt und begrenzt Macht."),
        ("Opposition", "gegen die Regierung gerichtete Kraft", "In Demokratien legitim."),
        ("Zivilgesellschaft", "Engagement jenseits des Staates", "Vereine, Initiativen."),
        ("Macht", "Fähigkeit, Entscheidungen durchzusetzen", "Institutionell oder informell."),
        ("Gewaltmonopol", "staatliches Recht auf Zwang", "Kennzeichen moderner Staaten."),
        ("Legitimation", "Rechtfertigung von Herrschaft", "Gott, Tradition, Volk, Leistung."),
    ],
    "industrie-lk": [
        ("Industrialisierung", "Übergang zur Maschinenproduktion", "Gesellschaftlicher Umbau."),
        ("Kapital", "Investitionsmittel für Produktion", "Fabriken und Maschinen."),
        ("Proletariat", "lohnabhängige Arbeiterklasse", "Marxsche Begrifflichkeit."),
        ("Bourgeoisie", "besitzende Wirtschaftsbürger", "Politische und wirtschaftliche Macht."),
        ("Globale Arbeitsteilung", "internationale Spezialisierung", "Rohstoffe und Industrieprodukte."),
        ("Soziale Frage", "Probleme der Industriegesellschaft", "Armut und Reformdebatten."),
        ("Technikfolgen", "Auswirkungen neuer Technik", "Umwelt, Arbeit, Krieg."),
        ("Urbanisierung", "Wachstum der Städte", "Neue Lebensformen."),
        ("Geschlecht und Arbeit", "ungleiche Rollen in der Industrie", "Frauenlohn und Hausarbeit."),
        ("Migration", "Wanderung von Arbeitskräften", "Regionale und internationale."),
        ("Krise", "wirtschaftlicher Einbruch", "Zyklen der Industriegesellschaft."),
        ("Fortschrittsglaube", "Optimismus der Moderne", "Oft kritisiert nach Katastrophen."),
    ],
}

# Topic-ID substring → pool key (first match wins; order matters)
RULES: list[tuple[str, str]] = [
    ("lbw-regional", "regional-sachsen"),
    ("sachsen-sbz", "teilung-ddr"),
    ("humanismus", "humanismus"),
    ("machtstuetzzen", "absolutismus-macht"),
    ("usa-mitwirkung", "usa-revolution"),
    ("reichseinigung", "reichseinigung"),
    ("reichsfeinde", "reichsfeinde"),
    ("soziale-frage", "soziale-frage"),
    ("wettruesten", "wettruesten"),
    ("alltag-industrie", "industrie-alltag"),
    ("technikfolgen", "technikfolgen"),
    ("lbw-migration", "migration-industrie"),
    ("wahlverhalten", "weimar-aufstieg"),
    ("praesidial", "weimar-aufstieg"),
    ("ernennung", "weimar-aufstieg"),
    ("gleichschaltung", "weimar-aufstieg"),
    ("terror-beginn", "weimar-aufstieg"),
    ("volksgemeinschaft", "ns-alltag-widerstand"),
    ("gedenkstaette", "ns-alltag-widerstand"),
    ("widerstand-formen", "ns-alltag-widerstand"),
    ("alltag-ns", "ns-alltag-widerstand"),
    ("aussen-phasen", "aussen-ns"),
    ("feindbilder", "kaltkrieg"),
    ("potsdam", "kaltkrieg"),
    ("blockbildung", "kaltkrieg"),
    ("stellvertreter", "kaltkrieg"),
    ("doppelstaat", "teilung-ddr"),
    ("integration-west-ost", "teilung-ddr"),
    ("mauer", "teilung-ddr"),
    ("transformation", "teilung-ddr"),
    ("alltag-ddr", "teilung-ddr"),
    ("opposition", "teilung-ddr"),
    ("erinnerung-teilung", "teilung-ddr"),
    ("aufklaerung", "aufklaerung-staat"),
    ("revolutionen", "aufklaerung-staat"),
    ("buergertum", "aufklaerung-staat"),
    ("verfassungsstaat", "aufklaerung-staat"),
    ("wirtschaft-wandel", "industrie-lk"),
    ("sozialstruktur", "industrie-lk"),
    ("geschlecht-recht", "aufklaerung-staat"),
    ("quellen-aufklaerung", "aufklaerung-staat"),
    ("demokratie-modelle", "demokratie-diktatur"),
    ("diktatur-merkmale", "demokratie-diktatur"),
    ("weimar-krisen", "weimar-aufstieg"),
    ("widerstand-ethik", "ns-alltag-widerstand"),
    ("propaganda-medien", "demokratie-diktatur"),
    ("opfergruppen", "ns-alltag-widerstand"),
    ("justiz-unrecht", "demokratie-diktatur"),
    ("sowjet-system", "teilung-ddr"),
    ("ddr-staat", "teilung-ddr"),
    ("vergleich-diktaturen", "demokratie-diktatur"),
    ("alltag-unfreiheit", "teilung-ddr"),
    ("sicherheitsorgane", "demokratie-diktatur"),
    ("wirtschaft-plan", "teilung-ddr"),
    ("opposition-ost", "teilung-ddr"),
    ("quellen-diktatur", "demokratie-diktatur"),
    ("kriegsursachen", "frieden-institutionen"),
    ("friedensordnungen", "frieden-institutionen"),
    ("uno-system", "frieden-institutionen"),
    ("abrüstung", "frieden-institutionen"),
    ("aktuelle-konflikte", "frieden-institutionen"),
    ("regional-os", "regional-sachsen"),
    ("biografie", "geschichtskultur-lk"),
    ("medienprojekt", "geschichtskultur-lk"),
    ("lk11-lb1", "partizipation-lk"),
    ("lk11-lb2", "industrie-lk"),
    ("lk11-lbw", "partizipation-lk"),
    ("lk12-lb1", "frieden-institutionen"),
    ("lk12-lb2", "geschichtskultur-lk"),
    ("gk-lb1", "aufklaerung-staat"),
    ("gk-lb2", "demokratie-diktatur"),
    ("gk-lb3", "teilung-ddr"),
    ("gk-lb4", "frieden-institutionen"),
]


def pool_for(tid: str) -> list[tuple[str, str, str]]:
    for needle, key in RULES:
        if needle in tid:
            return POOLS[key]
    if "lk12" in tid:
        return POOLS["geschichtskultur-lk"]
    if "lk11" in tid:
        return POOLS["partizipation-lk"]
    if "k10" in tid or "k9" in tid:
        return POOLS["kaltkrieg"]
    if "k8" in tid:
        return POOLS["industrie-alltag"]
    if "k7" in tid:
        return POOLS["aufklaerung-staat"]
    return POOLS["geschichtskultur-lk"]


def title_for(tid: str) -> str:
    slug = tid.split("-", 3)[-1] if tid.count("-") >= 3 else tid
    return slug.replace("-", " ")


def emit_bank(tid: str) -> str:
    concepts = pool_for(tid)[:12]
    # rotate for uniqueness across similar topics
    off = sum(ord(c) for c in tid) % len(concepts)
    concepts = concepts[off:] + concepts[:off]
    concepts = concepts[:12]
    title = title_for(tid)
    pref = f"ge:schul:{tid}"
    pairs = []
    facts = []
    sorts = []
    tfs = []
    for i, (term, meaning, extra) in enumerate(concepts):
        c = f"{pref}:p{i}"
        wissen = (
            f"{extra} {term}: {meaning}. "
            f"Das gehört zum Schulstoff dieses Themas und lässt sich an konkreten Fällen prüfen."
        )
        pairs.append(
            "    { "
            + f"concept: {json.dumps(c)}, term: {json.dumps(term)}, meaning: {json.dumps(meaning)}, wissen: {json.dumps(wissen)}"
            + " },"
        )
        wrong = [concepts[(i + k) % len(concepts)][1] for k in (1, 2, 3)]
        facts.append(
            "    {\n"
            f"      concept: {json.dumps(c + ':f')},\n"
            f"      prompt: {json.dumps(f'Was trifft auf „{term}“ zu?')},\n"
            f"      answer: {json.dumps(meaning)},\n"
            f"      wrong: {json.dumps(wrong, ensure_ascii=False)},\n"
            f"      explanation: {json.dumps(wissen)},\n"
            f"      wissen: {json.dumps(wissen)},\n"
            f"      gap: {json.dumps(f'Fachbegriff: ___ — {meaning}')},\n"
            f"      gapAccepted: [{json.dumps(term)}],\n"
            "    },"
        )
    # Chronologie-Sort nur wenn 4+ datierbare Stichworte in meanings/wissen
    if any(x in tid for x in ("reichseinigung", "weimar", "mauer", "potsdam", "usa", "wettruesten", "ernennung")):
        labels_map = {
            "reichseinigung": ["Zollverein", "Deutsch-Französischer Krieg", "Kaiserproklamation 1871", "Sozialistengesetz"],
            "weimar": ["Weimarer Verfassung", "Weltwirtschaftskrise", "Ermächtigungsgesetz", "Gleichschaltung"],
            "mauer": ["Potsdamer Konferenz", "Gründung DDR/BRD", "Mauerbau 1961", "Friedliche Revolution"],
            "potsdam": ["Kriegsende 1945", "Potsdamer Konferenz", "Blockbildung", "Berlin-Blockade"],
            "usa": ["Kolonien", "Boston Tea Party", "Unabhängigkeitserklärung", "US-Verfassung"],
            "wettruesten": ["Bündnissystem", "Flottenbau", "Julikrise", "Kriegsausbruch 1914"],
            "ernennung": ["Weltwirtschaftskrise", "Präsidialkabinette", "Ernennung Hitlers", "Ermächtigungsgesetz"],
        }
        for key, labels in labels_map.items():
            if key in tid:
                sorts.append(
                    "    {\n"
                    f'      concept: {json.dumps(pref + ":sort")},\n'
                    f'      question: {json.dumps("Ordne die Stationen chronologisch von früher nach später.")},\n'
                    f"      labels: {json.dumps(labels, ensure_ascii=False)},\n"
                    f'      explanation: {json.dumps("Chronologische Einordnung gehört zum Kern schulischer Geschichtsarbeit.")},\n'
                    f'      wissen: {json.dumps("Zeitstrahl und Reihenfolge machen Ursachen und Folgen sichtbar. Typische Arbeitsblatt-Aufgabe am Gymnasium.")},\n'
                    "    },"
                )
                break
    # TF: volle prüfbare Sätze, themenbezogen
    tf_candidates = [
        (f"{concepts[0][0]} gehört inhaltlich in diesen Lernzusammenhang.", True, concepts[0][2]),
        (f"{concepts[1][0]} bedeutet: {concepts[1][1]}.", True, concepts[1][2]),
        (
            "Geschwindigkeit als Weg pro Zeit ist ein zentraler Fachbegriff dieses Geschichtsthemas.",
            False,
            "Physikformeln gehören nicht in die Geschichtsbank; hier zählen Personen, Daten und Strukturen.",
        ),
    ]
    for i, (stmt, correct, w) in enumerate(tf_candidates):
        tfs.append(
            "    {\n"
            f"      concept: {json.dumps(pref + f':tf{i}')},\n"
            f"      statement: {json.dumps(stmt)},\n"
            f"      correct: {str(correct).lower()},\n"
            f"      explanation: {json.dumps(w)},\n"
            f"      wissen: {json.dumps(w + ' Prüfe die Aussage am konkreten historischen Stoff.')},\n"
            "    },"
        )
    return (
        f'  "{tid}": bankGenerate({{\n'
        f'    quelle: "Lehrplan Geschichte Sachsen / Schulportal",\n'
        f'    url: "https://www.schulportal.sachsen.de/lplandb/lehrplan/65",\n'
        f"    conceptPrefix: {json.dumps(pref)},\n"
        "    pairs: [\n"
        + "\n".join(pairs)
        + "\n    ],\n"
        "    facts: [\n"
        + "\n".join(facts)
        + "\n    ],\n"
        + ("    sorts: [\n" + "\n".join(sorts) + "\n    ],\n" if sorts else "")
        + "    trueFalse: [\n"
        + "\n".join(tfs)
        + "\n    ],\n"
        "  }),\n"
    )


def main() -> None:
    body = [emit_bank(tid) for tid in WEAK]
    text = (
        "/**\n"
        " * AUTO tmp/gen_ge_schulstoff_dense.py — Schulstoff-Densify für Topics ohne Qualitätsbank.\n"
        " * Inspiration: Google „Thema Klasse Gymnasium Sachsen Aufgaben“, Schlaukopf, Lehrplan 65.\n"
        " * Formulierungen original; released unverändert (kein Blind-Release).\n"
        " */\n"
        "import { bankGenerate } from './biologieBank'\n"
        "import type { Topic } from './types'\n"
        "\n"
        "export const GESCHICHTE_SCHULSTOFF_DENSE_GENERATORS: Record<string, Topic['generate']> = {\n"
        + "".join(body)
        + "}\n"
    )
    OUT.write_text(text, encoding="utf-8")
    print("wrote", OUT, "topics=", len(WEAK))


if __name__ == "__main__":
    main()
