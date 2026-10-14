/**
 * Physik — imageLabelSlots helpers for device/Aufbau topics.
 */
import type { Rng } from '../lib/rng'
import { randInt } from '../lib/rng'
import type { AnatomyAsset } from './anatomyAssets'
import {
  CIRCUIT_AMMETER_ASSET,
  CIRCUIT_VOLTMETER_ASSET,
  PINHOLE_CAMERA_ASSET,
} from './physikDiagramAssets'
import { imageLabelSlotsTask, mixedVariants } from './taskHelpers'
import type { Topic } from './types'

function labelTask(rng: Rng, asset: AnatomyAsset, question: string) {
  const useFixed = !asset.drawLeaders
  const subset = useFixed
    ? [...asset.slots]
    : [...asset.slots]
        .sort(() => rng() - 0.5)
        .slice(0, Math.min(asset.slots.length, rng() < 0.4 ? 3 : asset.slots.length))
  const distractors = [...asset.distractors]
    .sort(() => rng() - 0.5)
    .slice(0, Math.min(2, asset.distractors.length))
  const labels = [...subset.map((s) => s.label), ...distractors]
  const order = labels.map((_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = randInt(rng, 0, i)
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  const shuffled = order.map((i) => labels[i]!)
  const correctSlots = subset.map((s) => shuffled.indexOf(s.label))
  return imageLabelSlotsTask({
    question,
    imageSrc: asset.imageSrc,
    imageAlt: asset.imageAlt,
    attribution: asset.attribution,
    drawLeaders: asset.drawLeaders,
    items: shuffled.map((label) => ({ label })),
    slots: subset.map(({ id, x, y, targetX, targetY }) => ({
      id,
      x,
      y,
      targetX,
      targetY,
    })),
    correctSlots,
    solution: subset.map((s, i) => `${i + 1}:${s.label}`).join('; '),
    explanation: subset.map((s) => `${s.label}: ${s.wissen}`).join(' '),
    instruction: useFixed
      ? 'Ziehe die Bezeichnungen in die nummerierten Felder auf dem Bild.'
      : 'Ziehe die Bezeichnungen in die Felder. Die Linien zeigen auf die Bauteile.',
    fachwissen: {
      text: subset.map((s) => `${s.label} — ${s.functionDe}. ${s.wissen}`).join(' '),
      quelle: asset.fachwissenQuelle,
      url: asset.fachwissenUrl,
    },
    contentIds: useFixed
      ? [`${asset.id}:diagram`]
      : subset.map((s) => s.concept),
    dedupeKey: useFixed
      ? `imgLabel:${asset.id}:all`
      : `imgLabel:${asset.id}:${[...subset.map((s) => s.concept)].sort().join('+')}`,
    rng,
  })
}

export const phMessenBild: Topic['generate'] = mixedVariants(
  (rng) =>
    labelTask(
      rng,
      CIRCUIT_AMMETER_ASSET,
      'Beschrifte den Stromkreis mit Amperemeter. Ziehe die Begriffe in die Felder.',
    ),
  (rng) =>
    labelTask(
      rng,
      CIRCUIT_VOLTMETER_ASSET,
      'Beschrifte den Stromkreis mit Voltmeter. Ziehe die Begriffe in die Felder.',
    ),
  (rng) =>
    labelTask(
      rng,
      CIRCUIT_AMMETER_ASSET,
      'Beschrifte den Messaufbau (Stromstärke). Ziehe die Begriffe in die Felder.',
    ),
  (rng) =>
    labelTask(
      rng,
      CIRCUIT_VOLTMETER_ASSET,
      'Beschrifte den Messaufbau (Spannung). Ziehe die Begriffe in die Felder.',
    ),
)

export const phLochkameraBild: Topic['generate'] = mixedVariants(
  (rng) =>
    labelTask(
      rng,
      PINHOLE_CAMERA_ASSET,
      'Beschrifte die Lochkamera. Ziehe die Begriffe in die Felder.',
    ),
  (rng) =>
    labelTask(
      rng,
      PINHOLE_CAMERA_ASSET,
      'Ordne den Teilen der Lochkamera die Begriffe zu.',
    ),
)
