import { useEffect, useMemo, useState } from 'react'
import {
  CLASS_API_STUB_MESSAGE,
  ClassApiError,
  createChallenge,
  deleteChallenge,
  getChallenge,
  getClass,
  getGrade,
  updateChallenge,
  type ChallengeSummary,
} from '../classCode/api'
import { GradeCompetition } from './GradeCompetition'
import {
  allowedChallengeScopes,
  canManageListedChallenge,
  canOfferClassChallengeCreate,
  canOfferGradeChallengeCreate,
  challengePhase,
  challengePhaseLabel,
  challengeScopeLabel,
  challengeThreshold,
  classCodesForChallengeList,
  classGoalLine,
  createChallengePayload,
  deleteChallengeConfirm,
  gradeCodesForChallengeList,
  mergeVisibleChallenges,
  NO_ACTIVE_CHALLENGE_MESSAGE,
  prizeAudienceLine,
  updateChallengePayload,
} from '../challenge/logic'
import { findLoadedTopic, type LoadedGrade } from '../challenge/topics'
import { defaultBerlinChallengeWindow, msToBerlinLocal, parseChallengeInstant } from '../challenge/time'
import type { ChallengePrize, ChallengeScope, StoredChallenge } from '../challenge/types'
import {
  canCreateChallenge,
  canCreateGradeChallenge,
  canPracticeFromChallenge,
  type UserRole,
} from '../lib/roles'
import {
  forgetCreatedChallenge,
  getClassCodeSettings,
  getCreatedChallenges,
  getGradeCodeSettings,
  listDeviceChallenges,
  listDeviceDeletedChallengeIds,
  rememberCreatedChallenge,
  subscribeSharedStorage,
} from '../lib/storage'
import { ChallengeProtocol } from './ChallengeProtocol'
import type { Topic } from '../curriculum/types'

const PRIVACY_COPY =
  'Online speichert Mathsachs nur anonyme Challenge-Summen (Klassenname und Punkte) — keine Vornamen, keine Benutzer- oder Geräte-IDs. Der beste Schüler wird nicht online genannt; Nachweis ist das lokale Challenge-Protokoll.'

interface Props {
  user: string
  role: UserRole
  loaded: LoadedGrade[]
  onPractice: (topic: Topic, areaTitle: string, gradeTitle: string, challengeId?: string) => void
}

type Mode = 'main' | 'protocol'

function toStored(
  summary: ChallengeSummary,
  hostCode: string,
  owned = true,
): StoredChallenge {
  return {
    id: summary.id,
    scope: summary.scope,
    hostCode,
    name: summary.name,
    topicIds: summary.topicIds ?? summary.topics.map((topic) => topic.id),
    topics: summary.topics,
    start: summary.start,
    end: summary.end,
    prize: summary.prize,
    createdAt: Date.now(),
    owned,
  }
}

function berlinLocalInput(value: string): string {
  const trimmed = value.trim()
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(trimmed) && !/[zZ]|[+-]\d{2}:?\d{2}$/.test(trimmed)) {
    return trimmed.slice(0, 16)
  }
  const ms = parseChallengeInstant(trimmed)
  return Number.isFinite(ms) ? msToBerlinLocal(ms) : trimmed.slice(0, 16)
}

function listedHostCode(challenge: ChallengeSummary | StoredChallenge): string {
  return 'hostCode' in challenge ? challenge.hostCode : ''
}

function formatWindow(start: string, end: string): string {
  const opts: Intl.DateTimeFormatOptions = {
    timeZone: 'Europe/Berlin',
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  const from = Date.parse(start)
  const to = Date.parse(end)
  const startLabel = Number.isFinite(from)
    ? new Date(from).toLocaleString('de-DE', opts)
    : start
  const endLabel = Number.isFinite(to) ? new Date(to).toLocaleString('de-DE', opts) : end
  return `${startLabel} – ${endLabel} (Europe/Berlin)`
}

export function Challenge({ user, role, loaded, onPractice }: Props) {
  const [mode, setMode] = useState<Mode>('main')
  const [classSettings, setClassSettings] = useState(() => getClassCodeSettings(user))
  const [gradeSettings, setGradeSettings] = useState(() => getGradeCodeSettings(user))
  const [created, setCreated] = useState(() => getCreatedChallenges(user))
  const [remote, setRemote] = useState<ChallengeSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [protocolChallenge, setProtocolChallenge] = useState<ChallengeSummary | StoredChallenge | null>(
    null,
  )
  const [editing, setEditing] = useState<ChallengeSummary | StoredChallenge | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const refresh = () => {
      setClassSettings(getClassCodeSettings(user))
      setGradeSettings(getGradeCodeSettings(user))
      setCreated(getCreatedChallenges(user))
    }
    refresh()
    return subscribeSharedStorage(refresh)
  }, [user])

  useEffect(() => {
    let cancelled = false
    const classCodes = classCodesForChallengeList(classSettings)
    const gradeCodes = canCreateGradeChallenge(role)
      ? gradeCodesForChallengeList(gradeSettings)
      : []
    const createdIds = created.map((row) => row.id)
    if (classCodes.length === 0 && gradeCodes.length === 0 && createdIds.length === 0) {
      setRemote([])
      return
    }
    setLoading(true)
    void (async () => {
      const found: ChallengeSummary[] = []
      const seen = new Set<string>()
      const add = (row: ChallengeSummary) => {
        if (seen.has(row.id)) return
        seen.add(row.id)
        found.push(row)
      }
      for (const code of classCodes) {
        try {
          const stats = await getClass(code)
          for (const row of stats.challenges ?? (stats.challenge ? [stats.challenge] : [])) {
            add(row)
          }
        } catch {
          /* offline: local fallback below */
        }
      }
      for (const code of gradeCodes) {
        try {
          const grade = await getGrade(code)
          for (const row of grade.challenges ?? (grade.challenge ? [grade.challenge] : [])) {
            add(row)
          }
        } catch {
          /* ignore */
        }
      }
      if (canCreateChallenge(role)) {
        for (const id of createdIds) {
          if (seen.has(id)) continue
          try {
            add(await getChallenge(id))
          } catch {
            /* keep the local created copy */
          }
        }
      }
      if (!cancelled) {
        setRemote(found)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [classSettings, created, gradeSettings, role])

  const listedChallenges = useMemo(
    () =>
      mergeVisibleChallenges({
        remote,
        created,
        device: listDeviceChallenges(),
        classCodes: classCodesForChallengeList(classSettings),
        gradeCodes: gradeCodesForChallengeList(gradeSettings),
        includeCreated: canCreateChallenge(role),
        excludeIds: listDeviceDeletedChallengeIds(),
      }),
    [classSettings, created, gradeSettings, remote, role],
  )

  const running = useMemo(
    () => listedChallenges.filter((row) => challengePhase(row.start, row.end) === 'active'),
    [listedChallenges],
  )
  const upcoming = useMemo(
    () => listedChallenges.filter((row) => challengePhase(row.start, row.end) === 'upcoming'),
    [listedChallenges],
  )

  const hasClass = Boolean(classSettings.activeCode)
  const showEmpty =
    !loading &&
    listedChallenges.length === 0 &&
    (hasClass ||
      created.length > 0 ||
      role === 'schueler' ||
      role === 'eltern' ||
      role === 'klassenlehrer')

  const canCreate = canCreateChallenge(role)
  const showClassCreate = canOfferClassChallengeCreate(role, classSettings)
  const showGradeCreate = canOfferGradeChallengeCreate(role, gradeSettings)
  const showCreate = canCreate && (showClassCreate || showGradeCreate)
  const allowPractice = canPracticeFromChallenge(role)

  const persistChallenge = (summary: ChallengeSummary, hostCode: string) => {
    rememberCreatedChallenge(toStored(summary, hostCode, true))
    setCreated(getCreatedChallenges(user))
    setRemote((prev) => [summary, ...prev.filter((row) => row.id !== summary.id)])
    setError(null)
  }

  const onDeleteOwned = (challenge: ChallengeSummary | StoredChallenge) => {
    void (async () => {
      if (!canManageListedChallenge(role, challenge, created)) return
      if (!window.confirm(deleteChallengeConfirm(challenge.name))) return
      setDeletingId(challenge.id)
      forgetCreatedChallenge(challenge.id)
      setCreated(getCreatedChallenges(user))
      setRemote((prev) => prev.filter((row) => row.id !== challenge.id))
      if (editing?.id === challenge.id) setEditing(null)
      try {
        await deleteChallenge(challenge.id)
        setError(null)
      } catch (err) {
        const message =
          err instanceof ClassApiError
            ? err.kind === 'not_ready'
              ? CLASS_API_STUB_MESSAGE
              : err.message
            : CLASS_API_STUB_MESSAGE
        setError(message)
      } finally {
        setDeletingId(null)
      }
    })()
  }

  if (mode === 'protocol' && protocolChallenge) {
    return (
      <ChallengeProtocol
        user={user}
        challenge={protocolChallenge}
        onExit={() => {
          setMode('main')
          setProtocolChallenge(null)
        }}
      />
    )
  }

  return (
    <section className="card challenge-view">
      <div className="session__head">
        <div>
          <h2 className="section-title no-margin">Challenge</h2>
          <p className="muted small">
            Ausgewählte Themen, extra Challenge-Punkte — wer die meisten Punkte
            hat, gewinnt. {PRIVACY_COPY}
          </p>
        </div>
      </div>

      {error && <p className="notice notice--error">{error}</p>}

      {showCreate && (
        <ChallengeCreateForm
          role={role}
          loaded={loaded}
          classCodes={classCodesForChallengeList(classSettings)}
          gradeCodes={gradeCodesForChallengeList(gradeSettings)}
          classSettings={classSettings}
          gradeSettings={gradeSettings}
          onCreated={persistChallenge}
          onUpdated={(summary, hostCode) => {
            persistChallenge(summary, hostCode)
            setEditing(null)
          }}
          onError={setError}
          editing={editing}
          onCancelEdit={() => setEditing(null)}
        />
      )}

      {editing && !showCreate && canCreate && (
        <ChallengeCreateForm
          role={role}
          loaded={loaded}
          classCodes={classCodesForChallengeList(classSettings)}
          gradeCodes={gradeCodesForChallengeList(gradeSettings)}
          classSettings={classSettings}
          gradeSettings={gradeSettings}
          onCreated={persistChallenge}
          onUpdated={(summary, hostCode) => {
            persistChallenge(summary, hostCode)
            setEditing(null)
          }}
          onError={setError}
          editing={editing}
          onCancelEdit={() => setEditing(null)}
        />
      )}

      {canCreate && !showCreate && (
        <p className="muted small">
          Zum Anlegen einer Klassenchallenge brauchst du einen eingetragenen
          oder aktiven Klassencode
          {role === 'lehrer' ? '; eine Stufenchallenge braucht einen Stufencode.' : '.'}
        </p>
      )}

      {loading && <p className="muted">Challenge wird geladen …</p>}

      <ChallengeListGroup
        title="Laufende Challenges"
        challenges={running}
        classSettings={classSettings}
        gradeSettings={gradeSettings}
        loaded={loaded}
        allowPractice={allowPractice}
        created={created}
        role={role}
        deletingId={deletingId}
        onPractice={onPractice}
        onProtocol={(challenge) => {
          setProtocolChallenge(challenge)
          setMode('protocol')
        }}
        onEdit={(challenge) => {
          setEditing(challenge)
          setError(null)
        }}
        onDelete={onDeleteOwned}
      />

      <ChallengeListGroup
        title="Angelegte Challenges"
        challenges={upcoming}
        classSettings={classSettings}
        gradeSettings={gradeSettings}
        loaded={loaded}
        allowPractice={allowPractice}
        created={created}
        role={role}
        deletingId={deletingId}
        onPractice={onPractice}
        onProtocol={(challenge) => {
          setProtocolChallenge(challenge)
          setMode('protocol')
        }}
        onEdit={(challenge) => {
          setEditing(challenge)
          setError(null)
        }}
        onDelete={onDeleteOwned}
      />

      {showEmpty && <p className="notice">{NO_ACTIVE_CHALLENGE_MESSAGE}</p>}
    </section>
  )
}

function ChallengeCreateForm({
  role,
  loaded,
  classCodes,
  gradeCodes,
  classSettings,
  gradeSettings,
  onCreated,
  onUpdated,
  onError,
  editing,
  onCancelEdit,
}: {
  role: UserRole
  loaded: LoadedGrade[]
  classCodes: string[]
  gradeCodes: string[]
  classSettings: ReturnType<typeof getClassCodeSettings>
  gradeSettings: ReturnType<typeof getGradeCodeSettings>
  onCreated: (summary: ChallengeSummary, hostCode: string) => void
  onUpdated: (summary: ChallengeSummary, hostCode: string) => void
  onError: (message: string) => void
  editing: ChallengeSummary | StoredChallenge | null
  onCancelEdit: () => void
}) {
  const scopes = allowedChallengeScopes(role)
  const defaults = defaultBerlinChallengeWindow()
  const editingHost = editing ? listedHostCode(editing) : ''
  const [scope, setScope] = useState<ChallengeScope>(editing?.scope ?? scopes[0] ?? 'class')
  const [hostCode, setHostCode] = useState(
    () =>
      editingHost ||
      (scope === 'class'
        ? classSettings.activeCode || classCodes[0] || ''
        : gradeCodes[0] || ''),
  )
  const [name, setName] = useState(editing?.name ?? '')
  const [startLocal, setStartLocal] = useState(
    editing ? berlinLocalInput(editing.start) : defaults.startLocal,
  )
  const [endLocal, setEndLocal] = useState(
    editing ? berlinLocalInput(editing.end) : defaults.endLocal,
  )
  const [selected, setSelected] = useState<Set<string>>(
    () =>
      new Set(
        editing
          ? editing.topicIds?.length
            ? editing.topicIds
            : editing.topics.map((topic) => topic.id)
          : [],
      ),
  )
  const [prizeEnabled, setPrizeEnabled] = useState(Boolean(editing?.prize.enabled))
  const [classPrize, setClassPrize] = useState(Boolean(editing?.prize.classPrize))
  const [studentPrize, setStudentPrize] = useState(Boolean(editing?.prize.studentPrize))
  const [threshold, setThreshold] = useState(
    editing?.prize.classThreshold ? String(editing.prize.classThreshold) : '',
  )
  const [prizeText, setPrizeText] = useState(editing?.prize.text ?? '')
  const [saving, setSaving] = useState(false)
  const isEditing = Boolean(editing)

  useEffect(() => {
    if (isEditing) return
    if (scope === 'class') {
      setHostCode((current) =>
        classCodes.includes(current) ? current : classSettings.activeCode || classCodes[0] || '',
      )
    } else {
      setHostCode((current) => (gradeCodes.includes(current) ? current : gradeCodes[0] || ''))
    }
  }, [isEditing, scope, classCodes, gradeCodes, classSettings.activeCode])

  useEffect(() => {
    if (!editing) return
    setScope(editing.scope)
    setHostCode(listedHostCode(editing))
    setName(editing.name)
    setStartLocal(berlinLocalInput(editing.start))
    setEndLocal(berlinLocalInput(editing.end))
    setSelected(
      new Set(
        editing.topicIds?.length
          ? editing.topicIds
          : editing.topics.map((topic) => topic.id),
      ),
    )
    setPrizeEnabled(Boolean(editing.prize.enabled))
    setClassPrize(Boolean(editing.prize.classPrize))
    setStudentPrize(Boolean(editing.prize.studentPrize))
    setThreshold(editing.prize.classThreshold ? String(editing.prize.classThreshold) : '')
    setPrizeText(editing.prize.text ?? '')
  }, [editing])

  const hostOptions =
    scope === 'class'
      ? classCodes.map((code) => {
          const row = [...classSettings.created, ...(classSettings.known ?? [])].find(
            (item) => item.code === code,
          )
          return { code, label: row?.name ? `${row.name} (${code})` : code }
        })
      : gradeCodes.map((code) => {
          const row = [...(gradeSettings.created ?? []), ...(gradeSettings.known ?? [])].find(
            (item) => item.code === code,
          )
          return { code, label: row?.name ? `${row.name} (${code})` : code }
        })

  const toggleTopic = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const submit = async () => {
    if (!hostCode || selected.size === 0 || !name.trim()) return
    const topics = [...selected].map((id) => {
      const found = findLoadedTopic(loaded, id)
      return { id, title: found?.topic.title }
    })
    const prize: ChallengePrize = prizeEnabled
      ? {
          enabled: true,
          ...(classPrize ? { classPrize: true } : {}),
          ...(studentPrize ? { studentPrize: true } : {}),
          ...(scope === 'class' && classPrize && Number(threshold) > 0
            ? { classThreshold: Math.trunc(Number(threshold)) }
            : {}),
          ...(prizeText.trim() ? { text: prizeText.trim() } : {}),
        }
      : { enabled: false }
    setSaving(true)
    try {
      if (editing) {
        const payload = updateChallengePayload({
          name: name.trim(),
          topicIds: [...selected],
          topics,
          start: startLocal,
          end: endLocal,
          prize,
        })
        const updated = await updateChallenge(editing.id, {
          name: String(payload.name),
          topicIds: payload.topicIds as string[],
          topics,
          start: startLocal,
          end: endLocal,
          prize,
        })
        onUpdated(updated, listedHostCode(editing) || hostCode)
      } else {
        const payload = createChallengePayload({
          scope,
          classCode: scope === 'class' ? hostCode : undefined,
          gradeCode: scope === 'grade' ? hostCode : undefined,
          name: name.trim(),
          topicIds: [...selected],
          topics,
          start: startLocal,
          end: endLocal,
          prize,
        })
        const created = await createChallenge({
          scope,
          classCode: typeof payload.classCode === 'string' ? payload.classCode : undefined,
          gradeCode: typeof payload.gradeCode === 'string' ? payload.gradeCode : undefined,
          name: String(payload.name),
          topicIds: payload.topicIds as string[],
          topics: topics,
          start: startLocal,
          end: endLocal,
          prize,
        })
        onCreated(created, hostCode)
        setName('')
        setSelected(new Set())
      }
    } catch (err) {
      const message =
        err instanceof ClassApiError
          ? err.kind === 'not_ready'
            ? CLASS_API_STUB_MESSAGE
            : err.message
          : CLASS_API_STUB_MESSAGE
      onError(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      className="challenge-create"
      onSubmit={(event) => {
        event.preventDefault()
        void submit()
      }}
    >
      <h3 className="class-codes__list-title">
        {isEditing ? 'Challenge ändern' : 'Challenge anlegen'}
      </h3>
      {isEditing ? (
        <p className="muted small">
          Umfang bleibt {scope === 'grade' ? 'Stufe' : 'Klasse'}
          {hostCode ? ` (${hostCode})` : ''}. Klasse oder Stufe lassen sich
          nach dem Anlegen nicht ändern.
        </p>
      ) : (
        scopes.length > 1 && (
          <fieldset className="challenge-scope">
            <legend className="field__label">Umfang</legend>
            <label className="exam-check">
              <input
                type="radio"
                name="challenge-scope"
                checked={scope === 'class'}
                onChange={() => setScope('class')}
              />
              Klasse
            </label>
            <label className="exam-check">
              <input
                type="radio"
                name="challenge-scope"
                checked={scope === 'grade'}
                onChange={() => setScope('grade')}
              />
              Stufe
            </label>
          </fieldset>
        )
      )}
      {!isEditing && hostOptions.length > 0 && (
        <label className="field">
          <span className="field__label">
            {scope === 'class' ? 'Klassencode' : 'Stufencode'}
          </span>
          <select
            className="answer-input__field"
            value={hostCode}
            onChange={(event) => setHostCode(event.target.value)}
          >
            {hostOptions.map((row) => (
              <option key={row.code} value={row.code}>
                {row.label}
              </option>
            ))}
          </select>
        </label>
      )}
      <label className="field">
        <span className="field__label">Name</span>
        <input
          className="answer-input__field"
          type="text"
          maxLength={80}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="z. B. Woche 36"
        />
      </label>
      <div className="challenge-times">
        <label className="field">
          <span className="field__label">Start (Europe/Berlin)</span>
          <input
            className="answer-input__field"
            type="datetime-local"
            value={startLocal}
            onChange={(event) => setStartLocal(event.target.value)}
          />
        </label>
        <label className="field">
          <span className="field__label">Ende (Europe/Berlin)</span>
          <input
            className="answer-input__field"
            type="datetime-local"
            value={endLocal}
            onChange={(event) => setEndLocal(event.target.value)}
          />
        </label>
      </div>

      <div className="exam-themes">
        <div className="exam-themes__head">
          <p className="muted small">Themen der Challenge (geladene Lehrpläne)</p>
          {selected.size > 0 && (
            <button type="button" className="link" onClick={() => setSelected(new Set())}>
              Auswahl zurücksetzen ({selected.size})
            </button>
          )}
        </div>
        {loaded.length === 0 ? (
          <p className="notice notice--warn">
            Lade zuerst unter Einstellungen → Lehrpläne eine Klasse, um Themen
            zu wählen.
          </p>
        ) : (
          loaded.map(({ moduleId, grade }) => (
            <div key={moduleId} className="exam-grade">
              <h3 className="exam-grade__title">{grade.title}</h3>
              {grade.areas.map((area) => (
                <fieldset key={area.id} className="exam-area">
                  <legend className="exam-area__legend">{area.title}</legend>
                  <div className="exam-area__topics">
                    {area.topics.map((topic) => (
                      <label key={topic.id} className="exam-check">
                        <input
                          type="checkbox"
                          checked={selected.has(topic.id)}
                          onChange={() => toggleTopic(topic.id)}
                        />
                        <span>{topic.title}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
          ))
        )}
      </div>

      <fieldset className="challenge-prize">
        <legend className="field__label">Gewinnchance</legend>
        <label className="exam-check">
          <input
            type="checkbox"
            checked={prizeEnabled}
            onChange={(event) => setPrizeEnabled(event.target.checked)}
          />
          Es gibt etwas zu gewinnen
        </label>
        {prizeEnabled && (
          <>
            <label className="exam-check">
              <input
                type="checkbox"
                checked={classPrize}
                onChange={(event) => setClassPrize(event.target.checked)}
              />
              {scope === 'grade' ? 'Beste Klasse' : 'Klasse'} kann gewinnen
            </label>
            <label className="exam-check">
              <input
                type="checkbox"
                checked={studentPrize}
                onChange={(event) => setStudentPrize(event.target.checked)}
              />
              Bester Schüler kann gewinnen
            </label>
            {scope === 'class' && classPrize && (
              <label className="field">
                <span className="field__label">Punkteschwelle der Klasse (optional)</span>
                <input
                  className="answer-input__field"
                  type="number"
                  min={1}
                  step={1}
                  value={threshold}
                  onChange={(event) => setThreshold(event.target.value)}
                  placeholder="z. B. 200"
                />
              </label>
            )}
            <label className="field">
              <span className="field__label">Gewinn</span>
              <input
                className="answer-input__field"
                type="text"
                maxLength={200}
                value={prizeText}
                onChange={(event) => setPrizeText(event.target.value)}
                placeholder="z. B. Film schauen"
              />
            </label>
            {studentPrize && (
              <p className="muted small">
                Der beste Schüler wird nicht online genannt. Vergleich über das
                gedruckte Challenge-Protokoll.
              </p>
            )}
          </>
        )}
      </fieldset>

      <div className="challenge-manage">
        <button
          type="submit"
          className="primary"
          disabled={saving || !name.trim() || selected.size === 0 || !hostCode}
        >
          {saving
            ? isEditing
              ? 'Wird gespeichert …'
              : 'Wird angelegt …'
            : isEditing
              ? 'Änderungen speichern'
              : 'Challenge starten'}
        </button>
        {isEditing && (
          <button type="button" className="link" onClick={onCancelEdit} disabled={saving}>
            Abbrechen
          </button>
        )}
      </div>
    </form>
  )
}

function hostDisplayName(
  challenge: ChallengeSummary | StoredChallenge,
  classSettings: ReturnType<typeof getClassCodeSettings>,
  gradeSettings: ReturnType<typeof getGradeCodeSettings>,
): string {
  const kind = challengeScopeLabel(challenge.scope)
  const host = 'hostCode' in challenge ? challenge.hostCode : ''
  const remoteName = 'className' in challenge ? challenge.className : undefined
  if (remoteName?.trim()) return `${kind} ${remoteName.trim()}`
  if (!host) return kind
  const rows =
    challenge.scope === 'grade'
      ? [...(gradeSettings.created ?? []), ...(gradeSettings.known ?? [])]
      : [...classSettings.created, ...(classSettings.known ?? [])]
  const row = rows.find((item) => item.code === host)
  return row?.name ? `${kind} ${row.name}` : kind
}

export function ChallengePrizeInfo({
  prize,
  scope,
  classThreshold,
}: {
  prize: ChallengePrize
  scope: ChallengeScope
  classThreshold?: number
}) {
  const audience = prizeAudienceLine(prize, scope)
  const goal = classGoalLine(challengeThreshold({ prize, classThreshold }))
  if (!prize.enabled && !goal) return null
  return (
    <div className="challenge-prize-info">
      {prize.enabled && prize.text ? (
        <p>
          Gewinn: <strong>{prize.text}</strong>
        </p>
      ) : null}
      {audience ? (
        <p>
          Wer gewinnen kann: <strong>{audience.replace(/^Wer gewinnen kann: /, '')}</strong>
        </p>
      ) : null}
      {goal ? (
        <p className="challenge-class-goal">
          <strong>{goal}</strong>
        </p>
      ) : null}
    </div>
  )
}

function ChallengeListGroup({
  title,
  challenges,
  classSettings,
  gradeSettings,
  loaded,
  allowPractice,
  created,
  role,
  deletingId,
  onPractice,
  onProtocol,
  onEdit,
  onDelete,
}: {
  title: string
  challenges: Array<ChallengeSummary | StoredChallenge>
  classSettings: ReturnType<typeof getClassCodeSettings>
  gradeSettings: ReturnType<typeof getGradeCodeSettings>
  loaded: LoadedGrade[]
  allowPractice: boolean
  created: StoredChallenge[]
  role: UserRole
  deletingId: string | null
  onPractice: (topic: Topic, areaTitle: string, gradeTitle: string, challengeId?: string) => void
  onProtocol: (challenge: ChallengeSummary | StoredChallenge) => void
  onEdit: (challenge: ChallengeSummary | StoredChallenge) => void
  onDelete: (challenge: ChallengeSummary | StoredChallenge) => void
}) {
  if (challenges.length === 0) return null
  return (
    <div className="challenge-list-group">
      <h3 className="class-codes__list-title">{title}</h3>
      {challenges.map((challenge) => (
        <ActiveChallenge
          key={challenge.id}
          challenge={challenge}
          hostLabel={hostDisplayName(challenge, classSettings, gradeSettings)}
          loaded={loaded}
          allowPractice={allowPractice}
          canManage={canManageListedChallenge(role, challenge, created)}
          deleting={deletingId === challenge.id}
          onPractice={onPractice}
          onProtocol={() => onProtocol(challenge)}
          onEdit={() => onEdit(challenge)}
          onDelete={() => onDelete(challenge)}
        />
      ))}
    </div>
  )
}

function ActiveChallenge({
  challenge,
  hostLabel,
  loaded,
  allowPractice,
  canManage,
  deleting,
  onPractice,
  onProtocol,
  onEdit,
  onDelete,
}: {
  challenge: ChallengeSummary | StoredChallenge
  hostLabel: string
  loaded: LoadedGrade[]
  allowPractice: boolean
  canManage: boolean
  deleting: boolean
  onPractice: (topic: Topic, areaTitle: string, gradeTitle: string, challengeId?: string) => void
  onProtocol: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const topics = 'topics' in challenge ? challenge.topics : []
  const prize = challenge.prize
  const summary = 'points' in challenge ? challenge : null
  const classes = 'classes' in challenge ? challenge.classes : undefined
  const className = 'className' in challenge ? challenge.className : undefined
  const threshold = challengeThreshold(challenge)
  const reached =
    'reachedThreshold' in challenge ? challenge.reachedThreshold : undefined
  const phase = challengePhase(challenge.start, challenge.end)

  return (
    <article className="challenge-active">
      <p className="challenge-meta muted small">
        <span className="challenge-phase">{challengePhaseLabel(phase)}</span>
        {' · '}
        {hostLabel}
      </p>
      <h3 className="class-codes__list-title">{challenge.name}</h3>
      <p className="muted small">{formatWindow(challenge.start, challenge.end)}</p>
      <ChallengePrizeInfo
        prize={prize}
        scope={challenge.scope}
        classThreshold={threshold}
      />
      {summary?.points && challenge.scope === 'class' && (
        <p className="muted small">
          Klasse{className ? ` ${className}` : ''}: {summary.points.total} Challenge-Punkte
          {typeof threshold === 'number' && reached ? ' (Klassenziel erreicht)' : ''}
        </p>
      )}
      {classes && classes.length > 0 && (
        <GradeCompetition
          title="Challenge-Stand"
          grade={{
            name: challenge.name,
            classes: classes.map((row) => ({
              id: row.id,
              name: row.name,
              points: row.points,
            })),
            points: summary?.points ?? {
              today: 0,
              week: 0,
              month: 0,
              year: 0,
              total: classes.reduce((sum, row) => sum + row.points.total, 0),
            },
          }}
        />
      )}
      <ul className="topics">
        {topics.map((ref) => {
          const found = findLoadedTopic(loaded, ref.id)
          return (
            <li key={ref.id} className="topic">
              <span className="topic__title">
                {found?.topic.title ?? ref.title ?? ref.id}
              </span>
              {allowPractice && found && (
                <span className="topic__actions">
                  <button
                    type="button"
                    className="chip-btn chip-btn--primary"
                    onClick={() => {
                      const host =
                        'hostCode' in challenge && challenge.hostCode
                          ? challenge.hostCode
                          : ''
                      if (host) {
                        rememberCreatedChallenge(
                          'hostCode' in challenge
                            ? { ...(challenge as StoredChallenge), owned: false }
                            : toStored(challenge as ChallengeSummary, host, false),
                        )
                      }
                      onPractice(found.topic, found.areaTitle, found.gradeTitle, challenge.id)
                    }}
                  >
                    Üben
                  </button>
                </span>
              )}
            </li>
          )
        })}
      </ul>
      {canManage && (
        <div className="challenge-manage">
          <button type="button" className="link" onClick={onEdit} disabled={deleting}>
            Ändern
          </button>
          <button type="button" className="link" onClick={onDelete} disabled={deleting}>
            {deleting ? 'Lösche …' : 'Löschen'}
          </button>
        </div>
      )}
      <button type="button" className="primary" onClick={onProtocol}>
        Challenge-Protokoll
      </button>
    </article>
  )
}
