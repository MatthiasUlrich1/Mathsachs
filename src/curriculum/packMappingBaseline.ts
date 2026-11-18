/**
 * Bekannte Verstöße der Pack-Mappings VOR E5 (siehe packMappingGuard.test.ts).
 * Sie stammen aus den alten 1:1-String-Maps (ST/SKS/OS_GENERATOR_MAP). E5 ersetzt diese
 * Maps durch dublettenfreie 1:n-Mappings mit klassenqualifizierten Quellen und MUSS jede
 * Liste leeren (Schlüssel dann entfernen). Der Test scheitert bei neuen Verstößen UND
 * bei Einträgen, die nicht mehr auftreten.
 */
export const KNOWN_BEFORE_E5: Record<string, readonly string[]> = {
  "roundLength": [
  ],
}
