/**
 * Minimal safe glossary MC rewriter.
 *
 * Upgrades vague meta stems (Was bedeutet / Welche Aussage … fachlich richtig /
 * Was trifft) into concrete Schüler questions, and expands short meaning
 * fragments into full parallel option sentences.
 *
 * Hard rules — never emit:
 * - „Bezeichnet die Bezeichnet“, „zählt inhaltlich“, „— so bei … im Thema“
 * - stock wrongs (Nachbarbegriff / Randdetail / vertauschte Ursache-Wirkung)
 * - layered wrapper mash (Sie bezeichnet die Ist …)
 * - pad wrappers: „ist hier:“ / „ist kurz gesagt:“ / „Hier gilt:“ /
 *   „Es geht um“ / „und zwar gilt“ / „steht im Kern für Folgendes“
 */

export type GlossaryStemStyle = 'purpose' | 'property' | 'process' | 'definition'

const PREPS = new Set([
  'zu',
  'zur',
  'zum',
  'von',
  'vom',
  'für',
  'im',
  'in',
  'am',
  'an',
  'auf',
  'bei',
  'vs',
  'oder',
  'und',
  'der',
  'die',
  'das',
  'den',
  'dem',
  'des',
  'ein',
  'eine',
  'einen',
  'einem',
  'einer',
  'mit',
  'ohne',
  'nach',
  'gegen',
  'über',
  'unter',
  'aus',
  'als',
  'bis',
  'um',
  'durch',
  'vor',
  'seit',
])

const PURPOSE_VERB =
  /^(Schaltet|Dient|Dienen|Vermeidet|Ermöglicht|Regelt|Steuert|Misst|Schützt|Hilft|Unterstützt|Begrenzt|Verhindert|Reduziert|Erhöht|Verringert|Speichert|Überträgt|Entzieht|Nimmt|Bewegt|Reguliert|Verbindet|Gewährt|Organisiert|Stellt|Meint|Vergleicht|Erzeugt|Lässt|Lassen|Wirft|Sendet|Bildet|Zeigt|Enthält|Umfasst|Ändert|Hängt|Folgt|Treibt|Wandelt|Gibt|Tritt|Prägt|Unterbricht|Transportiert|Hemmt|Pumpt|Katalysiert|Trennt|Isoliert|Leitet|Bereitet|Erfasst|Wertet|Wirkt|Fängt|Beherbergt|Ergänzt|Nutzt|Dokumentiert|Ordnet|Fasst|Spaltet|Läuft|Unterwirft|Fixiert|Schreibt|Ersetzt|Kommuniziert|Signalisiert|Reagiert|Verteilt|Markiert|Kennzeichnet|Überwindet|Beeinflusst|Verursacht|Ermittelt|Berechnet|Analysiert|Beschleunigt|Verlangsamt|Verstärkt|Schwächt|Absorbiert|Reflektiert|Bricht|Polarisiert|Diffundiert|Osmosiert|Aktiviert|Inhibiert|Produziert|Konsumiert|Dekomponiert|Fixiert|Synthetisiert|Hydrolysiert|Oxidiert|Reduziert|Phosphoryliert|Depolarisiert|Repolarisiert|Bindet|Löst|Spaltet|Verbindet|Überträgt|Wandert|Migriert|Proliferiert|Differenziert|Apoptosiert|Mutiert|Rekombiniert)\b/i

const EFFECT_VERB =
  /^(Ist|Sind|Wird|Werden|Entsteht|Bedeutet|Gilt|Kennzeichnet|Bezeichnet|Beschreibt|Steht|Liegt|Geht|Hat|Haben|Stört)\b/i

const BANNED_OPTION =
  /Bezeichnet die Bezeichnet|zählt inhaltlich|Fachzusammenhang als zentralen|— so bei|\bNachbarbegriff\b|Randdetail ohne|vertauschte Ursache-Wirkung|bezeichnet die Ist |bezeichnet das Ist |Es das Ist|kennzeichnet das Ist|kennzeichnet die Ist|beschreibt die Ist|\?\?\?|zentralen fachlichen Kern|von Nachbarbegriffen|ist hier:|ist kurz gesagt:|\bHier gilt\b|Es geht um|und zwar gilt|steht im Kern für Folgendes|der Ereignisse|Was bedeutet|bei den behandelten Arten|\bNur Haarfarbe\b|\bNur Zahnzahl\b|ohne biologischen Bezug|Nur Fotosynthese ohne biologischen Bezug|\bEs ist eine Nur\b|\bSie ist eine Nur\b|\bEr ist eine Nur\b|Es ist eine Erbgänge|Es ist eine Lebensraum diktiert|Es beschreibt ein Zwei Membranen|\bEs ist ein (?:Ersetzt|Kommuniziert|Putzen|Signalisiert|Markiert|Kennzeichnet|Kopiert|Geöffnet)\b|\bein Gezieltes\b|\bein Genetisch\b|\bdas Künstliche\b|\bGrundmethode der Verhaltensbiologie\b|sonne Stern unter Sternen|Es ist einseitig durch/i

/**
 * Title-Case mush after „ist eine“: two+ Title tokens (e.g. „ist eine Franklins Röntgen…“).
 * Plain „ist eine Genommutation, …“ remains valid German.
 */
const TITLE_AFTER_IST_EINE = /\bist eine [A-ZÄÖÜ][a-zäöüß]+ [A-ZÄÖÜ]/

/** Title-Case mush after „beschreibt eine/ein“ (same class as ist-hier pads). */
const TITLE_AFTER_BESCHREIBT_EINE = /\bbeschreibt eine [A-ZÄÖÜ]/
const TITLE_AFTER_BESCHREIBT_EIN = /\bbeschreibt ein [A-ZÄÖÜ]/

/** Gold definition stem that may keep „Was versteht man …“. */
export function isAllowedVerstehtStem(prompt: string): boolean {
  return /Was versteht man in der Geschichtswissenschaft unter einer Quelle\??$/i.test(
    prompt.replace(/\s+/g, ' ').trim(),
  )
}

/** Strip thin-fill slug prefixes like `[ge-k5-lb1-quellen]`. */
export function stripBankSlugPrefix(prompt: string): string {
  return prompt.replace(/^\[[^\]]+\]\s*/u, '').trim()
}

export function displayGlossaryTerm(term: string): string {
  return term
    .replace(/\s*\([^)]*\)\s*$/u, '')
    .replace(/\//g, ' oder ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Comprehensive domain noun gender dictionary.
 * 'm' = masculine (der), 'f' = feminine (die), 'n' = neuter (das).
 */
const DOMAIN_NOUN_GENDER: Record<string, 'm' | 'f' | 'n'> = {
  // Bio: Vogelkunde / Vogelschutz
  balz: 'f', schonzeit: 'f', kollision: 'f', nisthilfe: 'f', brutruhe: 'f',
  eiablage: 'f', elternfürsorge: 'f', laichschnur: 'f', warnfärbung: 'f',
  koloniebrut: 'f', nestbrut: 'f', kiemenrückbildung: 'f', schwanzrückbildung: 'f',
  ovoviviparie: 'f', winterruhe: 'f', gallerte: 'f', laichwanderung: 'f', reviergröße: 'f',
  fensteranprall: 'm', nistkasten: 'm', brutplatz: 'm', nistplatz: 'm',
  alarmruf: 'm', schwarm: 'm', luftsack: 'm', dottersack: 'm', giftzahn: 'm', lidschlag: 'm',
  spechtschnabel: 'm', hakenschnabel: 'm', körnerschnabel: 'm', filterschnabel: 'm',
  nektarschnabel: 'm', watvogelschnabel: 'm', insektenschnabel: 'm', greifvogel: 'm',
  gelege: 'n', revier: 'n', kiemenstadium: 'n', nictitans: 'n',
  // Bio: Amphibien / Reptilien
  lurch: 'm', froschlurch: 'm', schwanzlurch: 'm', embryo: 'm', unterlauf: 'm',
  plazenta: 'f', flughaut: 'f', schwimmhaut: 'f', häutung: 'f',
  oberarmknochen: 'm',
  meeresreptil: 'n', reptil: 'n',
  // Bio: Säugetiere / Sozialverhalten
  milch: 'f', geburt: 'f', königin: 'f', arbeiterin: 'f', sozialbindung: 'f',
  unterwerfung: 'f', gefiederpflege: 'f', nachahmung: 'f',
  nektar: 'm', puls: 'm', futterplan: 'm', fettvorrat: 'm', winterschlaf: 'm',
  frostschutz: 'm', sandsturm: 'm', lärm: 'm', hautsinn: 'm',
  winterfell: 'n', pheromon: 'n',
  // Bio: Ökologie / Artenschutz / Stoffkreislauf
  artenschutz: 'm', naturschutz: 'm', vogelschutz: 'm', umweltschutz: 'm',
  tierschutz: 'm', kriechtierschutz: 'm', fischschutz: 'm', lurchschutz: 'm',
  embryonenschutz: 'm',
  stoffkreislauf: 'm', energiefluss: 'm', stickstoffkreislauf: 'm', mischwald: 'm',
  bodenschutz: 'm', destruent: 'm', produzent: 'm', xerophyt: 'm', neophyt: 'm',
  saprobiont: 'm', speisepilz: 'm', wanderfisch: 'm', alkoholgehalt: 'm',
  wasserfußabdruck: 'm', fortpflanzungstyp: 'm', bergbau: 'm', jura: 'm',
  // KEY: compound nouns with masculine head noun (for naturalFragmentOption subject)
  habitatverlust: 'm', ressourcenverbrauch: 'm', lebensraumverlust: 'm',
  kompensationspunkt: 'm', transpirationssog: 'm', wurzeldruck: 'm',
  chloroplast: 'm', akzeptor: 'm', phänotyp: 'm', genotyp: 'm', allel: 'n',
  strukturvielfalt: 'f', mykorrhiza: 'f', zeigerart: 'f', trias: 'f',
  epidermis: 'f', hautflora: 'f', fitness: 'f',
  // Bio: osmose/transport (feminine)
  kohäsion: 'f', adhäsion: 'f', diffusion: 'f', osmose: 'f', selektivität: 'f',
  kapillarität: 'f', permeabilität: 'f', plasmolyse: 'f', deplasmolyse: 'f',
  // Bio: Genetik/Mol
  genregulation: 'f', methylierung: 'f', auflösung: 'f',
  naturschutzgebiet: 'n', schutzgebiet: 'n', fossil: 'n', aquarium: 'n',
  kausalnetz: 'n', chitin: 'n', ufergehölz: 'n', benthos: 'n', makrozoobenthos: 'n',
  treibhausgas: 'n', ammonium: 'n', monitoring: 'n', management: 'n', atp: 'n', sauerkraut: 'n',
  gewebe: 'n', risiko: 'n', organ: 'n', dogma: 'n',
  // Bio: Physiologie / Neurologie / Genetik
  reiz: 'm', dendrit: 'm', gendrift: 'm',
  genfluss: 'm', selektionsdruck: 'm', energieumsatz: 'm', kräuterreichtum: 'm',
  joghurt: 'm', brotteig: 'm', einfluss: 'm',
  melanin: 'n', cortisol: 'n', axon: 'n', neuron: 'n', wachstum: 'n', antihistaminikum: 'n',
  // Bio: Humanbiologie
  sympathikus: 'm', parasympathikus: 'm', hypothalamus: 'm',
  hypophyse: 'f', schilddrüse: 'f',
  // Bio: Sinne (all "-sinn" compounds are masculine: der Tastsinn, der Geruchssinn, …)
  tastsinn: 'm', geruchssinn: 'm', gehörsinn: 'm', sehsinn: 'm', gleichgewichtssinn: 'm',
  temperatursinn: 'm', schmerzsinn: 'm', tiefensinn: 'm',
  // Bio: Lernen/Verhalten/Anatomie (extra entries not in original block above)
  artenschutzplan: 'm', stammbaum: 'm',
  frequenzgang: 'm', wirbelstrom: 'm', schwingfall: 'm', federarbeit: 'f',
  wirbelstrombremse: 'f', amplitudengang: 'm', resonanzfrequenz: 'f',
  flaschenhalseffekt: 'm', vegetationskegel: 'm', artbegriff: 'm',
  beitrag: 'm', nervensystem: 'n', trend: 'm', vergleich: 'm',
  stammzelle: 'f', zellzyklus: 'm', kompartimentierung: 'f', endo: 'f',
  selektion: 'f', mutation: 'f', modifikation: 'f', autosom: 'n',
  // Bio: anatomie / physiologie / genetik (inventory-expanded)
  zellkern: 'm', blutdruck: 'm', bluthochdruck: 'm', medieninfluss: 'm',
  biodiversitätsverlauf: 'm', schwanzlurch: 'm', froschlurch: 'm',
  schädlingsdruck: 'm', apoptoseverlust: 'm', herdenschutz: 'm',
  neurotransmitterabbau: 'm', wärmeverlust: 'm', einschaltvorgang: 'm',
  luftdruck: 'm', gasdruck: 'm',
  'innere befruchtung': 'f',
  'äußere befruchtung': 'f',
  'motorische bahn': 'f',
  'sensorische bahn': 'f',
  'aktiver transport': 'm',
  'passiver transport': 'm',
  intersexualität: 'f', eugenik: 'f', konvergenz: 'f', leuchtkraft: 'f',
  gärung: 'f', milchsäuregärung: 'f', photorespiration: 'f',
  renaturierung: 'f', transplantation: 'f', früherkennung: 'f',
  verdauung: 'f', bilanz: 'f', messung: 'f', migration: 'f',
  artbildung: 'f', raumtrennung: 'f', spezifität: 'f', impfung: 'f',
  // Physik
  druck: 'm', strom: 'm', widerstand: 'm', schalter: 'm', hebelarm: 'm',
  kraftarm: 'm', lasthebel: 'm', sensor: 'm', timer: 'm', lichtstrahl: 'm',
  kernschatten: 'm', halbschatten: 'm', brennpunkt: 'm', parallelstrahl: 'm',
  mittelpunktstrahl: 'm', strahlengang: 'm', aggregatzustand: 'm', mittelwert: 'm',
  alltag: 'm', impuls: 'm', gesamtimpuls: 'm', energieverlust: 'm',
  spannung: 'f', energie: 'f', kraft: 'f', reibung: 'f', temperatur: 'f',
  wärme: 'f', geschwindigkeit: 'f', frequenz: 'f', brechkraft: 'f',
  sammellinse: 'f', brennweite: 'f', bildweite: 'f', gegenstandweite: 'f',
  blende: 'f', lupe: 'f',
  licht: 'n', prisma: 'n', spektrum: 'n', gleichgewicht: 'n',
  fernrohr: 'n', mikroskop: 'n', objektiv: 'n', okular: 'n',
  // Extra domain terms from user examples
  brustkorb: 'm', sauerstoff: 'm', stickstoff: 'm',
  schlüsselhabitat: 'n', habitat: 'n',
  // Geschichte
  kreuzzug: 'm', lehensvertrag: 'm', klerus: 'm', kaiser: 'm',
  burg: 'f', gilde: 'f', zunft: 'f', pest: 'f', leibeigenschaft: 'f',
  reformation: 'f', aufklärung: 'f',
  lehenswesen: 'n', rittertum: 'n', kaisertum: 'n', bürgertum: 'n',
}

/**
 * Look up or infer noun gender for domain terms.
 */
function nounGender(word: string): 'm' | 'f' | 'n' {
  const w = word.toLowerCase().replace(/\s+/g, ' ').trim()
  if (DOMAIN_NOUN_GENDER[w]) return DOMAIN_NOUN_GENDER[w]!
  // Longest-suffix match in dictionary (min 4 chars to avoid false matches)
  const sorted = Object.keys(DOMAIN_NOUN_GENDER).sort((a, b) => b.length - a.length)
  for (const suffix of sorted) {
    if (suffix.length >= 4 && w.endsWith(suffix) && w.length > suffix.length) {
      return DOMAIN_NOUN_GENDER[suffix]!
    }
  }
  // Suffix-based inference (standard German gender rules)
  if (/(ung|heit|keit|schaft|ion|tät|ik|enz|anz|ur|ase|ose)$/i.test(w) && !/(chen|lein)$/.test(w)) return 'f'
  if (/(chen|lein|ment|tum|modell|organ|system|gebiss|gewebe)$/i.test(w)) return 'n'
  // Masculine: compounds ending in masculine head nouns
  if (/(er|or|ismus|us|ling|strahl|stoff|kreis|punkt|wert|druck|strom|schatten|spiegel|schutz|sack|platz|schlaf|lauf|fluss|kreislauf|gehalt|stamm|baum|fisch|vogel|pilz|gang|schlag|ruf|zahn|arm|typ|bau|verlust|sog|korb|zug|berg|weg|impuls|einfluss|alltag|kanal|kurs|anteil|grad|sinn|plan|effekt|kegel|fall|schlag|trend|vergleich|beitrag|stammbaum|artbegriff)$/i.test(w)) return 'm'
  if (/um$/i.test(w)) return 'n'
  return 'n'
}

function pronounFor(term: string): 'Sie' | 'Er' | 'Es' {
  const t = displayGlossaryTerm(term)
  const low = t.toLowerCase()
  if (/ oder /.test(t)) return 'Sie'
  if (/^(transparent|transluzent|opak)$/i.test(low)) return 'Er'
  const g = nounGender(low)
  if (g === 'f') return 'Sie'
  if (g === 'm') return 'Er'
  return 'Es'
}

export function articleFor(term: string, case_: 'nom' | 'dat' | 'acc' = 'nom'): string {
  const g = nounGender(displayGlossaryTerm(term).toLowerCase())
  if (g === 'f') return 'die'
  if (g === 'm') return case_ === 'dat' ? 'dem' : case_ === 'acc' ? 'den' : 'der'
  return case_ === 'dat' ? 'dem' : 'das'
}


function lowerFirst(s: string): string {
  if (!s) return s
  return s.charAt(0).toLowerCase() + s.slice(1)
}

function ensurePeriod(s: string): string {
  const m = s.replace(/\s+/g, ' ').trim()
  if (!m) return m
  return /[.!?]$/.test(m) ? m : `${m}.`
}

function fixRelativeComma(s: string): string {
  return s.replace(
    /\b([A-Za-zÄÖÜäöüß]{3,})\s+(der|die|das)\s+(selbst|sich|nur|nicht|auch|dabei|völlig|teilweise)\b/gi,
    '$1, $2 $3',
  )
}

export function classifyGlossaryStyle(
  term: string,
  meaning?: string,
  _topic?: string,
): GlossaryStemStyle {
  const t = displayGlossaryTerm(term)
  const m = (meaning ?? '').replace(/\s+/g, ' ').trim()
  const low = t.toLowerCase()
  if (/^(transparent|transluzent|opak)$/i.test(low)) return 'property'
  if (PURPOSE_VERB.test(m) || /organ|gerät|mittel|hilfe|sensor|timer|schutz/i.test(t)) {
    return 'purpose'
  }
  if (EFFECT_VERB.test(m) && !/^(Ist|Sind|Bedeutet)\b/i.test(m)) return 'process'
  return 'definition'
}

/** Vague glossary/meta stems that must be rewritten. */
export function isVagueGlossaryStem(prompt: string): boolean {
  const q = stripBankSlugPrefix(prompt).replace(/\s+/g, ' ').replace(/\?+$/g, '').trim()
  if (isAllowedVerstehtStem(q + '?') || isAllowedVerstehtStem(q)) return false
  return (
    /^Was trifft auf\b/i.test(q) ||
    /^Was trifft im Thema\b/i.test(q) ||
    /^Was trifft(?: in diesem Zusammenhang)?\s*zu$/i.test(q) ||
    /fachlich\s+richtig/i.test(q) ||
    /^Welche Aussage beschreibt(?:\s+fachlich)?\b/i.test(q) ||
    /^Welche Aussage zu\s*[„""']/i.test(q) ||
    /^Welche Aussage ist(?:\s+fachlich)?\s+richtig$/i.test(q) ||
    /^(?:Fachbegriff\s*)?\([^)]+\):\s*(?:Was bedeutet|Was versteht man unter)\b/i.test(q) ||
    /^(?:[^:?]{1,80}:\s*)?Was bedeutet(?: der Fachbegriff)?\s*[„""']/i.test(q) ||
    /^Was bedeutet\s+\S+$/i.test(q) ||
    /^Was ist fachlich richtig$/i.test(q) ||
    /^Was ist (ein|eine|der|die|das)\s+\S+$/i.test(q) ||
    /^Was versteht man\b/i.test(q) ||
    /^Was bewirkt oder beschreibt\b/i.test(q) ||
    // Bare glossary wrappers „Was kennzeichnet „Term“?“ (quoted term) — not Schülerfragen.
    /^Was kennzeichnet\s*[„""']/i.test(q) ||
    /^Was kennzeichnet den Sachverhalt\b/i.test(q) ||
    /^Welche Eigenschaft kennzeichnet\b/i.test(q)
  )
}

/** Already a concrete application / role / process stem — leave alone. */
export function isConcreteGlossaryStem(prompt: string): boolean {
  const q = prompt.replace(/\s+/g, ' ').trim()
  if (isVagueGlossaryStem(q)) return false
  if (isAllowedVerstehtStem(q)) return true
  return /^(Wozu|Welche Rolle|Womit|Mit welchen|Was bewirkt|Was beschreibt|Was passiert|Berechne|Wie|Warum|Weshalb|Woran|Wofür|Welcher Zusammenhang|Welche Maßnahme|Welche Eigenschaft|Was kennzeichnet|Was ist ein typisches)\b/i.test(
    q,
  )
}

/**
 * Concrete MC stem — never adds „im Thema …“ (formulaic) and never meta glossary.
 */
export function concreteGlossaryStem(
  term: string,
  topic?: string,
  meaning?: string,
): string {
  void topic
  const t = displayGlossaryTerm(term)
  const m = (meaning ?? '').replace(/\s+/g, ' ').trim()
  if (!t) return 'Welche Beschreibung passt zu diesem Fachzusammenhang?'

  const style = classifyGlossaryStyle(t, m)
  const low = t.toLowerCase()

  if (
    low === 'quelle' &&
    /überrest|tradition|vergangenheit|geschicht/i.test(m)
  ) {
    return 'Was versteht man in der Geschichtswissenschaft unter einer Quelle?'
  }

  // Purpose terms even when meaning is a noun phrase (Atemorgan …)
  if (/^Kieme$/i.test(t) || (/\borgan\b/i.test(m) && /kieme|auge|blatt|wurzel/i.test(t))) {
    if (/^Kieme$/i.test(t)) return 'Wozu dient die Kieme bei Wassertieren?'
  }

  if (style === 'property') {
    if (low === 'transparent') return 'Welche Eigenschaft hat ein transparenter Körper?'
    if (low === 'transluzent') return 'Welche Eigenschaft hat ein transluzenter Körper?'
    if (low === 'opak') return 'Welche Eigenschaft hat ein opaker Körper?'
    return `Welche Eigenschaft hat ${t}?`
  }

  if (/^Timer\s*\/\s*Sensor$/i.test(t) || /^Timer oder Sensor/i.test(t)) {
    return 'Wozu dienen Timer oder Sensoren bei intelligenter Beleuchtung gegen Lichtverschmutzung?'
  }

  if (
    style === 'purpose' ||
    /\b(organ|gerät|mittel|hilfe)\b/i.test(m) ||
    /organ|gerät|mittel|hilfe|sensor|timer|schutz/i.test(t)
  ) {
    if (/^Kieme$/i.test(t)) return 'Wozu dient die Kieme bei Wassertieren?'
    if (/ oder /.test(t) || /\s/.test(t)) return `Wozu dienen ${t}?`
    const art = articleFor(t, 'nom')
    if (art === 'die' || (/(ung|heit|keit|schaft|ion|tät|ik|enz|anz|ur)$/i.test(low) || /e$/i.test(low))) {
      return `Wozu dient die ${t}?`
    }
    return `Wozu dient ${art} ${t}?`
  }

  if (style === 'process') {
    if (/\s/.test(t) || /[=·]/.test(t)) return `Was bewirkt „${t}“?`
    const art = articleFor(t, 'nom')
    if (art === 'die') return `Was bewirkt die ${t}?`
    return `Was bewirkt ${art} ${t}?`
  }

  // Bare participles/adjectives → concrete property/process stems (no quoted kennzeichnet).
  if (/^(angeboren|erlernt)$/i.test(t)) {
    return /^angeboren/i.test(t)
      ? 'Woran erkennt man angeborenes Verhalten?'
      : 'Woran erkennt man erlerntes Verhalten?'
  }
  if (/^(angeborenes|erlerntes)\s+verhalten$/i.test(t)) {
    return `Woran erkennt man ${t.charAt(0).toLowerCase()}${t.slice(1)}?`
  }
  if (/^(wechselwarm|poikilotherm)$/i.test(t)) {
    return 'Woran erkennt man wechselwarme Tiere?'
  }
  if (/^(gleichwarm|homoiotherm)$/i.test(t)) {
    return 'Woran erkennt man gleichwarme Tiere?'
  }
  if (/^rezessiv$/i.test(t)) {
    return 'Woran erkennt man ein rezessives Allel?'
  }
  if (/^dominant$/i.test(t)) {
    return 'Woran erkennt man ein dominantes Allel?'
  }
  if (/^innere befruchtung$/i.test(t)) {
    return 'Woran erkennt man innere Befruchtung?'
  }
  if (/^äußere befruchtung$/i.test(t)) {
    return 'Woran erkennt man äußere Befruchtung?'
  }
  if (/^aktiver transport$/i.test(t)) {
    return 'Woran erkennt man aktiven Transport?'
  }
  if (/^motorische bahn$/i.test(t)) {
    return 'Woran erkennt man die motorische Bahn?'
  }
  // Formulas / symbols
  if (/[=·²³×]|kg·|m²\/|Δ|λ|Φ|ω/.test(t) || /^E\s*=/i.test(t)) {
    return `Welche Beziehung gilt für ${t}?`
  }
  // Never emit „Es ist ein [Verb…]“ via purpose-style misclassification of verb fragments.
  if (PURPOSE_VERB.test(t) || /^(ersetzt|kommuniziert|putzen|signalisiert)$/i.test(t)) {
    return `Was bewirkt „${t}“ in diesem Zusammenhang?`
  }
  // Definition default: recognition stem — never bare „Was kennzeichnet „Term“?“
  if (/\s/.test(t) || t.length > 36) {
    return `Woran erkennt man „${t}“?`
  }
  const artAcc = articleFor(t, 'acc')
  if (artAcc === 'die') return `Woran erkennt man die ${t}?`
  if (artAcc === 'den') return `Woran erkennt man den ${t}?`
  return `Woran erkennt man das ${t}?`
}

function stripWraps(m: string): string {
  return m
    .replace(/^Darunter versteht man\s+/i, '')
    .replace(/^(Gemeint ist|Gemeint sind)\s*:?\s*/i, '')
    .replace(/^(Das ist|Das sind)\s+/i, '')
    .replace(/^(Es handelt sich um)\s+/i, '')
    .replace(/^(Sie|Er|Es)\s+steht im Kern für Folgendes:\s*/i, '')
    .replace(/^Es geht um(?: diesen Inhalt)?:\s*/i, '')
    .replace(/^(Der|Die|Das)\s+\S+(?:\s+\S+){0,6}\s+ist hier:\s*/i, '')
    .replace(/^(Der|Die|Das)\s+\S+(?:\s+\S+){0,6}\s+ist kurz gesagt:\s*/i, '')
    .replace(/^(Hier steht)\s+/i, '')
    .replace(/\s+im Mittelpunkt\.?$/i, '')
    .replace(/,\s*und zwar gilt(?: hier)?:\s*/gi, ', ')
    .replace(/\s+und zwar gilt(?: hier)?:\s*/gi, ', ')
    .replace(
      /^(Sie|Er|Es)\s+(bezeichnet|ist|sind|beschreibt|steht für|fungiert als|dient als|kennzeichnet|meint|umfasst|bildet|fasst)\s+/i,
      '',
    )
    .replace(/^(Der|Die|Das)\s+\S+\s+meint:\s*/i, '')
    .replace(/\s*—\s*so bei\b.*$/i, '')
    .trim()
    .replace(/^[.\s]+|[.\s]+$/g, '')
}

/** Capitalize German content words in an NP (keep articles/preps lower). */
function capitalizeNpWords(phrase: string): string {
  const keep = PREPS
  return phrase
    .split(/\s+/)
    .map((w, i) => {
      const bare = w.replace(/^[^a-zäöüßA-ZÄÖÜ]+|[^a-zäöüßA-ZÄÖÜ]+$/giu, '')
      if (!bare) return w
      const low = bare.toLowerCase()
      if (i > 0 && keep.has(low)) return w.replace(bare, low)
      if (/^[a-zäöü]/.test(bare)) {
        return w.replace(bare, bare.charAt(0).toUpperCase() + bare.slice(1))
      }
      return w
    })
    .join(' ')
}

/**
 * German NP casing: adjectives stay lowercase, head nouns capitalize.
 * Avoids „ein Gezieltes Wahrnehmen“ (wrong) → „ein gezieltes Wahrnehmen“.
 */
function fixAdjNounCasing(phrase: string): string {
  const words = phrase.split(/\s+/).filter(Boolean)
  if (!words.length) return phrase
  const adjLike =
    /^(?:[a-zäöü]|[A-ZÄÖÜ])[a-zäöüß]*(?:ig|lich|isch|bar|sam|haft|iv|al|ell|är|ös|en|es|er|e|em|ene|enes|ener)$/i
  return words
    .map((w, i) => {
      const bare = w.replace(/^[^a-zäöüßA-ZÄÖÜ]+|[^a-zäöüßA-ZÄÖÜ]+$/giu, '')
      if (!bare) return w
      const low = bare.toLowerCase()
      if (PREPS.has(low)) return w.replace(bare, low)
      // First token after article: adjective → lower; lone noun → upper
      if (i === 0 && words.length >= 2 && adjLike.test(bare)) {
        return w.replace(bare, low)
      }
      if (/^[a-zäöü]/.test(bare) && !adjLike.test(bare)) {
        return w.replace(bare, bare.charAt(0).toUpperCase() + bare.slice(1))
      }
      if (i > 0 && adjLike.test(bare) && /^[A-ZÄÖÜ]/.test(bare)) {
        return w.replace(bare, low)
      }
      return w
    })
    .join(' ')
}

/** Article + NP for a meaning fragment (gender from head/first noun). */
function meaningAsPredicate(body: string): string {
  const t = fixRelativeComma(body.trim())
  if (!t) return t
  if (/^(der|die|das|ein|eine|einen|einem|einer|den|dem|des)\s/i.test(t)) {
    const rest = t.replace(/^(der|die|das|ein|eine|einen|einem|einer|den|dem|des)\s+/i, '')
    const art = t.match(/^(der|die|das|ein|eine|einen|einem|einer|den|dem|des)/i)![1]!.toLowerCase()
    return `${art} ${fixAdjNounCasing(rest)}`
  }
  // Verb-led clause kept as-is (caller may attach pronoun separately).
  if (PURPOSE_VERB.test(t) || EFFECT_VERB.test(t)) return lowerFirst(t)
  const capped = fixAdjNounCasing(t)
  // Use the FIRST (head) noun's ending to determine article, not the last word.
  // "Kollision an Glasflächen" → head is "Kollision" (fem) → "eine Kollision an Glasflächen"
  // Skip article inference when first token is clearly an adjective before a noun.
  const parts = capped.split(/\s+/)
  const headWord = (
    parts.length >= 2 &&
    /(?:ig|lich|isch|bar|sam|haft|iv|al|ell|är|ös|en|es|er|e|em)$/i.test(parts[0]!)
      ? parts[1]
      : parts[0]
  )!
    .toLowerCase()
    .replace(/[^a-zäöüß]/giu, '')
  const g = nounGender(headWord || parts[0]!.toLowerCase())
  if (g === 'f') return `eine ${capped}`
  if (g === 'm') return `ein ${capped}`
  return `ein ${capped}`
}

/**
 * Natural full-sentence fallback for noun/adj fragments.
 * Never emits „ist hier:“ / „kurz gesagt:“ / „Es geht um“ / „und zwar gilt“.
 */
function naturalFragmentOption(term: string, fragment: string): string {
  let body = fragment.replace(/\s+/g, ' ').trim().replace(/[.!?]+$/g, '').trim()
  let enrich = ''
  const em = body.match(/^(.*?),\s*und zwar gilt(?: hier)?:\s*(.+)$/i)
  if (em) {
    body = em[1]!.trim()
    enrich = em[2]!.trim()
  } else {
    const em2 = body.match(/^(.*?);\s*(.+)$/)
    if (em2 && em2[1]!.split(/\s+/).length >= 2) {
      body = em2[1]!.trim()
      enrich = em2[2]!.trim()
    }
  }
  if (!body) body = fragment.replace(/\s+/g, ' ').trim().replace(/[.!?]+$/g, '').trim()
  // Strip leftover pad wrappers from bank text.
  body = body
    .replace(/^(Der|Die|Das)\s+\S+(?:\s+\S+){0,6}\s+ist hier:\s*/i, '')
    .replace(/^(Der|Die|Das)\s+\S+(?:\s+\S+){0,6}\s+ist kurz gesagt:\s*/i, '')
    .replace(/^Es geht um(?: diesen Inhalt)?:\s*/i, '')
    .replace(/,\s*und zwar gilt(?: hier)?:\s*/gi, ', ')
    // Undo prior bad wraps: „ein Kommuniziert …“ / „eine Ersetzt …“
    .replace(/^(ein|eine|einen)\s+(?=[A-ZÄÖÜ]?[a-zäöüß]*(?:iert|etzt|eugt|ildet|eistet|ignalisiert)\b)/i, '')
    .trim()

  // Already a complete pronoun sentence — return as-is (never „Es ist ein Es …“).
  if (/^(Sie|Er|Es|Man)\s+\S+/i.test(body) && hasFiniteGermanVerb(body)) {
    return ensurePeriod(body.charAt(0).toUpperCase() + body.slice(1))
  }

  const t = displayGlossaryTerm(term)
  const pron = t ? pronounFor(t) : 'Es'
  let out: string

  if (PURPOSE_VERB.test(body) || EFFECT_VERB.test(body)) {
    out = ensurePeriod(`${pron} ${lowerFirst(body)}`)
  } else if (hasFiniteGermanVerb(body)) {
    out = ensurePeriod(body.charAt(0).toUpperCase() + body.slice(1))
  } else {
    let pred = meaningAsPredicate(body)
    // Always lowercase Title-Case adjective after article (e.g. "ein Gezieltes" → "ein gezieltes")
    pred = pred.replace(
      /^(ein|eine|einen|der|die|das)\s+([A-Z\u00c4\u00d6\u00dc][a-z\u00e4\u00f6\u00fc\u00df]+)\s+/,
      (_m, pArt, adj) => `${pArt} ${adj.charAt(0).toLowerCase() + adj.slice(1)} `,
    )
    // Never „Es ist ein Ersetzt/Kommuniziert …“ — verb fragments get pronoun+verb.
    if (/^(ein|eine|einen)\s+([A-ZÄÖÜ]?[a-zäöüß]*(?:iert|etzt|eugt|ildet|eistet|ignalisiert)\b)/i.test(pred)) {
      const verbClause = pred.replace(/^(ein|eine|einen)\s+/i, '')
      out = ensurePeriod(`${pron} ${lowerFirst(verbClause)}`)
    } else {
      out = ensurePeriod(`${pron} ist ${pred}`)
    }
  }

  if (enrich) {
    const hint = enrich.replace(/[.!?]+$/g, '').trim()
    if (hint && !out.toLowerCase().includes(hint.toLowerCase().slice(0, Math.min(20, hint.length)))) {
      // Fold enrich as a plain clause — never „und zwar gilt“.
      out = ensurePeriod(`${out.replace(/[.!?]$/, '')}, ${lowerFirst(hint)}`)
    }
  }

  // Prefer „Die {Term} ist …“ over pads when the pronoun sentence is too short.
  // Prefer „Die {Term} ist …“ over pads when the pronoun sentence is too short.
  if (out.split(/\s+/).length < 6 && t) {
    const art = pronounFor(t) === 'Sie' ? 'Die' : pronounFor(t) === 'Er' ? 'Der' : 'Das'
    let pred = meaningAsPredicate(body)
    // IMPORTANT: Do NOT replace predicate's article with subject's article.
    // The predicate has its own gender (e.g. "eine Nisthilfe" stays "eine"
    // even if subject is "Der Fensteranprall"). Also lowercase Title-Case adjectives.
    pred = pred.replace(
      /^(ein|eine|einen|der|die|das)\s+([A-Z\u00c4\u00d6\u00dc][a-z\u00e4\u00f6\u00fc\u00df]+)\s+/,
      (_m, pArt, adj) => `${pArt} ${adj.charAt(0).toLowerCase() + adj.slice(1)} `,
    )
    out = ensurePeriod(`${art} ${t} ist ${pred}`)
  }
  // Strip any leaked elongator pads — never invent replacements.
  out = out.replace(/\s+der Ereignisse\.?$/i, '.')
  out = out.replace(/\s+klar und deutlich\.?$/i, '.')
  if (BANNED_OPTION.test(out)) {
    const pred = meaningAsPredicate(body)
    out = ensurePeriod(`${pron} ist ${pred}`)
  }
  return out
}

/** Mechanical glossary wrappers that must be rebuilt. */
export function isMechanicalGlossaryOption(opt: string): boolean {
  const o = opt.replace(/\s+/g, ' ').trim()
  if (!o) return false
  if (BANNED_OPTION.test(o)) return true
  if (TITLE_AFTER_IST_EINE.test(o)) return true
  if (TITLE_AFTER_BESCHREIBT_EINE.test(o) || TITLE_AFTER_BESCHREIBT_EIN.test(o)) return true
  // Ban Title-Case adjectives after articles forever (ein Gezieltes / das Künstliche).
  if (
    /\b(?:ein|eine|einen|einem|einer|das|die|der)\s+(?:Gezielte[sn]?|Genetisch(?:e[sn]?)?|Künstliche[sn]?|Angeborene[sn]?|Erlernte[sn]?)\b/.test(
      o,
    )
  ) {
    return true
  }
  // Ban verb-as-noun forever.
  if (/\b(?:Es|Sie|Er) ist ein(?:e)?\s+(?:Ersetzt|Kommuniziert|Putzen|Signalisiert|Markiert|Kopiert|Geöffnet)\b/.test(o)) {
    return true
  }
  if (/\bsteht im Kern für Folgendes\b/i.test(o)) return true
  if (/\bist hier:|\bist kurz gesagt:|\bHier gilt\b|\bEs geht um|\bund zwar gilt|\bder Ereignisse\b/i.test(o)) {
    return true
  }
  if (/\bfasst(?: den Inhalt so)? zusammen:\b/i.test(o)) return true
  if (/^(Sie|Er|Es)\s+(bezeichnet|kennzeichnet|steht für|meint)\b/i.test(o)) return true
  if (/^(Sie|Er|Es)\s+ist\s+(das|die|der|den|ein|eine|einen)\b/i.test(o)) {
    // Keep rich relative-clause answers
    if (/,\s*(mit|durch|über|für|bei|in|an|aus)\s+(dem|der|die|den|einem|einer)\b/i.test(o)) {
      return false
    }
    if (/,\s*(der|die|das)\s+\S+/i.test(o) && o.split(/\s+/).length >= 10) return false
    // Gender/casing mash like „das Körper der Selbst Licht …“ stays mechanical.
    if (
      /\b(das Körper|die Auge|den Verschwinden|der Selbst|Selbst Licht|die Weg)\b/i.test(o) ||
      /\bist\s+das\s+[A-ZÄÖÜ]\w+\s+der\s+[A-ZÄÖÜ]/i.test(o)
    ) {
      return true
    }
    // Plain „Sie ist eine …“ definition sentences (≥6 words) are allowed.
    if (
      /^(Sie|Er|Es)\s+ist\s+(ein|eine|einen|der|die|das|den)\s+[A-ZÄÖÜa-zäöü]/i.test(o) &&
      o.split(/\s+/).length >= 6
    ) {
      return false
    }
    return true
  }
  if (
    /\b(die Auge|das Abstand|den Verschwinden|Vorgang Vorgang|die Weg pro|die Stromweg)\b/i.test(o)
  ) {
    return true
  }
  return false
}

/** Weak glossary option wraps that must be rebuilt. */
export function isWeakGlossaryOption(opt: string): boolean {
  const o = opt.replace(/\s+/g, ' ').trim()
  if (!o) return true
  if (/\\u00[0-9a-f]{2}/i.test(o)) return true
  if (isMechanicalGlossaryOption(o)) return true
  if (/^Gemeint ist:?\s*/i.test(o) || /^Gemeint sind:?\s*/i.test(o)) return true
  if (/^Darunter versteht man\b/i.test(o)) return true
  if (
    o.split(/\s+/).length <= 5 &&
    !/^(Sie|Er|Es|Man|Licht|Wärme|Energie|Der|Die|Das|Ein|Eine|Es handelt|Das ist)\b/i.test(o)
  ) {
    return true
  }
  return false
}

/** Finite-verb / purpose-verb check for already-formed Schüler sentences. */
function hasFiniteGermanVerb(m: string): boolean {
  if (
    /\b(ist|sind|hat|haben|wird|werden|lässt|lassen|dient|dienen|beschreibt|bedeutet|gilt|bildet|zeigt|enthält|umfasst|sendet|wirft|regelt|steuert|misst|schützt|entzieht|verbindet|erzeugt|entsteht|geht|liegt|nimmt|speichert|transportiert|unterbricht|hemmt|pumpt|wandelt|prägt|gewährt|organisiert|fasst|trennt|leitet|nutzt|dokumentiert|ordnet|wirkt|meint|folgt|braucht|brauchen|kennzeichnet|kommuniziert|ersetzt|signalisiert|reagiert|markiert|verteidigt|erhöht|verringert|ermöglicht|verhindert|unterstützt|begrenzt|reduziert|überträgt|bewegt|reguliert)\b/i.test(
      m,
    )
  ) {
    return true
  }
  // „Es kommuniziert …“ / „Sie ersetzt …“ — verb right after pronoun
  const afterPron = m.replace(/^(Sie|Er|Es|Man)\s+/i, '').trim()
  return PURPOSE_VERB.test(afterPron) || EFFECT_VERB.test(afterPron)
}

function alreadyFullOption(m: string): boolean {
  if (isWeakGlossaryOption(m) || isMechanicalGlossaryOption(m)) return false
  if (BANNED_OPTION.test(m)) return false
  // Already a pronoun sentence with a real verb — never re-wrap (prevents
  // „Es kommuniziert …“ → „Es ist ein Kommuniziert …“).
  if (/^(Sie|Er|Es|Man)\s+\S+/i.test(m) && hasFiniteGermanVerb(m)) {
    return true
  }
  const words = m.split(/\s+/).length
  if (words < 6 || !/[.!?]$/.test(m)) return false
  if (
    !/^(Sie|Er|Es|Das|Die|Der|Man|Ein|Eine|Im|Licht|Wärme|Bei|Unter|Mit|Ohne)\b/.test(m)
  ) {
    return false
  }
  return hasFiniteGermanVerb(m)
}

/**
 * Expand a short meaning fragment into a full, comparable answer phrase.
 * Safe templates only: verb+pronoun or „Das ist …“. No stock pads, no topic tags.
 */
export function expandGlossaryAnswer(
  meaning: string,
  opts?: { term?: string; topic?: string; style?: GlossaryStemStyle },
): string {
  void opts?.topic
  void opts?.style
  let m = meaning.replace(/\s+/g, ' ').trim()
  if (!m) return m
  m = m.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))

  const term = opts?.term?.replace(/\s+/g, ' ').trim() ?? ''
  if (term) {
    const re = new RegExp(
      `^${displayGlossaryTerm(term).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:\\s*`,
      'i',
    )
    m = m.replace(re, '').trim()
  }

  if (
    isMechanicalGlossaryOption(m) ||
    isWeakGlossaryOption(m) ||
    /^Darunter versteht man\b/i.test(m) ||
    /^Gemeint ist\b|^Gemeint sind\b/i.test(m)
  ) {
    m = stripWraps(m)
  }

  if (alreadyFullOption(meaning.replace(/\s+/g, ' ').trim())) {
    return ensurePeriod(meaning.replace(/\s+/g, ' ').trim())
  }
  if (alreadyFullOption(m)) return ensurePeriod(m)

  m = fixRelativeComma(stripWraps(m) || m)
  const pron = pronounFor(term)
  const hasVerb =
    /\b(ist|sind|hat|haben|wird|werden|lässt|lassen|dient|bedeutet|gilt|bildet|zeigt|zeigen|steht|hemmt|wirft|sendet|regelt|misst|schützt|entzieht|geht|liegt|folgt|braucht|brauchen|meint|kennzeichnet|enthält|umfasst|verbindet|erzeugt|entsteht|nimmt|speichert|transportiert|macht|machen|gibt|geben|führt|führen|zählt|zählen|gehört|gehören|besteht|bestehen|nennt|nennen|löst|lösen|bewegt|laufen|läuft|fließt|bleibt|kommt|sieht|trägt|hält|findet|bringt|setzt|stellt|legt|zieht|drückt|öffnet|schließt|beginnt|endet|ändert|steigt|fällt|sinkt|wächst|lebt|atmet|kämpft|herrscht|regiert|wählt|gründet|teilt|misst|prüft|beobachtet|erklärt|versteht|lernt|hilft|schützt|baut|produziert)\b/i.test(
      m,
    )

  let out: string
  let naturalVerb = false
  if (/^(Der|Die|Das|Ein|Eine)\b/.test(m) && !hasVerb) {
    out = ensurePeriod(`Es ist ${lowerFirst(m)}`)
    naturalVerb = true
  } else if (PURPOSE_VERB.test(m) || EFFECT_VERB.test(m)) {
    out = ensurePeriod(`${pron} ${lowerFirst(m)}`)
    naturalVerb = true
  } else if (/^(Licht|Wärme|Energie|Man)\b/.test(m) || hasVerb) {
    out = ensurePeriod(m.charAt(0).toUpperCase() + m.slice(1))
    naturalVerb = true
  } else {
    // Natural definition sentence from term + meaning fragment (no Folgendes).
    out = naturalFragmentOption(term, m)
    naturalVerb = true
  }

  out = out.replace(/\b(Aussendet|Ernährt|Verbessert)\b/g, (w) => w.toLowerCase())
  // Only rebuild when the primary path did not yield a natural sentence.
  if (!naturalVerb && (out.split(/\s+/).length < 6 || BANNED_OPTION.test(out))) {
    out = naturalFragmentOption(term, stripWraps(meaning) || meaning)
  }
  if (BANNED_OPTION.test(out)) {
    const bare = ensurePeriod(fixRelativeComma(stripWraps(meaning) || meaning))
    return bare.charAt(0).toUpperCase() + bare.slice(1)
  }
  return out
}

/** Expand a distractor to the same style (parallel options). */
export function expandGlossaryDistractor(
  meaning: string,
  topic?: string,
  opts?: { term?: string; style?: GlossaryStemStyle },
): string {
  void topic
  const expanded = expandGlossaryAnswer(meaning, {
    term: opts?.term,
    style: opts?.style ?? classifyGlossaryStyle(opts?.term ?? '', meaning),
  })
  // Never append topic-tagged stock tails
  return expanded.replace(/\s*—\s*so bei\b.*$/i, '').trim()
}

/**
 * Parse glossary-style prompts and return a concrete stem when possible.
 * Returns null if the prompt should be left unchanged.
 */
export function rewriteVagueGlossaryPrompt(
  prompt: string,
  opts?: { meaning?: string },
): string | null {
  let q = stripBankSlugPrefix(prompt).replace(/\s+/g, ' ').trim()
  q = q.replace(/\?+$/g, '').trim()
  // Never nest question words - if already concrete with beschreibt/bewirkt/Woran/Wozu, leave it.
  // Quoted „Was kennzeichnet „Term“?“ is vague (see isVagueGlossaryStem) and must be rewritten.
  if (!isVagueGlossaryStem(q) && /^(Was kennzeichnet|Was beschreibt|Was bewirkt|Welche Eigenschaft|Wozu dient|Woran erkennt)/i.test(q)) {
    // Already a concrete application stem - check if it looks nested
    if (/^Was beschreibt [„"'](?:Was|Wozu|Welche)/i.test(q)) {
      // Strip outer wrapper, keep inner question
      const inner = q.match(/^Was beschreibt [„"'](.+?)["""']?\s*\??$/i)
      if (inner) {
        return inner[1].replace(/["""']$/, '').trim()
      }
    }
    return null  // Already concrete, don't rewrite
  }


  if (isAllowedVerstehtStem(q) || isAllowedVerstehtStem(`${q}?`)) {
    return 'Was versteht man in der Geschichtswissenschaft unter einer Quelle?'
  }

  if (isConcreteGlossaryStem(q) && !isVagueGlossaryStem(q)) return null

  // Glossary wrapper → concrete stem from quoted / article term
  let m = q.match(
    /^Was kennzeichnet\s*[„""']([^„""']+)[“""'](?:\s+in diesem Zusammenhang)?\s*$/i,
  )
  if (m) return concreteGlossaryStem(m[1]!.trim(), undefined, opts?.meaning)

  m = q.match(/^Welche Eigenschaft kennzeichnet\s+(.+)$/i)
  if (m) {
    const rest = m[1]!.replace(/[„""']/g, '').trim()
    return concreteGlossaryStem(rest, undefined, opts?.meaning)
  }

  m = q.match(
    /^Was trifft im Thema\s+(.+?)\s+auf\s*[„""']?([^„""']+?)[“""']?\s+zu\s*$/i,
  )
  if (m) {
    return concreteGlossaryStem(m[2]!.trim(), undefined, opts?.meaning)
  }

  m = q.match(/^Was trifft auf\s*[„""']?([^„""']+?)[“""']?\s+zu\s*$/i)
  if (m) return concreteGlossaryStem(m[1]!.trim(), undefined, opts?.meaning)

  m = q.match(/^Was trifft(?: im Thema\s+(.+?))?(?: in diesem Zusammenhang)?\s+zu\s*$/i)
  if (m) return concreteGlossaryStem('', undefined, opts?.meaning)

  m = q.match(/^Welche Aussage beschreibt(?:\s+fachlich)?\s+(.+)$/i)
  if (m) {
    const rest = m[1]!.replace(/\?+$/g, '').trim().replace(/^[„""']|[“""']$/g, '')
    return concreteGlossaryStem(rest, undefined, opts?.meaning)
  }

  m = q.match(
    /^(?:Fachbegriff\s*)?\(([^)]+)\):\s*(?:Was bedeutet(?: der Fachbegriff)?|Was versteht man unter)\s*[„""']([^„""']+)[“""']\s*$/i,
  )
  if (m) return concreteGlossaryStem(m[2]!, undefined, opts?.meaning)

  m = q.match(
    /^Welche Aussage zu\s*[„""']([^„""']+)[“""']\s*(?:\(([^)]+)\))?\s*ist(?:\s+fachlich)?\s+richtig\s*$/i,
  )
  if (m) return concreteGlossaryStem(m[1]!, undefined, opts?.meaning)

  m = q.match(
    /^(?:([^:?]{1,80}):\s*)?Was beschreibt\s*[„""']([^„""']+)[“""']\s*(?:fachlich\s+)?richtig\s*$/i,
  )
  if (m) return concreteGlossaryStem(m[2]!, undefined, opts?.meaning)

  m = q.match(
    /^(?:([^:?]{1,80}):\s*)?(?:Was bedeutet(?: der Fachbegriff)?|Was versteht man unter)\s*[„""']([^„""']+)[“""']\s*$/i,
  )
  if (m) return concreteGlossaryStem(m[2]!, undefined, opts?.meaning)

  m = q.match(
    /^Was versteht man(?: im Thema\s+(.+?))?\s+unter\s+(?:einem|einer|einem|dem|der|das|die|den)?\s*(.+)$/i,
  )
  if (m) return concreteGlossaryStem(m[2]!.trim(), undefined, opts?.meaning)

  m = q.match(/^Was bewirkt oder beschreibt\s+(.+?)(?:\s+im Thema\s+(.+))?$/i)
  if (m) return concreteGlossaryStem(m[1]!.trim(), undefined, opts?.meaning)

  if (/^Was ist fachlich richtig$/i.test(q) || /^Welche Aussage ist(?:\s+fachlich)?\s+richtig$/i.test(q)) {
    return concreteGlossaryStem('', undefined, opts?.meaning)
  }

  m = q.match(/^Was bedeutet\s+(.+)$/i)
  if (m) {
    const topic = m[1]!.replace(/\s+qualitativ$/i, '').trim()
    if (topic.split(/\s+/).length >= 4 || /qualitativ|quantitativ|bei |wenn |ohne |mit /i.test(m[1]!)) {
      return null
    }
    return concreteGlossaryStem(topic, undefined, opts?.meaning)
  }

  m = q.match(/^Was ist (ein|eine|der|die|das)\s+(.+)$/i)
  if (m) return concreteGlossaryStem(m[2]!.trim(), undefined, opts?.meaning)

  return null
}

/** @deprecated kept for call-site compat — identity capitalize helper */
export function capitalizeGermanPhrase(text: string): string {
  const parts = text.replace(/\s+/g, ' ').trim().split(' ')
  return parts
    .map((w, i) => {
      const bare = w.replace(/^[^a-zäöüßA-ZÄÖÜ]+|[^a-zäöüßA-ZÄÖÜ]+$/giu, '')
      if (!bare) return w
      const low = bare.toLowerCase()
      if (i > 0 && PREPS.has(low)) {
        return w.replace(bare, low)
      }
      if (/^[a-zäöü]/.test(bare) && i === 0) {
        return w.replace(bare, bare.charAt(0).toUpperCase() + bare.slice(1))
      }
      return w
    })
    .join(' ')
}
