import type { SuggestionPayload } from "@/lib/firestore-data";

export interface Preset {
  /** kebab-case identyfikator do URL */
  slug: string;
  /** który vault (po slug z seed: phil, art, hist, es, ...) */
  vaultSlug: string;
  /** krótka etykieta na liście */
  label: string;
  /** payload do commitSuggestion */
  payload: SuggestionPayload;
}

export const PRESETS: Preset[] = [
  {
    slug: "egzystencjalizm",
    vaultSlug: "phil",
    label: "Egzystencjalizm — Sartre, Nietzsche, Camus",
    payload: {
      title: "Egzystencjalizm",
      summary:
        "XX-wieczny ruch filozoficzny, który stawia pytanie: skoro nie ma z góry danego sensu, planu Boga ani natury człowieka, to jak żyć? Egzystencjalizm zaczyna od wolności i odpowiedzialności, ale też od absurdu. Sartre, Nietzsche i Camus to trzy różne odpowiedzi na ten sam problem.",
      theory:
        "Klasyczna filozofia od Platona po Arystotelesa zakładała, że esencja poprzedza istnienie: najpierw jest natura człowieka, a konkretni ludzie są jej egzemplarzami. Egzystencjalizm odwraca tę kolejność. Najpierw się pojawiamy, a dopiero potem przez wybory, czyny i sposób życia definiujemy, kim jesteśmy. Sartre nazywa to radykalną wolnością: nawet rezygnacja z wyboru jest wyborem, najczęstszą formą ucieczki przed tym ciężarem jest bad faith — wmawianie sobie, że okoliczności, charakter albo rola społeczna nie zostawiają nam pola manewru.\n\nNietzsche i Camus dochodzą do podobnego miejsca innymi drogami. Nietzsche diagnozuje śmierć Boga nie jako wyzwolenie, lecz jako kryzys: europejska kultura straciła fundament i grozi jej nihilizm. Jego odpowiedź to przewartościowanie wartości i amor fati — pokochanie własnego losu, łącznie z jego bólem. Camus z kolei nazywa absurdem zderzenie między naszym pragnieniem sensu a obojętnością świata. Nie proponuje ani religii, ani samobójstwa filozoficznego — proponuje bunt, czyli życie świadome absurdu, ale mimo to pełne. Wszystkich trzech łączy jedno: gotowych odpowiedzi nie ma, trzeba je tworzyć samemu.",
      questions: [
        {
          type: "abc",
          text: "Według egzystencjalizmu:",
          options: [
            "istnienie poprzedza esencję",
            "esencja poprzedza istnienie",
            "esencja i istnienie są tożsame",
          ],
          correctAnswer: 0,
          explanation:
            "Pułapka jest taka: klasyczna filozofia (Platon, Arystoteles) szła odwrotnie — najpierw natura człowieka, potem konkretni ludzie. Egzystencjalizm tę kolejność odwraca.",
        },
        {
          type: "abc",
          text: "Bad faith u Sartre'a oznacza:",
          options: [
            "świadome kłamstwo wobec innych",
            "samooszukiwanie się o braku wyboru",
            "brak wiary religijnej",
          ],
          correctAnswer: 1,
          explanation:
            "To nie kłamstwo wobec innych ani brak wiary, tylko wmawianie sobie, że okoliczności lub charakter nas zwalniają z odpowiedzialności.",
        },
        {
          type: "abc",
          text: "Camus na pytanie, czy życie ma sens, odpowiada przez:",
          options: [
            "powrót do religii",
            "samobójstwo jako logiczny wniosek",
            "bunt świadomy absurdu",
          ],
          correctAnswer: 2,
          explanation:
            "Bunt to życie pełne mimo świadomości absurdu — ani zaprzeczanie absurdowi (skok w religię), ani ucieczka z niego (samobójstwo).",
        },
        {
          type: "fill",
          text: "Nietzsche pisał, że Bóg _____ — jako diagnoza kulturowa, nie triumf.",
          options: null,
          correctAnswer: "umarł",
          explanation:
            "Zdanie z Wiedzy radosnej. Nietzsche nie cieszy się ze śmierci Boga, ostrzega przed nihilizmem, który po niej grozi.",
        },
        {
          type: "fill",
          text: "Camus tłumaczył sens dźwigania kamienia mitem _____.",
          options: null,
          correctAnswer: "Syzyfa",
          explanation:
            "Sens nie tkwi w celu (kamień zawsze spadnie), tylko w samym dźwiganiu. Trzeba sobie wyobrazić Syzyfa szczęśliwym.",
        },
        {
          type: "open",
          text: "Wyjaśnij krótko, czym jest amor fati u Nietzschego.",
          options: null,
          correctAnswer:
            "Pokochanie własnego losu, łącznie z tym co bolesne. Nie pasywna akceptacja, lecz świadome objęcie życia takim, jakie jest.",
          explanation:
            "To nie rezygnacja ani stoicka obojętność — to aktywne 'tak' wobec rzeczywistości, w tym wobec cierpienia.",
        },
        {
          type: "open",
          text: "Dlaczego Übermensch Nietzschego nie ma wiele wspólnego z nazistowską interpretacją?",
          options: null,
          correctAnswer:
            "U Nietzschego to ten, kto sam tworzy własne wartości — koncepcja indywidualistyczna i moralna. Naziści zniekształcili ją pośmiertnie przez siostrę filozofa, interpretując rasowo i politycznie, co jest sprzeczne z indywidualnym tworzeniem wartości.",
          explanation:
            "Nadczłowiek to figura osobistego przewartościowania, nie hierarchii biologicznej. Zniekształcenie przyszło po śmierci Nietzschego.",
        },
        {
          type: "spot_error",
          text: "Egzystencjalizm to filozofia pesymistyczna, w której Sartre uczy, że jesteśmy ofiarami okoliczności, a Camus woli śmierć od absurdu.",
          options: [
            "filozofia pesymistyczna",
            "Sartre uczy, że jesteśmy ofiarami okoliczności",
            "Camus woli śmierć od absurdu",
            "wszystko źle",
          ],
          correctAnswer: 3,
          explanation:
            "Trzy fragmenty są błędne. Egzystencjalizm to filozofia wolności i odpowiedzialności, nie pesymizm. Sartre mówi przeciwnie: jesteśmy skazani na wolność, nie ofiary. Camus odrzuca samobójstwo na rzecz buntu.",
        },
      ],
      salon: {
        short:
          "Egzystencjaliści zaczynają tam, gdzie inni filozofowie kończą. Nie ma gotowej natury człowieka, nie ma planu Boga, nie ma sensu danego z góry — sami siebie tworzymy przez wybory.",
        expand:
          "Sartre mówi: skazani jesteśmy na wolność, nawet niewybór jest wyborem. Nietzsche diagnozuje śmierć Boga jako kryzys kulturowy i proponuje przewartościowanie wszystkich wartości. Camus dodaje: świat jest absurdalny, ale właśnie dlatego warto żyć świadomie — bunt zamiast rozpaczy. Trzy różne odpowiedzi na ten sam problem.",
        trap:
          "Nie redukuj egzystencjalizmu do pesymizmu — to filozofia odpowiedzialności, nie rozpaczy. Nie cytuj Nietzschego o śmierci Boga, jakby cieszył się z tego — to była diagnoza i ostrzeżenie. Nie podawaj Übermenscha jako koncepcji nazistowskiej — to zniekształcenie pośmiertne przez siostrę filozofa.",
      },
    },
  },
];
