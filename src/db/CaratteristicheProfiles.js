const rankOrder = ["S", "A+", "A", "A-", "B", "B-", "C", "C-", "D", "E"];

const CaratteristicheProfiles = [
  {
    id: "mistico",
    rank: "S",
    title: "Mistico",
    description:
      "Massimizza l'Affinità Occulta e la resilienza mentale, sacrificando pragmatismo e destrezza fisica.",
    bonusCards: [
      { numeroCarta: 14, semeCarta: 2 }, // Re di Cuori (+2)
      { numeroCarta: 13, semeCarta: 2 }, // Regina di Cuori (+2)
      { numeroCarta: 13, semeCarta: 4 }, // Regina di Picche (+2)
      { numeroCarta: 11, semeCarta: 4 }, // Cavaliere di Picche (+2)
    ],
    malusCards: [
      { numeroCarta: 12, semeCarta: 1 }, // Cavaliere di Quadri (-2)
      { numeroCarta: 10, semeCarta: 1 }, // 10 di Quadri (-1)
      { numeroCarta: 9, semeCarta: 3 }, // 9 di Fiori (-1)
      { numeroCarta: 7, semeCarta: 3 }, // 7 di Fiori (-1)
      { numeroCarta: 6, semeCarta: 3 }, // 6 di Fiori (-1)
    ],
  },
  {
    id: "visionario",
    rank: "S",
    title: "Visionario",
    description:
      "Guida profetica che infonde il gruppo con insight sovrannaturali ma trascura i limiti del proprio corpo.",
    bonusCards: [
      { numeroCarta: 14, semeCarta: 2 },
      { numeroCarta: 13, semeCarta: 1 },
      { numeroCarta: 13, semeCarta: 4 },
      { numeroCarta: 12, semeCarta: 4 },
    ],
    malusCards: [
      { numeroCarta: 5, semeCarta: 1 },
      { numeroCarta: 4, semeCarta: 1 },
      { numeroCarta: 6, semeCarta: 3 },
      { numeroCarta: 5, semeCarta: 3 },
      { numeroCarta: 7, semeCarta: 4 },
    ],
  },
  {
    id: "arcangelo",
    rank: "S",
    title: "Arcangelo",
    description:
      "Simbolo di speranza che ispira masse e compagni, ma resta vulnerabile a malattie e fatica.",
    bonusCards: [
      { numeroCarta: 14, semeCarta: 4 },
      { numeroCarta: 13, semeCarta: 2 },
      { numeroCarta: 12, semeCarta: 2 },
      { numeroCarta: 11, semeCarta: 2 },
    ],
    malusCards: [
      { numeroCarta: 3, semeCarta: 1 },
      { numeroCarta: 4, semeCarta: 2 },
      { numeroCarta: 5, semeCarta: 3 },
      { numeroCarta: 6, semeCarta: 4 },
      { numeroCarta: 7, semeCarta: 1 },
    ],
  },
  {
    id: "legionario",
    rank: "A+",
    title: "Legionario",
    description:
      "Profilo aggressivo che alterna disciplina tattica e forza bruta, a costo di sensibilità emotiva.",
    bonusCards: [
      { numeroCarta: 14, semeCarta: 4 }, // Re di Picche (+2)
      { numeroCarta: 10, semeCarta: 4 }, // 10 di Picche (+1)
      { numeroCarta: 13, semeCarta: 1 }, // Regina di Quadri (+2)
      { numeroCarta: 9, semeCarta: 3 }, // 9 di Fiori (+1)
    ],
    malusCards: [
      { numeroCarta: 12, semeCarta: 2 }, // Cavaliere di Cuori (-2)
      { numeroCarta: 10, semeCarta: 2 }, // 10 di Cuori (-1)
      { numeroCarta: 8, semeCarta: 2 }, // 8 di Cuori (-1)
      { numeroCarta: 11, semeCarta: 3 }, // Cavaliere di Fiori (-2)
      { numeroCarta: 5, semeCarta: 1 }, // 5 di Quadri (-1)
    ],
  },
  {
    id: "stratega",
    rank: "A+",
    title: "Stratega",
    description:
      "Capo tattico che legge il campo di battaglia tre mosse in anticipo ma ignora i bisogni emotivi dell'unità.",
    bonusCards: [
      { numeroCarta: 14, semeCarta: 1 },
      { numeroCarta: 13, semeCarta: 4 },
      { numeroCarta: 12, semeCarta: 1 },
      { numeroCarta: 10, semeCarta: 3 },
    ],
    malusCards: [
      { numeroCarta: 11, semeCarta: 2 },
      { numeroCarta: 9, semeCarta: 2 },
      { numeroCarta: 8, semeCarta: 2 },
      { numeroCarta: 6, semeCarta: 3 },
      { numeroCarta: 5, semeCarta: 4 },
    ],
  },
  {
    id: "campione",
    rank: "A+",
    title: "Campione",
    description:
      "È la lama del regime: letale nei duelli e nelle cariche, ma resta cieco alla sofferenza altrui.",
    bonusCards: [
      { numeroCarta: 14, semeCarta: 4 },
      { numeroCarta: 13, semeCarta: 3 },
      { numeroCarta: 12, semeCarta: 3 },
      { numeroCarta: 10, semeCarta: 1 },
    ],
    malusCards: [
      { numeroCarta: 11, semeCarta: 2 },
      { numeroCarta: 9, semeCarta: 1 },
      { numeroCarta: 8, semeCarta: 3 },
      { numeroCarta: 7, semeCarta: 2 },
      { numeroCarta: 6, semeCarta: 1 },
    ],
  },
  {
    id: "guerriero",
    rank: "A",
    title: "Guerriero",
    description:
      "Potenzia Fiori e Picche per rappresentare forza e resistenza, sacrificando parte delle caratteristiche sociali.",
    bonusCards: [
      { numeroCarta: 14, semeCarta: 3 }, // Re di Fiori (+2)
      { numeroCarta: 9, semeCarta: 3 }, // 9 di Fiori (+1)
      { numeroCarta: 13, semeCarta: 4 }, // Regina di Picche (+2)
      { numeroCarta: 8, semeCarta: 4 }, // 8 di Picche (+1)
    ],
    malusCards: [
      { numeroCarta: 12, semeCarta: 2 }, // Cavaliere di Cuori (-2)
      { numeroCarta: 6, semeCarta: 2 }, // 6 di Cuori (-1)
      { numeroCarta: 11, semeCarta: 1 }, // Cavaliere di Quadri (-2)
      { numeroCarta: 5, semeCarta: 1 }, // 5 di Quadri (-1)
      { numeroCarta: 3, semeCarta: 1 }, // 3 di Quadri (-1)
    ],
  },
  {
    id: "temprato",
    rank: "A",
    title: "Temprato",
    description:
      "Veterano temprato dalla guerra che regge la fatica, ma paga in grazia e relazioni.",
    bonusCards: [
      { numeroCarta: 13, semeCarta: 4 },
      { numeroCarta: 12, semeCarta: 3 },
      { numeroCarta: 10, semeCarta: 4 },
      { numeroCarta: 10, semeCarta: 3 },
    ],
    malusCards: [
      { numeroCarta: 11, semeCarta: 1 },
      { numeroCarta: 9, semeCarta: 1 },
      { numeroCarta: 8, semeCarta: 2 },
      { numeroCarta: 7, semeCarta: 3 },
      { numeroCarta: 6, semeCarta: 2 },
    ],
  },
  {
    id: "mirmillone",
    rank: "A",
    title: "Mirmillone",
    description:
      "Gladiatore moderno che incassa colpi devastanti e restituisce furia nei duelli chiusi.",
    bonusCards: [
      { numeroCarta: 14, semeCarta: 3 },
      { numeroCarta: 12, semeCarta: 4 },
      { numeroCarta: 9, semeCarta: 3 },
      { numeroCarta: 8, semeCarta: 4 },
    ],
    malusCards: [
      { numeroCarta: 11, semeCarta: 2 },
      { numeroCarta: 10, semeCarta: 1 },
      { numeroCarta: 7, semeCarta: 1 },
      { numeroCarta: 6, semeCarta: 2 },
      { numeroCarta: 5, semeCarta: 4 },
    ],
  },
  {
    id: "sopravvissuto",
    rank: "A-",
    title: "Sopravvissuto",
    description:
      "Enfatizza Picche e Quadri per simulare astuzia e pragmatismo, accettando penalità su Cuori e qualche compromesso su Fiori.",
    bonusCards: [
      { numeroCarta: 12, semeCarta: 4 }, // Cavaliere di Picche (+2)
      { numeroCarta: 9, semeCarta: 4 }, // 9 di Picche (+1)
      { numeroCarta: 13, semeCarta: 1 }, // Regina di Quadri (+2)
      { numeroCarta: 6, semeCarta: 3 }, // 6 di Fiori (+1)
    ],
    malusCards: [
      { numeroCarta: 11, semeCarta: 2 }, // Cavaliere di Cuori (-2)
      { numeroCarta: 7, semeCarta: 2 }, // 7 di Cuori (-1)
      { numeroCarta: 10, semeCarta: 3 }, // 10 di Fiori (-1)
      { numeroCarta: 8, semeCarta: 1 }, // 8 di Quadri (-1)
      { numeroCarta: 2, semeCarta: 1 }, // 2 di Quadri (-1)
    ],
  },
  {
    id: "esploratore",
    rank: "A-",
    title: "Esploratore",
    description:
      "Scout irrequieto che individua pericoli con largo anticipo, ma diffida delle gerarchie.",
    bonusCards: [
      { numeroCarta: 12, semeCarta: 4 },
      { numeroCarta: 11, semeCarta: 4 },
      { numeroCarta: 9, semeCarta: 4 },
      { numeroCarta: 8, semeCarta: 3 },
    ],
    malusCards: [
      { numeroCarta: 10, semeCarta: 2 },
      { numeroCarta: 8, semeCarta: 2 },
      { numeroCarta: 7, semeCarta: 1 },
      { numeroCarta: 6, semeCarta: 1 },
      { numeroCarta: 5, semeCarta: 3 },
    ],
  },
  {
    id: "corsaro",
    rank: "A-",
    title: "Corsaro",
    description:
      "Predone dei mari che alterna colpi audaci a debolezze verso il lusso e gli affetti.",
    bonusCards: [
      { numeroCarta: 11, semeCarta: 4 },
      { numeroCarta: 10, semeCarta: 4 },
      { numeroCarta: 9, semeCarta: 3 },
      { numeroCarta: 8, semeCarta: 3 },
    ],
    malusCards: [
      { numeroCarta: 9, semeCarta: 1 },
      { numeroCarta: 8, semeCarta: 1 },
      { numeroCarta: 7, semeCarta: 2 },
      { numeroCarta: 6, semeCarta: 2 },
      { numeroCarta: 5, semeCarta: 1 },
    ],
  },
  {
    id: "balanced",
    rank: "B",
    title: "Equilibrato",
    description:
      "Distribuzione regolare tra i semi, ideale per personaggi versatili senza punti deboli evidenti.",
    bonusCards: [
      { numeroCarta: 12, semeCarta: 2 }, // Cavaliere di Cuori (+2)
      { numeroCarta: 9, semeCarta: 1 }, // 9 di Quadri (+1)
      { numeroCarta: 13, semeCarta: 3 }, // Regina di Fiori (+2)
      { numeroCarta: 6, semeCarta: 4 }, // 6 di Picche (+1)
    ],
    malusCards: [
      { numeroCarta: 11, semeCarta: 1 }, // Cavaliere di Quadri (-2)
      { numeroCarta: 7, semeCarta: 2 }, // 7 di Cuori (-1)
      { numeroCarta: 5, semeCarta: 3 }, // 5 di Fiori (-1)
      { numeroCarta: 10, semeCarta: 4 }, // 10 di Picche (-1)
      { numeroCarta: 3, semeCarta: 4 }, // 3 di Picche (-1)
    ],
  },
  {
    id: "accademico",
    rank: "B",
    title: "Accademico",
    description:
      "Punti di forza in Cuori e Quadri, con penalità distribuite su Fiori e Picche per riflettere un profilo mentale.",
    bonusCards: [
      { numeroCarta: 14, semeCarta: 1 }, // Re di Quadri (+2)
      { numeroCarta: 9, semeCarta: 1 }, // 9 di Quadri (+1)
      { numeroCarta: 13, semeCarta: 2 }, // Regina di Cuori (+2)
      { numeroCarta: 6, semeCarta: 2 }, // 6 di Cuori (+1)
    ],
    malusCards: [
      { numeroCarta: 12, semeCarta: 3 }, // Cavaliere di Fiori (-2)
      { numeroCarta: 6, semeCarta: 3 }, // 6 di Fiori (-1)
      { numeroCarta: 11, semeCarta: 4 }, // Cavaliere di Picche (-2)
      { numeroCarta: 5, semeCarta: 4 }, // 5 di Picche (-1)
      { numeroCarta: 2, semeCarta: 4 }, // 2 di Picche (-1)
    ],
  },
  {
    id: "diplomatico",
    rank: "B",
    title: "Diplomatico",
    description:
      "Maestro dei compromessi: conquista alleati, ma si smarrisce lontano dai centri di potere.",
    bonusCards: [
      { numeroCarta: 12, semeCarta: 2 },
      { numeroCarta: 11, semeCarta: 1 },
      { numeroCarta: 9, semeCarta: 2 },
      { numeroCarta: 8, semeCarta: 1 },
    ],
    malusCards: [
      { numeroCarta: 9, semeCarta: 4 },
      { numeroCarta: 8, semeCarta: 4 },
      { numeroCarta: 7, semeCarta: 3 },
      { numeroCarta: 6, semeCarta: 3 },
      { numeroCarta: 6, semeCarta: 4 },
    ],
  },
  {
    id: "mercante",
    rank: "B",
    title: "Mercante",
    description:
      "Affarista con relazioni invidiabili che però esita di fronte ai pericoli del fronte.",
    bonusCards: [
      { numeroCarta: 13, semeCarta: 1 },
      { numeroCarta: 11, semeCarta: 1 },
      { numeroCarta: 10, semeCarta: 2 },
      { numeroCarta: 9, semeCarta: 2 },
    ],
    malusCards: [
      { numeroCarta: 8, semeCarta: 3 },
      { numeroCarta: 7, semeCarta: 3 },
      { numeroCarta: 7, semeCarta: 4 },
      { numeroCarta: 6, semeCarta: 4 },
      { numeroCarta: 5, semeCarta: 4 },
    ],
  },
  {
    id: "vagabondo",
    rank: "C",
    title: "Vagabondo",
    description:
      "Configurazione prudente per personaggi adattabili con talenti modesti e pochi veri difetti.",
    bonusCards: [
      { numeroCarta: 8, semeCarta: 2 }, // 8 di Cuori (+1)
      { numeroCarta: 7, semeCarta: 1 }, // 7 di Quadri (+1)
      { numeroCarta: 8, semeCarta: 3 }, // 8 di Fiori (+1)
      { numeroCarta: 8, semeCarta: 4 }, // 8 di Picche (+1)
    ],
    malusCards: [
      { numeroCarta: 5, semeCarta: 2 }, // 5 di Cuori (-1)
      { numeroCarta: 5, semeCarta: 1 }, // 5 di Quadri (-1)
      { numeroCarta: 5, semeCarta: 3 }, // 5 di Fiori (-1)
      { numeroCarta: 5, semeCarta: 4 }, // 5 di Picche (-1)
      { numeroCarta: 6, semeCarta: 4 }, // 6 di Picche (-1)
    ],
  },
  {
    id: "ramingo",
    rank: "C",
    title: "Ramingo",
    description:
      "Errante pragmatico con poche certezze ma abbastanza astuzia per cavarsela ovunque.",
    bonusCards: [
      { numeroCarta: 9, semeCarta: 3 },
      { numeroCarta: 9, semeCarta: 4 },
      { numeroCarta: 8, semeCarta: 3 },
      { numeroCarta: 8, semeCarta: 4 },
    ],
    malusCards: [
      { numeroCarta: 7, semeCarta: 1 },
      { numeroCarta: 7, semeCarta: 2 },
      { numeroCarta: 6, semeCarta: 1 },
      { numeroCarta: 6, semeCarta: 2 },
      { numeroCarta: 5, semeCarta: 2 },
    ],
  },
  {
    id: "artigiano",
    rank: "C",
    title: "Artigiano",
    description:
      "Mani esperte e mente concreta: crea meraviglie, ma fatica a inseguire avventure estreme.",
    bonusCards: [
      { numeroCarta: 10, semeCarta: 1 },
      { numeroCarta: 9, semeCarta: 1 },
      { numeroCarta: 8, semeCarta: 2 },
      { numeroCarta: 8, semeCarta: 1 },
    ],
    malusCards: [
      { numeroCarta: 6, semeCarta: 3 },
      { numeroCarta: 6, semeCarta: 4 },
      { numeroCarta: 5, semeCarta: 3 },
      { numeroCarta: 5, semeCarta: 4 },
      { numeroCarta: 4, semeCarta: 3 },
    ],
  },
  {
    id: "miliziano",
    rank: "D",
    title: "Miliziano",
    description:
      "Soldato di leva che resiste grazie all'abitudine e non certo per doti naturali.",
    bonusCards: [
      { numeroCarta: 8, semeCarta: 4 },
      { numeroCarta: 7, semeCarta: 4 },
      { numeroCarta: 7, semeCarta: 3 },
      { numeroCarta: 6, semeCarta: 4 },
    ],
    malusCards: [
      { numeroCarta: 9, semeCarta: 1 },
      { numeroCarta: 8, semeCarta: 1 },
      { numeroCarta: 8, semeCarta: 2 },
      { numeroCarta: 7, semeCarta: 2 },
      { numeroCarta: 6, semeCarta: 2 },
    ],
  },
  {
    id: "scriba",
    rank: "D",
    title: "Scriba",
    description:
      "Burocrate abile con la penna ma inadatto a qualsiasi emergenza fisica.",
    bonusCards: [
      { numeroCarta: 9, semeCarta: 1 },
      { numeroCarta: 8, semeCarta: 1 },
      { numeroCarta: 7, semeCarta: 1 },
      { numeroCarta: 7, semeCarta: 2 },
    ],
    malusCards: [
      { numeroCarta: 7, semeCarta: 3 },
      { numeroCarta: 7, semeCarta: 4 },
      { numeroCarta: 6, semeCarta: 3 },
      { numeroCarta: 5, semeCarta: 3 },
      { numeroCarta: 4, semeCarta: 4 },
    ],
  },
  {
    id: "portatore",
    rank: "D",
    title: "Portatore",
    description:
      "Schiena forte e mente semplice: trasporta viveri ma non dirige battaglie.",
    bonusCards: [
      { numeroCarta: 9, semeCarta: 3 },
      { numeroCarta: 8, semeCarta: 3 },
      { numeroCarta: 7, semeCarta: 3 },
      { numeroCarta: 6, semeCarta: 3 },
    ],
    malusCards: [
      { numeroCarta: 8, semeCarta: 2 },
      { numeroCarta: 7, semeCarta: 2 },
      { numeroCarta: 6, semeCarta: 2 },
      { numeroCarta: 6, semeCarta: 1 },
      { numeroCarta: 5, semeCarta: 1 },
    ],
  },
  {
    id: "vedetta",
    rank: "D",
    title: "Vedetta",
    description:
      "Occhio vigile ai pericoli, ma bastano pochi colpi per mandarlo al tappeto.",
    bonusCards: [
      { numeroCarta: 9, semeCarta: 4 },
      { numeroCarta: 8, semeCarta: 4 },
      { numeroCarta: 8, semeCarta: 2 },
      { numeroCarta: 7, semeCarta: 4 },
    ],
    malusCards: [
      { numeroCarta: 9, semeCarta: 1 },
      { numeroCarta: 8, semeCarta: 1 },
      { numeroCarta: 7, semeCarta: 1 },
      { numeroCarta: 6, semeCarta: 1 },
      { numeroCarta: 5, semeCarta: 2 },
    ],
  },
  {
    id: "becchino",
    rank: "D",
    title: "Becchino",
    description:
      "Abituato alla vista della morte ma con una salute sempre sul filo del rasoio.",
    bonusCards: [
      { numeroCarta: 8, semeCarta: 4 },
      { numeroCarta: 8, semeCarta: 3 },
      { numeroCarta: 7, semeCarta: 4 },
      { numeroCarta: 7, semeCarta: 3 },
    ],
    malusCards: [
      { numeroCarta: 8, semeCarta: 1 },
      { numeroCarta: 7, semeCarta: 1 },
      { numeroCarta: 6, semeCarta: 2 },
      { numeroCarta: 5, semeCarta: 2 },
      { numeroCarta: 5, semeCarta: 1 },
    ],
  },
  {
    id: "miracolato",
    rank: "E",
    title: "Miracolato",
    description:
      "È vivo solo per una serie di coincidenze fortunate; ogni giorno è un debito.",
    bonusCards: [
      { numeroCarta: 7, semeCarta: 4 },
      { numeroCarta: 6, semeCarta: 4 },
      { numeroCarta: 6, semeCarta: 3 },
      { numeroCarta: 5, semeCarta: 4 },
    ],
    malusCards: [
      { numeroCarta: 9, semeCarta: 1 },
      { numeroCarta: 8, semeCarta: 1 },
      { numeroCarta: 8, semeCarta: 2 },
      { numeroCarta: 7, semeCarta: 2 },
      { numeroCarta: 6, semeCarta: 2 },
    ],
  },
  {
    id: "relitto",
    rank: "E",
    title: "Relitto",
    description:
      "Ha visto l'abisso e ne porta i segni addosso; procede per inerzia e superstizione.",
    bonusCards: [
      { numeroCarta: 7, semeCarta: 3 },
      { numeroCarta: 6, semeCarta: 3 },
      { numeroCarta: 6, semeCarta: 2 },
      { numeroCarta: 5, semeCarta: 3 },
    ],
    malusCards: [
      { numeroCarta: 9, semeCarta: 4 },
      { numeroCarta: 8, semeCarta: 4 },
      { numeroCarta: 8, semeCarta: 3 },
      { numeroCarta: 7, semeCarta: 4 },
      { numeroCarta: 7, semeCarta: 3 },
    ],
  },
  {
    id: "senzanome",
    rank: "E",
    title: "Senzanome",
    description:
      "Non ricorda chi fosse: sopravvive per inerzia, sorretto solo da riflessi minimi.",
    bonusCards: [
      { numeroCarta: 7, semeCarta: 1 },
      { numeroCarta: 6, semeCarta: 1 },
      { numeroCarta: 6, semeCarta: 2 },
      { numeroCarta: 5, semeCarta: 1 },
    ],
    malusCards: [
      { numeroCarta: 9, semeCarta: 3 },
      { numeroCarta: 8, semeCarta: 3 },
      { numeroCarta: 8, semeCarta: 4 },
      { numeroCarta: 7, semeCarta: 3 },
      { numeroCarta: 6, semeCarta: 4 },
    ],
  },
  {
    id: "fuggiasco",
    rank: "E",
    title: "Fuggiasco",
    description:
      "Scappa da tutto: ha un barlume di astuzia, ma il panico prende spesso il sopravvento.",
    bonusCards: [
      { numeroCarta: 7, semeCarta: 4 },
      { numeroCarta: 7, semeCarta: 3 },
      { numeroCarta: 6, semeCarta: 4 },
      { numeroCarta: 6, semeCarta: 3 },
    ],
    malusCards: [
      { numeroCarta: 9, semeCarta: 2 },
      { numeroCarta: 8, semeCarta: 2 },
      { numeroCarta: 8, semeCarta: 1 },
      { numeroCarta: 7, semeCarta: 2 },
      { numeroCarta: 6, semeCarta: 2 },
    ],
  },
  {
    id: "spaventato",
    rank: "E",
    title: "Spaventato",
    description:
      "Continua a tremare: è vivo per puro caso e l'ansia lo logora ogni singolo giorno.",
    bonusCards: [
      { numeroCarta: 7, semeCarta: 2 },
      { numeroCarta: 6, semeCarta: 2 },
      { numeroCarta: 6, semeCarta: 1 },
      { numeroCarta: 5, semeCarta: 2 },
    ],
    malusCards: [
      { numeroCarta: 9, semeCarta: 4 },
      { numeroCarta: 8, semeCarta: 4 },
      { numeroCarta: 8, semeCarta: 3 },
      { numeroCarta: 7, semeCarta: 4 },
      { numeroCarta: 6, semeCarta: 3 },
    ],
  },
].sort((a, b) => {
  const rankIndexA = rankOrder.indexOf(a.rank);
  const rankIndexB = rankOrder.indexOf(b.rank);
  if (rankIndexA === rankIndexB) {
    return a.title.localeCompare(b.title);
  }
  return rankIndexA - rankIndexB;
});

export default CaratteristicheProfiles;
