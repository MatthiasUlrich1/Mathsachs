import type { UserInput } from '../curriculum/types'
import {
  TREE_CHIP_FONT_PX,
  TREE_CHIP_H_PX,
  TREE_CHIP_W_PCT,
  TREE_INPUT_H_PX,
  TREE_INPUT_W_PX,
  TREE_MIN_WIDTH_PX,
  treeDisplayValue,
  treeLayout,
  treePathLabel,
  type TreeLevel,
} from '../lib/treeDiagramLogic'
import './TreeDiagram.css'

type TreeValue = Extract<UserInput, { kind: 'treeDiagram' }>

export interface TreeDiagramProps {
  levels: TreeLevel[]
  /** Shown branch values (edge id -> text). Blank branches are not listed. */
  given: Record<string, string>
  blankBranches: string[]
  blankLeaves: string[]
  rootLabel?: string
  value: TreeValue
  onChange: (value: UserInput) => void
  instruction?: string
  disabled?: boolean
}

/**
 * Tree diagram with typed fields. The tree is plain HTML positioned in percent (x) and px (y) over an SVG that only draws
 * the lines: HTML keeps the 44 px fields and the text crisp at every width, a scaled SVG would shrink them on a phone.
 * Fields are controlled and never move focus; the component has no state of its own.
 */
export function TreeDiagram({ levels, given, blankBranches, blankLeaves, rootLabel, value, onChange, instruction, disabled }: TreeDiagramProps) {
  const lay = treeLayout(levels)
  const branches = value.branches ?? {}
  const leaves = value.leaves ?? {}
  const setBranch = (id: string, text: string) => onChange({ kind: 'treeDiagram', branches: { ...branches, [id]: text }, leaves })
  const setLeaf = (id: string, text: string) => onChange({ kind: 'treeDiagram', branches, leaves: { ...leaves, [id]: text } })
  const at = (xPct: number, y: number, w: number, h: number) => ({
    left: `${xPct}%`,
    top: y,
    width: w,
    height: h,
    transform: 'translate(-50%, -50%)',
  })
  return (
    <div className="tree-diagram">
      {instruction && <p className="tree-diagram__instruction">{instruction}</p>}
      <div className="tree-diagram__scroll">
        <div
          className="tree-diagram__canvas"
          data-testid="tree-canvas"
          role="group"
          aria-label="Baumdiagramm"
          style={{ height: lay.height, minWidth: TREE_MIN_WIDTH_PX - 24 }}
        >
          <svg className="tree-diagram__lines" viewBox={`0 0 100 ${lay.height}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
            {lay.edges.map((e) => (
              <line key={e.id} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} vectorEffect="non-scaling-stroke" />
            ))}
          </svg>
          <span className="tree-diagram__root" style={{ left: `${lay.root.x}%`, top: lay.root.y }}>
            {rootLabel && <span className="tree-diagram__root-label">{rootLabel}</span>}
          </span>
          {lay.nodes.map((n) => (
            <span
              key={`${n.level}:${n.id}`}
              className="tree-diagram__chip"
              data-testid={`tree-chip-${n.id}`}
              style={{ ...at(n.x, n.y, 0, TREE_CHIP_H_PX), width: `${TREE_CHIP_W_PCT}%`, fontSize: TREE_CHIP_FONT_PX }}
            >
              {n.label}
            </span>
          ))}
          {lay.edges.map((e) => {
            const blank = blankBranches.includes(e.id)
            const style = at(e.fx, e.fy, TREE_INPUT_W_PX, TREE_INPUT_H_PX)
            return blank ? (
              <input
                key={`b${e.id}`}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                className="tree-diagram__input"
                data-testid={`tree-branch-${e.id}`}
                aria-label={`Wahrscheinlichkeit des Zweigs ${treePathLabel(levels, e.id)}`}
                style={style}
                value={branches[e.id] ?? ''}
                disabled={disabled}
                onChange={(ev) => setBranch(e.id, ev.target.value)}
              />
            ) : (
              <span key={`b${e.id}`} className="tree-diagram__given" data-testid={`tree-given-${e.id}`} style={style}>
                {treeDisplayValue(given[e.id] ?? '')}
              </span>
            )
          })}
          {lay.leafFields.map((f) =>
            blankLeaves.includes(f.id) ? (
              <input
                key={`l${f.id}`}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                className="tree-diagram__input tree-diagram__input--leaf"
                data-testid={`tree-leaf-${f.id}`}
                aria-label={`Wahrscheinlichkeit des Pfads ${treePathLabel(levels, f.id)}`}
                style={at(f.x, f.y, TREE_INPUT_W_PX, TREE_INPUT_H_PX)}
                value={leaves[f.id] ?? ''}
                disabled={disabled}
                onChange={(ev) => setLeaf(f.id, ev.target.value)}
              />
            ) : null,
          )}
        </div>
      </div>
    </div>
  )
}
