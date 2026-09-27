/**
 * Geschichte K6 LB2 + LB3 densification (Sachsen Gym, lplanid=65).
 * Original German; Lehrplan-aligned; released:false topics.
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

const sort = (
  concept: string,
  question: string,
  labels: string[],
  explanation: string,
  wissen: string,
) => ({ concept, question, labels, explanation, wissen })

const causeEffect = (cause: string, effect: string, wissen: string) => ({ cause, effect, wissen })

const source = (
  concept: string,
  question: string,
  sourceText: string,
  sourceLabel: string,
  correct: string,
  wrong: [string, string, string],
  explanation: string,
  wissen: string,
) => ({ concept, question, sourceText, sourceLabel, correct, wrong, explanation, wissen })

const k6Lb2Frankenreich: BioBank = {
  quelle: "Wikipedia: Frankenreich",
  url: "https://de.wikipedia.org/wiki/Frankenreich",
  conceptPrefix: "ge:k6:frankenreich",
  facts: [
    fact("voelkerwanderung", "Was meint die Völkerwanderung grob?", "Großräumige Wanderungsbewegungen spätantiker Völker in Europa", ["Nur moderne Urlaubsreisen", "Nur der Bau der Pyramiden", "Nur die Industrielle Revolution"], "Viele Gruppen suchten neues Land und Sicherheit.", "Viele Gruppen suchten neues Land und Sicherheit. Viele Gruppen suchten neues Land und Sicherheit gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Die ___ veränderte die politische Landkarte Europas.", ["Völkerwanderung"]),
    fact("franken", "Wer waren die Franken?", "Ein germanisches Volk, das ein großes Reich in West- und Mitteleuropa aufbaute", ["Nur ägyptische Pharaonen", "Nur attische Demokraten", "Nur moderne Parteimitglieder"], "Die Franken wurden zu einer prägenden Macht.", "Die Franken wurden zu einer prägenden Macht. Die Franken wurden zu einer prägenden Macht gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Die ___ bauten ein großes Reich in Europa auf.", ["Franken"]),
    fact("karl", "Wofür ist Karl der Große besonders bekannt?", "Für die Blüte und Organisation des Frankenreichs sowie die Kaiserkrönung", ["Für die Erfindung des Smartphones", "Für die Gründung des Völkerbunds", "Für den Bau der ersten Eisenbahn"], "Er einte große Gebiete und förderte Kirche und Bildung.", "Er einte große Gebiete und förderte Kirche und Bildung. Er einte große Gebiete und förderte Kirche und Bildung gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Karl der Große prägte die Blüte des ___.", ["Frankenreichs","Frankenreich"]),
    fact("kaiser", "Wann wurde Karl der Große zum Kaiser gekrönt?", "Im Jahr 800 in Rom", ["1492 in Amerika", "1789 in Paris", "1918 in Berlin"], "Die Kaiserwürde verband Herrschaft und christliche Legitimation.", "Die Kaiserwürde verband Herrschaft und christliche Legitimation. Die Kaiserwürde verband Herrschaft und christliche Legitimation gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Karl wurde ___ zum Kaiser gekrönt.", ["800"]),
    fact("verwaltung", "Wie sicherte Karl Herrschaft über weite Gebiete?", "Durch Grafen, Missi dominici und schriftliche Kapitularien", ["Nur durch moderne Parlamente", "Nur durch Fabriken", "Nur durch olympische Spiele"], "Königsboten kontrollierten die Grafschaften.", "Königsboten kontrollierten die Grafschaften. Königsboten kontrollierten die Grafschaften gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Karl nutzte Grafen und ___ zur Kontrolle.", ["Missi","Königsboten","Kapitularien"]),
    fact("bildung", "Was förderte die karolingische Renaissance?", "Bildung, Schriftkultur und kirchliche Reform", ["Nur Ablehnung jeder Schule", "Nur industrielle Massenproduktion", "Nur römische Gladiatorenkämpfe"], "Kloster- und Hofschulen gewannen an Bedeutung.", "Kloster- und Hofschulen gewannen an Bedeutung. Kloster- und Hofschulen gewannen an Bedeutung gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Die karolingische Renaissance förderte ___ und Schriftkultur.", ["Bildung"]),
    fact("mission", "Welche Rolle spielte Mission im Frankenreich?", "Sie verband Herrschaftsausbau mit christlicher Bekehrung", ["Sie war völlig irrelevant", "Sie ersetzte jede Landwirtschaft", "Sie galt nur für Olympia"], "Missionare und Herrscher wirkten oft zusammen.", "Missionare und Herrscher wirkten oft zusammen. Missionare und Herrscher wirkten oft zusammen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Mission verband Herrschaft und christliche ___.", ["Bekehrung","Ausbreitung"]),
    fact("erbe", "Warum ist das Frankenreich lehrplanrelevant?", "Weil aus ihm mittelalterliche Reichsstrukturen Europas hervorgingen", ["Weil es nur Asien betraf", "Weil es nie existierte", "Weil es nur die Steinzeit erklärt"], "Nachfolgerreiche und das spätere Kaisertum knüpften daran an.", "Nachfolgerreiche und das spätere Kaisertum knüpften daran an. Nachfolgerreiche und das spätere Kaisertum knüpften daran an gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Aus dem Frankenreich gingen mittelalterliche ___ hervor.", ["Reichsstrukturen","Staaten"]),
    fact("aachen", "Warum war Aachen wichtig?", "Als bevorzugte Residenz und Zentrum karolingischer Herrschaft", ["Als Hauptstadt des alten Ägypten", "Als Sitz der NATO", "Als Ort der Französischen Revolution"], "Karl hielt dort Hof und förderte Kultur.", "Karl hielt dort Hof und förderte Kultur. Karl hielt dort Hof und förderte Kultur gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Aachen war eine zentrale ___ Karls.", ["Residenz"]),
    fact("einheit", "Was kennzeichnete die Blüte unter Karl?", "Weite Herrschaft, kirchliche Ordnung und kultureller Aufschwung", ["Sofortige moderne Demokratie", "Abschaffung jeder Kirche", "Nur industrielle Fabriken"], "Macht, Kirche und Bildung wirkten zusammen.", "Macht, Kirche und Bildung wirkten zusammen. Macht, Kirche und Bildung wirkten zusammen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Unter Karl erlebte das Frankenreich eine ___.", ["Blüte"])
  ],
  pairs: [
    pair("p1", "Karl der Große", "Frankenkönig und Kaiser ab 800", "Prägte Reichsordnung und Kirche."),
    pair("p2", "Völkerwanderung", "Spätantike Wanderungsbewegungen", "Veränderte Europas Landkarte."),
    pair("p3", "Missi dominici", "Königsboten zur Kontrolle", "Sicherten Herrschaft vor Ort."),
    pair("p4", "Aachen", "Wichtige Residenz Karls", "Zentrum von Hof und Bildung.")
  ],
  trueFalse: [
    tf("t1", "Karl der Große wurde im Jahr 800 in Rom zum Kaiser gekrönt.", true, "Die Kaiserkrönung verband weltliche Macht und christliche Legitimation.", "Die Kaiserkrönung verband weltliche Macht und christliche Legitimation. Sie markiert einen Höhepunkt des Frankenreichs. Das Ereignis prägte das mittelalterliche Kaisertum."),
    tf("t2", "Das Frankenreich hatte keinerlei Bedeutung für spätere europäische Staaten.", false, "Aus dem Frankenreich gingen wichtige Reichsstrukturen hervor.", "Aus dem Frankenreich gingen wichtige Reichsstrukturen hervor. Nachfolgestaaten knüpften daran an. Genau deshalb steht es im Lehrplan.")
  ],
  sorts: [
    sort("zeit", "Ordne chronologisch: Völkerwanderung → Frankenreich-Blüte → Kaiserkrönung Karls", ["Völkerwanderung (spätantik)","Blüte des Frankenreichs unter Karl","Kaiserkrönung Karls 800"], "Zuerst Wanderungsbewegungen, dann karolingische Machtentfaltung, schließlich die Kaiserwürde.", "Zuerst Wanderungsbewegungen, dann karolingische Machtentfaltung, schließlich die Kaiserwürde. Zuerst Wanderungsbewegungen, dann karolingische Machtentfaltung, schließlich die Kaiserwürde gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.")
  ],
  causeEffects: [
    causeEffect("Herrschaft über weite Gebiete", "Grafen und Königsboten zur Kontrolle nötig", "Herrschaft über weite Gebiete führt zu: Grafen und Königsboten zur Kontrolle nötig. Herrschaft über weite Gebiete führt zu: Grafen und Königsboten zur Kontrolle nötig gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Kaiserkrönung 800", "Christliche Legitimation königlicher Macht", "Kaiserkrönung 800 führt zu: Christliche Legitimation königlicher Macht. Kaiserkrönung 800 führt zu: Christliche Legitimation königlicher Macht gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Förderung von Schulen und Schrift", "Karolingische Renaissance", "Förderung von Schulen und Schrift führt zu: Karolingische Renaissance. Förderung von Schulen und Schrift führt zu: Karolingische Renaissance gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.")
  ],
  sources: [
    source("src1", "Was betont die Quelle vor allem?", "„Der König sandte Vertrauensleute in die Grafschaften, damit Recht und Treue gewahrt bleiben.“", "Schulbuchnahe Darstellung (karolingische Verwaltung)", "Kontrolle der Herrschaft durch Königsboten", ["Abschaffung jeder Verwaltung", "Nur moderne Wahlkämpfe", "Bau von Fabriken"] as [string, string, string], "Missi dominici sicherten königliche Aufsicht.", "Missi dominici sicherten königliche Aufsicht. Missi dominici sicherten königliche Aufsicht gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.")
  ],
}

const k6Lb2Reichsbildung: BioBank = {
  quelle: "Wikipedia: Vertrag von Verdun",
  url: "https://de.wikipedia.org/wiki/Vertrag_von_Verdun",
  conceptPrefix: "ge:k6:reichsbildung",
  facts: [
    fact("teilung", "Was geschah nach Karls Tod langfristig mit dem Frankenreich?", "Es wurde unter Erben geteilt und zerfiel in Nachfolgereiche", ["Es blieb ewig ungeteilt", "Es wurde sofort die EU", "Es verschwand spurlos ohne Wirkung"], "Erbteilung war im Frankenreich üblich.", "Erbteilung war im Frankenreich üblich. Erbteilung war im Frankenreich üblich gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Das Frankenreich wurde unter Erben ___.", ["geteilt","zersplittert"]),
    fact("verdun", "Wofür steht der Vertrag von Verdun (843)?", "Für eine bedeutende Reichsteilung unter Karls Enkeln", ["Für die Erfindung des Buchdrucks", "Für die Französische Revolution", "Für die Gründung Roms"], "Drei Teile entstanden und prägten spätere Grenzen.", "Drei Teile entstanden und prägten spätere Grenzen. Drei Teile entstanden und prägten spätere Grenzen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Der Vertrag von ___ teilte das Frankenreich.", ["Verdun"]),
    fact("west", "Welcher Nachfolgeraum lag im Westen?", "Ein westfränkischer Bereich, aus dem später Frankreich erwuchs", ["Nur Australien", "Nur das antike Ägypten", "Nur die USA"], "Westfranken wurde Grundlage späterer französischer Herrschaft.", "Westfranken wurde Grundlage späterer französischer Herrschaft. Westfranken wurde Grundlage späterer französischer Herrschaft gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Im Westen entstand ein ___ Nachfolgereich.", ["westfränkisches","französisches"]),
    fact("ost", "Welcher Nachfolgeraum lag im Osten?", "Ein ostfränkischer Bereich, Vorläufer späterer deutscher Herrschaft", ["Nur Südamerika", "Nur das Pharaonenreich", "Nur Sparta"], "Ostfranken wurde wichtig für das spätere Reich.", "Ostfranken wurde wichtig für das spätere Reich. Ostfranken wurde wichtig für das spätere Reich gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Im Osten entstand ein ___ Nachfolgereich.", ["ostfränkisches","deutsches"]),
    fact("mitte", "Was wurde aus dem mittleren Teil?", "Ein umkämpftes Mittelreich, das rasch zerfiel", ["Ein ewiger Weltstaat", "Nur eine moderne Industriezone", "Nur ein olympisches Stadion"], "Das Mittelreich war schwer zu halten.", "Das Mittelreich war schwer zu halten. Das Mittelreich war schwer zu halten gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Das Mittelreich ___ rasch.", ["zerfiel","zerbrach"]),
    fact("staaten", "Was meint Staatenbildung auf dem Boden des Frankenreichs?", "Dass aus der Teilung dauerhafte Herrschaftsräume Europas entstanden", ["Dass Europa ohne Staaten blieb", "Dass nur Nomaden lebten", "Dass nur Pharaonen regierten"], "Teilung und lokale Macht schufen neue politische Einheiten.", "Teilung und lokale Macht schufen neue politische Einheiten. Teilung und lokale Macht schufen neue politische Einheiten gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Aus der Teilung entstanden dauerhafte ___.", ["Herrschaftsräume","Staaten"]),
    fact("karte", "Warum sind Geschichtskarten hier besonders wichtig?", "Weil Teilungen und Grenzverschiebungen räumlich sichtbar werden", ["Weil Karten nutzlos sind", "Weil nur Filme zählen", "Weil Zahlen verboten sind"], "Lehrplan fordert Kartenkompetenz.", "Lehrplan fordert Kartenkompetenz. Lehrplan fordert Kartenkompetenz gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Karten machen ___ und Grenzen sichtbar.", ["Teilungen","Reichsteilungen"]),
    fact("kontinuitaet", "Was blieb trotz Teilung oft erhalten?", "Christliche Ordnung, adlige Herrschaft und lateinische Schriftkultur", ["Sofortige Industriegesellschaft", "Abschaffung jeder Religion", "Nur Smartphone-Netze"], "Kulturelle Kontinuität überdauerte politische Brüche.", "Kulturelle Kontinuität überdauerte politische Brüche. Kulturelle Kontinuität überdauerte politische Brüche gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Trotz Teilung blieb christliche ___ erhalten.", ["Ordnung","Kultur"]),
    fact("konflikt", "Welche Folge hatten Erbteilungen oft?", "Konflikte um Grenzen, Erbansprüche und Vorherrschaft", ["Ewigen Weltfrieden ohne Streit", "Sofortige Demokratie überall", "Ende jeder Herrschaft"], "Teilungen erzeugten Rivalität unter Herrschern.", "Teilungen erzeugten Rivalität unter Herrschern. Teilungen erzeugten Rivalität unter Herrschern gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Erbteilungen führten oft zu ___.", ["Konflikten","Streit"]),
    fact("lehrplan", "Warum steht Reichsbildung im Lehrplan?", "Weil sie die Entstehung mittelalterlicher Reichsstruktur erklärt", ["Weil sie nur die Steinzeit betrifft", "Weil Staaten uninteressant sind", "Weil Karten verboten sind"], "Frankenreich → Teilung → Nachfolgestaaten ist Kernstoff.", "Frankenreich → Teilung → Nachfolgestaaten ist Kernstoff. Frankenreich → Teilung → Nachfolgestaaten ist Kernstoff gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Reichsbildung erklärt mittelalterliche ___.", ["Reichsstruktur","Staatenbildung"])
  ],
  pairs: [
    pair("p1", "Verdun 843", "Bedeutende Reichsteilung", "Drei Teile unter Karls Enkeln."),
    pair("p2", "Westfranken", "Vorläufer Frankreichs", "Westlicher Nachfolgeraum."),
    pair("p3", "Ostfranken", "Vorläufer deutscher Herrschaft", "Östlicher Nachfolgeraum."),
    pair("p4", "Geschichtskarte", "Räumliche Darstellung von Wandel", "Macht Teilungen sichtbar.")
  ],
  trueFalse: [
    tf("t1", "Der Vertrag von Verdun (843) teilte das Frankenreich unter Karls Enkeln.", true, "Die Teilung schuf west-, mittel- und ostfränkische Räume.", "Die Teilung schuf west-, mittel- und ostfränkische Räume. Sie prägte spätere europäische Staaten. Karten helfen, das zu verstehen."),
    tf("t2", "Nach Karls Tod blieb das Frankenreich für immer völlig ungeteilt.", false, "Erbteilungen führten zu Nachfolgereichen.", "Erbteilungen führten zu Nachfolgereichen. Verdun ist ein zentrales Beispiel. Genau das gehört zum Lehrplan.")
  ],
  sorts: [
    sort("folge", "Ordne: Einheit unter Karl → Reichsteilung → Nachfolgestaaten", ["Weite Herrschaft unter Karl","Reichsteilung (z. B. Verdun)","Dauerhafte Nachfolgestaaten"], "Zuerst karolingische Einheit, dann Teilung, schließlich neue Herrschaftsräume.", "Zuerst karolingische Einheit, dann Teilung, schließlich neue Herrschaftsräume. Zuerst karolingische Einheit, dann Teilung, schließlich neue Herrschaftsräume gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.")
  ],
  causeEffects: [
    causeEffect("Erbteilung des Frankenreichs", "Entstehung west- und ostfränkischer Räume", "Erbteilung des Frankenreichs führt zu: Entstehung west- und ostfränkischer Räume. Erbteilung des Frankenreichs führt zu: Entstehung west- und ostfränkischer Räume gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Zerfall des Mittelreichs", "Grenzkonflikte und Machtverschiebungen", "Zerfall des Mittelreichs führt zu: Grenzkonflikte und Machtverschiebungen. Zerfall des Mittelreichs führt zu: Grenzkonflikte und Machtverschiebungen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Nutzung von Geschichtskarten", "Teilungen räumlich nachvollziehbar", "Nutzung von Geschichtskarten führt zu: Teilungen räumlich nachvollziehbar. Nutzung von Geschichtskarten führt zu: Teilungen räumlich nachvollziehbar gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.")
  ],
}

const k6Lb2Missionierung: BioBank = {
  quelle: "Wikipedia: Christianisierung",
  url: "https://de.wikipedia.org/wiki/Christianisierung",
  conceptPrefix: "ge:k6:missionierung",
  facts: [
    fact("mission", "Was bedeutet Missionierung im Mittelalter?", "Die Verbreitung des christlichen Glaubens unter bislang nicht christlichen Gruppen", ["Nur der Bau von Fabriken", "Nur olympische Wettkämpfe", "Nur moderne Wahlkampagnen"], "Missionare predigten und tauften.", "Missionare predigten und tauften. Missionare predigten und tauften gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Missionierung meint die Verbreitung des christlichen ___.", ["Glaubens"]),
    fact("taufe", "Warum war die Taufe zentral?", "Weil sie die Aufnahme in die christliche Gemeinschaft markierte", ["Weil sie den Buchdruck erfand", "Weil sie Steuern abschaffte", "Weil sie Atomkraft regelte"], "Herrscher förderten oft Massentaufen.", "Herrscher förderten oft Massentaufen. Herrscher förderten oft Massentaufen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Die Taufe markierte die Aufnahme ins ___.", ["Christentum","Glauben"]),
    fact("herrscher", "Wie hingen Mission und Herrschaft zusammen?", "Herrscher nutzten Christentum zur Legitimation und Integration", ["Religion und Macht waren stets getrennt", "Mission war verboten", "Nur Bauern missionierten Könige"], "Bekehrung konnte Herrschaft festigen.", "Bekehrung konnte Herrschaft festigen. Bekehrung konnte Herrschaft festigen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Herrscher nutzten Christentum zur ___.", ["Legitimation","Integration"]),
    fact("kloster", "Welche Rolle spielten Klöster bei der Mission?", "Sie waren Stützpunkte für Predigt, Bildung und Landesausbau", ["Nur moderne Einkaufszentren", "Nur römische Arenen", "Nur Pharaonengräber"], "Mönche wirkten als Missionare und Kulturträger.", "Mönche wirkten als Missionare und Kulturträger. Mönche wirkten als Missionare und Kulturträger gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Klöster dienten als ___ der Mission.", ["Stützpunkte","Zentren"]),
    fact("heidnisch", "Was geschah mit vorchristlichen Bräuchen oft?", "Sie wurden verdrängt, umgedeutet oder mit christlichen Formen vermischt", ["Sie blieben völlig unverändert überall", "Sie wurden zu Industriegesetzen", "Sie verschwanden ohne jede Spur immer"], "Synkretismus und Konflikt kamen vor.", "Synkretismus und Konflikt kamen vor. Synkretismus und Konflikt kamen vor gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Vorchristliche Bräuche wurden oft ___ oder umgedeutet.", ["verdrängt","vermischt"]),
    fact("bischof", "Warum waren Bistümer wichtig?", "Weil sie kirchliche Verwaltung und Seelsorge räumlich organisierten", ["Weil sie nur Ritterheere führten", "Weil sie Fabriken bauten", "Weil sie Demokratie gründeten"], "Bistümer gliederten christliche Landschaften.", "Bistümer gliederten christliche Landschaften. Bistümer gliederten christliche Landschaften gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Bistümer organisierten kirchliche ___.", ["Verwaltung","Seelsorge"]),
    fact("gewalt", "War Mission immer friedlich?", "Nein — sie konnte mit Zwang, Krieg und Druck verbunden sein", ["Ja, immer nur freiwillig", "Mission gab es nie", "Nur mit olympischen Spielen"], "Lehrplan verlangt kritisches Urteil.", "Lehrplan verlangt kritisches Urteil. Lehrplan verlangt kritisches Urteil gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Mission konnte auch mit ___ verbunden sein.", ["Zwang","Gewalt","Druck"]),
    fact("alltag", "Welche Langzeitfolge hatte Christianisierung?", "Christliche Rituale und das Kirchenjahr prägten den Alltag", ["Sofortige Abschaffung jeder Religion", "Nur industrielle Feiertage", "Nur römische Gladiatoren"], "Glauben strukturierte Zeit und Moral.", "Glauben strukturierte Zeit und Moral. Glauben strukturierte Zeit und Moral gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Christianisierung prägte den ___ nachhaltig.", ["Alltag"]),
    fact("sachsen", "Warum ist das Thema für Sachsen relevant?", "Weil auch der mitteldeutsche Raum christianisiert und kirchlich organisiert wurde", ["Weil Sachsen nie Kirche kannte", "Weil Mission nur Asien betraf", "Weil es keine Bistümer gab"], "Regionale Kirchengeschichte knüpft hier an.", "Regionale Kirchengeschichte knüpft hier an. Regionale Kirchengeschichte knüpft hier an gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Auch Sachsen wurde ___ und kirchlich organisiert.", ["christianisiert"]),
    fact("lehrplan", "Welches Lehrplanziel steckt hinter Missionierung?", "Ausbreitung des Christentums als Teil mittelalterlicher Reichsstruktur", ["Nur moderne Medienkunde", "Nur Chemie der Metalle", "Nur Sportgeschichte"], "Mission gehört zur Entstehung der Reichsstruktur.", "Mission gehört zur Entstehung der Reichsstruktur. Mission gehört zur Entstehung der Reichsstruktur gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Missionierung erklärt die Ausbreitung des ___.", ["Christentums"])
  ],
  pairs: [
    pair("p1", "Missionierung", "Verbreitung des Christentums", "Oft mit Herrschaft verknüpft."),
    pair("p2", "Taufe", "Aufnahme in die Glaubensgemeinschaft", "Zentraler ritueller Akt."),
    pair("p3", "Bistum", "Kirchlicher Verwaltungsbezirk", "Organisierte Seelsorge räumlich."),
    pair("p4", "Kloster", "Stützpunkt von Mission und Bildung", "Mönche als Kulturträger.")
  ],
  trueFalse: [
    tf("t1", "Missionierung konnte mit Herrschaft und manchmal mit Zwang verbunden sein.", true, "Glaubensausbreitung und Machtpolitik hingen oft zusammen.", "Glaubensausbreitung und Machtpolitik hingen oft zusammen. Frieden war nicht die einzige Form. Kritisches Urteil ist gefordert."),
    tf("t2", "Im Mittelalter spielte Mission für die Ausbreitung des Christentums keine Rolle.", false, "Mission war zentral für Christianisierung.", "Mission war zentral für Christianisierung. Klöster und Bistümer trugen dazu bei. Der Lehrplan nennt Missionierung ausdrücklich.")
  ],
  causeEffects: [
    causeEffect("Missionierung neuer Gebiete", "Christliche Organisation durch Bistümer und Klöster", "Missionierung neuer Gebiete führt zu: Christliche Organisation durch Bistümer und Klöster. Missionierung neuer Gebiete führt zu: Christliche Organisation durch Bistümer und Klöster gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Taufe großer Gruppen", "Zugehörigkeit zur christlichen Gemeinschaft", "Taufe großer Gruppen führt zu: Zugehörigkeit zur christlichen Gemeinschaft. Taufe großer Gruppen führt zu: Zugehörigkeit zur christlichen Gemeinschaft gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Verbindung von Herrschaft und Glauben", "Legitimation politischer Macht", "Verbindung von Herrschaft und Glauben führt zu: Legitimation politischer Macht. Verbindung von Herrschaft und Glauben führt zu: Legitimation politischer Macht gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.")
  ],
}

const k6Lb2Ostkolonisation: BioBank = {
  quelle: "Wikipedia: Deutsche Ostsiedlung",
  url: "https://de.wikipedia.org/wiki/Deutsche_Ostsiedlung",
  conceptPrefix: "ge:k6:ostkolonisation",
  facts: [
    fact("begriff", "Was meint Ostkolonisation / Ostsiedlung grob?", "Landesausbau und Siedlungsbewegung nach Osten im Mittelalter", ["Nur moderne EU-Erweiterung", "Nur römische Aquädukte", "Nur ägyptische Pyramiden"], "Siedler, Herren und Klöster erschlossen neue Räume.", "Siedler, Herren und Klöster erschlossen neue Räume. Siedler, Herren und Klöster erschlossen neue Räume gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Ostkolonisation meint mittelalterlichen ___ nach Osten.", ["Landesausbau","Siedlungszug"]),
    fact("motive", "Welche Motive trieben die Ostsiedlung an?", "Landgewinn, Herrschaftsausbau, Wirtschaft und Mission", ["Nur Ablehnung jeder Landwirtschaft", "Nur olympische Spiele", "Nur Smartphone-Handel"], "Fürsten lockten Siedler mit Rechten.", "Fürsten lockten Siedler mit Rechten. Fürsten lockten Siedler mit Rechten gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Motive waren Land, Herrschaft und ___.", ["Wirtschaft","Mission"]),
    fact("lokator", "Was war ein Lokator?", "Ein Organisator, der Siedler anwarb und Dörfer anlegte", ["Ein römischer Konsul", "Ein Pharao", "Ein moderner Bürgermeister ohne Auftrag"], "Lokatoren vermittelten zwischen Herrn und Siedlern.", "Lokatoren vermittelten zwischen Herrn und Siedlern. Lokatoren vermittelten zwischen Herrn und Siedlern gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Ein ___ warb Siedler und legte Dörfer an.", ["Lokator"]),
    fact("recht", "Welche Rolle spielte Siedlerrecht?", "Attraktive Rechte lockten Bauern und Handwerker an", ["Rechte waren völlig egal", "Nur Sklavenrecht galt", "Nur Pharaonenrecht"], "Deutsches Recht oder ähnliche Formen wurden oft übertragen.", "Deutsches Recht oder ähnliche Formen wurden oft übertragen. Deutsches Recht oder ähnliche Formen wurden oft übertragen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Attraktive ___ lockten Siedler an.", ["Rechte"]),
    fact("stadt", "Welche Folgen hatte Ostsiedlung für Städte?", "Neugründungen und Wachstum von Marktplätzen und Stadtrechten", ["Abschaffung aller Städte", "Nur Nomadenlager", "Nur Pyramidenstädte"], "Städte entstanden entlang von Handelswegen.", "Städte entstanden entlang von Handelswegen. Städte entstanden entlang von Handelswegen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Ostsiedlung förderte ___ und Marktplätze.", ["Neugründungen","Städte"]),
    fact("kloster", "Welche Rolle spielten Klöster?", "Sie erschlossen Land, missionierten und organisierten Wirtschaft", ["Nur moderne Banken", "Nur Gladiatorenkämpfe", "Nur Atomkraftwerke"], "Zisterzienser waren bekannt für Landesausbau.", "Zisterzienser waren bekannt für Landesausbau. Zisterzienser waren bekannt für Landesausbau gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Klöster erschlossen Land und ___.", ["missionierten","wirtschafteten"]),
    fact("bevoelkerung", "Wen betraf die Ostsiedlung?", "Zuziehende Siedler und bereits ansässige Bevölkerungsgruppen", ["Nur Astronauten", "Nur Pharaonen", "Nur moderne Touristen"], "Kontakt konnte Kooperation oder Konflikt bedeuten.", "Kontakt konnte Kooperation oder Konflikt bedeuten. Kontakt konnte Kooperation oder Konflikt bedeuten gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Betroffen waren Siedler und ___ Gruppen.", ["ansässige","einheimische"]),
    fact("kultur", "Welche kulturellen Folgen gab es?", "Sprachliche, rechtliche und wirtschaftliche Veränderungen der Regionen", ["Keine Veränderungen je", "Nur Rückkehr zur Steinzeit", "Nur Abschaffung von Ackerbau"], "Landschaften und Siedlungsformen wandelten sich.", "Landschaften und Siedlungsformen wandelten sich. Landschaften und Siedlungsformen wandelten sich gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Ostsiedlung veränderte Recht, Wirtschaft und ___.", ["Kultur","Sprache"]),
    fact("urteil", "Warum braucht das Thema kritisches Urteil?", "Weil Expansion Herrschaft, Chancen und Konflikte zugleich brachte", ["Weil Kritik verboten ist", "Weil es keine Quellen gibt", "Weil nur Feiern erlaubt ist"], "Nicht nur „Erfolg“, sondern auch Folgen für Ansässige zählen.", "Nicht nur „Erfolg“, sondern auch Folgen für Ansässige zählen. Nicht nur „Erfolg“, sondern auch Folgen für Ansässige zählen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Expansion brachte Chancen und ___.", ["Konflikte"]),
    fact("lehrplan", "Warum steht Ostkolonisation im Lehrplan?", "Als Teil der Entstehung mittelalterlicher Reichs- und Siedlungsstruktur", ["Als reines Chemiethema", "Als moderne Mediengeschichte allein", "Als olympische Disziplin"], "Sie gehört zur Reichsstruktur neben Missionierung.", "Sie gehört zur Reichsstruktur neben Missionierung. Sie gehört zur Reichsstruktur neben Missionierung gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Ostkolonisation gehört zur mittelalterlichen ___.", ["Reichsstruktur","Siedlungsstruktur"])
  ],
  pairs: [
    pair("p1", "Ostsiedlung", "Mittelalterlicher Landesausbau nach Osten", "Siedler und Herren erschlossen Raum."),
    pair("p2", "Lokator", "Organisator von Siedlungen", "Warb Siedler an."),
    pair("p3", "Zisterzienser", "Orden mit starkem Landesausbau", "Klöster als Wirtschaftszentren."),
    pair("p4", "Stadtrecht", "Rechtliche Ordnung neuer Städte", "Lockte Handwerk und Handel.")
  ],
  trueFalse: [
    tf("t1", "Ostkolonisation meint mittelalterlichen Landesausbau und Siedlung nach Osten.", true, "Siedler, Herren und Klöster erschlossen neue Räume.", "Siedler, Herren und Klöster erschlossen neue Räume. Rechte lockten Zuwanderer. Das Thema gehört zur Reichsstruktur."),
    tf("t2", "Bei der Ostsiedlung gab es keinerlei Folgen für bereits ansässige Bevölkerungen.", false, "Ansässige Gruppen waren mitbetroffen.", "Ansässige Gruppen waren mitbetroffen. Kooperation und Konflikt kamen vor. Kritisches Urteil ist nötig.")
  ],
  causeEffects: [
    causeEffect("Lockende Siedlerrechte", "Zuzug von Bauern und Handwerkern", "Lockende Siedlerrechte führt zu: Zuzug von Bauern und Handwerkern. Lockende Siedlerrechte führt zu: Zuzug von Bauern und Handwerkern gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Klösterlicher Landesausbau", "Wirtschaftliche Erschließung neuer Gebiete", "Klösterlicher Landesausbau führt zu: Wirtschaftliche Erschließung neuer Gebiete. Klösterlicher Landesausbau führt zu: Wirtschaftliche Erschließung neuer Gebiete gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Stadtneugründungen", "Wachstum von Markt und Handwerk", "Stadtneugründungen führt zu: Wachstum von Markt und Handwerk. Stadtneugründungen führt zu: Wachstum von Markt und Handwerk gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.")
  ],
}

const k6Lb2HeiligesReich: BioBank = {
  quelle: "Wikipedia: Heiliges Römisches Reich",
  url: "https://de.wikipedia.org/wiki/Heiliges_R%C3%B6misches_Reich",
  conceptPrefix: "ge:k6:heiliges-reich",
  facts: [
    fact("name", "Was war das Heilige Römische Reich?", "Ein mittelalterlich-frühneuzeitlicher Herrschaftsverband in Mitteleuropa", ["Ein Pharaonenstaat am Nil", "Ein moderner Nationalstaat von 1990", "Eine antike athenische Polis allein"], "Es verband Kaisertum und viele Territorien.", "Es verband Kaisertum und viele Territorien. Es verband Kaisertum und viele Territorien gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Das Heilige Römische Reich war ein ___ in Mitteleuropa.", ["Herrschaftsverband","Reich"]),
    fact("kaiser", "Wer stand symbolisch an der Spitze?", "Der römisch-deutsche Kaiser", ["Ein Pharao", "Ein spartanischer König", "Ein moderner UN-Generalsekretär allein"], "Kaiserwürde war prestigeträchtig, Macht oft begrenzt.", "Kaiserwürde war prestigeträchtig, Macht oft begrenzt. Kaiserwürde war prestigeträchtig, Macht oft begrenzt gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "An der Spitze stand der ___.", ["Kaiser"]),
    fact("wahl", "Wie wurde der König/Kaiser oft bestimmt?", "Durch Wahl durch Fürsten (Kurfürsten)", ["Durch olympischen Wettkampf", "Durch reine Losziehung im Dorf", "Durch Pharaonen erbschaftslos überall"], "Wahlrecht der Kurfürsten prägte die Verfassung.", "Wahlrecht der Kurfürsten prägte die Verfassung. Wahlrecht der Kurfürsten prägte die Verfassung gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Der Herrscher wurde oft durch ___ bestimmt.", ["Wahl","Kurfürsten"]),
    fact("territorien", "Wie war das Reich intern strukturiert?", "Als Gefüge vieler Fürsten- und Stadtherrschaften unter dem Kaiser", ["Als zentraler Einheitsstaat wie heute", "Als reine Nomadengesellschaft", "Als nur eine einzige Stadt"], "Macht war dezentral und gestuft.", "Macht war dezentral und gestuft. Macht war dezentral und gestuft gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Das Reich bestand aus vielen ___.", ["Territorien","Herrschaften"]),
    fact("spaet", "Was kennzeichnet das Spätmittelalter grob?", "Krisen, Städtewachstum, Verdichtung herrschaftlicher Strukturen", ["Nur Steinzeitjagd", "Nur Raumfahrt", "Nur Abschaffung aller Städte"], "Pest, Kriege und wirtschaftliche Umbrüche wirkten.", "Pest, Kriege und wirtschaftliche Umbrüche wirkten. Pest, Kriege und wirtschaftliche Umbrüche wirkten gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Das Spätmittelalter brachte Krisen und ___.", ["Städtewachstum","Umbrüche"]),
    fact("recht", "Welche Rolle spielte Recht im Reich?", "Landfrieden, Privilegien und ständische Rechte ordneten Macht", ["Recht war völlig unbekannt", "Nur Pharaonenrecht galt", "Nur Sportregeln"], "Rechtliche Ordnung war fragmentiert, aber wichtig.", "Rechtliche Ordnung war fragmentiert, aber wichtig. Rechtliche Ordnung war fragmentiert, aber wichtig gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Landfrieden und ___ ordneten Macht.", ["Privilegien","Rechte"]),
    fact("kirche", "Wie war das Reich mit der Kirche verbunden?", "Eng — christliche Legitimation und geistliche Fürsten prägten es", ["Gar nicht", "Nur über moderne Parteien", "Nur über Industrie"], "Bischöfe konnten zugleich Landesherren sein.", "Bischöfe konnten zugleich Landesherren sein. Bischöfe konnten zugleich Landesherren sein gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Geistliche Fürsten und christliche ___ prägten das Reich.", ["Legitimation"]),
    fact("grenze", "Warum ist „Reich“ hier kein moderner Nationalstaat?", "Weil Zugehörigkeit über Herrschaftsrechte, nicht über Nation lief", ["Weil es keine Herrscher gab", "Weil es nur eine Sprache gab", "Weil Grenzen nie existierten"], "Mittelalterliche Herrschaft war personen- und rechtsbezogen.", "Mittelalterliche Herrschaft war personen- und rechtsbezogen. Mittelalterliche Herrschaft war personen- und rechtsbezogen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Zugehörigkeit lief über ___, nicht über Nation.", ["Herrschaftsrechte","Rechte"]),
    fact("sachsen", "Welchen Bezug hat Sachsen?", "Sächsische Fürsten wurden später Teil der Reichsverfassung (z. B. Kurwürde)", ["Sachsen lag außerhalb jeder Geschichte", "Sachsen war nur Pharaonenland", "Sachsen kannte kein Fürstentum"], "Regionalgeschichte knüpft an Reichsstruktur an.", "Regionalgeschichte knüpft an Reichsstruktur an. Regionalgeschichte knüpft an Reichsstruktur an gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Sächsische Fürsten wurden Teil der ___.", ["Reichsverfassung","Reichsstruktur"]),
    fact("lehrplan", "Warum steht die Reichsstruktur im Lehrplan?", "Weil sie dauerhafte mittelalterliche Herrschaftsordnung erklärt", ["Weil nur Antike zählt", "Weil Karten verboten sind", "Weil Kaiser uninteressant sind"], "HRR ist Kern der mittelalterlichen Reichsstruktur.", "HRR ist Kern der mittelalterlichen Reichsstruktur. HRR ist Kern der mittelalterlichen Reichsstruktur gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Die Struktur des HRR erklärt mittelalterliche ___.", ["Herrschaftsordnung","Reichsstruktur"])
  ],
  pairs: [
    pair("p1", "Kaiser", "Symbolische Spitze des Reiches", "Macht oft durch Fürsten begrenzt."),
    pair("p2", "Kurfürst", "Fürst mit Königswahlrecht", "Prägte die Reichsverfassung."),
    pair("p3", "Territorium", "Landesherrschaft im Reichsgefüge", "Dezentrale Machtstruktur."),
    pair("p4", "Spätmittelalter", "Späte Phase mit Krisen und Wandel", "Städte und Strukturen verdichten sich.")
  ],
  trueFalse: [
    tf("t1", "Das Heilige Römische Reich bestand aus vielen Territorien unter einem Kaiser.", true, "Macht war gestuft und dezentral.", "Macht war gestuft und dezentral. Kurfürsten wählten den König. Das unterscheidet es vom modernen Nationalstaat."),
    tf("t2", "Das Heilige Römische Reich war ein zentralistischer Nationalstaat wie im 20. Jahrhundert.", false, "Es war ein Rechts- und Herrschaftsgefüge vieler Territorien.", "Es war ein Rechts- und Herrschaftsgefüge vieler Territorien. Nation war kein mittelalterliches Ordnungsprinzip. Der Lehrplan betont diese Struktur.")
  ],
  sorts: [
    sort("ebenen", "Ordne die Herrschaftsebenen von oben nach unten (vereinfacht)", ["Kaiser","Fürsten / Kurfürsten","Lokale Herren und Städte"], "Symbolische Spitze, dann Territorialherren, dann lokale Ebene.", "Symbolische Spitze, dann Territorialherren, dann lokale Ebene. Symbolische Spitze, dann Territorialherren, dann lokale Ebene gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.")
  ],
  causeEffects: [
    causeEffect("Wahl durch Kurfürsten", "Kaiserliche Macht oft verhandelbar", "Wahl durch Kurfürsten führt zu: Kaiserliche Macht oft verhandelbar. Wahl durch Kurfürsten führt zu: Kaiserliche Macht oft verhandelbar gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Viele Territorien", "Dezentrale Herrschaftsstruktur", "Viele Territorien führt zu: Dezentrale Herrschaftsstruktur. Viele Territorien führt zu: Dezentrale Herrschaftsstruktur gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Geistliche Fürsten", "Verflechtung von Kirche und Herrschaft", "Geistliche Fürsten führt zu: Verflechtung von Kirche und Herrschaft. Geistliche Fürsten führt zu: Verflechtung von Kirche und Herrschaft gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.")
  ],
}

const k6Lb2WeltlichGeistlich: BioBank = {
  quelle: "Wikipedia: Investiturstreit",
  url: "https://de.wikipedia.org/wiki/Investiturstreit",
  conceptPrefix: "ge:k6:weltlich-geistlich",
  facts: [
    fact("verflechtung", "Was meint Verflechtung weltlicher und geistlicher Macht?", "Dass Kaiser, Könige und Kirche eng in Herrschaft und Recht verbunden waren", ["Dass Kirche und Staat nie Kontakt hatten", "Dass nur Bauern regierten", "Dass Religion verboten war"], "Bischöfe konnten Landesherren sein.", "Bischöfe konnten Landesherren sein. Bischöfe konnten Landesherren sein gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Weltliche und geistliche Macht waren eng ___.", ["verbunden","verflochten"]),
    fact("investitur", "Was war Investitur?", "Die Einsetzung eines Geistlichen in Amt und oft weltliche Rechte", ["Nur eine olympische Medaille", "Nur ein Zunftbrief", "Nur eine Fabrikeröffnung"], "Wer investierte, hatte großen Einfluss.", "Wer investierte, hatte großen Einfluss. Wer investierte, hatte großen Einfluss gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Investitur meint die ___ eines Geistlichen.", ["Einsetzung"]),
    fact("streit", "Worum ging es im Investiturstreit grob?", "Um die Frage, wer Bischöfe einsetzen darf — Kaiser oder Papst", ["Um die Erfindung des Autos", "Um olympische Regeln", "Um moderne Aktienkurse"], "Beide Seiten beanspruchten Autorität.", "Beide Seiten beanspruchten Autorität. Beide Seiten beanspruchten Autorität gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Im Investiturstreit stritten Kaiser und ___ um Einsetzungsrecht.", ["Papst"]),
    fact("canossa", "Wofür steht „Gang nach Canossa“ symbolisch?", "Für den Konflikt und die zeitweilige Unterwerfung Heinrichs IV. vor dem Papst", ["Für die Gründung der EU", "Für den Bau der Pyramiden", "Für die Industrielle Revolution"], "Das Bild zeigt Machtprobe zwischen Kaiser und Papst.", "Das Bild zeigt Machtprobe zwischen Kaiser und Papst. Das Bild zeigt Machtprobe zwischen Kaiser und Papst gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Canossa steht für den Konflikt zwischen Kaiser und ___.", ["Papst"]),
    fact("zwei", "Was sind „zwei Schwerter“ / zwei Gewalten als Idee?", "Die Vorstellung von geistlicher und weltlicher Gewalt nebeneinander", ["Nur moderne Polizei", "Nur eine einzige Macht ohne Kirche", "Nur Sportverbände"], "Theorie und Praxis wichen oft voneinander ab.", "Theorie und Praxis wichen oft voneinander ab. Theorie und Praxis wichen oft voneinander ab gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Geistliche und weltliche ___ sollten nebeneinander wirken.", ["Gewalt","Macht"]),
    fact("bischof", "Warum waren Bischöfe politisch wichtig?", "Weil sie oft zugleich geistliche Hirten und weltliche Herren waren", ["Weil sie nur Bauern ohne Land waren", "Weil sie Pharaonen ersetzten", "Weil sie Fabriken leiteten"], "Kirchengut bedeutete Macht.", "Kirchengut bedeutete Macht. Kirchengut bedeutete Macht gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Bischöfe waren oft geistliche und weltliche ___.", ["Herren","Machthaber"]),
    fact("alltag", "Wie spürten Menschen die Verflechtung im Alltag?", "Durch Kirche, Abgaben an geistliche Herren und christliche Ordnung", ["Gar nicht", "Nur durch Smartphones", "Nur durch Olympia"], "Geistliche Grundherren waren häufig.", "Geistliche Grundherren waren häufig. Geistliche Grundherren waren häufig gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Viele lebten unter geistlichen ___.", ["Herren","Grundherren"]),
    fact("konflikt", "Welche Folge hatte die Verflechtung?", "Kooperation und schwere Konflikte um Vorrang und Rechte", ["Nur ewigen Frieden", "Nur Abschaffung der Kirche", "Nur industrielle Produktion"], "Machtansprüche stießen aufeinander.", "Machtansprüche stießen aufeinander. Machtansprüche stießen aufeinander gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Verflechtung brachte Kooperation und ___.", ["Konflikte"]),
    fact("urteil", "Welches Reflexionsziel nennt der Lehrplan sinngemäß?", "Abhängigkeiten und Sicherheit statt Freiheit als zeittypische Ordnung zu erkennen", ["Dass Mittelalter keine Ordnung kannte", "Dass nur Moderne zählt", "Dass Kirche irrelevant war"], "Freiheit und Abhängigkeit waren verknüpft.", "Freiheit und Abhängigkeit waren verknüpft. Freiheit und Abhängigkeit waren verknüpft gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Mittelalterliche Ordnung verknüpfte Freiheit und ___.", ["Abhängigkeit"]),
    fact("quelle", "Warum eignen sich bildliche Quellen hier?", "Weil Herrschaft und Kirche in Bildern symbolisch dargestellt wurden", ["Weil Bilder nie existierten", "Weil nur Zahlen zählen", "Weil Quellen verboten sind"], "Lehrplan nennt bildliche Quellen ausdrücklich.", "Lehrplan nennt bildliche Quellen ausdrücklich. Lehrplan nennt bildliche Quellen ausdrücklich gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Bildliche Quellen zeigen ___ und Kirche symbolisch.", ["Herrschaft"])
  ],
  pairs: [
    pair("p1", "Investitur", "Einsetzung in geistliches Amt", "Oft mit weltlichen Rechten."),
    pair("p2", "Investiturstreit", "Konflikt Kaiser–Papst", "Wer setzt Bischöfe ein?"),
    pair("p3", "Canossa", "Symbol der Machtprobe", "Heinrich IV. und Gregor VII."),
    pair("p4", "Geistlicher Fürst", "Bischof als Landesherr", "Doppelrolle Kirche und Herrschaft.")
  ],
  trueFalse: [
    tf("t1", "Im Mittelalter waren weltliche und geistliche Macht eng verflochten.", true, "Kaiser, Papst und Bischöfe wirkten in Herrschaft zusammen.", "Kaiser, Papst und Bischöfe wirkten in Herrschaft zusammen. Konflikte wie der Investiturstreit zeigen Spannungen. Das ist Lehrplanstoff."),
    tf("t2", "Der Investiturstreit drehte sich um die Frage, wer moderne Fabriken eröffnen darf.", false, "Es ging um die Einsetzung von Bischöfen.", "Es ging um die Einsetzung von Bischöfen. Kaiser und Papst stritten um Autorität. Wirtschaft der Neuzeit war nicht das Thema.")
  ],
  causeEffects: [
    causeEffect("Recht zur Investitur", "Einfluss auf Bischöfe und Kirchengut", "Recht zur Investitur führt zu: Einfluss auf Bischöfe und Kirchengut. Recht zur Investitur führt zu: Einfluss auf Bischöfe und Kirchengut gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Doppelrolle der Bischöfe", "Verflechtung von Kirche und Landesherrschaft", "Doppelrolle der Bischöfe führt zu: Verflechtung von Kirche und Landesherrschaft. Doppelrolle der Bischöfe führt zu: Verflechtung von Kirche und Landesherrschaft gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Konflikt Kaiser–Papst", "Öffentliche Machtproben und Kompromisse", "Konflikt Kaiser–Papst führt zu: Öffentliche Machtproben und Kompromisse. Konflikt Kaiser–Papst führt zu: Öffentliche Machtproben und Kompromisse gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.")
  ],
  sources: [
    source("src1", "Welche Deutung passt am ehesten?", "„Wer den Hirtenstab vergibt, lenkt auch die Herde — und oft das Land dazu.“", "Didaktische Umschreibung mittelalterlicher Herrschaftslogik", "Einsetzung geistlicher Ämter bedeutete auch weltlichen Einfluss", ["Kirche hatte nie Landbesitz", "Nur moderne Parteien zählten", "Investitur war reine Sportordnung"] as [string, string, string], "Investitur verband Amt und Macht.", "Investitur verband Amt und Macht. Investitur verband Amt und Macht gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.")
  ],
}

const k6Lb2Grundherrschaft: BioBank = {
  quelle: "Wikipedia: Grundherrschaft",
  url: "https://de.wikipedia.org/wiki/Grundherrschaft",
  conceptPrefix: "ge:k6:grundherrschaft",
  facts: [
    fact("begriff", "Was ist Grundherrschaft?", "Herrschaft eines Grundherrn über Land und abhängige Bauern", ["Reine Demokratie ohne Herren", "Nur städtische Zunftordnung", "Nur römische Republik"], "Bodenbesitz war Herrschaftsgrund.", "Bodenbesitz war Herrschaftsgrund. Bodenbesitz war Herrschaftsgrund gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "___ meint Herrschaft über Land und Bauern.", ["Grundherrschaft"]),
    fact("abgaben", "Was leisteten abhängige Bauern typischerweise?", "Abgaben von Ernte und Produkten an den Herrn", ["Nur moderne Einkommensteuer digital", "Gar nichts je", "Nur olympische Medaillen"], "Naturalabgaben waren häufig.", "Naturalabgaben waren häufig. Naturalabgaben waren häufig gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Bauern leisteten ___ an den Grundherrn.", ["Abgaben"]),
    fact("fron", "Was sind Frondienste?", "Arbeitsleistungen der Bauern für den Herrenbetrieb", ["Freiwillige Freizeit ohne Pflicht", "Nur Ritterturniere", "Nur städtische Ratsämter"], "Fron band Arbeitskraft an den Herrn.", "Fron band Arbeitskraft an den Herrn. Fron band Arbeitskraft an den Herrn gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "___ sind Arbeitsleistungen für den Herrn.", ["Frondienste","Fronden"]),
    fact("freiheit", "Was meint „Sicherheit statt Freiheit“ im Lehrplankontext?", "Schutz und Versorgung gegen Abhängigkeit und eingeschränkte Rechte", ["Völlige Gleichheit aller", "Nur moderne Grundrechte identisch", "Abschaffung jeder Herrschaft"], "Abhängigkeit bot oft Schutz, kostete aber Freiheit.", "Abhängigkeit bot oft Schutz, kostete aber Freiheit. Abhängigkeit bot oft Schutz, kostete aber Freiheit gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Abhängigkeit bot oft ___ statt voller Freiheit.", ["Sicherheit","Schutz"]),
    fact("boden", "Warum war Bodenbesitz Herrschaftsgrund?", "Weil Land Erträge, Arbeitskräfte und Macht sicherte", ["Weil Land wertlos war", "Weil nur Städte zählten", "Weil Bauern Herren wählten"], "Wer Land kontrollierte, herrschte.", "Wer Land kontrollierte, herrschte. Wer Land kontrollierte, herrschte gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Bodenbesitz sicherte Erträge und ___.", ["Macht","Herrschaft"]),
    fact("hof", "Was war der Fronhof / Herrenhof?", "Wirtschaftlicher Mittelpunkt der grundherrlichen Eigenwirtschaft", ["Nur ein modernes Einkaufszentrum", "Nur eine römische Arena", "Nur ein Pharaonengrab"], "Bauern arbeiteten auch dort.", "Bauern arbeiteten auch dort. Bauern arbeiteten auch dort gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Der ___ war Zentrum der Herrenwirtschaft.", ["Fronhof","Herrenhof"]),
    fact("abhaengig", "Wie lebten viele Bauern?", "In persönlicher und wirtschaftlicher Abhängigkeit vom Grundherrn", ["Als völlig gleiche Staatsbürger", "Als römische Konsuln", "Als moderne Abgeordnete"], "Rechte waren beschränkt.", "Rechte waren beschränkt. Rechte waren beschränkt gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Viele Bauern lebten in ___.", ["Abhängigkeit"]),
    fact("vergleich", "Welchen Gegenwartsbezug legt der Lehrplan nahe?", "Über Abhängigkeiten und Sicherheit auch heute nachzudenken", ["Dass Abhängigkeit nur Mittelalter war", "Dass Reflexion verboten ist", "Dass nur Antike zählt"], "Historische Formen schärfen Urteil über Freiheit.", "Historische Formen schärfen Urteil über Freiheit. Historische Formen schärfen Urteil über Freiheit gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Der Lehrplan regt Reflexion über ___ an.", ["Abhängigkeiten","Freiheit"]),
    fact("schaubild", "Warum eignen sich Schaubilder?", "Weil Abgaben, Dienste und Herrschaftsstufen übersichtlich werden", ["Weil Schaubilder nutzlos sind", "Weil nur Filme zählen", "Weil Bauern nicht existierten"], "Lehrplan nennt Schaubilder und Rollenspiele.", "Lehrplan nennt Schaubilder und Rollenspiele. Lehrplan nennt Schaubilder und Rollenspiele gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Schaubilder machen Abgaben und ___ sichtbar.", ["Dienste","Herrschaft"]),
    fact("lehen", "Wie hängt Grundherrschaft mit Lehnswesen zusammen?", "Beide ordnen Herrschaft über Land und Personen gestuft", ["Sie haben nichts gemein", "Nur Städte nutzen beides", "Nur Pharaonen kannten sie"], "Lehen und Grundherrschaft greifen ineinander.", "Lehen und Grundherrschaft greifen ineinander. Lehen und Grundherrschaft greifen ineinander gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Beide ordnen Herrschaft über ___ und Personen.", ["Land"])
  ],
  pairs: [
    pair("p1", "Grundherrschaft", "Herrschaft über Land und Bauern", "Boden als Machtgrundlage."),
    pair("p2", "Frondienst", "Arbeitsleistung für den Herrn", "Typisch für abhängige Bauern."),
    pair("p3", "Abgabe", "Teil der Ernte an den Herrn", "Wirtschaftliche Pflicht."),
    pair("p4", "Fronhof", "Zentrum der Herrenwirtschaft", "Bauern arbeiten auch dort.")
  ],
  trueFalse: [
    tf("t1", "Grundherrschaft bedeutet Herrschaft über Land und abhängige Bauern.", true, "Abgaben und Frondienste waren typisch.", "Abgaben und Frondienste waren typisch. Bodenbesitz sicherte Macht. Der Lehrplan nennt genau diese Struktur."),
    tf("t2", "Abhängige Bauern leisteten im Mittelalter weder Abgaben noch Dienste.", false, "Abgaben und Frondienste waren Kern der Grundherrschaft.", "Abgaben und Frondienste waren Kern der Grundherrschaft. Genau darüber soll reflektiert werden. Sicherheit und Abhängigkeit hingen zusammen.")
  ],
  causeEffects: [
    causeEffect("Bodenbesitz des Herrn", "Anspruch auf Abgaben und Dienste", "Bodenbesitz des Herrn führt zu: Anspruch auf Abgaben und Dienste. Bodenbesitz des Herrn führt zu: Anspruch auf Abgaben und Dienste gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Frondienste der Bauern", "Bewirtschaftung des Herrenlandes", "Frondienste der Bauern führt zu: Bewirtschaftung des Herrenlandes. Frondienste der Bauern führt zu: Bewirtschaftung des Herrenlandes gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Schutz durch den Herrn", "Eingeschränkte persönliche Freiheit", "Schutz durch den Herrn führt zu: Eingeschränkte persönliche Freiheit. Schutz durch den Herrn führt zu: Eingeschränkte persönliche Freiheit gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.")
  ],
}

const k6Lb2BurgRitter: BioBank = {
  quelle: "Wikipedia: Burg",
  url: "https://de.wikipedia.org/wiki/Burg",
  conceptPrefix: "ge:k6:burg-ritter",
  facts: [
    fact("burg", "Wozu dienten Burgen vor allem?", "Als Wehr-, Wohn- und Herrschaftssitze des Adels", ["Nur als moderne Hotels", "Nur als Pharaonengräber", "Nur als Fabriken"], "Lage und Mauern sicherten Kontrolle über Land.", "Lage und Mauern sicherten Kontrolle über Land. Lage und Mauern sicherten Kontrolle über Land gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Burgen waren Wehr- und ___ des Adels.", ["Wohnsitze","Herrschaftssitze"]),
    fact("ritter", "Was kennzeichnete Rittertum?", "Adlige Krieger zu Pferd mit Standesidealen und Ausbildung", ["Nur städtische Handwerker", "Nur Bauern ohne Waffen", "Nur moderne Soldaten"], "Page und Knappe führten zum Ritterschlag.", "Page und Knappe führten zum Ritterschlag. Page und Knappe führten zum Ritterschlag gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Ritter waren adlige ___ zu Pferd.", ["Krieger"]),
    fact("hofisch", "Was meint höfische Kultur?", "Lebensformen, Kunst und Umgangsformen an Fürstenhöfen", ["Nur Fabrikarbeit", "Nur olympische Disziplinen", "Nur Steinzeitjagd"], "Dichtung, Musik und Etikette gehörten dazu.", "Dichtung, Musik und Etikette gehörten dazu. Dichtung, Musik und Etikette gehörten dazu gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Höfische Kultur prägte Leben an ___.", ["Fürstenhöfen","Höfen"]),
    fact("minne", "Was ist Minne in diesem Kontext?", "Idealisierte Liebes- und Dienstkultur in höfischer Dichtung", ["Nur moderne Chatflirts", "Nur Steuerrecht", "Nur Zunftordnung"], "Minnesang verband Ritterideal und Kunst.", "Minnesang verband Ritterideal und Kunst. Minnesang verband Ritterideal und Kunst gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Minne meint idealisierte ___ in der Dichtung.", ["Liebe","Liebeskultur"]),
    fact("turnier", "Welche Rolle hatten Turniere?", "Übung, Prestige und Darstellung ritterlicher Tüchtigkeit", ["Nur moderne Fußballregeln", "Nur Bauernmarkt", "Nur Kirchensteuer"], "Kämpfe waren ritualisiert und öffentlich.", "Kämpfe waren ritualisiert und öffentlich. Kämpfe waren ritualisiert und öffentlich gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Turniere dienten Übung und ___.", ["Prestige"]),
    fact("sachsen", "Warum nennt der Lehrplan Burgen in Sachsen?", "Weil Regionalgeschichte Herrschaft vor Ort greifbar macht", ["Weil Sachsen keine Burgen hatte", "Weil Burgen nur in Ägypten standen", "Weil Exkursionen verboten sind"], "Exkursionen zu Burgen sind vorgesehen.", "Exkursionen zu Burgen sind vorgesehen. Exkursionen zu Burgen sind vorgesehen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Burgen in Sachsen machen ___ greifbar.", ["Regionalgeschichte","Herrschaft"]),
    fact("alltag", "Wie war der Alltag auf der Burg?", "Von Herrschaft, Versorgung, Handwerk und Verteidigung geprägt", ["Wie in einer modernen Großstadt identisch", "Ohne jede Arbeit", "Nur aus olympischem Training"], "Viele Menschen dienten dem Burgherrn.", "Viele Menschen dienten dem Burgherrn. Viele Menschen dienten dem Burgherrn gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Burgalltag war von Herrschaft und ___ geprägt.", ["Versorgung","Verteidigung"]),
    fact("ideale", "Welche Ideale verband das Rittertum oft?", "Tapferkeit, Treue, Schutz und höfisches Verhalten", ["Nur Gewinnmaximierung", "Nur Ablehnung jeder Ehre", "Nur industrielle Effizienz"], "Ideal und Wirklichkeit wichen oft ab.", "Ideal und Wirklichkeit wichen oft ab. Ideal und Wirklichkeit wichen oft ab gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Ritterideale umfassten Tapferkeit und ___.", ["Treue","Schutz"]),
    fact("wandel", "Wie veränderte sich die Bedeutung von Burgen später?", "Durch neue Kriegstechnik und Herrschaftsformen nahm ihre Rolle ab", ["Sie wurden wichtiger als je zuvor ewig", "Sie verschwanden in der Steinzeit", "Sie wurden zu Pharaonenpalästen"], "Feuerwaffen und Residenzstädte veränderten Macht.", "Feuerwaffen und Residenzstädte veränderten Macht. Feuerwaffen und Residenzstädte veränderten Macht gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Neue ___ minderte die Rolle vieler Burgen.", ["Kriegstechnik","Technik"]),
    fact("lehrplan", "Welches Lehrplanziel steckt hinter Burg und Ritter?", "Leben auf der Burg und Rittertum als Lebensform kennen", ["Nur Chemie der Mauern", "Nur moderne Architektur allein", "Nur Sportgeschichte"], "Höfische Kultur und Minne gehören dazu.", "Höfische Kultur und Minne gehören dazu. Höfische Kultur und Minne gehören dazu gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Lehrplan fordert Kenntnis von Burg und ___.", ["Rittertum"])
  ],
  pairs: [
    pair("p1", "Burg", "Wehr- und Herrschaftssitz", "Kontrolliert Land und Wege."),
    pair("p2", "Ritter", "Adliger Krieger zu Pferd", "Ausbildung als Page und Knappe."),
    pair("p3", "Minne", "Höfische Liebes- und Dienstkultur", "Thema der Dichtung."),
    pair("p4", "Turnier", "Ritualisierter Wettkampf", "Prestige und Übung.")
  ],
  trueFalse: [
    tf("t1", "Burgen dienten als Wehr-, Wohn- und Herrschaftssitze.", true, "Adel kontrollierte von dort Land und Leute.", "Adel kontrollierte von dort Land und Leute. Rittertum und höfische Kultur gehörten dazu. In Sachsen sind Burgen regionalgeschichtlich relevant."),
    tf("t2", "Minne bezeichnet im Mittelalter ausschließlich moderne Steuerformulare.", false, "Minne meint höfische Liebes- und Dienstkultur.", "Minne meint höfische Liebes- und Dienstkultur. Sie gehört zur höfischen Kultur. Der Lehrplan nennt sie ausdrücklich.")
  ],
  causeEffects: [
    causeEffect("Erhöhung und Mauern der Burg", "Bessere Verteidigung und Kontrolle", "Erhöhung und Mauern der Burg führt zu: Bessere Verteidigung und Kontrolle. Erhöhung und Mauern der Burg führt zu: Bessere Verteidigung und Kontrolle gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Ritterliche Ausbildung", "Kampfkraft und Standesbewusstsein", "Ritterliche Ausbildung führt zu: Kampfkraft und Standesbewusstsein. Ritterliche Ausbildung führt zu: Kampfkraft und Standesbewusstsein gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Höfische Kultur", "Darstellung von Prestige und Idealen", "Höfische Kultur führt zu: Darstellung von Prestige und Idealen. Höfische Kultur führt zu: Darstellung von Prestige und Idealen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.")
  ],
}

const k6Lb2AlltagFroemmigkeit: BioBank = {
  quelle: "Wikipedia: Volksfrömmigkeit",
  url: "https://de.wikipedia.org/wiki/Volksfr%C3%B6mmigkeit",
  conceptPrefix: "ge:k6:alltag-froemmigkeit",
  facts: [
    fact("volks", "Was meint Volksfrömmigkeit?", "Gelebte religiöse Praxis der einfachen Gläubigen im Alltag", ["Nur Theologie an Universitäten", "Nur Ablehnung jeder Religion", "Nur moderne Parteiprogramme"], "Heiligenverehrung und Rituale waren verbreitet.", "Heiligenverehrung und Rituale waren verbreitet. Heiligenverehrung und Rituale waren verbreitet gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Volksfrömmigkeit ist gelebte religiöse ___ im Alltag.", ["Praxis"]),
    fact("pfarre", "Welche Rolle hatte die Pfarrkirche?", "Sie war religiöses Zentrum für Gottesdienst und Gemeindeleben", ["Nur eine Fabrikhalle", "Nur ein Ritterturnierplatz", "Nur ein Pharaonentempel ohne Gemeinde"], "Taufe, Messe und Begräbnis fanden dort statt.", "Taufe, Messe und Begräbnis fanden dort statt. Taufe, Messe und Begräbnis fanden dort statt gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Die ___ war religiöses Zentrum der Gemeinde.", ["Pfarrkirche"]),
    fact("kalender", "Wie gliederte der kirchliche Festkalender das Jahr?", "Durch Fasten- und Feiertage, Heilige und liturgische Zeiten", ["Nur durch Börsenschlusszeiten", "Nur durch olympische Zyklen", "Gar nicht"], "Kirchenjahr strukturierte Arbeit und Feste.", "Kirchenjahr strukturierte Arbeit und Feste. Kirchenjahr strukturierte Arbeit und Feste gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Der kirchliche ___ gliederte das Jahr.", ["Festkalender","Kalender"]),
    fact("ritual", "Welche christlichen Rituale prägten Lebensläufe?", "Taufe, Beichte, Eucharistie, Ehe und Begräbnis", ["Nur moderne Führerscheinprüfungen", "Nur Aktienkäufe", "Nur olympische Eide"], "Sakramente begleiteten Stationen des Lebens.", "Sakramente begleiteten Stationen des Lebens. Sakramente begleiteten Stationen des Lebens gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Christliche ___ prägten den Lebenslauf.", ["Rituale","Sakramente"]),
    fact("jenseits", "Was meint Ausrichtung auf das Jenseits?", "Dass Heil, Buße und ewiges Leben das Denken prägten", ["Dass nur diesseitiger Konsum zählte", "Dass Religion irrelevant war", "Dass nur Industrie zählte"], "Angst vor Hölle und Hoffnung auf Himmel wirkten.", "Angst vor Hölle und Hoffnung auf Himmel wirkten. Angst vor Hölle und Hoffnung auf Himmel wirkten gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Viele richteten ihr Leben auf das ___ aus.", ["Jenseits"]),
    fact("busse", "Welche Rolle spielten Buße und gute Werke?", "Sie sollten Schuld mildern und Heil fördern", ["Sie waren völlig bedeutungslos", "Sie ersetzten jede Landwirtschaft", "Sie waren nur Sportregeln"], "Stiftungen und Almosen gehörten dazu.", "Stiftungen und Almosen gehörten dazu. Stiftungen und Almosen gehörten dazu gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Buße und gute Werke sollten das ___ fördern.", ["Heil"]),
    fact("stiftung", "Was waren Stiftungen oft?", "Gaben für Kirche, Arme oder Memoria zur Seelenhilfe", ["Nur moderne Venture-Capital", "Nur olympische Sponsoring-Deals ohne Kirche", "Nur Ablehnung jeder Gabe"], "Reiche sicherten Erinnerung und Gebet.", "Reiche sicherten Erinnerung und Gebet. Reiche sicherten Erinnerung und Gebet gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Stiftungen dienten oft der ___.", ["Seelenhilfe","Memoria"]),
    fact("stadtland", "Galt christliche Durchdringung nur auf dem Land?", "Nein — Stadt und Land waren christlich geprägt, unterschiedlich im Alltag", ["Nur das Land kannte Kirche", "Nur Städte kannten Kirche", "Nirgends gab es Kirche"], "Lehrplan nennt Stadt und Land.", "Lehrplan nennt Stadt und Land. Lehrplan nennt Stadt und Land gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Christliche Prägung galt in Stadt und ___.", ["Land"]),
    fact("quelle", "Warum nennt der Lehrplan schriftliche Quellen?", "Weil Frömmigkeit in Texten, Gebeten und Vorschriften greifbar wird", ["Weil Quellen nutzlos sind", "Weil nur Bilder zählen", "Weil Schreiben verboten war"], "Methodenbewusstsein: schriftliche Quellen.", "Methodenbewusstsein: schriftliche Quellen. Methodenbewusstsein: schriftliche Quellen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Schriftliche Quellen machen ___ greifbar.", ["Frömmigkeit"]),
    fact("lehrplan", "Welches Ziel steckt hinter diesem Thema?", "Christliche Durchdringung des Alltags als Prägung des Mittelalters erfassen", ["Nur moderne Medienanalyse allein", "Nur Chemie", "Nur Sport"], "Urteilsziel der Klassenstufe.", "Urteilsziel der Klassenstufe. Urteilsziel der Klassenstufe gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Christliche Durchdringung prägte den mittelalterlichen ___.", ["Alltag"])
  ],
  pairs: [
    pair("p1", "Pfarrkirche", "Zentrum der Gemeinde", "Gottesdienst und Rituale."),
    pair("p2", "Festkalender", "Kirchliche Jahresgliederung", "Fasten und Feiertage."),
    pair("p3", "Buße", "Reue und Wiedergutmachung", "Bezug zum Seelenheil."),
    pair("p4", "Stiftung", "Gabe zur Seelenhilfe", "Memoria und Fürsorge.")
  ],
  trueFalse: [
    tf("t1", "Das Kirchenjahr gliederte den mittelalterlichen Alltag mit Festen und Fastenzeiten.", true, "Christliche Rituale strukturierten Zeit.", "Christliche Rituale strukturierten Zeit. Stadt und Land waren geprägt. Der Lehrplan nennt genau diese Durchdringung."),
    tf("t2", "Im Mittelalter spielte das Jenseits für das Denken der Menschen keine Rolle.", false, "Buße, gute Werke und Stiftungen zielten auf Heil.", "Buße, gute Werke und Stiftungen zielten auf Heil. Angst und Hoffnung bezogen sich aufs Jenseits. Das prägte den Alltag.")
  ],
  causeEffects: [
    causeEffect("Kirchlicher Festkalender", "Gliederung von Arbeit und Feiern", "Kirchlicher Festkalender führt zu: Gliederung von Arbeit und Feiern. Kirchlicher Festkalender führt zu: Gliederung von Arbeit und Feiern gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Angst vor dem Gericht Gottes", "Buße, Almosen und Stiftungen", "Angst vor dem Gericht Gottes führt zu: Buße, Almosen und Stiftungen. Angst vor dem Gericht Gottes führt zu: Buße, Almosen und Stiftungen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Pfarrkirche vor Ort", "Gemeinsame Rituale der Gemeinde", "Pfarrkirche vor Ort führt zu: Gemeinsame Rituale der Gemeinde. Pfarrkirche vor Ort führt zu: Gemeinsame Rituale der Gemeinde gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.")
  ],
  sources: [
    source("src1", "Worauf zielt die Haltung der Quelle?", "„Wer Almosen gibt und Buße tut, dem wird im Gericht barmherzig vergolten.“", "Didaktische Umschreibung mittelalterlicher Frömmigkeitslogik", "Gute Werke und Buße sollen dem Seelenheil dienen", ["Nur diesseitiger Reichtum zählt", "Religion war verboten", "Nur Turniere retten die Seele"] as [string, string, string], "Jenseitsorientierung prägte Handeln.", "Jenseitsorientierung prägte Handeln. Jenseitsorientierung prägte Handeln gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.")
  ],
}

const k6Lb2Kloester: BioBank = {
  quelle: "Wikipedia: Kloster",
  url: "https://de.wikipedia.org/wiki/Kloster",
  conceptPrefix: "ge:k6:kloester",
  facts: [
    fact("lebensform", "Was kennzeichnet klösterliche Lebensform?", "Gemeinschaft nach Regel mit Gebet, Arbeit und Gehorsam", ["Nur moderne Wohngemeinschaft ohne Regel", "Nur Ritterheere", "Nur Fabrikschichten"], "Benediktsregel war weit verbreitet.", "Benediktsregel war weit verbreitet. Benediktsregel war weit verbreitet gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Klösterliches Leben folgt einer ___.", ["Regel"]),
    fact("ora", "Was meint „ora et labora“?", "Bete und arbeite — Gebet und Arbeit gehören zusammen", ["Nur schlafen", "Nur kämpfen", "Nur handeln auf Märkten"], "Arbeit war Teil der Spiritualität.", "Arbeit war Teil der Spiritualität. Arbeit war Teil der Spiritualität gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Ora et labora heißt: Bete und ___.", ["arbeite","arbeit"]),
    fact("wirtschaft", "Welche wirtschaftliche Rolle hatten Klöster?", "Sie bewirtschafteten Land, produzierten und handelten", ["Sie hatten nie Besitz", "Nur olympische Läden", "Nur Pharaonengruben"], "Großklöster waren Wirtschaftszentren.", "Großklöster waren Wirtschaftszentren. Großklöster waren Wirtschaftszentren gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Klöster bewirtschafteten ___ und produzierten.", ["Land"]),
    fact("bildung", "Warum waren Klöster Bildungsorte?", "Weil Mönche schrieben, lasen und Schulen führten", ["Weil Lesen verboten war", "Weil nur Bauern lehrten", "Weil Bücher nutzlos waren"], "Skriptorien bewahrten Wissen.", "Skriptorien bewahrten Wissen. Skriptorien bewahrten Wissen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Klöster waren Orte von Schrift und ___.", ["Bildung"]),
    fact("bau", "Welche Ausstrahlung hatten Klosterbauwerke?", "Sie prägten Landschaft, Frömmigkeit und Macht sichtbarer Institutionen", ["Sie waren unsichtbar", "Nur moderne Hochhäuser", "Nur Zeltlager"], "Kirchen und Anlagen zeigten Bedeutung.", "Kirchen und Anlagen zeigten Bedeutung. Kirchen und Anlagen zeigten Bedeutung gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Klosterbauten prägten die ___.", ["Landschaft"]),
    fact("orden", "Was unterscheidet Orden grob?", "Verschiedene Regeln, Schwerpunkte und Ausbreitungswege", ["Alle Orden waren identisch", "Orden gab es nie", "Nur ein Orden weltweit je"], "Benediktiner, Zisterzienser u. a. sind Beispiele.", "Benediktiner, Zisterzienser u. a. sind Beispiele. Benediktiner, Zisterzienser u. a. sind Beispiele gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Orden unterscheiden sich in ___ und Schwerpunkten.", ["Regeln"]),
    fact("mission", "Wie wirkten Klöster nach außen?", "Durch Seelsorge, Mission, Fürsorge und Landesausbau", ["Gar nicht", "Nur durch moderne Werbung", "Nur durch Gladiatoren"], "Ausstrahlung war religiös und wirtschaftlich.", "Ausstrahlung war religiös und wirtschaftlich. Ausstrahlung war religiös und wirtschaftlich gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Klöster wirkten durch Seelsorge und ___.", ["Mission","Fürsorge"]),
    fact("exkursion", "Warum schlägt der Lehrplan Exkursionen vor?", "Weil Klöster vor Ort Lebensform und Bauwerke erfahrbar machen", ["Weil Exkursionen verboten sind", "Weil Klöster unsichtbar sind", "Weil nur Filme zählen"], "Überreste und Anlagen sind Quellen.", "Überreste und Anlagen sind Quellen. Überreste und Anlagen sind Quellen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Exkursionen machen Klöster vor Ort ___.", ["erfahrbar","greifbar"]),
    fact("frauen", "Gab es auch Frauenklöster?", "Ja — Nonnen lebten ebenfalls nach Regeln in Gemeinschaft", ["Nein, nie", "Nur in der Steinzeit", "Nur in Ägypten unter Pharaonen"], "Frauenklöster hatten eigene Bedeutung.", "Frauenklöster hatten eigene Bedeutung. Frauenklöster hatten eigene Bedeutung gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Auch ___ lebten in klösterlicher Gemeinschaft.", ["Nonnen","Frauen"]),
    fact("lehrplan", "Welches Lehrplanziel steckt hinter Klöstern?", "Bedeutung der Klöster: Lebensform und Ausstrahlung kennen", ["Nur Chemie der Steine", "Nur moderne Hotels", "Nur Sportstätten"], "Bauwerke gehören ausdrücklich dazu.", "Bauwerke gehören ausdrücklich dazu. Bauwerke gehören ausdrücklich dazu gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Lehrplan fordert Kenntnis klösterlicher ___ und Ausstrahlung.", ["Lebensform"])
  ],
  pairs: [
    pair("p1", "Klosterregel", "Ordnung für Gebet und Arbeit", "z. B. Benediktsregel."),
    pair("p2", "Skriptorium", "Schreibstube im Kloster", "Bewahrte und kopierte Texte."),
    pair("p3", "Zisterzienser", "Orden mit starkem Landesausbau", "Wirtschaftliche Ausstrahlung."),
    pair("p4", "Nonnenkloster", "Frauengemeinschaft nach Regel", "Eigene religiöse Zentren.")
  ],
  trueFalse: [
    tf("t1", "Klöster verbanden Gebet, Arbeit, Wirtschaft und Bildung.", true, "Lebensform nach Regel prägte den Alltag.", "Lebensform nach Regel prägte den Alltag. Bauwerke zeigten Ausstrahlung. Der Lehrplan nennt genau das."),
    tf("t2", "Mittelalterliche Klöster hatten keinerlei wirtschaftliche Bedeutung.", false, "Viele Klöster bewirtschafteten großen Landbesitz.", "Viele Klöster bewirtschafteten großen Landbesitz. Sie produzierten und handelten. Wirtschaft gehörte zur Ausstrahlung.")
  ],
  causeEffects: [
    causeEffect("Regelgebundenes Gemeinschaftsleben", "Stabile Ordnung von Gebet und Arbeit", "Regelgebundenes Gemeinschaftsleben führt zu: Stabile Ordnung von Gebet und Arbeit. Regelgebundenes Gemeinschaftsleben führt zu: Stabile Ordnung von Gebet und Arbeit gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Skriptorien und Schulen", "Bewahrung und Weitergabe von Wissen", "Skriptorien und Schulen führt zu: Bewahrung und Weitergabe von Wissen. Skriptorien und Schulen führt zu: Bewahrung und Weitergabe von Wissen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Landbesitz der Klöster", "Wirtschaftliche und politische Ausstrahlung", "Landbesitz der Klöster führt zu: Wirtschaftliche und politische Ausstrahlung. Landbesitz der Klöster führt zu: Wirtschaftliche und politische Ausstrahlung gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.")
  ],
}

const k6Lb3Juden: BioBank = {
  quelle: "Wikipedia: Juden im Mittelalter",
  url: "https://de.wikipedia.org/wiki/Geschichte_der_Juden_in_Deutschland",
  conceptPrefix: "ge:k6:juden",
  facts: [
    fact("minderheit", "Welche besondere Stellung hatten Juden im christlichen Mittelalter?", "Sie lebten als religiöse Minderheit unter christlicher Mehrheit", ["Sie waren die einzige erlaubte Religion", "Sie existierten in Europa nicht", "Sie waren nur Pharaonen"], "Rechtliche Sonderstellungen waren häufig.", "Rechtliche Sonderstellungen waren häufig. Rechtliche Sonderstellungen waren häufig gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Juden lebten als religiöse ___ in christlicher Gesellschaft.", ["Minderheit"]),
    fact("wirtschaft", "In welchen Bereichen wirkten Juden oft als Mitgestalter?", "In Wirtschaft, Handel, Geldgeschäften, Bildung und Medizin", ["Nur in olympischen Spielen", "Nur als Pharaonen", "Nur in der Raumfahrt"], "Lehrplan nennt Wirtschaft, Bildung, Handel, Medizin.", "Lehrplan nennt Wirtschaft, Bildung, Handel, Medizin. Lehrplan nennt Wirtschaft, Bildung, Handel, Medizin gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Juden wirkten u. a. in Handel und ___.", ["Medizin","Bildung","Wirtschaft"]),
    fact("stadt", "Wo lebten viele Juden im Mittelalter?", "In Städten — oft in eigenen Vierteln", ["Nur in ägyptischen Pyramiden", "Nur auf dem Land ohne Stadt", "Nur in modernen Vororten"], "Städtisches Leben bot Chancen und Risiken.", "Städtisches Leben bot Chancen und Risiken. Städtisches Leben bot Chancen und Risiken gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Viele Juden lebten in mittelalterlichen ___.", ["Städten"]),
    fact("schutz", "Von wem hing der Schutz oft ab?", "Von Königen, Kaisern oder Stadtherren gegen Abgaben", ["Nur von olympischen Komitees", "Von niemandem je", "Nur von Pharaonen"], "Schutzbriefe konnten Sicherheit geben — und Abhängigkeit.", "Schutzbriefe konnten Sicherheit geben — und Abhängigkeit. Schutzbriefe konnten Sicherheit geben — und Abhängigkeit gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Schutz hing oft von ___ oder Stadtherren ab.", ["Königen","Kaisern","Herren"]),
    fact("religion", "Was kennzeichnet jüdisches Gemeindeleben?", "Synagoge, Gelehrsamkeit, Rituale und eigene Rechtsauslegung", ["Nur christliche Messen", "Nur römische Tempel", "Nur Ablehnung jeder Schrift"], "Bildung hatte hohen Stellenwert.", "Bildung hatte hohen Stellenwert. Bildung hatte hohen Stellenwert gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Zentrum war oft die ___.", ["Synagoge"]),
    fact("beitrag", "Warum betont der Lehrplan „Mitgestalter“?", "Weil Juden Kultur und Wirtschaft mitprägten — nicht nur Opferrollen", ["Weil sie keine Rolle spielten", "Weil nur Verfolgung zählt", "Weil Handel verboten war"], "Beiträge und Bedrohung gehören zusammen.", "Beiträge und Bedrohung gehören zusammen. Beiträge und Bedrohung gehören zusammen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Juden waren auch ___ von Wirtschaft und Bildung.", ["Mitgestalter"]),
    fact("recht", "Wie war die Rechtsstellung oft?", "Sonderrechtlich — geduldet, aber nicht gleichberechtigt", ["Völlig identisch mit allen Christen immer", "Ohne jede Regel", "Nur modernes Staatsbürgerrecht"], "Duldung konnte widerrufen werden.", "Duldung konnte widerrufen werden. Duldung konnte widerrufen werden gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Die Rechtsstellung war oft ___.", ["sonderrechtlich","ungleich"]),
    fact("medizin", "Welche Rolle spielten Juden in der Medizin?", "Einige wirkten als Ärzte und vermittelten Fachwissen", ["Medizin war ihnen verboten überall immer", "Nur als Tierärzte der Steinzeit", "Nur als Pharaonenärzte"], "Lehrplan nennt Medizin ausdrücklich.", "Lehrplan nennt Medizin ausdrücklich. Lehrplan nennt Medizin ausdrücklich gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Juden wirkten auch in der ___.", ["Medizin"]),
    fact("bildung", "Warum war Bildung wichtig?", "Weil Schriftgelehrsamkeit zentral für Religion und Beruf war", ["Weil Lesen verboten war", "Weil nur Analphabetismus zählte", "Weil Bücher nutzlos waren"], "Schulen und Gelehrte prägten Gemeinden.", "Schulen und Gelehrte prägten Gemeinden. Schulen und Gelehrte prägten Gemeinden gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Schriftgelehrsamkeit war zentral für ___.", ["Religion","Bildung"]),
    fact("lehrplan", "Welches Urteilsziel nennt der Lehrplan?", "Toleranz gegenüber Andersdenkenden reflektieren", ["Fanatismus begrüßen", "Minderheiten ignorieren", "Nur Konflikte feiern"], "Reflexionsfähigkeit: Toleranz.", "Reflexionsfähigkeit: Toleranz. Reflexionsfähigkeit: Toleranz gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Lehrplan zielt auf ___ gegenüber Andersdenkenden.", ["Toleranz"])
  ],
  pairs: [
    pair("p1", "Minderheit", "Religiöse Gruppe unter Mehrheit", "Sonderrechtliche Stellung."),
    pair("p2", "Synagoge", "Zentrum jüdischen Gemeindelebens", "Gebet und Gelehrsamkeit."),
    pair("p3", "Schutzbrief", "Herrscherliche Duldungszusage", "Gegen Abgaben oft."),
    pair("p4", "Mitgestalter", "Beitrag zu Wirtschaft und Bildung", "Lehrplanbegriff.")
  ],
  trueFalse: [
    tf("t1", "Juden wirkten im Mittelalter u. a. in Handel, Bildung und Medizin mit.", true, "Der Lehrplan nennt sie ausdrücklich als Mitgestalter.", "Der Lehrplan nennt sie ausdrücklich als Mitgestalter. Zugleich waren sie Minderheit. Beides gehört zusammen."),
    tf("t2", "Juden lebten im christlichen Mittelalter als voll gleichberechtigte Mehrheit.", false, "Sie waren Minderheit mit Sonderrecht.", "Sie waren Minderheit mit Sonderrecht. Duldung war widerrufbar. Gleichberechtigung im modernen Sinn gab es nicht.")
  ],
  causeEffects: [
    causeEffect("Sonderrechtliche Duldung", "Abhängigkeit vom Schutz des Herrn", "Sonderrechtliche Duldung führt zu: Abhängigkeit vom Schutz des Herrn. Sonderrechtliche Duldung führt zu: Abhängigkeit vom Schutz des Herrn gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Tätigkeit in Handel und Medizin", "Wirtschaftlicher und kultureller Beitrag", "Tätigkeit in Handel und Medizin führt zu: Wirtschaftlicher und kultureller Beitrag. Tätigkeit in Handel und Medizin führt zu: Wirtschaftlicher und kultureller Beitrag gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Leben in der Stadt", "Nähe zu Markt und Gemeindezentrum", "Leben in der Stadt führt zu: Nähe zu Markt und Gemeindezentrum. Leben in der Stadt führt zu: Nähe zu Markt und Gemeindezentrum gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.")
  ],
}

const k6Lb3JudenVerfolgung: BioBank = {
  quelle: "Wikipedia: Judenverfolgung",
  url: "https://de.wikipedia.org/wiki/Judenverfolgung",
  conceptPrefix: "ge:k6:juden-verfolgung",
  facts: [
    fact("duldung", "Was meint Duldung hier?", "Befristete oder widerrufbare Erlaubnis zu leben und zu arbeiten", ["Ewige Gleichberechtigung", "Sofortige Vertreibung immer", "Nur olympische Gastrechte"], "Duldung ist nicht sichere Gleichstellung.", "Duldung ist nicht sichere Gleichstellung. Duldung ist nicht sichere Gleichstellung gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Duldung war oft ___ und widerrufbar.", ["befristet","unsicher"]),
    fact("ghetto", "Was war ein Ghetto im mittelalterlichen Kontext grob?", "Ein abgegrenztes Wohnviertel für Juden", ["Ein modernes Einkaufszentrum", "Ein Pharaonenpalast", "Ein Ritterturnierplatz"], "Zwang und Kontrolle konnten zunehmen.", "Zwang und Kontrolle konnten zunehmen. Zwang und Kontrolle konnten zunehmen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Ein ___ war ein abgegrenztes Wohnviertel.", ["Ghetto"]),
    fact("pogrom", "Was ist ein Pogrom?", "Ein gewaltsamer Angriff auf eine jüdische Gemeinde", ["Eine friedliche Handelsmesse", "Eine olympische Eröffnung", "Eine Klostergründung"], "Plünderung und Mord kamen vor.", "Plünderung und Mord kamen vor. Plünderung und Mord kamen vor gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Ein ___ ist ein gewaltsamer Angriff auf Juden.", ["Pogrom"]),
    fact("pest", "Welcher Zusammenhang besteht mit dem „Schwarzen Tod“?", "Juden wurden fälschlich beschuldigt und oft verfolgt", ["Juden erfanden die Pest", "Die Pest betraf nur Ritter", "Es gab keinen Zusammenhang je"], "Sündenbock-Mechanismen eskalierten Gewalt.", "Sündenbock-Mechanismen eskalierten Gewalt. Sündenbock-Mechanismen eskalierten Gewalt gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Zur Zeit des Schwarzen Todes wurden Juden oft ___.", ["beschuldigt","verfolgt"]),
    fact("vorurteil", "Welche Vorurteile schürten Gewalt?", "Ritualmordlegenden, Hostienfrevel und Wucherbilder", ["Nur moderne Wetterdaten", "Nur olympische Ergebnisse", "Nur korrekte Wissenschaft"], "Feindbilder rechtfertigten Übergriffe.", "Feindbilder rechtfertigten Übergriffe. Feindbilder rechtfertigten Übergriffe gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Feindbilder und ___ schürten Gewalt.", ["Vorurteile","Legenden"]),
    fact("vertreibung", "Was folgte auf Verfolgung oft?", "Vertreibung, Flucht oder Vernichtung von Gemeinden", ["Sofortige Gleichstellung", "Nur Beförderungen", "Nur Städtewachstum ohne Leid"], "Viele Gemeinden wurden zerstört.", "Viele Gemeinden wurden zerstört. Viele Gemeinden wurden zerstört gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Verfolgung führte oft zu ___ oder Flucht.", ["Vertreibung"]),
    fact("stadt", "Wie zeigte sich Verfolgung in der Stadt?", "Durch Ausgrenzung, Zwangsviertel und Übergriffe", ["Durch totale Gleichheit", "Durch Abschaffung jeder Stadt", "Durch nur friedliche Feste immer"], "Städtische Ordnung konnte schützen oder bedrohen.", "Städtische Ordnung konnte schützen oder bedrohen. Städtische Ordnung konnte schützen oder bedrohen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "In Städten gab es Ausgrenzung und ___.", ["Übergriffe","Zwangsviertel"]),
    fact("urteil", "Warum ist das Thema für Werteorientierung zentral?", "Weil es Toleranz schärft und Fanatismus ablehnen lässt", ["Weil Verfolgung begrüßenswert wäre", "Weil Minderheiten egal sind", "Weil Geschichte nur Feiern kennt"], "Lehrplan: Toleranz gegenüber Andersdenkenden.", "Lehrplan: Toleranz gegenüber Andersdenkenden. Lehrplan: Toleranz gegenüber Andersdenkenden gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Das Thema schärft ___ und lehnt Fanatismus ab.", ["Toleranz"]),
    fact("quelle", "Wie sollte man Verfolgungsberichte lesen?", "Kritisch — Absicht, Übertreibung und Kontext prüfen", ["Als immer wörtlich ohne Prüfung", "Gar nicht", "Nur als Witze"], "Quellenarbeit schützt vor naiver Übernahme.", "Quellenarbeit schützt vor naiver Übernahme. Quellenarbeit schützt vor naiver Übernahme gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Verfolgungsberichte brauchen ___ Prüfung.", ["kritische"]),
    fact("lehrplan", "Welche Begriffe nennt der Lehrplan ausdrücklich?", "Schwarzer Tod, Ghetto, Pogrom", ["Nur Smartphone, App, Cloud", "Nur Pharao, Nil, Pyramide", "Nur Fabrik, Dampf, Kohle"], "Duldung und Verfolgung gehören zusammen.", "Duldung und Verfolgung gehören zusammen. Duldung und Verfolgung gehören zusammen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Lehrplan nennt u. a. Ghetto und ___.", ["Pogrom","Schwarzer Tod"])
  ],
  pairs: [
    pair("p1", "Pogrom", "Gewalt gegen jüdische Gemeinde", "Oft mit Plünderung."),
    pair("p2", "Ghetto", "Abgegrenztes Wohnviertel", "Kontrolle und Ausgrenzung."),
    pair("p3", "Schwarzer Tod", "Pestpandemie Mitte 14. Jh.", "Anlass für Verfolgungen."),
    pair("p4", "Sündenbock", "Unschuldigen die Schuld geben", "Mechanismen der Gewalt.")
  ],
  trueFalse: [
    tf("t1", "Zur Zeit des Schwarzen Todes wurden Juden häufig zu Unrecht beschuldigt und verfolgt.", true, "Sündenbock-Logik eskalierte Gewalt.", "Sündenbock-Logik eskalierte Gewalt. Ghetto und Pogrom nennt der Lehrplan. Toleranz ist das Reflexionsziel."),
    tf("t2", "Duldung bedeutete im Mittelalter sichere, unwiderrufliche Gleichberechtigung der Juden.", false, "Duldung war widerrufbar.", "Duldung war widerrufbar. Sonderrecht blieb. Verfolgung konnte rasch folgen.")
  ],
  causeEffects: [
    causeEffect("Pestangst und Gerüchte", "Gewalt gegen jüdische Gemeinden", "Pestangst und Gerüchte führt zu: Gewalt gegen jüdische Gemeinden. Pestangst und Gerüchte führt zu: Gewalt gegen jüdische Gemeinden gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Feindbilder und Legenden", "Rechtfertigung von Pogromen", "Feindbilder und Legenden führt zu: Rechtfertigung von Pogromen. Feindbilder und Legenden führt zu: Rechtfertigung von Pogromen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Widerruf der Duldung", "Vertreibung oder Vernichtung", "Widerruf der Duldung führt zu: Vertreibung oder Vernichtung. Widerruf der Duldung führt zu: Vertreibung oder Vernichtung gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.")
  ],
  sources: [
    source("src1", "Welche Haltung zeigt die Quelle?", "„Man wies ihnen eigene Gassen zu und verbot den Umgang — angeblich zum Schutz, tatsächlich zur Trennung.“", "Didaktische Umschreibung städtischer Ausgrenzung", "Zwangstrennung und Kontrolle unter dem Vorwand des Schutzes", ["Vollständige Gleichstellung", "Nur freiwillige Nachbarschaftsfeste", "Abschaffung jeder Stadtordnung"] as [string, string, string], "Ghettoisierung war Ausgrenzung.", "Ghettoisierung war Ausgrenzung. Ghettoisierung war Ausgrenzung gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.")
  ],
}

const k6Lb3Kreuzzuege: BioBank = {
  quelle: "Wikipedia: Kreuzzüge",
  url: "https://de.wikipedia.org/wiki/Kreuzzug",
  conceptPrefix: "ge:k6:kreuzzuege",
  facts: [
    fact("begriff", "Was waren die Kreuzzüge?", "Militärische Unternehmungen mit religiösem Anspruch, v. a. in den Vorderen Orient", ["Nur friedliche Messen", "Nur olympische Spiele", "Nur Industrieexpeditionen"], "Ab dem späten 11. Jahrhundert.", "Ab dem späten 11. Jahrhundert. Ab dem späten 11. Jahrhundert gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Kreuzzüge waren ___ mit religiösem Anspruch.", ["militärische Unternehmungen","Kriegszüge"]),
    fact("jerusalem", "Warum war Jerusalem zentral?", "Weil die Stadt für Christen (und andere Religionen) heilig ist", ["Weil dort Fabriken standen", "Weil die NATO gegründet wurde", "Weil nur Sport zählte"], "Heiligkeit steigerte Mobilisierung.", "Heiligkeit steigerte Mobilisierung. Heiligkeit steigerte Mobilisierung gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Jerusalem ist für Christen eine ___ Stadt.", ["heilige"]),
    fact("motive", "Welche Motive spielten mit?", "Frömmigkeit, Herrschaft, Ablass, Abenteuer und Gewinn", ["Nur moderne Aktien", "Nur Ablehnung jeder Religion", "Nur Bau von Pyramiden"], "Motive waren gemischt.", "Motive waren gemischt. Motive waren gemischt gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Motive waren Frömmigkeit, Herrschaft und ___.", ["Gewinn","Abenteuer"]),
    fact("dschihad", "Warum nennt der Lehrplan auch Dschihad?", "Weil beide Seiten religiös aufgeladene Kampfbegriffe nutzten", ["Weil Dschihad nur Sport meint", "Weil es keine islamische Seite gab", "Weil nur Latein zählt"], "„Heilige Kriege?“ — mit Fragezeichen im Lehrplan.", "„Heilige Kriege?“ — mit Fragezeichen im Lehrplan. „Heilige Kriege?“ — mit Fragezeichen im Lehrplan gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Lehrplan stellt Kreuzzüge und ___ gegenüber.", ["Dschihad"]),
    fact("gewalt", "Welche Folgen hatten Kreuzzüge?", "Gewalt, Herrschaftsbildungen und langanhaltende Feindbilder", ["Sofortige Weltfriedensordnung", "Abschaffung aller Religionen", "Nur Handelsmessen ohne Leid"], "Zivilisten litten schwer.", "Zivilisten litten schwer. Zivilisten litten schwer gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Kreuzzüge hinterließen Gewalt und ___.", ["Feindbilder"]),
    fact("staaten", "Was entstanden zeitweise im Orient?", "Kreuzfahrerherrschaften / lateinische Staaten", ["Die Europäische Union", "Das Pharaonenreich", "Nur Nomadenlager ohne Herrschaft"], "Sie waren oft fragil.", "Sie waren oft fragil. Sie waren oft fragil gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Zeitweise entstanden ___.", ["Kreuzfahrerstaaten","lateinische Staaten"]),
    fact("frage", "Warum schreibt der Lehrplan „Heilige Kriege?“ mit Fragezeichen?", "Weil religiöse Legitimation von Gewalt kritisch zu prüfen ist", ["Weil Kriege nie religiös begründet wurden", "Weil Fragezeichen verboten sind", "Weil nur Feiern erlaubt ist"], "Positionierung ist gefordert.", "Positionierung ist gefordert. Positionierung ist gefordert gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Religiöse Legitimation von ___ ist kritisch zu prüfen.", ["Gewalt","Krieg"]),
    fact("handel", "Gab es trotz Kriegen Kontakt?", "Ja — Handel und kultureller Austausch bestanden weiter", ["Nein, nie", "Nur über Atomkraft", "Nur über Fußball"], "Mit- und Gegeneinander zugleich.", "Mit- und Gegeneinander zugleich. Mit- und Gegeneinander zugleich gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Trotz Kriegen gab es ___ und Austausch.", ["Handel"]),
    fact("urteil", "Welches Urteil ist gefordert?", "Sich positionieren zwischen Absolutheitsanspruch, Duldung und Austausch", ["Nur eine Seite vorbehaltlos feiern", "Quellen ignorieren", "Toleranz ablehnen"], "Lehrplanziel klar.", "Lehrplanziel klar. Lehrplanziel klar gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Gefordert ist eine ___ zwischen Anspruch, Duldung und Austausch.", ["Positionierung","Stellungnahme"]),
    fact("heute", "Welchen Gegenwartsbezug hat das Thema?", "Es warnt vor religiösem Fanatismus und schärft Toleranz", ["Es empfiehlt Fanatismus", "Es betrifft nur die Steinzeit", "Es zeigt Isolation als Ideal"], "Klassenstufe-Ziele nennen Religionsfreiheit.", "Klassenstufe-Ziele nennen Religionsfreiheit. Klassenstufe-Ziele nennen Religionsfreiheit gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Das Thema schärft ___ und lehnt Fanatismus ab.", ["Toleranz","Religionsfreiheit"])
  ],
  pairs: [
    pair("p1", "Kreuzzug", "Christlicher Kriegszug mit Heilsanspruch", "Ab dem 11. Jahrhundert."),
    pair("p2", "Dschihad", "Islamisch aufgeladener Kampfbegriff", "Lehrplan stellt beiden Seiten gegenüber."),
    pair("p3", "Jerusalem", "Heilige Stadt", "Mobilisierte Emotionen und Heere."),
    pair("p4", "Feindbild", "Vereinfachte Abwertung", "Kann lange nachwirken.")
  ],
  trueFalse: [
    tf("t1", "Der Lehrplan fordert eine kritische Positionierung zu „heiligen Kriegen“.", true, "Kreuzzüge und Dschihad werden gegenübergestellt.", "Kreuzzüge und Dschihad werden gegenübergestellt. Absolutheitsanspruch, Duldung und Austausch sind zu bedenken. Fanatismus soll abgelehnt werden."),
    tf("t2", "Kreuzzüge waren ausschließlich friedliche Handelsmessen ohne Gewalt.", false, "Sie waren militärische Unternehmungen.", "Sie waren militärische Unternehmungen. Gewalt und Feindbilder folgten. Genau deshalb ist Urteil nötig.")
  ],
  sorts: [
    sort("motive", "Ordne typische Motivlagen von eher religiös zu eher weltlich (vereinfacht)", ["Frömmigkeit / Ablass","Herrschaft über Land","Handels- und Beuteinteresse"], "Motive mischten sich; die Reihenfolge ist didaktisch vereinfacht.", "Motive mischten sich; die Reihenfolge ist didaktisch vereinfacht. Motive mischten sich; die Reihenfolge ist didaktisch vereinfacht gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.")
  ],
  causeEffects: [
    causeEffect("Heiligkeit Jerusalems", "Starke Mobilisierung von Kreuzfahrern", "Heiligkeit Jerusalems führt zu: Starke Mobilisierung von Kreuzfahrern. Heiligkeit Jerusalems führt zu: Starke Mobilisierung von Kreuzfahrern gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Religiöse Absolutheitsansprüche", "Legitimation von Gewalt", "Religiöse Absolutheitsansprüche führt zu: Legitimation von Gewalt. Religiöse Absolutheitsansprüche führt zu: Legitimation von Gewalt gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Krieg und Kontakt zugleich", "Mit- und Gegeneinander der Kulturen", "Krieg und Kontakt zugleich führt zu: Mit- und Gegeneinander der Kulturen. Krieg und Kontakt zugleich führt zu: Mit- und Gegeneinander der Kulturen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.")
  ],
}

const k6Lb3AlAndalus: BioBank = {
  quelle: "Wikipedia: Al-Andalus",
  url: "https://de.wikipedia.org/wiki/Al-Andalus",
  conceptPrefix: "ge:k6:al-andalus",
  facts: [
    fact("begriff", "Was war Al-Andalus?", "Der muslimisch geprägte Teil der Iberischen Halbinsel im Mittelalter", ["Nur das antike Sparta", "Nur das moderne Spanien ohne Geschichte", "Nur ein Pharaonenreich"], "Südspanien ist Lehrplanbeispiel.", "Südspanien ist Lehrplanbeispiel. Südspanien ist Lehrplanbeispiel gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Al-Andalus meint muslimisch geprägtes ___.", ["Südspanien","Iberien"]),
    fact("cordoba", "Wofür war Córdoba bekannt?", "Als bedeutendes Zentrum von Kultur, Wissenschaft und Macht", ["Als Sitz der NATO", "Als alleinige Steinzeitstation", "Als Ort ohne Schrift"], "Bibliotheken und Gelehrte prägten das Bild.", "Bibliotheken und Gelehrte prägten das Bild. Bibliotheken und Gelehrte prägten das Bild gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Córdoba war ein Zentrum von Kultur und ___.", ["Wissenschaft","Macht"]),
    fact("vielfalt", "Welche Religionsgruppen lebten dort?", "Muslime, Christen und Juden — in wechselnden Verhältnissen", ["Nur eine Religion je", "Nur Athleten ohne Glauben", "Nur Pharaonenpriester"], "Zusammenleben war nicht konfliktfrei.", "Zusammenleben war nicht konfliktfrei. Zusammenleben war nicht konfliktfrei gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Es lebten Muslime, Christen und ___.", ["Juden"]),
    fact("duldung", "Was meint Duldung in diesem Kontext?", "Zulassung anderer Religionen unter muslimischer Herrschaft mit Auflagen", ["Vollständige Gleichheit immer", "Sofortige Vertreibung aller", "Nur olympische Gaststatus"], "Schutz gegen Abgaben und Einschränkungen.", "Schutz gegen Abgaben und Einschränkungen. Schutz gegen Abgaben und Einschränkungen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Andere Religionen wurden oft unter Auflagen ___.", ["geduldet"]),
    fact("austausch", "Welcher kulturelle Austausch fand statt?", "Sprache, Wissenschaft, Architektur und Alltagspraktiken beeinflussten sich", ["Gar keiner", "Nur moderne Popkultur", "Nur Ablehnung jeder Schrift"], "Übersetzungen vermittelten Wissen.", "Übersetzungen vermittelten Wissen. Übersetzungen vermittelten Wissen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Es gab Austausch in Wissenschaft und ___.", ["Architektur","Sprache"]),
    fact("konflikt", "Gab es nur friedliche Konvivenz?", "Nein — Phasen von Duldung, Druck und Konflikt wechselten", ["Ja, nur ewiger Frieden", "Es gab nie Kontakt", "Nur Sportwettkämpfe"], "Lehrplan: Absolutheitsanspruch, Duldung, Austausch.", "Lehrplan: Absolutheitsanspruch, Duldung, Austausch. Lehrplan: Absolutheitsanspruch, Duldung, Austausch gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Duldung und ___ wechselten sich ab.", ["Konflikt","Druck"]),
    fact("architektur", "Welche Bauwerke prägen die Erinnerung?", "Moscheen, Paläste und später umgewidmete Kirchenbauten", ["Nur moderne Hochhäuser", "Nur Pyramiden am Nil", "Nur Fabriken"], "Materielle Spuren bleiben sichtbar.", "Materielle Spuren bleiben sichtbar. Materielle Spuren bleiben sichtbar gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Moscheen und ___ prägen die Erinnerung.", ["Paläste"]),
    fact("lehrplan", "Warum nennt der Lehrplan Südspanien?", "Als Beispiel für Zusammentreffen von Christentum und Islam", ["Als reines Chemiethema", "Als nur moderne Mediengeschichte", "Als olympische Disziplin"], "Positionierung ist gefordert.", "Positionierung ist gefordert. Positionierung ist gefordert gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Südspanien ist Beispiel für das ___ der Religionen.", ["Zusammentreffen","Mit- und Gegeneinander"]),
    fact("wissen", "Welche Wissensgebiete blühten?", "Unter anderem Philosophie, Medizin, Astronomie und Mathematik", ["Nur Ablehnung jeder Wissenschaft", "Nur moderne Informatik allein", "Nur Steinzeittechnik"], "Gelehrte übersetzten und erweiterten Texte.", "Gelehrte übersetzten und erweiterten Texte. Gelehrte übersetzten und erweiterten Texte gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Blüte in Medizin, Astronomie und ___.", ["Mathematik","Philosophie"]),
    fact("urteil", "Welches differenzierte Urteil ist angemessen?", "Weder Idealisierung noch pauschale Verdammung des Zusammenlebens", ["Nur Feiern ohne Kritik", "Nur Ablehnung ohne Quellen", "Ignorieren des Themas"], "Quellen und Wandel beachten.", "Quellen und Wandel beachten. Quellen und Wandel beachten gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Angemessen ist weder Idealisierung noch pauschale ___.", ["Verdammung"])
  ],
  pairs: [
    pair("p1", "Al-Andalus", "Muslimisches Südspanien", "Lehrplanbeispiel."),
    pair("p2", "Córdoba", "Kultur- und Wissenschaftszentrum", "Bedeutende Metropole."),
    pair("p3", "Duldung", "Zulassung unter Auflagen", "Nicht volle Gleichheit."),
    pair("p4", "Konvivenz", "Zusammenleben verschiedener Gruppen", "Historisch wechselhaft.")
  ],
  trueFalse: [
    tf("t1", "Al-Andalus ist ein Lehrplanbeispiel für Begegnung von Islam und Christentum.", true, "Südspanien zeigt Duldung, Austausch und Konflikt.", "Südspanien zeigt Duldung, Austausch und Konflikt. Córdoba steht für kulturelle Blüte. Differenzierung ist nötig."),
    tf("t2", "In Al-Andalus lebten ausschließlich Menschen einer einzigen Religion ohne Kontakt.", false, "Muslime, Christen und Juden lebten in wechselnden Verhältnissen.", "Muslime, Christen und Juden lebten in wechselnden Verhältnissen. Austausch und Konflikt kamen vor. Genau das verlangt der Lehrplan.")
  ],
  causeEffects: [
    causeEffect("Muslimische Herrschaft in Südspanien", "Duldung anderer Religionen unter Auflagen", "Muslimische Herrschaft in Südspanien führt zu: Duldung anderer Religionen unter Auflagen. Muslimische Herrschaft in Südspanien führt zu: Duldung anderer Religionen unter Auflagen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Gelehrtenkultur in Córdoba", "Blüte von Wissenschaft und Architektur", "Gelehrtenkultur in Córdoba führt zu: Blüte von Wissenschaft und Architektur. Gelehrtenkultur in Córdoba führt zu: Blüte von Wissenschaft und Architektur gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Wechselnde Machtverhältnisse", "Phasen von Druck und Konflikt", "Wechselnde Machtverhältnisse führt zu: Phasen von Druck und Konflikt. Wechselnde Machtverhältnisse führt zu: Phasen von Druck und Konflikt gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.")
  ],
}

const k6Lb3Kulturtransfer: BioBank = {
  quelle: "Wikipedia: Islamische Wissenschaft",
  url: "https://de.wikipedia.org/wiki/Wissenschaft_im_islamischen_Mittelalter",
  conceptPrefix: "ge:k6:kulturtransfer",
  facts: [
    fact("medizin", "Welche Rolle spielte Medizin im Kulturkontakt?", "Wissen wurde übersetzt, gelehrt und weitergegeben", ["Medizin existierte nie", "Nur olympische Sportmedizin", "Nur Ablehnung jeder Heilkunde"], "Lehrplan nennt Medizin ausdrücklich.", "Lehrplan nennt Medizin ausdrücklich. Lehrplan nennt Medizin ausdrücklich gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Medizinisches ___ wurde übersetzt und gelehrt.", ["Wissen"]),
    fact("wissenschaft", "Was kennzeichnet wissenschaftliche Blüte in islamischen Räumen?", "Pflege von Astronomie, Mathematik, Philosophie und Übersetzungen", ["Nur Ablehnung jeder Messung", "Nur Steinzeitwerkzeuge", "Nur moderne Smartphones"], "Bibliotheken und Schulen waren Zentren.", "Bibliotheken und Schulen waren Zentren. Bibliotheken und Schulen waren Zentren gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Blüte in Astronomie, Mathematik und ___.", ["Philosophie"]),
    fact("handel", "Wie förderte Handel den Transfer?", "Waren, Menschen und Ideen zirkulierten über weite Netze", ["Handel war verboten", "Nur lokale Tauschwirtschaft ohne Kontakt", "Nur Atomhandel"], "Mittelmeer und Landwege verbanden Räume.", "Mittelmeer und Landwege verbanden Räume. Mittelmeer und Landwege verbanden Räume gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Handel ließ Waren und ___ zirkulieren.", ["Ideen","Menschen"]),
    fact("uebersetzung", "Warum waren Übersetzungen wichtig?", "Weil sie antikes und neues Wissen zwischen Sprachen vermittelten", ["Weil niemand lesen wollte", "Weil Bücher nutzlos waren", "Weil Sprachen egal waren"], "Arabisch, Latein und andere Sprachen spielten Rollen.", "Arabisch, Latein und andere Sprachen spielten Rollen. Arabisch, Latein und andere Sprachen spielten Rollen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Übersetzungen vermittelten ___ zwischen Sprachen.", ["Wissen"]),
    fact("europa", "Wie wirkte Transfer auf Europa?", "Europäische Gelehrte übernahmen und entwickelten Wissen weiter", ["Europa blieb völlig unberührt", "Nur Ablehnung jeder Schrift", "Nur olympische Regeln"], "Später Universitäten profitierten.", "Später Universitäten profitierten. Später Universitäten profitierten gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Europa übernahm und entwickelte ___ weiter.", ["Wissen"]),
    fact("alltag", "Welche Alltagsgüter kamen über Handel?", "Unter anderem Gewürze, Textilien und technische Anregungen", ["Nur Smartphones", "Nur Atomstrom", "Gar nichts"], "Materieller Austausch begleitete Ideen.", "Materieller Austausch begleitete Ideen. Materieller Austausch begleitete Ideen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Handel brachte Gewürze und ___.", ["Textilien","Waren"]),
    fact("grenze", "War Transfer nur friedlich?", "Nein — er fand trotz und neben Konflikten statt", ["Nur bei ewigem Frieden", "Nie bei Krieg", "Nur im Weltraum"], "Mit- und Gegeneinander.", "Mit- und Gegeneinander. Mit- und Gegeneinander gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Transfer fand auch neben ___ statt.", ["Konflikten","Kriegen"]),
    fact("quelle", "Woran erkennt man Transfer in Quellen?", "An übersetzten Texten, Instrumenten, Bauformen und Berichten", ["An gar nichts", "Nur an modernen Apps", "Nur an Pharaonengräbern"], "Materielle und schriftliche Spuren.", "Materielle und schriftliche Spuren. Materielle und schriftliche Spuren gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Übersetzte Texte und ___ belegen Transfer.", ["Instrumente","Bauformen"]),
    fact("urteil", "Welches Urteil legt der Lehrplan nahe?", "Kultureller Austausch kann trotz Konflikten fruchtbar sein", ["Austausch sei unmöglich", "Nur Gewalt zähle", "Toleranz sei überflüssig"], "Positionierung zu Absolutheit, Duldung, Austausch.", "Positionierung zu Absolutheit, Duldung, Austausch. Positionierung zu Absolutheit, Duldung, Austausch gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Austausch kann trotz Konflikten ___.", ["fruchtbar","produktiv"]),
    fact("lehrplan", "Welche drei Bereiche nennt der Lehrplan ausdrücklich?", "Medizin, Wissenschaft, Handel", ["Nur Sport, Musik, Tanz", "Nur Pyramide, Nil, Pharao", "Nur Fabrik, Dampf, Kohle"], "Kern des Kulturkontakts.", "Kern des Kulturkontakts. Kern des Kulturkontakts gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Lehrplan nennt Medizin, Wissenschaft und ___.", ["Handel"])
  ],
  pairs: [
    pair("p1", "Übersetzung", "Vermittlung von Wissen zwischen Sprachen", "Schlüssel des Transfers."),
    pair("p2", "Medizin", "Heilkunde als Transferfeld", "Lehrplanbeispiel."),
    pair("p3", "Handelsnetz", "Wege für Waren und Ideen", "Mittelmeer und Landrouten."),
    pair("p4", "Gelehrtenkultur", "Pflege von Wissenschaft", "Bibliotheken und Schulen.")
  ],
  trueFalse: [
    tf("t1", "Medizin, Wissenschaft und Handel sind laut Lehrplan zentrale Felder des Kulturkontakts.", true, "Wissen wurde übersetzt und weitergegeben.", "Wissen wurde übersetzt und weitergegeben. Handel transportierte Ideen. Austausch bestand auch neben Konflikten."),
    tf("t2", "Zwischen christlichen und islamischen Räumen gab es keinerlei wissenschaftlichen Austausch.", false, "Übersetzungen und Gelehrtenkontakte belegen Transfer.", "Übersetzungen und Gelehrtenkontakte belegen Transfer. Europa profitierte später davon. Der Lehrplan nennt Wissenschaft ausdrücklich.")
  ],
  causeEffects: [
    causeEffect("Übersetzungen wissenschaftlicher Texte", "Weitergabe von Wissen über Sprachgrenzen", "Übersetzungen wissenschaftlicher Texte führt zu: Weitergabe von Wissen über Sprachgrenzen. Übersetzungen wissenschaftlicher Texte führt zu: Weitergabe von Wissen über Sprachgrenzen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Weite Handelsnetze", "Zirkulation von Waren und Ideen", "Weite Handelsnetze führt zu: Zirkulation von Waren und Ideen. Weite Handelsnetze führt zu: Zirkulation von Waren und Ideen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Gelehrtenzentren", "Blüte von Medizin und Astronomie", "Gelehrtenzentren führt zu: Blüte von Medizin und Astronomie. Gelehrtenzentren führt zu: Blüte von Medizin und Astronomie gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.")
  ],
}

const k6Lb3ToleranzHeute: BioBank = {
  quelle: "Wikipedia: Religionsfreiheit",
  url: "https://de.wikipedia.org/wiki/Religionsfreiheit",
  conceptPrefix: "ge:k6:toleranz-heute",
  facts: [
    fact("vielfalt", "Was meint kulturelle Vielfalt heute?", "Zusammenleben unterschiedlicher Kulturen, Religionen und Lebensweisen", ["Nur eine erlaubte Kultur", "Abschaffung jeder Differenz", "Nur Steinzeitkulturen"], "Lehrplan: kulturelles Vielfaltsthema.", "Lehrplan: kulturelles Vielfaltsthema. Lehrplan: kulturelles Vielfaltsthema gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Kulturelle ___ meint unterschiedliches Zusammenleben.", ["Vielfalt"]),
    fact("anwenden", "Was verlangt der Lehrplan methodisch?", "Kenntnisse zum Kulturzusammentreffen auf ein aktuelles Beispiel anzuwenden", ["Nur Mittelalter auswendig ohne Bezug", "Aktualität zu ignorieren", "Nur Antike zu feiern"], "Transfer auf Gegenwart.", "Transfer auf Gegenwart. Transfer auf Gegenwart gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Lehrplan fordert Anwendung auf ein ___ Beispiel.", ["aktuelles"]),
    fact("fundamentalismus", "Was kennzeichnet religiösen Fundamentalismus grob?", "Absolutheitsanspruch und Ablehnung pluraler Deutungen", ["Nur friedliche Diskussion", "Nur olympische Fairness", "Nur wissenschaftliche Offenheit"], "Lehrplan nennt Fundamentalismus und Terrorismus.", "Lehrplan nennt Fundamentalismus und Terrorismus. Lehrplan nennt Fundamentalismus und Terrorismus gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Fundamentalismus hängt mit ___ zusammen.", ["Absolutheitsanspruch"]),
    fact("terror", "Warum wird Terrorismus thematisiert?", "Weil extreme Gewalt im Namen von Ideologie/Religion aktuelle Konflikte prägt", ["Weil Terror irrelevant ist", "Weil nur Mittelalter zählt", "Weil Gewalt nie religiös begründet wird"], "Verantwortungsbereitschaft: Einsatz für Toleranz.", "Verantwortungsbereitschaft: Einsatz für Toleranz. Verantwortungsbereitschaft: Einsatz für Toleranz gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Terrorismus zeigt extreme ___ im Gegenwartsbezug.", ["Gewalt"]),
    fact("freiheit", "Was schützt Religionsfreiheit?", "Das Recht, Glauben zu haben, zu wechseln oder keinen zu haben — in rechtlichen Grenzen", ["Zwang zu einer Staatsreligion", "Verbot jeder Religion", "Nur Privileg einer Gruppe"], "Klassenstufe-Ziel: Wert der Religionsfreiheit.", "Klassenstufe-Ziel: Wert der Religionsfreiheit. Klassenstufe-Ziel: Wert der Religionsfreiheit gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Religionsfreiheit schützt das Recht auf ___.", ["Glauben","Religion"]),
    fact("toleranz", "Was meint Toleranz hier?", "Achtung anderer Überzeugungen ohne Preisgabe eigener Urteilskraft", ["Gleichgültigkeit gegen Unrecht", "Zustimmung zu Fanatismus", "Ablehnung jeder Differenz"], "Toleranz ≠ Beliebigkeit.", "Toleranz ≠ Beliebigkeit. Toleranz ≠ Beliebigkeit gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Toleranz meint Achtung anderer ___.", ["Überzeugungen","Überzeugung"]),
    fact("fanatismus", "Welche Haltung fordert der Lehrplan?", "Problembewusstsein für Toleranz und Ablehnung religiösen Fanatismus", ["Begeisterung für Fanatismus", "Ignorieren von Minderheiten", "Nur Gewalt als Lösung"], "Werteorientierung klar.", "Werteorientierung klar. Werteorientierung klar gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Lehrplan lehnt religiösen ___ ab.", ["Fanatismus"]),
    fact("geschichte", "Warum hilft Geschichte bei aktuellen Debatten?", "Weil Muster von Vorurteil, Konflikt und Austausch wiedererkannt werden", ["Weil Geschichte nutzlos ist", "Weil Gegenwart keine Bezüge hat", "Weil nur Zahlen zählen"], "Nicht Gleichsetzen, sondern urteilen lernen.", "Nicht Gleichsetzen, sondern urteilen lernen. Nicht Gleichsetzen, sondern urteilen lernen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Geschichte hilft, Muster von ___ und Austausch zu erkennen.", ["Konflikt","Vorurteil"]),
    fact("verantwortung", "Was meint Verantwortungsbereitschaft hier?", "Sich für kulturelle Toleranz einzusetzen", ["Toleranz zu bekämpfen", "Nur zuzuschauen", "Fanatismus zu fördern"], "Lehrplan nennt Verantwortungsbereitschaft.", "Lehrplan nennt Verantwortungsbereitschaft. Lehrplan nennt Verantwortungsbereitschaft gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Gefordert ist Einsatz für kulturelle ___.", ["Toleranz"]),
    fact("beispiel", "Was wäre ein sinnvolles aktuelles Übungsbeispiel?", "Ein Fall von religiöser Vielfalt, Konflikt oder Dialog in der Lebenswelt", ["Nur ein Pharaonenmythos ohne Bezug", "Nur Steinzeitjagd", "Nur olympische Medaillenliste"], "Lokal, medial oder gesellschaftlich möglich.", "Lokal, medial oder gesellschaftlich möglich. Lokal, medial oder gesellschaftlich möglich gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.", "Üben an einem Fall von Vielfalt, Konflikt oder ___.", ["Dialog"])
  ],
  pairs: [
    pair("p1", "Religionsfreiheit", "Recht auf Glauben oder Nichtglauben", "Grundrechtlicher Schutz."),
    pair("p2", "Fundamentalismus", "Absolutheitsanspruch", "Lehrplanbegriff."),
    pair("p3", "Toleranz", "Achtung anderer Überzeugungen", "Werteziel."),
    pair("p4", "Vielfalt", "Unterschiedliche Kulturen im Zusammenleben", "Gegenwartsbezug.")
  ],
  trueFalse: [
    tf("t1", "Der Lehrplan verlangt, Kenntnisse zum Kulturzusammentreffen auf ein aktuelles Beispiel anzuwenden.", true, "Kulturelle Vielfalt, Fundamentalismus und Terrorismus werden genannt.", "Kulturelle Vielfalt, Fundamentalismus und Terrorismus werden genannt. Ziel ist Einsatz für Toleranz. Geschichte schärft Urteil."),
    tf("t2", "Religionsfreiheit und Ablehnung von Fanatismus spielen im Lehrplan keine Rolle.", false, "Die Klassenstufe fordert Problembewusstsein für Religionsfreiheit.", "Die Klassenstufe fordert Problembewusstsein für Religionsfreiheit. Fanatismus soll abgelehnt werden. Genau das ist Werteorientierung.")
  ],
  causeEffects: [
    causeEffect("Absolutheitsanspruch", "Gefahr von Intoleranz und Gewalt", "Absolutheitsanspruch führt zu: Gefahr von Intoleranz und Gewalt. Absolutheitsanspruch führt zu: Gefahr von Intoleranz und Gewalt gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Religionsfreiheit", "Schutz vielfältiger Überzeugungen", "Religionsfreiheit führt zu: Schutz vielfältiger Überzeugungen. Religionsfreiheit führt zu: Schutz vielfältiger Überzeugungen gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt."),
    causeEffect("Historisches Urteil üben", "Bessere Einschätzung aktueller Konflikte", "Historisches Urteil üben führt zu: Bessere Einschätzung aktueller Konflikte. Historisches Urteil üben führt zu: Bessere Einschätzung aktueller Konflikte gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.")
  ],
  sources: [
    source("src1", "Welche Forderung steckt in der Aussage?", "„Wer Freiheit der Religion will, muss Fanatismus widersprechen — auch wenn der im Namen des eigenen Glaubens spricht.“", "Didaktische Umschreibung lehrplannaher Wertehaltung", "Religionsfreiheit schließt Ablehnung von Fanatismus ein", ["Fanatismus sei zu fördern", "Nur die eigene Gruppe habe Rechte", "Geschichte sei irrelevant"] as [string, string, string], "Werteziel der Klassenstufe.", "Werteziel der Klassenstufe. Werteziel der Klassenstufe gehört zum verbindlichen Lehrplanstoff und wird an Beispielen und Quellen geübt.")
  ],
}
/** Existing dense banks remapped / kept for LB2+LB3 continuity. */
export const GESCHICHTE_DENSE_K6_LB23_GENERATORS: Record<string, Topic['generate']> = {
  'ge-k6-lb2-frankenreich': bankGenerate(k6Lb2Frankenreich),
  'ge-k6-lb2-reichsbildung': bankGenerate(k6Lb2Reichsbildung),
  'ge-k6-lb2-missionierung': bankGenerate(k6Lb2Missionierung),
  'ge-k6-lb2-ostkolonisation': bankGenerate(k6Lb2Ostkolonisation),
  'ge-k6-lb2-heiliges-reich': bankGenerate(k6Lb2HeiligesReich),
  'ge-k6-lb2-weltlich-geistlich': bankGenerate(k6Lb2WeltlichGeistlich),
  'ge-k6-lb2-grundherrschaft': bankGenerate(k6Lb2Grundherrschaft),
  'ge-k6-lb2-burg-ritter': bankGenerate(k6Lb2BurgRitter),
  'ge-k6-lb2-alltag-froemmigkeit': bankGenerate(k6Lb2AlltagFroemmigkeit),
  'ge-k6-lb2-kloester': bankGenerate(k6Lb2Kloester),
  'ge-k6-lb3-juden': bankGenerate(k6Lb3Juden),
  'ge-k6-lb3-juden-verfolgung': bankGenerate(k6Lb3JudenVerfolgung),
  'ge-k6-lb3-kreuzzuege': bankGenerate(k6Lb3Kreuzzuege),
  'ge-k6-lb3-al-andalus': bankGenerate(k6Lb3AlAndalus),
  'ge-k6-lb3-kulturtransfer': bankGenerate(k6Lb3Kulturtransfer),
  'ge-k6-lb3-toleranz-heute': bankGenerate(k6Lb3ToleranzHeute),
}
