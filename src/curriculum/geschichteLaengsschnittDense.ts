/**
 * Geschichte Gym Sachsen — Verdichtung dünner Längsschnitt-LBs (Lehrplan 65).
 * Quelle: https://www.schulportal.sachsen.de/lplandb/lehrplan/65
 */
import { bankGenerate, type BioBank } from './biologieBank'
import type { Topic } from './types'

const f = (
  concept: string,
  prompt: string,
  answer: string,
  wrong: string[],
  explanation: string,
  wissen: string,
) => ({ concept, prompt, answer, wrong, explanation, wissen })

const p = (term: string, meaning: string, wissen: string) => ({ term, meaning, wissen })

const tf = (
  concept: string,
  statement: string,
  correct: boolean,
  explanation: string,
  wissen: string,
) => ({ concept, statement, correct, explanation, wissen })

export const geK5NaturRessourcen: BioBank = {
  quelle: 'Wikipedia: Umweltgeschichte',
  url: 'https://de.wikipedia.org/wiki/Umweltgeschichte',
  conceptPrefix: 'ge:k5:natur',
  facts: [
    f(
      'ge:k5:natur:ressource',
      'Warum war der Zugang zu Wasser und fruchtbarem Boden in frühen Kulturen zentral?',
      'Er sicherte Ernährung, Siedlung und Herrschaft',
      ['Nur für moderne Industrie relevant', 'Nur für Astronomie', 'Nur für Schulnoten'],
      'Ressourcen prägten Siedlungsräume.',
      'Frühe Hochkulturen entstanden oft an Flüssen (Nil, Euphrat/Tigris). Wasser und Boden sicherten Ernten, Siedlungsdichte und Herrschaftsstrukturen. Umweltbedingungen und menschliche Nutzung hängen zusammen.',
    ),
    f(
      'ge:k5:natur:rodung',
      'Was bedeutet Rodung historisch typischerweise?',
      'Wald wird für Siedlung oder Landwirtschaft freigemacht',
      ['Nur Sternenkarten zeichnen', 'Nur Münzen prägen', 'Nur Olympische Spiele veranstalten'],
      'Landschaftsumgestaltung.',
      'Rodung verwandelt Wald in Acker oder Siedlungsraum. Sie verändert Ökosysteme und kann langfristig Boden und Klima lokal beeinflussen — ein Beispiel für Mensch–Natur-Wechselwirkung.',
    ),
    f(
      'ge:k5:natur:uebernutzung',
      'Welche Folge kann Übernutzung von Böden oder Wäldern haben?',
      'Ertragseinbußen, Erosion oder Ressourcenknappheit',
      ['Unbegrenzte Ernten ohne Ende', 'Sofortige Unsterblichkeit', 'Nur bessere Noten'],
      'Nachhaltigkeit historisch denken.',
      'Übernutzung (zu intensive Bewirtschaftung, Kahlschlag) kann Böden auslaugen und Erosion fördern. Historische Gesellschaften kannten solche Konflikte zwischen kurzfristigem Nutzen und langfristiger Tragfähigkeit.',
    ),
    f(
      'ge:k5:natur:technik',
      'Wie beeinflussen Technik und Werkzeuge die Nutzung der Natur?',
      'Sie erweitern Eingriffsmöglichkeiten (z. B. Pflügen, Bewässerung)',
      ['Sie haben nie Einfluss', 'Sie ersetzen jede Umwelt', 'Sie löschen Geschichte'],
      'Technik verändert Eingriffstiefe.',
      'Pflug, Bewässerung und später Maschinen steigern Erträge, verstärken aber auch Eingriffe in Landschaften. Technik ist weder nur Fortschritt noch nur Zerstörung — Folgen sind zu beurteilen.',
    ),
  ],
  pairs: [
    p('Nil', 'Lebensader Ägyptens', 'Überschwemmungen und Fruchtbarkeit.'),
    p('Bewässerung', 'Künstliche Wasserzufuhr für Felder', 'Erhöht Erträge, braucht Organisation.'),
    p('Erosion', 'Abtrag von Boden', 'Oft Folge von Entwaldung/Übernutzung.'),
  ],
  trueFalse: [
    tf(
      'ge:k5:natur:tf',
      'Mensch und Natur standen in der Geschichte nie in Wechselwirkung.',
      false,
      'Siedlung, Landwirtschaft und Ressourcen prägen Kulturen.',
      'Umweltgeschichte zeigt: Klima, Böden und Ressourcen beeinflussen Gesellschaften — und Menschen gestalten Landschaften aktiv um.',
    ),
  ],
}

export const geK7Gottesgnadentum: BioBank = {
  quelle: 'Wikipedia: Gottesgnadentum',
  url: 'https://de.wikipedia.org/wiki/Gottesgnadentum',
  conceptPrefix: 'ge:k7:legitim',
  facts: [
    f(
      'ge:k7:legitim:gottesgnade',
      'Was meint Gottesgnadentum grob?',
      'Herrschaft wird als von Gott verliehen begründet',
      ['Nur demokratische Wahl als einzige Idee je', 'Nur Marktwirtschaft', 'Nur Schulordnung'],
      'Religiöse Legitimation.',
      'Gottesgnadentum begründet königliche/fürstliche Macht religiös: der Herrscher regiert „von Gottes Gnaden“. Kritik und Aufklärung stellten solche Begründung später infrage.',
    ),
    f(
      'ge:k7:legitim:wahl',
      'Welche andere Form der Herrschaftslegitimation ist historisch wichtig?',
      'Zustimmung, Wahl oder Vertrag (z. B. Stände, Verfassungen)',
      ['Nur reine Willkür ohne Begründung je', 'Nur Physikgesetze', 'Nur Sportregeln'],
      'Politische vs. religiöse Begründung.',
      'Neben Gottesgnade gab es Wahlmonarchien, ständische Mitwirkung und später Verfassung und Volkssouveränität. Legitimation heißt: Warum gilt Herrschaft als rechtmäßig?',
    ),
    f(
      'ge:k7:legitim:revolution',
      'Warum stellen Revolutionen oft die alte Legitimation infrage?',
      'Sie fordern neue Begründung von Macht (z. B. Rechte des Volkes)',
      ['Sie bestätigen immer Gottesgnade', 'Sie ändern nie Ideen', 'Sie betreffen nur Mode'],
      'Umbruch der Begründung.',
      'Revolutionen (z. B. 1789) kritisieren dynastische/religiöse Machtbegründung und setzen Ideen wie Menschenrechte und Volkssouveränität dagegen — ein Kern des Längsschnitts Legitimation.',
    ),
    f(
      'ge:k7:legitim:absolutismus',
      'Wie legitimierte der Absolutismus oft die Alleinherrschaft?',
      'Durch Gottesgnade und die Idee ungeteilter Souveränität des Fürsten',
      ['Durch allgemeine, gleiche Wahlen', 'Durch reine Marktwirtschaft', 'Durch Olympische Spiele'],
      'Ludwig XIV. als Schulbeispiel.',
      'Absolutistische Herrschaft wurde oft göttlich und als unteilbare Souveränität begründet. Stände und Parlamente sollten eingeschränkt werden — Gegenmodelle entstehen in der Aufklärung.',
    ),
  ],
  pairs: [
    p('Souveränität', 'Oberste Entscheidungsgewalt', 'Wer darf verbindlich entscheiden?'),
    p('Verfassung', 'Grundregeln der Herrschaft', 'Begrenzt und organisiert Macht.'),
    p('Volkssouveränität', 'Macht geht vom Volk aus', 'Moderne demokratische Idee.'),
  ],
  trueFalse: [
    tf(
      'ge:k7:legitim:tf',
      'Herrschaft braucht historisch nie eine Begründung — Macht reicht immer.',
      false,
      'Legitimation macht Herrschaft akzeptabel oder angreifbar.',
      'Selbst autoritäre Systeme liefern Begründungen (Gott, Nation, Sicherheit). Geschichte fragt, welche Gründe wann gelten und wer sie hinterfragt.',
    ),
  ],
}

export const geK8KinderarbeitReform: BioBank = {
  quelle: 'Wikipedia: Kinderarbeit',
  url: 'https://de.wikipedia.org/wiki/Kinderarbeit',
  conceptPrefix: 'ge:k8:kinder',
  facts: [
    f(
      'ge:k8:kinder:fabrik',
      'Warum war Kinderarbeit in frühen Fabriken verbreitet?',
      'Kinder waren billige Arbeitskräfte und passten an Maschinen',
      ['Weil Schulpflicht schon überall streng galt', 'Weil es keine Industrialisierung gab', 'Weil Kinder nie arbeiteten'],
      'Ökonomische Logik der Frühindustrialisierung.',
      'In der Frühindustrialisierung arbeiteten Kinder lange Schichten in Fabriken und Bergwerken. Geringer Lohn und kleine Körpergröße machten sie für Unternehmer attraktiv — humanitär und gesundheitlich problematisch.',
    ),
    f(
      'ge:k8:kinder:schutz',
      'Was bewirkten frühe Kinderschutzgesetze grob?',
      'Sie begrenzten Arbeitszeiten und Mindestalter schrittweise',
      ['Sie schafften Arbeit sofort weltweit ab ohne Ausnahme', 'Sie verboten Schulen', 'Sie betrafen nur Adelige'],
      'Reformprozess.',
      'Gesetze (z. B. in England und später Deutschland) begrenzten Stunden und Alter. Durchsetzung war schleppend; Schulpflicht und Gewerkschaften verstärkten den Wandel.',
    ),
    f(
      'ge:k8:kinder:schule',
      'Welcher Zusammenhang besteht zwischen Schulpflicht und Kinderarbeit?',
      'Schulpflicht zieht Kinder aus der Vollzeitarbeit und bildet sie',
      ['Schulpflicht fördert Fabrikarbeit von Kleinkindern', 'Es gibt keinen Zusammenhang', 'Schule ersetzt Fabriken als Arbeitsort für Säuglinge'],
      'Bildung vs. Ausbeutung.',
      'Allgemeine Schulpflicht konkurriert mit Kinderarbeit um die Zeit der Kinder. Bildung wurde zum Argument gegen Ausbeutung und für Staatsbürgerkompetenz.',
    ),
    f(
      'ge:k8:kinder:laengsschnitt',
      'Was zeigt der Längsschnitt „Industrialisierung und Kinderarbeit“?',
      'Wandel von Ausbeutung zu stärkerem Schutz über längere Zeit',
      ['Dass Kinderarbeit nie existierte', 'Dass Reformen überflüssig waren', 'Dass nur das Mittelalter betroffen war'],
      'Veränderung über Epochen.',
      'Der Längsschnitt vergleicht Phasen: frühe Fabrikarbeit, Reformen, Schulpflicht, spätere Verbote. Er zeigt, dass „Fortschritt“ soziale Kosten hatte und politisch gestaltet werden musste.',
    ),
  ],
  pairs: [
    p('Fabrikgesetz', 'Staatliche Begrenzung der Arbeit', 'Schutzt Kinder und Arbeitszeiten.'),
    p('Schulpflicht', 'Verpflichtung zum Schulbesuch', 'Konkurriert mit Kinderarbeit.'),
    p('Soziale Frage', 'Probleme der Industriegesellschaft', 'Armut, Wohnen, Arbeitsschutz.'),
  ],
  trueFalse: [
    tf(
      'ge:k8:kinder:tf',
      'Kinderarbeit endete weltweit sofort mit der ersten Dampfmaschine.',
      false,
      'Abbau war ein langer politischer und sozialer Prozess.',
      'Kinderarbeit nahm mit Industrialisierung zunächst zu und wurde erst schrittweise eingeschränkt — regional unterschiedlich und unvollständig.',
    ),
  ],
}

const geK6BuergerPolis: BioBank = {
  quelle: 'Wikipedia: Polis',
  url: 'https://de.wikipedia.org/wiki/Polis',
  conceptPrefix: 'ge:k6:buerger-polis',
  facts: [
    f(
      'ge:k6:buerger-polis:begriff',
      'Was bedeutete Bürgersein in einer griechischen Polis?',
      'Politische Zugehörigkeit zum Stadtstaat mit Rechten und Pflichten',
      ['Nur Besitz einer Ritterrüstung', 'Hörigkeit unter einem Grundherrn', 'Klosterregel ohne Politik'],
      'Bürgersein war politischer Status.',
      'In der Polis war der Bürger Teil des Stadtstaats. Er konnte an Versammlungen teilnehmen, war aber oft männlich und frei geboren. Frauen, Sklaven und Metöken blieben ausgeschlossen.',
    ),
    f(
      'ge:k6:buerger-polis:demokratie',
      'Welche Form der Mitwirkung gab es in Athen besonders?',
      'Direkte Beteiligung freier Bürger in der Volksversammlung',
      ['Nur Kaiserwahl', 'Nur Zunftversammlung', 'Nur Klosterwahl'],
      'Athenische Demokratie war begrenzt.',
      'Die attische Demokratie beruhte auf der Volksversammlung freier Bürger. Sie war kein modernes allgemeines Wahlrecht, sondern an Status und Geschlecht gebunden.',
    ),
    f(
      'ge:k6:buerger-polis:pflicht',
      'Welche Pflicht gehörte oft zum Polis-Bürgersein?',
      'Militärdienst und politische Verantwortung für die Gemeinschaft',
      ['Nur Steuerfreiheit ohne Leistung', 'Nur Turniere', 'Nur Klosterarbeit'],
      'Rechte und Pflichten hingen zusammen.',
      'Bürger sollten die Polis verteidigen und mitentscheiden. Wer Rechte hatte, sollte auch für Sicherheit und Ordnung einstehen.',
    ),
    f(
      'ge:k6:buerger-polis:ausschluss',
      'Wer war in der Polis typischerweise kein voller Bürger?',
      'Frauen, Sklaven und oft Zugezogene (Metöken)',
      ['Nur Könige', 'Nur Priester', 'Nur Kaufleute'],
      'Bürgerrecht war exklusiv.',
      'Die Mehrheit der Stadtbewohner hatte keine vollen Bürgerrechte. Das macht den historischen Bürgerbegriff eng und selektiv.',
    ),
    f(
      'ge:k6:buerger-polis:erziehung',
      'Worauf zielte Erziehung in Sparta stark ab?',
      'Disziplin, Gehorsam und militärische Tüchtigkeit',
      ['Nur freie Kunstdebatte', 'Nur Industriearbeit', 'Nur Pressefreiheit'],
      'Erziehung formte den Bürger/Krieger.',
      'Sparta erzog Jungen früh gemeinschaftlich zu Härte und Gehorsam. Erziehung war Mittel, den gewünschten Bürger- und Kriegerstatus hervorzubringen.',
    ),
    f(
      'ge:k6:buerger-polis:vergleich',
      'Was unterscheidet athenische und spartanische Bürgererziehung grob?',
      'Athen betonte politische Rede und Bildung stärker, Sparta militärische Disziplin',
      ['Beide waren identisch', 'Sparta kannte keine Erziehung', 'Athen verbot jede Versammlung'],
      'Verschiedene Bürgerideale.',
      'Beide Poleis wollten loyalen Bürgernachwuchs, aber mit anderen Schwerpunkten: politische Partizipation versus militärische Ordnung.',
    ),
  ],
  pairs: [
    p('Polis', 'Griechenischer Stadtstaat', 'Eigene Bürger und Gesetze.'),
    p('Volksversammlung', 'Treffen der Bürger', 'Politische Entscheidungen.'),
    p('Metöke', 'Zugezogener ohne volles Bürgerrecht', 'Lebte in der Polis.'),
    p('Helot', 'Unfreier Landarbeiter in Sparta', 'Ermöglichte Spartiaten Krieg.'),
    p('Paideia', 'Bildung und Erziehung', 'Formt den künftigen Bürger.'),
    p('Hoplit', 'Schwer bewaffneter Bürger-Soldat', 'Wehrpflicht der Freien.'),
  ],
  trueFalse: [
    tf(
      'ge:k6:buerger-polis:tf1',
      'In der griechischen Polis hatten alle Einwohner automatisch volle Bürgerrechte.',
      false,
      'Bürgerrecht war begrenzt.',
      'Frauen, Sklaven und viele Zugezogene waren ausgeschlossen. Bürgersein war ein privilegiertes Statusrecht.',
    ),
    tf(
      'ge:k6:buerger-polis:tf2',
      'Spartanische Erziehung betonte Disziplin und Kriegsfähigkeit.',
      true,
      'Militärideal prägte Erziehung.',
      'Jungen wurden früh gemeinschaftlich erzogen; Härte und Gehorsam dienten der Polis.',
    ),
  ],
}

const geK6BuergerRom: BioBank = {
  quelle: 'Wikipedia: Römisches Bürgerrecht',
  url: 'https://de.wikipedia.org/wiki/R%C3%B6misches_B%C3%BCrgerrecht',
  conceptPrefix: 'ge:k6:buerger-rom',
  facts: [
    f(
      'ge:k6:buerger-rom:status',
      'Was war das römische Bürgerrecht?',
      'Ein Rechtsstatus mit Schutz, Rechten und Pflichten im römischen Gemeinwesen',
      ['Nur religiöses Gelübde', 'Nur Titel der Kaiserfamilie', 'Nur Zunftzugehörigkeit'],
      'Bürgerrecht war rechtlich greifbar.',
      'Das civitas romana gab Schutz und Rechte im Rechtsverkehr. Es konnte verliehen und später ausgeweitet werden und band Menschen an Rom.',
    ),
    f(
      'ge:k6:buerger-rom:ausweitung',
      'Warum war die Ausweitung des Bürgerrechts politisch wichtig?',
      'Sie integrierte Provinzen und verstärkte die Bindung an Rom',
      ['Sie schaffte Steuern ab', 'Sie beendete alle Kriege sofort', 'Sie betraf nur Gladiatoren'],
      'Bürgerrecht als Integrationsmittel.',
      'Je mehr Menschen Bürger wurden, desto stärker konnten sie sich als Teil des Reiches sehen. Gleichzeitig blieb Hierarchie bestehen.',
    ),
    f(
      'ge:k6:buerger-rom:pflicht',
      'Welche Pflichten konnten römische Bürger treffen?',
      'Steuern, Militärdienst und politische bzw. rechtliche Verantwortung',
      ['Nur Feiertage ohne Leistung', 'Nur Klosterarbeit', 'Nur Turniere'],
      'Rechte und Pflichten gehörten zusammen.',
      'Bürgerprivilegien waren an Leistungen für den Staat gekoppelt. Das unterscheidet Bürgerrecht von reiner Privilegienliste ohne Gegenleistung.',
    ),
    f(
      'ge:k6:buerger-rom:schutz',
      'Welchen Schutz bot das Bürgerrecht besonders?',
      'Rechtsschutz und Ansprüche gegenüber Behörden und Gerichten',
      ['Schutz nur durch Magie', 'Schutz nur in der Steinzeit', 'Schutz nur für Sklaven'],
      'Rechtlicher Schutz war zentral.',
      'Bürger konnten sich auf römische Rechtsverfahren berufen. Das war ein klarer Vorteil gegenüber Nichtbürgern.',
    ),
    f(
      'ge:k6:buerger-rom:vergleich',
      'Worin unterschied sich römisches Bürgerrecht stark vom Polis-Bürger?',
      'Es war stärker rechtlich-imperial und über die Stadt Rom hinaus erweiterbar',
      ['Es gab nur in Klöstern', 'Es betraf nur Bauern', 'Es war identisch mit Zünften'],
      'Imperiale Rechtsordnung.',
      'Während die Polis lokal blieb, konnte Rom Bürgerrecht über weite Gebiete vergeben und so Herrschaft absichern.',
    ),
    f(
      'ge:k6:buerger-rom:erziehung',
      'Welche Werte sollten römische Bürgerkinder oft lernen?',
      'Disziplin, Rhetorik, Treue zum Gemeinwesen und Standesregeln',
      ['Nur moderne Medienkompetenz', 'Nur Fabrikarbeit', 'Nur Isolierung vom Staat'],
      'Erziehung diente dem Bürgerideal.',
      'Bildung und Familienerziehung vermittelten römische Tugenden. Wer in der Elite mitwirken wollte, brauchte Rede- und Rechtskenntnis.',
    ),
  ],
  pairs: [
    p('Civitas', 'Bürgerrecht / Bürgerschaft', 'Rechtlicher Status.'),
    p('Provincia', 'Verwaltungsgebiet außerhalb Italiens', 'Bürgerrecht konnte dorthin reichen.'),
    p('Legion', 'Römisches Heer', 'Bürger dienten oft als Soldaten.'),
    p('Patron', 'Schutzherr mit Klienten', 'Soziale Bindung.'),
    p('Senat', 'Beratungsgremium der Elite', 'Politische Mitwirkung.'),
    p('Ius', 'Recht', 'Grundlage des Bürgerstatus.'),
  ],
  trueFalse: [
    tf(
      'ge:k6:buerger-rom:tf1',
      'Das römische Bürgerrecht konnte auch außerhalb der Stadt Rom verliehen werden.',
      true,
      'Imperiale Ausweitung.',
      'Rom nutzte Bürgerrecht zur Integration von Regionen und Personengruppen.',
    ),
    tf(
      'ge:k6:buerger-rom:tf2',
      'Römisches Bürgerrecht bedeutete nur Vorteile ohne jede Pflicht.',
      false,
      'Pflichten gehörten dazu.',
      'Steuern, Militär und rechtliche Verantwortung gehörten zum Bürgersein.',
    ),
  ],
}

const geK6BuergerStadt: BioBank = {
  quelle: 'Wikipedia: Bürger (Mittelalter)',
  url: 'https://de.wikipedia.org/wiki/B%C3%BCrger',
  conceptPrefix: 'ge:k6:buerger-stadt',
  facts: [
    f(
      'ge:k6:buerger-stadt:status',
      'Wodurch zeichnete sich ein Bürger in der mittelalterlichen Stadt aus?',
      'Zugehörigkeit zur Stadt mit Rechten, oft Besitz/Beruf und persönlicher Freiheit',
      ['Lehnseid allein', 'Römischer Senat', 'Alleinige Dorfherrschaft'],
      'Bürgersein war städtisch.',
      'Stadtbürger unterschieden sich vom abhängigen Bauern. Rechte betrafen Handel, Eigentum, Schutz und oft Mitwirkung in Rat oder Zunft.',
    ),
    f(
      'ge:k6:buerger-stadt:luft',
      'Was meint die Formel „Stadtluft macht frei“ grob?',
      'Städtisches Leben bot oft mehr persönliche Freiheit als ländliche Abhängigkeit',
      ['Jeder Städter wurde König', 'Städte hatten keine Gesetze', 'Nur Geistliche durften wohnen'],
      'Gegensatz Land–Stadt.',
      'Wer lange in einer Stadt lebte, konnte der Hörigkeit entkommen. VollGleichheit gab es nicht, aber mehr Freiraum als auf dem Land.',
    ),
    f(
      'ge:k6:buerger-stadt:zunft',
      'Welche Rolle spielten Zünfte für Stadtbürger?',
      'Sie regelten Beruf, Ausbildung und oft politische Mitwirkung',
      ['Sie verboten jeden Handel', 'Sie ersetzten Kirchen', 'Sie galten nur für Bauern'],
      'Zünfte strukturierten Stadtgesellschaft.',
      'Handwerkszünfte kontrollierten Qualität und Zugang zum Beruf. Über Zünfte liefen auch städtische Rechte und Pflichten.',
    ),
    f(
      'ge:k6:buerger-stadt:rat',
      'Was war ein Stadtrat typischerweise?',
      'Gremium wohlhabender Bürger zur Stadtverwaltung',
      ['Nur Kaiserhof', 'Nur Klosterkonvent', 'Nur Bauernversammlung'],
      'Selbstverwaltung der Stadt.',
      'Reiche Bürgerfamilien bestimmten oft den Rat. Bürgerliche Mitwirkung war ständisch und wirtschaftlich begrenzt.',
    ),
    f(
      'ge:k6:buerger-stadt:erziehung',
      'Wie wurden Stadtbürgerkinder oft auf ihren Status vorbereitet?',
      'Durch Lehre, Schule und Einübung in Beruf und Stadtordnung',
      ['Nur durch Gladiatorenkämpfe', 'Nur durch Isolation', 'Nur durch Fabrikarbeit'],
      'Erziehung in Stadt und Zunft.',
      'Lehrlinge, Lateinschulen und Hausunterricht bereiteten auf Beruf und Bürgerpflichten vor. Erziehung sicherte den Fortbestand des Bürgerstatus.',
    ),
    f(
      'ge:k6:buerger-stadt:grenze',
      'Wer war in der Stadt oft kein voller Bürger?',
      'Arme, Zugezogene ohne Recht und unfreie Personen',
      ['Nur Ratsmitglieder', 'Nur Kaufleute', 'Nur Handwerker'],
      'Auch Städte kannten Ausschluss.',
      'Nicht jeder Stadtbewohner war Bürger. Recht, Besitz und Herkunft entschieden über Teilhabe.',
    ),
  ],
  pairs: [
    p('Zunft', 'Berufsverband der Handwerker', 'Regelt Ausbildung und Rechte.'),
    p('Stadtrecht', 'Regelwerk der Stadt', 'Schützt Bürger und Handel.'),
    p('Rat', 'Führungsgremium der Stadt', 'Oft wohlhabende Bürger.'),
    p('Lehrling', 'Auszubildender im Handwerk', 'Weg in den Bürgerberuf.'),
    p('Markt', 'Handelsplatz der Stadt', 'Wirtschaftliche Grundlage.'),
    p('Freiheit', 'Persönliche Unabhängigkeit', 'Gegensatz zur Hörigkeit.'),
  ],
  trueFalse: [
    tf(
      'ge:k6:buerger-stadt:tf1',
      '„Stadtluft macht frei“ bedeutet, dass Städte im Mittelalter oft mehr Freiheit boten als die Grundherrschaft.',
      true,
      'Land–Stadt-Unterschied.',
      'Die Formel beschreibt relative Freiheit, nicht absolute Gleichheit aller Stadtbewohner.',
    ),
    tf(
      'ge:k6:buerger-stadt:tf2',
      'Jeder Einwohner einer mittelalterlichen Stadt war automatisch Ratsherr.',
      false,
      'Status war gestuft.',
      'Nur ein Teil der Bewohner hatte volle Bürger- und Mitwirkungsrechte.',
    ),
  ],
}

export const GESCHICHTE_LAENGSSCHNITT_GENERATORS: Record<string, Topic['generate']> = {
  'ge-k5-lb4-ressourcen': bankGenerate(geK5NaturRessourcen),
  'ge-k5-lb4-landschaft': bankGenerate(geK5NaturRessourcen),
  'ge-k6-lb4-polis': bankGenerate(geK6BuergerPolis),
  'ge-k6-lb4-rom': bankGenerate(geK6BuergerRom),
  'ge-k6-lb4-stadt': bankGenerate(geK6BuergerStadt),
  'ge-k6-lb4-vergleich': bankGenerate(geK6BuergerPolis),
  'ge-k7-lb4-gottesgnade': bankGenerate(geK7Gottesgnadentum),
  'ge-k7-lb4-verfassung': bankGenerate(geK7Gottesgnadentum),
  'ge-k8-lb3-schutzgesetze': bankGenerate(geK8KinderarbeitReform),
  'ge-k8-lb3-schule': bankGenerate(geK8KinderarbeitReform),
}
