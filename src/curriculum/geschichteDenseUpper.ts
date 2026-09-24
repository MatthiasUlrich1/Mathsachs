/**
 * Dense Geschichte subtopics K7–Oberstufe (Sachsen Lehrplan lplanid=65).
 * Inspiration: Schlaukopf/Klett/Wikipedia DE — Formulierungen original.
 */
import { bankGenerate, type BioBank } from './biologieBank'
import type { Topic } from './types'

const fact = (
  concept: string,
  prompt: string,
  answer: string,
  wrong: [string, string, string],
  explanation: string,
  wissen: string,
  gap: string,
  gapAccepted: string[],
) => ({ concept, prompt, answer, wrong, explanation, wissen, gap, gapAccepted })

const pair = (concept: string, term: string, meaning: string, wissen: string) => ({
  concept, term, meaning, wissen,
})

const tf = (
  concept: string,
  statement: string,
  correct: boolean,
  explanation: string,
  wissen: string,
) => ({ concept, statement, correct, explanation, wissen })

const k7_lb1_renaissance: BioBank = {
  quelle: 'Wikipedia: Renaissance',
  url: 'https://de.wikipedia.org/wiki/Renaissance',
  conceptPrefix: 'ge:k7:renaissance',
  facts: [
    fact('humanismus', 'Was betonte der Humanismus besonders?', 'Bildung, Antike und die Würde des Menschen', ['Nur Kriegsführung ohne Bildung', 'Nur Ablehnung jeder Schrift', 'Nur industrielle Massenproduktion'], 'Humanisten studierten antike Texte und förderten Bildung.', 'Humanisten studierten antike Texte und förderten Bildung. Humanisten studierten antike Texte und förderten Bildung. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Der Humanismus betonte Bildung und die Würde des ___.', ['Menschen']),
    fact('renaissance', 'Was meint „Renaissance“ wörtlich?', 'Wiedergeburt — hier der Antike in Kunst und Denken', ['Nur Untergang der Antike', 'Nur Beginn der Steinzeit', 'Nur Gründung des Völkerbunds'], 'Der Begriff beschreibt kulturelle Erneuerung.', 'Der Begriff beschreibt kulturelle Erneuerung. Der Begriff beschreibt kulturelle Erneuerung. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Renaissance bedeutet wörtlich ___.', ['Wiedergeburt']),
    fact('kunst', 'Welche Kunstmerkmale sind typisch?', 'Perspektive, Naturbeobachtung und idealisierte Körper', ['Nur Maschinenpläne', 'Nur gotische Spitzbögen ohne Figur', 'Nur Werbeplakate'], 'Malerei und Skulptur entwickelten neue Techniken.', 'Malerei und Skulptur entwickelten neue Techniken. Malerei und Skulptur entwickelten neue Techniken. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Renaissancekunst nutzte oft die Zentral___.', ['perspektive', 'Perspektive']),
    fact('druck', 'Warum war der Buchdruck wichtig?', 'Texte konnten schneller und weiter verbreitet werden', ['Bücher wurden verboten', 'Niemand wollte lesen', 'Nur Bilder zählten'], 'Gedruckte Bücher beschleunigten Wissensverbreitung.', 'Gedruckte Bücher beschleunigten Wissensverbreitung. Gedruckte Bücher beschleunigten Wissensverbreitung. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Der Buchdruck beschleunigte die ___ von Texten.', ['Verbreitung']),
    fact('italien', 'Warum spielte Italien eine Vorreiterrolle?', 'Wohlhabende Städte und Fürsten förderten Kunst und Gelehrsamkeit', ['Italien war industrialisiert', 'Dort begann der Erste Weltkrieg', 'Dort wurde der Sozialismus gegründet'], 'Handelsstädte wie Florenz finanzierten Kunst.', 'Handelsstädte wie Florenz finanzierten Kunst. Handelsstädte wie Florenz finanzierten Kunst. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Italienische Städte förderten Kunst und ___.', ['Gelehrsamkeit', 'Bildung']),
    fact('weltbild', 'Wie veränderte sich das Menschenbild?', 'Der Mensch rückte als denkendes Wesen stärker in den Mittelpunkt', ['Nur Götter zählten', 'Nur Maschinen bestimmten alles', 'Nur Völkerrecht ohne Kultur'], 'Individualität und Bildung gewannen an Wert.', 'Individualität und Bildung gewannen an Wert. Individualität und Bildung gewannen an Wert. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Der Mensch rückte stärker in den ___.', ['Mittelpunkt']),
    fact('wissenschaft', 'Welche wissenschaftlichen Ansätze wuchsen?', 'Beobachtung, Mathematik und Experimente neben Tradition', ['Ablehnung jeder Messung', 'Magie ohne Beobachtung', 'Nur Kriegspropaganda'], 'Gelehrte prüften Natur genauer.', 'Gelehrte prüften Natur genauer. Gelehrte prüften Natur genauer. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Wissenschaft setzte auf Beobachtung und ___.', ['Experimente', 'Mathematik']),
    fact('sachsen', 'Warum relevant für Sachsen?', 'Ideen beeinflussten später Reformation und Bildung', ['Sachsen existierte nur in der Steinzeit', 'Renaissance betraf nur Asien', 'Sachsen kannte keine Schulen'], 'Kulturelle Strömungen erreichten deutsche Territorien.', 'Kulturelle Strömungen erreichten deutsche Territorien. Kulturelle Strömungen erreichten deutsche Territorien. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Ideen beeinflussten später Bildung und ___ in Sachsen.', ['Reformation']),
  ],
  pairs: [
    pair('p1', 'Humanismus', 'Bildung und Menschenwürde', 'Antike als Vorbild'),
    pair('p2', 'Renaissance', 'Kulturelle Wiedergeburt', 'Kunst und Denken'),
    pair('p3', 'Buchdruck', 'Schnellere Textverbreitung', 'Verändert Debatte'),
  ],
  trueFalse: [
    tf('t1', 'Die Renaissance betonte Antike, Kunst und ein neues Menschenbild.', true, 'Kulturelle Erneuerung ist Kennzeichen.', 'Kulturelle Erneuerung ist Kennzeichen. Humanismus und Kunst hängen zusammen. Italien war ein Zentrum.'),
  ],
}

const k7_lb1_entdeckungen: BioBank = {
  quelle: 'Wikipedia: Zeitalter der Entdeckungen',
  url: 'https://de.wikipedia.org/wiki/Zeitalter_der_Entdeckungen',
  conceptPrefix: 'ge:k7:entdeckungen',
  facts: [
    fact('motive', 'Motive europäischer Entdeckungsfahrten?', 'Handel, Macht, Mission und Technik', ['Ablehnung der Seefahrt', 'Nur Olympia', 'Nur Smartphones'], 'Gewürze, Gold und Konkurrenz spielten eine Rolle.', 'Gewürze, Gold und Konkurrenz spielten eine Rolle. Gewürze, Gold und Konkurrenz spielten eine Rolle. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Motive waren Handel, Macht und ___.', ['Mission', 'Technik']),
    fact('kolumbus', 'Was erreichte Kolumbus 1492?', 'Landung in der Karibik und dauerhaften Kontakt Europa–Amerika', ['Völkerbund-Gründung', 'Ende des Dreißigjährigen Kriegs', 'Erfindung des Buchdrucks'], 'Die Fahrt veränderte die Weltgeschichte.', 'Die Fahrt veränderte die Weltgeschichte. Die Fahrt veränderte die Weltgeschichte. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', '1492 landete Kolumbus in der ___.', ['Karibik']),
    fact('folgen', 'Folgen für indigene Völker?', 'Gewalt, Krankheiten, Ausbeutung und Kulturzerstörung', ['Sofortige Gleichberechtigung', 'Nur friedliche Geschenke', 'Keine Veränderungen'], 'Epidemien und Zwangsherrschaft waren verheerend.', 'Epidemien und Zwangsherrschaft waren verheerend. Epidemien und Zwangsherrschaft waren verheerend. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Indigene litten unter Gewalt und ___.', ['Krankheiten', 'Ausbeutung']),
    fact('global', 'Was meint globale Verflechtung?', 'Dauerhafte Verbindung der Kontinente durch Handel und Herrschaft', ['Keine Kontakte', 'Nur Isolation Europas', 'Nur lokale Geschichte'], 'Waren, Menschen und Ideen zirkulierten weltweit.', 'Waren, Menschen und Ideen zirkulierten weltweit. Waren, Menschen und Ideen zirkulierten weltweit. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Entdeckungen verbanden Kontinente durch Handel und ___.', ['Herrschaft']),
    fact('handel', 'Welche Handelsnetze entstanden?', 'Atlantischer und globaler Handel inklusive Sklavenhandel', ['Nur lokaler Tausch', 'Nur Internet', 'Nur Binnenhandel'], 'Plantagenwirtschaft und Kolonialhandel wuchsen.', 'Plantagenwirtschaft und Kolonialhandel wuchsen. Plantagenwirtschaft und Kolonialhandel wuchsen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Es entstand ein ___ Handel über Ozeane.', ['globaler', 'atlantischer']),
    fact('urteil', 'Warum kritisches Urteil nötig?', '„Entdeckung“ meint oft europäische Sicht auf bewohnte Räume', ['Kritik sei verboten', 'Keine Quellen', 'Nur Feiern erlaubt'], 'Orte waren für indigene Völker keine leeren Räume.', 'Orte waren für indigene Völker keine leeren Räume. Orte waren für indigene Völker keine leeren Räume. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', '„Entdeckung“ spiegelt oft eine ___ Perspektive.', ['europäische']),
    fact('technik', 'Technische Hilfen?', 'Bessere Schiffe, Kompass und Navigation', ['Nur Smartphones', 'Nur Dampfmaschinen', 'Nur Atomuhren'], 'Karavellen und Seekarten erleichterten Fahrten.', 'Karavellen und Seekarten erleichterten Fahrten. Karavellen und Seekarten erleichterten Fahrten. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Fahrten brauchten bessere Schiffe und ___.', ['Navigation', 'Kompass']),
    fact('macht', 'Machtverschiebung in Europa?', 'Seefahrermächte gewannen zunächst Vorsprung', ['Alle Flotten verschwanden', 'Nur Binnenstaaten siegten', 'Macht blieb gleich'], 'Später folgten Niederlande, England und Frankreich.', 'Später folgten Niederlande, England und Frankreich. Später folgten Niederlande, England und Frankreich. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Seefahrermächte gewannen durch Kolonien an ___.', ['Macht', 'Einfluss']),
  ],
  pairs: [
    pair('p1', 'Karavelle', 'Seetüchtiges Schiff', 'Weite Fahrten'),
    pair('p2', 'Kolonialismus', 'Herrschaft über fremde Gebiete', 'Oft mit Gewalt'),
    pair('p3', 'Frühglobalisierung', 'Weltverflechtung', 'Handel verbindet Kontinente'),
  ],
  trueFalse: [
    tf('t1', 'Entdeckungsfahrten hatten für indigene Völker oft zerstörerische Folgen.', true, 'Gewalt und Krankheiten trafen hart.', 'Gewalt und Krankheiten trafen hart. Handel und Herrschaft verflochten die Welt. Kritik gehört zur Bewertung.'),
  ],
}

const k7_lb1_reformation_krieg: BioBank = {
  quelle: 'Wikipedia: Reformation',
  url: 'https://de.wikipedia.org/wiki/Reformation',
  conceptPrefix: 'ge:k7:reformation-krieg',
  facts: [
    fact('luther', 'Wofür steht Luther?', 'Kritik am Ablass und Reform der Kirche', ['Völkerbund-Gründung', 'Abschaffung jeder Religion', 'Industrielle Revolution'], '1517 löste er eine breite Bewegung aus.', '1517 löste er eine breite Bewegung aus. 1517 löste er eine breite Bewegung aus. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Luther kritisierte die ___praxis.', ['Ablass']),
    fact('konfession', 'Was entstand politisch-religiös?', 'Konkurrierende Konfessionen und Machtkonflikte', ['Eine Weltreligion ohne Staaten', 'Sofortige EU', 'Nur atheistische Staaten'], 'Protestantismus und Katholizismus standen sich gegenüber.', 'Protestantismus und Katholizismus standen sich gegenüber. Protestantismus und Katholizismus standen sich gegenüber. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Es entstanden konkurrierende ___.', ['Konfessionen']),
    fact('krieg', 'Was war der Dreißigjährige Krieg?', 'Langer Konflikt 1618–1648 mit Religion und Macht', ['Kurzer Handelsstreit', 'Nur Olympia', 'Nur Kolonialkrieg'], 'Mitteleuropa litt unter Zerstörung und Seuchen.', 'Mitteleuropa litt unter Zerstörung und Seuchen. Mitteleuropa litt unter Zerstörung und Seuchen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Der Krieg dauerte bis ___.', ['1648']),
    fact('westfalen', 'Was brachte der Westfälische Frieden?', 'Friedensordnung mit konfessioneller Vielfalt', ['Sofortige Demokratie', 'Abschaffung aller Staaten', 'Rückkehr Steinzeit'], 'Souveränität der Staaten wuchs.', 'Souveränität der Staaten wuchs. Souveränität der Staaten wuchs. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', '1648 entstand eine neue Friedens___.', ['ordnung']),
    fact('folgen', 'Folgen für die Bevölkerung?', 'Hunger, Seuchen, Verluste und Zerstörung', ['Sofortiger Wohlstand', 'Nur kulturelle Blüte', 'Keine Änderung'], 'Alltag war von Not geprägt.', 'Alltag war von Not geprägt. Alltag war von Not geprägt. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die Bevölkerung litt unter Hunger und ___.', ['Seuchen', 'Zerstörung']),
    fact('sachsen', 'Rolle Sachsens?', 'Reformatorisches Kernland und später kriegsbetroffen', ['Weltraumstaat', 'NATO-Gründer', 'Nur Mittelalter ohne Reformation'], 'Kursachsen förderte früh evangelische Lehre.', 'Kursachsen förderte früh evangelische Lehre. Kursachsen förderte früh evangelische Lehre. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Sachsen war Kernland der ___.', ['Reformation']),
    fact('augsburg', 'Augsburger Religionsfrieden 1555?', 'Landesherren bestimmten die Konfession', ['Alle Kriege endeten für immer', 'Nur Städte regierten', 'Papst abgesetzt'], 'Ein vorläufiger Modus vivendi entstand.', 'Ein vorläufiger Modus vivendi entstand. Ein vorläufiger Modus vivendi entstand. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', '1555 regelte Augsburg die ___ der Landesherren.', ['Konfession']),
    fact('macht', 'Warum Religions- und Machtkonflikt?', 'Konfession beeinflusste Herrschaft und Bündnisse', ['Religion nie politisch', 'Nur Kunst zählte', 'Fürsten ohne Macht'], 'Kirche und Staat waren eng verknüpft.', 'Kirche und Staat waren eng verknüpft. Kirche und Staat waren eng verknüpft. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Konfession beeinflusste Herrschaft und ___.', ['Bündnisse']),
  ],
  pairs: [
    pair('p1', 'Ablass', 'Erlass von Sündenstrafen', 'Kritikpunkt Luthers'),
    pair('p2', 'Konfession', 'Religiöse Richtung', 'Protestantisch/katholisch'),
    pair('p3', 'Westfälischer Frieden', 'Ordnung 1648', 'Kriegsende'),
  ],
  trueFalse: [
    tf('t1', 'Der Dreißigjährige Krieg verband religiöse und machtpolitische Konflikte.', true, 'Konfession und Herrschaft waren verknüpft.', 'Konfession und Herrschaft waren verknüpft. Die Bevölkerung litt schwer. 1648 endete der Krieg.'),
  ],
}

const k7_lb2_absolutismus_frankreich: BioBank = {
  quelle: 'Wikipedia: Absolutismus',
  url: 'https://de.wikipedia.org/wiki/Absolutismus',
  conceptPrefix: 'ge:k7:abs-fr',
  facts: [
    fact('ludwig', 'Wofür steht Ludwig XIV.?', 'Absolutistische Herrschaft mit zentraler Königsgewalt', ['Parlamentarische Demokratie', 'Räterepublik', 'Steinzeit-Häuptling'], 'Er gilt als Inbegriff des Sonnenkönigs.', 'Er gilt als Inbegriff des Sonnenkönigs. Er gilt als Inbegriff des Sonnenkönigs. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Ludwig XIV. steht für ___ Herrschaft.', ['absolutistische']),
    fact('versailles', 'Funktion von Versailles?', 'Hof, Repräsentation und Kontrolle des Adels', ['Nur moderne Fabrik', 'Nur Universität', 'Nur Sportlager'], 'Prachtbauten zeigten Herrschaftsanspruch.', 'Prachtbauten zeigten Herrschaftsanspruch. Prachtbauten zeigten Herrschaftsanspruch. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Versailles diente der ___ von Macht.', ['Repräsentation', 'Kontrolle']),
    fact('merkantil', 'Was meint Merkantilismus?', 'Staatliche Wirtschaftspolitik für Handel und Staatskasse', ['Ablehnung jedes Handels', 'Nur Wildbeuterwirtschaft', 'Nur Sozialismus 20. Jh.'], 'Export und Manufakturen wurden gefördert.', 'Export und Manufakturen wurden gefördert. Export und Manufakturen wurden gefördert. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Merkantilismus stärkt Handel und Staat___.', ['skasse']),
    fact('heer', 'Bedeutung des stehenden Heeres?', 'Macht nach innen und Kriegführung nach außen', ['Nur symbolisch', 'Ersetzt jede Verwaltung', 'Nur Sport'], 'Soldaten banden Ressourcen.', 'Soldaten banden Ressourcen. Soldaten banden Ressourcen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Das stehende Heer sicherte Macht und ___.', ['Kriegführung']),
    fact('grenzen', 'Grenzen absolutistischer Macht?', 'Finanzen, lokale Gewohnheiten, Durchsetzung', ['Absolut keine Grenzen', 'Nur Smartphones', 'Nur Wetter'], 'Vollständige Kontrolle war Illusion.', 'Vollständige Kontrolle war Illusion. Vollständige Kontrolle war Illusion. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Grenzen lagen u. a. bei den ___.', ['Finanzen']),
    fact('hof', 'Wie diente der Hof?', 'Zeremoniell, Gunstverteilung, Sichtbarkeit des Königs', ['Abschaffung jeder Etikette', 'Nur Geheimhaltung', 'Nur Industrie'], 'Nähe zum König bedeutete Einfluss.', 'Nähe zum König bedeutete Einfluss. Nähe zum König bedeutete Einfluss. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Der Hof steuerte den Adel durch ___.', ['Zeremoniell', 'Gunst']),
    fact('rechte', 'Welche Rechte beanspruchte der König?', 'Gesetzgebung, Verwaltung, Krieg ohne starke Mitbestimmung', ['Nur Beratung', 'Wöchentliche Volkswahl', 'Nur religiöse Ohnmacht'], 'Stände wurden zurückgedrängt.', 'Stände wurden zurückgedrängt. Stände wurden zurückgedrängt. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Der König beanspruchte oberste ___.', ['Gesetzgebung', 'Gewalt']),
    fact('urteil', 'Warum kein Allmachtsmärchen?', 'Praktische Grenzen und lokale Macht blieben', ['Könige konnten alles magisch', 'Keine Quellen', 'Immer Demokratie'], 'Anspruch und Wirklichkeit klaffen.', 'Anspruch und Wirklichkeit klaffen. Anspruch und Wirklichkeit klaffen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Absolutismus zeigt Anspruch und ___.', ['Wirklichkeit']),
  ],
  pairs: [
    pair('p1', 'Sonnenkönig', 'Beiname Ludwigs XIV.', 'Zentrale Herrschaft'),
    pair('p2', 'Versailles', 'Hof und Machtzentrum', 'Repräsentation'),
    pair('p3', 'Merkantilismus', 'Staatliche Handelsförderung', 'Starke Staatskasse'),
  ],
  trueFalse: [
    tf('t1', 'Ludwig XIV. gilt als klassisches Beispiel absolutistischer Herrschaft.', true, 'Versailles und zentrale Gewalt prägen das Bild.', 'Versailles und zentrale Gewalt prägen das Bild. Der Adel wurde an den Hof gebunden. Grenzen der Macht blieben.'),
  ],
}

const k7_lb2_aufklaerung: BioBank = {
  quelle: 'Wikipedia: Aufklärung',
  url: 'https://de.wikipedia.org/wiki/Aufkl%C3%A4rung',
  conceptPrefix: 'ge:k7:aufklaerung',
  facts: [
    fact('vernunft', 'Zentrum der Aufklärung?', 'Vernunft, Kritik und selbstständiges Denken', ['Blinder Gehorsam', 'Magie ohne Kritik', 'Kriegspropaganda'], 'Kant forderte Mut zum eigenen Verstand.', 'Kant forderte Mut zum eigenen Verstand. Kant forderte Mut zum eigenen Verstand. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Aufklärung stellt ___ ins Zentrum.', ['Vernunft']),
    fact('kritik', 'Worauf richtete sich Kritik?', 'Herrschaft, Kirche und Vorrechte', ['Nur Wetter', 'Nur Apps', 'Nur Sport'], 'Privilegien wurden hinterfragt.', 'Privilegien wurden hinterfragt. Privilegien wurden hinterfragt. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Kritik richtete sich auf Herrschaft und ___.', ['Kirche', 'Vorrechte']),
    fact('rechte', 'Ideen für Menschenrechte?', 'Freiheit, Gleichheit vor dem Recht, Würde', ['Nur Leibeigenschaft', 'Nur Willkür', 'Nur Sklaverei'], 'Naturrechtliche Argumente wurden stark.', 'Naturrechtliche Argumente wurden stark. Naturrechtliche Argumente wurden stark. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Ideen von Freiheit und ___ gewannen.', ['Gleichheit', 'Würde']),
    fact('oeffentlichkeit', 'Bürgerliche Öffentlichkeit?', 'Räume und Medien öffentlicher Debatte', ['Nur Geheimkabinette', 'Nur Militärlager', 'Nur Klöster'], 'Salons und Zeitschriften zählten.', 'Salons und Zeitschriften zählten. Salons und Zeitschriften zählten. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Öffentlichkeit meint öffentliche ___.', ['Debatte', 'Diskussion']),
    fact('toleranz', 'Warum religiöse Toleranz?', 'Glaubenszwang galt als unvereinbar mit Vernunft', ['Toleranz abgelehnt', 'Religion verschwand', 'Nur Krieg'], 'Vielfalt sollte friedlich möglich sein.', 'Vielfalt sollte friedlich möglich sein. Vielfalt sollte friedlich möglich sein. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Aufklärer kritisierten religiösen ___.', ['Zwang']),
    fact('bildung', 'Rolle der Bildung?', 'Mündigkeit und Fortschritt ermöglichen', ['Denken verhindern', 'Völlig unwichtig', 'Nur Aberglaube'], 'Schulen und Akademien wurden gefördert.', 'Schulen und Akademien wurden gefördert. Schulen und Akademien wurden gefördert. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Bildung sollte ___ ermöglichen.', ['Mündigkeit', 'Fortschritt']),
    fact('absolutismus', 'Verhältnis zum Absolutismus?', 'Teils Kritik, teils Hoffnung auf Reform von oben', ['Nur blinde Loyalität', 'Nie politisch', 'Nur Ablehnung jeder Reform'], 'Aufgeklärter Absolutismus ist Schlagwort.', 'Aufgeklärter Absolutismus ist Schlagwort. Aufgeklärter Absolutismus ist Schlagwort. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Es gab Kritik und Hoffnung auf Reform von ___.', ['oben']),
    fact('wirkung', 'Spätere Wirkung?', 'Revolutionen und Verfassungsforderungen', ['Rückkehr Steinzeit', 'Abschaffung Schrift', 'Industrielle Isolation'], 'Ideen wirkten über Europa hinaus.', 'Ideen wirkten über Europa hinaus. Ideen wirkten über Europa hinaus. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Aufklärung beeinflusste Forderungen nach ___.', ['Verfassung', 'Revolution']),
  ],
  pairs: [
    pair('p1', 'Vernunft', 'Kritisches Denken', 'Kernidee'),
    pair('p2', 'Öffentlichkeit', 'Öffentliche Debatte', 'Presse und Salons'),
    pair('p3', 'Toleranz', 'Duldung von Überzeugungen', 'Gegen Glaubenszwang'),
  ],
  trueFalse: [
    tf('t1', 'Die Aufklärung betonte Vernunft, Kritik und Mündigkeit.', true, 'Selbst denken wurde Leitidee.', 'Selbst denken wurde Leitidee. Herrschaft und Kirche wurden kritisiert. Ideen wirkten auf Revolutionen.'),
  ],
}

const k7_lb2_preussen_sachsen: BioBank = {
  quelle: 'Wikipedia: Preußen',
  url: 'https://de.wikipedia.org/wiki/Preu%C3%9Fen',
  conceptPrefix: 'ge:k7:preussen-sachsen',
  facts: [
    fact('preussen', 'Preußen im Absolutismus?', 'Militärstaat, Verwaltung und Machtkonkurrenz', ['Reine Seemacht ohne Heer', 'Demokratie ohne König', 'Nur kulturelle Isolation'], 'Friedrich II. prägte das Bild.', 'Friedrich II. prägte das Bild. Friedrich II. prägte das Bild. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Preußen galt als ___staat.', ['Militär']),
    fact('friedrich', 'Friedrich II. grob?', 'Kriege um Macht und aufklärerische Selbstinszenierung', ['Nur Ablehnung jeder Reform', 'Nur pazifistische Neutralität', 'Nur Leibeigenschaft ohne Staat'], 'Er führte Schlesienkriege.', 'Er führte Schlesienkriege. Er führte Schlesienkriege. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Friedrich II. verband Kriege und ___ Selbstbild.', ['aufklärerisches']),
    fact('sachsen', 'Lage Sachsens?', 'Kurfürstliches Territorium zwischen Großmächten mit Hofkultur', ['Kolonie Amerikas', 'Teil des Osmanischen Reichs', 'Nur Industrienation ohne Hof'], 'Dresden wurde kulturelles Zentrum.', 'Dresden wurde kulturelles Zentrum. Dresden wurde kulturelles Zentrum. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Sachsen lag zwischen europäischen ___.', ['Großmächten']),
    fact('rivalitaet', 'Warum Rivalität Preußen–Sachsen?', 'Territorien, Rang und Einfluss im Reich', ['Weltraumkolonien', 'Nur Olympia', 'Ablehnung jeder Politik'], 'Der Siebenjährige Krieg betraf beide.', 'Der Siebenjährige Krieg betraf beide. Der Siebenjährige Krieg betraf beide. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Rivalität betraf Territorien und ___.', ['Einfluss', 'Rang']),
    fact('verwaltung', 'Warum Verwaltung zentral?', 'Steuern, Heer und Recht einheitlicher organisieren', ['Verwaltung überflüssig', 'Nur Chaos sichert Herrschaft', 'Keine Beamten nötig'], 'Beamte setzten Politik um.', 'Beamte setzten Politik um. Beamte setzten Politik um. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Verwaltung organisierte Steuern und ___.', ['Heer', 'Recht']),
    fact('militaer', 'Bedeutung des Militärs in Preußen?', 'Rückgrat der Macht und Gesellschaftsbild', ['Bedeutungslos', 'Ersetzt jede Kultur', 'Nur Handel'], 'Disziplin wurde Tugend.', 'Disziplin wurde Tugend. Disziplin wurde Tugend. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Das Militär war Rückgrat preußischer ___.', ['Macht']),
    fact('kultur', 'Kulturelle Rolle Sachsens?', 'Hof, Musik und Kunst machten Dresden berühmt', ['Ablehnung jeder Kunst', 'Nur Industrie ohne Kultur', 'Nur römische Legionen'], 'August der Starke prägte das Bild.', 'August der Starke prägte das Bild. August der Starke prägte das Bild. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Dresden wurde für ___ und Kunst berühmt.', ['Musik', 'Hofkultur']),
    fact('vergleich', 'Nutzen des Vergleichs?', 'Unterschiedliche Wege absolutistischer Staaten sichtbar machen', ['Beide waren identisch', 'Geschichte egal', 'Nur Wetter vergleichen'], 'Militärstaat versus Hofkultur hilft zur Orientierung.', 'Militärstaat versus Hofkultur hilft zur Orientierung. Militärstaat versus Hofkultur hilft zur Orientierung. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Der Vergleich macht unterschiedliche ___ sichtbar.', ['Wege', 'Profile']),
  ],
  pairs: [
    pair('p1', 'Friedrich II.', 'Preußischer König', 'Kriege und Aufklärungsbild'),
    pair('p2', 'Kursachsen', 'Hofkultur und Territorium', 'Dresden als Zentrum'),
    pair('p3', 'Militärstaat', 'Macht über Heer', 'Preußenbild'),
  ],
  trueFalse: [
    tf('t1', 'Preußen und Sachsen rivalisierten mit unterschiedlicher Prägung.', true, 'Militär und Hofkultur sind Vergleichspunkte.', 'Militär und Hofkultur sind Vergleichspunkte. Kriege betrafen beide. Regionalgeschichte wird greifbar.'),
  ],
}

const k8_lb1_napoleon_wiener: BioBank = {
  quelle: 'Wikipedia: Wiener Kongress',
  url: 'https://de.wikipedia.org/wiki/Wiener_Kongress',
  conceptPrefix: 'ge:k8:napoleon-wiener',
  facts: [
    fact('napoleon', 'Wirkung Napoleons auf deutsche Staaten?', 'Kriegszüge, Rheinbund und Ende des Alten Reichs', ['EU-Gründung', 'Abschaffung jeder Verwaltung', 'Rückkehr Steinzeit'], '1806 endete das Heilige Römische Reich.', '1806 endete das Heilige Römische Reich. 1806 endete das Heilige Römische Reich. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Napoleon bewirkte das Ende des Alten ___.', ['Reichs']),
    fact('befreiung', 'Was waren die Befreiungskriege?', 'Kämpfe gegen napoleonische Herrschaft ab 1813', ['Nur Handelsmessen', 'Nur Olympia', 'Nur Kolonialkriege'], 'Viele hofften auf Freiheit und Einheit.', 'Viele hofften auf Freiheit und Einheit. Viele hofften auf Freiheit und Einheit. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Befreiungskriege richteten sich gegen ___ Herrschaft.', ['napoleonische']),
    fact('wiener', 'Ziel des Wiener Kongresses 1814/15?', 'Stabile Ordnung Europas unter Führung der Großmächte', ['Sofortige Demokratie überall', 'Abschaffung aller Monarchien', 'Nur Handelsfreiheit'], 'Gleichgewicht und Legitimität waren Leitideen.', 'Gleichgewicht und Legitimität waren Leitideen. Gleichgewicht und Legitimität waren Leitideen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Der Kongress suchte eine stabile ___.', ['Ordnung']),
    fact('bund', 'Was war der Deutsche Bund?', 'Staatenbund deutscher Territorien', ['Einheitlicher Nationalstaat', 'Kolonie Frankreichs', 'Nur Wirtschaftsverein'], 'Souveräne Staaten blieben bestehen.', 'Souveräne Staaten blieben bestehen. Souveräne Staaten blieben bestehen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Der Deutsche Bund war ein ___.', ['Staatenbund']),
    fact('restauration', 'Was meint Restauration?', 'Wiederherstellung dynastischer Ordnung', ['Nur industrielle Modernisierung', 'Nur demokratische Republik', 'Abschaffung der Monarchie'], 'Fürsten sicherten ihre Macht.', 'Fürsten sicherten ihre Macht. Fürsten sicherten ihre Macht. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Restauration meint Wiederherstellung alter ___.', ['Ordnung', 'Dynastien']),
    fact('metternich', 'Politik Metternichs?', 'Konservative Stabilität und Überwachung der Opposition', ['Radikale Demokratie', 'Sofortige deutsche Republik', 'Nur Abrüstung ohne Staat'], 'Karlsbader Beschlüsse sind Stichwort.', 'Karlsbader Beschlüsse sind Stichwort. Karlsbader Beschlüsse sind Stichwort. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Metternich steht für konservative ___.', ['Stabilitätspolitik', 'Überwachung']),
    fact('enttaeuschung', 'Warum Liberale enttäuscht?', 'Einheit und Verfassung blieben aus', ['Sofortiges gesamtdeutsches Parlament', 'Napoleon siegte dauerhaft', 'Der Bund war Demokratie'], 'Hoffnungen der Befreiungskriege wurden enttäuscht.', 'Hoffnungen der Befreiungskriege wurden enttäuscht. Hoffnungen der Befreiungskriege wurden enttäuscht. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Es fehlten nationale Einheit und ___.', ['Verfassung']),
    fact('sachsen', 'Folge 1815 für Sachsen?', 'Gebietsverlust an Preußen, Monarchie im Bund', ['Sofortige Republik', 'Anschluss an USA', 'Auflösung ohne Nachfolger'], 'Sachsen blieb Königreich, aber verkleinert.', 'Sachsen blieb Königreich, aber verkleinert. Sachsen blieb Königreich, aber verkleinert. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Sachsen verlor 1815 Gebiete an ___.', ['Preußen']),
  ],
  pairs: [
    pair('p1', 'Wiener Kongress', 'Neuordnung 1814/15', 'Gleichgewicht'),
    pair('p2', 'Deutscher Bund', 'Staatenbund nach 1815', 'Keine Nation'),
    pair('p3', 'Restauration', 'Dynastische Ordnung', 'Gegen Revolution'),
  ],
  trueFalse: [
    tf('t1', 'Der Wiener Kongress stellte eine konservative Ordnung her.', true, 'Der Deutsche Bund war kein Nationalstaat.', 'Der Deutsche Bund war kein Nationalstaat. Restauration sicherte Fürsten. Liberale blieben enttäuscht.'),
  ],
}

const k8_lb1_vormaerz_1848: BioBank = {
  quelle: 'Wikipedia: Deutsche Revolution 1848/1849',
  url: 'https://de.wikipedia.org/wiki/Deutsche_Revolution_1848/1849',
  conceptPrefix: 'ge:k8:vormaerz-1848',
  facts: [
    fact('vormaerz', 'Kennzeichen des Vormärz?', 'Forderungen nach Freiheit und Einheit unter Überwachung', ['Ruhe ohne Kritik', 'Sofortige Demokratie ohne Konflikt', 'Nur Isolation'], 'Opposition wurde beobachtet.', 'Opposition wurde beobachtet. Opposition wurde beobachtet. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Vormärz meint Forderungen unter ___.', ['Überwachung']),
    fact('1848', 'Forderungen 1848?', 'Grundrechte, Verfassungen und nationale Einheit', ['Rückkehr zur Leibeigenschaft', 'Mehr Absolutismus', 'Abschaffung aller Zeitungen'], 'Märzforderungen sind ein Begriff.', 'Märzforderungen sind ein Begriff. Märzforderungen sind ein Begriff. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', '1848 forderte man Grundrechte und ___.', ['Einheit', 'Verfassung']),
    fact('paulskirche', 'Paulskirchenversammlung?', 'Beratung über gesamtdeutsche Verfassung und Grundrechte', ['Völkerbund-Gründung', 'Ende des Ersten Weltkriegs', 'Erfindung des Buchdrucks'], 'Frankfurt wurde Symbol parlamentarischen Versuchs.', 'Frankfurt wurde Symbol parlamentarischen Versuchs. Frankfurt wurde Symbol parlamentarischen Versuchs. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'In der Paulskirche beriet die National___.', ['versammlung']),
    fact('scheitern', 'Warum Scheitern?', 'Uneinigkeit, Gegenrevolution, fehlende Machtmittel', ['Zu starke Demokratie', 'Fürsten dankten alle ab', 'Europa half und siegte für Liberale'], 'Militär blieb bei den Fürsten.', 'Militär blieb bei den Fürsten. Militär blieb bei den Fürsten. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die Revolution scheiterte u. a. an ___.', ['Uneinigkeit', 'Gegenrevolution']),
    fact('grundrechte', 'Bedeutung der Grundrechte 1849?', 'Vorbild späterer Verfassungen trotz Scheiterns', ['Völlig wirkungslos für immer', 'Nur Sportregeln', 'Nur Amerika betraf'], 'Presse- und Glaubensfreiheit waren Themen.', 'Presse- und Glaubensfreiheit waren Themen. Presse- und Glaubensfreiheit waren Themen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Grundrechte wurden später zum ___.', ['Vorbild']),
    fact('sozial', 'Soziale Fragen?', 'Armut, Arbeitslosigkeit, Protest der Unterschichten', ['Nur Hofleben ohne Not', 'Nur Adelsfeste', 'Nur Kolonialluxus'], 'Hungerkrisen verstärkten Unruhe.', 'Hungerkrisen verstärkten Unruhe. Hungerkrisen verstärkten Unruhe. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Soziale Not verstärkte den ___.', ['Protest', 'Unruhe']),
    fact('national', 'Schwierige Nationalfrage?', 'Grenzen, Österreich und Preußen boten konkurrierende Lösungen', ['Nur eine klare Lösung', 'Nation egal', 'Nur Städte zählten'], 'Großdeutsch versus kleindeutsch.', 'Großdeutsch versus kleindeutsch. Großdeutsch versus kleindeutsch. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Nationalfrage: großdeutsch oder ___.', ['kleindeutsch']),
    fact('erbe', 'Erbe trotz Scheiterns?', 'Parlamentarische Debatte und Verfassungsforderungen', ['Sofortiger Nationalstaat 1849', 'Ende jeder Politik', 'Nur Vergessen'], '1848 wurde Erinnerungsort.', '1848 wurde Erinnerungsort. 1848 wurde Erinnerungsort. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Erbe blieb parlamentarischer ___.', ['Debatte', 'Forderungen']),
  ],
  pairs: [
    pair('p1', 'Vormärz', 'Zeit vor 1848', 'Opposition und Überwachung'),
    pair('p2', 'Paulskirche', 'Nationalversammlung', 'Verfassung'),
    pair('p3', 'Märzforderungen', 'Rechte und Einheit', 'Kern 1848'),
  ],
  trueFalse: [
    tf('t1', '1848/49 forderte Freiheit und Einheit, scheiterte aber weitgehend.', true, 'Fürsten und Uneinigkeit stoppten den Versuch.', 'Fürsten und Uneinigkeit stoppten den Versuch. Die Paulskirche bleibt Symbol. Grundrechte wirkten als Vorbild.'),
  ],
}

const k8_lb1_kaiserreich: BioBank = {
  quelle: 'Wikipedia: Deutsches Kaiserreich',
  url: 'https://de.wikipedia.org/wiki/Deutsches_Kaiserreich',
  conceptPrefix: 'ge:k8:kaiserreich',
  facts: [
    fact('gruendung', 'Reichsgründung 1871?', 'Einigung unter preußischer Führung nach Kriegen', ['Reine Volksabstimmung ohne Krieg', 'Wiener Kongress 1815', 'Versailles 1919'], 'Wilhelm I. wurde Kaiser.', 'Wilhelm I. wurde Kaiser. Wilhelm I. wurde Kaiser. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', '1871 entstand das Reich unter ___ Führung.', ['preußischer']),
    fact('verfassung', 'Verfassungsprägung?', 'Starkes Kaisertum, begrenzte parlamentarische Macht', ['Vollständige Demokratie', 'Reine Rätediktatur', 'Nur Städtebund'], 'Preußen dominierte den Bundesrat.', 'Preußen dominierte den Bundesrat. Preußen dominierte den Bundesrat. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die Verfassung gewährte dem Kaiser starke ___.', ['Macht', 'Stellung']),
    fact('bismarck', 'Bismarcks Innenpolitik?', 'Kulturkampf, Sozialistengesetz und Sozialversicherung', ['Sofortige Republik', 'Abschaffung des Militärs', 'Nur Kolonialverzicht'], 'Er integrierte und spaltete zugleich.', 'Er integrierte und spaltete zugleich. Er integrierte und spaltete zugleich. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Bismarck verband Repression und soziale ___.', ['Versicherung', 'Politik']),
    fact('militarismus', 'Rolle des Militarismus?', 'Heer und militärische Werte genossen hohes Ansehen', ['Militär bedeutungslos', 'Nur Pazifismus', 'Nur Handel ohne Armee'], 'Uniform und Disziplin waren Prestige.', 'Uniform und Disziplin waren Prestige. Uniform und Disziplin waren Prestige. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Im Kaiserreich genoss das ___ hohes Ansehen.', ['Militär', 'Heer']),
    fact('industrie', 'Reich und Industrialisierung?', 'Wirtschaftswachstum stärkte Macht und Wandel', ['Industrie verschwand', 'Nur Landwirtschaft', 'Nur Handwerk'], 'Städte explodierten.', 'Städte explodierten. Städte explodierten. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Industrialisierung stärkte Macht und ___.', ['Wandel', 'Wirtschaft']),
    fact('nation', 'Inszenierung der Nation?', 'Feste, Denkmäler und nationale Mythen', ['Ablehnung jeder Symbolik', 'Nur internationale Feiern', 'Vergessen der Geschichte'], 'Sedantag prägte Alltag.', 'Sedantag prägte Alltag. Sedantag prägte Alltag. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Nation wurde durch Feste und ___ inszeniert.', ['Denkmäler', 'Mythen']),
    fact('konflikte', 'Innere Konflikte?', 'Klassenkonflikte, Minderheiten, politische Spaltung', ['Vollkommene Harmonie', 'Nur Außenkriege', 'Keine Parteien'], 'Sozialdemokratie wuchs trotz Verbote.', 'Sozialdemokratie wuchs trotz Verbote. Sozialdemokratie wuchs trotz Verbote. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Trotz Nation blieben innere ___.', ['Konflikte', 'Spaltungen']),
    fact('ende', 'Ende des Kaiserreichs?', '1918 mit Niederlage und Novemberrevolution', ['1848', '1871 sofort wieder', '1949 DDR-Gründung'], 'Wilhelm II. dankte ab.', 'Wilhelm II. dankte ab. Wilhelm II. dankte ab. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Das Kaiserreich endete ___.', ['1918']),
  ],
  pairs: [
    pair('p1', 'Reichsgründung', '1871 unter Preußen', 'Einigung von oben'),
    pair('p2', 'Bismarck', 'Leitfigur', 'Innen- und Außenpolitik'),
    pair('p3', 'Obrigkeitsstaat', 'Starke Exekutive', 'Begrenzte Demokratie'),
  ],
  trueFalse: [
    tf('t1', 'Das Kaiserreich entstand 1871 als obrigkeitsstaatliche Einigung.', true, 'Parlamentarische Macht blieb begrenzt.', 'Parlamentarische Macht blieb begrenzt. Militarismus und Nation prägten das Bild. 1918 endete das Reich.'),
  ],
}

const k8_lb2_england: BioBank = {
  quelle: 'Wikipedia: Industrielle Revolution',
  url: 'https://de.wikipedia.org/wiki/Industrielle_Revolution',
  conceptPrefix: 'ge:k8:ind-england',
  facts: [
    fact('pionier', 'Warum England als Pionier?', 'Kohle, Kapital, Märkte und technische Innovationen kamen zusammen', ['Keine Rohstoffe', 'Kein Handel', 'Nur Agrarstaat ohne Technik'], 'Textilindustrie war Vorreiter.', 'Textilindustrie war Vorreiter. Textilindustrie war Vorreiter. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'England gilt als ___ der Industriellen Revolution.', ['Pionier', 'Vorreiter']),
    fact('dampf', 'Bedeutung der Dampfmaschine?', 'Antrieb unabhängig von Wasserläufen und Muskelkraft', ['Nur Dekoration', 'Nur Landwirtschaft ohne Fabrik', 'Nur Buchdruck'], 'Fabriken konnten flexibler entstehen.', 'Fabriken konnten flexibler entstehen. Fabriken konnten flexibler entstehen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die Dampfmaschine lieferte neuen ___.', ['Antrieb']),
    fact('fabriken', 'Was veränderte das Fabriksystem?', 'Arbeitsteilung, Maschinen und neue Zeitdisziplin', ['Nur Heimarbeit ohne Wandel', 'Abschaffung jeder Arbeit', 'Nur Handwerk ohne Maschinen'], 'Löhne und Arbeitszeiten wurden zentral.', 'Löhne und Arbeitszeiten wurden zentral. Löhne und Arbeitszeiten wurden zentral. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Das Fabriksystem brachte Maschinen und ___.', ['Arbeitsteilung', 'Disziplin']),
    fact('stadt', 'Folgen für Städte?', 'Schnelles Wachstum, Enge und neue soziale Probleme', ['Leere Städte', 'Nur Schlösser', 'Keine Migration'], 'Wohnungsnot und Hygieneprobleme wuchsen.', 'Wohnungsnot und Hygieneprobleme wuchsen. Wohnungsnot und Hygieneprobleme wuchsen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Städte wuchsen rasch und mit sozialen ___.', ['Problemen', 'Konflikten']),
    fact('rohstoffe', 'Welche Rohstoffe waren zentral?', 'Kohle und Eisen sowie Baumwolle für Textilien', ['Nur Sand', 'Nur Gold ohne Industrie', 'Nur Plastik'], 'Bergbau und Hütten wuchsen.', 'Bergbau und Hütten wuchsen. Bergbau und Hütten wuchsen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Zentrale Rohstoffe waren Kohle und ___.', ['Eisen', 'Baumwolle']),
    fact('weltmarkt', 'Verbindung zum Weltmarkt?', 'Exporte und Kolonialhandel stützten Wachstum', ['Kein Außenhandel', 'Nur Binnenisolation', 'Nur lokale Märkte'], 'Rohstoffe und Absatzmärkte waren global.', 'Rohstoffe und Absatzmärkte waren global. Rohstoffe und Absatzmärkte waren global. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Wachstum hing mit ___ und Kolonien zusammen.', ['Export', 'Weltmarkt']),
    fact('soziale', 'Soziale Frage in England?', 'Armut, Kinderarbeit und Proteste der Arbeiter', ['Sofortiger Wohlstand für alle', 'Keine Konflikte', 'Nur Adelsprobleme'], 'Gewerkschaften und Reformen folgten später.', 'Gewerkschaften und Reformen folgten später. Gewerkschaften und Reformen folgten später. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Arbeiter litten unter Armut und ___.', ['Kinderarbeit', 'Ausbeutung']),
    fact('transfer', 'Warum Vorbild für andere Länder?', 'Techniken und Organisationsformen wurden übernommen', ['Niemand interessierte sich', 'Technik blieb geheim für immer', 'Nur England konnte Industrie'], 'Deutschland und andere holten auf.', 'Deutschland und andere holten auf. Deutschland und andere holten auf. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Andere Länder übernahmen Technik und ___.', ['Organisation', 'Muster']),
  ],
  pairs: [
    pair('p1', 'Dampfmaschine', 'Neuer Antrieb', 'Fabrikstandorte flexibel'),
    pair('p2', 'Fabriksystem', 'Maschinen und Disziplin', 'Arbeitsteilung'),
    pair('p3', 'Kohle', 'Energieträger der Epoche', 'Bergbau wächst'),
  ],
  trueFalse: [
    tf('t1', 'England war Pionier der Industriellen Revolution.', true, 'Kohle, Kapital und Technik kamen zusammen.', 'Kohle, Kapital und Technik kamen zusammen. Fabriken veränderten Arbeit. Soziale Probleme folgten.'),
  ],
}

const k8_lb2_deutschland: BioBank = {
  quelle: 'Wikipedia: Industrialisierung',
  url: 'https://de.wikipedia.org/wiki/Industrialisierung',
  conceptPrefix: 'ge:k8:ind-deutschland',
  facts: [
    fact('spaeter', 'Industrialisierung in Deutschland?', 'Später als England, dann rasches Aufholen', ['Früher als England immer', 'Gar nicht', 'Nur nach 1990'], 'Eisenbahn und Schwerindustrie waren zentral.', 'Eisenbahn und Schwerindustrie waren zentral. Eisenbahn und Schwerindustrie waren zentral. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Deutschland holte gegenüber England ___.', ['auf']),
    fact('bahn', 'Rolle der Eisenbahn?', 'Transport, Märkte und Nachfrage nach Kohle und Stahl', ['Nur Freizeit ohne Wirtschaft', 'Keine Bedeutung', 'Nur Pferdekutschen zählten'], 'Regionen wurden verbunden.', 'Regionen wurden verbunden. Regionen wurden verbunden. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die Eisenbahn steigerte Transport und ___.', ['Nachfrage', 'Märkte']),
    fact('sachsen', 'Industrialisierung in Sachsen?', 'Früh industriell geprägt, Textil und Maschinenbau', ['Nie Industrie', 'Nur Agrar ohne Fabrik', 'Nur Tourismus'], 'Chemnitz und Leipzig sind Beispiele.', 'Chemnitz und Leipzig sind Beispiele. Chemnitz und Leipzig sind Beispiele. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Sachsen war früh ___ geprägt.', ['industriell']),
    fact('zollverein', 'Bedeutung des Zollvereins?', 'Wirtschaftlicher Zusammenschluss erleichterte Binnenmarkt', ['Zölle zwischen allen Staaten stiegen', 'Nur Kulturverein', 'Nur Militärpakt'], 'Handel innerhalb deutscher Staaten wuchs.', 'Handel innerhalb deutscher Staaten wuchs. Handel innerhalb deutscher Staaten wuchs. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Der Zollverein erleichterte den ___.', ['Binnenmarkt', 'Handel']),
    fact('leitsektoren', 'Wichtige Leitsektoren?', 'Textil, Kohle, Eisen/Stahl und später Chemie/Elektro', ['Nur Handstickerei', 'Nur Fischfang', 'Nur Softwaredienste 21. Jh.'], 'Schwerindustrie prägte das Ruhrgebiet.', 'Schwerindustrie prägte das Ruhrgebiet. Schwerindustrie prägte das Ruhrgebiet. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Leitsektoren waren u. a. Kohle und ___.', ['Stahl', 'Eisen']),
    fact('arbeiterschaft', 'Entstehung der Arbeiterschaft?', 'Lohnarbeit in Fabriken schuf neue Klasse', ['Keine Arbeiter', 'Nur Bauern ohne Wandel', 'Nur Beamte'], 'Wohnen und Alltag veränderten sich.', 'Wohnen und Alltag veränderten sich. Wohnen und Alltag veränderten sich. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Fabriken schufen eine neue ___.', ['Arbeiterschaft', 'Klasse']),
    fact('soziale-frage', 'Soziale Frage in DE?', 'Wohnungsnot, Niedriglöhne, Gesundheitsrisiken', ['Sofort Wohlstand für alle', 'Keine Armut', 'Nur Adelsarmut'], 'Arbeiterbewegung entstand.', 'Arbeiterbewegung entstand. Arbeiterbewegung entstand. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die soziale Frage betraf Löhne und ___.', ['Wohnung', 'Gesundheit']),
    fact('staat', 'Staatliche Reaktionen?', 'Sozialversicherung und zugleich Kontrolle der Arbeiterbewegung', ['Ignorieren für immer', 'Sofortige Räteherrschaft', 'Abschaffung der Industrie'], 'Bismarcksche Sozialgesetze sind Stichwort.', 'Bismarcksche Sozialgesetze sind Stichwort. Bismarcksche Sozialgesetze sind Stichwort. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Der Staat reagierte mit sozialer ___ und Kontrolle.', ['Versicherung', 'Politik']),
  ],
  pairs: [
    pair('p1', 'Zollverein', 'Wirtschaftlicher Zusammenschluss', 'Binnenmarkt'),
    pair('p2', 'Eisenbahn', 'Transport und Nachfrage', 'Netz wächst'),
    pair('p3', 'Schwerindustrie', 'Kohle und Stahl', 'Machtfaktor'),
  ],
  trueFalse: [
    tf('t1', 'Deutschland industrialisierte später, dann rasch und regional stark.', true, 'Eisenbahn und Schwerindustrie waren zentral.', 'Eisenbahn und Schwerindustrie waren zentral. Sachsen war früh geprägt. Die soziale Frage verschärfte sich.'),
  ],
}

const k8_lb2_folgen: BioBank = {
  quelle: 'Wikipedia: Soziale Frage',
  url: 'https://de.wikipedia.org/wiki/Soziale_Frage',
  conceptPrefix: 'ge:k8:ind-folgen',
  facts: [
    fact('stadt', 'Urbane Folgen?', 'Wachstum, Enge, Hygieneprobleme und neue Lebensstile', ['Leere Städte', 'Nur Schlösser', 'Keine Migration'], 'Mieten und Wohnungsnot stiegen.', 'Mieten und Wohnungsnot stiegen. Mieten und Wohnungsnot stiegen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Städte wuchsen mit sozialen ___.', ['Problemen']),
    fact('arbeit', 'Wandel der Arbeit?', 'Takt, Schicht, Maschinenabhängigkeit', ['Nur Freizeit ohne Pflicht', 'Keine Zeitdisziplin', 'Nur saisonale Feldarbeit überall'], 'Körperliche Belastung blieb hoch.', 'Körperliche Belastung blieb hoch. Körperliche Belastung blieb hoch. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Fabrikarbeit brachte Schicht und ___.', ['Takt', 'Disziplin']),
    fact('umwelt', 'Umweltfolgen?', 'Rauch, Abwässer und Landschaftsverbrauch', ['Nur saubere Luft überall', 'Keine Emissionen', 'Nur Naturschutz ohne Industrie'], 'Flüsse und Luft wurden belastet.', 'Flüsse und Luft wurden belastet. Flüsse und Luft wurden belastet. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Industrie belastete Luft und ___.', ['Wasser', 'Umwelt']),
    fact('familie', 'Folgen für Familien?', 'Neue Rollen, Kinderarbeit, spätere Schulpflicht-Debatten', ['Familien unverändert', 'Keine Kinderarbeit je', 'Nur Adelsfragen'], 'Haushalt und Erwerb trennten sich stärker.', 'Haushalt und Erwerb trennten sich stärker. Haushalt und Erwerb trennten sich stärker. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Kinderarbeit war Teil der sozialen ___.', ['Frage', 'Probleme']),
    fact('bewegung', 'Arbeiterbewegung?', 'Gewerkschaften und Parteien forderten Rechte', ['Keine Organisation', 'Nur Unternehmervereine', 'Nur Kirchenchöre'], 'Streiks und Reformforderungen wuchsen.', 'Streiks und Reformforderungen wuchsen. Streiks und Reformforderungen wuchsen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Arbeiter organisierten sich in ___ und Parteien.', ['Gewerkschaften']),
    fact('geschlecht', 'Geschlechteraspekte?', 'Frauen- und Kinderarbeit in Fabriken und Heimindustrie', ['Nur Männer arbeiteten je', 'Keine Heimarbeit', 'Nur Bürojobs 21. Jh.'], 'Löhne und Rechte waren ungleich.', 'Löhne und Rechte waren ungleich. Löhne und Rechte waren ungleich. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Frauen- und Kinderarbeit prägte die ___.', ['Industrie', 'Fabrik']),
    fact('fortschritt', 'Doppelgesicht des Fortschritts?', 'Mehr Produktion und zugleich soziale und ökologische Kosten', ['Nur Vorteile ohne Kosten', 'Nur Nachteile ohne Fortschritt', 'Keine Ambivalenz'], 'Lehrplan betont Chancen und Risiken.', 'Lehrplan betont Chancen und Risiken. Lehrplan betont Chancen und Risiken. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Fortschritt brachte Produktion und ___.', ['Kosten', 'Risiken']),
    fact('gegenwart', 'Gegenwartsbezug?', 'Fragen von Arbeit, Umwelt und sozialer Gerechtigkeit bleiben', ['Thema sei irrelevant', 'Nur Steinzeitbezug', 'Nur Sport'], 'Industrialisierung formt moderne Gesellschaften.', 'Industrialisierung formt moderne Gesellschaften. Industrialisierung formt moderne Gesellschaften. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Das Thema schärft den Blick für soziale ___.', ['Gerechtigkeit', 'Fragen']),
  ],
  pairs: [
    pair('p1', 'Soziale Frage', 'Armut und Arbeitsbedingungen', 'Kernkonflikt'),
    pair('p2', 'Urbanisierung', 'Stadtwachstum', 'Enge und Hygiene'),
    pair('p3', 'Arbeiterbewegung', 'Organisation der Lohnabhängigen', 'Rechte fordern'),
  ],
  trueFalse: [
    tf('t1', 'Industrialisierung brachte Fortschritt und schwere soziale Kosten.', true, 'Das Doppelgesicht ist Lehrplanthema.', 'Das Doppelgesicht ist Lehrplanthema. Stadt, Arbeit und Umwelt veränderten sich. Bewegungen forderten Reform.'),
  ],
}

const k8_lb4_imperialismus: BioBank = {
  quelle: 'Wikipedia: Imperialismus',
  url: 'https://de.wikipedia.org/wiki/Imperialismus',
  conceptPrefix: 'ge:k8:imperialismus',
  facts: [
    fact('begriff', 'Was meint Imperialismus?', 'Ausgreifen von Mächten nach Herrschaft, Märkten und Prestige', ['Nur friedlicher Kulturdialog', 'Ablehnung jeder Expansion', 'Nur Binnenpolitik ohne Welt'], 'Kolonien wurden Machtfaktoren.', 'Kolonien wurden Machtfaktoren. Kolonien wurden Machtfaktoren. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Imperialismus meint Ausgreifen nach Herrschaft und ___.', ['Märkten', 'Prestige']),
    fact('motive', 'Welche Motive spielten eine Rolle?', 'Wirtschaft, Machtkonkurrenz, Mission und Rassismus', ['Nur Sport', 'Nur Wetter', 'Nur Ablehnung von Handel'], 'Sozialdarwinistische Ideen legitimierten Herrschaft.', 'Sozialdarwinistische Ideen legitimierten Herrschaft. Sozialdarwinistische Ideen legitimierten Herrschaft. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Motive waren Wirtschaft, Macht und ___.', ['Mission', 'Ideologie']),
    fact('deutschland', 'Deutsches Kolonialreich?', 'Späte, begrenzte Kolonien mit Gewalt und Ausbeutung', ['Größtes Reich der Welt dauerhaft', 'Keine Kolonien je', 'Nur Mondbasis'], 'Herero und Nama sind Erinnerungsorte der Gewalt.', 'Herero und Nama sind Erinnerungsorte der Gewalt. Herero und Nama sind Erinnerungsorte der Gewalt. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Deutschland erwarb spät begrenzte ___.', ['Kolonien']),
    fact('konkurrenz', 'Folge der Konkurrenz?', 'Spannungen zwischen europäischen Großmächten', ['Sofortiger Weltfrieden', 'Ende aller Allianzen', 'Nur Handelsmessen'], 'Krisen in Afrika und Asien eskalierten.', 'Krisen in Afrika und Asien eskalierten. Krisen in Afrika und Asien eskalierten. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Imperialismus steigerte ___ zwischen Mächten.', ['Spannungen', 'Konkurrenz']),
    fact('gewalt', 'Kolonialgewalt?', 'Militärische Unterwerfung und wirtschaftliche Ausbeutung', ['Nur freiwillige Verträge überall', 'Keine Gewalt', 'Nur kulturelle Geschenke'], 'Widerstand der kolonisierten Menschen wurde gebrochen.', 'Widerstand der kolonisierten Menschen wurde gebrochen. Widerstand der kolonisierten Menschen wurde gebrochen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Kolonialherrschaft beruhte oft auf ___.', ['Gewalt', 'Ausbeutung']),
    fact('ideologie', 'Legitimation?', 'Überlegenheitsideen und „Zivilisierungsmission“', ['Gleichheit aller Völker als Praxis', 'Ablehnung jeder Ideologie', 'Nur ökonomische Neutralität ohne Worte'], 'Rassismus war Teil der Rechtfertigung.', 'Rassismus war Teil der Rechtfertigung. Rassismus war Teil der Rechtfertigung. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Herrschaft wurde mit ___ideen gerechtfertigt.', ['Überlegenheits', 'Zivilisierungs']),
    fact('weltkrieg', 'Bezug zum Ersten Weltkrieg?', 'Konflikte und Bündnisse wurden durch Imperien verschärft', ['Imperialismus verhinderte jeden Krieg', 'Kein Zusammenhang', 'Nur Zufall'], 'Krisen vor 1914 hatten globale Dimension.', 'Krisen vor 1914 hatten globale Dimension. Krisen vor 1914 hatten globale Dimension. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Imperiale Rivalität verschärfte ___ vor 1914.', ['Konflikte', 'Spannungen']),
    fact('urteil', 'Warum kritisches Urteil?', 'Weil Opferperspektiven und Gewalt benannt werden müssen', ['Nur Feiern der Expansion', 'Quellen unnötig', 'Kritik verboten'], 'Lehrplan fordert multiperspektivische Bewertung.', 'Lehrplan fordert multiperspektivische Bewertung. Lehrplan fordert multiperspektivische Bewertung. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Bewertung muss ___ der Kolonisierten einbeziehen.', ['Perspektiven', 'Erfahrungen']),
  ],
  pairs: [
    pair('p1', 'Kolonie', 'Beherrschtes Gebiet', 'Ausbeutung und Herrschaft'),
    pair('p2', 'Rassismus', 'Abwertung von Menschengruppen', 'Legitimierte Gewalt'),
    pair('p3', 'Weltpolitik', 'Globale Machtansprüche', 'Vor 1914'),
  ],
  trueFalse: [
    tf('t1', 'Imperialismus bedeutete Herrschaft, Ausbeutung und wachsende Rivalität.', true, 'Gewalt und Ideologie gehörten dazu.', 'Gewalt und Ideologie gehörten dazu. Deutschland kam spät dazu. Spannungen trugen zur Vorkriegskrise bei.'),
  ],
}

const k8_lb4_buendnisse: BioBank = {
  quelle: 'Wikipedia: Julikrise 1914',
  url: 'https://de.wikipedia.org/wiki/Julikrise',
  conceptPrefix: 'ge:k8:buendnisse',
  facts: [
    fact('buendnisse', 'Bündnissystem vor 1914?', 'Zwei Blöcke (Mittelmächte / Entente) erhöhten Eskalationsgefahr', ['Keine Bündnisse', 'Nur Weltfriedensbund', 'Nur bilaterale Sportabkommen'], 'Verpflichtungen zogen Staaten hinein.', 'Verpflichtungen zogen Staaten hinein. Verpflichtungen zogen Staaten hinein. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Bündnisse erhöhten die Gefahr der ___.', ['Eskalation']),
    fact('ruesten', 'Wettrüsten?', 'Aufrüstung zu Land und zur See steigerte Misstrauen', ['Abrüstung überall', 'Keine Flotten', 'Nur Kulturwettbewerb'], 'Deutsch-britischer Flottenwettlauf ist Beispiel.', 'Deutsch-britischer Flottenwettlauf ist Beispiel. Deutsch-britischer Flottenwettlauf ist Beispiel. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Wettrüsten steigerte ___.', ['Misstrauen', 'Spannung']),
    fact('militaer', 'Rolle der Militärs?', 'Kriegspläne und Mobilmachungslogik verkürzten Spielräume', ['Nur zivile Diplomatie ohne Heer', 'Keine Pläne', 'Nur Defensive ohne Zeitdruck'], 'Fahrpläne der Mobilmachung wirkten eskalierend.', 'Fahrpläne der Mobilmachung wirkten eskalierend. Fahrpläne der Mobilmachung wirkten eskalierend. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Mobilmachung verkürzte diplomatische ___.', ['Spielräume', 'Zeit']),
    fact('nationalismus', 'Nationalismus?', 'Übersteigerter Nationalstolz erschwerte Kompromisse', ['Nur pazifistische Haltung überall', 'Nation egal', 'Nur lokale Identität ohne Staat'], 'Feindbilder wurden gepflegt.', 'Feindbilder wurden gepflegt. Feindbilder wurden gepflegt. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Nationalismus erschwerte ___.', ['Kompromisse']),
    fact('krisen', 'Vorkriegskrisen?', 'Marokkokrisen und Balkankriege übten Konfrontation', ['Keine Krisen vor 1914', 'Nur Handelsmessen', 'Nur olympische Spiele'], 'Diplomatie hielt Kriege zeitweise auf.', 'Diplomatie hielt Kriege zeitweise auf. Diplomatie hielt Kriege zeitweise auf. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Krisen übten ___ zwischen den Mächten.', ['Konfrontation']),
    fact('geheim', 'Problem geheimer Absprachen?', 'Unklare Verpflichtungen erschwerten Transparenz', ['Alles öffentlich und klar', 'Keine Geheimdiplomatie', 'Nur Parlamentsdebatten'], 'Öffentlichkeit sah Escalation oft spät.', 'Öffentlichkeit sah Escalation oft spät. Öffentlichkeit sah Escalation oft spät. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Geheime Absprachen minderten ___.', ['Transparenz']),
    fact('julikrise', 'Julikrise 1914?', 'Attentat von Sarajevo löste Bündniskette aus', ['Sofortiger Weltfriede', 'Nur lokaler Streit ohne Verbündete', 'Nur Wirtschaftsboom'], 'Mobilmachungen folgten rasch.', 'Mobilmachungen folgten rasch. Mobilmachungen folgten rasch. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Das Attentat von ___ löste die Krise aus.', ['Sarajevo']),
    fact('verantwortung', 'Kriegsausbruch und Verantwortung?', 'Mehrere Faktoren und Akteure trugen zur Eskalation bei', ['Nur ein Staat allein ohne Kontext', 'Nur Zufall ohne Politik', 'Nur Wetter'], 'Historiker diskutieren Anteile differenziert.', 'Historiker diskutieren Anteile differenziert. Historiker diskutieren Anteile differenziert. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Zur Eskalation trugen mehrere ___ bei.', ['Faktoren', 'Akteure']),
  ],
  pairs: [
    pair('p1', 'Entente', 'Bündnisblock gegen Mittelmächte', 'Vor 1914'),
    pair('p2', 'Wettrüsten', 'Aufrüstung der Mächte', 'Misstrauen'),
    pair('p3', 'Julikrise', 'Eskalation 1914', 'Sarajevo'),
  ],
  trueFalse: [
    tf('t1', 'Bündnisse und Wettrüsten erhöhten die Eskalationsgefahr vor 1914.', true, 'Die Julikrise zog Blöcke hinein.', 'Die Julikrise zog Blöcke hinein. Mobilmachung verkürzte Spielräume. Verantwortung ist multipel.'),
  ],
}

const k8_lb4_ursachen_wk1: BioBank = {
  quelle: 'Wikipedia: Erster Weltkrieg',
  url: 'https://de.wikipedia.org/wiki/Erster_Weltkrieg',
  conceptPrefix: 'ge:k8:ursachen-wk1',
  facts: [
    fact('langfristig', 'Langfristige Ursachen?', 'Imperialismus, Nationalismus, Bündnisse und Wettrüsten', ['Nur ein Zufallstag', 'Nur Wirtschaftsboom ohne Politik', 'Nur Sportkonflikt'], 'Strukturelle Spannungen bestanden vor 1914.', 'Strukturelle Spannungen bestanden vor 1914. Strukturelle Spannungen bestanden vor 1914. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Langfristig wirkten Imperialismus und ___.', ['Nationalismus', 'Bündnisse']),
    fact('anlass', 'Unmittelbarer Anlass?', 'Attentat auf Franz Ferdinand in Sarajevo', ['Gründung der UNO', 'Wiener Kongress', 'Reichsgründung 1871'], 'Die Julikrise folgte.', 'Die Julikrise folgte. Die Julikrise folgte. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Der Anlass war das Attentat von ___.', ['Sarajevo']),
    fact('schuldfrage', 'Kriegsschuldfrage?', 'Politisch umkämpft; Historiker sehen geteilte Verantwortung', ['Nur ein Staat allein ohne Debatte', 'Keine Diskussion je', 'Nur naturgesetzlich'], 'Propaganda prägte Deutungen nach 1918.', 'Propaganda prägte Deutungen nach 1918. Propaganda prägte Deutungen nach 1918. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die Kriegsschuldfrage blieb politisch ___.', ['umkämpft']),
    fact('stellungskrieg', 'Charakter an der Westfront?', 'Stellungskrieg mit enormen Verlusten', ['Schneller Blitzfrieden ohne Opfer', 'Nur Seeschlachten', 'Nur Kolonialgefechte'], 'Materialschlachten prägten das Bild.', 'Materialschlachten prägten das Bild. Materialschlachten prägten das Bild. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'An der Westfront herrschte oft ___.', ['Stellungskrieg']),
    fact('total', 'Warum „totaler“ Krieg?', 'Wirtschaft, Propaganda und Zivilgesellschaft wurden einbezogen', ['Nur Soldaten betroffen', 'Keine Heimatfront', 'Nur Sport'], 'Frauenarbeit und Rationierung zählten.', 'Frauenarbeit und Rationierung zählten. Frauenarbeit und Rationierung zählten. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Der Krieg bezog Wirtschaft und ___ ein.', ['Heimatfront', 'Propaganda']),
    fact('ende', 'Ende 1918?', 'Militärische Erschöpfung und politische Umbrüche', ['Sieg aller Mittelmächte', 'Unbefristeter Waffenstillstand ohne Wandel', 'Nur olympische Pause'], 'In Deutschland folgte Revolution.', 'In Deutschland folgte Revolution. In Deutschland folgte Revolution. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', '1918 endete der Krieg mit ___ der Mittelmächte.', ['Niederlage', 'Erschöpfung']),
    fact('opfer', 'Menschliche Kosten?', 'Millionen Tote und Verwundete, auch Zivilisten', ['Keine Opfer', 'Nur leichte Verletzungen', 'Nur materielle Schäden'], 'Gedenken bleibt Aufgabe.', 'Gedenken bleibt Aufgabe. Gedenken bleibt Aufgabe. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Der Krieg forderte Millionen ___.', ['Tote', 'Opfer']),
    fact('nachwirkung', 'Nachwirkungen?', 'Versailles, Revolutionen und neue Staatenordnung', ['Sofortige stabile Demokratie überall', 'Rückkehr 1913 unverändert', 'Keine politischen Folgen'], 'Die Zwischenkriegszeit begann.', 'Die Zwischenkriegszeit begann. Die Zwischenkriegszeit begann. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Nachwirkungen waren Versailles und ___.', ['Revolutionen', 'Neuordnung']),
  ],
  pairs: [
    pair('p1', 'Sarajevo', 'Attentat 1914', 'Anlass der Julikrise'),
    pair('p2', 'Stellungskrieg', 'Front ohne Bewegung', 'Hohe Verluste'),
    pair('p3', 'Heimatfront', 'Zivilgesellschaft im Krieg', 'Propaganda und Wirtschaft'),
  ],
  trueFalse: [
    tf('t1', 'Ursachen des Ersten Weltkriegs waren strukturell und situativ verschränkt.', true, 'Sarajevo war Anlass, nicht alleinige Ursache.', 'Sarajevo war Anlass, nicht alleinige Ursache. Bündnisse und Nationalismus zählten. Die Schuldfrage blieb umkämpft.'),
  ],
}

const k8_lbw_alltag: BioBank = {
  quelle: 'Wikipedia: Heimatfront',
  url: 'https://de.wikipedia.org/wiki/Heimatfront',
  conceptPrefix: 'ge:k8:alltag-wk1',
  facts: [
    fact('heimatfront', 'Was meint Heimatfront?', 'Zivilgesellschaft unter Kriegsbedingungen hinter der Front', ['Nur Schützengraben', 'Nur Diplomatie ohne Alltag', 'Nur Sportfeste'], 'Alltag wurde vom Krieg geprägt.', 'Alltag wurde vom Krieg geprägt. Alltag wurde vom Krieg geprägt. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Heimatfront meint Zivilgesellschaft unter ___.', ['Kriegsbedingungen']),
    fact('feldpost', 'Bedeutung der Feldpost?', 'Verbindung zwischen Front und Angehörigen', ['Nur Behördenakten', 'Nur Zeitungsanzeigen', 'Keine Briefe'], 'Briefe sind wichtige Quellen.', 'Briefe sind wichtige Quellen. Briefe sind wichtige Quellen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Feldpost verband Front und ___.', ['Heimat', 'Angehörige']),
    fact('versorgung', 'Versorgungsprobleme?', 'Hunger, Rationierung und Ersatzstoffe', ['Überfluss überall', 'Keine Knappheit', 'Nur Luxusgüter'], 'Hungerwinter sind Stichwort.', 'Hungerwinter sind Stichwort. Hungerwinter sind Stichwort. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Zivilisten litten unter Hunger und ___.', ['Rationierung', 'Knappheit']),
    fact('frauen', 'Rolle von Frauen?', 'Arbeit in Fabrik und Versorgung, neue Verantwortungen', ['Keine Erwerbsarbeit', 'Nur Zuschauen', 'Nur Frontkampf überall'], 'Geschlechterrollen verschoben sich zeitweise.', 'Geschlechterrollen verschoben sich zeitweise. Geschlechterrollen verschoben sich zeitweise. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Frauen übernahmen Arbeit in ___ und Versorgung.', ['Fabrik', 'Betrieb']),
    fact('propaganda', 'Kriegspropaganda im Alltag?', 'Plakate, Presse und Feindbilder steuerten Meinung', ['Keine Beeinflussung', 'Nur neutrale Berichte überall', 'Nur private Tagebücher'], 'Durchhalteparolen prägten Öffentlichkeit.', 'Durchhalteparolen prägten Öffentlichkeit. Durchhalteparolen prägten Öffentlichkeit. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Propaganda steuerte Meinung durch Presse und ___.', ['Plakate', 'Feindbilder']),
    fact('verlust', 'Erfahrungen von Verlust?', 'Trauer, Ungewissheit und Kriegsinvalidität', ['Keine Opfer im Alltag', 'Nur Siegesfeiern ohne Leid', 'Nur materielle Freude'], 'Familien warteten auf Nachrichten.', 'Familien warteten auf Nachrichten. Familien warteten auf Nachrichten. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Alltag war von Trauer und ___ geprägt.', ['Ungewissheit', 'Verlust']),
    fact('quellen', 'Alltagsquellen?', 'Briefe, Tagebücher, Fotos und Erinnerungen', ['Nur Schlachtpläne', 'Nur Diplomatenakten', 'Nur Statistiken ohne Menschen'], 'Perspektiven der Zivilbevölkerung werden sichtbar.', 'Perspektiven der Zivilbevölkerung werden sichtbar. Perspektiven der Zivilbevölkerung werden sichtbar. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Alltag erschließt sich über Briefe und ___.', ['Tagebücher', 'Erinnerungen']),
    fact('dimension', 'Neue Dimension von Krieg?', 'Totaler Krieg erfasste Alltag und Gesellschaft', ['Krieg blieb rein militärisch', 'Keine Zivilbetroffenheit', 'Nur Ritterturniere'], 'Lehrplan betont diese Erweiterung.', 'Lehrplan betont diese Erweiterung. Lehrplan betont diese Erweiterung. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Der Krieg erfasste auch den ___.', ['Alltag', 'Zivilbereich']),
  ],
  pairs: [
    pair('p1', 'Heimatfront', 'Zivilgesellschaft im Krieg', 'Versorgung und Propaganda'),
    pair('p2', 'Feldpost', 'Briefe Front–Heimat', 'Wichtige Quelle'),
    pair('p3', 'Rationierung', 'Zuteilung knapper Güter', 'Hungergefahr'),
  ],
  trueFalse: [
    tf('t1', 'Im Ersten Weltkrieg wurde der Alltag zur Heimatfront.', true, 'Versorgung, Propaganda und Verlust prägten Zivilisten.', 'Versorgung, Propaganda und Verlust prägten Zivilisten. Feldpost ist zentrale Quelle. Krieg wurde total.'),
  ],
}

const k9_lb1_versailles: BioBank = {
  quelle: 'Wikipedia: Versailler Vertrag',
  url: 'https://de.wikipedia.org/wiki/Versailler_Vertrag',
  conceptPrefix: 'ge:k9:versailles',
  facts: [
    fact('vertrag', 'Was regelte Versailles 1919?', 'Friedensbedingungen für Deutschland nach dem Ersten Weltkrieg', ['Gründung Kursachsens', 'Ende der Französischen Revolution', 'Einführung des Buchdrucks'], 'Gebiete, Abrüstung und Reparationen waren zentral.', 'Gebiete, Abrüstung und Reparationen waren zentral. Gebiete, Abrüstung und Reparationen waren zentral. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Versailles legte Friedensbedingungen für ___ fest.', ['Deutschland']),
    fact('reparationen', 'Was waren Reparationen?', 'Leistungen zur Wiedergutmachung von Kriegsschäden', ['Freiwillige Kulturspenden', 'Wahlversprechen', 'Mittelalterliche Lehnsabgaben'], 'Sie belasteten Politik und Wirtschaft.', 'Sie belasteten Politik und Wirtschaft. Sie belasteten Politik und Wirtschaft. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Reparationen dienten der Wiedergutmachung von Kriegs___.', ['schäden']),
    fact('schuld', 'Kriegsschuldartikel?', 'Zuschreibung der Verantwortung an Deutschland und Verbündete', ['Sofortige EU-Aufnahme', 'Wiedereinführung der Monarchie', 'Nur Österreichs Innenpolitik'], 'Der Artikel war politisch hoch umkämpft.', 'Der Artikel war politisch hoch umkämpft. Der Artikel war politisch hoch umkämpft. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Der Artikel schrieb Deutschland Verantwortung für Kriegs___ zu.', ['schäden']),
    fact('voelkerbund', 'Aufgabe des Völkerbunds?', 'Friedliche Konfliktregelung und Zusammenarbeit', ['Geheime Militärallianz', 'Ersatz aller Regierungen', 'Nur deutscher Reichstag'], 'Möglichkeiten blieben begrenzt.', 'Möglichkeiten blieben begrenzt. Möglichkeiten blieben begrenzt. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Der Völkerbund sollte Konflikte ___ regeln.', ['friedlich']),
    fact('gebiete', 'Gebietsfolgen für DE?', 'Verluste und neue Grenzen in Europa', ['Gebietsgewinne überall', 'Keine Grenzänderungen', 'Nur Kolonialgewinn'], 'Elsass-Lothringen ging an Frankreich.', 'Elsass-Lothringen ging an Frankreich. Elsass-Lothringen ging an Frankreich. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Deutschland erlitt Gebiets___.', ['verluste']),
    fact('abrüstung', 'Militärische Auflagen?', 'Begrenzung von Heer, Flotte und Waffen', ['Aufrüstungspflicht', 'Keine Militärregeln', 'Nur olympische Teams'], 'Das Berufsheer wurde begrenzt.', 'Das Berufsheer wurde begrenzt. Das Berufsheer wurde begrenzt. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Versailles begrenzte das deutsche ___.', ['Militär', 'Heer']),
    fact('deutung', 'Deutung in DE?', 'Viele empfanden den Vertrag als hart und demütigend', ['Allgemeine Begeisterung überall', 'Gleichgültigkeit total', 'Nur Feiern'], 'Gegner der Republik nutzten das propagandistisch.', 'Gegner der Republik nutzten das propagandistisch. Gegner der Republik nutzten das propagandistisch. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Viele empfanden Versailles als ___.', ['hart', 'demütigend']),
    fact('ordnung', 'Teil der Nachkriegsordnung?', 'Ja, neben anderen Friedensverträgen', ['Nein, einziger Vertrag der Weltgeschichte', 'Nur Zeitungstext', 'Nur Wirtschaftsplan ohne Politik'], 'Mehrere Verträge ordneten Europa neu.', 'Mehrere Verträge ordneten Europa neu. Mehrere Verträge ordneten Europa neu. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Versailles war Teil der Nachkriegs___.', ['ordnung']),
  ],
  pairs: [
    pair('p1', 'Versailles', 'Friedensvertrag 1919', 'Bedingungen für DE'),
    pair('p2', 'Reparationen', 'Wiedergutmachung', 'Politische Last'),
    pair('p3', 'Völkerbund', 'Friedensinstitution', 'Begrenzte Macht'),
  ],
  trueFalse: [
    tf('t1', 'Der Versailler Vertrag prägte die Nachkriegsordnung und war in Deutschland umkämpft.', true, 'Reparationen und Schuldartikel belasteten die Debatte.', 'Reparationen und Schuldartikel belasteten die Debatte. Der Völkerbund blieb schwach. Deutungen wirkten auf Weimar.'),
  ],
}

const k9_lb1_europa_ordnung: BioBank = {
  quelle: 'Wikipedia: Zwischenkriegszeit',
  url: 'https://de.wikipedia.org/wiki/Zwischenkriegszeit',
  conceptPrefix: 'ge:k9:europa-ordnung',
  facts: [
    fact('staaten', 'Neue Staaten nach 1918?', 'Zerfall großer Reiche und nationale Selbstbestimmung', ['Mittelalter kehrte zurück', 'Alle Monarchen ein Reich', 'Kolonien nach Amerika'], 'Grenzen und Minderheiten blieben strittig.', 'Grenzen und Minderheiten blieben strittig. Grenzen und Minderheiten blieben strittig. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Neue Staaten entstanden, weil alte ___ zerfielen.', ['Reiche']),
    fact('selbstbestimmung', 'Selbstbestimmung?', 'Anspruch von Völkern auf eigenen Staat – oft unvollständig umgesetzt', ['Sofort klare Grenzen überall', 'Keine nationalen Ansprüche', 'Nur dynastische Logik'], 'Minderheitenprobleme blieben.', 'Minderheitenprobleme blieben. Minderheitenprobleme blieben. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Selbstbestimmung wurde oft nur ___ umgesetzt.', ['unvollständig', 'teilweise']),
    fact('sowjet', 'Sowjetrussland/UdSSR?', 'Revolutionäres System und Gegenmodell zu liberalen Staaten', ['Wiederherstellung des Zarenreichs unverändert', 'Sofortige Marktdemokratie', 'Nur Kulturverein'], 'Bürgerkrieg und Aufbau der Sowjetmacht folgten.', 'Bürgerkrieg und Aufbau der Sowjetmacht folgten. Bürgerkrieg und Aufbau der Sowjetmacht folgten. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'In Russland entstand ein ___ System.', ['revolutionäres', 'sowjetisches']),
    fact('wirtschaft', 'Wirtschaftliche Lage?', 'Kriegsfolgen, Inflation und später Weltwirtschaftskrise', ['Sofortiger Wohlstand überall', 'Keine Krisen', 'Nur Boom ohne Bruch'], 'Soziale Unruhe wuchs.', 'Soziale Unruhe wuchs. Soziale Unruhe wuchs. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'NachkriegsEuropa litt unter wirtschaftlichen ___.', ['Krisen', 'Folgen']),
    fact('demokratien', 'Politische Systeme?', 'Demokratien und Diktaturen konkurrierten', ['Nur stabile Demokratien überall', 'Nur Monarchien ohne Wandel', 'Keine Systeme'], 'Autoritäre Lösungen gewannen mancherorts.', 'Autoritäre Lösungen gewannen mancherorts. Autoritäre Lösungen gewannen mancherorts. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Demokratien und ___ konkurrierten.', ['Diktaturen']),
    fact('minderheiten', 'Minderheitenfrage?', 'Neue Grenzen schufen oft neue Konflikte', ['Alle zufrieden', 'Grenzen egal', 'Völkerbund löste alles sofort'], 'Schutzregelungen blieben schwach.', 'Schutzregelungen blieben schwach. Schutzregelungen blieben schwach. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Minderheiten und Grenzfragen blieben ___.', ['konfliktträchtig', 'strittig']),
    fact('kultur', 'Gesellschaftliche Umbrüche?', 'Geschlechterrollen, Medien und Alltag wandelten sich', ['Keine gesellschaftlichen Änderungen', 'Nur Militär ohne Zivil', 'Nur Rückkehr 1913'], 'Neue Freizeit- und Medienwelten entstanden.', 'Neue Freizeit- und Medienwelten entstanden. Neue Freizeit- und Medienwelten entstanden. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Alltag und ___ wandelten sich.', ['Geschlechterrollen', 'Medien']),
    fact('unsicherheit', 'Grundgefühl der Epoche?', 'Hoffnung auf Frieden und zugleich große Unsicherheit', ['Nur absolute Sicherheit', 'Nur Isolation ohne Politik', 'Nur Sport'], 'Die Ordnung blieb fragil.', 'Die Ordnung blieb fragil. Die Ordnung blieb fragil. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die Nachkriegsordnung blieb ___.', ['fragil', 'unsicher']),
  ],
  pairs: [
    pair('p1', 'Selbstbestimmung', 'Anspruch auf eigenen Staat', 'Oft unvollständig'),
    pair('p2', 'Zwischenkriegszeit', '1918–1939', 'Fragile Ordnung'),
    pair('p3', 'Minderheiten', 'Gruppen in neuen Staaten', 'Konfliktpotenzial'),
  ],
  trueFalse: [
    tf('t1', 'Nach 1918 entstand eine fragile europäische Neuordnung.', true, 'Neue Staaten und alte Konflikte bestanden nebeneinander.', 'Neue Staaten und alte Konflikte bestanden nebeneinander. Wirtschaftskrisen belasteten. Demokratien waren gefährdet.'),
  ],
}

const k9_lb2_weimar: BioBank = {
  quelle: 'Wikipedia: Weimarer Republik',
  url: 'https://de.wikipedia.org/wiki/Weimarer_Republik',
  conceptPrefix: 'ge:k9:weimar',
  facts: [
    fact('verfassung', 'Weimarer Verfassung?', 'Parlamentarische Demokratie mit starkem Reichspräsidenten', ['Absolute Monarchie', 'Reine Rätediktatur ohne Parlament', 'Nur Städtebund'], 'Grundrechte wurden festgeschrieben.', 'Grundrechte wurden festgeschrieben. Grundrechte wurden festgeschrieben. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Weimar war eine parlamentarische ___.', ['Demokratie']),
    fact('krisen', 'Frühe Krisen?', 'Putschversuche, Inflation und politische Gewalt', ['Ruhe ohne Konflikte', 'Sofortige Stabilität', 'Nur Wirtschaftsboom'], '1923 war ein Krisenjahr.', '1923 war ein Krisenjahr. 1923 war ein Krisenjahr. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Frühe Weimarer Jahre waren von ___ geprägt.', ['Krisen', 'Gewalt']),
    fact('inflation', 'Hyperinflation 1923?', 'Geld entwertete sich extrem und zerstörte Ersparnisse', ['Stabile Preise', 'Nur leichte Teuerung', 'Nur Goldstandard ohne Bruch'], 'Mittelschichten verloren Vermögen.', 'Mittelschichten verloren Vermögen. Mittelschichten verloren Vermögen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', '1923 entwertete sich das ___.', ['Geld']),
    fact('stabil', 'Relative Stabilisierung?', 'Mitte der 1920er Jahre zeitweise ruhiger und kulturell lebendig', ['Keine Stabilisierung je', 'Nur Diktatur ab 1920', 'Nur Krieg'], '„Goldene Zwanziger“ sind Schlagwort.', '„Goldene Zwanziger“ sind Schlagwort. „Goldene Zwanziger“ sind Schlagwort. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Zeitweise gab es relative ___.', ['Stabilisierung', 'Ruhe']),
    fact('parteien', 'Parteisystem?', 'Zersplittert und polarisiert zwischen Extremen', ['Nur eine Partei', 'Keine Wahlen', 'Nur Adelsclubs'], 'Koalitionen waren schwierig.', 'Koalitionen waren schwierig. Koalitionen waren schwierig. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Das Parteiensystem war ___.', ['zersplittert', 'polarisiert']),
    fact('praesident', 'Rolle des Reichspräsidenten?', 'Weite Vollmachten, später Präsidialkabinette', ['Nur zeremoniell ohne Macht', 'Kein Präsident', 'Nur Bürgermeister'], 'Artikel 48 wurde kritisch genutzt.', 'Artikel 48 wurde kritisch genutzt. Artikel 48 wurde kritisch genutzt. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Der Präsident besaß weite ___.', ['Vollmachten', 'Macht']),
    fact('kultur', 'Kultur der Weimarer Zeit?', 'Vielfalt und Moderne in Kunst, Film und Alltag', ['Keine kulturelle Blüte', 'Nur Zensur ohne Kunst', 'Nur Mittelalter'], 'Berlin wurde Symbol der Moderne.', 'Berlin wurde Symbol der Moderne. Berlin wurde Symbol der Moderne. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Weimar kannte kulturelle ___.', ['Vielfalt', 'Moderne']),
    fact('belastung', 'Belastungen der Republik?', 'Kriegsfolgen, Dolchstoßlegende und Gegner von rechts und links', ['Nur allgemeine Zustimmung', 'Keine Feinde', 'Nur Außenfrieden ohne Innenpolitik'], 'Akzeptanz blieb brüchig.', 'Akzeptanz blieb brüchig. Akzeptanz blieb brüchig. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die Republik war von inneren ___ belastet.', ['Gegnern', 'Konflikten']),
  ],
  pairs: [
    pair('p1', 'Weimarer Verfassung', 'Demokratische Ordnung 1919', 'Starker Präsident'),
    pair('p2', 'Hyperinflation', 'Geldentwertung 1923', 'Soziale Erschütterung'),
    pair('p3', 'Präsidialkabinett', 'Regierung gestützt auf Präsident', 'Endphase'),
  ],
  trueFalse: [
    tf('t1', 'Die Weimarer Republik hatte Chancen und schwere Krisen.', true, 'Verfassung und Kultur standen unter Druck.', 'Verfassung und Kultur standen unter Druck. Inflation und Gewalt belasteten. Die Akzeptanz blieb brüchig.'),
  ],
}

const k9_lb2_aufstieg_ns: BioBank = {
  quelle: 'Wikipedia: Machtergreifung',
  url: 'https://de.wikipedia.org/wiki/Machtergreifung',
  conceptPrefix: 'ge:k9:aufstieg-ns',
  facts: [
    fact('krise', 'Weltwirtschaftskrise Wirkung?', 'Massenarbeitslosigkeit steigerte Radikalisierung', ['Sofortiger Wohlstand', 'Keine politischen Folgen', 'Nur Kulturboom'], 'NSDAP gewann Stimmen.', 'NSDAP gewann Stimmen. NSDAP gewann Stimmen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die Krise steigerte ___.', ['Radikalisierung', 'Arbeitslosigkeit']),
    fact('propaganda', 'NS-Propaganda?', 'Einfache Feindbilder, Massenrituale und Mediennutzung', ['Nur sachliche Debatte', 'Keine Inszenierung', 'Nur private Gespräche'], 'Jugend und Straßenkampf wurden mobilisiert.', 'Jugend und Straßenkampf wurden mobilisiert. Jugend und Straßenkampf wurden mobilisiert. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Propaganda nutzte Feindbilder und ___.', ['Massenrituale', 'Medien']),
    fact('elite', 'Rolle alter Eliten?', 'Teile der Eliten unterschätzten Hitler und hofften auf Einbindung', ['Alle Eliten wehrten konsequent ab', 'Keine Kontakte', 'Nur Arbeiter ohne Elite'], 'Ernennung zum Reichskanzler 1933.', 'Ernennung zum Reichskanzler 1933. Ernennung zum Reichskanzler 1933. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Teile der Eliten hofften auf ___.', ['Einbindung', 'Zähmung']),
    fact('macht', 'Machtübertragung 1933?', 'Hitler wurde legal Reichskanzler, baute Diktatur rasch aus', ['Sofortige freie Neuwahl der Demokratie', 'Keine Machtübernahme', 'Nur kommunistische Regierung'], 'Ermächtigungsgesetz folgte.', 'Ermächtigungsgesetz folgte. Ermächtigungsgesetz folgte. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', '1933 wurde Hitler ___.', ['Reichskanzler']),
    fact('ermaechigung', 'Ermächtigungsgesetz?', 'Ermöglichte Gesetzgebung ohne Reichstag', ['Stärkte das Parlament', 'Abschaffte die Regierung', 'Nur Kulturgesetz'], 'Gewaltenteilung wurde ausgehebelt.', 'Gewaltenteilung wurde ausgehebelt. Gewaltenteilung wurde ausgehebelt. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Das Ermächtigungsgesetz schwächte den ___.', ['Reichstag', 'Parlamentarismus']),
    fact('gleichschaltung', 'Gleichschaltung?', 'Anpassung von Staat und Gesellschaft an NS-Herrschaft', ['Stärkung föderaler Vielfalt', 'Mehr Parteienfreiheit', 'Nur Sportreform'], 'Länder und Verbände verloren Autonomie.', 'Länder und Verbände verloren Autonomie. Länder und Verbände verloren Autonomie. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Gleichschaltung passte Gesellschaft an die ___ an.', ['NS-Herrschaft', 'Diktatur']),
    fact('gewalt', 'Gewalt und Terror früh?', 'SA-Terror und Ausschaltung von Gegnern', ['Keine Gewalt', 'Nur Debatten', 'Nur friedliche Werbung'], 'Erste Lager entstanden 1933.', 'Erste Lager entstanden 1933. Erste Lager entstanden 1933. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Gegner wurden durch ___ ausgeschaltet.', ['Terror', 'Gewalt']),
    fact('ursachen', 'Ursachenbündel?', 'Krise, Propaganda, Elitenversagen und NS-Mobilisierung', ['Nur ein Zufall', 'Nur Außenpolitik', 'Nur Wetter'], 'Lehrplan fordert multiperspektivische Erklärung.', 'Lehrplan fordert multiperspektivische Erklärung. Lehrplan fordert multiperspektivische Erklärung. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Der Aufstieg hatte mehrere ___.', ['Ursachen', 'Faktoren']),
  ],
  pairs: [
    pair('p1', 'Weltwirtschaftskrise', 'Ab 1929', 'Massenarbeitslosigkeit'),
    pair('p2', 'Ermächtigungsgesetz', '1933', 'Ende parlamentarischer Kontrolle'),
    pair('p3', 'Gleichschaltung', 'Anpassung an NS', 'Zerstörung von Pluralität'),
  ],
  trueFalse: [
    tf('t1', 'Der NS-Aufstieg nutzte Krise, Propaganda und Elitenversagen.', true, '1933 folgte rasch der Ausbau der Diktatur.', '1933 folgte rasch der Ausbau der Diktatur. Ermächtigung und Terror waren zentral. Verantwortung ist geteilt zu analysieren.'),
  ],
}

const k9_lb3_terror: BioBank = {
  quelle: 'Wikipedia: NS-Staat',
  url: 'https://de.wikipedia.org/wiki/NS-Staat',
  conceptPrefix: 'ge:k9:terror',
  facts: [
    fact('terror', 'Instrumente des Terrors?', 'Gestapo, Lager, Denunziation und willkürliche Gewalt', ['Nur freie Presse', 'Nur Rechtsstaat', 'Nur Debattenclubs'], 'Angst sollte Widerstand brechen.', 'Angst sollte Widerstand brechen. Angst sollte Widerstand brechen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Terror nutzte Gestapo und ___.', ['Lager', 'Denunziation']),
    fact('gestapo', 'Was war die Gestapo?', 'Politische Geheimpolizei der NS-Diktatur', ['Unabhängiges Gericht', 'Sportverband', 'Nur Kulturamt'], 'Sie verfolgte Gegner systematisch.', 'Sie verfolgte Gegner systematisch. Sie verfolgte Gegner systematisch. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die Gestapo war politische ___.', ['Geheimpolizei', 'Polizei']),
    fact('lager', 'Konzentrationslager früh?', 'Haft und Terror gegen politische Gegner und Verfolgte', ['Nur Ferienlager', 'Nur Schulen', 'Nur Krankenhäuser'], 'System wurde ausgeweitet.', 'System wurde ausgeweitet. System wurde ausgeweitet. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Lager dienten Haft und ___.', ['Terror', 'Verfolgung']),
    fact('recht', 'Recht im NS?', 'Recht wurde ideologisch gebeugt und Unrecht legalisiert', ['Unverändert rechtsstaatlich', 'Mehr Gewaltenteilung', 'Nur internationale Gerichte'], 'Willkür trat an Stelle von Schutz.', 'Willkür trat an Stelle von Schutz. Willkür trat an Stelle von Schutz. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Recht wurde ideologisch ___.', ['gebeugt', 'missbraucht']),
    fact('verfolgung', 'Verfolgte Gruppen?', 'Juden, politische Gegner, Roma, Homosexuelle u. a.', ['Niemand verfolgt', 'Nur Unternehmer', 'Nur Ausländer ohne System'], 'Ausgrenzung eskalierte schrittweise.', 'Ausgrenzung eskalierte schrittweise. Ausgrenzung eskalierte schrittweise. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Viele Gruppen wurden systematisch ___.', ['verfolgt', 'ausgegrenzt']),
    fact('alltag', 'Alltag unter Diktatur?', 'Anpassung, Mitmachen, Angst und begrenzte Nischen', ['Volle Meinungsfreiheit', 'Keine Propaganda', 'Nur Widerstand überall'], 'Zustimmung und Opportunismus mischten sich.', 'Zustimmung und Opportunismus mischten sich. Zustimmung und Opportunismus mischten sich. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Alltag war von Angst und ___ geprägt.', ['Anpassung', 'Propaganda']),
    fact('propaganda', 'Propaganda und Terror?', 'Beide sicherten Herrschaft gemeinsam', ['Nur Terror ohne Worte', 'Nur Propaganda ohne Gewalt', 'Keine Herrschaftstechnik'], 'Öffentlichkeit wurde gesteuert.', 'Öffentlichkeit wurde gesteuert. Öffentlichkeit wurde gesteuert. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Herrschaft ruhte auf Propaganda und ___.', ['Terror']),
    fact('sachsen', 'Regionalbezug?', 'NS-Herrschaft prägte auch Sachsen (Gau, Verfolgung vor Ort)', ['Sachsen blieb völlig unberührt', 'Nur Berlin betroffen', 'Nur Ausland'], 'Lokale Quellen zeigen Alltag der Diktatur.', 'Lokale Quellen zeigen Alltag der Diktatur. Lokale Quellen zeigen Alltag der Diktatur. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Auch in Sachsen gab es NS-___ und Verfolgung.', ['Herrschaft', 'Strukturen']),
  ],
  pairs: [
    pair('p1', 'Gestapo', 'Politische Geheimpolizei', 'Verfolgt Gegner'),
    pair('p2', 'Konzentrationslager', 'Haft und Terror', 'System der Gewalt'),
    pair('p3', 'Gleichschaltung', 'Erfassung der Gesellschaft', 'Pluralität zerstört'),
  ],
  trueFalse: [
    tf('t1', 'Die NS-Diktatur sicherte Herrschaft durch Terror und Gleichschaltung.', true, 'Gestapo und Lager waren zentrale Instrumente.', 'Gestapo und Lager waren zentrale Instrumente. Recht wurde gebeugt. Alltag war von Angst geprägt.'),
  ],
}

const k9_lb3_holocaust: BioBank = {
  quelle: 'Wikipedia: Holocaust',
  url: 'https://de.wikipedia.org/wiki/Holocaust',
  conceptPrefix: 'ge:k9:holocaust',
  facts: [
    fact('begriff', 'Was meint Holocaust/Shoah?', 'Völkermord an den europäischen Juden durch die NS-Herrschaft', ['Nur Kriegsgefangenenlager ohne System', 'Nur Vertreibung ohne Mord', 'Nur Wirtschaftskrise'], 'Millionen Menschen wurden ermordet.', 'Millionen Menschen wurden ermordet. Millionen Menschen wurden ermordet. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Holocaust meint den ___ an den Juden.', ['Völkermord', 'Mord']),
    fact('stufen', 'Eskalationsstufen?', 'Ausgrenzung, Entrechtung, Deportation und Vernichtung', ['Sofortige Gleichberechtigung', 'Nur verbale Kritik', 'Keine Stufen'], 'Nürnberger Gesetze sind frühe Zäsur.', 'Nürnberger Gesetze sind frühe Zäsur. Nürnberger Gesetze sind frühe Zäsur. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Auf Ausgrenzung folgten Deportation und ___.', ['Vernichtung']),
    fact('wannsee', 'Wannsee-Konferenz?', 'Koordination der systematischen Ermordung', ['Friedenskonferenz', 'Kulturtreffen', 'Wirtschaftsgipfel ohne Politik'], 'Bürokratie organisierte Völkermord.', 'Bürokratie organisierte Völkermord. Bürokratie organisierte Völkermord. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Wannsee steht für bürokratische ___ des Mords.', ['Koordination', 'Organisation']),
    fact('lager', 'Vernichtungslager?', 'Orte industrieller Massenvernichtung', ['Nur Arbeitsämter', 'Nur Schulen', 'Nur Krankenhäuser'], 'Auschwitz ist zentrales Symbol.', 'Auschwitz ist zentrales Symbol. Auschwitz ist zentrales Symbol. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Vernichtungslager dienten der Massen___.', ['vernichtung', 'ermordung']),
    fact('taeter', 'Täterschaft?', 'Viele Beteiligten: Führung, Behörden, Helfer', ['Nur eine Person allein', 'Keine Verantwortung', 'Nur Ausland'], 'Mitläufertum und Gehorsam sind Themen.', 'Mitläufertum und Gehorsam sind Themen. Mitläufertum und Gehorsam sind Themen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Am Holocaust waren viele ___ beteiligt.', ['Täter', 'Beteiligte']),
    fact('opfer', 'Opfergruppen?', 'Juden zentral; weitere Gruppen wurden verfolgt und ermordet', ['Nur Soldaten', 'Nur Politiker', 'Nur Unternehmer'], 'Roma und andere zählten dazu.', 'Roma und andere zählten dazu. Roma und andere zählten dazu. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Neben Juden wurden weitere Gruppen ___.', ['verfolgt', 'ermordet']),
    fact('erinnerung', 'Erinnerungskultur?', 'Gedenken, Bildung und Verantwortung gegen Antisemitismus', ['Vergessen als Pflicht', 'Leugnung erlaubt', 'Nur Feiern ohne Opfer'], 'Zeugnisse der Überlebenden sind zentral.', 'Zeugnisse der Überlebenden sind zentral. Zeugnisse der Überlebenden sind zentral. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Erinnerung dient Bildung und ___.', ['Verantwortung', 'Gedenken']),
    fact('leugnung', 'Warum Leugnung verboten/gefährlich?', 'Weil sie Täter entlastet und Opfer erneut verletzt', ['Weil Geschichte egal ist', 'Weil Quellen fehlen', 'Weil Kritik unnötig'], 'Fakten sind historisch gesichert.', 'Fakten sind historisch gesichert. Fakten sind historisch gesichert. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Leugnung verletzt Opfer und verfälscht ___.', ['Geschichte', 'Fakten']),
  ],
  pairs: [
    pair('p1', 'Shoah', 'Hebräischer Begriff für Katastrophe', 'Völkermord'),
    pair('p2', 'Auschwitz', 'Vernichtungslager', 'Symbol der Shoah'),
    pair('p3', 'Nürnberger Gesetze', 'Entrechtung 1935', 'Stufe der Ausgrenzung'),
  ],
  trueFalse: [
    tf('t1', 'Der Holocaust war der systematische Völkermord an den europäischen Juden.', true, 'Ausgrenzung eskalierte bis zur Vernichtung.', 'Ausgrenzung eskalierte bis zur Vernichtung. Bürokratie und Täterschaft sind zu benennen. Erinnerung bleibt Aufgabe.'),
  ],
}

const k9_lb3_widerstand: BioBank = {
  quelle: 'Wikipedia: Widerstand gegen den Nationalsozialismus',
  url: 'https://de.wikipedia.org/wiki/Widerstand_gegen_den_Nationalsozialismus',
  conceptPrefix: 'ge:k9:widerstand',
  facts: [
    fact('formen', 'Formen des Widerstands?', 'Vom Alltagswiderstand bis zu organisierten Attentaten', ['Nur Zustimmung überall', 'Keine Opposition', 'Nur Emigration ohne Handlung'], 'Risiko war extrem hoch.', 'Risiko war extrem hoch. Risiko war extrem hoch. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Widerstand reichte von Alltag bis zu ___.', ['Attentaten', 'Organisation']),
    fact('weiss', 'Weiße Rose?', 'Studierende protestierten mit Flugblättern gegen das Regime', ['Militärputsch der Wehrmacht allein', 'Nur Unternehmerlobby', 'Nur Auslandspresse'], 'Geschwister Scholl sind bekannt.', 'Geschwister Scholl sind bekannt. Geschwister Scholl sind bekannt. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die Weiße Rose nutzte ___.', ['Flugblätter']),
    fact('20juli', '20. Juli 1944?', 'Attentat und Umsturzversuch konservativ-militärischer Kreise', ['Gründung der Bundesrepublik', 'Ende des Ersten Weltkriegs', 'Wiener Kongress'], 'Das Attentat scheiterte.', 'Das Attentat scheiterte. Das Attentat scheiterte. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Am 20. Juli 1944 scheiterte ein ___.', ['Attentat', 'Umsturzversuch']),
    fact('motive', 'Welche Motive spielten eine Rolle?', 'Ethische, religiöse, politische und militärische Gründe', ['Nur Langeweile', 'Nur Sport', 'Nur Wirtschaft ohne Moral'], 'Menschen handelten unter Lebensgefahr.', 'Menschen handelten unter Lebensgefahr. Menschen handelten unter Lebensgefahr. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Motive waren ethisch, religiös oder ___.', ['politisch', 'militärisch']),
    fact('grenzen', 'Grenzen des Widerstands?', 'Überwachung und Terror machten Organisation schwer', ['Widerstand war risikolos', 'Staat tolerierte Opposition', 'Viele Parteien legal'], 'Die Mehrheit passte sich an.', 'Die Mehrheit passte sich an. Die Mehrheit passte sich an. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Terror erschwerte ___.', ['Organisation', 'Widerstand']),
    fact('zivilcourage', 'Zivilcourage?', 'Mut, Unrecht nicht mitzumachen und anderen beizustehen', ['Nur Gehorsam', 'Nur Zuschauen', 'Nur Denunziation'], 'Kleine Handlungen konnten Leben retten.', 'Kleine Handlungen konnten Leben retten. Kleine Handlungen konnten Leben retten. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Zivilcourage meint Mut gegen ___.', ['Unrecht']),
    fact('erinnerung', 'Erinnerung an Widerstand?', 'Würdigung ohne Mythos der flächendeckenden Opposition', ['Alle Deutschen waren im Widerstand', 'Kein Widerstand existierte', 'Nur Feiern ohne Risiko'], 'Differenzierung ist nötig.', 'Differenzierung ist nötig. Differenzierung ist nötig. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Erinnerung braucht ___ statt Mythos.', ['Differenzierung', 'Genauigkeit']),
    fact('lehren', 'Welche Lehren lassen sich ziehen?', 'Demokratie und Menschenrechte brauchen aktive Verteidigung', ['Passivität genügt', 'Unrecht ignorieren', 'Nur Staat ohne Bürger'], 'Gegenwartsbezug ist Lehrplanziel.', 'Gegenwartsbezug ist Lehrplanziel. Gegenwartsbezug ist Lehrplanziel. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Demokratie braucht aktive ___.', ['Verteidigung', 'Bürger']),
  ],
  pairs: [
    pair('p1', 'Weiße Rose', 'Studierendenwiderstand', 'Flugblätter'),
    pair('p2', '20. Juli', 'Attentat 1944', 'Umsturzversuch'),
    pair('p3', 'Zivilcourage', 'Mut gegen Unrecht', 'Alltagshandeln'),
  ],
  trueFalse: [
    tf('t1', 'Widerstand gegen den NS war vielfältig und lebensgefährlich.', true, 'Er blieb Minderheit, aber moralisch bedeutsam.', 'Er blieb Minderheit, aber moralisch bedeutsam. Formen reichten vom Alltag bis zum Attentat. Erinnerung braucht Differenzierung.'),
  ],
}

const k9_lb4_ausgleich: BioBank = {
  quelle: 'Wikipedia: Locarno-Verträge',
  url: 'https://de.wikipedia.org/wiki/Locarno-Vertr%C3%A4ge',
  conceptPrefix: 'ge:k9:ausgleich',
  facts: [
    fact('rapallo', 'Rapallo 1922?', 'Annäherung zwischen Deutschland und Sowjetrussland', ['Kriegserklärung', 'EU-Beitritt', 'Kolonialvertrag'], 'Beide Staaten waren isoliert.', 'Beide Staaten waren isoliert. Beide Staaten waren isoliert. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Rapallo war eine ___ zwischen DE und Sowjetrussland.', ['Annäherung']),
    fact('locarno', 'Locarno 1925?', 'Westliche Grenzgarantien und Entspannungspolitik', ['Sofortige Wiederaufrüstung', 'Kriegsbeginn', 'Nur Handelsboykott'], 'Stresemann steht dafür.', 'Stresemann steht dafür. Stresemann steht dafür. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Locarno brachte ___ im Westen.', ['Garantien', 'Entspannung']),
    fact('voelkerbund', 'Beitritt DE zum Völkerbund?', 'Schritt zur internationalen Einbindung', ['Austritt sofort', 'Kriegserklärung', 'Nur Sportmitgliedschaft'], 'Außenpolitik suchte Anerkennung.', 'Außenpolitik suchte Anerkennung. Außenpolitik suchte Anerkennung. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Der Beitritt diente internationaler ___.', ['Einbindung', 'Anerkennung']),
    fact('revision', 'Revision der Nachkriegsordnung?', 'Viele Deutsche wollten Versailles revidieren', ['Alle akzeptierten Grenzen dauerhaft', 'Keine Revisionswünsche', 'Nur Kulturdebatte'], 'Methoden unterschieden sich.', 'Methoden unterschieden sich. Methoden unterschieden sich. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Viele erstrebten ___ von Versailles.', ['Revision']),
    fact('ausgleich', 'Ausgleichspolitik?', 'Verhandlungen und Verträge statt isolierter Konfrontation', ['Nur Drohpolitik', 'Nur Krieg', 'Nur Isolation'], 'Wirtschaftliche Verflechtung half zeitweise.', 'Wirtschaftliche Verflechtung half zeitweise. Wirtschaftliche Verflechtung half zeitweise. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Ausgleich setzte auf Verhandlungen und ___.', ['Verträge']),
    fact('grenzen', 'Ostgrenzen?', 'Weniger abgesichert als der Westen – Spannungsfeld', ['Alle Grenzen gleich garantiert', 'Keine Grenzfragen', 'Nur Seefahrt'], 'Polenpolitik blieb konfliktträchtig.', 'Polenpolitik blieb konfliktträchtig. Polenpolitik blieb konfliktträchtig. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Ostgrenzen waren weniger ___.', ['abgesichert', 'garantiert']),
    fact('erfolg', 'Grenzen des Erfolgs?', 'Entspannung blieb fragil und innenpolitisch umstritten', ['Ewiger Frieden gesichert', 'Keine Kritik', 'Nur Triumph'], 'Nationalisten lehnten ab.', 'Nationalisten lehnten ab. Nationalisten lehnten ab. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Entspannung blieb ___.', ['fragil', 'umstritten']),
    fact('kontrast', 'Kontrast zur NS-Zeit?', 'Später trat aggressive Expansion an die Stelle des Ausgleichs', ['NS setzte Locarno fort unverändert', 'Keine Änderung', 'Nur Kulturpolitik'], 'Bruch der Ordnung folgte.', 'Bruch der Ordnung folgte. Bruch der Ordnung folgte. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'NS ersetzte Ausgleich durch ___.', ['Expansion', 'Aggression']),
  ],
  pairs: [
    pair('p1', 'Locarno', 'Verträge 1925', 'Westgarantie'),
    pair('p2', 'Stresemann', 'Außenpolitiker der Verständigung', 'Völkerbund'),
    pair('p3', 'Revision', 'Änderung von Versailles', 'Politisches Ziel'),
  ],
  trueFalse: [
    tf('t1', 'In den 1920ern gab es Phasen außenpolitischen Ausgleichs.', true, 'Locarno und Völkerbund sind Stichworte.', 'Locarno und Völkerbund sind Stichworte. Revision blieb Ziel vieler. Die Entspannung war fragil.'),
  ],
}

const k9_lb4_aggression: BioBank = {
  quelle: 'Wikipedia: Appeasement-Politik',
  url: 'https://de.wikipedia.org/wiki/Appeasement-Politik',
  conceptPrefix: 'ge:k9:aggression',
  facts: [
    fact('expansion', 'NS-Expansion?', 'Schrittweise Verletzung der Nachkriegsordnung', ['Strikte Einhaltung Locarnos', 'Nur Friedenpolitik', 'Nur Abrüstung'], 'Rheinland, Österreich, Sudetenland sind Stationen.', 'Rheinland, Österreich, Sudetenland sind Stationen. Rheinland, Österreich, Sudetenland sind Stationen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'NS betrieb schrittweise ___.', ['Expansion']),
    fact('appeasement', 'Appeasement?', 'Nachgeben westlicher Mächte in Hoffnung auf Frieden', ['Sofortiger Krieg 1933', 'Keine Diplomatie', 'Nur Wirtschaftsboikott ohne Politik'], 'München 1938 ist Symbol.', 'München 1938 ist Symbol. München 1938 ist Symbol. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Appeasement meint ___ in Hoffnung auf Frieden.', ['Nachgeben']),
    fact('muenchen', 'Münchner Abkommen?', 'Abtretung des Sudetenlands ohne tschechoslowakische Zustimmung', ['Schutz der Tschechoslowakei', 'Gründung der UNO', 'Ende des Krieges 1945'], 'Kurze Atempause, kein dauernder Frieden.', 'Kurze Atempause, kein dauernder Frieden. Kurze Atempause, kein dauernder Frieden. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', '1938 wurde das ___ abgetreten.', ['Sudetenland']),
    fact('bruch', 'Bruch der Ordnung?', 'Verträge und Zusagen wurden systematisch gebrochen', ['Verträge heilig gehalten', 'Keine Aggression', 'Nur Kulturabkommen'], 'Völkerrecht wurde missachtet.', 'Völkerrecht wurde missachtet. Völkerrecht wurde missachtet. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die NS-Politik ___ Verträge.', ['brach', 'verletzte']),
    fact('krieg', 'Kriegsbeginn 1939?', 'Überfall auf Polen löste den Zweiten Weltkrieg aus', ['Friedenskonferenz', 'Nur Handelsstreit', 'Nur Kolonialkrieg fernab'], 'Bündnisse zogen weitere Staaten hinein.', 'Bündnisse zogen weitere Staaten hinein. Bündnisse zogen weitere Staaten hinein. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Der Überfall auf ___ löste den Krieg aus.', ['Polen']),
    fact('ideologie', 'Ideologische Triebkräfte?', 'Rassismus, Lebensraum und Gewaltbereitschaft', ['Nur freie Marktwirtschaft', 'Nur Pazifismus', 'Nur Sport'], 'Expansion war Programm, nicht Zufall.', 'Expansion war Programm, nicht Zufall. Expansion war Programm, nicht Zufall. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Expansion folgte rassistischer ___.', ['Ideologie', 'Programmatik']),
    fact('urteil', 'Bewertung Appeasement?', 'Kurzfristig Konfliktvermeidung, langfristig Ermutigung der Aggression', ['Immer erfolgreiche Friedenssicherung', 'Keine Ambivalenz', 'Nur Heldentat ohne Kritik'], 'Historiker urteilen differenziert.', 'Historiker urteilen differenziert. Historiker urteilen differenziert. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Appeasement wirkte langfristig als ___ der Aggression.', ['Ermutigung']),
    fact('lehren', 'Lehren für Frieden?', 'Frühe klare Grenzen gegen Aggression können nötig sein', ['Immer nachgeben', 'Immer sofort totaler Krieg', 'Diplomatie unnötig'], 'Institutionen und Abschreckung gehören zusammen.', 'Institutionen und Abschreckung gehören zusammen. Institutionen und Abschreckung gehören zusammen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Gegen Aggression braucht es klare ___.', ['Grenzen', 'Haltung']),
  ],
  pairs: [
    pair('p1', 'Appeasement', 'Nachgeben der Westmächte', 'München 1938'),
    pair('p2', 'Sudetenland', '1938 abgetreten', 'Schwächung der ČSR'),
    pair('p3', '1. September 1939', 'Überfall auf Polen', 'Kriegsbeginn'),
  ],
  trueFalse: [
    tf('t1', 'NS-Expansion brach die Nachkriegsordnung und führte in den Krieg.', true, 'Appeasement stoppte die Aggression nicht dauerhaft.', 'Appeasement stoppte die Aggression nicht dauerhaft. 1939 begann der Weltkrieg. Ideologie trieb Expansion.'),
  ],
}

const k10_lb1_allianz_bruch: BioBank = {
  quelle: 'Wikipedia: Konferenz von Jalta',
  url: 'https://de.wikipedia.org/wiki/Konferenz_von_Jalta',
  conceptPrefix: 'ge:k10:allianz-bruch',
  facts: [
    fact('allianz', 'Kriegsallianz USA–UdSSR?', 'Gemeinsamer Kampf gegen die Achsenmächte trotz Systemgegensatz', ['Immer enge Ideologiefreunde', 'Kein gemeinsamer Krieg', 'Nur Handelsvertrag'], 'Notbündnis gegen Hitler-Deutschland.', 'Notbündnis gegen Hitler-Deutschland. Notbündnis gegen Hitler-Deutschland. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die Allianz richtete sich gegen die ___.', ['Achsenmächte']),
    fact('jalta', 'Jalta 1945?', 'Beratung der Sieger über Nachkriegsordnung', ['Gründung des Kaiserreichs', 'Ende des Ersten Weltkriegs', 'Wiener Kongress'], 'Interessengegensätze wurden sichtbar.', 'Interessengegensätze wurden sichtbar. Interessengegensätze wurden sichtbar. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'In Jalta berieten die ___ über die Nachkriegsordnung.', ['Sieger']),
    fact('potsdam', 'Potsdam 1945?', 'Regelungen zu Deutschland und Besatzung', ['Sofortige Wiedervereinigung', 'Keine Besatzung', 'Nur Kulturabkommen'], 'Vier Zonen entstanden.', 'Vier Zonen entstanden. Vier Zonen entstanden. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Potsdam regelte u. a. die ___ Deutschlands.', ['Besatzung', 'Behandlung']),
    fact('bruch', 'Bruch der Sieger?', 'Systemkonflikt und Misstrauen beendeten die Kooperation', ['Ewige Freundschaft', 'Sofortige Weltregierung', 'Nur Sportkonflikt'], 'Kalter Krieg begann.', 'Kalter Krieg begann. Kalter Krieg begann. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Misstrauen führte zum ___ der Allianz.', ['Bruch']),
    fact('ideologie', 'Systemgegensatz?', 'Kapitalistische Demokratie versus kommunistische Diktatur', ['Identische Systeme', 'Keine Ideologie', 'Nur Religion'], 'Propaganda verstärkte Feindbilder.', 'Propaganda verstärkte Feindbilder. Propaganda verstärkte Feindbilder. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Es standen unterschiedliche ___ gegeneinander.', ['Systeme', 'Ideologien']),
    fact('atom', 'Atombombe Wirkung?', 'Neue Machtasymmetrie und Abschreckungslogik', ['Kein Einfluss auf Politik', 'Nur zivile Energie sofort global', 'Nur Sport'], 'Rüstungswettlauf folgte.', 'Rüstungswettlauf folgte. Rüstungswettlauf folgte. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die Atombombe prägte ___.', ['Abschreckung', 'Macht']),
    fact('osteuropa', 'Osteuropa?', 'Sowjetische Einflusssphäre festigte sich', ['Sofortige freie Demokratien überall', 'Keine Einflusszonen', 'Nur US-Kontrolle'], 'Teilung Europas zeichnete sich ab.', 'Teilung Europas zeichnete sich ab. Teilung Europas zeichnete sich ab. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'In Osteuropa festigte sich sowjetische ___.', ['Einfluss', 'Kontrolle']),
    fact('deutschland', 'Deutschlandfrage?', 'Besatzung und unterschiedliche Ziele der Sieger', ['Sofort einheitlicher Staat im Konsens', 'Keine Besatzung', 'Nur Rückkehr 1937 unverändert'], 'Teilung wurde wahrscheinlich.', 'Teilung wurde wahrscheinlich. Teilung wurde wahrscheinlich. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die Sieger verfolgten unterschiedliche ___ in DE.', ['Ziele', 'Interessen']),
  ],
  pairs: [
    pair('p1', 'Jalta', 'Konferenz 1945', 'Nachkriegsordnung'),
    pair('p2', 'Potsdam', 'Besatzungsregelungen', 'Deutschland'),
    pair('p3', 'Kalter Krieg', 'Konflikt ohne direkten Weltkrieg der Blöcke', 'Nach 1945'),
  ],
  trueFalse: [
    tf('t1', 'Die Kriegsallianz zerbrach rasch im Systemkonflikt.', true, 'Jalta und Potsdam zeigten schon Gegensätze.', 'Jalta und Potsdam zeigten schon Gegensätze. Einflusszonen entstanden. Der Kalte Krieg begann.'),
  ],
}

const k10_lb1_kaltkrieg_phasen: BioBank = {
  quelle: 'Wikipedia: Kalter Krieg',
  url: 'https://de.wikipedia.org/wiki/Kalter_Krieg',
  conceptPrefix: 'ge:k10:kaltkrieg-phasen',
  facts: [
    fact('containment', 'Eindämmungspolitik?', 'US-Strategie gegen Ausbreitung des Kommunismus', ['Sofortige Weltrevolution der USA', 'Ablehnung jeder Außenpolitik', 'Nur Kulturförderung'], 'Truman-Doktrin und Marshallplan sind Stichworte.', 'Truman-Doktrin und Marshallplan sind Stichworte. Truman-Doktrin und Marshallplan sind Stichworte. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Containment meint ___ des Kommunismus.', ['Eindämmung']),
    fact('block', 'Blockbildung?', 'NATO und Warschauer Pakt als Militärbündnisse', ['Keine Bündnisse', 'Nur Wirtschaftsvereine ohne Militär', 'Nur olympische Teams'], 'Europa war geteilt.', 'Europa war geteilt. Europa war geteilt. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Blöcke organisierten sich in Militär___.', ['bündnissen', 'pakt']),
    fact('korea', 'Koreakrieg?', 'Heißer Krieg im Kalten Krieg mit Blockbeteiligung', ['Nur Handelsstreit', 'Nur Sport', 'Nur Kulturfest'], 'Stellvertreterkriege wurden typisch.', 'Stellvertreterkriege wurden typisch. Stellvertreterkriege wurden typisch. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Korea war ein ___ Krieg im Ost-West-Konflikt.', ['heißer', 'stellvertretender']),
    fact('kuba', 'Kubakrise 1962?', 'Nukleare Konfrontation knapp vor Eskalation', ['Sofortiger Weltfriede', 'Nur Wirtschaftsembargo ohne Risiko', 'Nur Kulturreise'], 'Direktleitung und Abrüstungsansätze folgten.', 'Direktleitung und Abrüstungsansätze folgten. Direktleitung und Abrüstungsansätze folgten. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die Kubakrise brachte die Welt nahe an einen ___.', ['Atomkrieg', 'Krieg']),
    fact('entspannung', 'Entspannungspolitik?', 'Verhandlungen und Rüstungskontrolle in Phasen', ['Immer nur Eskalation', 'Keine Verträge', 'Nur Propaganda ohne Dialog'], 'SALT und KSZE sind Stichworte.', 'SALT und KSZE sind Stichworte. SALT und KSZE sind Stichworte. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Entspannung suchte ___ und Kontrolle.', ['Verhandlungen', 'Rüstungskontrolle']),
    fact('ruestung', 'Rüstungswettlauf?', 'Gegenseitige nukleare Aufrüstung und Abschreckung', ['Abrüstung ohne Pause immer', 'Keine Atomwaffen', 'Nur konventionell ohne Politik'], 'Gleichgewicht des Schreckens.', 'Gleichgewicht des Schreckens. Gleichgewicht des Schreckens. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Abschreckung beruhte auf nuklearer ___.', ['Aufrüstung', 'Rüstung']),
    fact('ende', 'Ende des Kalten Kriegs?', 'Reformdruck, Rüstungslasten und 1989/91 Umbrüche', ['Militärischer Endsieg der UdSSR', 'Unverändert bis heute identisch', 'Nur Sportentscheidung'], 'Sowjetunion löste sich auf.', 'Sowjetunion löste sich auf. Sowjetunion löste sich auf. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Umbrüche 1989/91 beendeten den ___.', ['Kalten Krieg']),
    fact('phasen', 'Warum Phasen wichtig?', 'Konflikt intensität und Methoden wechselten', ['Kalter Krieg war immer gleich', 'Keine Periodisierung möglich', 'Nur ein Tag'], 'Eskalation und Entspannung wechselten.', 'Eskalation und Entspannung wechselten. Eskalation und Entspannung wechselten. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Der Kalte Krieg verlief in unterschiedlichen ___.', ['Phasen']),
  ],
  pairs: [
    pair('p1', 'Containment', 'Eindämmung', 'US-Strategie'),
    pair('p2', 'Kubakrise', '1962', 'Nukleare Eskalationsgefahr'),
    pair('p3', 'Entspannung', 'Dialogphasen', 'Rüstungskontrolle'),
  ],
  trueFalse: [
    tf('t1', 'Der Kalte Krieg verlief in Phasen von Eskalation und Entspannung.', true, 'Kubakrise und Containment sind Schlüssel.', 'Kubakrise und Containment sind Schlüssel. Blöcke rüsteten abschreckend. 1989/91 endete die Ordnung.'),
  ],
}

const k10_lb2_teilung: BioBank = {
  quelle: 'Wikipedia: Deutsche Teilung',
  url: 'https://de.wikipedia.org/wiki/Deutsche_Teilung',
  conceptPrefix: 'ge:k10:teilung',
  facts: [
    fact('zonen', 'Besatzungszonen?', 'Vier Siegermächte verwalteten Deutschland', ['Nur eine Macht', 'Keine Besatzung', 'Nur sächsische Verwaltung allein'], 'Unterschiedliche Politik in den Zonen.', 'Unterschiedliche Politik in den Zonen. Unterschiedliche Politik in den Zonen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Deutschland wurde in vier ___ geteilt.', ['Zonen', 'Besatzungszonen']),
    fact('blockade', 'Berlin-Blockade 1948/49?', 'Sowjetische Sperrung Westberlins, Luftbrücke der Westmächte', ['Sofortige Einheit', 'Nur Kulturfestival', 'Nur Handelsmesse'], 'Teilung vertiefte sich.', 'Teilung vertiefte sich. Teilung vertiefte sich. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die Luftbrücke versorgte West___.', ['berlin', 'Berlin']),
    fact('staaten', 'Zwei Staaten 1949?', 'Gründung von BRD und DDR', ['Sofortige Wiedervereinigung', 'Nur ein Staat', 'Nur Besatzung ohne Staaten'], 'Konkurrierende Systeme.', 'Konkurrierende Systeme. Konkurrierende Systeme. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', '1949 entstanden BRD und ___.', ['DDR']),
    fact('mauer', 'Mauerbau 1961?', 'Abriegelung Ost-Berlins gegen Flucht in den Westen', ['Öffnung der Grenze', 'Nur Straßenbau', 'Nur Kulturdenkmal ohne Politik'], 'Familien wurden getrennt.', 'Familien wurden getrennt. Familien wurden getrennt. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', '1961 wurde die Berliner ___ gebaut.', ['Mauer']),
    fact('flucht', 'Fluchtbewegungen?', 'Viele verließen die DDR Richtung Westen', ['Keine Migration', 'Nur Zuzug in die DDR', 'Nur Tourismus'], 'Repression und Perspektivlosigkeit trieben Menschen.', 'Repression und Perspektivlosigkeit trieben Menschen. Repression und Perspektivlosigkeit trieben Menschen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Viele flohen aus der ___.', ['DDR']),
    fact('alltag', 'Alltag der Teilung?', 'Getrennte Lebenswelten, Besuchskontakte begrenzt', ['Völlig offene Grenzen immer', 'Keine Unterschiede', 'Nur gleiche Medien'], 'Grenzen prägten Biografien.', 'Grenzen prägten Biografien. Grenzen prägten Biografien. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Teilung prägte getrennte ___.', ['Lebenswelten', 'Alltage']),
    fact('status', 'Berlin-Status?', 'Besonderer Status und Krisenherd im Kalten Krieg', ['Normale Provinzstadt ohne Politik', 'Nur Hauptstadt der Einheit sofort', 'Nur Dorf'], 'Vier-Mächte-Verantwortung blieb.', 'Vier-Mächte-Verantwortung blieb. Vier-Mächte-Verantwortung blieb. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Berlin war besonderer ___ im Konflikt.', ['Status', 'Krisenherd']),
    fact('zäsur', 'Mauer als Zäsur?', 'Sichtbares Symbol der Teilung und Unfreiheit', ['Symbol der Einheit', 'Nur Architektur ohne Politik', 'Nur Touristenattraktion damals geplant'], 'Erinnerung bleibt zentral.', 'Erinnerung bleibt zentral. Erinnerung bleibt zentral. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die Mauer symbolisierte ___ und Unfreiheit.', ['Teilung']),
  ],
  pairs: [
    pair('p1', 'Berlin-Blockade', '1948/49', 'Luftbrücke'),
    pair('p2', 'Mauerbau', '1961', 'Abriegelung'),
    pair('p3', 'Zwei Staaten', 'BRD und DDR 1949', 'Systemkonflikt'),
  ],
  trueFalse: [
    tf('t1', 'Deutschlands Teilung vertiefte sich von Zonen über Staaten bis zur Mauer.', true, 'Berlin war Krisenherd des Kalten Kriegs.', 'Berlin war Krisenherd des Kalten Kriegs. Flucht und Repression prägten. Die Mauer wurde Symbol.'),
  ],
}

const k10_lb2_zwei_staaten: BioBank = {
  quelle: 'Wikipedia: Deutsche Demokratische Republik',
  url: 'https://de.wikipedia.org/wiki/Deutsche_Demokratische_Republik',
  conceptPrefix: 'ge:k10:zwei-staaten',
  facts: [
    fact('brd', 'BRD-System?', 'Parlamentarische Demokratie und soziale Marktwirtschaft', ['SED-Diktatur', 'Reine Planwirtschaft ohne Markt', 'Nur Militärjunta'], 'Grundgesetz als Basis.', 'Grundgesetz als Basis. Grundgesetz als Basis. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die BRD war eine parlamentarische ___.', ['Demokratie']),
    fact('ddr', 'DDR-System?', 'SED-Herrschaft, Planwirtschaft und Überwachung', ['Mehrparteiendemokratie westlich', 'Freie Marktwirtschaft', 'Nur Kulturstaat ohne Partei'], 'Stasi überwachte die Gesellschaft.', 'Stasi überwachte die Gesellschaft. Stasi überwachte die Gesellschaft. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die DDR war eine ___ unter SED-Führung.', ['Diktatur', 'Diktatur']),
    fact('hallstein', 'Hallstein-Doktrin?', 'BRD beanspruchte Alleinvertretung, druckte auf Anerkennung der DDR', ['Sofortige Doppelanerkennung', 'Keine Außenpolitik', 'Nur Kulturabkommen'], 'Später aufgeweicht.', 'Später aufgeweicht. Später aufgeweicht. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Hallstein beanspruchte ___ der BRD.', ['Alleinvertretung']),
    fact('block', 'Blockbindung?', 'BRD/NATO und DDR/Warschauer Pakt', ['Neutrale Staaten ohne Bündnis', 'Nur UNO-Mitgliedschaft ohne Blöcke', 'Nur Sport'], 'Sicherheit hing an Blöcken.', 'Sicherheit hing an Blöcken. Sicherheit hing an Blöcken. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Beide Staaten waren ___ gebunden.', ['block', 'militärisch']),
    fact('wirtschaft', 'Wirtschaftsvergleich?', 'Westliches Wirtschaftswunder versus Mängel in der Planwirtschaft', ['DDR reicher als BRD dauerhaft', 'Identische Systeme', 'Keine Wirtschaft'], 'Konsum und Versorgung unterschieden sich.', 'Konsum und Versorgung unterschieden sich. Konsum und Versorgung unterschieden sich. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Im Westen sprach man vom Wirtschafts___.', ['wunder']),
    fact('ideologie', 'Systemkonflikt im Alltag?', 'Propaganda und Konkurrenz um Legitimität', ['Keine Ideologie', 'Nur Sport ohne Politik', 'Nur Religion'], 'Beide Seiten deuteten Geschichte.', 'Beide Seiten deuteten Geschichte. Beide Seiten deuteten Geschichte. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Beide Staaten kämpften um ___.', ['Legitimität', 'Deutung']),
    fact('menschen', 'Menschenrechte?', 'Im Westen größerer Schutz, in der DDR systematische Einschränkung', ['Identisch frei überall', 'DDR freier als Westen', 'Keine Rechte thematisiert'], 'Reise und Meinungsfreiheit differierten.', 'Reise und Meinungsfreiheit differierten. Reise und Meinungsfreiheit differierten. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'In der DDR waren Rechte stark ___.', ['eingeschränkt']),
    fact('wandel', 'Wandel der Beziehungen?', 'Von Konfrontation zu geregelten Kontakten (Ostpolitik)', ['Immer nur Krieg', 'Keine Verträge je', 'Nur Isolation total'], 'Grundlagenvertrag ist Stichwort.', 'Grundlagenvertrag ist Stichwort. Grundlagenvertrag ist Stichwort. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Beziehungen wandelten sich von Konfrontation zu ___.', ['Kontakten', 'Verträgen']),
  ],
  pairs: [
    pair('p1', 'Grundgesetz', 'Verfassung der BRD', 'Demokratie'),
    pair('p2', 'SED', 'Führungspartei der DDR', 'Diktatur'),
    pair('p3', 'Hallstein-Doktrin', 'Alleinvertretungsanspruch', 'Außenpolitik'),
  ],
  trueFalse: [
    tf('t1', 'BRD und DDR verkörperten konkurrierende Systeme im Ost-West-Konflikt.', true, 'Demokratie versus SED-Diktatur.', 'Demokratie versus SED-Diktatur. Wirtschaft und Alltag differierten. Beziehungen wandelten sich später.'),
  ],
}

const k10_lb2_deutsche_frage: BioBank = {
  quelle: 'Wikipedia: Neue Ostpolitik',
  url: 'https://de.wikipedia.org/wiki/Neue_Ostpolitik',
  conceptPrefix: 'ge:k10:deutsche-frage',
  facts: [
    fact('frage', 'Deutsche Frage?', 'Status und Zukunft der geteilten Nation', ['Nur Sportfrage', 'Nur Wirtschaftsstatistik', 'Nur Kulturfestival'], 'Sie blieb im Kalten Krieg offen.', 'Sie blieb im Kalten Krieg offen. Sie blieb im Kalten Krieg offen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die deutsche Frage betraf die ___ Nation.', ['geteilte']),
    fact('ostpolitik', 'Neue Ostpolitik?', 'Entspannung und Verträge mit Osteuropa unter Brandt', ['Sofortige Annexion', 'Kriegspolitik', 'Nur Westintegration ohne Osten'], '„Wandel durch Annäherung“.', '„Wandel durch Annäherung“. „Wandel durch Annäherung“. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Ostpolitik setzte auf Entspannung und ___.', ['Verträge', 'Annäherung']),
    fact('grundlagen', 'Grundlagenvertrag?', 'Regelung des Verhältnisses BRD–DDR', ['Sofortige Einheit 1972', 'Kriegserklärung', 'Nur Kulturpakt'], 'Beide Staaten akzeptierten Existenz praktisch.', 'Beide Staaten akzeptierten Existenz praktisch. Beide Staaten akzeptierten Existenz praktisch. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Der Grundlagenvertrag regelte das Verhältnis der zwei ___.', ['Staaten']),
    fact('ksze', 'Welche Rolle spielte die KSZE?', 'Konferenz über Sicherheit und Zusammenarbeit in Europa', ['Nur Militärpakt', 'Nur Handelsboykott', 'Nur Sport'], 'Menschenrechtskorb wurde Bezugspunkt.', 'Menschenrechtskorb wurde Bezugspunkt. Menschenrechtskorb wurde Bezugspunkt. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die KSZE thematisiert auch ___.', ['Menschenrechte', 'Sicherheit']),
    fact('grenzen', 'Anerkennung von Grenzen?', 'Realpolitische Anerkennung ohne Aufgabe der Einheitshoffnung', ['Sofortiger Verzicht auf Nation', 'Keine Grenzfragen', 'Nur Expansion'], 'Spannungsfeld blieb.', 'Spannungsfeld blieb. Spannungsfeld blieb. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Grenzen wurden realpolitisch ___.', ['anerkannt']),
    fact('kritik', 'Kritik an Ostpolitik?', 'Vorwurf der Stabilisierung der DDR versus Chance auf Erleichterungen', ['Keine Debatte', 'Nur Begeisterung überall', 'Nur Ausland kritik'], 'Historisch differenziert zu bewerten.', 'Historisch differenziert zu bewerten. Historisch differenziert zu bewerten. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Kritik und Chance gehören zur ___.', ['Bewertung', 'Debatte']),
    fact('mensch', 'Menschliche Erleichterungen?', 'Reise- und Besuchsmöglichkeiten verbesserten sich teilweise', ['Grenzen blieben total dicht immer', 'Keine Kontakte', 'Nur Telefonverbot total'], 'Familien profitierten begrenzt.', 'Familien profitierten begrenzt. Familien profitierten begrenzt. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Ostpolitik brachte teilweise menschliche ___.', ['Erleichterungen']),
    fact('einheit', 'Pfad zur Einheit?', 'Entspannung allein erzwang keine Einheit – 1989 war Umbruch', ['Ostpolitik vereinigte sofort 1970', 'Einheit unmöglich je', 'Nur Militärlösung 1972'], 'Friedliche Revolution war entscheidend.', 'Friedliche Revolution war entscheidend. Friedliche Revolution war entscheidend. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die Einheit folgte dem Umbruch von ___.', ['1989']),
  ],
  pairs: [
    pair('p1', 'Ostpolitik', 'Entspannung unter Brandt', 'Verträge'),
    pair('p2', 'Grundlagenvertrag', 'BRD–DDR', 'Regelung der Beziehungen'),
    pair('p3', 'KSZE', 'Sicherheitskonferenz', 'Menschenrechte'),
  ],
  trueFalse: [
    tf('t1', 'Die Ostpolitik suchte Entspannung und regelte das Verhältnis zur DDR.', true, 'Einheit folgte erst dem Umbruch 1989.', 'Einheit folgte erst dem Umbruch 1989. Verträge erleichterten Kontakte. Kritik bleibt Teil der Bewertung.'),
  ],
}

const k10_lb3_osteuropa_1989: BioBank = {
  quelle: 'Wikipedia: Revolutionen im Jahr 1989',
  url: 'https://de.wikipedia.org/wiki/Revolutionen_im_Jahr_1989',
  conceptPrefix: 'ge:k10:osteuropa-1989',
  facts: [
    fact('gorbi', 'Gorbatschow-Reformen?', 'Glasnost und Perestroika schwächten alte Kontrolle', ['Verschärfung der Stalinzeit', 'Keine Reformen', 'Nur Aufrüstung ohne Politik'], 'Reformdruck wirkte auf Satellitenstaaten.', 'Reformdruck wirkte auf Satellitenstaaten. Reformdruck wirkte auf Satellitenstaaten. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Glasnost und Perestroika waren ___.', ['Reformen']),
    fact('polen', 'Polen/Solidarnosc?', 'Arbeiterbewegung und Verhandlungen öffneten Wandel', ['Keine Opposition', 'Nur Militärputsch dauerhaft siegreich ohne Wandel', 'Nur Kulturverein'], 'Runde Tische wurden Modell.', 'Runde Tische wurden Modell. Runde Tische wurden Modell. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Solidarnosc war eine wichtige ___.', ['Bewegung', 'Opposition']),
    fact('1989', '1989 in Osteuropa?', 'Systemwechsel in mehreren Staaten relativ rasch', ['Stärkung aller kommunistischen Regime', 'Keine Proteste', 'Nur Sportfeste'], 'Dominosteine fielen.', 'Dominosteine fielen. Dominosteine fielen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', '1989 kam es zu System___.', ['wechseln', 'umbrüchen']),
    fact('ddr', 'DDR 1989?', 'Massenflucht, Montagsdemonstrationen, Mauerfall', ['Stabilisierung der SED', 'Keine Proteste', 'Nur Wirtschaftswunder'], 'Friedliche Revolution.', 'Friedliche Revolution. Friedliche Revolution. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'In der DDR führten Proteste zum ___.', ['Mauerfall', 'Umbruch']),
    fact('gewaltarm', 'Oft gewaltarm?', 'Viele Umbrüche relativ friedlich – nicht überall', ['Immer Bürgerkriege', 'Keine Ausnahmen', 'Nur Militärputsche'], 'Rumänien war blutiger.', 'Rumänien war blutiger. Rumänien war blutiger. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Viele Umbrüche verliefen relativ ___.', ['friedlich', 'gewaltarm']),
    fact('souveraen', 'Souvärenitätsgewinn?', 'Staaten lösten sich aus sowjetischer Bevormundung', ['Mehr sowjetische Kontrolle', 'Keine Änderung', 'Nur Kulturautonomie'], 'Warschauer Pakt bröckelte.', 'Warschauer Pakt bröckelte. Warschauer Pakt bröckelte. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Staaten gewannen nationale ___.', ['Souveränität']),
    fact('udssr', 'Ende der UdSSR?', '1991 Auflösung nach Reformkrise und Nationalbewegungen', ['Ewige Expansion', 'Sofortige Stärkung 1995', 'Nur Namensänderung'], 'Kalter Krieg endete.', 'Kalter Krieg endete. Kalter Krieg endete. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', '1991 löste sich die ___ auf.', ['Sowjetunion', 'UdSSR']),
    fact('europa', 'Bedeutung für Europa?', 'Ende der Teilung und neue Integrationsdynamik', ['Rückkehr zum Kalten Krieg unverändert', 'Keine Folgen', 'Nur Sport'], 'EU und NATO erweiterten sich später.', 'EU und NATO erweiterten sich später. EU und NATO erweiterten sich später. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', '1989/91 beendete die europäische ___.', ['Teilung']),
  ],
  pairs: [
    pair('p1', 'Perestroika', 'Umbau in der UdSSR', 'Reformpolitik'),
    pair('p2', 'Mauerfall', '9. Nov. 1989', 'Symbol des Umbruchs'),
    pair('p3', 'Friedliche Revolution', 'DDR 1989', 'Massenprotest'),
  ],
  trueFalse: [
    tf('t1', '1989/91 brachten Umbrüche das Ende der osteuropäischen kommunistischen Ordnung.', true, 'Reformdruck und Proteste wirkten zusammen.', 'Reformdruck und Proteste wirkten zusammen. Die DDR erlebte eine friedliche Revolution. Die UdSSR endete 1991.'),
  ],
}

const k10_lb3_einigung: BioBank = {
  quelle: 'Wikipedia: Deutsche Wiedervereinigung',
  url: 'https://de.wikipedia.org/wiki/Deutsche_Wiedervereinigung',
  conceptPrefix: 'ge:k10:einigung',
  facts: [
    fact('weg', 'Weg zur Einheit?', 'Friedliche Revolution, Verhandlungen und Beitritt der DDR', ['Nur Militärannexión', 'Sofort 1949', 'Nur Kulturvereinigung ohne Staat'], 'Artikel 23 GG (a. F.) Beitritt.', 'Artikel 23 GG (a. F.) Beitritt. Artikel 23 GG (a. F.) Beitritt. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die Einheit folgte auf die friedliche ___.', ['Revolution']),
    fact('zwei-plus-vier', 'Zwei-plus-Vier-Vertrag?', 'Außenregelung der Einheit mit den Siegermächten', ['Nur Innenvertrag ohne Außen', 'Kriegsvertrag', 'Nur EU-Beitritt'], 'Vollsouveränität Deutschlands.', 'Vollsouveränität Deutschlands. Vollsouveränität Deutschlands. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Zwei-plus-Vier regelte die ___ Aspekte.', ['außenpolitischen', 'internationalen']),
    fact('waehrung', 'Währungsunion?', 'D-Mark in der DDR vor der politischen Einheit', ['Keine Wirtschaftsreform', 'Nur Rubelunion', 'Nur Tauschhandel'], 'Wirtschaftlicher Schock folgte teilweise.', 'Wirtschaftlicher Schock folgte teilweise. Wirtschaftlicher Schock folgte teilweise. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die Währungsunion brachte die ___ in die DDR.', ['D-Mark']),
    fact('kosten', 'Herausforderungen?', 'Wirtschaftlicher Umbau, Treuhand, soziale Brüche', ['Sofort gleiche Lebensverhältnisse', 'Keine Probleme', 'Nur Feiern ohne Alltag'], 'Ost-West-Unterschiede blieben spürbar.', 'Ost-West-Unterschiede blieben spürbar. Ost-West-Unterschiede blieben spürbar. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Einheit brachte wirtschaftliche ___.', ['Herausforderungen', 'Brüche']),
    fact('eu', 'Europäische Integration?', 'Einheit eingebettet in europäische Einigung', ['Austritt aus Europa', 'Nur nationale Isolation', 'Nur NATO ohne EU-Bezug'], 'Maastricht folgte bald.', 'Maastricht folgte bald. Maastricht folgte bald. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Deutsche Einheit und europäische ___ hingen zusammen.', ['Integration', 'Einigung']),
    fact('erinnerung', 'Erinnerung an 1989/90?', 'Freiheit, Bürgerengagement und offene Fragen der Transformation', ['Nur Wirtschaftszahlen', 'Nur Militärgeschichte', 'Nur Vergessen'], 'Multiperspektivität nötig.', 'Multiperspektivität nötig. Multiperspektivität nötig. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Erinnerung betont Freiheit und ___.', ['Bürgerengagement', 'Transformation']),
    fact('souveraen', 'Souveränität?', 'Vereintes Deutschland erlangte volle Souveränität', ['Besatzung blieb unverändert', 'Keine Souveränität', 'Nur Kulturautonomie'], 'Truppenregelungen wurden neu gefasst.', 'Truppenregelungen wurden neu gefasst. Truppenregelungen wurden neu gefasst. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', '1990 erlangte Deutschland volle ___.', ['Souveränität']),
    fact('gegenwart', 'Gegenwartsbezug?', 'Demokratie, Einheit und europäische Verantwortung bleiben Themen', ['Thema erledigt ohne Relevanz', 'Nur Steinzeitbezug', 'Nur Sport'], 'Ost-West-Unterschiede und Populismus fordern Bildung.', 'Ost-West-Unterschiede und Populismus fordern Bildung. Ost-West-Unterschiede und Populismus fordern Bildung. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Einheit bleibt Thema von Demokratie und ___.', ['Verantwortung', 'Zusammenhalt']),
  ],
  pairs: [
    pair('p1', 'Zwei-plus-Vier', 'Außenvertrag 1990', 'Souveränität'),
    pair('p2', 'Währungsunion', 'D-Mark in der DDR', 'Wirtschaftsschock'),
    pair('p3', 'Beitritt', 'DDR zur BRD', 'Artikel 23 a. F.'),
  ],
  trueFalse: [
    tf('t1', 'Die deutsche Einheit 1990 war innen- und außenpolitisch geregelt.', true, 'Zwei-plus-Vier und Beitritt sind Schlüssel.', 'Zwei-plus-Vier und Beitritt sind Schlüssel. Transformation blieb herausfordernd. Europa und Einheit hängen zusammen.'),
  ],
}

const gk_lb1_wirtschaft: BioBank = {
  quelle: 'Wikipedia: Soziale Frage',
  url: 'https://de.wikipedia.org/wiki/Soziale_Frage',
  conceptPrefix: 'ge:gk:wirtschaft',
  facts: [
    fact('industrie', 'Industrialisierung und Gesellschaft?', 'Wirtschaftlicher Wandel veränderte Klassen und Alltag', ['Keine gesellschaftlichen Folgen', 'Nur Technik ohne Menschen', 'Nur Agrar unverändert'], 'Kapitalismus und Lohnarbeit wuchsen.', 'Kapitalismus und Lohnarbeit wuchsen. Kapitalismus und Lohnarbeit wuchsen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Industrialisierung veränderte ___ und Alltag.', ['Klassen', 'Gesellschaft']),
    fact('soziale', 'Soziale Frage?', 'Armut und Arbeitsbedingungen als politisches Problem', ['Nur Privatsache', 'Keine Armut', 'Nur Adelsfrage'], 'Bewegungen forderten Reform.', 'Bewegungen forderten Reform. Bewegungen forderten Reform. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die soziale Frage thematisiert Armut und ___.', ['Arbeit', 'Bedingungen']),
    fact('loesungen', 'Lösungsansätze?', 'Sozialversicherung, Gewerkschaften, Parteien', ['Nur Ignorieren', 'Nur Revolution ohne Reform je', 'Nur Auswanderung aller'], 'Staat und Bewegung reagierten unterschiedlich.', 'Staat und Bewegung reagierten unterschiedlich. Staat und Bewegung reagierten unterschiedlich. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Lösungen lagen u. a. in sozialer ___.', ['Versicherung', 'Organisation']),
    fact('kapitalismus', 'Kapitalismus als Ordnung?', 'Private Produktionsmittel und Marktkonkurrenz', ['Reine Planwirtschaft', 'Nur Subsistenz', 'Nur Feudalismus'], 'Krisen und Wachstum gehörten dazu.', 'Krisen und Wachstum gehörten dazu. Krisen und Wachstum gehörten dazu. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Kapitalismus basiert auf Markt und ___.', ['Privateigentum', 'Konkurrenz']),
    fact('sachsen', 'Regional: Sachsen?', 'Früh industriell, Textil und Maschinenbau', ['Nie Industrie', 'Nur Agrar', 'Nur Tourismus historisch allein'], 'Vergleich schärft den Blick.', 'Vergleich schärft den Blick. Vergleich schärft den Blick. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Sachsen war früh ___.', ['industriell']),
    fact('politik', 'Politik und Wirtschaft?', 'Interessenkonflikte steuern Gesetze und Konflikte', ['Wirtschaft ohne Politik', 'Nur Technik determiniert alles', 'Nur Kultur'], 'Lehrplan verbindet beide.', 'Lehrplan verbindet beide. Lehrplan verbindet beide. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Wirtschaft und ___ greifen ineinander.', ['Politik']),
    fact('lange', 'Lange Linie bis 1920er?', 'Von früher Industrialisierung zu Massenproduktion', ['Abruptes Ende 1800', 'Keine Kontinuität', 'Nur Sprung 1990'], 'Fließband und Automatisierung folgten.', 'Fließband und Automatisierung folgten. Fließband und Automatisierung folgten. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die Linie führt zur Massen___.', ['produktion']),
    fact('urteil', 'Beurteilen von Lösungen?', 'Chancen und Grenzen von Reformen abwägen', ['Nur eine richtige Antwort immer', 'Kritik verboten', 'Nur Feiern'], 'Quellen und Interessen prüfen.', 'Quellen und Interessen prüfen. Quellen und Interessen prüfen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Lösungen sind auf Chancen und ___ zu prüfen.', ['Grenzen']),
  ],
  pairs: [
    pair('p1', 'Soziale Frage', 'Armut und Arbeit', 'Politisches Problem'),
    pair('p2', 'Sozialversicherung', 'Staatliche Absicherung', 'Reformantwort'),
    pair('p3', 'Kapitalismus', 'Markt und Privateigentum', 'Wirtschaftsordnung'),
  ],
  trueFalse: [
    tf('t1', 'Wirtschaftlicher Wandel und soziale Frage prägen die moderne Gesellschaft.', true, 'Industrialisierung veränderte Klassen und Politik.', 'Industrialisierung veränderte Klassen und Politik. Reformen und Konflikte folgten. Sachsen bietet Regionalbezug.'),
  ],
}

const gk_lb1_politik_partizipation: BioBank = {
  quelle: 'Wikipedia: Partizipation',
  url: 'https://de.wikipedia.org/wiki/Politische_Partizipation',
  conceptPrefix: 'ge:gk:politik-partizipation',
  facts: [
    fact('verfassung', 'Verfassung und Partizipation?', 'Regeln, wer mitbestimmt und wie Macht begrenzt wird', ['Keine Regeln nötig', 'Nur Willkür', 'Nur Militärbefehl'], 'Rechtsstaat schützt Rechte.', 'Rechtsstaat schützt Rechte. Rechtsstaat schützt Rechte. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Verfassungen regeln ___.', ['Mitbestimmung', 'Machtbegrenzung']),
    fact('wahlrecht', 'Wahlrecht als Schlüssel?', 'Teilhabe über Wahlen – historisch oft eingeschränkt', ['Immer allgemeines Wahlrecht ab 1800', 'Wahlen unnötig', 'Nur Losverfahren immer'], 'Frauenwahlrecht kam später.', 'Frauenwahlrecht kam später. Frauenwahlrecht kam später. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Wahlrecht ist zentrale Form der ___.', ['Partizipation', 'Teilhabe']),
    fact('1848', '1848 als Bezug?', 'Versuch parlamentarischer Mitbestimmung', ['Sofort erfolgreicher Nationalstaat', 'Keine Debatte', 'Nur Fürstenfeiern'], 'Scheitern und Erbe.', 'Scheitern und Erbe. Scheitern und Erbe. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', '1848 steht für parlamentarische ___.', ['Mitbestimmung', 'Debatte']),
    fact('kaiserreich', 'Grenzen im Kaiserreich?', 'Obrigkeitsstaat begrenzte demokratische Kontrolle', ['Volle Demokratie', 'Keine Parteien', 'Nur Räteherrschaft'], 'Reichstag ohne volle Regierungsmacht.', 'Reichstag ohne volle Regierungsmacht. Reichstag ohne volle Regierungsmacht. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Im Kaiserreich blieb demokratische Kontrolle ___.', ['begrenzt']),
    fact('ideen', 'Politische Ideen?', 'Liberal, national, konservativ – konkurrierende Ordnungen', ['Nur eine Idee je', 'Keine Ideengeschichte', 'Nur Technik'], 'Umsetzung war umkämpft.', 'Umsetzung war umkämpft. Umsetzung war umkämpft. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Ideen von Freiheit und Nation waren ___.', ['umkämpft']),
    fact('buerger', 'Bürgerliche Öffentlichkeit?', 'Debatte, Presse und Vereine als Partizipationsräume', ['Nur Geheimpolitik', 'Keine Presse', 'Nur Hof'], 'Meinungsbildung wurde öffentlich.', 'Meinungsbildung wurde öffentlich. Meinungsbildung wurde öffentlich. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Öffentlichkeit ermöglicht politische ___.', ['Debatte', 'Meinung']),
    fact('ausschluss', 'Wer war ausgeschlossen?', 'Frauen, Arme und Minderheiten lange ohne volle Rechte', ['Alle immer gleichberechtigt', 'Nur Männer ausgeschlossen', 'Nur Ausländer hatten Rechte'], 'Kämpfe um Inklusion folgten.', 'Kämpfe um Inklusion folgten. Kämpfe um Inklusion folgten. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Lange waren viele Gruppen von Rechten ___.', ['ausgeschlossen']),
    fact('gegenwart', 'Gegenwartsbezug?', 'Demokratische Teilhabe bleibt zu sichern und zu erweitern', ['Partizipation erledigt', 'Nur Geschichte ohne Relevanz', 'Nur Sport'], 'Wahlbeteiligung und Protest zählen.', 'Wahlbeteiligung und Protest zählen. Wahlbeteiligung und Protest zählen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Demokratie braucht aktive ___.', ['Teilhabe', 'Bürger']),
  ],
  pairs: [
    pair('p1', 'Wahlrecht', 'Teilhabe an Wahlen', 'Historisch umkämpft'),
    pair('p2', 'Rechtsstaat', 'Machtbegrenzung durch Recht', 'Schutz von Rechten'),
    pair('p3', 'Öffentlichkeit', 'Debatte und Presse', 'Partizipationsraum'),
  ],
  trueFalse: [
    tf('t1', 'Politische Partizipation und Verfassung prägen moderne Gesellschaften.', true, 'Wahlrecht und Öffentlichkeit sind Schlüssel.', 'Wahlrecht und Öffentlichkeit sind Schlüssel. Ausschlüsse waren lange Realität. Demokratie braucht aktive Teilhabe.'),
  ],
}

const gk_lb2_weimar_versagen: BioBank = {
  quelle: 'Wikipedia: Weimarer Republik',
  url: 'https://de.wikipedia.org/wiki/Weimarer_Republik',
  conceptPrefix: 'ge:gk:weimar-versagen',
  facts: [
    fact('chancen', 'Chancen Weimars?', 'Demokratische Verfassung und kulturelle Blüte', ['Keine Chancen je', 'Nur Diktatur ab Tag 1', 'Nur Monarchie'], 'Stabilisierung Mitte der 1920er.', 'Stabilisierung Mitte der 1920er. Stabilisierung Mitte der 1920er. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Weimar hatte demokratische ___.', ['Chancen', 'Potenziale']),
    fact('krisen', 'Welche Krisen belasteten die Republik?', 'Gewalt, Inflation, Polarisierung', ['Nur Harmonie', 'Keine Putschversuche', 'Nur Boom'], 'Belastung durch Kriegsfolgen.', 'Belastung durch Kriegsfolgen. Belastung durch Kriegsfolgen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Krisen belasteten die ___.', ['Republik', 'Demokratie']),
    fact('enden', 'Endphase?', 'Präsidialkabinette und Machtübertragung 1933', ['Stärkung des Parlaments', 'Sofortige Stabilisierung', 'Nur Kulturreform'], 'Eliten unterschätzten Hitler.', 'Eliten unterschätzten Hitler. Eliten unterschätzten Hitler. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die Endphase führte zur Macht___.', ['übertragung']),
    fact('warum', 'Warum Scheitern?', 'Mehrere Faktoren: Krise, Feinde, Institutionen, Eliten', ['Nur ein Zufall', 'Nur Außenpolitik', 'Nur Wetter'], 'Kein monokausales Modell.', 'Kein monokausales Modell. Kein monokausales Modell. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Das Scheitern hatte mehrere ___.', ['Ursachen', 'Faktoren']),
    fact('kultur', 'Kultur trotz Krise?', 'Moderne Kunst und Alltagskultur blühten zeitweise', ['Keine Kultur', 'Nur Zensur total immer', 'Nur Mittelalter'], 'Ambivalenz der Epoche.', 'Ambivalenz der Epoche. Ambivalenz der Epoche. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Trotz Krise gab es kulturelle ___.', ['Blüte', 'Moderne']),
    fact('lehren', 'Lehren für Demokratie?', 'Institutionen, Kompromiss und Wehrhaftigkeit nötig', ['Demokratie stirbt immer', 'Passivität genügt', 'Nur starke Männer'], 'Gegenwartsbezug bewusst setzen.', 'Gegenwartsbezug bewusst setzen. Gegenwartsbezug bewusst setzen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Demokratie braucht Wehrhaftigkeit und ___.', ['Kompromiss', 'Institutionen']),
    fact('propaganda', 'Rolle von Propaganda gegen Weimar?', 'Dolchstoßlegende und Feindbilder untergruben Akzeptanz', ['Nur sachliche Kritik', 'Keine Mythen', 'Nur Unterstützung'], 'Medien wurden instrumentalisiert.', 'Medien wurden instrumentalisiert. Medien wurden instrumentalisiert. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Propaganda untergrub die ___ der Republik.', ['Akzeptanz']),
    fact('komplex', 'Anspruch und Wirklichkeit?', 'Verfassung versprach Demokratie – Praxis war gefährdet', ['Anspruch und Praxis identisch immer', 'Keine Spannung', 'Nur Theorie ohne Staat'], 'Lehrplan fordert Abwägung.', 'Lehrplan fordert Abwägung. Lehrplan fordert Abwägung. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Zwischen Anspruch und ___ klaffte vieles.', ['Wirklichkeit', 'Praxis']),
  ],
  pairs: [
    pair('p1', 'Präsidialkabinett', 'Endphase Weimars', 'Schwächung des Parlaments'),
    pair('p2', 'Dolchstoßlegende', 'Mythos gegen Republik', 'Propaganda'),
    pair('p3', 'Machtübertragung', '1933', 'Weg in die Diktatur'),
  ],
  trueFalse: [
    tf('t1', 'Weimar scheiterte an einem Ursachenbündel, nicht an einem Zufall.', true, 'Krise, Feinde und Elitenversagen zählten.', 'Krise, Feinde und Elitenversagen zählten. Demokratie braucht Wehrhaftigkeit. Anspruch und Wirklichkeit klafften.'),
  ],
}

const gk_lb2_ns_herrschaft: BioBank = {
  quelle: 'Wikipedia: Nationalsozialismus',
  url: 'https://de.wikipedia.org/wiki/Nationalsozialismus',
  conceptPrefix: 'ge:gk:ns-herrschaft',
  facts: [
    fact('ideologie', 'NS-Ideologie?', 'Rassismus, Führerprinzip, Gewalt und Volksgemeinschaftsmythos', ['Liberale Gleichheit', 'Pazifismus', 'Nur Wirtschaftsreform ohne Rassismus'], 'Judenfeindschaft war zentral.', 'Judenfeindschaft war zentral. Judenfeindschaft war zentral. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'NS-Ideologie basierte auf ___ und Gewalt.', ['Rassismus']),
    fact('praxis', 'Herrschaftspraxis?', 'Terror, Propaganda, Gleichschaltung', ['Rechtsstaatliche Kontrolle', 'Mehrparteiensystem', 'Freie Presse'], 'Alltag wurde durchherrscht.', 'Alltag wurde durchherrscht. Alltag wurde durchherrscht. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Praxis verband Terror und ___.', ['Propaganda']),
    fact('krieg', 'Krieg und Vernichtung?', 'Eroberungs- und Vernichtungskrieg im Osten', ['Nur Verteidigung', 'Nur Kolonialhandel', 'Nur Diplomatie'], 'Holocaust und Kriegsverbrechen.', 'Holocaust und Kriegsverbrechen. Holocaust und Kriegsverbrechen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Der Krieg war mit ___ verknüpft.', ['Vernichtung', 'Verbrechen']),
    fact('zustand', 'Zustimmung und Zwang?', 'Begeisterung, Opportunismus und Angst mischten sich', ['Nur Zwang ohne Zustimmung', 'Nur Begeisterung ohne Terror', 'Keine Gesellschaft'], 'Differenzierung nötig.', 'Differenzierung nötig. Differenzierung nötig. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Herrschaft ruhte auf Zwang und ___.', ['Zustimmung', 'Opportunismus']),
    fact('institutionen', 'Institutionen?', 'Doppelstrukturen, Partei und Staat verwoben', ['Klare Gewaltenteilung', 'Unabhängige Justiz stark', 'Nur Kommunen ohne Reich'], 'Kompetenzchaos und Rivalität.', 'Kompetenzchaos und Rivalität. Kompetenzchaos und Rivalität. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Partei und Staat waren ___.', ['verwoben']),
    fact('widerstand', 'Widerstand?', 'Vorhanden, aber riskant und begrenzt', ['Flächendeckend erfolgreich', 'Nicht existent', 'Nur Ausland'], 'Erinnerung differenziert.', 'Erinnerung differenziert. Erinnerung differenziert. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Widerstand blieb ___.', ['begrenzt', 'riskant']),
    fact('erbe', 'Historisches Erbe?', 'Verantwortung für Verbrechen und Demokratiebildung', ['Vergessen als Ziel', 'Relativierung ohne Fakten', 'Nur Feiern'], 'Bildung gegen Antisemitismus.', 'Bildung gegen Antisemitismus. Bildung gegen Antisemitismus. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Erbe fordert ___ und Bildung.', ['Verantwortung', 'Erinnerung']),
    fact('analyse', 'Anspruch vs. Wirklichkeit?', 'Propaganda der Volksgemeinschaft versus Terror und Ausgrenzung', ['Anspruch erfüllt für alle', 'Keine Diskrepanz', 'Nur Theorie'], 'Lehrplanziel: kritisches Urteil.', 'Lehrplanziel: kritisches Urteil. Lehrplanziel: kritisches Urteil. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Zwischen Propaganda und ___ klaffte Gewalt.', ['Wirklichkeit', 'Praxis']),
  ],
  pairs: [
    pair('p1', 'Führerprinzip', 'Hierarchische Befehlsgewalt', 'Anti-demokratisch'),
    pair('p2', 'Volksgemeinschaft', 'Propagandamythos', 'Ausgrenzung real'),
    pair('p3', 'Vernichtungskrieg', 'Krieg im Osten', 'Verbrechen'),
  ],
  trueFalse: [
    tf('t1', 'NS-Herrschaft verband Ideologie, Terror und Vernichtung.', true, 'Anspruch der Propaganda und Wirklichkeit klafften.', 'Anspruch der Propaganda und Wirklichkeit klafften. Rassismus war zentral. Verantwortung bleibt Bildungsauftrag.'),
  ],
}

const gk_lb3_brd_demokratie: BioBank = {
  quelle: 'Wikipedia: Bundesrepublik Deutschland',
  url: 'https://de.wikipedia.org/wiki/Bundesrepublik_Deutschland',
  conceptPrefix: 'ge:gk:brd-demokratie',
  facts: [
    fact('gg', 'Grundgesetz?', 'Demokratische Verfassung mit Grundrechten und Gewaltenteilung', ['Ermächtigungsgesetz', 'Reine Planverfassung', 'Nur Königsurkunde'], 'Lehren aus Weimar und NS.', 'Lehren aus Weimar und NS. Lehren aus Weimar und NS. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Das Grundgesetz sichert ___.', ['Grundrechte', 'Demokratie']),
    fact('wehrhaft', 'Wehrhafte Demokratie?', 'Schutz der Ordnung vor Feinden der Verfassung', ['Beliebige Abschaffung der Demokratie legal leicht', 'Keine Schutzmechanismen', 'Nur Militärdiktatur'], 'Parteiverbote möglich.', 'Parteiverbote möglich. Parteiverbote möglich. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Wehrhafte Demokratie schützt die ___.', ['Verfassung', 'Ordnung']),
    fact('parteien', 'Parteienstaat?', 'Parteien vermitteln Willensbildung', ['Keine Parteien erlaubt', 'Nur eine Staatspartei', 'Nur Vereine ohne Wahlen'], 'Wettbewerb und Kontrolle.', 'Wettbewerb und Kontrolle. Wettbewerb und Kontrolle. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Parteien tragen zur politischen ___ bei.', ['Willensbildung']),
    fact('rechtsstaat', 'Rechtsstaat?', 'Bindung der Macht an Recht und unabhängige Gerichte', ['Willkür der Exekutive', 'Keine Gerichte', 'Nur Parteibefehle'], 'Grundrechte einklagbar.', 'Grundrechte einklagbar. Grundrechte einklagbar. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Rechtsstaat bindet Macht an ___.', ['Recht']),
    fact('integration', 'Westbindung?', 'Integration in westliche Bündnisse und Werte', ['Ostintegration unter SED', 'Neutrale Isolation total', 'Nur nationale Autarkie'], 'NATO und EG/EU.', 'NATO und EG/EU. NATO und EG/EU. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die BRD band sich an den ___.', ['Westen']),
    fact('wandel', 'Demokratischer Wandel?', 'Ausbau von Rechten und gesellschaftlicher Liberalisierung', ['Starre Ordnung ohne Wandel', 'Rückkehr Weimar 1923', 'Nur Restauration 1933'], '1968 und Reformen sind Stichworte.', '1968 und Reformen sind Stichworte. 1968 und Reformen sind Stichworte. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Demokratie entwickelte sich durch ___.', ['Wandel', 'Reform']),
    fact('grenzen', 'Grenzen und Konflikte?', 'Skandale, Terror und soziale Konflikte prüften das System', ['Konfliktfreie Idylle', 'Keine Herausforderungen', 'Nur Außenpolitik'], 'Stabilität war nicht selbstverständlich.', 'Stabilität war nicht selbstverständlich. Stabilität war nicht selbstverständlich. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Demokratie wurde durch Konflikte ___.', ['geprüft', 'herausgefordert']),
    fact('vergleich', 'Vergleich zur DDR?', 'Offene Gesellschaft versus Diktatur und Überwachung', ['Identische Freiheit', 'DDR demokratischer', 'Keine Unterschiede'], 'Lehrplan fordert Systemvergleich.', 'Lehrplan fordert Systemvergleich. Lehrplan fordert Systemvergleich. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Im Vergleich zur DDR war die BRD ___.', ['demokratisch', 'offen']),
  ],
  pairs: [
    pair('p1', 'Grundgesetz', 'Verfassung der BRD', 'Grundrechte'),
    pair('p2', 'Wehrhafte Demokratie', 'Schutz vor Verfassungsfeinden', 'Lehren aus NS'),
    pair('p3', 'Rechtsstaat', 'Machtbindung an Recht', 'Unabhängige Gerichte'),
  ],
  trueFalse: [
    tf('t1', 'Die BRD baute eine wehrhafte parlamentarische Demokratie auf.', true, 'Grundgesetz und Rechtsstaat sind Fundament.', 'Grundgesetz und Rechtsstaat sind Fundament. Westbindung prägte. Der Vergleich zur DDR schärft den Blick.'),
  ],
}

const gk_lb3_ddr_diktatur: BioBank = {
  quelle: 'Wikipedia: Ministerium für Staatssicherheit',
  url: 'https://de.wikipedia.org/wiki/Ministerium_f%C3%BCr_Staatssicherheit',
  conceptPrefix: 'ge:gk:ddr-diktatur',
  facts: [
    fact('sed', 'SED-Herrschaft?', 'Führungsanspruch einer Partei ohne demokratische Kontrolle', ['Mehrparteienwettbewerb', 'Freie Wahlen westlich', 'Nur Kulturverein'], 'Blockparteien ohne echte Opposition.', 'Blockparteien ohne echte Opposition. Blockparteien ohne echte Opposition. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die SED beanspruchte die ___.', ['Führung', 'Macht']),
    fact('stasi', 'Was war die Stasi?', 'Überwachungsapparat zur Sicherung der Diktatur', ['Unabhängige Justiz', 'Bürgerrechtsamt', 'Nur Sportbehörde'], 'IM-System durchdrang Alltag.', 'IM-System durchdrang Alltag. IM-System durchdrang Alltag. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die Stasi diente der ___.', ['Überwachung', 'Sicherung']),
    fact('grenze', 'Grenze und Schießbefehl?', 'Abriegelung gegen Flucht mit tödlicher Gewalt', ['Offene Grenze immer', 'Nur Zoll ohne Gewalt', 'Nur Touristengrenze'], 'Maueropfer erinnern.', 'Maueropfer erinnern. Maueropfer erinnern. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die Grenze wurde mit ___ gesichert.', ['Gewalt', 'Schießbefehl']),
    fact('wirtschaft', 'Planwirtschaft?', 'Zentrale Planung mit Versorgungsengpässen', ['Freie Marktwirtschaft', 'Nur Genossenschaften ohne Plan', 'Nur Exportweltmeister dauerhaft'], 'Mangelwirtschaft prägte Alltag.', 'Mangelwirtschaft prägte Alltag. Mangelwirtschaft prägte Alltag. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Planwirtschaft führte oft zu ___.', ['Mangel', 'Engpässen']),
    fact('widerstand', 'Opposition?', 'Bürgerrechtler, Kirchenräume, Ausreiseanträge', ['Keine Opposition je', 'Nur Staatsfeiern', 'Nur Sportkritik'], '1989 eskalierte Protest.', '1989 eskalierte Protest. 1989 eskalierte Protest. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Opposition nutzte oft kirchliche ___.', ['Räume', 'Schutzräume']),
    fact('ideologie', 'Anspruch vs. Wirklichkeit?', 'Sozialismusversprechen versus Unfreiheit und Mangel', ['Anspruch erfüllt', 'Keine Diskrepanz', 'Nur Theoriebücher'], 'Legitimationskrise wuchs.', 'Legitimationskrise wuchs. Legitimationskrise wuchs. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Zwischen Anspruch und ___ klaffte vieles.', ['Wirklichkeit', 'Alltag']),
    fact('1989', 'Zusammenbruch?', 'Massenprotest und Reformunfähigkeit der Führung', ['Stabilisierung der SED', 'Militärischer Endsieg', 'Nur Wirtschaftswunder'], 'Friedliche Revolution.', 'Friedliche Revolution. Friedliche Revolution. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', '1989 brach die SED-___ zusammen.', ['Herrschaft', 'Diktatur']),
    fact('aufarbeitung', 'Aufarbeitung?', 'Akten, Gedenken und demokratische Bildung', ['Vergessen als Pflicht', 'Leugnung', 'Nur Nostalgie ohne Kritik'], 'Opferperspektive zentral.', 'Opferperspektive zentral. Opferperspektive zentral. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Aufarbeitung braucht Akten und ___.', ['Gedenken', 'Bildung']),
  ],
  pairs: [
    pair('p1', 'SED', 'Staatspartei', 'Führungsanspruch'),
    pair('p2', 'Stasi', 'Geheimpolizei der DDR', 'Überwachung'),
    pair('p3', 'Schießbefehl', 'Gewalt an der Grenze', 'Unfreiheit'),
  ],
  trueFalse: [
    tf('t1', 'Die DDR war eine SED-Diktatur mit Überwachung und Unfreiheit.', true, 'Anspruch und Alltag klafften auseinander.', 'Anspruch und Alltag klafften auseinander. Stasi und Grenze sicherten Macht. 1989 endete das System.'),
  ],
}

const gk_lb4_kollektive_sicherheit: BioBank = {
  quelle: 'Wikipedia: Kollektive Sicherheit',
  url: 'https://de.wikipedia.org/wiki/Kollektive_Sicherheit',
  conceptPrefix: 'ge:gk:kollektive-sicherheit',
  facts: [
    fact('begriff', 'Kollektive Sicherheit?', 'Gemeinsame Abwehr von Aggression durch Staatengemeinschaft', ['Nur nationale Alleingänge', 'Nur Privatmilizen', 'Nur Wirtschaft ohne Politik'], 'Idee hinter Völkerbund und UNO.', 'Idee hinter Völkerbund und UNO. Idee hinter Völkerbund und UNO. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Kollektive Sicherheit meint gemeinsame Abwehr von ___.', ['Aggression']),
    fact('voelkerbund', 'Völkerbund Grenzen?', 'Wichtige Idee, schwache Durchsetzung', ['Sofortiger Weltfriede dauerhaft', 'Keine Institution', 'Nur Militärpakt erfolgreich immer'], 'Mächtige fehlten oder blockierten.', 'Mächtige fehlten oder blockierten. Mächtige fehlten oder blockierten. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Der Völkerbund blieb in der Durchsetzung ___.', ['schwach']),
    fact('uno', 'Welche Rolle hat die UNO?', 'Nach 1945 zentrale Organisation kollektiver Sicherheit', ['Nur Kulturverein', 'Nur Handelsblock', 'Nur Sport'], 'Sicherheitsrat mit Vetomacht.', 'Sicherheitsrat mit Vetomacht. Sicherheitsrat mit Vetomacht. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die UNO ist zentrale Organisation kollektiver ___.', ['Sicherheit']),
    fact('veto', 'Veto-Problem?', 'Großmächte können Maßnahmen blockieren', ['Alle Staaten gleich handlungsfähig immer', 'Kein Sicherheitsrat', 'Nur Mehrheit ohne Macht'], 'Reformdebatten dauern an.', 'Reformdebatten dauern an. Reformdebatten dauern an. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Vetos können Maßnahmen ___.', ['blockieren']),
    fact('frieden', 'Friedenssicherung Mittel?', 'Diplomatie, Sanktionen, Blauhelme – begrenzt wirksam', ['Nur Krieg', 'Nur Ignorieren', 'Nur Wirtschaft ohne Regeln'], 'Erfolge und Scheitern analysieren.', 'Erfolge und Scheitern analysieren. Erfolge und Scheitern analysieren. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Mittel der Friedenssicherung sind oft ___.', ['begrenzt']),
    fact('recht', 'Völkerrecht?', 'Regeln zwischen Staaten, oft durchsetzungs schwach', ['Nationale Gesetze allein genügen global', 'Keine Regeln', 'Nur Moral ohne Text'], 'Kriegsverbot und Menschenrechte.', 'Kriegsverbot und Menschenrechte. Kriegsverbot und Menschenrechte. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Völkerrecht setzt Regeln zwischen ___.', ['Staaten']),
    fact('geschichte', 'Historische Linie?', 'Vom Völkerbund zur UNO – Lernen aus Weltkriegen', ['Keine Lernprozesse', 'Nur Rückkehr 1914', 'Nur Zufall'], 'Institutionen sind Antworten auf Katastrophen.', 'Institutionen sind Antworten auf Katastrophen. Institutionen sind Antworten auf Katastrophen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Institutionen antworten auf Welt___.', ['kriege', 'katastrophen']),
    fact('urteil', 'Kritisches Urteil?', 'Anspruch hoch – Wirklichkeit abhängig von Machtinteressen', ['Immer perfekt wirksam', 'Immer nutzlos', 'Keine Ambivalenz'], 'Lehrplan: Chancen und Grenzen.', 'Lehrplan: Chancen und Grenzen. Lehrplan: Chancen und Grenzen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Kollektive Sicherheit hat Chancen und ___.', ['Grenzen']),
  ],
  pairs: [
    pair('p1', 'Völkerbund', 'Nach WK1', 'Schwache Durchsetzung'),
    pair('p2', 'UNO', 'Nach 1945', 'Sicherheitsrat'),
    pair('p3', 'Veto', 'Blockade durch Großmächte', 'Strukturproblem'),
  ],
  trueFalse: [
    tf('t1', 'Kollektive Sicherheit sucht gemeinsame Abwehr von Aggression.', true, 'UNO folgt auf den schwachen Völkerbund.', 'UNO folgt auf den schwachen Völkerbund. Vetos begrenzen Handlung. Anspruch und Machtinteressen spannungsreich.'),
  ],
}

const gk_lb4_kaltkrieg_frieden: BioBank = {
  quelle: 'Wikipedia: Abschreckung',
  url: 'https://de.wikipedia.org/wiki/Abschreckung_(Politik)',
  conceptPrefix: 'ge:gk:kaltkrieg-frieden',
  facts: [
    fact('abschreckung', 'Nukleare Abschreckung?', 'Kriegsverhinderung durch drohende Zerstörung', ['Sofortiger Abrüstungsfriede ohne Risiko', 'Keine Atomwaffen je', 'Nur konventionell ohne Logik'], 'Gleichgewicht des Schreckens.', 'Gleichgewicht des Schreckens. Gleichgewicht des Schreckens. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Abschreckung droht mit gegenseitiger ___.', ['Zerstörung']),
    fact('risiko', 'Risiko der Logik?', 'Fehlkalkulation und Eskalation möglich', ['Absolut sicherer Frieden', 'Kein Risiko', 'Nur Theorie ohne Praxis'], 'Kubakrise zeigt Gefahr.', 'Kubakrise zeigt Gefahr. Kubakrise zeigt Gefahr. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Abschreckung bleibt ___.', ['riskant', 'gefährlich']),
    fact('entspannung', 'Entspannung und Abrüstung?', 'Verträge minderten Risiken zeitweise', ['Keine Verträge je', 'Nur Aufrüstung ohne Pause', 'Nur Propaganda'], 'SALT/INF sind Beispiele.', 'SALT/INF sind Beispiele. SALT/INF sind Beispiele. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Abrüstungsverträge minderten ___.', ['Risiken', 'Spannungen']),
    fact('proxy', 'Stellvertreterkriege?', 'Lokale Kriege im globalen Konflikt', ['Nur Frieden überall', 'Keine lokalen Kriege', 'Nur Diplomatie'], 'Zivilbevölkerung litt.', 'Zivilbevölkerung litt. Zivilbevölkerung litt. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Stellvertreterkriege waren Teil des Kalten ___.', ['Kriegs']),
    fact('ksze', 'KSZE-Beitrag?', 'Dialog und Menschenrechtsnormen', ['Nur Militärpakt', 'Nur Boykott', 'Nur Sport'], 'Helsinki-Effekte.', 'Helsinki-Effekte. Helsinki-Effekte. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'KSZE stärkte Dialog und ___.', ['Menschenrechte', 'Normen']),
    fact('ende', 'Friedensgewinn 1989/91?', 'Ende der Blockkonfrontation ohne großen Ost-West-Krieg', ['Nuklearer Weltkrieg', 'Keine Änderung', 'Nur Wirtschaftskrise ohne Politik'], 'Neue Konflikte folgten anderswo.', 'Neue Konflikte folgten anderswo. Neue Konflikte folgten anderswo. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Das Ende des Kalten Kriegs war ein ___.', ['Friedensgewinn', 'Umbruch']),
    fact('lehren', 'Welche Lehren lassen sich ziehen?', 'Kommunikation, Rüstungskontrolle und Institutionen zählen', ['Nur maximale Aufrüstung immer', 'Nur Isolation', 'Diplomatie unnötig'], 'Gegenwartsbezug zu aktuellen Konflikten.', 'Gegenwartsbezug zu aktuellen Konflikten. Gegenwartsbezug zu aktuellen Konflikten. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Frieden braucht Kommunikation und ___.', ['Rüstungskontrolle', 'Institutionen']),
    fact('ambivalenz', 'Ambivalenz?', 'Abschreckung verhinderte Weltkrieg und erzeugte Angst', ['Nur positive Seite', 'Nur negative Seite', 'Keine Ambivalenz'], 'Lehrplan fordert Abwägung.', 'Lehrplan fordert Abwägung. Lehrplan fordert Abwägung. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Abschreckung verhinderte Krieg und erzeugte ___.', ['Angst', 'Risiko']),
  ],
  pairs: [
    pair('p1', 'Abschreckung', 'Kriegsverhinderung durch Drohung', 'Nuklear'),
    pair('p2', 'Kubakrise', 'Eskalationsgefahr', '1962'),
    pair('p3', 'Rüstungskontrolle', 'Verträge zur Begrenzung', 'Entspannung'),
  ],
  trueFalse: [
    tf('t1', 'Im Kalten Krieg sicherte Abschreckung einen fragilen Frieden.', true, 'Risiken und Entspannung gehörten zusammen.', 'Risiken und Entspannung gehörten zusammen. Stellvertreterkriege tobten. 1989/91 endete die Blockkonfrontation.'),
  ],
}

const lk11_lb1_ordnungen: BioBank = {
  quelle: 'Wikipedia: Staatsform',
  url: 'https://de.wikipedia.org/wiki/Staatsform',
  conceptPrefix: 'ge:lk11:ordnungen',
  facts: [
    fact('vergleich', 'Ordnungsmodelle vergleichen?', 'Monarchie, Republik, Diktatur nach Macht und Teilhabe', ['Alle Systeme identisch', 'Nur eine Form existierte je', 'Nur Technikformen'], 'Kriterien: Legitimation, Kontrolle, Rechte.', 'Kriterien: Legitimation, Kontrolle, Rechte. Kriterien: Legitimation, Kontrolle, Rechte. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Vergleich nutzt Kriterien wie Macht und ___.', ['Teilhabe', 'Kontrolle']),
    fact('monarchie', 'Monarchie?', 'Herrschaft eines Monarchen – absolut oder konstitutionell', ['Immer Demokratie', 'Keine Varianten', 'Nur Wahlmonarchie modern immer'], 'Übergänge waren historisch fließend.', 'Übergänge waren historisch fließend. Übergänge waren historisch fließend. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Monarchien können absolut oder ___ sein.', ['konstitutionell']),
    fact('republik', 'Republik?', 'Kein erbliches Staatsoberhaupt – Formen variieren', ['Immer Diktatur', 'Immer direkte Demokratie', 'Nur Stadtstaaten antik'], 'Weimar und BRD sind Beispiele.', 'Weimar und BRD sind Beispiele. Weimar und BRD sind Beispiele. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Republiken verzichten auf erbliches ___.', ['Staatsoberhaupt', 'Königtum']),
    fact('diktatur', 'Diktatur?', 'Konzentrierte Macht ohne demokratische Kontrolle', ['Volle Gewaltenteilung', 'Freie Wahlen zentral', 'Rechtsstaat stark'], 'Terror und Propaganda häufig.', 'Terror und Propaganda häufig. Terror und Propaganda häufig. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Diktaturen konzentrieren ___ ohne Kontrolle.', ['Macht']),
    fact('legitimation', 'Legitimation?', 'Begründung von Herrschaft – Gottesgnadentum bis Volkssouveränität', ['Keine Begründung nötig', 'Nur Gewalt ohne Worte', 'Nur Tradition ohne Wandel'], 'Ideen wandeln sich.', 'Ideen wandeln sich. Ideen wandeln sich. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Legitimation begründet ___.', ['Herrschaft']),
    fact('wandel', 'Historischer Wandel?', 'Von ständischen zu modernen Partizipationsordnungen', ['Keine Entwicklung', 'Nur Rückkehr Steinzeit', 'Nur Sprung ohne Prozess'], 'Revolutionen und Reformen.', 'Revolutionen und Reformen. Revolutionen und Reformen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Ordnungen wandeln sich durch Reform und ___.', ['Revolution']),
    fact('messung', 'Wie vergleichen?', 'An Institutionen, Rechten und politischer Praxis', ['Nur an Flaggenfarben', 'Nur an Rhetorik', 'Nur an Größe'], 'Anspruch und Wirklichkeit prüfen.', 'Anspruch und Wirklichkeit prüfen. Anspruch und Wirklichkeit prüfen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Vergleich prüft Institutionen und ___.', ['Praxis', 'Rechte']),
    fact('urteil', 'Normatives Urteil?', 'Demokratie und Menschenrechte als Bewertungsmaßstäbe offen legen', ['Wertfreie Beschreibung nur möglich absolut', 'Keine Maßstäbe', 'Nur Macht zählt ohne Ethik'], 'Transparenz der Kriterien.', 'Transparenz der Kriterien. Transparenz der Kriterien. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Urteile brauchen offengelegte ___.', ['Maßstäbe', 'Kriterien']),
  ],
  pairs: [
    pair('p1', 'Monarchie', 'Herrschaft eines Monarchen', 'Variantenreich'),
    pair('p2', 'Diktatur', 'Machtkonzentration', 'Ohne Kontrolle'),
    pair('p3', 'Legitimation', 'Begründung von Herrschaft', 'Historisch wandelbar'),
  ],
  trueFalse: [
    tf('t1', 'Politische Ordnungen lassen sich nach Macht und Teilhabe vergleichen.', true, 'Anspruch und Praxis sind zu trennen.', 'Anspruch und Praxis sind zu trennen. Legitimation wandelt sich. Demokratie und Rechte sind Maßstäbe.'),
  ],
}

const lk11_lb1_partizipation: BioBank = {
  quelle: 'Wikipedia: Politische Partizipation',
  url: 'https://de.wikipedia.org/wiki/Politische_Partizipation',
  conceptPrefix: 'ge:lk11:partizipation-wege',
  facts: [
    fact('wege', 'Wege der Teilhabe?', 'Wahlen, Protest, Vereine, Öffentlichkeit', ['Nur Gehorsam', 'Nur Schweigen', 'Nur Hofdienst'], 'Formen erweiterten sich historisch.', 'Formen erweiterten sich historisch. Formen erweiterten sich historisch. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Teilhabe umfasst Wahlen und ___.', ['Protest', 'Öffentlichkeit']),
    fact('grenzen', 'Grenzen der Teilhabe?', 'Rechtliche Ausschlüsse und praktische Hürden', ['Immer volle Gleichheit', 'Keine Hürden je', 'Nur technische Limits'], 'Klasse, Geschlecht, Herkunft.', 'Klasse, Geschlecht, Herkunft. Klasse, Geschlecht, Herkunft. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Teilhabe war historisch oft ___.', ['begrenzt', 'ausschließlich']),
    fact('protest', 'Protest als Partizipation?', 'Öffentlicher Widerspruch kann Politik verändern', ['Immer illegal und wirkungslos', 'Nur Privatsache', 'Nur Gewalt ohne Ziel'], '1848 und 1989 als Beispiele.', '1848 und 1989 als Beispiele. 1848 und 1989 als Beispiele. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Protest kann politische ___ verändern.', ['Entscheidungen', 'Politik']),
    fact('zivil', 'Zivilgesellschaft?', 'Engagement jenseits von Staat und Markt', ['Nur Staatsapparat', 'Nur Unternehmen', 'Nur Militär'], 'Vereine und Initiativen.', 'Vereine und Initiativen. Vereine und Initiativen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Zivilgesellschaft engagiert sich jenseits von ___.', ['Staat', 'Markt']),
    fact('medien', 'Medienrolle?', 'Öffentlichkeit herstellen und kontrollieren – auch manipulieren', ['Nur neutrale Spiegel immer', 'Keine Macht', 'Nur Unterhaltung ohne Politik'], 'Pressefreiheit umkämpft.', 'Pressefreiheit umkämpft. Pressefreiheit umkämpft. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Medien können Öffentlichkeit ___ und manipulieren.', ['herstellen']),
    fact('inklusion', 'Inklusionskämpfe?', 'Frauen, Arbeiter, Minderheiten forderten Rechte', ['Rechte fielen vom Himmel', 'Keine Bewegungen', 'Nur Elitenreform ohne Druck'], 'Lange Zeiträume.', 'Lange Zeiträume. Lange Zeiträume. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Rechte wurden oft ___ erkämpft.', ['erkämpft', 'erstritten']),
    fact('demokratie', 'Demokratiequalität?', 'Nicht nur Wahlen – auch Rechte, Kontrolle, Pluralität', ['Nur Wahlakt genügt immer', 'Keine qualitativen Kriterien', 'Nur Mehrheitswille absolut'], 'Wehrhaftigkeit zählt.', 'Wehrhaftigkeit zählt. Wehrhaftigkeit zählt. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Demokratie braucht Rechte und ___.', ['Kontrolle', 'Pluralität']),
    fact('gegenwart', 'Aktuelle Herausforderung?', 'Teilnahme sichern gegen Gleichgültigkeit und Feindschaft zur Demokratie', ['Partizipation überflüssig', 'Nur Geschichte', 'Nur Sport'], 'Bildung und Engagement.', 'Bildung und Engagement. Bildung und Engagement. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Demokratie braucht gegenwärtige ___.', ['Teilnahme', 'Verteidigung']),
  ],
  pairs: [
    pair('p1', 'Protest', 'Öffentlicher Widerspruch', 'Kann Politik ändern'),
    pair('p2', 'Zivilgesellschaft', 'Engagement jenseits Staat/Markt', 'Vereine'),
    pair('p3', 'Pressefreiheit', 'Bedingung öffentlicher Kontrolle', 'Umkämpft'),
  ],
  trueFalse: [
    tf('t1', 'Politische Teilhabe hat viele Wege und historische Grenzen.', true, 'Rechte wurden oft erkämpft.', 'Rechte wurden oft erkämpft. Protest und Öffentlichkeit zählen. Demokratiequalität geht über den Wahlakt hinaus.'),
  ],
}

const lk11_lb2_industrialisierung: BioBank = {
  quelle: 'Wikipedia: Industrielle Revolution',
  url: 'https://de.wikipedia.org/wiki/Industrielle_Revolution',
  conceptPrefix: 'ge:lk11:ind-global',
  facts: [
    fact('global', 'Industrialisierung global?', 'Ungleichzeitige Prozesse mit Zentren und Peripherien', ['Überall gleichzeitig identisch', 'Nur England ewig allein', 'Nur 21. Jh.'], 'Transfer von Technik und Kapital.', 'Transfer von Technik und Kapital. Transfer von Technik und Kapital. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Industrialisierung verlief ___.', ['ungleichzeitig', 'global vernetzt']),
    fact('technik', 'Technologietransfer?', 'Ideen und Maschinen wanderten zwischen Regionen', ['Technik blieb lokal geheim für immer', 'Keine Nachahmung', 'Nur Zufall'], 'Konkurrenz trieb Übernahme.', 'Konkurrenz trieb Übernahme. Konkurrenz trieb Übernahme. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Technik wurde zwischen Regionen ___.', ['transferiert', 'übernommen']),
    fact('weltmarkt', 'Weltmarkt?', 'Rohstoffe, Absatz und Abhängigkeiten', ['Nur nationale Autarkie immer', 'Kein Handel', 'Nur Binnenmärkte'], 'Kolonialismus verknüpft.', 'Kolonialismus verknüpft. Kolonialismus verknüpft. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Weltmarkt schuf ___ und Abhängigkeiten.', ['Verflechtungen', 'Handel']),
    fact('arbeit', 'Fabrik und Arbeit?', 'Neue Disziplin und Lohnarbeit international vergleichbar', ['Nur Heimarbeit blieb', 'Keine Fabriken außer England', 'Nur Handwerk'], 'Migration folgte.', 'Migration folgte. Migration folgte. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Fabrikarbeit prägte neue ___.', ['Disziplin', 'Lohnarbeit']),
    fact('ungleich', 'Ungleichheit?', 'Gewinner- und Verliererregionen', ['Gleicher Wohlstand überall', 'Keine Peripherie', 'Nur globale Fairness sofort'], 'Imperiale Strukturen.', 'Imperiale Strukturen. Imperiale Strukturen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Industrialisierung erzeugte globale ___.', ['Ungleichheit']),
    fact('umwelt', 'Umweltfolgen international?', 'Ressourcenverbrauch und Emissionen wuchsen', ['Keine Umweltwirkung', 'Nur lokale Gärten', 'Nur Naturschutz erfolgreich global früh'], 'Heute Klimadebatte.', 'Heute Klimadebatte. Heute Klimadebatte. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Industrie steigerte Ressourcen___ und Emissionen.', ['verbrauch']),
    fact('vergleich', 'Vergleich England–DE–Welt?', 'Unterschiedliche Pfade und Geschwindigkeiten', ['Ein einziger Pfad nur', 'Keine Unterschiede', 'Nur Kopie ohne Variation'], 'Lehrplan: internationaler Blick.', 'Lehrplan: internationaler Blick. Lehrplan: internationaler Blick. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Pfade der Industrialisierung waren ___.', ['unterschiedlich']),
    fact('folgen', 'Politische Folgen global?', 'Arbeiterbewegungen, Imperialismus, Migration', ['Keine politischen Folgen', 'Nur Technik ohne Politik', 'Nur Sport'], 'Weltgeschichte veränderte sich.', 'Weltgeschichte veränderte sich. Weltgeschichte veränderte sich. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Folgen waren u. a. Imperialismus und ___.', ['Migration', 'Arbeiterbewegung']),
  ],
  pairs: [
    pair('p1', 'Weltmarkt', 'Globale Handelsverflechtung', 'Rohstoffe und Absatz'),
    pair('p2', 'Technologietransfer', 'Wanderung von Innovationen', 'Konkurrenz'),
    pair('p3', 'Peripherie', 'Abhängige Regionen', 'Ungleichheit'),
  ],
  trueFalse: [
    tf('t1', 'Industrialisierung war ein ungleicher globaler Prozess.', true, 'Weltmarkt und Transfer prägten ihn.', 'Weltmarkt und Transfer prägten ihn. Ungleichheit wuchs. Politische Folgen waren international.'),
  ],
}

const lk11_lb2_folgen: BioBank = {
  quelle: 'Wikipedia: Arbeiterbewegung',
  url: 'https://de.wikipedia.org/wiki/Arbeiterbewegung',
  conceptPrefix: 'ge:lk11:ind-folgen',
  facts: [
    fact('arbeiter', 'Arbeiterbewegung?', 'Organisation für Rechte, Lohn und Politik', ['Nur Unternehmerlobby', 'Keine Organisation', 'Nur Kirchenchöre'], 'Gewerkschaften und Parteien.', 'Gewerkschaften und Parteien. Gewerkschaften und Parteien. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Arbeiter organisierten sich für ___.', ['Rechte', 'Lohn']),
    fact('migration', 'Migration?', 'Menschen folgten Arbeit und flohen vor Not', ['Keine Wanderung', 'Nur Sesshaftigkeit absolut', 'Nur Elitenreisen'], 'Städte wuchsen.', 'Städte wuchsen. Städte wuchsen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Industrialisierung löste ___ aus.', ['Migration', 'Wanderung']),
    fact('imperialismus', 'Link zu Imperialismus?', 'Industriemächte suchten Märkte und Rohstoffe', ['Kein Zusammenhang', 'Nur Kulturmission ohne Wirtschaft', 'Nur Zufall'], 'Konkurrenz global.', 'Konkurrenz global. Konkurrenz global. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Industriemächte suchten Märkte und ___.', ['Rohstoffe', 'Kolonien']),
    fact('sozial', 'Soziale Konflikte?', 'Streiks, Armut, Reformkämpfe', ['Nur Harmonie', 'Keine Streiks je', 'Nur Adelskonflikte'], 'Staat reagierte unterschiedlich.', 'Staat reagierte unterschiedlich. Staat reagierte unterschiedlich. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Soziale Konflikte äußerten sich in ___.', ['Streiks', 'Protest']),
    fact('geschlecht', 'Geschlechterfolgen?', 'Frauenarbeit und spätere Rechtekämpfe', ['Keine Frauen in Industrie', 'Nur Haushalt unverändert global', 'Nur Männer ohne Wandel'], 'Doppelbelastung.', 'Doppelbelastung. Doppelbelastung. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Frauenarbeit prägte die industrielle ___.', ['Gesellschaft', 'Arbeitswelt']),
    fact('politik', 'Politische Ordnungen?', 'Druck auf Verfassung, Sozialpolitik und Parteien', ['Politik unberührt', 'Nur Technikpolitik', 'Nur Außenpolitik ohne Innen'], 'Sozialgesetze folgten.', 'Sozialgesetze folgten. Sozialgesetze folgten. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Industrialisierung erzeugte politischen ___.', ['Druck', 'Wandel']),
    fact('kultur', 'Alltagskultur?', 'Neue Zeit, Konsum und Klassenmilieus', ['Kultur unverändert', 'Nur Hochkultur Adel', 'Nur Folklore'], 'Vereine und Freizeit.', 'Vereine und Freizeit. Vereine und Freizeit. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Alltagskultur prägte neue ___.', ['Milieus', 'Konsumformen']),
    fact('ambivalenz', 'Ambivalenz der Folgen?', 'Wohlstandschancen und Ausbeutung zugleich', ['Nur Fortschritt ohne Opfer', 'Nur Elend ohne Technik', 'Keine Ambivalenz'], 'Lehrplan: Doppelgesicht.', 'Lehrplan: Doppelgesicht. Lehrplan: Doppelgesicht. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Folgen zeigen Chancen und ___.', ['Ausbeutung', 'Kosten']),
  ],
  pairs: [
    pair('p1', 'Arbeiterbewegung', 'Organisation der Lohnabhängigen', 'Rechte und Politik'),
    pair('p2', 'Migration', 'Wanderung zur Arbeit', 'Urbanisierung'),
    pair('p3', 'Imperialismus', 'Globale Expansion', 'Rohstoffe und Märkte'),
  ],
  trueFalse: [
    tf('t1', 'Industrialisierung erzeugte soziale, politische und globale Folgen.', true, 'Arbeiterbewegung und Imperialismus gehören dazu.', 'Arbeiterbewegung und Imperialismus gehören dazu. Migration und Konflikte folgten. Ambivalenz bleibt.'),
  ],
}

const lk12_lb1_kriegsursachen: BioBank = {
  quelle: 'Wikipedia: Kriegsursache',
  url: 'https://de.wikipedia.org/wiki/Kriegsursache',
  conceptPrefix: 'ge:lk12:kriegsursachen',
  facts: [
    fact('ursachen', 'Kriegsursachen analysieren?', 'Strukturelle und situative Faktoren unterscheiden', ['Nur Zufall', 'Nur eine Ursache immer', 'Nur Wetter'], 'Bündnisse, Interessen, Ideologien.', 'Bündnisse, Interessen, Ideologien. Bündnisse, Interessen, Ideologien. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Analyse unterscheidet strukturelle und ___ Faktoren.', ['situative']),
    fact('frieden', 'Friedensordnungen?', 'Verträge und Institutionen nach Kriegen', ['Keine Ordnungen je', 'Nur Siegerwillkür ohne Text', 'Nur mündliche Absprachen'], 'Westfalen, Wien, Versailles, 1945.', 'Westfalen, Wien, Versailles, 1945. Westfalen, Wien, Versailles, 1945. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Nach Kriegen entstehen oft Friedens___.', ['ordnungen', 'verträge']),
    fact('versagen', 'Versagen von Ordnungen?', 'Unzureichende Durchsetzung und ungelöste Konflikte', ['Ordnungen halten ewig immer', 'Keine Revisionwünsche', 'Nur perfekte Systeme'], '1919 und Appeasement als Fälle.', '1919 und Appeasement als Fälle. 1919 und Appeasement als Fälle. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Ordnungen scheitern an Durchsetzung und ___.', ['Konflikten', 'Revision']),
    fact('sicherheit', 'Sicherheitsdilemmata?', 'Aufrüstung aus Furcht erzeugt Gegenaufrüstung', ['Aufrüstung schafft immer Vertrauen', 'Keine Dilemmata', 'Nur Abrüstung spontan'], 'Vor 1914 und im Kalten Krieg.', 'Vor 1914 und im Kalten Krieg. Vor 1914 und im Kalten Krieg. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Sicherheitsdilemmata treiben ___.', ['Aufrüstung', 'Misstrauen']),
    fact('ideologie', 'Ideologien?', 'Feindbilder und Heilserwartungen können eskalieren', ['Ideologien irrelevant', 'Nur Ökonomie zählt absolut', 'Nur Geografie'], 'Nationalismus, Rassismus, Revolution.', 'Nationalismus, Rassismus, Revolution. Nationalismus, Rassismus, Revolution. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Ideologien können Konflikte ___.', ['eskalieren', 'antrieben']),
    fact('lernen', 'Historisches Lernen?', 'Muster erkennen ohne falsche Gleichsetzungen', ['Geschichte wiederholt sich identisch', 'Keine Muster', 'Nur Auswendiglernen Daten'], 'Analogien vorsichtig nutzen.', 'Analogien vorsichtig nutzen. Analogien vorsichtig nutzen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Lernen heißt Muster ___ prüfen.', ['vorsichtig', 'kritisch']),
    fact('akteure', 'Welche Akteure sind zu beachten?', 'Staaten, Militärs, Bewegungen, Wirtschaft', ['Nur ein Führer allein immer', 'Keine Institutionen', 'Nur Zufallspersonen'], 'Verantwortung differenziert.', 'Verantwortung differenziert. Verantwortung differenziert. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Mehrere ___ tragen Verantwortung.', ['Akteure']),
    fact('praevention', 'Prävention?', 'Diplomatie, Recht und Institutionen früh nutzen', ['Immer erst Krieg', 'Nur Aufrüstung maximal', 'Ignorieren von Krisen'], 'Gegenwartsbezug.', 'Gegenwartsbezug. Gegenwartsbezug. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Prävention braucht Diplomatie und ___.', ['Institutionen', 'Recht']),
  ],
  pairs: [
    pair('p1', 'Sicherheitsdilemma', 'Aufrüstung aus Furcht', 'Eskalationsgefahr'),
    pair('p2', 'Friedensordnung', 'Nachkriegsregelung', 'Fragil'),
    pair('p3', 'Prävention', 'Frühe Krisenbearbeitung', 'Diplomatie'),
  ],
  trueFalse: [
    tf('t1', 'Kriegsursachen sind strukturell und situativ zu analysieren.', true, 'Friedensordnungen können scheitern.', 'Friedensordnungen können scheitern. Sicherheitsdilemmata eskalieren. Prävention braucht Institutionen.'),
  ],
}

const lk12_lb1_institutionen: BioBank = {
  quelle: 'Wikipedia: Vereinte Nationen',
  url: 'https://de.wikipedia.org/wiki/Vereinte_Nationen',
  conceptPrefix: 'ge:lk12:institutionen',
  facts: [
    fact('uno', 'UNO-Rolle?', 'Forum und Instrument internationaler Konfliktbearbeitung', ['Weltregierung mit Allmacht', 'Nur Kulturverein', 'Nur Bank'], 'Charta verbietet Angriffskrieg prinzipiell.', 'Charta verbietet Angriffskrieg prinzipiell. Charta verbietet Angriffskrieg prinzipiell. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Die UNO dient internationaler ___.', ['Konfliktbearbeitung', 'Zusammenarbeit']),
    fact('diplomatie', 'Diplomatie?', 'Verhandeln statt sofortiger Gewalt', ['Nur Ultimaten', 'Nur Krieg', 'Nur Schweigen'], 'Kanäle und Kompromisse.', 'Kanäle und Kompromisse. Kanäle und Kompromisse. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Diplomatie setzt auf ___.', ['Verhandeln', 'Kompromiss']),
    fact('abruestung', 'Abrüstung?', 'Begrenzung von Waffenarsenalen durch Verträge', ['Maximale Aufrüstung immer', 'Keine Verträge möglich', 'Nur nationale Alleingänge'], 'Kontrolle und Vertrauen nötig.', 'Kontrolle und Vertrauen nötig. Kontrolle und Vertrauen nötig. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Abrüstung braucht Verträge und ___.', ['Kontrolle', 'Vertrauen']),
    fact('grenzen', 'Grenzen von Institutionen?', 'Abhängig von Macht und Wille der Mitglieder', ['Immer durchsetzungsstark', 'Immer wirkungslos', 'Unabhängig von Staaten'], 'Reformdebatten.', 'Reformdebatten. Reformdebatten. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Wirksamkeit hängt vom ___ der Mitglieder ab.', ['Willen', 'Machtkalkül']),
    fact('regional', 'Regionale Organisationen?', 'Ergänzen globale Strukturen (z. B. OSZE, EU)', ['Ersetzen UNO immer', 'Überflüssig', 'Nur Militärbündnisse zählen'], 'Arbeitsteilung.', 'Arbeitsteilung. Arbeitsteilung. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Regionale Organisationen ___ globale Strukturen.', ['ergänzen']),
    fact('recht', 'Völkerrechtliche Normen?', 'Kriegsverbot, Menschenrechte, Humanitäres Recht', ['Recht irrelevant international', 'Nur nationale Gesetze', 'Nur Moral ohne Text'], 'Durchsetzung lückenhaft.', 'Durchsetzung lückenhaft. Durchsetzung lückenhaft. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Völkerrecht setzt internationale ___.', ['Normen', 'Regeln']),
    fact('fall', 'Fallbezug?', 'Erfolge und Scheitern an konkreten Konflikten prüfen', ['Nur Theorie ohne Fälle', 'Nur Propaganda', 'Nur Statistik ohne Politik'], 'Lehrplan: problemorientiert.', 'Lehrplan: problemorientiert. Lehrplan: problemorientiert. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Urteil braucht konkrete ___.', ['Fälle', 'Konflikte']),
    fact('frieden', 'Dauerhafter Frieden?', 'Prozess aus Institutionen, Interessenausgleich und Gesellschaften', ['Ein Vertrag genügt ewig', 'Nur Militärdominanz', 'Nur Wirtschaftswachstum allein'], 'Mehrdimensional.', 'Mehrdimensional. Mehrdimensional. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Frieden ist ein ___ aus vielen Faktoren.', ['Prozess']),
  ],
  pairs: [
    pair('p1', 'UNO', 'Globale Organisation', 'Konfliktbearbeitung'),
    pair('p2', 'Abrüstung', 'Vertragsbegrenzung von Waffen', 'Vertrauen'),
    pair('p3', 'Völkerrecht', 'Internationale Normen', 'Lückenhafte Durchsetzung'),
  ],
  trueFalse: [
    tf('t1', 'Internationale Institutionen helfen bei Konfliktlösung – mit Grenzen.', true, 'Wirksamkeit hängt vom Willen der Mächte ab.', 'Wirksamkeit hängt vom Willen der Mächte ab. Diplomatie und Abrüstung zählen. Frieden ist ein Prozess.'),
  ],
}

const lk12_lb2_erinnerung: BioBank = {
  quelle: 'Wikipedia: Erinnerungskultur',
  url: 'https://de.wikipedia.org/wiki/Erinnerungskultur',
  conceptPrefix: 'ge:lk12:erinnerung',
  facts: [
    fact('begriff', 'Erinnerungskultur?', 'Öffentliche Formen des Gedenkens und Deutens von Geschichte', ['Nur private Erinnerung', 'Nur Archive ohne Öffentlichkeit', 'Nur Vergessen'], 'Denkmäler, Gedenktage, Medien.', 'Denkmäler, Gedenktage, Medien. Denkmäler, Gedenktage, Medien. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Erinnerungskultur meint öffentliche Formen des ___.', ['Gedenkens', 'Deutens']),
    fact('denkmal', 'Denkmäler?', 'Materielle Träger von Deutungsangeboten', ['Neutrale Steine ohne Botschaft', 'Nur Dekoration', 'Nur Verkehrszeichen'], 'Umstritten und wandelbar.', 'Umstritten und wandelbar. Umstritten und wandelbar. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Denkmäler tragen ___ von Geschichte.', ['Deutungen', 'Botschaften']),
    fact('konflikt', 'Erinnerungskonflikte?', 'Gruppen streiten um Deutungsmacht', ['Ein Konsens immer', 'Keine Konflikte', 'Nur staatliche Einheitsdeutung ewig'], 'Opfer- und Täterperspektiven.', 'Opfer- und Täterperspektiven. Opfer- und Täterperspektiven. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Erinnerung ist oft ___.', ['umkämpft', 'konfliktträchtig']),
    fact('medien', 'Medien und Geschichte?', 'Filme, Serien und Netz prägen Geschichtsbilder', ['Nur Schulbücher wirken', 'Keine Medienwirkung', 'Nur Archive ohne Publikum'], 'Kritikfähigkeit nötig.', 'Kritikfähigkeit nötig. Kritikfähigkeit nötig. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Medien prägen historische ___.', ['Bilder', 'Deutungen']),
    fact('opfer', 'Opfergedenken?', 'Würdigung ohne Instrumentalisierung', ['Nur politische Nutznießung', 'Vergessen der Opfer', 'Nur Täterfeiern'], 'Ethik der Erinnerung.', 'Ethik der Erinnerung. Ethik der Erinnerung. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Gedenken soll Opfer ___ ohne Missbrauch.', ['würdigen']),
    fact('schule', 'Schule und Erinnerung?', 'Bildung gegen Mythen und Hass', ['Nur Auswendiglernen Daten', 'Keine Haltung', 'Nur Feiern'], 'Multiperspektivität.', 'Multiperspektivität. Multiperspektivität. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Schule stärkt gegen Mythen und ___.', ['Hass', 'Vereinfachung']),
    fact('wandel', 'Wandel der Erinnerung?', 'Deutungen ändern sich mit Generationen und Politik', ['Erinnerung fix für immer', 'Keine Generationendifferenz', 'Nur Naturgesetz'], 'Neue Quellen und Debatten.', 'Neue Quellen und Debatten. Neue Quellen und Debatten. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Erinnerung wandelt sich mit ___.', ['Generationen', 'Politik']),
    fact('verantwortung', 'Verantwortung?', 'Demokratische Gesellschaften gestalten Erinnerung bewusst', ['Nur Zufall', 'Nur Staat ohne Bürger', 'Nur Markt'], 'Partizipation möglich.', 'Partizipation möglich. Partizipation möglich. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Erinnerung ist demokratische ___.', ['Aufgabe', 'Verantwortung']),
  ],
  pairs: [
    pair('p1', 'Denkmal', 'Materielles Gedenken', 'Deutungsangebot'),
    pair('p2', 'Gedenktag', 'Rituelles Erinnern', 'Öffentlichkeit'),
    pair('p3', 'Deutungsmacht', 'Wer Geschichte erklärt', 'Umkämpft'),
  ],
  trueFalse: [
    tf('t1', 'Erinnerungskultur formt öffentliche Geschichtsbilder – oft umkämpft.', true, 'Denkmäler und Medien tragen Deutungen.', 'Denkmäler und Medien tragen Deutungen. Opfergedenken braucht Ethik. Schule stärkt gegen Mythen.'),
  ],
}

const lk12_lb2_identitaet: BioBank = {
  quelle: 'Wikipedia: Nationale Identität',
  url: 'https://de.wikipedia.org/wiki/Nationale_Identit%C3%A4t',
  conceptPrefix: 'ge:lk12:identitaet',
  facts: [
    fact('identitaet', 'Historische Identität?', 'Selbstbilder, die aus Geschichtserzählungen entstehen', ['Nur Genetik', 'Nur Passnummern', 'Nur Zufall ohne Erzählung'], 'Nation, Region, Europa.', 'Nation, Region, Europa. Nation, Region, Europa. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Identität speist sich aus Geschichts___.', ['erzählungen', 'bildern']),
    fact('narrative', 'Narrative?', 'Sinnstiftende Erzählungen über Vergangenheit', ['Nur Faktenlisten ohne Sinn', 'Keine Erzählungen in Politik', 'Nur Wetterberichte'], 'Können einschließen oder ausgrenzen.', 'Können einschließen oder ausgrenzen. Können einschließen oder ausgrenzen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Narrative stiften ___ über Vergangenheit.', ['Sinn']),
    fact('politik', 'Geschichtspolitik?', 'Politische Nutzung von Geschichte für Gegenwartsziele', ['Geschichte nie politisch', 'Nur Wissenschaft ohne Öffentlichkeit', 'Nur Privatinteresse'], 'Kritik nötig.', 'Kritik nötig. Kritik nötig. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Geschichtspolitik nutzt Vergangenheit für ___.', ['Gegenwartsziele', 'Politik']),
    fact('mythos', 'Was sind nationale Mythen?', 'Vereinfachte, oft heroische Erzählungen', ['Immer wissenschaftlich korrekt', 'Keine Mythen in Nationen', 'Nur Märchen ohne Wirkung'], 'Können mobilisieren und täuschen.', 'Können mobilisieren und täuschen. Können mobilisieren und täuschen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Nationale Mythen sind oft ___.', ['vereinfacht', 'heroisch']),
    fact('vielfalt', 'Vielfalt der Identitäten?', 'Mehrfachzugehörigkeiten statt eines einzigen Ichs', ['Nur eine Identität erlaubt', 'Keine regionalen Bezüge', 'Nur globale Einheitsidentität erzwungen'], 'Spannungen aushalten.', 'Spannungen aushalten. Spannungen aushalten. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Menschen haben oft multiple ___.', ['Identitäten', 'Zugehörigkeiten']),
    fact('ausgrenzung', 'Welches Risiko bergen Identitätserzählungen?', 'Identitätspolitiken können Feindbilder erzeugen', ['Immer nur Integration', 'Keine Ausgrenzung je', 'Nur Harmonie'], 'Kritik an Exklusion.', 'Kritik an Exklusion. Kritik an Exklusion. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Identitätserzählungen können ___ erzeugen.', ['Feindbilder', 'Ausgrenzung']),
    fact('europa', 'Europäische Bezüge?', 'Nationale und europäische Narrative überlagern sich', ['Nur Nation zählt', 'Nur Europa ohne Nation', 'Keine Geschichte Europas'], 'Lehrplan: Mehrebenen.', 'Lehrplan: Mehrebenen. Lehrplan: Mehrebenen. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Narrative können national und ___ sein.', ['europäisch']),
    fact('bildung', 'Bildungsauftrag?', 'Reflexion statt Indoktrination', ['Nur patriotische Feiern', 'Nur Ablehnung jeder Identität', 'Nur Auswendiglernen'], 'Urteilsfähigkeit.', 'Urteilsfähigkeit. Urteilsfähigkeit. Lehrplanbezug und Quellenarbeit vertiefen das Urteil.', 'Bildung zielt auf ___ über Identität.', ['Reflexion', 'Urteil']),
  ],
  pairs: [
    pair('p1', 'Narrativ', 'Sinnstiftende Erzählung', 'Kann ausgrenzen'),
    pair('p2', 'Geschichtspolitik', 'Politische Nutzung von Geschichte', 'Kritik nötig'),
    pair('p3', 'Mythos', 'Vereinfachte Heroenerzählung', 'Mobilisiert'),
  ],
  trueFalse: [
    tf('t1', 'Historische Identitäten entstehen aus umkämpften Erzählungen.', true, 'Geschichtspolitik und Mythen sind zu reflektieren.', 'Geschichtspolitik und Mythen sind zu reflektieren. Vielfalt aushalten. Bildung zielt auf Urteil, nicht Indoktrination.'),
  ],
}

export const GESCHICHTE_DENSE_UPPER_GENERATORS: Record<string, Topic['generate']> = {
  'ge-k7-lb1-renaissance': bankGenerate(k7_lb1_renaissance),
  'ge-k7-lb1-entdeckungen': bankGenerate(k7_lb1_entdeckungen),
  'ge-k7-lb1-reformation-krieg': bankGenerate(k7_lb1_reformation_krieg),
  'ge-k7-lb2-absolutismus-frankreich': bankGenerate(k7_lb2_absolutismus_frankreich),
  'ge-k7-lb2-aufklaerung': bankGenerate(k7_lb2_aufklaerung),
  'ge-k7-lb2-preussen-sachsen': bankGenerate(k7_lb2_preussen_sachsen),
  'ge-k8-lb1-napoleon-wiener': bankGenerate(k8_lb1_napoleon_wiener),
  'ge-k8-lb1-vormaerz-1848': bankGenerate(k8_lb1_vormaerz_1848),
  'ge-k8-lb1-kaiserreich': bankGenerate(k8_lb1_kaiserreich),
  'ge-k8-lb2-england': bankGenerate(k8_lb2_england),
  'ge-k8-lb2-deutschland': bankGenerate(k8_lb2_deutschland),
  'ge-k8-lb2-folgen': bankGenerate(k8_lb2_folgen),
  'ge-k8-lb4-imperialismus': bankGenerate(k8_lb4_imperialismus),
  'ge-k8-lb4-buendnisse': bankGenerate(k8_lb4_buendnisse),
  'ge-k8-lb4-ursachen-wk1': bankGenerate(k8_lb4_ursachen_wk1),
  'ge-k8-lbw-alltag': bankGenerate(k8_lbw_alltag),
  'ge-k9-lb1-versailles': bankGenerate(k9_lb1_versailles),
  'ge-k9-lb1-europa-ordnung': bankGenerate(k9_lb1_europa_ordnung),
  'ge-k9-lb2-weimar': bankGenerate(k9_lb2_weimar),
  'ge-k9-lb2-aufstieg-ns': bankGenerate(k9_lb2_aufstieg_ns),
  'ge-k9-lb3-terror': bankGenerate(k9_lb3_terror),
  'ge-k9-lb3-holocaust': bankGenerate(k9_lb3_holocaust),
  'ge-k9-lb3-widerstand': bankGenerate(k9_lb3_widerstand),
  'ge-k9-lb4-ausgleich': bankGenerate(k9_lb4_ausgleich),
  'ge-k9-lb4-aggression': bankGenerate(k9_lb4_aggression),
  'ge-k10-lb1-allianz-bruch': bankGenerate(k10_lb1_allianz_bruch),
  'ge-k10-lb1-kaltkrieg-phasen': bankGenerate(k10_lb1_kaltkrieg_phasen),
  'ge-k10-lb2-teilung': bankGenerate(k10_lb2_teilung),
  'ge-k10-lb2-zwei-staaten': bankGenerate(k10_lb2_zwei_staaten),
  'ge-k10-lb2-deutsche-frage': bankGenerate(k10_lb2_deutsche_frage),
  'ge-k10-lb3-osteuropa-1989': bankGenerate(k10_lb3_osteuropa_1989),
  'ge-k10-lb3-einigung': bankGenerate(k10_lb3_einigung),
  'ge-gk-lb1-wirtschaft': bankGenerate(gk_lb1_wirtschaft),
  'ge-gk-lb1-politik-partizipation': bankGenerate(gk_lb1_politik_partizipation),
  'ge-gk-lb2-weimar-versagen': bankGenerate(gk_lb2_weimar_versagen),
  'ge-gk-lb2-ns-herrschaft': bankGenerate(gk_lb2_ns_herrschaft),
  'ge-gk-lb3-brd-demokratie': bankGenerate(gk_lb3_brd_demokratie),
  'ge-gk-lb3-ddr-diktatur': bankGenerate(gk_lb3_ddr_diktatur),
  'ge-gk-lb4-kollektive-sicherheit': bankGenerate(gk_lb4_kollektive_sicherheit),
  'ge-gk-lb4-kaltkrieg-frieden': bankGenerate(gk_lb4_kaltkrieg_frieden),
  'ge-lk11-lb1-ordnungen': bankGenerate(lk11_lb1_ordnungen),
  'ge-lk11-lb1-partizipation': bankGenerate(lk11_lb1_partizipation),
  'ge-lk11-lb2-industrialisierung': bankGenerate(lk11_lb2_industrialisierung),
  'ge-lk11-lb2-folgen': bankGenerate(lk11_lb2_folgen),
  'ge-lk12-lb1-kriegsursachen': bankGenerate(lk12_lb1_kriegsursachen),
  'ge-lk12-lb1-institutionen': bankGenerate(lk12_lb1_institutionen),
  'ge-lk12-lb2-erinnerung': bankGenerate(lk12_lb2_erinnerung),
  'ge-lk12-lb2-identitaet': bankGenerate(lk12_lb2_identitaet),
}
