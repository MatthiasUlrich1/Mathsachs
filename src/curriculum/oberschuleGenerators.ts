import { bundledCurricula } from './bundled'
import { textTask } from './taskHelpers'
import type { PackTopic } from './pack'
import type { Topic } from './types'

/** Oberschule topic id → existing Gymnasium generator topic id. */
export const OS_GENERATOR_MAP: Record<string, string> = {
  // Klasse 5 (gemeinsam)
  'os-k5-lb1-runden': 'lb1-runden-natuerlich',
  'os-k5-lb1-addition': 'lb1-addition',
  'os-k5-lb1-subtraktion': 'lb1-subtraktion',
  'os-k5-lb1-multiplikation': 'lb1-multiplikation',
  'os-k5-lb1-division': 'lb1-division-rest',
  'os-k5-lb1-potenz': 'lb1-potenzieren',
  'os-k5-lb1-gleichung': 'k7-lb2-gleichung-add',
  'os-k5-lb1-teilbarkeit': 'lb1-teilbarkeit',
  'os-k5-lb1-primzahl': 'lb1-primzahl',
  'os-k5-lb2-anteil': 'lb2-anteil-bruch',
  'os-k5-lb2-kuerzen': 'lb2-kuerzen',
  'os-k5-lb2-erweitern': 'lb2-erweitern',
  'os-k5-lb2-runden-dez': 'lb2-runden-dezimal',
  'os-k5-lb2-dez-add-sub': 'lb2-dez-add-sub',
  'os-k5-lb2-dez-mult': 'lb2-dez-mult',
  'os-k5-lb2-dez-div': 'lb2-dez-div',
  'os-k5-lb2-mittelwert': 'lb2-mittelwert',
  'os-k5-lb2-laenge': 'k5-umrechnen-laenge',
  'os-k5-lb2-masse': 'k5-umrechnen-masse',
  'os-k5-lb2-zeit': 'k5-umrechnen-zeit',
  'os-k5-lb3-winkelarten': 'lb3-winkelarten',
  'os-k5-lb3-winkel-erg': 'lb3-winkel-ergaenzung',
  'os-k5-lb3-umfang': 'lb4-umfang-rechteck',
  'os-k5-lb3-flaeche': 'lb4-flaeche-rechteck',
  'os-k5-lb3-volumen-wuerfel': 'lb4-volumen-quader',
  'os-k5-lb3-oberflaeche': 'lb4-oberflaeche-quader',
  'os-k5-lb3-flaeche-eh': 'k5-umrechnen-flaeche',
  'os-k5-lb3-volumen-eh': 'k5-umrechnen-volumen',

  // Klasse 6 (gemeinsam)
  'os-k6-lb1-kuerzen': 'lb1-kuerzen',
  'os-k6-lb1-erweitern': 'lb1-erweitern',
  'os-k6-lb1-vergleichen': 'lb1-vergleichen',
  'os-k6-lb1-bruch-dez': 'lb1-bruch-dezimal',
  'os-k6-lb1-add-sub': 'lb1-add-sub-brueche',
  'os-k6-lb1-mult': 'lb1-mult-brueche',
  'os-k6-lb1-div': 'lb1-div-brueche',
  'os-k6-lb1-dez-add-sub': 'lb1-dez-add-sub',
  'os-k6-lb1-dez-mult': 'lb1-dez-mult',
  'os-k6-lb1-dez-div': 'lb1-dez-div',
  'os-k6-lb1-runden': 'lb1-runden',
  'os-k6-lb1-mittelwert': 'lb2-mittelwert',
  'os-k6-lb2-prop': 'lb2-proportional',
  'os-k6-lb2-antiprop': 'lb2-antiproportional',
  'os-k6-lb2-anteil': 'lb5-anteil-groesse',
  'os-k6-lb3-nebenwinkel': 'k7-lb1-nebenwinkel',
  'os-k6-lb3-scheitel': 'k7-lb1-scheitelwinkel',
  'os-k6-lb3-innenwinkel': 'lb3-winkel-dreieck',
  'os-k6-lb3-winkelsumme-viereck': 'lb3-winkel-viereck',
  'os-k6-lb3-flaeche-dreieck': 'lb3-flaeche-dreieck',
  'os-k6-lb3-umfang': 'lb3-umfang-rechteck',
  'os-k6-lb3-flaeche-rechteck': 'lb3-flaeche-rechteck',
  'os-k6-lb4-volumen-quader': 'lb4-volumen-quader',
  'os-k6-lb4-oberflaeche': 'lb4-oberflaeche-quader',
  'os-k6-lb4-volumen-prisma': 'lb4-volumen-prisma',
  'os-k6-lb5-haeufigkeit': 'lb2-haeufigkeit',
  'os-k6-lb5-anteil-prozent': 'lb5-anteil-prozent',
  'os-k6-lbw3-mittelwert': 'lb2-mittelwert',
  'os-k6-lbw3-modal': 'k9-lb4-modalwert',

  // HS Klasse 7
  'os-hs-k7-lb1-flaeche': 'lb3-flaeche-rechteck',
  'os-hs-k7-lb1-volumen': 'lb4-volumen-quader',
  'os-hs-k7-lb2-anteil-bruch': 'lb2-anteil-bruch',
  'os-hs-k7-lb2-anteil-groesse': 'lb5-anteil-groesse',
  'os-hs-k7-lb2-prozent': 'lb5-anteil-prozent',
  'os-hs-k7-lb2-dreisatz': 'lb2-proportional',
  'os-hs-k7-lb2-haeufigkeit': 'k7-lb4-rel-haeufigkeit',
  'os-hs-k7-lb3-add': 'k7-lb2-add-rational',
  'os-hs-k7-lb3-sub': 'k7-lb2-sub-rational',
  'os-hs-k7-lb3-mul': 'k7-lb2-mul-rational',
  'os-hs-k7-lb3-div': 'k7-lb2-div-rational',
  'os-hs-k7-lb3-term': 'k7-lb2-term-vorrang',
  'os-hs-k7-lb3-gleichung': 'k7-lb2-gleichung-add',
  'os-hs-k7-lb4-flaeche-dreieck': 'lb3-flaeche-dreieck',
  'os-hs-k7-lb4-umfang': 'lb3-umfang-rechteck',
  'os-hs-k7-lb4-winkelsumme': 'k7-lb1-winkelsumme-vieleck',
  'os-hs-k7-lb4-volumen-prisma': 'k7-lb3-volumen-prisma',
  'os-hs-k7-lb4-mantel': 'k7-lb3-mantel-prisma',
  'os-hs-k7-lb4-oberflaeche': 'k7-lb3-oberflaeche-quader',

  // HS Klasse 8
  'os-hs-k8-lb1-prozent': 'lb5-anteil-prozent',
  'os-hs-k8-lb1-zinsen': 'k10-lb1-zinsen',
  'os-hs-k8-lb1-zinseszins': 'k10-lb1-zinseszins',
  'os-hs-k8-lb1-preisaenderung': 'k10-lb1-prozentuale-zunahme',
  'os-hs-k8-lb2-term': 'k8-lb1-term-auswerten',
  'os-hs-k8-lb2-gleichung': 'k8-lb1-gleichung-linear',
  'os-hs-k8-lb2-zusammenfassen': 'k8-lb1-zusammenfassen',
  'os-hs-k8-lb3-kreis-umfang': 'k9-lb2-kreis-umfang',
  'os-hs-k8-lb3-kreis-flaeche': 'k9-lb2-kreis-flaeche',
  'os-hs-k8-lb3-winkelsumme': 'k7-lb1-winkelsumme-vieleck',
  'os-hs-k8-lb4-zylinder': 'k9-lb2-zylinder-volumen',
  'os-hs-k8-lb5-zinsen': 'k10-lb1-zinsen',
  'os-hs-k8-lb5-streckfaktor': 'k8-lb4-streckfaktor',

  // HS Klasse 9
  'os-hs-k9-lb1-hyp': 'k9-lb3-pythagoras-hypotenuse',
  'os-hs-k9-lb1-kathete': 'k9-lb3-pythagoras-kathete',
  'os-hs-k9-lb1-sinus': 'k9-lb3-trig-wert',
  'os-hs-k9-lb1-sach': 'k9-lb5-leiter',
  'os-hs-k9-lb2-pyramide': 'k7-lb3-volumen-pyramide',
  'os-hs-k9-lb2-zylinder': 'k9-lb2-zylinder-volumen',
  'os-hs-k9-lb3-funktionswert': 'k8-lb3-funktionswert',
  'os-hs-k9-lb3-steigung': 'k8-lb3-steigung',
  'os-hs-k9-lb3-achsen': 'k8-lb3-achsenabschnitt',
  'os-hs-k9-lb3-quadrat': 'k9-lb1-quadrat-wert',
  'os-hs-k9-lb4-mittelwert': 'k9-lb4-mittelwert',
  'os-hs-k9-lbw1-median': 'k9-lb4-median',
  'os-hs-k9-lbw1-modal': 'k9-lb4-modalwert',
  'os-hs-k9-lbw1-spannweite': 'k7-lb4-spannweite',

  // RS Klasse 7
  'os-rs-k7-lb1-prozent': 'lb5-anteil-prozent',
  'os-rs-k7-lb1-dreisatz': 'lb2-proportional',
  'os-rs-k7-lb1-zinsen': 'k10-lb1-zinsen',
  'os-rs-k7-lb1-zinseszins': 'k10-lb1-zinseszins',
  'os-rs-k7-lb1-preisaenderung': 'k10-lb1-prozentuale-zunahme',
  'os-rs-k7-lb2-haeufigkeit': 'k7-lb4-rel-haeufigkeit',
  'os-rs-k7-lb2-laplace': 'k8-lb2-laplace-bruch',
  'os-rs-k7-lb2-laplace-pct': 'k8-lb2-laplace-prozent',
  'os-rs-k7-lb3-add': 'k7-lb2-add-rational',
  'os-rs-k7-lb3-sub': 'k7-lb2-sub-rational',
  'os-rs-k7-lb3-mul': 'k7-lb2-mul-rational',
  'os-rs-k7-lb3-div': 'k7-lb2-div-rational',
  'os-rs-k7-lb3-term': 'k7-lb2-term-vorrang',
  'os-rs-k7-lb3-gleichung': 'k8-lb1-gleichung-linear',
  'os-rs-k7-lb3-gleichung-beid': 'k8-lb1-gleichung-beidseitig',
  'os-rs-k7-lb3-zahlenraetsel': 'k8-lb5-zahlenraetsel',
  'os-rs-k7-lb4-flaeche-dreieck': 'lb3-flaeche-dreieck',
  'os-rs-k7-lb4-umfang': 'lb3-umfang-rechteck',
  'os-rs-k7-lb4-winkelsumme': 'k7-lb1-winkelsumme-vieleck',
  'os-rs-k7-lb4-volumen-prisma': 'k7-lb3-volumen-prisma',
  'os-rs-k7-lb4-mantel': 'k7-lb3-mantel-prisma',
  'os-rs-k7-lb4-oberflaeche': 'k7-lb3-oberflaeche-quader',

  // RS Klasse 8
  'os-rs-k8-lb1-term': 'k8-lb1-term-auswerten',
  'os-rs-k8-lb1-zusammenfassen': 'k8-lb1-zusammenfassen',
  'os-rs-k8-lb1-ausmult': 'k8-lb1-ausmultiplizieren',
  'os-rs-k8-lb1-gleichung': 'k8-lb1-gleichung-linear',
  'os-rs-k8-lb1-gleichung-beid': 'k8-lb1-gleichung-beidseitig',
  'os-rs-k8-lb2-funktionswert': 'k8-lb3-funktionswert',
  'os-rs-k8-lb2-steigung': 'k8-lb3-steigung',
  'os-rs-k8-lb2-achsen': 'k8-lb3-achsenabschnitt',
  'os-rs-k8-lb2-lgs': 'k8-lb3-lgs',
  'os-rs-k8-lb3-kreis-umfang': 'k9-lb2-kreis-umfang',
  'os-rs-k8-lb3-kreis-flaeche': 'k9-lb2-kreis-flaeche',
  'os-rs-k8-lb3-zylinder': 'k9-lb2-zylinder-volumen',
  'os-rs-k8-lb4-streckfaktor': 'k8-lb4-streckfaktor',
  'os-rs-k8-lb4-strahlensatz': 'k8-lb4-strahlensatz',
  'os-rs-k8-lb4-aehnlich': 'k8-lb4-aehnliche-seite',
  'os-rs-k8-lb5-laplace': 'k8-lb2-laplace-bruch',
  'os-rs-k8-lb5-gegen': 'k8-lb2-gegenwahrscheinlichkeit',
  'os-rs-k8-lb6-zinsen': 'k10-lb1-zinsen',
  'os-rs-k8-lb6-prozent': 'lb5-anteil-prozent',

  // RS Klasse 9
  'os-rs-k9-lb1-hyp': 'k9-lb3-pythagoras-hypotenuse',
  'os-rs-k9-lb1-kathete': 'k9-lb3-pythagoras-kathete',
  'os-rs-k9-lb1-trig': 'k9-lb3-trig-wert',
  'os-rs-k9-lb1-sach': 'k9-lb5-leiter',
  'os-rs-k9-lb2-pyramide': 'k7-lb3-volumen-pyramide',
  'os-rs-k9-lb2-zylinder': 'k9-lb2-zylinder-volumen',
  'os-rs-k9-lb2-kugel': 'k9-lb2-kugel-volumen',
  'os-rs-k9-lb3-quadrat': 'k9-lb1-quadrat-wert',
  'os-rs-k9-lb3-scheitel': 'k9-lb1-scheitel',
  'os-rs-k9-lb3-gleichung': 'k10-lb4-quadratische-gleichung',
  'os-rs-k9-lb3-potenz-prod': 'k9-lb1-potenz-produkt',
  'os-rs-k9-lb3-potenz-quot': 'k9-lb1-potenz-quotient',
  'os-rs-k9-lb4-mittelwert': 'k9-lb4-mittelwert',
  'os-rs-k9-lb4-median': 'k9-lb4-median',
  'os-rs-k9-lb4-modal': 'k9-lb4-modalwert',
  'os-rs-k9-lb4-spannweite': 'k7-lb4-spannweite',

  // RS Klasse 10
  'os-rs-k10-lb1-hyp': 'k9-lb3-pythagoras-hypotenuse',
  'os-rs-k10-lb1-trig': 'k9-lb3-trig-wert',
  'os-rs-k10-lb1-winkelsumme': 'k7-lb1-winkelsumme-vieleck',
  'os-rs-k10-lb1-flaeche-dreieck': 'lb3-flaeche-dreieck',
  'os-rs-k10-lb2-quadrat': 'k9-lb1-quadrat-wert',
  'os-rs-k10-lb2-exp': 'k10-lb1-exp-wachstum',
  'os-rs-k10-lb2-zinseszins': 'k10-lb1-zinseszins',
  'os-rs-k10-lb2-zunahme': 'k10-lb1-prozentuale-zunahme',
  'os-rs-k10-lb3-erwartung': 'k10-lb2-erwartungswert',
  'os-rs-k10-lb3-laplace': 'k8-lb2-laplace-bruch',
  'os-rs-k10-lb4-zinsen': 'k10-lb1-zinsen',
  'os-rs-k10-lb4-pyramide': 'k7-lb3-volumen-pyramide',
  'os-rs-k10-lb4-kugel': 'k9-lb2-kugel-volumen',
  'os-rs-k10-lbw3-pythagoras': 'k9-lb3-pythagoras-hypotenuse',
  'os-rs-k10-lbw3-strahlensatz': 'k8-lb4-strahlensatz',
}

let catalog: Map<string, Topic['generate']> | null = null

export async function gymGeneratorCatalog(): Promise<Map<string, Topic['generate']>> {
  if (catalog) return catalog
  const next = new Map<string, Topic['generate']>()
  for (const mod of bundledCurricula) {
    const grade = await mod.load()
    for (const area of grade.areas) {
      for (const topic of area.topics) {
        if (!next.has(topic.id)) next.set(topic.id, topic.generate)
      }
    }
  }
  catalog = next
  return next
}

export function generatorIdForTopic(topicId: string): string | undefined {
  return OS_GENERATOR_MAP[topicId]
}

export function isPlayableOfficialTopic(topicId: string): boolean {
  return Boolean(OS_GENERATOR_MAP[topicId])
}

export function outlineGenerate(title: string): Topic['generate'] {
  return () =>
    textTask({
      question: `Für „${title}“ gibt es noch keine Übungsaufgaben.`,
      accepted: ['ok', '—', '-'],
      solution: 'ok',
      explanation:
        'Dieses Thema steht im offiziellen Lehrplan, ist aber noch nicht als Aufgabengenerator hinterlegt.',
    })
}

export function topicFromPack(
  topic: PackTopic,
  generate: Topic['generate'] | undefined,
): Topic {
  const playable = Boolean(generate)
  return {
    id: topic.id,
    title: topic.title,
    hint: topic.hint,
    pointsPerTask: topic.pointsPerTask,
    keywords: topic.keywords,
    source: 'official',
    outlineOnly: playable ? undefined : true,
    generate: generate ?? outlineGenerate(topic.title),
  }
}
