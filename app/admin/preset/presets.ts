import type { SuggestionPayload } from "@/lib/firestore-data";
import type { VaultColor } from "@/lib/types";

export interface Preset {
  /** kebab-case identyfikator do URL */
  slug: string;
  /** który vault (po slug z seed: phil, art, hist, es, ...) */
  vaultSlug: string;
  /** krótka etykieta na liście */
  label: string;
  /** payload do commitSuggestion */
  payload: SuggestionPayload;
  /**
   * Opcjonalne metadane vaulta — używane tylko gdy preset wprowadza nowy
   * vaultSlug, którego user jeszcze nie ma w swojej kolekcji. Wtedy
   * PresetClient wywołuje ensureVault z tymi danymi i tworzy sekcję
   * on-demand, bez konieczności re-seedowania.
   */
  vaultMeta?: {
    name: string;
    icon: string;
    level: string;
    color: VaultColor;
    order: number;
  };
}

export const PRESETS: Preset[] = [
  // ============================================================
  // 1. Egzystencjalizm
  // ============================================================
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

  // ============================================================
  // 2. Filozofia śmierci
  // ============================================================
  {
    slug: "filozofia-smierci",
    vaultSlug: "phil",
    label: "Filozofia śmierci — Sokrates, Epikur, Nagel, Zhuangzi",
    payload: {
      title: "Filozofia śmierci",
      summary:
        "Czy śmierci powinniśmy się bać, i dlaczego? Sokrates patrzył na nią spokojnie, Epikur argumentował, że strach jest nieracjonalny, Nagel kontruje pokazując co tracimy, a Zhuangzi mówi: to tylko zmiana stanu. Cztery klasyczne odpowiedzi na pytanie, którego wszyscy próbujemy uniknąć.",
      theory:
        "Sokrates w „Obronie\" przedstawia śmierć jako jedno z dwojga: albo bezsenny sen bez doświadczenia (więc nie ma czego się bać), albo przejście do innego życia. W obu wypadkach nie ma powodu do lęku. Epikur idzie dalej z czystą logiką: śmierć to ustanie wszystkich doświadczeń, więc nigdy nie jest dla nas obecna — „gdy jesteśmy, śmierci nie ma; gdy jest śmierć, nas już nie ma\". Strach jest nieporozumieniem logicznym.\n\nThomas Nagel kontruje Epikura zręcznie. Śmierć to deprywacja — utrata doświadczeń, które byśmy mieli, gdybyśmy żyli. Strata nie wymaga obecności poszkodowanego, więc strach jest racjonalny, tylko źle zaadresowany: boimy się utraty życia, nie samego umierania. Nagel pyta też o asymetrię: dlaczego nie boimy się czasu przed naszymi narodzinami, kiedy też nas nie było? Bo śmierć odbiera coś, co mogłoby być. Zhuangzi z daoizmu proponuje zupełnie inne ramy: śmierć to naturalna przemiana, jak pory roku. Słynny obraz: po śmierci żony Zhuangzi śpiewa i bije w garnek, bo zrozumiał, że ona „wróciła do natury\". Strach przed śmiercią to przywiązanie do iluzji oddzielnego „ja\".",
      questions: [
        {
          type: "abc",
          text: "Główny argument Epikura przeciwko strachowi przed śmiercią to:",
          options: [
            "śmierć jest dobra, więc lepsza od życia",
            "śmierć i my nigdy nie jesteśmy obecni razem",
            "po śmierci czeka nas lepsze życie",
          ],
          correctAnswer: 1,
          explanation:
            "Argument logiczny: gdy żyjemy, śmierci nie ma; gdy nadchodzi śmierć, nas już nie ma. Więc nigdy nie jest dla nas złem.",
        },
        {
          type: "abc",
          text: "Nagel uważa, że śmierć jest zła, ponieważ:",
          options: [
            "boli fizycznie",
            "to deprywacja — utrata przyszłych doświadczeń",
            "po niej nic nie ma",
          ],
          correctAnswer: 1,
          explanation:
            "Strata nie wymaga obecności poszkodowanego. Tracimy coś, co mogłoby być — i to jest właściwy obiekt strachu.",
        },
        {
          type: "abc",
          text: "Zhuangzi po śmierci żony:",
          options: [
            "rozpaczał i odmówił jedzenia",
            "śpiewał i bił w garnek",
            "wycofał się do klasztoru",
          ],
          correctAnswer: 1,
          explanation:
            "Bo zrozumiał, że żona „wróciła do natury\". Daoistyczne ujęcie: śmierć to przemiana, nie koniec.",
        },
        {
          type: "fill",
          text: "Spór między \"życie jest święte\" a \"liczy się jakość życia\" to klasyczna oś etyki końca _____.",
          options: null,
          correctAnswer: "życia",
          explanation:
            "Sanctity of life vs quality of life — fundament debat o eutanazji, opiece paliatywnej, aborcji.",
        },
        {
          type: "fill",
          text: "Sokrates filozofię nazywał „przygotowaniem do _____\".",
          options: null,
          correctAnswer: "śmierci",
          explanation:
            "Filozofia uczy oderwania od ciała i zmysłowości — przygotowuje na to, co ma nastąpić.",
        },
        {
          type: "open",
          text: "Czym Nagel kontruje Epikura?",
          options: null,
          correctAnswer:
            "Nawet jeśli śmierć nie jest doświadczeniem, jest stratą doświadczeń. Strata nie wymaga obecności poszkodowanego — można stracić coś, czego się już nie ma.",
          explanation:
            "Trafiasz w sedno, gdy zauważysz, że Nagel nie obala logiki Epikura, tylko przesuwa ciężar: nie chodzi o doświadczenie śmierci, lecz o utratę życia.",
        },
        {
          type: "open",
          text: "Jak Zhuangzi rozumie różnicę między smutkiem a wieczną rozpaczą po śmierci bliskich?",
          options: null,
          correctAnswer:
            "Smutek tak, ale wieczna rozpacz to przywiązanie do iluzji oddzielnego ja. Życie i śmierć to dwa stany tej samej rzeczy.",
          explanation:
            "Daoizm nie zaprzecza emocjom. Zaprzecza ich utrwalaniu na bazie metafizycznego błędu.",
        },
        {
          type: "spot_error",
          text: "Epikur mówi, że śmierć jest dobra, a Nagel odpowiada, że strach przed śmiercią jest zupełnie irracjonalny.",
          options: [
            "śmierć jest dobra",
            "Nagel odpowiada, że strach jest irracjonalny",
            "Nagel używa słowa „zupełnie\"",
            "wszystko OK",
          ],
          correctAnswer: 0,
          explanation:
            "Epikur nie mówi, że śmierć jest dobra. Mówi tylko, że nie ma się jej co bać — wciąż uważa, że długie szczęśliwe życie jest lepsze.",
        },
      ],
      salon: {
        short:
          "Epikur miał elegancki argument: śmierć to nie problem, bo nigdy nie jesteśmy z nią obecni razem. Ale Nagel zręcznie kontruje: nawet jeśli śmierć nie jest doświadczeniem, jest stratą doświadczeń, których byśmy mieli.",
        expand:
          "Właściwe pytanie brzmi: nie czy boimy się umierania, tylko czy boimy się utraty życia. Sokrates patrzył spokojnie — bezsenny sen albo przejście, w obu wypadkach OK. Zhuangzi z daoizmu dodaje trzecią perspektywę: śmierć to naturalna przemiana, jak pory roku, a strach to przywiązanie do iluzji oddzielnego ja.",
        trap:
          "Epikur NIE mówi „śmierć jest dobra\", tylko że nie powinniśmy się jej bać. Sanctity of life to nie tylko argument religijny — Kant uzasadnia ją świecko, przez godność człowieka. I nie powołuj się na Zhuangziego, żeby tłumaczyć, że nie wolno opłakiwać — on dopuszcza smutek, neguje tylko wieczną rozpacz.",
      },
    },
  },

  // ============================================================
  // 3. Tożsamość rzeczy
  // ============================================================
  {
    slug: "tozsamosc-rzeczy",
    vaultSlug: "phil",
    label: "Tożsamość rzeczy — statek Tezeusza, Leibniz, Heraklit",
    payload: {
      title: "Tożsamość rzeczy",
      summary:
        "Kiedy coś nadal jest „tym samym\"? Pytanie pozornie trywialne, w praktyce prowadzi do paradoksów. Statek Tezeusza, Leibniz i Heraklit to klasyczny zestaw pokazujący, że tożsamość w czasie jest filozoficznie trudna. Fundament późniejszego pytania o tożsamość osobową.",
      theory:
        "Statek Tezeusza, opisany przez Plutarcha: ateńczycy zachowali statek na pamiątkę, ale gdy deski gniły, wymieniano je jedna po drugiej, aż wszystkie były nowe. Czy to nadal ten sam statek? Twist Hobbesa: ktoś zbiera stare deski i składa z nich drugi statek obok. Teraz są dwa — który jest „prawdziwym\" statkiem Tezeusza? Możliwe odpowiedzi rozkładają się na ciągłość przestrzenno-czasową, tożsamość materialną, funkcjonalną, albo nominalistyczną (że pytanie jest źle postawione).\n\nLeibniz formułuje to ścisłe: A jest tożsame z B wtedy i tylko wtedy, gdy mają DOKŁADNIE te same cechy (Indiscernibility of Identicals). Ale to prowadzi do problemu — statek w czasie t1 i t2 ma różne cechy, więc czy to ten sam? Wprowadza rozróżnienie essential vs accidental properties: woda musi być H2O (essential), ale może być ciepła lub zimna (accidental). Heraklit z kolei mówi: „nie wejdziesz dwa razy do tej samej rzeki\". Rzeka to nie woda — woda płynie, a rzeka jako rzeka trwa. Tożsamość statyczna to iluzja; realna tożsamość to ciągłość procesu. Dodatkowe pojęcie: fungibility. Pieniądze, ziarna pszenicy są wymienne bez różnicy (fungible). Ludzie, statki, dzieła sztuki — nie są. Dla nich liczy się egzemplarz konkretny, nie typ.",
      questions: [
        {
          type: "abc",
          text: "Wymiana wszystkich desek statku Tezeusza testuje intuicję o:",
          options: [
            "fizyce materiałów",
            "tożsamości w czasie",
            "wartości ekonomicznej",
          ],
          correctAnswer: 1,
          explanation:
            "Paradoks pokazuje, że nie jest jasne, co decyduje o tym, że coś jest „tym samym\" przez czas: materia, forma, ciągłość, funkcja?",
        },
        {
          type: "abc",
          text: "Według Leibniza dwie rzeczy są tożsame:",
          options: [
            "gdy mają identyczne wszystkie własności",
            "gdy zajmują to samo miejsce",
            "gdy są podobne na pierwszy rzut oka",
          ],
          correctAnswer: 0,
          explanation:
            "Indiscernibility of Identicals — mocna definicja. Prowadzi do trudności w tożsamości w czasie, bo rzeczy z natury się zmieniają.",
        },
        {
          type: "abc",
          text: "Heraklit twierdzi, że tożsamość to:",
          options: [
            "statyczność i niezmienność",
            "iluzja, nic nie istnieje",
            "ciągłość procesu w zmianie",
          ],
          correctAnswer: 2,
          explanation:
            "Panta rhei — wszystko płynie, ale rzeka jako rzeka trwa. Tożsamość przez zmianę, nie mimo niej.",
        },
        {
          type: "fill",
          text: "Cechy, które muszą być, żeby coś było tym czym jest, to cechy _____.",
          options: null,
          correctAnswer: "essential",
          explanation:
            "Essential properties (esencjalne) vs accidental (przypadkowe). Pytanie filozoficzne: które cechy statku są które?",
        },
        {
          type: "fill",
          text: "Pieniądze i ziarna pszenicy są _____ — zamienialne bez różnicy.",
          options: null,
          correctAnswer: "fungible",
          explanation:
            "Tożsamość fungible to słabsza tożsamość — liczy się typ, nie egzemplarz. Ludzie, statki, obrazy nie są fungible.",
        },
        {
          type: "open",
          text: "Wyjaśnij twist Hobbesa do paradoksu statku Tezeusza.",
          options: null,
          correctAnswer:
            "Hobbes dodaje drugi statek złożony ze starych desek. Teraz są dwa — nowy w miejscu, zrekonstruowany ze starego materiału obok. Pytanie staje się ostre: który jest „tym samym\" statkiem Tezeusza?",
          explanation:
            "Bez twistu można odpowiedzieć „nowy, bo ciągłość\". Z twistem trzeba wybrać między ciągłością a materiałem.",
        },
        {
          type: "open",
          text: "Czym różni się tożsamość numeryczna od jakościowej?",
          options: null,
          correctAnswer:
            "Tożsamość numeryczna: ten konkretny egzemplarz (ja to ja). Tożsamość jakościowa: identyczne cechy (bliźniaki jednojajowe). Bliźniaki mają tożsamość jakościową, ale nie numeryczną.",
          explanation:
            "Rozróżnienie kluczowe dla pytań o klonowanie, teletransporter, problemy personhood.",
        },
        {
          type: "spot_error",
          text: "Heraklit uważał, że nic naprawdę nie istnieje, więc pytanie o tożsamość jest bezsensowne.",
          options: [
            "Heraklit uważał",
            "nic naprawdę nie istnieje",
            "pytanie o tożsamość jest bezsensowne",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Heraklit nie mówi, że nic nie istnieje. Mówi: istnieje przez zmianę, nie mimo niej. To bardzo różne.",
        },
      ],
      salon: {
        short:
          "Statek Tezeusza wygląda na ciekawostkę, ale jest fundamentem prawdziwego pytania: kiedy coś jest nadal sobą, mimo że się zmienia? Leibniz mówi, że tożsamość wymaga identyczności cech. Heraklit kontruje: tożsamość to nie statyczność, tylko ciągłość zmiany.",
        expand:
          "A potem to pytanie wraca jeszcze ostrzej: czy ja, w wieku 30 lat, jestem tą samą osobą co w wieku 5 lat? To już problem tożsamości osobowej, ale fundament leży w paradoksie statku. Twist Hobbesa: jeśli ktoś zbiera stare deski i robi drugi statek, mamy dwa — który jest „tym samym\"? Rozstrzygnięcie zależy od tego, jakie kryterium tożsamości się wybierze: ciągłość, materiał, forma, funkcja.",
        trap:
          "Nie podawaj „jednej poprawnej odpowiedzi\" na statek Tezeusza — filozofowie różnią się i dziś. Nie myl tożsamości numerycznej (ten konkretny egzemplarz) z jakościową (identyczne cechy). I nie cytuj Heraklita jako nihilisty — on mówi o istnieniu przez zmianę, nie o braku istnienia.",
      },
    },
  },

  // ============================================================
  // 4. Tożsamość osobowa i personhood
  // ============================================================
  {
    slug: "tozsamosc-osobowa",
    vaultSlug: "phil",
    label: "Tożsamość osobowa i personhood — Locke, Hume, Parfit, Singer",
    payload: {
      title: "Tożsamość osobowa i personhood",
      summary:
        "Co czyni mnie tą samą osobą w czasie — ciało, pamięć, świadomość? I osobno: co czyni kogoś osobą w sensie moralnym? To nie pytania biologiczne. Płód jest biologicznie człowiekiem, ale czy jest osobą? AI nie jest człowiekiem, ale może być osobą. Locke, Hume, Parfit, Warren i Singer — pięć perspektyw na to samo pytanie.",
      theory:
        "Personal identity to pytanie o ciągłość tożsamości w czasie. Body Theory mówi: jesteś swoim ciałem. Problem — ciało wymienia komórki, mózg się zmienia. John Locke przesuwa kryterium na pamięć: jesteś tą samą osobą co ten, kogo pamiętasz jako siebie. Thomas Reid kontruje brave officer paradox: generał pamięta się jako oficer, oficer pamięta się jako chłopiec, generał NIE pamięta się jako chłopiec — więc czy generał = chłopiec? David Hume idzie dalej i mówi: nie ma żadnego stałego „ja\". Kiedy patrzysz w głąb siebie, znajdujesz tylko wiązkę wrażeń (bundle theory). Self to fikcja organizująca doświadczenie.\n\nDerek Parfit kończy tę linię eksperymentem teletransportera: maszyna skanuje cię, niszczy, odbudowuje atom po atomie na Marsie. Czy to nadal ty? A jeśli skaner zostawia oryginał i tworzy kopię — która z dwóch wersji to ty? Wniosek Parfita: pytanie „czy to ja\" jest źle postawione. Liczy się psychological connectedness — ciągłość świadomości, pamięci, charakteru. Survival jest ważniejsze niż identity. Osobno: personhood — kwestia moralna, nie biologiczna. Mary Anne Warren proponuje pięć kryteriów osoby: świadomość, rozumowanie, samodzielne motywowane działanie, komunikacja, samoświadomość. Peter Singer redukuje to do sentience: zdolności do cierpienia i przyjemności. Z tego wyciąga, że niektóre zwierzęta wyższe mają większą personhood niż człowiek w stanie wegetatywnym.",
      questions: [
        {
          type: "abc",
          text: "Locke twierdzi, że tożsamość osobowa polega na:",
          options: [
            "ciągłości pamięci i świadomości",
            "ciągłości tego samego ciała",
            "trwałości duszy nadanej przy narodzinach",
          ],
          correctAnswer: 0,
          explanation:
            "Memory theory: jesteś tą samą osobą co ten, kogo pamiętasz jako siebie. Atakowane przez paradoks brave officer (Reid).",
        },
        {
          type: "abc",
          text: "Bundle theory Hume'a głosi, że:",
          options: [
            "ja jest substancją duchową",
            "ja to fikcja, jest tylko wiązka wrażeń",
            "ja to ciało plus pamięć",
          ],
          correctAnswer: 1,
          explanation:
            "Hume nie znajduje stałego „ja\" introspekcją — tylko strumień myśli, uczuć, doznań. Self to konstrukcja porządkująca doświadczenie.",
        },
        {
          type: "abc",
          text: "Parfit w eksperymencie teletransportera twierdzi, że:",
          options: [
            "pytanie „czy to ja\" jest źle postawione, liczy się ciągłość psychiczna",
            "po teleportacji to już inna osoba",
            "to ten sam człowiek, bo atomy są identyczne",
          ],
          correctAnswer: 0,
          explanation:
            "Survival vs identity. Parfit: ważne czy ktoś przeżyje (psychological connectedness), nie czy to metafizycznie „nadal ja\".",
        },
        {
          type: "fill",
          text: "Singer uważa, że kluczowym kryterium personhood jest _____ — zdolność do cierpienia i przyjemności.",
          options: null,
          correctAnswer: "sentience",
          explanation:
            "Z tego kryterium wynika m.in. etyka praw zwierząt — i kontrowersyjny wniosek, że człowiek w stanie wegetatywnym ma mniejszą personhood niż dorosły szympans.",
        },
        {
          type: "fill",
          text: "Człowiek (Human) to pojęcie biologiczne. Osoba (Person) to pojęcie _____.",
          options: null,
          correctAnswer: "moralne",
          explanation:
            "Te kategorie się nie pokrywają. Płód jest human, ale (dla niektórych) nie jest jeszcze person. AI mogłaby być person bez bycia human.",
        },
        {
          type: "open",
          text: "Wyjaśnij brave officer paradox i co on robi z teorią Locke'a.",
          options: null,
          correctAnswer:
            "Generał pamięta się jako oficer. Oficer pamięta się jako chłopiec. Generał NIE pamięta siebie jako chłopiec. Jeśli tożsamość = ciągłość pamięci (Locke), to generał ≠ chłopiec, ale generał = oficer = chłopiec. Sprzeczność.",
          explanation:
            "Paradoks Reida pokazuje, że memory theory jako tranzytywna relacja nie działa — chyba że zluzuje się definicję na łańcuch nakładających się wspomnień.",
        },
        {
          type: "open",
          text: "Dlaczego pytanie o personhood jest tak gorące w bioetyce i sporach o AI?",
          options: null,
          correctAnswer:
            "Bo to nie pytanie biologiczne, tylko moralne. Od odpowiedzi zależy, kto ma prawa: aborcja (płód), eutanazja (osoba w stanie wegetatywnym), AI (świadoma maszyna?), zwierzęta (wysokie sentience). Każde z tych pytań rozstrzyga się przez kryterium personhood.",
          explanation:
            "Stąd polaryzacja: zwolennicy „sanctity of life\" rozszerzają personhood do biologicznego człowieka. Singer i utylitaryści zawężają do sentience.",
        },
        {
          type: "spot_error",
          text: "Hume twierdzi, że ja nie istnieje, więc życie ludzkie nie ma sensu metafizycznego.",
          options: [
            "Hume twierdzi, że ja nie istnieje",
            "życie ludzkie nie ma sensu",
            "Hume mówi o sensie metafizycznym",
            "wszystko OK",
          ],
          correctAnswer: 0,
          explanation:
            "Hume nie mówi, że „ja\" nie istnieje. Mówi, że „ja\" to konstrukcja mentalna — użyteczna, ale nie metafizycznie podstawowa. To duża różnica.",
        },
      ],
      salon: {
        short:
          "Locke twierdzi, że to pamięć czyni nas tą samą osobą w czasie. Hume kontruje: jak zajrzysz w siebie, nie znajdziesz żadnego stałego „ja\", tylko strumień wrażeń.",
        expand:
          "A Parfit idzie najdalej: pytanie „czy to nadal ja\" jest mniej ważne niż „czy ktoś przeżyje\". To kompletnie zmienia myślenie o śmierci, o transhumanizmie, nawet o codziennej tożsamości. Osobno: personhood — to nie pytanie biologiczne, tylko moralne. Singer pokazuje, że jego kryterium (sentience) prowadzi do niewygodnych wniosków: niektóre zwierzęta mogą mieć większą personhood niż człowiek w stanie wegetatywnym.",
        trap:
          "Hume nie jest nihilistą o „ja\" — on pokazuje, że to konstrukcja mentalna, użyteczna, choć nie metafizyczna. Parfit nie mówi „nie ma tożsamości\" — mówi, że jest mniej ważna niż myślimy. I uważaj na Singera: jego pozycja jest skrajna konsekwentnie, niewygodna dla wszystkich, nie tylko dla „obrońców życia\".",
      },
    },
  },

  // ============================================================
  // 5. Filozofia umysłu i AI
  // ============================================================
  {
    slug: "filozofia-umyslu",
    vaultSlug: "phil",
    label: "Filozofia umysłu i AI — Descartes, Mary's Room, Turing, Searle",
    payload: {
      title: "Filozofia umysłu i AI",
      summary:
        "Co to jest umysł? Czy maszyna może myśleć? Te pytania były czysto filozoficzne aż do XX wieku, a teraz dotyczą Twojego ChatGPT. Phineas Gage pokazuje, że mózg = osobowość. Descartes wprowadza dualizm. Mary's Room atakuje fizykalizm. Turing i Searle spierają się, czy maszyna rozumie.",
      theory:
        "Phineas Gage w 1848 roku przeżył wypadek, w którym metalowy pręt zniszczył mu płat czołowy. Z opanowanego człowieka stał się impulsywny i agresywny. To empiryczny dowód: mózg wpływa na osobowość, charakter, decyzje moralne. Descartes proponuje przeciwną intuicję — dualizm substancji: istnieje res cogitans (umysł niematerialny) i res extensa (ciało materialne). Łączy je interakcja przez szyszynkę. Problem: jak coś niematerialnego może wpływać na materialne i odwrotnie? To słynny mind-body problem.\n\nFrank Jackson w eksperymencie Mary's Room (1982) atakuje fizykalizm. Mary jest neuronaukowczynią uwięzioną w czarno-białym pokoju — zna wszystkie fakty fizyczne o widzeniu kolorów. Gdy pierwszy raz widzi czerwoną różę, czy uczy się czegoś nowego? Jeśli tak, to istnieje coś poza faktami fizycznymi — qualia, subiektywne jakości doświadczenia. Alan Turing przesuwa pytanie z metafizyki na zachowanie: nie pytajmy „czy maszyna myśli\", tylko „czy potrafi prowadzić rozmowę nieodróżnialną od ludzkiej\". John Searle kontruje Chinese Room: wyobraź sobie człowieka w pokoju, który nie zna chińskiego, ale dostaje karteczki i ma po angielsku instrukcję jak na nie odpowiadać. Z zewnątrz wygląda jak rozmowa, ale człowiek niczego nie rozumie — manipuluje symbolami. Komputery są jak ten pokój: mają syntaktykę bez semantyki. Bycie funkcjonalnie inteligentnym to nie to samo co rozumienie.",
      questions: [
        {
          type: "abc",
          text: "Phineas Gage to klasyczny argument za tym, że:",
          options: [
            "duszy nie ma",
            "mózg wpływa na osobowość",
            "wypadki kolejowe są niebezpieczne",
          ],
          correctAnswer: 1,
          explanation:
            "Empiryczny case przeciwko prostemu dualizmowi: zmiana mózgu = zmiana charakteru, decyzji moralnych.",
        },
        {
          type: "abc",
          text: "Eksperyment Mary's Room atakuje:",
          options: [
            "neuronaukę jako dziedzinę",
            "fizykalizm — pogląd, że wszystko sprowadza się do fizyki",
            "teorię ewolucji",
          ],
          correctAnswer: 1,
          explanation:
            "Jackson nie kwestionuje neuronauki, ale argumentuje, że nie wyczerpuje rzeczywistości — qualia są czymś poza fizyką.",
        },
        {
          type: "abc",
          text: "Chinese Room Searle'a pokazuje, że:",
          options: [
            "AI nie ma zastosowań",
            "manipulacja symbolami to nie rozumienie",
            "chiński jest trudnym językiem",
          ],
          correctAnswer: 1,
          explanation:
            "Searle rozróżnia syntaktykę (manipulacja symbolami) i semantykę (rozumienie znaczenia). Komputery mają pierwsze, nie drugie.",
        },
        {
          type: "fill",
          text: "Subiektywne jakości doświadczenia („jak to jest\" widzieć czerwień) nazywamy _____.",
          options: null,
          correctAnswer: "qualia",
          explanation:
            "Pojęcie kluczowe w Mary's Room. Trudne do redukcji do faktów fizycznych — stąd argument przeciwko fizykalizmowi.",
        },
        {
          type: "fill",
          text: "Turing Test mierzy inteligencję _____ — to znaczy: zdolność do prowadzenia rozmowy nieodróżnialnej od ludzkiej.",
          options: null,
          correctAnswer: "funkcjonalną",
          explanation:
            "Turing nie twierdził, że Test rozstrzyga o świadomości. Tylko o inteligencji funkcjonalnej. Searle później atakuje to: można przejść Test bez rozumienia.",
        },
        {
          type: "open",
          text: "Jaki jest mind-body problem u Descartesa i czemu szyszynka go nie rozwiązuje?",
          options: null,
          correctAnswer:
            "Jeśli umysł jest niematerialny, a ciało materialne, to jak na siebie wpływają? Szyszynka miała być miejscem interakcji, ale to nie odpowiada na pytanie, jak interakcja między tak różnymi substancjami jest możliwa.",
          explanation:
            "Descartes nie jest naiwny — wie, że to problem. Szyszynka to próba lokalizacji, nie wyjaśnienia mechanizmu.",
        },
        {
          type: "open",
          text: "Rozróżnij Strong AI od Weak AI w terminach Searle'a.",
          options: null,
          correctAnswer:
            "Weak AI: maszyna symuluje inteligencję — narzędzie pomocne, niczemu nie zaprzecza. Strong AI: maszyna NAPRAWDĘ ma umysł, rozumie. Chinese Room atakuje tylko Strong AI — Searle popiera Weak.",
          explanation:
            "Częste nieporozumienie: Chinese Room nie jest argumentem przeciw AI w ogóle, tylko przeciw tezie, że AI ma świadomość.",
        },
        {
          type: "spot_error",
          text: "Descartes był naiwnym dualistą, który nie zauważył, że umysł i ciało nie mogą oddziaływać.",
          options: [
            "Descartes był dualistą",
            "był naiwny",
            "nie zauważył problemu interakcji",
            "wszystko OK",
          ],
          correctAnswer: 2,
          explanation:
            "Descartes doskonale wiedział, że interakcja jest problemem. Szyszynka jako miejsce styku to jego (słaba) odpowiedź, nie naiwność.",
        },
      ],
      salon: {
        short:
          "Najciekawszy w filozofii umysłu jest spór o qualia. Mary z eksperymentu Franka Jacksona wie wszystko o fizyce widzenia, ale gdy pierwszy raz widzi czerwień, uczy się czegoś nowego. To sugeruje, że subiektywne doświadczenie to coś więcej niż fizyka mózgu.",
        expand:
          "A potem Chinese Room Searle'a pokazuje, że nawet AI która przechodzi Turing Test może po prostu manipulować symbolami, bez prawdziwego rozumienia. To dwa potężne argumenty przeciw twardemu fizykalizmowi i przeciw Strong AI — choć każdy z nich ma swoje słabości i kontrargumenty. Sam Frank Jackson później wycofał się z własnego argumentu, a wokół Chinese Room trwa dyskusja od czterdziestu lat.",
        trap:
          "Mary's Room atakuje fizykalizm, nie neuronaukę — Jackson nie mówi, że nauka się myli. Chinese Room atakuje Strong AI, nie AI w ogóle — Searle popiera Weak AI. Mysterianism McGinna to nie mistycyzm — to naturalistyczna teza, że nasze mózgi mogą po prostu nie być w stanie pojąć siebie. I nie podawaj Turinga jako autora tezy, że Test rozstrzyga o świadomości — on mówił tylko o inteligencji funkcjonalnej.",
      },
    },
  },

  // ============================================================
  // 6. Wolna wola
  // ============================================================
  {
    slug: "wolna-wola",
    vaultSlug: "phil",
    label: "Wolna wola — determinizm, libertarianizm, kompatybilizm",
    payload: {
      title: "Wolna wola",
      summary:
        "Czy naprawdę wybieramy, czy tylko nam się tak wydaje? Spór między hard determinizmem, libertarianizmem i kompatybilizmem wiąże się z pytaniem o karę, winę, sprawiedliwość, a nawet z neuronauką. Trzy pozycje, jeden ogień: czy moralna odpowiedzialność jest możliwa, jeśli świat jest deterministyczny?",
      theory:
        "Hard determinism mówi: wszystko (w tym ludzkie wybory) ma przyczyny w poprzednich zdarzeniach. Nasze decyzje są w 100% określone przez geny, mózg, środowisko, doświadczenia. Wolna wola nie istnieje. Baron d'Holbach: jesteśmy częścią natury, świadomość woli to złudzenie — nie wybieramy „wolniej\" niż kamień spadający z klifu. Konsekwencja: kara karząca jest nieuzasadniona, ale resocjalizacja ma sens (działa jako przyczyna zmiany zachowania). Libertarian free will twierdzi przeciwnie: prawdziwa wolna wola istnieje, decyzje nie są całkowicie określone przez przyczyny. Kluczowe rozróżnienie: event causation (zdarzenia powodują zdarzenia, model deterministyczny) vs agent causation (ja jako sprawca mogę zapoczątkować nowy łańcuch). Problem libertarianizmu: jeśli decyzja nie ma przyczyn, czy to nie tylko losowość?\n\nCompatibilism to pojednanie: determinizm jest prawdziwy, ALE wolna wola też istnieje, jeśli odpowiednio ją zdefiniujemy. „Wolny\" znaczy: działający zgodnie ze swoimi pragnieniami i bez zewnętrznego przymusu. Można być deterministycznie określonym i jednocześnie wolnym. Harry Frankfurt wzmacnia to przykładem: Jones chce zabić Smitha. Black skrycie zainstalował chip w mózgu Jonesa: gdyby Jones się zawahał, chip by go zmusił. Jones zabija sam, bez aktywacji chipu. Jones nie mógł zrobić inaczej (chip by go zmusił), ale działał ze swojej woli — i jest moralnie odpowiedzialny. Wniosek: odpowiedzialność nie wymaga „mogłem zrobić inaczej\". Patricia Churchland dodaje neuronaukowy wymiar: lepsze pytanie to nie „czy mamy wolną wolę\", tylko „jak bardzo jesteśmy wolni w danym momencie\". Wolność jest stopniowalna — guzy mózgu, uzależnienia, choroby psychiczne pokazują continuum, nie binarność.",
      questions: [
        {
          type: "abc",
          text: "Compatibilism głosi, że:",
          options: [
            "wolna wola i determinizm są nie do pogodzenia",
            "wolna wola jest, ale tylko w niektórych decyzjach",
            "wolna wola i determinizm są zgodne przy właściwej definicji wolności",
          ],
          correctAnswer: 2,
          explanation:
            "„Wolny\" oznacza działający zgodnie ze swoimi pragnieniami, bez zewnętrznego przymusu. To definicja kompatybilistyczna — popierana m.in. przez Daniela Dennetta.",
        },
        {
          type: "abc",
          text: "Frankfurt cases pokazują, że:",
          options: [
            "moralna odpowiedzialność wymaga „mogłem zrobić inaczej\"",
            "moralna odpowiedzialność NIE wymaga „mogłem zrobić inaczej\"",
            "moralna odpowiedzialność jest niemożliwa w determinizmie",
          ],
          correctAnswer: 1,
          explanation:
            "Jones działa ze swojej woli, nawet jeśli chip by go zmusił. Można być odpowiedzialnym bez alternatywnych możliwości.",
        },
        {
          type: "abc",
          text: "Patricia Churchland uważa, że wolność jest:",
          options: [
            "binarna — masz lub nie masz",
            "stopniowalna — continuum w zależności od stanu mózgu",
            "iluzją kompletnie",
          ],
          correctAnswer: 1,
          explanation:
            "Guzy mózgu, choroby psychiczne, uzależnienia pokazują, że wolność nie jest binarna — to continuum.",
        },
        {
          type: "fill",
          text: "Pozycja, że nasze decyzje są w 100% określone przez przyczyny i wolnej woli nie ma, to _____ determinism.",
          options: null,
          correctAnswer: "hard",
          explanation:
            "Hard determinism kontra soft determinism (compatibilism). Hard zaprzecza wolnej woli, soft próbuje ją uratować przy odpowiedniej definicji.",
        },
        {
          type: "fill",
          text: "Rozróżnienie event causation (zdarzenia powodują zdarzenia) vs _____ causation (ja jako sprawca rozpoczynam nowy łańcuch) to klucz libertarianizmu.",
          options: null,
          correctAnswer: "agent",
          explanation:
            "Agent causation to próba wyrwania decyzji z deterministycznego łańcucha. Trudność: czy to nie tylko losowość?",
        },
        {
          type: "open",
          text: "Wyjaśnij Frankfurt case z chipem w mózgu Jonesa.",
          options: null,
          correctAnswer:
            "Black instaluje chip: gdy Jones się zawaha przed zabiciem Smitha, chip go zmusi. Jones zabija sam, bez aktywacji chipu. Nie mógł zrobić inaczej (chip by go zmusił), ale działał ze swojej woli. Wniosek: odpowiedzialność nie wymaga alternatywnych możliwości.",
          explanation:
            "Ważne: chip NIE został aktywowany. Jones zabija z własnego pragnienia. To intuicja kluczowa dla kompatybilizmu.",
        },
        {
          type: "open",
          text: "Dlaczego hard determinism to NIE to samo co fatalizm?",
          options: null,
          correctAnswer:
            "Fatalizm: cokolwiek zrobię, stanie się X (los jest niezmienny niezależnie od działań). Determinizm: to, co się stanie, zależy od tego, co zrobię — tylko to, co zrobię, też jest zdeterminowane. Różnica: determinizm zachowuje przyczynowość, fatalizm ją obchodzi.",
          explanation:
            "Determinizm pozwala mówić „gdybym wybrał inaczej, byłoby inaczej\". Fatalizm — nie.",
        },
        {
          type: "spot_error",
          text: "Eksperyment Libeta dowodzi, że nie mamy wolnej woli, bo mózg podejmuje decyzję przed świadomością.",
          options: [
            "Eksperyment Libeta dowodzi",
            "mózg podejmuje decyzję przed świadomością",
            "nie mamy wolnej woli",
            "wszystko OK",
          ],
          correctAnswer: 0,
          explanation:
            "Libet NIE dowodzi braku wolnej woli — pokazuje tylko aktywność mózgu przed świadomą decyzją. Interpretacja jest sporna, wnioski o wolnej woli to nadinterpretacja.",
        },
      ],
      salon: {
        short:
          "Najciekawsza jest kompromisowa pozycja kompatybilizmu. Frankfurt pokazuje, że moralna odpowiedzialność nie wymaga „mogłem zrobić inaczej\" — wystarczy, że działam zgodnie ze swoimi pragnieniami, nawet jeśli te pragnienia są zdeterminowane.",
        expand:
          "A Patricia Churchland dodaje: nie pytajmy „czy mamy wolną wolę\", tylko „jak bardzo jesteśmy wolni w danym momencie\". Bo wolność jest stopniowalna — guzy mózgu, uzależnienia, choroby psychiczne pokazują continuum, nie binarność. Hard determinism (d'Holbach) odrzuca wolną wolę w ogóle, libertarianizm broni jej kosztem łańcucha przyczynowego. Kompatybilizm próbuje pogodzić jedno z drugim — i robi to zaskakująco zgrabnie.",
        trap:
          "Compatibilism to nie „kompromis dla niezdecydowanych\" — to poważna pozycja popierana przez Dennetta. Libertarian free will (filozoficzne) nie ma nic wspólnego z polityczną ideologią libertariańską. Hard determinism nie jest fatalizmem — fatalizm obchodzi przyczynowość, determinizm ją zachowuje. I nie powołuj się na eksperyment Libeta jako „dowód braku wolnej woli\" — interpretacja jest sporna.",
      },
    },
  },

  // ============================================================
  // 7. Filozofia języka: znaczenie
  // ============================================================
  {
    slug: "filozofia-jezyka-znaczenie",
    vaultSlug: "phil",
    label: "Filozofia języka — Frege, Wittgenstein, Meinong",
    payload: {
      title: "Filozofia języka: znaczenie",
      summary:
        "Skąd słowa biorą znaczenie? Frege rozróżnia sense i reference. Wittgenstein robi rewolucję, mówiąc że znaczenie to użycie. Meinong zastanawia się: o czym mówimy, gdy mówimy o jednorożcach? Pytania o pierwszym wejrzeniu techniczne, w praktyce fundament logiki i wszystkiego, co rozumiemy.",
      theory:
        "Gottlob Frege wprowadza klasyczne rozróżnienie: słowa mają reference (Bedeutung — to, do czego się odnoszą, obiekt w świecie) i sense (Sinn — sposób, w jaki słowo przedstawia ten obiekt). Klasyczny przykład: „gwiazda poranna\" i „gwiazda wieczorna\" mają to samo reference (planeta Wenus), ale różny sense — różny sposób prezentacji. Dlatego zdanie „gwiazda poranna = gwiazda wieczorna\" jest nietrywialnym odkryciem astronomicznym, mimo że obie nazwy odnoszą się do tego samego obiektu. Wittgenstein dzieli się na dwie fazy. Wczesny (Tractatus): język jako obraz świata, każde zdanie znaczy to, co przedstawia. Późny (Philosophical Investigations): rewolucja. „Znaczenie to użycie\" — nie pytaj o znaczenie, pytaj o użycie. Pojęcia jak „gra\" nie mają wspólnego rdzenia, tylko family resemblance — sieć nakładających się podobieństw między piłką nożną, szachami, pasjansem i zabawą w chowanego.\n\nWittgenstein wprowadza też language games (różne konteksty mają różne zasady używania słów — „boli mnie\" znaczy co innego u lekarza, w wierszu, w żartach) i private language argument: nie ma „prywatnego języka\" tylko w mojej głowie, język jest z konieczności społeczny. Słynny obraz „beetle in the box\": każdy ma w pudełku swojego chrząszcza, nikt nie może zajrzeć do cudzego. Zawartość pudełka jest nieistotna dla znaczenia słowa „chrząszcz\" — może każdy ma co innego, niektórzy nic. Słowo nadal funkcjonuje. Aplikacja: prywatne doświadczenia (ból, qualia) nie definiują znaczenia. Alexius Meinong rozwiązuje inną zagadkę: skoro myślimy o jednorożcach, Sherlocku Holmesie, okrągłych kwadratach — o czym mówimy? Wprowadza trzy poziomy: existence (rzeczywiste, krzesła, ludzie), subsistence (abstrakcyjne — liczby, prawa logiki), absistence (poza bytem, nieistniejące ale myślane obiekty — „Meinong's Jungle\").",
      questions: [
        {
          type: "abc",
          text: "Rozróżnienie Fregego między sense i reference pokazuje, że:",
          options: [
            "dwa wyrażenia o tym samym referencie zawsze są synonimami",
            "dwa wyrażenia mogą wskazywać ten sam obiekt, ale różnić się sposobem prezentacji",
            "reference jest ważniejszy niż sense",
          ],
          correctAnswer: 1,
          explanation:
            "Gwiazda poranna i gwiazda wieczorna to Wenus (reference), ale przedstawiają ją na różne sposoby (sense). Stąd nietrywialność odkrycia.",
        },
        {
          type: "abc",
          text: "Późny Wittgenstein twierdzi, że znaczenie słowa to:",
          options: [
            "obiekt, do którego się odnosi",
            "idea w głowie mówiącego",
            "sposób, w jaki słowo jest używane w praktyce",
          ],
          correctAnswer: 2,
          explanation:
            "„Meaning is use\". Nie pytaj o znaczenie, pytaj o użycie. To rewolucja względem teorii klasycznej (i własnego wczesnego Tractatusa).",
        },
        {
          type: "abc",
          text: "Family resemblance Wittgensteina najlepiej ilustruje przykład:",
          options: [
            "pojęcia „matematyka\"",
            "pojęcia „gra\"",
            "pojęcia „kolor czerwony\"",
          ],
          correctAnswer: 1,
          explanation:
            "Piłka nożna, szachy, pasjans, zabawa w chowanego — wszystko „gry\", ale brak wspólnego rdzenia. Sieć nakładających się podobieństw.",
        },
        {
          type: "fill",
          text: "Według Meinonga obiekty fikcyjne (jednorożce, Sherlock Holmes) istnieją w stanie zwanym _____.",
          options: null,
          correctAnswer: "absistence",
          explanation:
            "Trzy poziomy Meinonga: existence (rzeczywiste), subsistence (abstrakcyjne), absistence (poza bytem ale myślane). Stąd „Meinong's Jungle\".",
        },
        {
          type: "fill",
          text: "Argument Wittgensteina, że nie ma prywatnego języka tylko w głowie, ilustruje obraz _____ in the box.",
          options: null,
          correctAnswer: "beetle",
          explanation:
            "Każdy ma swojego chrząszcza w pudełku, nikt nie widzi cudzego. Zawartość nieistotna dla znaczenia — słowo „chrząszcz\" nadal działa publicznie.",
        },
        {
          type: "open",
          text: "Czym różni się sense od reference u Fregego, na przykładzie „gwiazdy porannej\".",
          options: null,
          correctAnswer:
            "Reference: planeta Wenus (obiekt). Sense: sposób prezentacji — „gwiazda poranna\" przedstawia Wenus jako ciało widoczne rano, „gwiazda wieczorna\" jako widoczne wieczorem. Ten sam obiekt, dwa różne sense.",
          explanation:
            "Bez tego rozróżnienia nie da się wyjaśnić, czemu zdanie „gwiazda poranna = gwiazda wieczorna\" jest odkryciem, nie tautologią.",
        },
        {
          type: "open",
          text: "Wyjaśnij, co private language argument robi z tezą, że qualia definiują znaczenie słów typu „ból\".",
          options: null,
          correctAnswer:
            "Wittgenstein argumentuje: zawartość prywatnego doświadczenia (qualia) jest nieistotna dla publicznego znaczenia słowa. Słowo „ból\" funkcjonuje w społecznym języku przez kontekst używania, nie przez wewnętrzny obraz. Nawet jeśli mój ból różni się od twojego, słowo działa.",
          explanation:
            "Beetle in the box pokazuje, że publiczne znaczenie nie wymaga zgodności prywatnych doświadczeń.",
        },
        {
          type: "spot_error",
          text: "„Meaning is use\" Wittgensteina oznacza, że każdy może używać słów jak chce, więc wszystko jest dowolne.",
          options: [
            "„Meaning is use\"",
            "Wittgensteina",
            "każdy może używać słów jak chce, więc wszystko jest dowolne",
            "wszystko OK",
          ],
          correctAnswer: 2,
          explanation:
            "Wittgenstein nie głosi dowolności. Użycie jest społecznie regulowane — w language games są zasady, mimo że nie są to definicje hierarchiczne.",
        },
      ],
      salon: {
        short:
          "Frege rozróżnia „sens\" i „odniesienie\": „gwiazda poranna\" i „gwiazda wieczorna\" wskazują tę samą planetę, ale przedstawiają ją na różne sposoby. To dlatego ich identyczność jest odkryciem, nie tautologią.",
        expand:
          "A Wittgenstein robi rewolucję, mówiąc że znaczenie słowa to nie jakiś byt mentalny, tylko sposób, w jaki tego słowa używamy. Pojęcie „gra\" nie ma jednej definicji, ma rodzinne podobieństwo. Obraz „beetle in the box\" pokazuje, że prywatne doświadczenia (ból, qualia) nie definiują publicznego znaczenia — język jest z konieczności społeczny. A Meinong dodaje trzeci wymiar: możemy sensownie mówić o jednorożcach i Sherlocku Holmesie, mimo że nie istnieją.",
        trap:
          "Frege'a sense/reference NIE jest opozycją „idealny vs materialny\" — sense to sposób prezentacji, nie idea w głowie. „Meaning is use\" Wittgensteina NIE znaczy „każdy używa jak chce\" — użycie jest społecznie regulowane. Beetle in the box NIE jest argumentem, że qualia nie istnieją — argumentem, że nie definiują publicznego języka. Meinong był wyśmiewany przez Russella, ale jego pomysły wracają we współczesnej logice modalnej.",
      },
    },
  },

  // ============================================================
  // 8. Język w działaniu
  // ============================================================
  {
    slug: "jezyk-w-dzialaniu",
    vaultSlug: "phil",
    label: "Język w działaniu — Grice, Austin, hate speech",
    payload: {
      title: "Język w działaniu",
      summary:
        "Filozofia języka nie kończy się na pytaniu „co słowa znaczą\". Ważniejsze: co słowa robią. Grice pokazuje, jak komunikujemy więcej niż mówimy. Austin pokazuje, że niektóre słowa to akcje. A inni filozofowie pytają: jak słowa mogą realnie krzywdzić, nie tylko opisywać krzywdę.",
      theory:
        "Paul Grice formułuje Cooperative Principle: rozmowa działa, bo zakładamy, że obie strony współpracują. Cztery maxims wynikają z tej zasady: quantity (mów tyle, ile trzeba), quality (mów to, w co wierzysz), relation (bądź na temat), manner (bądź jasna). Rozróżnia what is said (dosłowna treść) od what is implied (implicature — to, co rozumiemy ponad dosłowność). Przykład: „Czy jutro pracujesz?\" — „Mam pogrzeb taty\". Said: informacja o pogrzebie. Implied: nie pracuję jutro. Działa, bo zakładamy współpracę. Flouting maxims to świadome ich łamanie dla efektu — sarkazm łamie quality, niedopowiedzenie łamie quantity, aluzja łamie manner. Słuchacz rozumie, że zasada jest złamana świadomie, i szuka głębszego znaczenia.\n\nJ.L. Austin idzie dalej: słowa to akcje, nie tylko opisy. Constatives (opisy, prawdziwe/fałszywe) vs performatives (akcje, udane/nieudane). „Obiecuję, że przyjdę\" — nie opisujesz obietnicy, składasz ją. „Niniejszym nadaję ci tytuł...\" — nadajesz. „Tak\" na ślubie — zawierasz małżeństwo. Felicity conditions to warunki udania się performatywu: odpowiednia osoba (sędzia może skazać, ja nie), odpowiedni kontekst (ślub w urzędzie, nie w bajce), szczerość. Trzy poziomy aktu mowy: locutionary (samo wypowiedzenie), illocutionary (co robisz mówiąc — obiecujesz, ostrzegasz, pytasz), perlocutionary (efekt na słuchaczu — przekonujesz, straszysz). Z tego wyrasta dyskusja o how words can harm: hate speech to nie opis nienawiści, lecz akt krzywdy (jak performatyw). Thick concepts (odważny, okrutny, dziwka, bohater) łączą opis i ocenę — używanie ich już jest oceną. Use/mention distinction: czy „wymienienie\" słowa to to samo co jego „użycie\"? Spór trwa.",
      questions: [
        {
          type: "abc",
          text: "Cooperative Principle Grice'a głosi, że:",
          options: [
            "ludzie zawsze mówią prawdę",
            "rozmowa działa, bo zakładamy współpracę obu stron",
            "milczenie to najlepsza komunikacja",
          ],
          correctAnswer: 1,
          explanation:
            "To nie zasada etyczna, tylko opis: gdy komunikacja działa, działa dlatego, że obie strony się współpracują w sensie Grice'owskim.",
        },
        {
          type: "abc",
          text: "Performatywy Austina to wypowiedzi, które:",
          options: [
            "opisują rzeczywistość",
            "są zawsze nieszczere",
            "wykonują akcję samą wypowiedzią",
          ],
          correctAnswer: 2,
          explanation:
            "„Obiecuję\", „nadaję tytuł\", „tak\" na ślubie — nie opisujesz, robisz. Konstatywy opisują; performatywy działają.",
        },
        {
          type: "abc",
          text: "Trzy poziomy aktu mowy u Austina to:",
          options: [
            "locutionary, illocutionary, perlocutionary",
            "syntaktyka, semantyka, pragmatyka",
            "krótki, średni, długi",
          ],
          correctAnswer: 0,
          explanation:
            "Locutionary = co mówisz. Illocutionary = co robisz mówiąc (obiecujesz, ostrzegasz). Perlocutionary = co wywołujesz u słuchacza.",
        },
        {
          type: "fill",
          text: "To, co rozumiemy ponad dosłowną treść wypowiedzi, Grice nazywa _____.",
          options: null,
          correctAnswer: "implicature",
          explanation:
            "What is said vs what is implied. Implicature działa, bo zakładamy współpracę — sarkazm, aluzje, niedopowiedzenia wszystkie operują na tej zasadzie.",
        },
        {
          type: "fill",
          text: "Pojęcia łączące opis i wartościowanie (odważny, okrutny, bohater) to thick _____.",
          options: null,
          correctAnswer: "concepts",
          explanation:
            "Thick concepts. Nie da się ich neutralnie opisać bez moralnej oceny — używanie ich już oznacza ocenę.",
        },
        {
          type: "open",
          text: "Wyjaśnij flouting maxims na przykładzie sarkazmu.",
          options: null,
          correctAnswer:
            "Sarkazm to świadome łamanie maxim of quality — mówisz coś, w co nie wierzysz (np. „świetna pogoda\" w ulewie). Słuchacz rozumie, że zasada jest złamana świadomie, i szuka głębszego znaczenia. Stąd: sarkazm działa właśnie dlatego, że obaj wiemy, że dosłowna treść jest nieprawdziwa.",
          explanation:
            "Flouting nie jest błędem komunikacji — jest narzędziem. Łamiesz zasadę otwarcie, słuchacz interpretuje to jako sygnał implikatury.",
        },
        {
          type: "open",
          text: "Dlaczego hate speech jest u niektórych autorów traktowane jako performatyw, nie tylko opis?",
          options: null,
          correctAnswer:
            "Bo słowa nie tylko opisują nienawiść, ale wyrządzają krzywdę — atakują tożsamość ofiary, wpływają na samoocenę i bezpieczeństwo. Działają jak performatyw: samym wypowiedzeniem coś robią (krzywdzą), niezależnie od „prawdziwości\" treści. Darwall, Lawrence i inni argumentują, że krzywda językowa jest realna, nie tylko subiektywna.",
          explanation:
            "Stąd spór prawny: czy ograniczać hate speech? Wolność słowa vs ochrona przed krzywdą — i to ostatnie zyskuje argumenty z filozofii języka.",
        },
        {
          type: "spot_error",
          text: "Grice'a maxim of quality oznacza, że nigdy nie wolno kłamać, bo to zasada etyczna.",
          options: [
            "Grice'a maxim of quality",
            "nigdy nie wolno kłamać",
            "to zasada etyczna",
            "wszystko OK",
          ],
          correctAnswer: 2,
          explanation:
            "Grice'a maxims to NIE są zasady etyczne — to opis, jak działa komunikacja, gdy działa dobrze. Quality oznacza „nie twierdź rzeczy bez podstaw\", nie „nigdy nie kłam\".",
        },
      ],
      salon: {
        short:
          "Najciekawsze w filozofii języka jest to, że słowa nie tylko opisują, ale robią. Gdy mówisz „obiecuję\", nie opisujesz obietnicy — ty ją składasz. To Austin.",
        expand:
          "A Grice pokazuje, że w rozmowie rozumiemy dużo więcej niż się dosłownie mówi, bo zakładamy współpracę. Dlatego sarkazm działa, dlatego aluzje działają, dlatego rozumiemy, że „mam pogrzeb\" to odpowiedź na „czy jutro pracujesz\". Z tego wyrasta dyskusja o tym, jak słowa mogą krzywdzić — hate speech to nie opis nienawiści, lecz akt jej wykonania, jak performatyw. Stąd współczesne spory prawne o ograniczanie wolności słowa.",
        trap:
          "Grice'a maxims to nie zasady etyczne — to opis działania komunikacji. „Quality\" nie znaczy „mów tylko prawdę\", tylko „nie twierdź rzeczy bez podstaw\". Performatywy Austina nie są neutralne — można je też zawodzić (obietnica nieszczera, ślub w nieodpowiednim kontekście). I uważaj na use/mention distinction — czy „wymienienie\" rasistowskiego słowa to też rasizm? Spór wciąż otwarty.",
      },
    },
  },

  // ============================================================
  // 9. Estetyka: czym jest sztuka
  // ============================================================
  {
    slug: "estetyka-czym-jest-sztuka",
    vaultSlug: "phil",
    label: "Estetyka — Tołstoj, Danto, Wittgenstein, Hume",
    payload: {
      title: "Czym jest sztuka",
      summary:
        "Definiowanie sztuki próbowano setki lat i wszystkie definicje pękają na konkretnych przykładach. Tołstoj: świadomy przekaz emocji. Danto: kontekst i interpretacja. Wittgenstein: nie ma definicji, jest rodzinne podobieństwo. A Hume osobno pyta: czy gust można doskonalić?",
      theory:
        "Lew Tołstoj w 1897 roku zaproponował prostą definicję: sztuka to świadomy przekaz emocji. Artysta przeżywa uczucie, „wpakowuje\" je w dzieło, odbiorca przeżywa to samo. Sztuka prawdziwa = jasna komunikacja autentycznych, uniwersalnych emocji; sztuka „fałszywa\" to elitarna, niezrozumiała — Tołstoj odrzucił dużą część klasyki, w tym swoją „Wojnę i pokój\". Wittgenstein kontruje: sztuka jest cluster concept jak „gra\". Nie ma jednej cechy wspólnej wszystkim dziełom, tylko family resemblance — sieć nakładających się podobieństw. Próba „definicji sztuki\" jest skazana na porażkę, bo szukamy esencji tam, gdzie jej nie ma. Osobno warto rozróżnić aesthetic enjoyment (po prostu mi się podoba) i appreciation (rozumiem, dlaczego to jest dobre, nawet jeśli nie sprawia mi przyjemności — np. trudny film Bergmana).\n\nArthur Danto robi przełom po wystawie Brillo Boxes Andy'ego Warhola w 1964. Pudełko Brillo w sklepie to przedmiot. Pudełko Brillo w galerii to sztuka. Wyglądają identycznie. Wniosek: o byciu sztuką decyduje nie wygląd, tylko kontekst i interpretacja — artworld, instytucjonalna sieć galerii, krytyków, teorii, historii. Sztuka to nie cecha obiektu, lecz relacja obiektu z artworld. David Hume z kolei pyta inaczej: czy gust jest subiektywny? Pozornie tak, ale Hume twierdzi, że istnieje standard taste, ustalany przez good critics — osoby z delikatnością postrzegania, doświadczeniem, praktyką porównywania, brakiem uprzedzeń i zdrowym rozsądkiem. Dzieła, które zachwycają good critics przez wiele kultur i wieków, są obiektywnie lepsze. Szekspir działa po 400 latach — to nie jest przypadek.",
      questions: [
        {
          type: "abc",
          text: "Według Tołstoja sztuka to:",
          options: [
            "manipulacja zmysłami dla rozrywki",
            "świadomy przekaz emocji od artysty do odbiorcy",
            "wyraz idealnego piękna",
          ],
          correctAnswer: 1,
          explanation:
            "Tołstoj definiuje sztukę funkcjonalnie: artysta przeżywa uczucie, dzieło je niesie, odbiorca przeżywa to samo. Prosta, ale prowokacyjna teza.",
        },
        {
          type: "abc",
          text: "Brillo Boxes Warhola pokazują, że:",
          options: [
            "wszystko może być sztuką, jeśli artysta tak powie",
            "o byciu sztuką decyduje kontekst (artworld), nie wygląd",
            "konsumpcjonizm jest najwyższą formą sztuki",
          ],
          correctAnswer: 1,
          explanation:
            "Argument Danto: pudełko w sklepie i pudełko w galerii wyglądają identycznie, ale tylko jedno jest sztuką. Decyduje sieć instytucjonalna i interpretacja.",
        },
        {
          type: "abc",
          text: "Według Hume'a gust:",
          options: [
            "jest całkowicie subiektywny, nikt nie ma racji",
            "można doskonalić, istnieje standard taste przez good critics",
            "wynika z genów",
          ],
          correctAnswer: 1,
          explanation:
            "Hume nie jest elitarystą — pokazuje empirycznie, że gust można trenować, a niektóre dzieła wytrzymują test czasu w wielu kulturach.",
        },
        {
          type: "fill",
          text: "Wittgenstein twierdzi, że sztuka nie ma jednej definicji — tylko _____ resemblance.",
          options: null,
          correctAnswer: "family",
          explanation:
            "Pojęcie sztuki jest otwarte i ewoluuje. Łączą ją nakładające się podobieństwa, nie wspólna esencja.",
        },
        {
          type: "fill",
          text: "Rozumiem, dlaczego dzieło jest ważne, choć nie sprawia mi przyjemności — to estetyczna _____.",
          options: null,
          correctAnswer: "appreciation",
          explanation:
            "Appreciation wymaga wiedzy i kontekstu, w przeciwieństwie do enjoyment (po prostu mi się podoba).",
        },
        {
          type: "open",
          text: "Wyjaśnij argument Danto z Brillo Boxes.",
          options: null,
          correctAnswer:
            "Pudełko Brillo w supermarkecie to przedmiot użytkowy. Pudełko Brillo Warhola w galerii to sztuka. Wyglądają identycznie. Więc to nie wygląd decyduje o statusie sztuki, lecz artworld — sieć galerii, krytyków, teorii i historii, które nadają obiektowi status sztuki przez interpretację.",
          explanation:
            "Stąd: sztuka to nie cecha obiektu, lecz relacja obiektu ze społeczeństwem artystycznym.",
        },
        {
          type: "open",
          text: "Czemu Wittgenstein uważa, że nie da się zdefiniować sztuki?",
          options: null,
          correctAnswer:
            "Sztuka to cluster concept — nie ma jednej cechy wspólnej wszystkim dziełom (Mozart, Brillo Boxes, performance, ikona prawosławna nie dzielą jednej esencji). Łączy je sieć nakładających się podobieństw — family resemblance. Próba definicji szuka esencji tam, gdzie jej nie ma.",
          explanation:
            "To nie znaczy, że pojęcie jest bezużyteczne — jest otwarte i ewoluuje, zachowując sens przez praktykę używania.",
        },
        {
          type: "spot_error",
          text: "Danto twierdzi, że wszystko może być sztuką, jeśli tylko artysta nazwie to sztuką.",
          options: [
            "Danto twierdzi",
            "wszystko może być sztuką",
            "jeśli tylko artysta nazwie to sztuką",
            "wszystko OK",
          ],
          correctAnswer: 2,
          explanation:
            "Danto NIE redukuje sztuki do deklaracji artysty. Wymaga teoretycznej interpretacji i kontekstu artworld. Pudełko Brillo na śmietniku to nie sztuka, mimo że Warhol je „nazwał\".",
        },
      ],
      salon: {
        short:
          "Najciekawszy zwrot w filozofii sztuki to Danto. Po Brillo Boxes Warhola stało się jasne, że nie da się odróżnić sztuki od nie-sztuki na podstawie wyglądu. Pudełko w supermarkecie to przedmiot, pudełko w galerii to sztuka.",
        expand:
          "O byciu sztuką decyduje nie obiekt, tylko artworld: kontekst instytucji, historii, teorii i interpretacji. To zmieniło całą estetykę. Wcześniej Tołstoj próbował zdefiniować sztukę jako przekaz emocji, Wittgenstein argumentował, że definicja jest niemożliwa (cluster concept). A Hume osobno bronił idei, że gust można doskonalić — niektóre dzieła wytrzymują test czasu i kultur, i to nie jest przypadek.",
        trap:
          "Tołstoj brzmi naiwnie, ale jego pytanie jest poważne — jeśli sztuka nie komunikuje, jaką ma wartość? Wittgenstein NIE mówi, że pojęcie sztuki jest bezużyteczne, mówi że jest otwarte. Danto NIE głosi, że „wszystko jest sztuką\" — wymaga kontekstu artworld. Hume to nie elitaryzm — to argument empiryczny, że gust można trenować.",
      },
    },
  },

  // ============================================================
  // 10. Sztuka i emocje
  // ============================================================
  {
    slug: "sztuka-i-emocje",
    vaultSlug: "phil",
    label: "Sztuka i emocje — Platon, Arystoteles, paradox of fiction",
    payload: {
      title: "Sztuka i emocje",
      summary:
        "Czemu płaczemy oglądając film, choć wiemy, że to fikcja? Czemu Arystoteles uważał tragedię za zdrową, a Platon za niebezpieczną? Czy sztuka, która jest moralnie odpychająca, może być dobra artystycznie? Klasyczne pytania, na które filozofia daje napięte odpowiedzi.",
      theory:
        "Platon w „Państwie\" jest podejrzliwy wobec sztuki. Sztuka to mimesis — naśladowanie, więc dwa kroki od rzeczywistości. Niebezpieczna, bo apeluje do emocji, nie rozumu. Tragedia uczy nas „ulegać\" emocjom, co osłabia kontrolę i deformuje charakter. Wyrzuca poetów z idealnego miasta. Arystoteles polemizuje z mistrzem: tragedia wywołuje litość i strach, ale w kontrolowany sposób je „wyładowuje\" — catharsis. Nie deformuje, lecz reguluje emocje. Tragedia jako emocjonalna higiena: doświadczamy intensywnych uczuć bezpiecznie, w teatrze, dzięki strukturze dzieła (jedność akcji, hamartia bohatera, peripeteia, anagnorisis).\n\nWspółczesny problem: paradox of fiction. Płaczemy nad Anną Kareniną, ale Anna nie istnieje. Trzy pozornie sprzeczne warunki: mamy autentyczne emocje, wiemy że postacie nie istnieją, i emocje wymagają wiary w istnienie obiektu. Coś musi pęknąć. Kendall Walton mówi: to quasi-emotions, nie pełne emocje — sztuka to make-believe, gra w udawanie. Podobne mechanizmy fizjologiczne, ale inna struktura poznawcza. Noël Carroll kontruje: emocje wobec fikcji SĄ prawdziwe, wystarczy „myśl o istnieniu\" (entertaining the thought), nie pełna wiara. R.G. Collingwood dorzuca klasyfikację sztuki: amusement art (rozrywka, ma wywoływać konkretne emocje — komedia, horror), magic art (wzmacnia emocje społeczne — hymny, propaganda), proper art (ekspresja, gdzie artysta sam dopiero odkrywa, co czuje, przez tworzenie). I osobno: spór autonomism vs aesthetic moralism. Autonomiści: wartość artystyczna i moralna są niezależne (Riefenstahl: „Triumf woli\" jest brawurowo zrealizowany, a propagandowo nazistowski). Moraliści: moralne wady dzieła obniżają jego wartość artystyczną. Większość współczesnych filozofów to umiarkowani moraliści.",
      questions: [
        {
          type: "abc",
          text: "Arystoteles bronił tragedii argumentem, że:",
          options: [
            "wzmacnia emocje, żeby były intensywniejsze w życiu",
            "wyładowuje emocje w bezpieczny sposób — catharsis",
            "uczy logicznego myślenia",
          ],
          correctAnswer: 1,
          explanation:
            "Catharsis: tragedia wywołuje litość i strach, ale je reguluje. Emocjonalna higiena, nie deformacja jak chciał Platon.",
        },
        {
          type: "abc",
          text: "Walton tłumaczy nasze łzy nad fikcją jako:",
          options: [
            "prawdziwe emocje, nieodróżnialne od realnych",
            "quasi-emotions w grze w udawanie",
            "objaw choroby psychicznej",
          ],
          correctAnswer: 1,
          explanation:
            "Make-believe theory: podobna fizjologia, ale inna struktura poznawcza. Wiemy, że Anna nie istnieje, więc to quasi-strach, nie pełen strach.",
        },
        {
          type: "abc",
          text: "Autonomism w filozofii sztuki głosi, że:",
          options: [
            "wartość artystyczna i moralna są niezależne",
            "tylko artyści moralnie nienaganni tworzą wartościowe dzieła",
            "sztuka powinna być wolna od polityki",
          ],
          correctAnswer: 0,
          explanation:
            "Klasyczny case: Riefenstahl „Triumf woli\" — brawurowo zrealizowany, propagandowo odrażający. Autonomiści: dwa wymiary niezależne.",
        },
        {
          type: "fill",
          text: "Arystoteles oczyszczenie emocji przez tragedię nazywa _____.",
          options: null,
          correctAnswer: "catharsis",
          explanation:
            "Spór historyczny: czy catharsis to „oczyszczenie\" (medyczne) czy „klaryfikacja\" (poznawcza). Sam Arystoteles tego nie sprecyzował.",
        },
        {
          type: "fill",
          text: "Sztuka, w której artysta odkrywa emocje przez tworzenie (a nie wyraża z góry znaną emocję), to według Collingwooda _____ art.",
          options: null,
          correctAnswer: "proper",
          explanation:
            "Trzy poziomy: amusement (rozrywka), magic (społeczna), proper (ekspresja). Tylko ostatnia jest sztuką w pełnym sensie.",
        },
        {
          type: "open",
          text: "Wyjaśnij paradox of fiction.",
          options: null,
          correctAnswer:
            "Mamy autentyczne emocje wobec fikcyjnych postaci (płaczemy nad Anną Kareniną). Wiemy, że one nie istnieją. A emocje wymagają wiary w istnienie obiektu. Trzy warunki nie mogą zachodzić razem — coś musi pęknąć. Walton mówi: to quasi-emotions. Carroll mówi: warunek trzeci jest fałszywy.",
          explanation:
            "Rozwiązanie zależy od tego, który warunek się uchyli. Walton uchyla pierwszy, Carroll trzeci.",
        },
        {
          type: "open",
          text: "Czemu Platon się sztuki bał?",
          options: null,
          correctAnswer:
            "Bo apeluje do emocji, nie rozumu, i przez to deformuje charakter. Tragedia uczy ulegania emocjom, osłabiając kontrolę. Plus: sztuka jest mimesis (naśladowaniem), dwa kroki od rzeczywistości (idee → świat → sztuka). Wyrzuca poetów z idealnego miasta.",
          explanation:
            "Ważne: Platon nie zakazuje całej sztuki. Pozwala na hymny do bogów. Wyrzuca tragedię i poezję mimetyczną.",
        },
        {
          type: "spot_error",
          text: "Walton twierdzi, że nasze łzy oglądając Annę Kareninę są fałszywe — w rzeczywistości nic nie czujemy.",
          options: [
            "Walton twierdzi",
            "nasze łzy są fałszywe",
            "w rzeczywistości nic nie czujemy",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Walton NIE mówi, że łzy są fałszywe. Mówi, że ich struktura poznawcza jest inna — to quasi-emotions w ramach gry w udawanie, ale realnie odczuwane.",
        },
      ],
      salon: {
        short:
          "Spór o sztukę i emocje jest stary jak filozofia. Platon się sztuki bał, bo działa na emocje, nie rozum. Arystoteles ją bronił, mówiąc o catharsis: tragedia leczy nas, dając wyładowanie litości i strachu w bezpiecznych warunkach.",
        expand:
          "A współczesny paradox of fiction pyta: czemu w ogóle płaczemy nad Anną Kareniną, skoro wiemy, że nie istnieje? Kendall Walton mówi: to quasi-emotions w grze w udawanie. Noël Carroll kontruje: emocje są prawdziwe, tylko nie wymagają wiary w istnienie. To pokazuje, jak dziwną mamy relację z fikcją — i jak filozofia próbuje ją rozplątać sześć tysięcy lat po pierwszej tragedii greckiej.",
        trap:
          "Platon NIE zakazuje całej sztuki — pozwala na hymny do bogów. Catharsis Arystotelesa nie jest jasno zdefiniowana — spór: oczyszczenie czy klaryfikacja? Walton NIE mówi, że łzy są fałszywe — chodzi o strukturę poznawczą. A spór autonomism/moralism nie ma jednej odpowiedzi: Riefenstahl jako klasyczny case study wciąż dzieli filozofów.",
      },
    },
  },

  // ============================================================
  // 11. Metaetyka
  // ============================================================
  {
    slug: "metaetyka",
    vaultSlug: "phil",
    label: "Metaetyka — realizm vs anti-realizm, relatywizm",
    payload: {
      title: "Metaetyka",
      summary:
        "Etyka pyta „co powinienem zrobić?\". Metaetyka pyta o coś fundamentalniejszego: czy istnieją obiektywne odpowiedzi na pytania etyczne, czy każdy ma swoje? Bez metaetyki wszystkie spory etyczne wiszą w powietrzu — nie wiadomo, o co tak naprawdę walczą.",
      theory:
        "Metaetyka stawia cztery główne pytania: czy istnieją obiektywne fakty moralne? Skąd biorą się moralne wartości? Czy „dobre\" znaczy to samo dla wszystkich? Co znaczą sądy moralne? Moral Realism mówi: istnieją obiektywne fakty moralne, niezależne od opinii. „Zabijać niewinnych jest złe\" jest prawdziwe w taki sam sposób jak „2+2=4\" czy „woda to H2O\". Sądy moralne mogą być prawdziwe lub fałszywe. Wariant naturalistyczny: fakty moralne to fakty o świecie (cierpienie, dobrostan — Sam Harris). Wariant non-naturalistyczny (G.E. Moore): fakty moralne istnieją, ale nie są redukowalne do faktów naturalnych. Grounding problem: jeśli fakty moralne istnieją, gdzie są zakotwiczone? Możliwe odpowiedzi: w Bogu (Divine Command), w naturze ludzkiej (Natural Law), w rozumie (Kant), w konsekwencjach (Util), w cnocie (Arystoteles). Każde zakotwiczenie ma swoje problemy.\n\nPo drugiej stronie: Moral Anti-realism. Nie istnieją obiektywne fakty moralne, sądy moralne nie są „prawdziwe\" ani „fałszywe\" w mocnym sensie. Cultural Relativism: moralność jest relatywna do kultury, „dobre\" znaczy „uznawane za dobre przez moją kulturę\". Argumenty za: różnice kulturowe — kanibalizm, poligamia, kara śmierci akceptowane w różnych miejscach. Subjectivism idzie dalej: moralność zależy od indywidualnej osoby, sądy moralne to wyrażenia preferencji. Najmocniej brzmi Emotivism: sądy moralne to czysta ekspresja emocji („Boo, killing!\", „Hooray, charity!\") — nie mają wartości logicznej. Krytyka relatywizmu: paradoks — czy „należy szanować inne kultury\" jest samo obiektywne, czy relatywne? Jeśli obiektywne, to relatywizm pada. Jeśli relatywne, argument się rozpada. Plus: trudno relatywizmowi wytłumaczyć moralny postęp (zniesienie niewolnictwa, prawa kobiet) — to były „zmiany kultury\" czy „odkrycia moralne\"?",
      questions: [
        {
          type: "abc",
          text: "Moral Realism głosi, że:",
          options: [
            "istnieją obiektywne fakty moralne, niezależne od opinii",
            "moralność wymyśliły religie, żeby kontrolować ludzi",
            "każdy ma swoją prawdę moralną",
          ],
          correctAnswer: 0,
          explanation:
            "„Zabijać niewinnych jest złe\" jest prawdziwe w taki sam sposób jak „2+2=4\". Sądy moralne mogą być prawdziwe lub fałszywe.",
        },
        {
          type: "abc",
          text: "Cultural Relativism twierdzi, że:",
          options: [
            "moralność jest relatywna do kultury",
            "każdy człowiek ma swoją moralność",
            "moralność wynika z biologii",
          ],
          correctAnswer: 0,
          explanation:
            "„Dobre\" znaczy „uznawane za dobre przez moją kulturę\". Argument za: różnice kulturowe (poligamia, kara śmierci) akceptowane w różnych miejscach.",
        },
        {
          type: "abc",
          text: "Emotivism redukuje sądy moralne do:",
          options: [
            "ukrytych imperatywów",
            "wyrażeń emocji („Boo, killing!\")",
            "praw natury",
          ],
          correctAnswer: 1,
          explanation:
            "Skrajna forma anti-realizmu. Sądy moralne nie mają wartości logicznej — to ekspresja, nie opis.",
        },
        {
          type: "fill",
          text: "G.E. Moore twierdził, że fakty moralne istnieją, ale nie da się ich zredukować do faktów _____ — to non-naturalistyczny realizm.",
          options: null,
          correctAnswer: "naturalnych",
          explanation:
            "Open question argument: „X jest dobry\" zawsze jest sensownym pytaniem, więc „dobry\" nie znaczy żadnej cechy naturalnej. Klasyka XX-wiecznej metaetyki.",
        },
        {
          type: "fill",
          text: "Pytanie „gdzie są zakotwiczone fakty moralne, jeśli istnieją?\" nazywa się _____ problem.",
          options: null,
          correctAnswer: "grounding",
          explanation:
            "Możliwe odpowiedzi: Bóg, natura ludzka, rozum, konsekwencje, cnota. Każde zakotwiczenie generuje swoje trudności.",
        },
        {
          type: "open",
          text: "Jaki jest klasyczny paradoks Cultural Relativismu?",
          options: null,
          correctAnswer:
            "Cultural Relativism mówi „należy szanować inne kultury\". Ale czy to twierdzenie jest samo obiektywne, czy relatywne? Jeśli obiektywne — to istnieją obiektywne normy, więc relatywizm pada. Jeśli relatywne — to argument za relatywizmem rozpada się we własnych założeniach.",
          explanation:
            "Klasyczny problem autoreferencji: teza relatywizmu, użyta na samej sobie, niszczy własną podstawę.",
        },
        {
          type: "open",
          text: "Czemu moralny postęp jest problemem dla Cultural Relativismu?",
          options: null,
          correctAnswer:
            "Zniesienie niewolnictwa, prawa kobiet, zakaz tortur — czy to były „zmiany kultury\" (równouprawnione z dawnymi normami), czy „odkrycia moralne\" (poprawne odpowiedzi na trudne pytania)? Relatywizm musi powiedzieć pierwsze, ale intuicja mówi drugie. Stąd argument przeciw relatywizmowi.",
          explanation:
            "Jeśli moralny postęp to tylko zmiana, nie ma sensu mówić, że abolicja była „lepsza\". Realizm wyjaśnia to naturalnie, relatywizm — z trudem.",
        },
        {
          type: "spot_error",
          text: "Anti-realizm w metaetyce oznacza, że wszystko wolno i nie ma sensu prowadzić sporów moralnych.",
          options: [
            "Anti-realizm",
            "wszystko wolno",
            "nie ma sensu prowadzić sporów moralnych",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Anti-realizm NIE oznacza „wszystko wolno\". Wielu anti-realistów ma silne moralne intuicje — po prostu nie wierzą w ich obiektywność. Spory też mają sens, choć inne niż w realizmie.",
        },
      ],
      salon: {
        short:
          "Metaetyka pyta o coś bardzo fundamentalnego: czy „zabijać niewinnych jest złe\" jest prawdziwe w takim samym sensie jak „woda to H2O\", czy tylko „moja kultura tak uważa\"?",
        expand:
          "Realiści mówią, że są obiektywne fakty moralne. Relatywiści mówią, że są tylko fakty społeczne. Ten spór decyduje o tym, czy w ogóle ma sens prowadzić spór etyczny, czy każdy zostaje przy swoim. I jest empiryczny test relatywizmu: jeśli abolicja niewolnictwa była tylko „zmianą kultury\", to nie była lepsza ani gorsza od dawnych praktyk. Intuicja mówi inaczej — i to jeden z mocniejszych argumentów za realizmem.",
        trap:
          "Anti-realizm NIE znaczy „wszystko wolno\" — wielu anti-realistów ma silne moralne intuicje, tylko nie wierzą w ich obiektywność. Realizm NIE wymaga Boga — można być świeckim realistą (Sam Harris). Subjectivism NIE jest tym samym co tolerancja. I uważaj na samoreferencyjny paradoks relatywizmu: „należy szanować inne kultury\" jako sama teza relatywna unieważnia argument.",
      },
    },
  },

  // ============================================================
  // 12. Natural Law
  // ============================================================
  {
    slug: "natural-law",
    vaultSlug: "phil",
    label: "Natural Law — Tomasz z Akwinu, Hume i is-ought",
    payload: {
      title: "Natural Law",
      summary:
        "Skąd bierze się moralność, jeśli nie z Boga bezpośrednio i nie z konwencji? Natural Law: z natury ludzkiej. Tomasz z Akwinu rozwija to klasycznie. Ale Hume zadaje pytanie, które wstrząsa całą tradycją: czy z tego, jak rzeczy są, można wywieść, jak powinny być?",
      theory:
        "Tomasz z Akwinu (XIII w.) buduje teorię Natural Law: moralność wynika z natury ludzkiej, którą stworzył Bóg. Bóg nadał wszystkim bytom telos (cel), w tym człowiekowi. Rozum naturalny pozwala odkryć, co jest dla człowieka dobre — dlatego Natural Law jest uniwersalna i poznawalna nawet dla niewierzących. Łączy myślenie religijne z arystotelesowskim. Tomasz wymienia basic goods wpisane w naturę ludzką: życie, reprodukcja, wychowywanie potomstwa, poszukiwanie Boga, życie społeczne, unikanie krzywdzenia, unikanie ignorancji. Każde dobre działanie wspiera te dobra, każde złe je narusza. Ważne rozróżnienie: positive injunction (nakaz pozytywny — „czyń X\") jest trudniejszy, bo zależny od okoliczności. Prohibition (zakaz — „nie czyń X\") jest mocniejszy, obowiązuje zawsze. Stąd klasyczna intuicja: „nie wolno torturować dziecka, choćby skutki były dobre\".\n\nWspółczesne aplikacje Natural Law: etyka medyczna (aborcja, eutanazja, antykoncepcja), etyka seksualna, argumenty przeciw karze śmierci, prawa człowieka jako wynikające z natury, nie z państwa. Ale David Hume w XVIII w. zadaje pytanie, które wstrząsa całą tradycją: z faktów (is) nie wynikają wartości (ought). Ze stwierdzenia „ludzie się rozmnażają\" nie wynika „ludzie powinni się rozmnażać\". Z „człowiek ma rozum\" nie wynika „człowiek powinien postępować zgodnie z rozumem\". To is-ought gap (G.E. Moore później nazwie to naturalistic fallacy). Każda etyka, która wyprowadza powinność z natury, musi ten gap przeskoczyć. Możliwe odpowiedzi Natural Law: Tomasz mówi, że natura nie jest „neutralnym faktem\", tylko zawiera telos — z telosu wynika powinność. Współcześni naturaliści (Philippa Foot, Alasdair MacIntyre) argumentują, że dobrostan i cierpienie są inherentnie wartościujące.",
      questions: [
        {
          type: "abc",
          text: "Natural Law według Tomasza z Akwinu zakorzenia moralność w:",
          options: [
            "bezpośrednich nakazach Boga",
            "naturze ludzkiej, którą stworzył Bóg",
            "umowie społecznej",
          ],
          correctAnswer: 1,
          explanation:
            "Bóg nadał człowiekowi naturę z telosem (celem). Rozum naturalny odkrywa, co jest dobre — bez konieczności objawienia. Stąd Natural Law jest poznawalna nawet dla niewierzących.",
        },
        {
          type: "abc",
          text: "Is-ought problem Hume'a głosi, że:",
          options: [
            "z faktów nie wynikają wartości",
            "fakty są ważniejsze niż wartości",
            "wartości to złudzenie",
          ],
          correctAnswer: 0,
          explanation:
            "Z „ludzie mają rozum\" nie wynika „powinni postępować zgodnie z rozumem\". Każda etyka oparta na naturze musi przeskoczyć tę przepaść.",
        },
        {
          type: "abc",
          text: "Wśród basic goods Tomasza NIE ma:",
          options: [
            "życia",
            "wiedzy",
            "bogactwa materialnego",
          ],
          correctAnswer: 2,
          explanation:
            "Tomasz wymienia: życie, reprodukcję, wychowywanie potomstwa, poszukiwanie Boga, życie społeczne, unikanie krzywdy, unikanie ignorancji. Bogactwo nie jest basic good.",
        },
        {
          type: "fill",
          text: "Zakaz („nie czyń X\") jest mocniejszy niż nakaz pozytywny, bo obowiązuje _____.",
          options: null,
          correctAnswer: "zawsze",
          explanation:
            "Stąd „nie wolno torturować dziecka, choćby skutki były dobre\". Positive injunction zależy od okoliczności, prohibition działa bezwarunkowo.",
        },
        {
          type: "fill",
          text: "G.E. Moore nazwał próbę wyprowadzenia „dobrego\" z faktów naturalnych _____ fallacy.",
          options: null,
          correctAnswer: "naturalistic",
          explanation:
            "Rozszerzenie is-ought problem. „Dobre\" nie da się zredukować do żadnej cechy naturalnej — open question argument.",
        },
        {
          type: "open",
          text: "Jak Tomasz mógłby odpowiedzieć Hume'owi na is-ought problem?",
          options: null,
          correctAnswer:
            "Tomasz twierdziłby, że natura ludzka nie jest „neutralnym faktem\", tylko zawiera w sobie telos (cel). Człowiek ma cel — rozumność, życie w społeczeństwie, dążenie do dobra. Z tego celu wynika powinność, bo „być człowiekiem\" to znaczy „realizować swój telos\". Powinność jest wbudowana w naturę, nie wyciągana z neutralnych faktów.",
          explanation:
            "Współcześni Tomasiści (Foot, MacIntyre) argumentują podobnie: dobrostan i cierpienie są inherentnie wartościujące, nie neutralne.",
        },
        {
          type: "open",
          text: "Czemu „naturalne\" w Natural Law NIE znaczy „biologicznie naturalne\"?",
          options: null,
          correctAnswer:
            "„Naturalne\" w sensie Natural Law oznacza „zgodne z istotną naturą ludzkiej rozumności\" — nie „zgodne z biologią\". To rozróżnienie ratuje teorię przed naturalistic fallacy w wersji „skoro biologia X, to X jest dobre\". Tomasz mówi o naturze rozumnej, nie zwierzęcej.",
          explanation:
            "Pomylenie tych dwóch znaczeń to klasyczna pułapka. „Naturalne biologicznie\" (np. agresja) nie ma w Natural Law statusu moralnie dobrego.",
        },
        {
          type: "spot_error",
          text: "Natural Law to teoria religijna, bo wymaga wiary w Boga jako fundament moralności.",
          options: [
            "Natural Law to teoria",
            "religijna",
            "wymaga wiary w Boga",
            "wszystko OK",
          ],
          correctAnswer: 2,
          explanation:
            "Natural Law NIE wymaga wiary w Boga. Można być Natural Law theorist bez religii (Philippa Foot, Alasdair MacIntyre). Tomasz dodaje Boga, ale teoria może bez Niego funkcjonować.",
        },
      ],
      salon: {
        short:
          "Tomasz z Akwinu próbuje wyprowadzić moralność z natury ludzkiej. Człowiek ma swoją naturę, swoje basic goods (życie, wiedza, społeczeństwo), a z nich wynika, co jest dobre.",
        expand:
          "Brzmi rozsądnie, ale David Hume zadaje pytanie, które do dziś nie ma jednej odpowiedzi: czy z faktów (jak rzeczy są) można wywieść wartości (jak powinny być)? To is-ought problem. Każda etyka oparta na naturze musi przez ten gap przeskoczyć. Tomasz odpowiada, że natura zawiera telos, więc powinność jest w niej wbudowana. Współcześni Natural Law theorists (Foot, MacIntyre) argumentują, że dobrostan i cierpienie są inherentnie wartościujące, nie neutralne.",
        trap:
          "Natural Law NIE jest tylko religijna — można być świeckim Natural Law theorist. „Naturalne\" NIE znaczy biologicznie naturalne — to byłaby naturalistic fallacy. Tomasz nie mówi, że wszyscy poznają moralność tak samo — twierdzi, że potencjalnie mogą, jeśli używają rozumu. I uważaj na pułapkę „naturalne jest X, więc X jest dobre\" — to dokładnie ten błąd, który Hume krytykuje.",
      },
    },
  },

  // ============================================================
  // 13. Kant: etyka obowiązku
  // ============================================================
  {
    slug: "kant-etyka-obowiazku",
    vaultSlug: "phil",
    label: "Kant — etyka obowiązku, imperatyw kategoryczny",
    payload: {
      title: "Kant: etyka obowiązku",
      summary:
        "Kant robi rewolucję w etyce. Wcześniej moralność była zakotwiczona w Bogu, naturze albo skutkach. Kant mówi: nic z tego. Moralność wynika z czystego rozumu, niezależnie od pragnień, konsekwencji i religii. Jedna z najmocniejszych pozycji w historii etyki — i klucz do rozróżnienia od utylitaryzmu i Arystotelesa.",
      theory:
        "Podstawowa intuicja Kanta: moralność musi być uniwersalna, bezwarunkowa i wynikać z rozumu. Nie z pragnień (są subiektywne), nie z konsekwencji (są niepewne), nie z religii (musi obowiązywać każdą rozumną istotę, też niewierzących). Hypothetical imperatives mają formę „jeśli chcesz X, zrób Y\" — zależą od celu, są praktyczne ale warunkowe, nie moralne. Categorical imperatives: „rób X, bo to jest moralnie słuszne\" — niezależne od pragnień, obowiązują każdą rozumną istotę bezwarunkowo. Główna formuła to Universalizability Principle: „postępuj tylko według takiej zasady, którą mógłbyś chcieć uczynić prawem powszechnym\". Test: zanim coś zrobisz, pytaj — a co, gdyby wszyscy tak robili? Jeśli wynik byłby logicznie sprzeczny lub niemożliwy do zaakceptowania, działanie jest niemoralne. Klasyczny przykład: czy mogę kłamać dla korzyści? A gdyby wszyscy kłamali, kiedy im się opłaca? Pojęcie obietnicy, zaufania, samej komunikacji by się rozpadło. Kłamstwo nie da się zuniwersalizować, więc jest niemoralne. Słynna konsekwencja: Kant twierdzi, że nie wolno kłamać nawet mordercy, który pyta, gdzie schowała się twoja przyjaciółka. Sam Kant przyjmuje tę skrajność.\n\nFormula of Humanity (drugie sformułowanie imperatywu): „postępuj tak, abyś używał człowieczeństwa zawsze jako celu, nigdy tylko jako środka\". Krócej: traktuj ludzi jako cele same w sobie. Nie znaczy to, że nie wolno nikogo używać do żadnych celów (kasjer pomaga mi kupić chleb, więc go „używam\"). Znaczy: nigdy tylko jako środka, ignorując jego godność. Kłamstwo manipuluje drugą osobą, narusza jej godność. Trzecie pojęcie: good will — jedyna rzecz „dobra bez zastrzeżeń\". Działanie z obowiązku, z szacunku dla prawa moralnego. Działanie z chęci, sympatii, korzyści nie ma wartości moralnej (choć może być pożądane). Słynna teza: pomoc bliźniemu z miłości nie jest moralnie wartościowa. Pomoc z poczucia obowiązku — tak.",
      questions: [
        {
          type: "abc",
          text: "Według Kanta moralność wynika z:",
          options: [
            "konsekwencji działań",
            "czystego rozumu, niezależnie od pragnień i skutków",
            "uczuć i sympatii do innych",
          ],
          correctAnswer: 1,
          explanation:
            "Pułapka jest taka: Kant NIE patrzy na skutki (to Util) ani na charakter (to Arystoteles). Patrzy na zasadę i racjonalną formę.",
        },
        {
          type: "abc",
          text: "Universalizability Principle pyta:",
          options: [
            "czy zasada mojego działania może być prawem dla wszystkich",
            "czy działanie przyniesie więcej szczęścia",
            "czy działanie pasuje do mojej kultury",
          ],
          correctAnswer: 0,
          explanation:
            "Test: gdybym mógł chcieć, żeby wszyscy tak postępowali. Jeśli wynik byłby logicznie sprzeczny — działanie jest niemoralne.",
        },
        {
          type: "abc",
          text: "Formula of Humanity zabrania:",
          options: [
            "używania ludzi do jakichkolwiek celów",
            "używania ludzi tylko jako środków, bez szacunku dla godności",
            "współpracy z innymi",
          ],
          correctAnswer: 1,
          explanation:
            "Pułapka: Kant nie zabrania używania ludzi do celów. Zabrania używania ich tylko jako środka, ignorując ich człowieczeństwo.",
        },
        {
          type: "fill",
          text: "Imperatywy hipotetyczne mają formę „jeśli chcesz X, zrób Y\". Imperatywy _____ obowiązują bezwarunkowo.",
          options: null,
          correctAnswer: "kategoryczne",
          explanation:
            "Tylko kategoryczne imperatywy są moralne — niezależne od pragnień i celów. Hipotetyczne są praktyczne, ale moralnie obojętne.",
        },
        {
          type: "fill",
          text: "Kant twierdzi, że jedyną rzeczą dobrą bez zastrzeżeń jest _____ wola.",
          options: null,
          correctAnswer: "dobra",
          explanation:
            "Good will — działanie z obowiązku, z szacunku dla prawa moralnego. Nie z sympatii, nie z korzyści.",
        },
        {
          type: "open",
          text: "Wyjaśnij, dlaczego Kant uważa, że nie wolno kłamać nawet mordercy pytającemu o przyjaciółkę.",
          options: null,
          correctAnswer:
            "Zasada „wolno kłamać, gdy się opłaca\" nie da się zuniwersalizować — gdyby wszyscy tak robili, samo pojęcie zaufania i komunikacji by się rozpadło. Kant przyjmuje skrajną konsekwencję: zasada uniwersalna obowiązuje bezwarunkowo, nawet w trudnych okolicznościach. Większość filozofów próbuje to złagodzić, ale sam Kant się nie ugina.",
          explanation:
            "To słynna teza pokazująca rygoryzm Kanta. Argument: jeśli złamiesz zasadę dla skutków, etyka konsekwencjalistyczna wygrywa, a Kant tego nie chce.",
        },
        {
          type: "open",
          text: "Wyjaśnij różnicę między Universalizability a Złotą Regułą („nie czyń drugiemu...\").",
          options: null,
          correctAnswer:
            "Złota Reguła odwołuje się do pragnień („to, czego ja bym chciał/nie chciał\"). Universalizability Kanta jest głębsza — pyta o logiczną spójność zasady, niezależnie od pragnień. Pragnienia są subiektywne, racjonalność uniwersalna. Plus: Złota Reguła zawodzi w przypadkach asymetrycznych (masochista mógłby chcieć, żeby inni go bili), Kant takich problemów nie ma.",
          explanation:
            "Stąd Kantowska etyka jest mocniejsza niż Złota Reguła — opiera się na rozumie, nie na sympatii.",
        },
        {
          type: "spot_error",
          text: "Kant uważa, że uczucia są moralnie złe, a działanie z miłości jest niemoralne.",
          options: [
            "Kant uważa, że uczucia są moralnie złe",
            "działanie z miłości jest niemoralne",
            "uczucia",
            "wszystko OK",
          ],
          correctAnswer: 0,
          explanation:
            "Kant NIE mówi, że uczucia są złe. Mówi, że nie są podstawą moralności — wartość moralna pochodzi z rozumu, choć uczucie może towarzyszyć. Działanie z miłości jest dopuszczalne i pożądane, tylko bez wartości moralnej w sensie ścisłym.",
        },
      ],
      salon: {
        short:
          "Kant przesuwa moralność z emocji, religii i konsekwencji na czysty rozum. Dla niego pytanie nie brzmi: czy to mi się opłaci, ani czy to przyniesie dobre skutki, tylko: czy zasada mojego działania mogłaby obowiązywać wszystkich?",
        expand:
          "I jego druga formuła jest piękna: traktuj ludzi zawsze jako cele same w sobie, nigdy tylko jako środki. To jedna z największych myśli w historii etyki — fundament współczesnych praw człowieka. Kant przyjmuje też skrajne konsekwencje: nie wolno kłamać nawet mordercy, który pyta gdzie schowała się przyjaciółka. Większość się ugina, Kant nie.",
        trap:
          "NAJWAŻNIEJSZE: Kant ≠ Util. Kant patrzy na ZASADĘ i intencję, NIE na konsekwencje — to często mylone. Kant NIE mówi, że uczucia są złe, tylko że nie są podstawą moralności. Formula of Humanity nie zabrania używania ludzi do celów, tylko używania ich TYLKO jako środków. I Universalizability NIE jest tym samym co Złota Reguła — Kant idzie głębiej, opierając się na logicznej spójności, nie sympatii.",
      },
    },
  },

  // ============================================================
  // 14. Utylitaryzm
  // ============================================================
  {
    slug: "utylitaryzm",
    vaultSlug: "phil",
    label: "Utylitaryzm — Bentham, Mill, act vs rule",
    payload: {
      title: "Utylitaryzm",
      summary:
        "Utylitaryzm to przeciwieństwo Kanta. Kant pyta o zasadę. Utylitarysta pyta o konsekwencje. Dobre jest to, co przynosi najwięcej dobra największej liczbie. Wygląda prosto i intuicyjnie, ale prowadzi do bardzo niewygodnych konsekwencji. Razem z Kantem i Arystotelesem to święta trójca etyki.",
      theory:
        "Podstawowa teza utylitaryzmu: moralność = maksymalizacja dobra. „Dobre\" zwykle definiowane jako szczęście, dobrostan, redukcja cierpienia. Greatest happiness for the greatest number. Liczy się wynik, nie intencja ani zasada. Jeremy Bentham (XVIII/XIX w.) — klasyczny utylitaryzm. Hedonistic theory: jedynym dobrem jest przyjemność, jedynym złem cierpienie. Wszystkie inne wartości są redukowalne. Felicific calculus: można obliczać sumę przyjemności i cierpienia po intensywności, czasie trwania, pewności, bliskości, płodności, czystości, zasięgu. Other-regarding: liczę nie tylko swoje szczęście, ale wszystkich. Impartiality: szczęście każdej osoby waży tak samo. John Stuart Mill modyfikuje: rozróżnia higher pleasures (intelektualne, estetyczne, moralne) i lower (cielesne). Słynne: „better Socrates dissatisfied than a pig satisfied\". Test: kto doświadczył obu rodzajów, woli higher. Krytyka: czy to nie zdradza utylitaryzmu? Wprowadza obiektywną hierarchię.\n\nWażne rozróżnienie: Act vs Rule Utilitarianism. Act Util ocenia każde pojedyncze działanie według skutków — „która decyzja tu i teraz przyniesie najwięcej dobra?\". Problem: pozwala na intuicyjnie niemoralne działania (zabić jednego, żeby uratować pięciu). Rule Util ocenia zasady według ogólnych konsekwencji: „jaka reguła, jeśli wszyscy będą przestrzegać, przyniesie najlepsze skutki?\". Reguła „nie zabijaj niewinnych\" daje generalnie lepsze skutki — bliższy intuicji, ale krytykowany jako „Kant z innym uzasadnieniem\". Klasyczne wyzwania: trolley problem (czy przekierować wagon, żeby zabił 1 zamiast 5?), transplant case (czy zabić zdrowego, by uratować pięciu pobierając organy?), utility monster Nozicka (istota czerpiąca nieproporcjonalnie więcej szczęścia — czy mu wszystko oddać?). Trolley problem często traktowany jako test utylitaryzmu — ludzie przekierują wagon (5 vs 1), ale nie popchną grubasa z mostu (też 5 vs 1). Intuicje są mieszane. Słynna krytyka: utylitaryzm może poświęcić jednostkę dla dobra ogółu — jednostka nie ma „nienaruszalnej godności\" jak u Kanta.",
      questions: [
        {
          type: "abc",
          text: "Utylitaryzm ocenia czyn po:",
          options: [
            "intencji",
            "zasadzie",
            "sumie szczęścia i cierpienia (konsekwencjach)",
          ],
          correctAnswer: 2,
          explanation:
            "To przeciwieństwo Kanta. Pułapka jest taka: liczy się wynik, nie intencja ani forma zasady.",
        },
        {
          type: "abc",
          text: "Mill rozróżnia higher i lower pleasures. Słynne zdanie:",
          options: [
            "lepiej Sokrates niezadowolony niż świnia szczęśliwa",
            "wszystkie przyjemności są równe",
            "lepiej świnia szczęśliwa niż Sokrates niezadowolony",
          ],
          correctAnswer: 0,
          explanation:
            "Mill wprowadza hierarchię przyjemności. Krytyka: czy to nie zdradza czystego utylitaryzmu Benthama, wprowadzając obiektywną wartość?",
        },
        {
          type: "abc",
          text: "Rule Utilitarianism ocenia:",
          options: [
            "każde pojedyncze działanie według skutków",
            "zasady według ich ogólnych konsekwencji",
            "charakter osoby działającej",
          ],
          correctAnswer: 1,
          explanation:
            "Bliższy intuicji moralnej, ale krytykowany jako „Kant z innym uzasadnieniem\". Reguła „nie zabijaj\" daje generalnie lepsze konsekwencje niż reguła „zabijaj gdy się opłaca\".",
        },
        {
          type: "fill",
          text: "Bentham proponował obliczać sumę przyjemności i cierpienia po siedmiu wymiarach — to felicific _____.",
          options: null,
          correctAnswer: "calculus",
          explanation:
            "Intensywność, czas, pewność, bliskość, płodność, czystość, zasięg. Klasyczny utylitaryzm w wersji najmocniejszej.",
        },
        {
          type: "fill",
          text: "W eksperymencie transplant case Act Util zaleca zabicie zdrowego pacjenta, żeby uratować _____ chorych pobierając organy.",
          options: null,
          correctAnswer: "pięciu",
          explanation:
            "Klasyczny case pokazujący problem Act Util — większość intuicji moralnej się buntuje, mimo że arytmetyka szczęścia wygrywa.",
        },
        {
          type: "open",
          text: "Wyjaśnij główną różnicę między Kantem a utylitaryzmem.",
          options: null,
          correctAnswer:
            "Kant ocenia czyn po zasadzie i intencji (deontologia) — pyta, czy zasada da się zuniwersalizować. Utylitaryzm ocenia czyn po sumie szczęścia (konsekwencjalizm) — pyta, jaki będzie wynik. Kant: nie wolno zabić jednego, żeby uratować pięciu (narusza godność). Util: można, bo arytmetyka wygrywa.",
          explanation:
            "Ta różnica jest fundamentalna w etyce. Trzeci pozycja (Arystoteles) pyta o trzeci wymiar: charakter osoby działającej.",
        },
        {
          type: "open",
          text: "Czemu trolley problem pokazuje, że nasze intuicje moralne są mieszane?",
          options: null,
          correctAnswer:
            "Większość przekieruje wagon (zabić 1 zamiast 5) — utylitaryzm wygrywa. Ale większość NIE popchnie grubasa z mostu, mimo że arytmetyka jest taka sama (1 zamiast 5). Różnica: przekierowanie to skutek uboczny, popchnięcie to bezpośrednie użycie jako środka. Doktryna podwójnego skutku — intuicja działa, choć Util nie powinien rozróżniać.",
          explanation:
            "To pokazuje, że nasze intuicje moralne są mieszane — częściowo utylitarystyczne, częściowo deontologiczne (Kantowskie).",
        },
        {
          type: "spot_error",
          text: "Utylitaryzm to forma egoizmu, bo liczy tylko własne szczęście jednostki podejmującej decyzję.",
          options: [
            "Utylitaryzm to forma egoizmu",
            "liczy tylko własne szczęście",
            "jednostki podejmującej decyzję",
            "wszystko OK",
          ],
          correctAnswer: 0,
          explanation:
            "Utylitaryzm to PRZECIWIEŃSTWO egoizmu. Other-regarding i impartiality: liczę szczęście wszystkich tak samo, nie tylko swoje.",
        },
      ],
      salon: {
        short:
          "Utylitaryzm jest bardzo intuicyjny, bo pyta: co realnie zmniejszy cierpienie i zwiększy dobrostan? Bentham mówił o felicific calculus, Mill dodał rozróżnienie między higher and lower pleasures.",
        expand:
          "Ale utylitaryzm bywa niebezpieczny, bo dla dobra większości może poświęcić jednostkę. To dlatego trolley problem jest tak ciekawym testem: intuicja nie idzie czystą matematyką szczęścia. Większość przekieruje wagon, ale nie popchnie grubasa z mostu — mimo identycznej arytmetyki. To pokazuje, że nasze intuicje są mieszane: częściowo utylitarystyczne, częściowo Kantowskie.",
        trap:
          "Utylitaryzm to NIE egoizm — wprost przeciwnie, liczy wszystkich równo. Mill z higher/lower pleasures łatwo pomylić ze snobizmem — on nie mówi „opera jest lepsza niż piwo\", tylko że istnieje hierarchia testowana empirycznie. Act Util prowadzi do problematycznych konsekwencji (transplant case) — Rule Util to próba ich uniknięcia. I uważaj na klasyczną krytykę: utylitaryzm może poświęcić jednostkę dla ogółu, nie ma „nienaruszalnej godności\" jak u Kanta.",
      },
    },
  },

  // ============================================================
  // 15. Contractarianism (Hobbes)
  // ============================================================
  {
    slug: "contractarianism-hobbes",
    vaultSlug: "phil",
    label: "Contractarianism — Hobbes, social contract",
    payload: {
      title: "Contractarianism (Hobbes)",
      summary:
        "Co, jeśli moralność nie istnieje obiektywnie, a my ją po prostu wymyślamy, bo bez niej życie byłoby koszmarem? Hobbes pisze to po wojnie domowej w Anglii. Widział co się dzieje, gdy państwo upada. Jego odpowiedź: moralność i polityka to racjonalna umowa, którą zawieramy, bo alternatywa jest gorsza.",
      theory:
        "Thomas Hobbes (XVII w.) w „Leviathanie\" wychodzi z mocnego realizmu o naturze ludzkiej. Ludzie nie są źli z natury, ale działają z samozachowania i lęku. W naturalnym świecie bez państwa każdy musi sam się bronić. State of Nature (stan natury) to hipotetyczny stan przed państwem: brak stabilnej władzy, brak gwarancji bezpieczeństwa, każdy chroni się sam. „War of all against all\" (bellum omnium contra omnes). Słynny opis życia człowieka w stanie natury: solitary, poor, nasty, brutish, and short. To nie znaczy, że ludzie są źli — znaczy, że bez zaufania i bezpieczeństwa współpraca się rozpada. Rozwiązanie: Social Contract. Ludzie zawierają umowę — oddają część wolności w zamian za bezpieczeństwo. Przekazują władzę suwerenowi (Leviathanowi), który ma autorytet wymuszać reguły. W zamian zgadzają się przestrzegać umowy. Rozróżnienie: explicit contract (jawna umowa — Konstytucja, śluby) vs implicit contract (dorozumiana, przez życie w społeczeństwie). Krytyka: czy „dorozumiana umowa\" jest naprawdę umową? Nikt jej nie podpisywał.\n\nRights imply obligations: jeśli chcę mieć prawa, muszę uznać obowiązki wobec innych. Prawo do życia = obowiązek nie zabijania. Prawo do własności = obowiązek nie kradzieży. Moralność jako wzajemność. Prisoner's Dilemma ilustruje problem zaufania: dwóch więźniów może zeznawać przeciw sobie lub milczeć. Najlepszy wspólny wynik: oboje milczą. Najgorszy: jeden zdradza, drugi milczy. Racjonalnie indywidualnie: defection (zdradzić). Racjonalnie wspólnie: cooperate. Bez zaufania i egzekucji każdy zdradza. To pokazuje, dlaczego potrzebujemy państwa: żeby egzekwowało umowę. Mocna teza Hobbesowska: „there is no morality until we make it up\" — moralność powstaje z umowy społecznej, jest narzędziem cywilizacji. To konstruktywizm moralny (antyrealizm metaetyczny). Późniejsi kontraktualiści: John Locke (kontrakt liberalny, państwo chroni prawa), Jean-Jacques Rousseau („wola powszechna\"), John Rawls (XX w., „veil of ignorance\" — kontrakt zawierany za zasłoną niewiedzy o swojej pozycji).",
      questions: [
        {
          type: "abc",
          text: "Według Hobbesa w stanie natury (state of nature):",
          options: [
            "ludzie żyli w szczęśliwym pierwotnym pokoju",
            "panuje war of all against all, życie jest „solitary, poor, nasty, brutish, and short\"",
            "ludzie żyli pod kontrolą szamanów",
          ],
          correctAnswer: 1,
          explanation:
            "Ważna pułapka: state of nature to model teoretyczny, nie historyczny. Hobbes nie twierdzi, że ludzie kiedyś tak żyli — pyta o logikę współpracy bez egzekucji.",
        },
        {
          type: "abc",
          text: "Hobbesowski social contract:",
          options: [
            "ludzie oddają wolność w zamian za bezpieczeństwo, przekazują władzę suwerenowi",
            "wszyscy podpisują dokument konstytucyjny",
            "władza pochodzi od Boga, nie od ludzi",
          ],
          correctAnswer: 0,
          explanation:
            "Leviathan: silna władza wymuszająca umowę. Hobbes był rojalistą — wspierał silną centralizację, później Locke i Rousseau wyciągnęli z kontraktu liberalne wnioski.",
        },
        {
          type: "abc",
          text: "Prisoner's Dilemma pokazuje, że bez egzekucji:",
          options: [
            "wszyscy zawsze współpracują",
            "racjonalna indywidualnie strategia to zdrada, mimo że współpraca byłaby wspólnie lepsza",
            "moralność powstaje automatycznie",
          ],
          correctAnswer: 1,
          explanation:
            "To formalna ilustracja, czemu potrzebujemy państwa — żeby egzekwowało umowę. Inaczej każdy zdradza, mimo że wszyscy by zyskali na współpracy.",
        },
        {
          type: "fill",
          text: "Stan natury według Hobbesa Bellum omnium contra _____.",
          options: null,
          correctAnswer: "omnes",
          explanation:
            "Wojna wszystkich przeciw wszystkim. Bez bezpieczeństwa współpraca się rozpada, choć Hobbes nie głosi że ludzie są źli — tylko że bez egzekucji muszą się tak zachowywać.",
        },
        {
          type: "fill",
          text: "John Rawls w „Theory of Justice\" proponuje, że sprawiedliwe zasady to te, które wybralibyśmy za _____ niewiedzy o swojej pozycji w społeczeństwie.",
          options: null,
          correctAnswer: "zasłoną",
          explanation:
            "Veil of ignorance — współczesny renesans kontraktualizmu. Pyta: jakie zasady wybralibyśmy, nie wiedząc czy będziemy bogaci czy biedni?",
        },
        {
          type: "open",
          text: "Wyjaśnij rozróżnienie między explicit a implicit contract i czemu to drugie jest problematyczne.",
          options: null,
          correctAnswer:
            "Explicit contract to jawna umowa (Konstytucja, śluby) — strony świadomie ją zawierają. Implicit contract to dorozumiana umowa przez życie w społeczeństwie i korzystanie z jego dóbr. Problem: nikt jej świadomie nie podpisywał. Czy można być związanym umową, której się nie zawierało? To poważny zarzut przeciw kontraktualizmowi.",
          explanation:
            "Stąd częsta krytyka: „nigdy nie zgodziłem się na obecny system\". Kontraktualiści odpowiadają różnie — albo argumentem racjonalnym (zgodziłabyś się, gdybyś racjonalnie wybierała), albo strukturalnym (sama struktura społeczna implikuje zgodę).",
        },
        {
          type: "open",
          text: "Czemu Hobbes był rojalistą, choć jego idea social contract bywa kojarzona z liberalizmem?",
          options: null,
          correctAnswer:
            "Hobbes wnioskuje, że suweren musi być silny i mieć autorytet wymuszać umowę — inaczej powraca chaos. Stąd jego rojalizm i obrona monarchii absolutnej. Późniejsi kontraktualiści (Locke, Rousseau) wzięli sam kontrakt jako narzędzie, ale wyciągnęli z niego liberalne wnioski: kontrakt ogranicza władzę, gwarantuje prawa.",
          explanation:
            "Stąd ciekawy paradoks: Hobbesowska idea jest fundamentem zarówno absolutyzmu (Leviathan), jak i liberalizmu (Locke, Rawls).",
        },
        {
          type: "spot_error",
          text: "Hobbes uważał, że ludzie są z natury źli, dlatego potrzebują silnego państwa.",
          options: [
            "Hobbes uważał",
            "ludzie są z natury źli",
            "potrzebują silnego państwa",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Hobbes NIE mówi, że ludzie są źli. Mówi, że bez bezpieczeństwa muszą się zachowywać brutalnie — to sytuacja, nie natura. Współpraca rozpada się, gdy nie ma kto egzekwować umów.",
        },
      ],
      salon: {
        short:
          "Hobbes pokazuje moralność i porządek społeczny jako racjonalną umowę. Nie dlatego, że ludzie są aniołami, tylko dlatego, że bez zasad życie byłoby „solitary, poor, nasty, brutish, and short\".",
        expand:
          "To realistyczna pozycja: nie potrzebujemy odwoływać się do Boga ani natury, żeby uzasadnić moralność. Wystarczy, że alternatywa jest gorsza dla każdego. Prisoner's Dilemma formalnie pokazuje, czemu potrzebujemy państwa — bez egzekucji każdy zdradza, choć wszyscy by zyskali na współpracy. Współczesny Rawls dorzuca veil of ignorance: sprawiedliwe są zasady, które wybralibyśmy, nie wiedząc, czy będziemy bogaci czy biedni.",
        trap:
          "Hobbes NIE mówi, że ludzie są źli — mówi, że bez bezpieczeństwa muszą się tak zachowywać. State of nature to model teoretyczny, nie historyczny. Implicit contract jest poważnym problemem teorii — nikt go nie podpisywał. I Hobbes był rojalistą, choć jego idea kontraktu posłużyła potem liberalizmowi (Locke, Rawls). Ciekawy paradoks intelektualny.",
      },
    },
  },

  // ============================================================
  // 16. Virtue Ethics (Arystoteles)
  // ============================================================
  {
    slug: "virtue-ethics-arystoteles",
    vaultSlug: "phil",
    label: "Virtue Ethics — Arystoteles, eudaimonia, golden mean",
    payload: {
      title: "Virtue Ethics (Arystoteles)",
      summary:
        "Trzecia ze świętej trójcy etyki. Kant pyta o zasadę. Util pyta o skutki. Arystoteles pyta o coś zupełnie innego: jakim człowiekiem mam się stać? Moralność to nie pojedyncze decyzje, tylko charakter, który kształtujesz całe życie. Dziś jedna z najbardziej popularnych pozycji w etyce, bo wydaje się najbliższa życiu.",
      theory:
        "Podstawowa intuicja Arystotelesa: złe pytanie etyki to „co mam zrobić?\". Dobre pytanie: „jakim człowiekiem mam się stać?\". Moralność to nie pojedyncze działania, tylko dyspozycje charakteru. Etyka jest rozwojowa — trenujesz się w cnocie jak w grze na instrumencie. Virtue (cnota) to dobra cecha charakteru, dyspozycja do działania właściwego. Vice (wada) to zła dyspozycja. Cnoty są trenowalne: stajesz się odważna przez robienie odważnych rzeczy, hojna przez bycie hojną. Arystoteles formułuje to mocno: „stajemy się sprawiedliwi przez sprawiedliwe działania\". Golden Mean (złoty środek): cnota leży między dwiema skrajnościami — jedną przez nadmiar, drugą przez niedomiar. Klasyczne pary: tchórzostwo ← odwaga → brawura; skąpstwo ← hojność → rozrzutność; małostkowość ← wielkoduszność → próżność. Uwaga: złoty środek to NIE przeciętność. To właściwa reakcja we właściwej sytuacji. Czasem właściwa reakcja jest blisko jednej skrajności (w czasie wojny odwaga blisko brawury).\n\nProper functioning: każdy byt ma swoją funkcję (ergon). Nóż dobrze tnie, koń dobrze biegnie. Funkcja człowieka: życie zgodne z rozumem. Człowiek dobry = ten, kto dobrze realizuje funkcję rozumną. Practical wisdom (phronesis): mądrość praktyczna, zdolność oceny, co w konkretnej sytuacji jest właściwe. Nie da się jej wyuczyć z książek — wymaga doświadczenia, refleksji, czasu. Bez phronesis cnoty są ślepe (odwaga bez phronesis = brawura). Moral exemplars: uczymy się cnoty przez wzory osobowe. Patrząc na osoby cnotliwe i naśladując ich, kształtujemy własny charakter. Dlatego biografie, historia, literatura mają znaczenie moralne. Cel człowieka: eudaimonia — najczęściej tłumaczona jako rozkwit, pełnia życia, dobre życie. NIE jest to po prostu szczęście w sensie hedonistycznym. Eudaimonia to życie zgodne z najlepszą wersją człowieczeństwa: rozwinięte cnoty + praktyczna mądrość + relacje + sens. Telos ludzkiego życia. Klasyczny case porównawczy (mordercą pyta o przyjaciółkę): Kant nie wolno kłamać (zasada uniwersalna). Util można skłamać dla skutków (uratowanie życia). Arystoteles: co zrobiłaby osoba mądra, odważna i opiekuńcza? Prawdopodobnie skłamie, ale dlatego, że wynika to z jej charakteru, nie z kalkulacji ani z zasady.",
      questions: [
        {
          type: "abc",
          text: "Arystoteles uważa, że właściwe pytanie etyki to:",
          options: [
            "co mam zrobić w tej sytuacji?",
            "jakim człowiekiem mam się stać?",
            "jakie są konsekwencje moich działań?",
          ],
          correctAnswer: 1,
          explanation:
            "Pułapka jest taka: virtue ethics ≠ Kant ≠ Util. Arystoteles patrzy na charakter, nie na pojedyncze decyzje czy zasady.",
        },
        {
          type: "abc",
          text: "Golden Mean (złoty środek) to:",
          options: [
            "przeciętność, średnia między ekstremami",
            "właściwa reakcja we właściwej sytuacji, między nadmiarem a niedomiarem",
            "wybór najmniej kontrowersyjny",
          ],
          correctAnswer: 1,
          explanation:
            "Częsta pułapka. Golden Mean to NIE przeciętność. Czasem właściwa reakcja jest blisko skrajności (w czasie wojny odwaga blisko brawury).",
        },
        {
          type: "abc",
          text: "Eudaimonia Arystotelesa to:",
          options: [
            "szczęście rozumiane jako przyjemność",
            "rozkwit, pełnia życia zgodnego ze swoją naturą rozumną",
            "zaspokojenie wszystkich potrzeb",
          ],
          correctAnswer: 1,
          explanation:
            "Pułapka: eudaimonia to NIE szczęście w sensie hedonistycznym. Pełnia, sens, rozwinięte cnoty + praktyczna mądrość + relacje.",
        },
        {
          type: "fill",
          text: "Mądrość praktyczna, zdolność oceny sytuacji, którą trenuje się przez doświadczenie, to _____.",
          options: null,
          correctAnswer: "phronesis",
          explanation:
            "Bez phronesis cnoty są ślepe — odwaga w niewłaściwej sytuacji to nie odwaga, tylko brawura. Klucz do prawidłowego stosowania cnót.",
        },
        {
          type: "fill",
          text: "Arystoteles powiedział: „stajemy się sprawiedliwi przez sprawiedliwe _____\".",
          options: null,
          correctAnswer: "działania",
          explanation:
            "Cnoty są trenowalne, nie wrodzone. Stajesz się odważna przez robienie odważnych rzeczy, hojna przez bycie hojną. To etyka rozwojowa.",
        },
        {
          type: "open",
          text: "Porównaj, jak Kant, Util i Arystoteles podchodzą do problemu „morderca pyta gdzie przyjaciółka\".",
          options: null,
          correctAnswer:
            "Kant: nie wolno kłamać, zasada uniwersalna obowiązuje bezwarunkowo. Util: można skłamać, bo skutki będą lepsze (uratowane życie). Arystoteles: co zrobiłaby osoba mądra, odważna i opiekuńcza? Prawdopodobnie skłamie, ale dlatego, że wynika to z jej charakteru, nie z kalkulacji konsekwencji ani z zasady.",
          explanation:
            "Ta trójca różnych odpowiedzi pokazuje fundamentalną różnicę między etyką deontologiczną, konsekwencjalistyczną i cnotliwą.",
        },
        {
          type: "open",
          text: "Czemu cnoty są trenowalne według Arystotelesa?",
          options: null,
          correctAnswer:
            "Cnoty to nie wrodzone właściwości, lecz dyspozycje charakteru, które kształtują się przez powtarzane działania. „Stajemy się sprawiedliwi przez sprawiedliwe działania\". Im więcej razy działasz odważnie, tym łatwiej ci być odważną — odwaga staje się częścią ciebie. To dlatego moral exemplars (wzory osobowe) mają znaczenie: patrzymy, naśladujemy, formujemy charakter.",
          explanation:
            "Stąd etyka jest rozwojowa, podobna do nauki gry na instrumencie. Wymaga praktyki, czasu, doświadczenia.",
        },
        {
          type: "spot_error",
          text: "Złoty środek Arystotelesa to przeciętność — wybieraj zawsze drogę środkową, unikaj skrajności.",
          options: [
            "Złoty środek Arystotelesa",
            "to przeciętność",
            "unikaj skrajności",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Golden Mean to NIE przeciętność. To właściwa reakcja we właściwej sytuacji — czasem blisko skrajności (np. heroizm w walce). Mylenie golden mean z „średnią\" to klasyczna pułapka.",
        },
      ],
      salon: {
        short:
          "Arystoteles jest bardzo praktyczny, bo moralność traktuje jak trening charakteru. Nie wystarczy wiedzieć, czym jest odwaga — trzeba ją ćwiczyć, aż stanie się częścią tego, kim jesteś.",
        expand:
          "Cnota leży w złotym środku, ale to nie jest przeciętność, tylko właściwa reakcja we właściwej sytuacji. I cel tego wszystkiego to eudaimonia: nie szczęście jako przyjemność, tylko pełnia życia zgodnego ze swoją naturą rozumną. Klucz: phronesis, mądrość praktyczna, której nie wyuczysz się z książek. Bez niej odwaga staje się brawurą, hojność rozrzutnością. Klasyczna trójca etyki: Kant patrzy na zasadę, Util na skutki, Arystoteles na to, kim się staję.",
        trap:
          "NAJWAŻNIEJSZE: virtue ethics ≠ Kant ≠ Util. Trzy zupełnie różne pytania. Golden Mean NIE jest przeciętnością — to właściwa reakcja, czasem blisko skrajności. Eudaimonia NIE jest „szczęściem\" w sensie przyjemności — to rozkwit, pełnia, sens. Phronesis jest niezbywalna — bez niej cnoty stają się sztywne. I uważaj na zarzut circularity: cnotliwa osoba robi to, co robi cnotliwa osoba. Odpowiedź: phronesis i moral exemplars łamią cykl, dając konkretne punkty zaczepienia.",
      },
    },
  },

  // ============================================================
  // 17. Angielski: filler words i tentative phrasing
  // ============================================================
  {
    slug: "angielski-filler-words",
    vaultSlug: "en",
    label: "Angielski C1 — filler words i tentative phrasing",
    payload: {
      title: "Filler words & tentative phrasing",
      summary:
        "Największa blokada na C1 w consultingu: wstawki typu „uh, like, I guess, actually\". Wstawiasz je, żeby brzmieć grzeczniej, ale w business contexcie klient kupuje pewność, nie wahanie. Native speakerzy też używają fillerów, ale rzadziej i bardziej świadomie. U Polaków często kalka z „no, wiesz, jakby\".",
      theory:
        "Filler words to: uh, um, like, well, so, you know, kind of, sort of. Tentative phrasing to: I guess, I don't think, maybe, actually, possibly, just. W business angielskim (consulting, finance, decyzje pre-board) działają przeciwnie do tego, co czujesz po polsku: czujesz, że łagodzą i są grzeczne, brzmią jak niezdecydowanie i brak pewności. Klient nie kupi rekomendacji od osoby, która sama siebie nie kupuje. Native speakerzy w tych branżach zwykle używają mocniejszych formuł: „I'd argue\", „In my view\", „The data suggests\", „Specifically\", „The next logical step\".\n\nKluczowe podmiany do automatyzacji: „I guess\" → „I believe\" lub „I'd argue\". „I don't think X\" → „In my view, X isn't the strongest option\". „Actually, maybe...\" → „Specifically, we need to...\". „Well, so...\" → pomiń, zacznij od konkretu. „uh, like, you know\" → pauza, oddech, dalej. Pauza zawsze wygrywa z fillerem. Cisza brzmi jak myślenie, „uh\" brzmi jak panika. Osobno: słowo „just\" („I just wanted to ask...\") brzmi jak przeprosiny za swoje istnienie — wyrzuć z pracy. Grzeczność w business angielskim robi się przez „could / would / please\", nie przez tentative language. To dwie różne rzeczy, których Polak często nie rozróżnia.",
      questions: [
        {
          type: "abc",
          text: "Co powinno zastąpić „I guess\" w rekomendacji dla klienta?",
          options: [
            "I believe / I'd argue",
            "I think maybe",
            "I'm not sure but probably",
          ],
          correctAnswer: 0,
          explanation:
            "Pułapka jest taka: „I guess\" wydaje się grzeczne po polsku, w business angielskim brzmi jak ktoś, kto sam siebie nie kupuje. „I'd argue\" / „I believe\" pokazują pewność bez arogancji.",
        },
        {
          type: "abc",
          text: "„I just wanted to ask...\" — co z tym?",
          options: [
            "Jest grzeczne i naturalne, używaj",
            "Brzmi jak przeprosiny za swoje istnienie",
            "Jest poprawne tylko w mailach",
          ],
          correctAnswer: 1,
          explanation:
            "„Just\" w pracy to przeprosiny za zabieranie czasu. Wyrzuć: „I'd like to ask\" albo wprost pytanie bez preambuły.",
        },
        {
          type: "abc",
          text: "Filler words u native speakerów w consulting/finance:",
          options: [
            "w ogóle nie występują — to znak nieprofesjonalizmu",
            "występują, ale rzadziej i świadomiej",
            "są używane tak samo często jak po polsku",
          ],
          correctAnswer: 1,
          explanation:
            "Nie chodzi o ich całkowite wykorzenienie — to niemożliwe. Chodzi o świadomość: pauza zamiast „uh\", konkret zamiast „well, so\".",
        },
        {
          type: "fill",
          text: "W rekomendacji dla zarządu: „I'd _____ that the data clearly points toward option B.\"",
          options: null,
          correctAnswer: "argue",
          explanation:
            "„I'd argue\" — pewność z otwartością na dyskusję. Mocna formuła, brzmi profesjonalnie bez arogancji.",
        },
        {
          type: "fill",
          text: "Cisza brzmi jak myślenie. „Uh\" brzmi jak _____.",
          options: null,
          correctAnswer: "panika",
          explanation:
            "Pauza zawsze wygrywa z fillerem. To kontrintuicyjne dla Polaków, którzy czują presję, żeby „nie milczeć\".",
        },
        {
          type: "open",
          text: "Wyjaśnij, dlaczego „I guess\" brzmi źle w consulting/finance contexcie po angielsku.",
          options: null,
          correctAnswer:
            "Brzmi jak ktoś, kto sam siebie nie kupuje. Klient kupuje pewność, nie wahanie. W polskim mózgu wydaje się grzeczne, w angielskim business contexcie jest niezdecydowane i nieprofesjonalne. Plus: tentative language ≠ politeness — grzeczność robi się przez „could/would/please\", nie przez „guess\".",
          explanation:
            "Kluczowe rozróżnienie: tentativeness ≠ politeness. To dwie różne dźwignie językowe.",
        },
        {
          type: "open",
          text: "Jak przeformułować to zdanie po angielsku w stylu rekomendacji dla zarządu: „I just thought maybe we could check this with commercial team\"?",
          options: null,
          correctAnswer:
            "„In my view, the next logical step is to validate this with the commercial team.\" Wycięte: just, maybe, could (jako tentative). Dodane: konkretna formuła „In my view\" + „next logical step\" + assertive verb „validate\".",
          explanation:
            "Sam ten przykład Twoich notatek pokazuje, jak działa wymiana: cztery sygnały tentative-ness wymieniasz na jedną mocną strukturę.",
        },
        {
          type: "spot_error",
          text: "Actually, I just wanted to like, ask if maybe we could possibly check this with commercial team, you know?",
          options: [
            "actually + just",
            "like + maybe",
            "could possibly + you know",
            "wszystko źle — kumulacja problemów",
          ],
          correctAnswer: 3,
          explanation:
            "Klasyczna kumulacja: actually (filler), just (przepraszanie), like (filler), maybe + could possibly (potrójna tentative), you know (filler). Powinno być: „I'd like to validate this with the commercial team.\" lub „In my view, the next step is to check with commercial.\"",
        },
      ],
      salon: {
        short:
          "W consultingu i finansach po angielsku największa blokada na C1 to filler words i tentative phrasing. „I guess\", „just\", „maybe\", „like\" — wydają się grzeczne po polsku, w business contexcie brzmią jak niezdecydowanie.",
        expand:
          "Native speakerzy w tych branżach używają mocniejszych formuł: „I'd argue\", „In my view\", „The data suggests\", „The next logical step is\". Pauza zawsze wygrywa z fillerem — cisza brzmi jak myślenie, „uh\" brzmi jak panika. Klient kupuje pewność, nie wahanie. To kontrintuicyjne dla Polaków, którzy czują, że tentative language to grzeczność. Nie jest — grzeczność robi się przez „could/would/please\", nie przez „guess\".",
        trap:
          "Nie myl tentative language z politeness — to dwie różne dźwignie. „I guess\" nie jest grzeczne, jest niezdecydowane. „Just\" w pracy brzmi jak przeprosiny za istnienie — wyrzuć. „Well, so...\" na początku zdania to filler bez treści — zacznij od konkretu. I uważaj na kumulacje: „actually, just, maybe, like, you know\" w jednym zdaniu to ostrzeżenie, że mózg pracuje na polskim trybie grzeczności.",
      },
    },
  },

  // ============================================================
  // 18. Angielski: confidence escalator
  // ============================================================
  {
    slug: "angielski-confidence-escalator",
    vaultSlug: "en",
    label: "Angielski C1 — confidence escalator (skala pewności w mowie)",
    payload: {
      title: "Confidence escalator",
      summary:
        "Skala pewności w business angielskim: od „I guess\" (do kosza w pracy) po „We will\" (rekomendacja, decyzja). Ta sama treść powiedziana „I guess\" vs „We need to\" to dwa różne światy w odbiorze klienta. Nie chodzi o to, żeby zawsze grzmieć — chodzi o świadomy wybór poziomu.",
      theory:
        "Skala od najsłabszego do najmocniejszego, sześć stopni:\n\n1. „I guess\" — unikać w pracy. Brzmi jak ktoś, kto sam siebie nie kupuje. Zostawia tylko dla prawdziwej niepewności: „I guess we'll see\".\n2. „I think\" — codzienne, OK do rozmów nieformalnych i opinii miękkich, ale neutralne.\n3. „I believe\" — profesjonalne, polecane jako default w pracy. Brzmi jak ktoś, kto stoi za swoim zdaniem bez agresji.\n4. „I'd argue\" — analityczne, świetne na meetingi z klientem. Nie znaczy że się kłócisz — to silniejsze „I think\" z elementem analizy, zostawia miejsce na dyskusję.\n5. „The data suggests\" — depersonalizacja, najlepsze dla strategii i rekomendacji opartych na danych. Zamienia opinię w obserwację.\n6. „We will / We need to\" — najmocniejsze, dla rekomendacji i decyzji.\n\nDefault w pracy: „I believe\" lub „I'd argue\". Kiedy masz dane: „The data suggests\". Kiedy dajesz rekomendację: „We need to / We will\". Native speakerzy z UK często łagodzą bardziej niż US, ale robią to przez modale (would / could), nie przez „I guess\". Eskalacja działa w obie strony — nie wszystko da się powiedzieć „We will\". Czasem „I'd argue\" jest lepsze właśnie dlatego, że zostawia przestrzeń na rozmowę.",
      questions: [
        {
          type: "abc",
          text: "Default poziom pewności w pracy konsultantki C1 to:",
          options: [
            "I think",
            "I believe / I'd argue",
            "We will",
          ],
          correctAnswer: 1,
          explanation:
            "„I think\" jest OK do luźnych opinii, „We will\" do twardych rekomendacji. Default to środek: „I believe\" lub „I'd argue\" — pewność bez agresji.",
        },
        {
          type: "abc",
          text: "Kiedy używać „The data suggests\"?",
          options: [
            "zamiast „I think\" gdy chcesz brzmieć skromniej",
            "gdy masz dane i chcesz zamienić opinię w obserwację",
            "tylko w pisemnych raportach, nie w mowie",
          ],
          correctAnswer: 1,
          explanation:
            "„The data suggests\" depersonalizuje sąd — nie Ty mówisz, dane mówią. Najmocniejsza formuła do rekomendacji strategicznych opartych o liczby.",
        },
        {
          type: "fill",
          text: "„_____ argue we should focus on retention before touching acquisition.\" — analityczna pewność z miejscem na dyskusję.",
          options: null,
          correctAnswer: "I'd",
          explanation:
            "„I'd argue\" — mocna formuła consulting English, brzmi jak ktoś, kto myślał, nie jak ktoś, kto się kłóci.",
        },
        {
          type: "fill",
          text: "Najsłabszy stopień skali, do wyrzucenia z pracy poza zdaniami typu „I guess we'll see\", to „I _____\".",
          options: null,
          correctAnswer: "guess",
          explanation:
            "„I guess\" w business contexcie brzmi jak ktoś, kto sam siebie nie kupuje. Wyłącznie do prawdziwej niepewności.",
        },
        {
          type: "open",
          text: "Przerób na konsultancki ton: „I think maybe we should kind of focus on customer retention.\"",
          options: null,
          correctAnswer:
            "„The data suggests that customer retention is the bigger lever here. I'd argue we should focus there before touching acquisition.\" Eskalacja: „I think maybe\" → „The data suggests\" + „I'd argue\". Wycięte: maybe, kind of.",
          explanation:
            "Dwa stopnie wyżej na skali pewności + wycięcie tentative phrasing. Tak brzmi rekomendacja, nie niepewność.",
        },
        {
          type: "spot_error",
          text: "Rekomendacja do zarządu: „I guess we will need to maybe consider restructuring the portfolio.\"",
          options: [
            "I guess",
            "we will",
            "maybe",
            "I guess + maybe — sprzeczność z „we will\"",
          ],
          correctAnswer: 3,
          explanation:
            "„We will\" to szczyt skali pewności, „I guess\" i „maybe\" to jej dno. W jednym zdaniu sygnalizujesz jednocześnie pewność i wahanie — odbiorca nie wie, czemu wierzyć. Powinno być: „We need to consider restructuring the portfolio.\"",
        },
      ],
      salon: {
        short:
          "Skala pewności w business angielskim ma sześć stopni: od „I guess\" (do kosza) przez „I believe / I'd argue\" (default w pracy) po „The data suggests\" i „We will\" (rekomendacja).",
        expand:
          "Default to „I believe\" lub „I'd argue\" — pewność bez agresji, brzmi jak ktoś, kto myślał. „The data suggests\" depersonalizuje — to nie Ty mówisz, dane mówią; najlepsza formuła do rekomendacji strategicznych. „We will / We need to\" zostaw na twarde decyzje. „I think\" jest neutralne, OK na luźną opinię, ale w meetingu z klientem brzmi miękko. Eskalacja działa w obie strony — czasem „I'd argue\" lepiej niż „We will\", bo zostawia miejsce na dyskusję.",
        trap:
          "Nie myl skali pewności z grzecznością. Native UK łagodzą przez modale (would / could), nie przez „I guess\". „I'd argue\" nie znaczy, że się kłócisz — to akademicki / consulting standard. I uważaj na kumulację: „I guess we will maybe...\" miesza najwyższy i najniższy stopień skali w jednym zdaniu, klient nie wie, czemu wierzyć.",
      },
    },
  },

  // ============================================================
  // 19. Angielski: at the end vs in the end
  // ============================================================
  {
    slug: "angielski-at-the-end-vs-in-the-end",
    vaultSlug: "en",
    label: "Angielski C1 — at the end vs in the end",
    payload: {
      title: "At the end vs in the end",
      summary:
        "Klasyczny błąd Polaków: polski „na końcu / w końcu / ostatecznie\" rozdziela się w angielskim na dwa wyrażenia ze sztywnymi zasadami. ELSA wytyka to gramatycznie — „at the end the service\" zamiast „in the end, the service\".",
      theory:
        "Trzy konstrukcje, każda z własną funkcją:\n\n„In the end\" = ostatecznie, w rezultacie, po procesie lub decyzji. Wynik czegoś. „In the end, we decided to launch.\" / „In the end, the strategy paid off.\"\n\n„At the end (of)\" = na końcu czegoś konkretnego — czasu, listy, filmu, spotkania. Lokalizacja w czasie albo miejscu. „At the end of the meeting, we agreed on next steps.\" / „At the end of Q3, revenue was flat.\" „At the end\" bez „of\" brzmi niekompletnie i prawie zawsze potrzebuje uzupełnienia.\n\n„By the end (of)\" = do momentu zakończenia czegoś, deadline. „By the end of the week, we'll have a draft.\"\n\nReguły pamięciowe: wynik / wniosek = „in the end\"; lokalizacja w czasie = „at the end of\" + coś konkretnego; deadline = „by the end of\". „On the end\" nie istnieje, mimo że Polak czasem tak strzeli przez analogię do „on Monday\".",
      questions: [
        {
          type: "abc",
          text: "„_____, only two of the three deliverables turned out to be realistic.\"",
          options: [
            "At the end",
            "In the end",
            "On the end",
          ],
          correctAnswer: 1,
          explanation:
            "Wynik procesu, refleksja po fakcie → „In the end\". „At the end\" wymagałoby „of czegoś\". „On the end\" nie istnieje.",
        },
        {
          type: "abc",
          text: "„_____ the SteerCo, we agreed on three deliverables.\"",
          options: [
            "At the end of",
            "In the end of",
            "By the end of",
          ],
          correctAnswer: 0,
          explanation:
            "Lokalizacja w czasie — konkretny moment w obrębie spotkania → „At the end of\". „By the end of\" znaczyłoby deadline („zanim się skończyło\"). „In the end of\" nie istnieje.",
        },
        {
          type: "fill",
          text: "Deadline: „_____ the week, we'll have a draft ready.\"",
          options: null,
          correctAnswer: "By the end of",
          explanation:
            "„By the end of\" = do momentu zakończenia, klasyczna formuła deadline'u w consultingu.",
        },
        {
          type: "fill",
          text: "Wynik / wniosek po procesie: „_____, only two were realistic given the timeline.\"",
          options: null,
          correctAnswer: "In the end",
          explanation:
            "„In the end\" zamyka refleksję — co wyszło z całej historii.",
        },
        {
          type: "spot_error",
          text: "„At the end the meeting, in the end they agreed on the timeline.\"",
          options: [
            "at the end the meeting — brak „of\"",
            "in the end — powinno być „at the end\"",
            "obie konstrukcje źle",
            "wszystko OK",
          ],
          correctAnswer: 0,
          explanation:
            "„At the end\" prawie zawsze potrzebuje „of\" — tu: „At the end of the meeting\". Druga część („in the end, they agreed\") jest poprawna jako wynik dyskusji.",
        },
      ],
      salon: {
        short:
          "Polski „na końcu / w końcu\" rozdziela się w angielskim na trzy wyrażenia: „in the end\" (wynik), „at the end of\" (lokalizacja w czasie), „by the end of\" (deadline).",
        expand:
          "„In the end, we decided to launch\" — wynik refleksji. „At the end of the meeting, we agreed\" — moment w obrębie wydarzenia, zawsze z „of\". „By the end of the week\" — deadline. Jedno zdanie pokazuje dwie konstrukcje obok siebie: „At the end of the SteerCo, we agreed on three deliverables. In the end, only two were realistic.\"",
        trap:
          "„At the end\" bez „of\" prawie zawsze brzmi błędnie. „On the end\" nie istnieje (Polak strzela przez analogię do „on Monday\"). I nie myl „in the end\" (wniosek) z „at the end\" (lokalizacja) — to dwa różne narzędzia.",
      },
    },
  },

  // ============================================================
  // 20. Angielski: register upgrade — stuff / things do kosza
  // ============================================================
  {
    slug: "angielski-register-stuff-things",
    vaultSlug: "en",
    label: "Angielski C1 — register upgrade (stuff, things, really)",
    payload: {
      title: "Register upgrade: stuff i things do kosza",
      summary:
        "W professional context „stuff\" i „things\" to czerwona flaga — brzmią jak student, nie konsultantka strategiczna. Ten sam problem dotyczy „kind of / sort of\" i nadużywanego „really\". W consultingu zawsze da się nazwać konkretniej, bo właśnie za tę precyzję klient płaci.",
      theory:
        "„Stuff\" i „things\" to catch-all, kiedy nie wiemy, jak coś nazwać. Podmiany do automatyzacji w business contexcie:\n\n„these things\" → „these factors / elements / drivers\". „stuff like that\" → „similar considerations / related aspects\". „all this stuff\" → „all these variables / these dynamics\". „the cost stuff\" → „the cost dynamics / the cost structure\". „customer stuff\" → „customer-side considerations / consumer dynamics\". „the things we need to do\" → „the actions we need to take / the next steps\".\n\nInne słowa do uważności: „really\" (overused) → „significantly, substantially, materially\". „very + przymiotnik\" → mocniejszy przymiotnik („very important\" → „critical\"; „very big\" → „substantial\"). „kind of / sort of\" → wytnij albo zamień na „somewhat, to some extent\".\n\nUwaga: „things\" jako zaimek w zdaniach typu „things are looking good\" / „things have improved this quarter\" jest naturalne i OK. Problem zaczyna się przy „these things to consider\" — tam zawsze da się powiedzieć precyzyjniej. Native speakerzy w UK używają „stuff/things\" naturalnie w mowie codziennej. To Ty w business contexcie masz być precyzyjniejsza — Polak na C1, który nadużywa „stuff\", brzmi jak ktoś, kto nie nauczył się słownictwa branżowego. Ale nie przeskakuj w język nadęty: „considerations\" jest OK, „ratiocinations\" za daleko.",
      questions: [
        {
          type: "abc",
          text: "„There are three _____ driving this trend: pricing pressure, shifting consumer expectations, and regulatory tightening.\"",
          options: [
            "things",
            "stuff",
            "factors",
          ],
          correctAnswer: 2,
          explanation:
            "„Factors / drivers / elements\" — consulting standard. „Things\" w tym kontekście brzmi jak student. „Stuff\" w ogóle nie używa się jako liczba mnoga.",
        },
        {
          type: "abc",
          text: "„Very important\" w deck dla klienta lepiej zastąpić przez:",
          options: [
            "really important",
            "critical",
            "kind of important",
          ],
          correctAnswer: 1,
          explanation:
            "Jedno mocniejsze słowo zamiast „very + adj\". „Critical\" (lub „pivotal / essential\") brzmi profesjonalnie. „Really\" jest overused, „kind of\" osłabia.",
        },
        {
          type: "fill",
          text: "„Revenue has _____ increased this quarter\" — zamiast nadużywanego „really\".",
          options: null,
          correctAnswer: "significantly",
          explanation:
            "„Significantly / substantially / materially\" — finansowy i consulting standard, brzmi analitycznie.",
        },
        {
          type: "open",
          text: "Przerób na consulting English: „There's like three things behind this, you know, pricing stuff, customers, and regulations and things.\"",
          options: null,
          correctAnswer:
            "„There are three factors driving this trend: pricing pressure, shifting consumer expectations, and regulatory tightening.\" Wycięte: like, you know, things, stuff. Dodane: konkretne nazwy każdego czynnika.",
          explanation:
            "Zasada: jeśli używasz „things/stuff\", to znak, że jeszcze nie nazwałaś tego konkretnie. Wymuś na sobie precyzję.",
        },
        {
          type: "spot_error",
          text: "„We need to focus on the cost stuff and kind of address these customer things really soon.\"",
          options: [
            "cost stuff",
            "kind of",
            "customer things",
            "wszystko — kumulacja register problemów",
          ],
          correctAnswer: 3,
          explanation:
            "Kumulacja: „cost stuff\" (catch-all), „kind of\" (hedging bez sensu), „customer things\" (catch-all), „really soon\" (overused intensifier). Powinno być: „We need to address the cost dynamics and the customer-side considerations promptly.\"",
        },
      ],
      salon: {
        short:
          "„Stuff\" i „things\" w business angielskim to czerwona flaga — brzmią jak student, nie konsultantka. Każde z nich w consulting contexcie da się zastąpić precyzyjniejszym słowem.",
        expand:
          "„These things\" → „these factors / drivers / elements\". „The cost stuff\" → „the cost dynamics / structure\". „Very important\" → „critical\". „Really\" overused → „significantly / substantially / materially\". Tam, gdzie używasz „stuff\", jeszcze nie nazwałaś rzeczy po imieniu — to sygnał, że trzeba zrobić jeszcze jeden krok precyzji. Native UK używają „stuff/things\" naturalnie w small talku, ale Ty w pracy masz brzmieć jak ktoś, kto zna słownictwo branżowe.",
        trap:
          "Nie wpadnij w pretensjonalność. „Considerations\" jest OK, „ratiocinations\" za daleko. „Things are looking good\" jako zaimek jest naturalne — problem dotyczy zdań typu „these things to consider\", gdzie zawsze da się powiedzieć konkretniej. I uważaj na „kind of / sort of\" — w mowie z umiarem OK, w piśmie wytnij.",
      },
    },
  },

  // ============================================================
  // 21. Angielski: synonimy eco-friendly i customer behavior
  // ============================================================
  {
    slug: "angielski-synonimy-eco-customer",
    vaultSlug: "en",
    label: "Angielski C1 — synonimy (eco-friendly, customer behavior)",
    payload: {
      title: "Synonimy: eco-friendly i customer behavior",
      summary:
        "Na C1+ oczekuje się vocabulary range — umiejętności podawania tej samej idei innymi słowami. ELSA wytknęła powtarzanie „eco-friendly\" i „customer behavior\" w jednej rozmowie. To nie kosmetyka, to realny marker poziomu w IELTS/CAE i w odbiorze przez native speakerów.",
      theory:
        "Eco-friendly — synonimy w kolejności od najczęstszych do najbardziej technicznych:\n„sustainable\" (najczęstsze w biznesie i strategii, default).\n„green\" (codzienne, OK).\n„environmentally conscious\" (o ludziach i firmach).\n„environmentally friendly\" (formalne).\n„low-impact\" (techniczne, ESG).\n„climate-aligned\" (corporate, ESG).\n„net-zero / carbon-neutral\" (konkretny target, mierzalny).\n„ESG-aligned\" (investment / strategy speak).\n\nCustomer behavior — synonimy:\n„consumer trends\" (makro, rynek).\n„consumer insights\" (data-driven, market research).\n„market dynamics\" (szeroko, system).\n„buying patterns\" (konkret, mikro).\n„purchase behavior\" (transakcyjne).\n„customer preferences\" (gusta, wybory).\n„consumer sentiment\" (emocje, opinie).\n„demand patterns\" (z perspektywy podaży/popytu).\n\nReguły: w jednej wypowiedzi nie używaj tego samego terminu więcej niż 2 razy. Mieszaj makro („market dynamics\") z konkretem („buying patterns\"). „Sustainable\" to default w biznesie; ESG i corporate to „climate-aligned / net-zero\". Dla danych klientów „consumer insights\" brzmi profesjonalnie i analitycznie. „Eco-friendly\" nadużywane brzmi marketingowo, prawie greenwashingowo — „sustainable\" jest poważniejsze. „Carbon-neutral\" to konkretny mierzalny cel, nie luźny synonim ekologii.",
      questions: [
        {
          type: "abc",
          text: "Default słowo dla „eco-friendly\" w business / strategy contexcie to:",
          options: [
            "green",
            "sustainable",
            "eco-conscious",
          ],
          correctAnswer: 1,
          explanation:
            "„Sustainable\" — najpoważniejsze i najbardziej uniwersalne. „Green\" jest OK, ale w deck brzmi marketingowo. „Eco-friendly\" nadużywane pachnie greenwashingiem.",
        },
        {
          type: "abc",
          text: "W research / market analysis kontekstcie najprecyzyjniejszy synonim „customer behavior\" to:",
          options: [
            "consumer insights",
            "customer stuff",
            "people preferences",
          ],
          correctAnswer: 0,
          explanation:
            "„Consumer insights\" brzmi data-driven, analitycznie. „Customer stuff\" — kategoria register problemu. „People preferences\" to nie jest standardowa kolokacja.",
        },
        {
          type: "fill",
          text: "Konkretny mierzalny target ekologiczny to „_____-neutral\" lub „net-zero\".",
          options: null,
          correctAnswer: "carbon",
          explanation:
            "„Carbon-neutral\" to konkretny target, nie ogólny synonim „ekologicznego\". Nie używaj jako stylistycznej wariacji „green\".",
        },
        {
          type: "fill",
          text: "Mikro, transakcyjny synonim „customer behavior\" — co kupują i jak: „_____ patterns\".",
          options: null,
          correctAnswer: "buying",
          explanation:
            "„Buying patterns\" — konkret na poziomie transakcji. „Consumer trends\" jest makro, „buying patterns\" mikro.",
        },
        {
          type: "open",
          text: "Napisz jedno zdanie używając trzech różnych synonimów z grupy „eco-friendly\" / „customer behavior\" bez powtórzeń.",
          options: null,
          correctAnswer:
            "Przykład: „Our analysis of consumer trends suggests that demand for sustainable products is no longer a niche, but a mainstream expectation. The buying patterns we observed in the last quarter confirm this shift.\" Trzy synonimy: consumer trends, sustainable, buying patterns.",
          explanation:
            "Mieszanka makro (consumer trends) z konkretem (buying patterns) plus jeden synonim ekologii. Tak działa vocabulary range na C1.",
        },
        {
          type: "spot_error",
          text: "„We need to understand customer behavior better because customer behavior in this market is shifting and customer behavior data is limited.\"",
          options: [
            "powtórzenie „customer behavior\" trzy razy",
            "źle dobrana skala",
            "brak modalu",
            "wszystko OK",
          ],
          correctAnswer: 0,
          explanation:
            "Czerwona flaga na C1 — trzy razy ten sam termin. Powinno być np.: „We need to understand consumer behavior better because buying patterns in this market are shifting and consumer insights are limited.\"",
        },
      ],
      salon: {
        short:
          "Na C1+ vocabulary range to nie kosmetyka — to marker poziomu. „Eco-friendly\" i „customer behavior\" mają po 6–8 synonimów, z których każdy nosi inny rejestr.",
        expand:
          "„Sustainable\" to default w biznesie, „climate-aligned\" i „net-zero\" w ESG, „carbon-neutral\" jako konkretny target. Dla klientów: „consumer trends\" (makro), „buying patterns\" (mikro), „consumer insights\" (data-driven). W jednej wypowiedzi mieszaj makro z konkretem, nie używaj tego samego terminu więcej niż dwa razy. Ten sam mini-paragraf może łączyć „consumer trends\" + „sustainable\" + „buying patterns\" — i wtedy brzmisz jak konsultantka, a nie jak student na repeat-mode.",
        trap:
          "„Carbon-neutral\" to mierzalny cel, nie stylistyczna wariacja „green\". „Eco-friendly\" nadużywane zaczyna brzmieć greenwashingowo. I nie przeskakuj w przesadnie techniczny rejestr na luźnej rozmowie — „ESG-aligned\" przy lampce wina brzmi sztywno.",
      },
    },
  },

  // ============================================================
  // 22. Angielski: politeness w business
  // ============================================================
  {
    slug: "angielski-politeness-business",
    vaultSlug: "en",
    label: "Angielski C1 — politeness w business (modale, pośredniość)",
    payload: {
      title: "Politeness w business English",
      summary:
        "Polski poziom bezpośredniości w mowie biznesowej jest wyższy niż angielski. To, co po polsku brzmi neutralnie („Powiedz mi więcej\"), po angielsku często brzmi rozkazująco. Grzeczność w business angielskim robi się przez modale (could / would), pośredniość („I'd appreciate\") i softeners — NIE przez tentative phrasing typu „I guess\".",
      theory:
        "Mechanizm grzeczności: modale (could / would / might) + pośredniość („I'd appreciate\" zamiast „tell me\") + łagodniki („perhaps, if possible\"). Klasyczne podmiany do automatyzacji:\n\n„Tell me about your strategy\" → „Could you walk me through your strategy?\". „What do you think?\" → „I'd appreciate your perspective on this\". „Send me the report\" → „Could you please send me the report?\". „I need this by Friday\" → „Would it be possible to have this by Friday?\". „Do you know more about X?\" → „Could you share more on X?\". „When can we meet?\" → „When would be a good time for you to meet?\". „Answer my email\" → „I'd appreciate your response when you have a moment\".\n\nSoftenery bez utraty pewności: „Would it be possible to...\", „I was wondering if...\", „If you don't mind...\", „When you have a moment...\", „At your convenience...\".\n\nReguły: „could / would\" to najlepsi przyjaciele w pracy. „Please\" używaj częściej niż w polskim — w angielskim nie brzmi służalczo. Im wyższe stanowisko rozmówcy, tym bardziej pośrednio — ale nigdy niepewnie. Pułapki: „could you\" > „can you\" z klientem. „Please\" na początku zdania może brzmieć szorstko („Please send the report\" w niektórych kontekstcie brzmi jak rozkaz) — lepiej „Could you please send...\". Nadmiar też jest źle: „I was wondering if perhaps you might possibly...\" brzmi jak parodia, jeden softener wystarczy. „I'd like you to...\" jest bardziej rozkazujące niż „Could you...\".",
      questions: [
        {
          type: "abc",
          text: "Grzeczność w business angielskim robi się głównie przez:",
          options: [
            "tentative phrasing („I guess, maybe\")",
            "modale + pośredniość + softenery",
            "częste „sorry\" na początku zdań",
          ],
          correctAnswer: 1,
          explanation:
            "„I guess / maybe\" osłabiają treść, nie ją grzeczni. Tentativeness ≠ politeness — dwie różne dźwignie.",
        },
        {
          type: "abc",
          text: "Z klientem C-level lepiej: „Send me the report.\" czy „Could you please send me the report?\"",
          options: [
            "pierwsza wersja, bezpośrednia",
            "druga wersja, modal + please",
            "obie OK",
          ],
          correctAnswer: 1,
          explanation:
            "Pośredniość przez modal + please. Im wyższe stanowisko, tym bardziej pośrednio. „Please\" w angielskim nie brzmi służalczo.",
        },
        {
          type: "fill",
          text: "Klasyczny softener: „Would it be _____ to have this by Friday?\"",
          options: null,
          correctAnswer: "possible",
          explanation:
            "„Would it be possible to...\" — uniwersalny softener do deadline'ów i próśb. Brzmi profesjonalnie bez wymuszania.",
        },
        {
          type: "fill",
          text: "Z klientem, zamiast „Can you...\", użyj „_____ you...\".",
          options: null,
          correctAnswer: "Could",
          explanation:
            "„Could you\" > „Can you\" w business contexcie. „Can you\" jest OK z kolegami, z klientem mniej formalne.",
        },
        {
          type: "open",
          text: "Przerób na business English: „Tell me about your assumptions on pricing before we present to the board.\"",
          options: null,
          correctAnswer:
            "„Could you walk me through your assumptions on pricing? I'd appreciate understanding the logic before we present this to the board.\" Modal („could you\") + pośredniość („walk me through\", „I'd appreciate\") + uzasadnienie.",
          explanation:
            "Trzy dźwignie naraz: modal, pośrednia formuła, uzasadnienie czemu pytasz. Brzmi profesjonalnie, nie agresywnie, nie służalczo.",
        },
        {
          type: "spot_error",
          text: "„I was wondering if perhaps you might possibly be able to consider sending me the report when convenient.\"",
          options: [
            "I was wondering if",
            "perhaps + might + possibly",
            "when convenient",
            "nadmiar softenerów — parodia grzeczności",
          ],
          correctAnswer: 3,
          explanation:
            "Każdy element osobno OK, ale kumulacja brzmi jak parodia. Jeden softener wystarczy: „Would it be possible to send me the report when you have a moment?\"",
        },
      ],
      salon: {
        short:
          "Polski poziom bezpośredniości w business mowie jest wyższy niż angielski — to, co u nas brzmi neutralnie, po angielsku często brzmi rozkazująco. Grzeczność robi się przez modale, pośredniość i softenery.",
        expand:
          "„Could you walk me through...\", „I'd appreciate your perspective\", „Would it be possible to...\" — to podstawowe narzędzia. „Please\" używaj częściej niż w polskim, nie brzmi służalczo. Im wyższe stanowisko rozmówcy, tym bardziej pośrednio — ale nigdy niepewnie. Mechanizm to modal + pośrednia formuła + ewentualnie uzasadnienie czemu pytasz.",
        trap:
          "Tentativeness („I guess, maybe\") ≠ politeness. To dwie różne dźwignie, których Polak często nie rozróżnia. „I'd like you to...\" brzmi bardziej rozkazująco niż „Could you...\". Nadmiar softenerów to parodia — „I was wondering if perhaps you might possibly...\" brzmi jak komedia. Jeden softener wystarczy.",
      },
    },
  },

  // ============================================================
  // 23. Angielski: articles (a / an / the / zero)
  // ============================================================
  {
    slug: "angielski-articles-pulapki",
    vaultSlug: "en",
    label: "Angielski C1 — articles (a / an / the / zero)",
    payload: {
      title: "Articles — 3 pułapki polskie",
      summary:
        "Polski nie ma rodzajników, więc dla nas to nigdy nie jest automatyczne. Articles to ranking #1 problemów Polaków na C1, szczególnie pod presją (interview, prezentacja, case). Trzy reguły niżej pokrywają 80% sytuacji w biznesowym angielskim.",
      theory:
        "Reguła 1: general vs specific.\nZero article dla ogólnych pojęć i niepoliczalnych w sensie ogólnym: „I work in consulting.\" / „Inflation is rising.\"\n„The\" dla rzeczy konkretnych, znanych obu stronom: „The CEO we met yesterday wants a follow-up.\" / „The strategy we presented was approved.\"\n„A / an\" dla rzeczy wprowadzanych pierwszy raz, jeden z wielu: „We need a strategy for next year.\"\n\nReguła 2: instytucje funkcjonalnie vs jako budynki.\nZero article gdy mówimy o funkcji / działaniu: „go to school, be in hospital, go to university, finish work\".\n„The\" gdy mówimy o konkretnym budynku / miejscu: „The school was renovated last year.\" / „The hospital is just around the corner.\"\n\nReguła 3: geografia.\nPojedyncze szczyty / jeziora: bez „the\" — „Mount Everest, Lake Victoria, Mont Blanc\".\nPasma górskie i grupy wysp: z „the\" — „The Alps, The Himalayas, The Bahamas, The Philippines\".\nKraje pojedyncze: zwykle bez „the\" — „Poland, France, Germany\".\nKraje z „republic / states / kingdom\": z „the\" — „The United States, The United Kingdom, The Czech Republic\".\n\nNazwy firm i miast: zero article — „I work at EY in Warsaw.\" (nie „the EY\", nie „the Warsaw\"). W tytułach i headlines często wycina się articles, ale w mowie i mailu — nie wycinaj.",
      questions: [
        {
          type: "abc",
          text: "„I work at _____ in _____.\" (firma + miasto)",
          options: [
            "the EY / the Warsaw",
            "EY / Warsaw",
            "an EY / a Warsaw",
          ],
          correctAnswer: 1,
          explanation:
            "Nazwy firm i miast — zero article. „The EY\" i „the Warsaw\" to klasyczna polska kalka.",
        },
        {
          type: "abc",
          text: "„_____ energy transition is reshaping industry.\" (mówimy o obecnej, znanej transformacji)",
          options: [
            "An",
            "The",
            "zero article",
          ],
          correctAnswer: 1,
          explanation:
            "Konkretna, znana obu stronom transformacja → „The\". Gdyby było ogólne „Energy transitions reshape industries\", to byłoby zero article.",
        },
        {
          type: "fill",
          text: "Pasmo górskie wymaga „the\": „_____ Alps\".",
          options: null,
          correctAnswer: "The",
          explanation:
            "Pasma górskie i grupy wysp z „the\" (The Alps, The Himalayas, The Bahamas). Pojedyncze szczyty bez (Mount Everest).",
        },
        {
          type: "fill",
          text: "„I go to _____ school\" (jestem uczniem — funkcja, nie budynek).",
          options: null,
          correctAnswer: "",
          explanation:
            "Zero article, gdy mówimy o funkcji instytucji. „The school was renovated\" wymagałoby „the\" — wtedy mówimy o konkretnym budynku.",
        },
        {
          type: "open",
          text: "Wyjaśnij różnicę: „I go to school\" vs „I'm going to the school by car\".",
          options: null,
          correctAnswer:
            "„I go to school\" = jestem uczniem (funkcja instytucji, zero article). „I'm going to the school\" = jadę do tego konkretnego budynku (np. po dziecko — lokalizacja, z „the\"). Polak miesza, bo polski nie ma rodzajników.",
          explanation:
            "Klasyczne rozróżnienie: instytucja jako funkcja (zero article) vs instytucja jako konkretny budynek (the).",
        },
        {
          type: "spot_error",
          text: "„The Poland is changing fast, and the EY is hiring more consultants for the next year's strategy.\"",
          options: [
            "the Poland — kraj pojedynczy nie ma „the\"",
            "the EY — nazwa firmy bez „the\"",
            "the next year's — should be zero",
            "wszystko źle — trzy article problemy",
          ],
          correctAnswer: 3,
          explanation:
            "Trzy klasyczne polskie błędy: „the Poland\" (kraj pojedynczy bez „the\"), „the EY\" (nazwa firmy bez „the\"), „the next year's\" (bez „the\"). Powinno być: „Poland is changing fast, and EY is hiring more consultants for next year's strategy.\"",
        },
      ],
      salon: {
        short:
          "Articles to ranking #1 problemów Polaków na C1. Trzy reguły pokrywają 80% sytuacji: general vs specific, instytucje funkcjonalne vs budynki, geografia (pojedyncze vs pasma).",
        expand:
          "Zero article dla pojęć ogólnych („I work in consulting\") i instytucji jako funkcji („go to school\"). „The\" dla konkretu znanego obu stronom („The strategy we presented\") i pasm górskich / grup („The Alps, The Bahamas\"). „A / an\" dla nowo wprowadzanych obiektów („We need a strategy\"). Nazwy firm i miast — zero article („I work at EY in Warsaw\").",
        trap:
          "„The Poland / The EY / The Warsaw\" to klasyczna polska kalka, bo nie mamy rodzajników. „I go to the school by car\" znaczy „jadę do tego konkretnego budynku\" (np. po dziecko), nie „jestem uczniem\". W tytułach articles często wycina się, ale w mowie i mailu — nie wycinaj.",
      },
    },
  },

  // ============================================================
  // 24. Angielski: prepositions po czasownikach
  // ============================================================
  {
    slug: "angielski-prepositions-po-czasownikach",
    vaultSlug: "en",
    label: "Angielski C1 — prepositions po czasownikach",
    payload: {
      title: "Prepositions po czasownikach (verb + preposition collocations)",
      summary:
        "Polski „zależeć od\" to angielski „depend on\", nie „depend from\". To są kolokacje, których nie da się wyciągnąć logicznie — trzeba znać. Polacy najczęściej walą „depend from / discuss about / explain me\". Te trzy trzeba mieć zautomatyzowane do C1.",
      theory:
        "Kanon polskich błędów (must-know):\n„depend ON\" (nie „from\").\n„consist OF\" (nie „from\").\n„focus ON\" (nie „at\").\n„responsible FOR\" (nie „of\").\n„result IN\" (sth) / „result FROM\" (sth) — uważać na kierunek.\n„discuss\" — BEZ przyimka („Let's discuss the plan\", nie „discuss about\").\n„explain sth TO sb\" (nie „explain sb sth\").\n„listen TO\" (nie samo „listen\").\n„arrive AT\" (place) / „arrive IN\" (city) — nie „arrive to\".\n„comment ON\" (nie „about\").\n„agree WITH\" sb / „agree ON\" sth.\n„apologize FOR\" sth / „apologize TO\" sb.\n„participate IN\" (nie „at\").\n„graduate FROM\" (nie „of\").\n\nKluczowe rozróżnienia:\nResult IN vs result FROM — „IN\" = przynieść jako skutek („The project resulted in a 15% cost reduction.\"), „FROM\" = wynikać z („The cost reduction resulted from process automation.\").\nAgree WITH vs agree ON — „WITH\" kogoś (osoba): „I agree with the CFO.\". „ON\" coś (decyzja, plan): „We agreed on the timeline.\".",
      questions: [
        {
          type: "abc",
          text: "„The success of this project depends _____ three factors.\"",
          options: [
            "from",
            "on",
            "of",
          ],
          correctAnswer: 1,
          explanation:
            "„Depend ON\" — uniwersalna kolokacja. „Depend from\" to kalka z polskiego „zależeć od\".",
        },
        {
          type: "abc",
          text: "„I will _____ this to you in detail.\"",
          options: [
            "explain",
            "explain you",
            "discuss about",
          ],
          correctAnswer: 0,
          explanation:
            "„Explain sth TO sb\" — kolejność i przyimek obowiązkowe. „Explain you this\" to klasyczna kalka z polskiego.",
        },
        {
          type: "fill",
          text: "„We _____ the budget for an hour but couldn't reach a conclusion.\" (bez przyimka po czasowniku)",
          options: null,
          correctAnswer: "discussed",
          explanation:
            "„Discuss\" nie bierze przyimka. „Discussed about\" to klasyczna polska pułapka.",
        },
        {
          type: "fill",
          text: "„I agree _____ the CFO that we should pivot.\" (osoba)",
          options: null,
          correctAnswer: "with",
          explanation:
            "Z osobą zawsze „with\". Z decyzją / planem — „on\" („We agreed on the timeline\").",
        },
        {
          type: "open",
          text: "Wyjaśnij różnicę: „The project resulted in cost savings\" vs „The cost savings resulted from automation\".",
          options: null,
          correctAnswer:
            "„Result IN\" = projekt przyniósł skutek (kierunek: przyczyna → skutek). „Result FROM\" = oszczędności wynikają z (kierunek: skutek ← przyczyna). Strzałka leci w przeciwne strony.",
          explanation:
            "Klasyczna pułapka kierunku. „IN\" patrzy do przodu, „FROM\" patrzy do tyłu.",
        },
        {
          type: "spot_error",
          text: "„We discussed about the budget, depended from the timeline, and arrived to a conclusion.\"",
          options: [
            "discussed about",
            "depended from",
            "arrived to",
            "wszystkie trzy — typowe polskie kalki",
          ],
          correctAnswer: 3,
          explanation:
            "Trzy klasyczne błędy: „discuss\" bez przyimka, „depend ON\", „arrive AT/IN\". Powinno być: „We discussed the budget, depended on the timeline, and arrived at a conclusion.\"",
        },
      ],
      salon: {
        short:
          "Verb + preposition to kolokacje, których się nie wyciąga logiką — trzeba je znać. Polacy najczęściej walą „depend from / discuss about / explain me\".",
        expand:
          "Kanon do automatyzacji: depend ON, consist OF, focus ON, responsible FOR, discuss (bez przyimka), explain sth TO sb, listen TO, arrive AT (place) / IN (city), agree WITH (osoba) / ON (sprawa). Dwie subtelne pary: result IN (skutek) vs result FROM (przyczyna); agree WITH (osoba) vs agree ON (decyzja).",
        trap:
          "„Explain you this\" / „discussed about\" / „depend from\" / „listen me\" / „arrive to Warsaw\" — to top-5 polskich błędów. Każdy z nich wynika z kalki bezpośredniej z polskiego.",
      },
    },
  },

  // ============================================================
  // 25. Angielski: Present Perfect vs Past Simple
  // ============================================================
  {
    slug: "angielski-present-perfect-vs-past-simple",
    vaultSlug: "en",
    label: "Angielski C1 — Present Perfect vs Past Simple",
    payload: {
      title: "Present Perfect vs Past Simple",
      summary:
        "Polski ma jeden czas przeszły, więc Present Perfect to dla nas obcy koncept. Klasyczna pułapka Polaków na C1, szczególnie w interview, gdzie opowiadasz o swoim doświadczeniu. Wybór czasu zmienia znaczenie zdania.",
      theory:
        "Past Simple — akcja zakończona, konkretny moment w przeszłości:\n„I worked at EY for 5 years.\" → już tam nie pracuję, koniec.\n„Yesterday I had a meeting with the CFO.\" → konkretny dzień.\nSygnały: yesterday, last week / month / year, in 2020, ago, when I was...\n\nPresent Perfect — łączy przeszłość z teraźniejszością. Trzy główne użycia:\n1. Akcja zaczęła się w przeszłości i trwa do teraz: „I have worked at EY for 5 years.\" → dalej tam pracuję. „I have lived in Warsaw since 2019.\"\n2. Doświadczenie życiowe (kiedykolwiek, bez konkretnego momentu): „Have you ever done a strategy project for the energy sector?\" / „I have worked with three Fortune 500 clients.\"\n3. Niedawne akcje z efektem teraz: „I have just finished the deck.\" / „They have decided to postpone the launch.\"\nSygnały: for, since, ever, never, just, already, yet, recently, this week / month / year (jeszcze trwa), so far.\n\nPast Perfect (dodatek) — akcja przed inną akcją w przeszłości: „By the time we finalized the model, the client had already changed their mind twice.\"\n\nZasady pamięciowe: „for / since\" + Present Perfect prawie zawsze. „yesterday / ago / last X\" + Past Simple zawsze. „Pracuję tu od 5 lat\" = „I have worked here for 5 years\" (NIE „I work here for 5 years\" — to klasyczny błąd). W US English Present Perfect bywa zastępowane Past Simple („I just finished\" vs „I have just finished\"). W UK trzymaj się Present Perfect — brzmi czyściej w pracy.",
      questions: [
        {
          type: "abc",
          text: "„I _____ at EY for 5 years.\" (dalej tam pracuję)",
          options: [
            "work",
            "worked",
            "have worked",
          ],
          correctAnswer: 2,
          explanation:
            "Akcja zaczęła się w przeszłości i trwa do teraz → Present Perfect. „I work here for 5 years\" to klasyczna polska kalka.",
        },
        {
          type: "abc",
          text: "„Yesterday I _____ a meeting with the CFO.\"",
          options: [
            "had",
            "have had",
            "have",
          ],
          correctAnswer: 0,
          explanation:
            "„Yesterday\" = konkretny moment → Past Simple. „Have had yesterday\" to błąd, bo Present Perfect nie idzie z konkretnym przeszłym czasem.",
        },
        {
          type: "fill",
          text: "Interview: „I _____ been at EY for five years, working primarily on strategy projects.\"",
          options: null,
          correctAnswer: "have",
          explanation:
            "Trwa do teraz → Present Perfect. „For\" jest klasycznym sygnałem.",
        },
        {
          type: "fill",
          text: "„Last year, I _____ a portfolio of solar PV projects.\" (konkretny rok, zamknięte)",
          options: null,
          correctAnswer: "led",
          explanation:
            "„Last year\" = konkretny zamknięty moment → Past Simple („led\", nie „have led\").",
        },
        {
          type: "open",
          text: "Połącz oba czasy w jednym zdaniu o karierze, używając „for\" + „last year\".",
          options: null,
          correctAnswer:
            "Przykład: „I have been at EY for five years. Last year, I led a portfolio of solar PV projects up to Ready-to-Build, and I recently started exploring opportunities outside consulting.\" Present Perfect dla obecnej kariery, Past Simple dla zamkniętego projektu, Present Perfect dla niedawnej akcji.",
          explanation:
            "Tak brzmi C1 w interview: świadome zarządzanie dwoma czasami w jednej wypowiedzi.",
        },
        {
          type: "spot_error",
          text: "„I have seen the CFO yesterday and we have agreed on the timeline last week.\"",
          options: [
            "have seen + yesterday",
            "have agreed + last week",
            "obie pary źle — Present Perfect nie idzie z konkretnym czasem",
            "wszystko OK",
          ],
          correctAnswer: 2,
          explanation:
            "„Yesterday / last week\" → Past Simple. Powinno być: „I saw the CFO yesterday and we agreed on the timeline last week.\"",
        },
      ],
      salon: {
        short:
          "Polski ma jeden czas przeszły, angielski dwa kluczowe — Past Simple (zamknięte) i Present Perfect (łączy przeszłość z teraz). Wybór czasu zmienia znaczenie.",
        expand:
          "„For / since\" + Present Perfect prawie zawsze („I have worked here for 5 years\" = dalej pracuję). „Yesterday / last X / ago\" + Past Simple zawsze. Trzy użycia Present Perfect: trwa do teraz (for / since), doświadczenie życiowe (ever / never), niedawna akcja z efektem teraz (just / already / yet). Interview standard: Present Perfect dla kariery, Past Simple dla konkretnych projektów, Present Perfect dla najświeższego newsa.",
        trap:
          "„I work here for 5 years\" to top klasyczny polski błąd — brak Present Perfect. „I have seen him yesterday\" — niemożliwe, bo Present Perfect nie idzie z konkretnym przeszłym momentem. W US Present Perfect bywa zastępowane Past Simple („I just finished\"), w UK trzymaj się Present Perfect — brzmi czyściej.",
      },
    },
  },

  // ============================================================
  // 26. Angielski: mixed conditionals
  // ============================================================
  {
    slug: "angielski-mixed-conditionals",
    vaultSlug: "en",
    label: "Angielski C1 — mixed conditionals",
    payload: {
      title: "Mixed conditionals",
      summary:
        "Conditionals 0/1/2/3 masz pewnie ogarnięte. Mixed conditional to C1+ konstrukcja, która łączy dwa różne czasy w jednym zdaniu. Przydatna w refleksji nad decyzjami (kariera, „co by było, gdyby\"), w analizie strategicznej i w eleganckich argumentach. Sygnalizuje C1+ poziom, bo wymaga świadomego zarządzania dwoma czasami.",
      theory:
        "Typ 1: past condition → present result.\n„If + had + 3 forma, would + bezokolicznik\"\nSytuacja: w przeszłości coś (nie) zrobiłem, więc teraz mam (nie mam) tego efektu.\n„If I had accepted that offer in London, I would be there now.\" (Nie przyjęłam → teraz nie jestem.)\n„If we had launched earlier, we would be ahead of the competition today.\"\n„If she had stayed at the firm, she would be a partner by now.\"\n\nTyp 2: present condition → past result.\n„If + Past Simple, would + have + 3 forma\"\nJakaś ogólna cecha lub stan obecny, który gdyby był inny, to przeszłość wyglądałaby inaczej.\n„If I were more direct, I would have closed that deal last quarter.\" (Generalnie nie jestem direct → przez to wtedy nie zamknęłam.)\n„If she weren't so risk-averse, she would have invested in that startup.\"\n„If we had a stronger commercial team, we would have won the tender.\"\n\nForma „were\" (subjunctive): w mixed conditionals z 2nd typu w hipotezach formalnych używa się „were\" zamiast „was\" — „If I were the CEO, I would have done things differently.\" W mowie potocznej „if I was\" też się słyszy, ale w pracy i piśmie zostań przy „were\".\n\nMixed conditional łatwo pomylić z 3rd conditional (oba mają „had + 3 forma\" w if-clause). Różnica: 3rd kończy się „would have + 3 forma\" (oba past), mixed kończy się „would + V\" (present). Nie nadużywaj — użyta dwa razy w 30 minut robi wrażenie, użyta 6 razy brzmi jak ćwiczenie z gramatyki.",
      questions: [
        {
          type: "abc",
          text: "Past → present: „If I _____ that job in London, I would be there now.\"",
          options: [
            "had accepted",
            "would have accepted",
            "accepted",
          ],
          correctAnswer: 0,
          explanation:
            "Past condition (decyzja w przeszłości) → present result (teraz). „If + had + 3 forma\" w pierwszej części.",
        },
        {
          type: "abc",
          text: "Present → past: „If I _____ more direct, I would have closed that deal last quarter.\"",
          options: [
            "had been",
            "were",
            "would be",
          ],
          correctAnswer: 1,
          explanation:
            "Present condition (cecha ogólna) → past result. „If + Past Simple (were)\" w pierwszej części, „would have + 3 forma\" w drugiej.",
        },
        {
          type: "fill",
          text: "W formalnej hipotezie używamy „were\", nie „_____\".",
          options: null,
          correctAnswer: "was",
          explanation:
            "„If I were\" — subjunctive, standard w pracy i piśmie. „If I was\" jest OK w mowie potocznej, ale w consulting contexcie trzymaj się „were\".",
        },
        {
          type: "fill",
          text: "Past → present: „If we _____ launched earlier, we would be ahead of the competition today.\"",
          options: null,
          correctAnswer: "had",
          explanation:
            "„If we had launched\" — past condition. Druga część w present („would be\"), bo mówimy o stanie obecnym.",
        },
        {
          type: "open",
          text: "Napisz mixed conditional w odpowiedzi na pytanie w interview o decyzję, której żałujesz.",
          options: null,
          correctAnswer:
            "Przykład: „Looking back, if I had said yes to that secondment, I would probably be running a different team by now. But I'm not sure I would have learned what I have at EY.\" Mixed conditional pierwszego typu (past → present) plus refleksja.",
          explanation:
            "Brzmi dojrzale i C1+. Refleksja nad nieobranymi drogami to klasyczny moment na mixed conditional.",
        },
        {
          type: "spot_error",
          text: "„If I would have known about the offer earlier, I would have applied.\"",
          options: [
            "would have known — błąd polski, ma być „had known\"",
            "would have applied — OK",
            "wszystko OK",
          ],
          correctAnswer: 0,
          explanation:
            "Klasyczny polski błąd: „would have\" w pierwszej części. Powinno być: „If I had known about the offer earlier, I would have applied.\"",
        },
      ],
      salon: {
        short:
          "Mixed conditional łączy dwa różne czasy w jednym zdaniu. Past → present („If I had taken that job, I would be in Zurich now\") albo present → past („If I were more assertive, I would have negotiated more\").",
        expand:
          "Sygnalizuje C1+ poziom, bo wymaga świadomego zarządzania dwoma osiami czasu. Klasyczny moment na mixed conditional: refleksja nad decyzjami w karierze, analiza strategiczna („gdybyśmy mieli silniejszy commercial team, wygralibyśmy tamten tender\"), eleganckie argumenty. „Were\" zamiast „was\" w hipotezach formalnych — w pracy zawsze.",
        trap:
          "„If I would have known\" to top polski błąd — w if-clause nie ma „would\". Mixed łatwo pomylić z 3rd conditional: różnica leży w drugiej części (3rd kończy się „would have\", mixed kończy się „would\"). I nie nadużywaj — dwa razy w 30 minut robi wrażenie, sześć razy brzmi jak ćwiczenie.",
      },
    },
  },

  // ============================================================
  // 27. Angielski: inversion (C1 elegancja)
  // ============================================================
  {
    slug: "angielski-inversion-c1",
    vaultSlug: "en",
    label: "Angielski C1 — inversion (negative adverbials)",
    payload: {
      title: "Inversion — C1 elegancja w mowie i piśmie",
      summary:
        "Inwersja to konstrukcja, w której zamieniasz miejscami subject i auxiliary, żeby coś podkreślić. Sygnał C1+ w mowie i piśmie. Na CAE / CPE robisz na tym punkty. W mailu lub prezentacji daje elegancki, profesjonalny ton bez nadęcia.",
      theory:
        "Reguła: negative adverbial na początku → auxiliary przed subject → reszta zdania. Jeśli nie ma auxiliary (np. proste Past Simple), dorzucasz do / does / did.\n\nNajczęstsze wyrażenia uruchamiające inwersję:\nNever — „Never have I seen such a clean dataset.\"\nRarely — „Rarely do you find this kind of clarity.\"\nSeldom — „Seldom does a project go this smoothly.\"\nHardly... when — „Hardly had we finished the deck when the meeting was rescheduled.\"\nNo sooner... than — „No sooner had we launched than the demand exploded.\"\nNot only... but also — „Not only did we deliver on time, but we also exceeded the KPIs.\"\nOnly after — „Only after the audit did we realize the issue.\"\nOnly then — „Only then did the CEO change his mind.\"\nUnder no circumstances — „Under no circumstances should this leave the room.\"\nNowhere else — „Nowhere else will you see this level of integration.\"\nLittle — „Little did we know that the client had already decided.\"\nNot until — „Not until Q4 will we see the full impact.\"\n\nMechanika krok po kroku: „I have never seen such a structured analysis\" → wyrzucam „never\" na początek → inwersja: „Never have I seen such a structured analysis.\" Z Past Simple bez auxiliary: „We rarely see this kind of clarity\" → „Rarely\" → brak auxiliary, dorzucam „do\": „Rarely do we see this kind of clarity.\"\n\nInwersja to ozdobnik. Użyta 1–2 razy w wypowiedzi = wow. Pięć razy = pretensja. I uwaga: „Only\" w sensie „tylko / jedynie\" jak liczba NIE uruchamia inwersji („Only three people came\" — bez inwersji). Inwersja w „Only\" tylko z czasem: „Only then / Only after / Only when\".",
      questions: [
        {
          type: "abc",
          text: "Poprawna inwersja:",
          options: [
            "Never I have seen such a clean dataset.",
            "Never have I seen such a clean dataset.",
            "I never have seen such a clean dataset.",
          ],
          correctAnswer: 1,
          explanation:
            "Negative adverbial („Never\") na początku → auxiliary („have\") przed subject („I\"). „Never I have\" to brak inwersji.",
        },
        {
          type: "abc",
          text: "„Rarely _____ a project of this scope close with such clear alignment.\"",
          options: [
            "do",
            "does",
            "did",
          ],
          correctAnswer: 1,
          explanation:
            "Subject: „a project\" (3 os. lp.). Brak auxiliary w oryginale → dorzucamy „does\". „Rarely does a project...\"",
        },
        {
          type: "fill",
          text: "„Not only _____ we deliver on time, but we also exceeded the KPIs.\"",
          options: null,
          correctAnswer: "did",
          explanation:
            "Past Simple bez auxiliary → dorzucamy „did\". W drugiej części „but we also exceeded\" — normalny szyk, bo „but\" otwiera nową klauzulę.",
        },
        {
          type: "fill",
          text: "„Under no circumstances _____ this leave the room.\" (modal of obligation)",
          options: null,
          correctAnswer: "should",
          explanation:
            "Z modalami inwersja przenosi modal przed subject. „Under no circumstances should this leave the room.\"",
        },
        {
          type: "open",
          text: "Przerób na inwersję: „We had hardly finished the deck when the meeting was rescheduled.\"",
          options: null,
          correctAnswer:
            "„Hardly had we finished the deck when the meeting was rescheduled.\" Inwersja po „hardly\" — auxiliary „had\" przed subject „we\". Struktura: hardly... when.",
          explanation:
            "Klasyczna formuła „hardly... when\" — uruchamia inwersję i brzmi C1+ w pisanym recapie.",
        },
        {
          type: "spot_error",
          text: "„Not only we delivered on time, but we exceeded the KPIs.\"",
          options: [
            "not only we delivered — brak inwersji",
            "but we exceeded — powinno być „but we also exceeded\"",
            "wszystko OK",
          ],
          correctAnswer: 0,
          explanation:
            "„Not only\" wymaga inwersji w pierwszej części. Powinno być: „Not only did we deliver on time, but we also exceeded the KPIs.\"",
        },
      ],
      salon: {
        short:
          "Inwersja to przesunięcie auxiliary przed subject, gdy negative adverbial („never, rarely, not only, only after\") jest na początku zdania. C1+ ozdobnik, robi punkty na CAE / CPE.",
        expand:
          "„Never have I seen...\", „Rarely do we find...\", „Not only did we deliver, but we also exceeded...\", „Under no circumstances should this leave the room\". Bez auxiliary dorzucasz do / does / did. Używana 1–2 razy w wypowiedzi = wow, pięć razy = pretensja. Klasyczne miejsca: rekomendacja do zarządu, mail recap po wygranym tenderze, lead w prezentacji.",
        trap:
          "„Never I have seen\" / „Not only we delivered\" / „No sooner we had launched\" — klasyczne braki inwersji. Inwersja działa TYLKO gdy negative adverbial jest na początku — „I have never seen\" bez inwersji jest też poprawne. „Only\" jako liczba („Only three people came\") nie uruchamia inwersji — tylko „Only\" + czas („Only then / after / when\").",
      },
    },
  },

  // ============================================================
  // 28. Angielski: modals of deduction
  // ============================================================
  {
    slug: "angielski-modals-of-deduction",
    vaultSlug: "en",
    label: "Angielski C1 — modals of deduction (must / could / might / can't)",
    payload: {
      title: "Modals of deduction",
      summary:
        "Modale dedukcyjne pozwalają wyrażać stopień pewności w obserwacji. Używasz ich w pracy, gdy interpretujesz dane, dyskutujesz hipotezy w zespole albo komentujesz zachowanie klienta. Znacznie elegantsze niż „I think maybe\" w każdym zdaniu.",
      theory:
        "Skala pewności (od pewności do wykluczenia):\n„must\" — jestem pewna, że tak. „He must be in a meeting.\"\n„will\" (deduction) — bardzo prawdopodobne. „That'll be the courier at the door.\"\n„should\" — spodziewam się, że tak. „The report should be on your desk by 5pm.\"\n„may\" — możliwe. „The client may push back on the timeline.\"\n„might / could\" — mniej prawdopodobne, ale możliwe. „He might be stuck in traffic.\"\n„can't / couldn't\" — wykluczam. „He can't be in the office, I just saw him leave.\"\n\nPresent vs Past:\nPresent (teraz): „He must be busy.\" / „She might be in a call.\" / „They can't be serious.\"\nPast (przeszłość): modal + have + 3 forma — „He must have left already.\" / „She might have missed the email.\" / „They can't have known about the change.\"\n\nMust vs have to:\n„Must\" (deduction): jestem pewna z obserwacji — „He must be tired.\" (widzę po nim).\n„Must\" (obligation): wewnętrzny obowiązek — „I must finish this today.\"\n„Have to\" (obligation): zewnętrzny obowiązek, narzucony z zewnątrz — „I have to submit by Friday.\"\nW amerykańskim angielskim „must\" jako obligation zanika, „have to\" jest częstsze.",
      questions: [
        {
          type: "abc",
          text: "„He _____ be in the office — I just saw him leave for the airport.\" (wykluczenie)",
          options: [
            "mustn't",
            "can't",
            "shouldn't",
          ],
          correctAnswer: 1,
          explanation:
            "Wykluczenie → „can't\". „Mustn't\" = zakaz („You mustn't share this\"), nie wykluczenie obecności.",
        },
        {
          type: "abc",
          text: "Past deduction: „She _____ the email — she hasn't responded.\"",
          options: [
            "must have missed",
            "must miss",
            "must to miss",
          ],
          correctAnswer: 0,
          explanation:
            "Past deduction = modal + have + 3 forma. „Must have missed\".",
        },
        {
          type: "fill",
          text: "„The Q3 dip _____ be purely seasonal — customer churn has spiked.\" (wykluczenie)",
          options: null,
          correctAnswer: "can't",
          explanation:
            "Wykluczenie hipotezy → „can't\". W analizie danych klasyczna formuła.",
        },
        {
          type: "fill",
          text: "„The package _____ arrive tomorrow.\" (spodziewam się, oczekiwanie, nie pewność)",
          options: null,
          correctAnswer: "should",
          explanation:
            "„Should\" = oczekiwanie, nie pewność. Coś może nie dotrzeć — ale tak, jak się umawialiśmy, powinno.",
        },
        {
          type: "open",
          text: "Użyj trzech różnych modali deduction w jednej analizie danych sprzedażowych.",
          options: null,
          correctAnswer:
            "Przykład: „The Q3 dip can't be purely seasonal. Customer churn must have spiked, but we should validate that with the retention data before drawing conclusions.\" „Can't\" (wykluczenie), „must have\" (pewna dedukcja o przeszłości), „should\" (oczekiwanie / sugestia).",
          explanation:
            "Trzy poziomy pewności w jednej analizie — brzmi jak analityczna konsultantka, nie student.",
        },
        {
          type: "spot_error",
          text: "„He mustn't be in the office because I just saw him leave, and he must been tired after the long flight.\"",
          options: [
            "mustn't — w sensie wykluczenia ma być „can't\"",
            "must been — ma być „must have been\"",
            "obie konstrukcje źle",
            "wszystko OK",
          ],
          correctAnswer: 2,
          explanation:
            "Dwa błędy: „mustn't be\" (powinno „can't be\" — wykluczenie) i „must been\" (powinno „must have been\" — past deduction).",
        },
      ],
      salon: {
        short:
          "Skala modali deduction: must (pewność) → will → should → may → might / could → can't (wykluczenie). Pozwala wyrażać stopień pewności bez „I think maybe\" co drugie zdanie.",
        expand:
          "Present: „He must be busy.\" Past: modal + have + 3 forma — „He must have left already.\" „Should\" to oczekiwanie, nie pewność. „Will\" jako deduction („That'll be John\") jest bardzo brytyjskie i bardzo eleganckie. „Must\" w deduction (pewność z obserwacji) różne od „must\" obligation (wewnętrzny obowiązek) i od „have to\" (zewnętrzny obowiązek).",
        trap:
          "„Mustn't\" w sensie wykluczenia to klasyczny błąd — „mustn't\" = zakaz, nie wykluczenie. Wykluczenie to „can't\". „He must been tired\" → ma być „must have been tired\". „Should\" w deduction to oczekiwanie, nie pewność — paczka „should arrive\" znaczy „spodziewam się\", nie „na pewno przyjdzie\".",
      },
    },
  },

  // ============================================================
  // 29. Angielski: business collocations
  // ============================================================
  {
    slug: "angielski-business-collocations",
    vaultSlug: "en",
    label: "Angielski C1 — business collocations (verb + noun)",
    payload: {
      title: "Business collocations",
      summary:
        "Collocations to „kogo z kim\" w danym języku. W business angielskim określone czasowniki łączą się z określonymi rzeczownikami, i ich pomylenie od razu zdradza, że nie jesteś native. Lista poniżej to kanon, którego nie da się wyciągnąć logiką z polskiego — trzeba znać.",
      theory:
        "Najczęstsze biznesowe kolokacje:\n„make a decision / progress / a difference / a profit / a loss\".\n„do business (with) / research / due diligence\".\n„take responsibility / action / the lead / a risk\".\n„reach an agreement / a conclusion\".\n„close a deal\".\n„launch a product / a campaign\".\n„raise an issue / a concern / a flag\" — poruszyć.\n„address a concern / an issue\" — odnieść się do.\n„meet a deadline\" (NIE „catch a deadline\").\n„miss a deadline\".\n„set a goal / a target\".\n„achieve a target / a milestone\".\n„drive growth / change\".\n„deliver results / value\".\n\nUK vs US:\n„Make a decision\" — uniwersalne.\n„Take a decision\" — brytyjskie, w US rzadkie. W consulting używaj „make a decision\", bezpieczne wszędzie.\n„Take a meeting\" w US OK („let's take a meeting\" = umówmy spotkanie), w UK rzadko. Lepiej „have a meeting\" lub „schedule a meeting\".\n\nInne ważne pary:\n„Hit a target\" (mocne, sportowe) vs „achieve a target\" (neutralne).\n„Cut costs\" vs „reduce costs\" (cut jest mocniejsze, decydujące).\n„Grow the business\" (organicznie) vs „expand the business\" (rozszerzać zakres).\n„Lead a project / a team\" (kierować) vs „manage a project / a team\" (zarządzać operacyjnie).",
      questions: [
        {
          type: "abc",
          text: "„We need to _____ a decision on scope by end of next week.\"",
          options: [
            "do",
            "take",
            "make",
          ],
          correctAnswer: 2,
          explanation:
            "„Make a decision\" jest uniwersalne. „Take a decision\" jest UK-only, w US brzmi dziwnie — w międzynarodowym consultingu „make\" wygrywa.",
        },
        {
          type: "abc",
          text: "„We agreed to _____ the lead on the customer segmentation workstream.\"",
          options: [
            "make",
            "take",
            "do",
          ],
          correctAnswer: 1,
          explanation:
            "„Take the lead\" — kolokacja na przejęcie inicjatywy. „Make the lead\" / „do the lead\" nie istnieją.",
        },
        {
          type: "fill",
          text: "„To _____ the deadline, we'll need to make a few decisions on scope.\"",
          options: null,
          correctAnswer: "meet",
          explanation:
            "„Meet a deadline\" — dotrzymać terminu. „Catch a deadline\" to klasyczna polska kalka i nie istnieje.",
        },
        {
          type: "fill",
          text: "„I'll _____ the open questions in our Friday SteerCo.\" (poruszyć kwestie na początku)",
          options: null,
          correctAnswer: "raise",
          explanation:
            "„Raise an issue / questions / concerns\" — poruszyć, zgłosić. Później „address\" = odnieść się i rozwiązać.",
        },
        {
          type: "open",
          text: "Napisz mini-akapit recapu meeting'u używając min. czterech business collocations.",
          options: null,
          correctAnswer:
            "Przykład: „We agreed to take the lead on the customer segmentation workstream. To meet the deadline, we'll need to make a few decisions on scope by end of next week. I'll raise the open questions in our Friday SteerCo.\" Cztery kolokacje: take the lead, meet the deadline, make decisions, raise the questions.",
          explanation:
            "Consulting English w czystej postaci — kolokacje spinają zdanie i brzmią naturalnie.",
        },
        {
          type: "spot_error",
          text: "„We need to do a decision, catch the deadline, and make business with the new partner.\"",
          options: [
            "do a decision",
            "catch the deadline",
            "make business",
            "wszystkie trzy — klasyczne kalki",
          ],
          correctAnswer: 3,
          explanation:
            "Trzy klasyczne kalki: „do a decision\" → make. „catch the deadline\" → meet. „make business\" → do business. Powinno być: „We need to make a decision, meet the deadline, and do business with the new partner.\"",
        },
      ],
      salon: {
        short:
          "Collocations to „kogo z kim\" w business angielskim — „make a decision, take the lead, meet a deadline, raise an issue, drive growth, deliver value\". Nie da się wyciągnąć logicznie.",
        expand:
          "„Make\" idzie z decisions, progress, a difference, a profit. „Take\" idzie z responsibility, action, the lead, a risk. „Reach\" — an agreement, a conclusion. „Raise\" otwiera temat, „address\" go zamyka. „Drive growth\" i „deliver value\" to klasyczne consulting speak. Pamiętaj o subtelnych parach: „lead a team\" (kierować strategicznie) vs „manage a team\" (zarządzać operacyjnie); „cut costs\" (mocne) vs „reduce costs\" (neutralne).",
        trap:
          "„Do a decision\" / „catch a deadline\" / „make business\" / „make a research\" / „take a decision\" w US — to top polskie kalki. „Take a meeting\" jest OK w US, ale w UK dziwne — bezpiecznie „have a meeting\". Mieszanie kolokacji od razu zdradza, że nie jesteś native — pojedynczy taki błąd potrafi obniżyć cały efekt świetnej rekomendacji.",
      },
    },
  },

  // ============================================================
  // 30. Angielski: rise vs raise
  // ============================================================
  {
    slug: "angielski-rise-vs-raise",
    vaultSlug: "en",
    label: "Angielski C1 — rise vs raise",
    payload: {
      title: "Rise vs raise",
      summary:
        "Klasyczny problem na całym świecie, nie tylko u Polaków. Polacy walą to szczególnie często, bo „rosnąć / podnosić\" są w polskim blisko siebie, a w angielskim to dwa zupełnie inne czasowniki z różnymi konstrukcjami.",
      theory:
        "Rise (rose, risen) — intransitive. Coś wzrasta samo, nie ma obiektu.\n„Prices rose by 5% last quarter.\" (ceny rosną same)\n„The sun rises in the east.\"\n„Tensions are rising between the two parties.\"\n„Inflation has risen sharply.\"\nForma rzeczownikowa: „a rise in X\" („a rise in prices, a rise in demand\").\n\nRaise (raised, raised) — transitive. Ktoś coś podnosi, musi być obiekt.\n„The government raised taxes.\" (rząd podniósł podatki)\n„She raised her hand.\"\n„We raised the issue at the SteerCo.\"\n„The board has raised concerns about timeline.\"\nForma rzeczownikowa: „a raise\" = podwyżka (US English): „I got a raise.\" W UK: „a pay rise\".\n\nTest na rozpoznanie — spytaj: kto / co podnosi co?\nJeśli odpowiedź to „coś podnosi się samo\" → rise.\nJeśli odpowiedź to „ktoś coś podnosi\" → raise.\n\nInne kontekstowe użycia raise:\n„raise capital\" (zebrać kapitał, fundraising).\n„raise awareness\" (zwiększyć świadomość).\n„raise a child\" (wychować dziecko).\n„raise an issue / a concern / a flag\" (poruszyć kwestię).\n„raise expectations\" (podnieść oczekiwania).\n„raise the bar\" (podnieść poprzeczkę).",
      questions: [
        {
          type: "abc",
          text: "„Energy prices have _____ by 30% since last year.\"",
          options: [
            "raised",
            "risen",
            "rised",
          ],
          correctAnswer: 1,
          explanation:
            "Ceny rosną same → rise (rose, risen). „Rised\" nie istnieje. „Raised\" wymagałoby agenta: kto je podniósł.",
        },
        {
          type: "abc",
          text: "„The board has _____ concerns about the timeline.\"",
          options: [
            "raised",
            "risen",
            "rose",
          ],
          correctAnswer: 0,
          explanation:
            "Zarząd (agent) podniósł obawy (obiekt) → raise. „Risen\" to forma intransitive.",
        },
        {
          type: "fill",
          text: "„_____ the question\" — poruszyć kwestię na meetingu.",
          options: null,
          correctAnswer: "Raise",
          explanation:
            "„Raise an issue / a question / a concern / a flag\" — biznesowa kolokacja na otwarcie tematu.",
        },
        {
          type: "fill",
          text: "Past Simple: „Sales _____ by 8% last quarter.\" (same się podniosły)",
          options: null,
          correctAnswer: "rose",
          explanation:
            "Rise → rose → risen. Past Simple bez agenta: „Sales rose\".",
        },
        {
          type: "open",
          text: "Użyj „rise\" (samo) i „raise\" (poruszyć) w jednym zdaniu o cenach energii.",
          options: null,
          correctAnswer:
            "Przykład: „Energy prices have risen by 30% since last year, which has pushed the client to raise the question of strategic procurement.\" „Have risen\" — same się podniosły. „Raise the question\" — poruszyć kwestię.",
          explanation:
            "Dwa różne użycia w jednym zdaniu — pokazujesz świadomość rozróżnienia.",
        },
        {
          type: "spot_error",
          text: "„The prices were rised by 5%, and the team has raised early today.\"",
          options: [
            "were rised — strona bierna od rise nie istnieje",
            "raised early — kalka z „wstał wcześnie\"",
            "obie konstrukcje źle",
            "wszystko OK",
          ],
          correctAnswer: 2,
          explanation:
            "„Were rised\" nie istnieje (rise nie ma passive). „Raised early\" to kalka z polskiego „wstałem wcześnie\" — powinno być „got up early\" albo „rose early\" (poetycko).",
        },
      ],
      salon: {
        short:
          "Rise = samo rośnie (bez obiektu), raise = ktoś coś podnosi (z obiektem). „Prices rise\" / „The government raises prices\" — ta sama sytuacja z dwóch perspektyw.",
        expand:
          "Rise (rose, risen) intransitive — „Energy prices have risen.\" Raise (raised, raised) transitive — „The board raised concerns.\" Kontekstowe użycia raise: raise capital, raise awareness, raise a child, raise an issue, raise the bar. Rzeczowniki różnią się: „a rise\" = wzrost zjawiska, „a raise\" = podwyżka pensji (US). W UK „a pay rise\".",
        trap:
          "„The prices were rised\" nie istnieje (rise nie ma passive). „He raised early today\" jako „wstał\" to kalka — „got up\" / „rose\". „He raised to a senior position\" → ma być „rose to a senior position\". Test: kto podnosi co? Jeśli nie ma agenta — rise.",
      },
    },
  },

  // ============================================================
  // 31. Angielski: business trends vocabulary (wzrosty/spadki)
  // ============================================================
  {
    slug: "angielski-business-trends-vocabulary",
    vaultSlug: "en",
    label: "Angielski C1 — wzrosty i spadki (skala kalibracyjna)",
    payload: {
      title: "Business trends vocabulary",
      summary:
        "W consultingu, finance i strategii rozmawiasz o wzrostach i spadkach codziennie. Dobranie złego słowa do skali zmiany od razu zdradza brak feelingu. „Skyrocket\" o 3% to przesada. „Edge up\" o 200% to absurd. Niżej skala kalibracyjna, której używasz świadomie w mowie i deck.",
      theory:
        "Wzrosty (od delikatnego do dramatycznego):\n„edge up / inch up\" (minimalny, 1–2%): „Sales edged up slightly in Q3.\"\n„rise / increase\" (umiarkowany, neutralny): „Revenue rose by 8%.\"\n„grow\" (organiczny, biznesowy): „The business grew by 15%.\"\n„climb\" (systematyczny): „The share price climbed to a new high.\"\n„pick up\" (nabiera tempa): „Demand is picking up.\"\n„surge\" (gwałtowny): „Energy prices surged after the announcement.\"\n„soar\" (bardzo gwałtowny): „Revenue soared to record levels.\"\n„skyrocket\" (ekstremalnie szybki): „Crypto valuations skyrocketed.\"\n„spike\" (krótkotrwały, gwałtowny): „Demand spiked during the holiday season.\"\n„explode\" (dramatyczny): „Growth exploded in emerging markets.\"\n\nSpadki (od delikatnego do dramatycznego):\n„edge down / dip\" (minimalny): „Profits dipped slightly in Q2.\"\n„fall / drop\" (wyraźny): „The stock dropped 12%.\"\n„decline / decrease\" (systematyczny, formalny): „Customer satisfaction has declined.\"\n„slip / slide\" (delikatny, postępujący): „Margins slipped this quarter.\"\n„plunge\" (gwałtowny): „Oil prices plunged on the news.\"\n„plummet\" (bardzo gwałtowny): „The stock plummeted after the earnings call.\"\n„collapse\" (totalny): „The market collapsed in March 2020.\"\n„crash\" (nagły, dramatyczny): „Tech stocks crashed last week.\"\n\nStabilność:\n„remain / hold steady, level out, plateau, flatline, stagnate, stabilize\".\n„Plateau\" = wysokie stabilne. „Flatline\" / „stagnate\" = niskie, martwe.\n\nModifiers do precyzowania skali: slightly / marginally, gradually / steadily, significantly / substantially, sharply / dramatically, considerably.",
      questions: [
        {
          type: "abc",
          text: "Najbardziej formalny, dobry do prezentacji synonim „spadku o kilka %\":",
          options: [
            "plummet",
            "decline",
            "crash",
          ],
          correctAnswer: 1,
          explanation:
            "„Decline\" — neutralny, formalny, systematyczny. „Plummet\" / „crash\" są dramatyczne i nie pasują do delikatnego spadku.",
        },
        {
          type: "abc",
          text: "Profits w Q2 spadły o 1%. Które słowo pasuje?",
          options: [
            "plummeted",
            "dipped",
            "collapsed",
          ],
          correctAnswer: 1,
          explanation:
            "1% to bardzo mało → „dipped\" / „edged down\". „Plummeted slightly\" to wewnętrzna sprzeczność, „collapsed\" to przesada.",
        },
        {
          type: "fill",
          text: "Wzrost 200% w EM: „Growth _____ in emerging markets.\"",
          options: null,
          correctAnswer: "exploded",
          explanation:
            "Skala ekstremalna → „exploded / skyrocketed\". „Rose by 200%\" jest też OK, ale neutralne — bez ładunku.",
        },
        {
          type: "fill",
          text: "Wysokie stabilne plateau po wzroście: „We expect the trend to _____ in Q4.\"",
          options: null,
          correctAnswer: "plateau",
          explanation:
            "„Plateau\" jako czasownik = wyrównanie się na wysokim poziomie. „Flatline\" byłoby negatywne (martwe).",
        },
        {
          type: "open",
          text: "Napisz earnings recap o trzech różnych dynamikach (wzrost umiarkowany, spadek delikatny, oczekiwany plateau).",
          options: null,
          correctAnswer:
            "Przykład: „Revenue rose by 12% year-on-year, driven by strong growth in the EMEA region. Margins, however, edged down by 80 basis points due to rising input costs. We expect the trend to plateau in Q4 as supply chain pressures ease.\" „Rose\" (umiarkowany), „edged down\" (delikatny), „plateau\" (stabilizacja).",
          explanation:
            "Każda dynamika z właściwą skalą. Tak brzmi earnings call po C1.",
        },
        {
          type: "spot_error",
          text: "„Profits soared by 2% while the market crashed by 5%.\"",
          options: [
            "soared by 2% — soar wymaga większej skali",
            "crashed by 5% — crash to totalny załamanie",
            "obie skale źle",
            "wszystko OK",
          ],
          correctAnswer: 2,
          explanation:
            "Dwie błędne kalibracje skali. 2% to „edged up\" / „rose\", nie „soared\". 5% to „dropped\" / „fell\", nie „crashed\". „Profits edged up by 2% while the market dropped by 5%.\"",
        },
      ],
      salon: {
        short:
          "W business angielskim skala ma znaczenie — „skyrocket\" o 3% to przesada, „edge up\" o 200% absurd. Słowa od „edge up / dip\" do „explode / collapse\" tworzą skalę kalibracyjną.",
        expand:
          "Wzrosty: edge up (1–2%) → rise / grow / climb → surge / soar → skyrocket / explode. Spadki: edge down / dip → drop / decline → plunge / plummet → crash / collapse. „Plateau\" to pozytywna stabilność na wysokim poziomie, „flatline / stagnate\" to negatywna stoptyckość. Modifiers (slightly, sharply, significantly) pozwalają jeszcze precyzyjniej dostroić skalę.",
        trap:
          "„Plummet slightly\" / „crash by 5%\" / „soar by 2%\" — wewnętrzne sprzeczności. Klient od razu wyczuwa brak feelingu. Pamiętaj też o rise / raise — „economy raised by 3%\" to klasyczny błąd („rose\"). Crash = totalne załamanie, nie 5% korekta.",
      },
    },
  },

  // ============================================================
  // 32. Angielski: opinion structures C1
  // ============================================================
  {
    slug: "angielski-opinion-structures-c1",
    vaultSlug: "en",
    label: "Angielski C1 — opinion structures (jak elegancko podawać zdanie)",
    payload: {
      title: "Opinion structures C1",
      summary:
        "„I think\" jest neutralne i działa, ale na C1+ oczekuje się range w sposobach formułowania opinii. Niżej rozszerzona lista plus zasada — kiedy czego używać. „In my opinion\" jest OK, ale ograne; native i konsultanci wybierają „In my view\" / „I'd argue\" / „The data suggests\".",
      theory:
        "Soft opening (delikatne otwarcie):\n„From my perspective...\", „In my view...\", „To my mind...\", „As I see it...\", „Speaking personally...\", „From where I'm sitting...\".\n\nConfident opening (pewne stanowisko):\n„I'd argue that...\", „I'd maintain that...\", „I'd contend that...\", „It's my firm belief that...\", „I'm convinced that...\".\n\nHighlighting (podkreślanie kluczowych punktów):\n„What I find particularly compelling is...\", „What strikes me most is...\", „The crucial point here is...\", „What's worth noting is...\", „The key takeaway is...\".\n\nWeighing pros and cons:\n„The benefits outweigh the risks.\", „There's a strong argument for...\", „On balance, I'd say...\", „Taking everything into account...\", „Weighing the trade-offs...\".\n\nAcknowledging counter-argument (przed pushback):\n„I see the appeal of X, but...\", „While I appreciate the logic of X, I'd argue...\", „There's merit in that view, however...\", „I can see why one might think that, but...\".\n\nBringing in evidence:\n„The data suggests...\", „Evidence points to...\", „Research indicates...\", „Our analysis shows...\", „Based on what we've seen...\".\n\nHedging (świadome zostawianie marginesu):\n„It's worth considering whether...\", „One could argue that...\", „It seems to me that...\", „Arguably...\".\n\nReguły: soft opening dla opinii dyskusyjnych („In my view\"), confident opening dla rekomendacji („I'd argue that\"), highlighting dla ważnego („What I find particularly compelling\"), acknowledging przed pushback („I see the appeal, but...\"), data-driven dla powagi („The data suggests\"). Mieszaj — nie używaj jednego stylu w kółko.",
      questions: [
        {
          type: "abc",
          text: "Najlepsze otwarcie pewnego stanowiska konsultantki w meeting'u:",
          options: [
            "Personally I think",
            "I'd argue that",
            "To be honest",
          ],
          correctAnswer: 1,
          explanation:
            "„I'd argue\" = confident, analityczne. „Personally I think\" jest redundantne. „To be honest\" sugeruje, że wcześniej nie byłaś szczera — wytnij.",
        },
        {
          type: "abc",
          text: "Klasyczne otwarcie pushback po uprzejmym uznaniu drugiej strony:",
          options: [
            "I see the appeal of X, but...",
            "I disagree with you completely",
            "You're wrong because...",
          ],
          correctAnswer: 0,
          explanation:
            "„I see the appeal of X, but...\" — uznajesz logikę drugiej strony i dopiero potem oponujesz. Klasyczny C1+ pushback.",
        },
        {
          type: "fill",
          text: "Data-driven opening: „The data _____ that customer retention is the bigger lever here.\"",
          options: null,
          correctAnswer: "suggests",
          explanation:
            "„The data suggests\" — depersonalizuje, dodaje powagi. Jedna z najmocniejszych formuł w consulting English.",
        },
        {
          type: "fill",
          text: "Highlighting kluczowego punktu: „What I find particularly _____ is the case for doubling down on what's already working.\"",
          options: null,
          correctAnswer: "compelling",
          explanation:
            "„What I find particularly compelling / striking / interesting\" — formuła highlighting'u. Brzmi C1+ bez ozdobników.",
        },
        {
          type: "open",
          text: "Napisz akapit łączący soft opening, confident pushback, data-driven i highlighting (cztery różne strategie).",
          options: null,
          correctAnswer:
            "Przykład: „I see the appeal of expanding into the German market, but I'd argue we should consolidate in Poland first. The data suggests our retention is still soft, and entering a new geography would stretch the team thin. What I find particularly compelling is the case for doubling down on what's already working.\" Cztery strategie: acknowledging („I see the appeal\"), confident („I'd argue\"), data-driven („The data suggests\"), highlighting („What I find particularly compelling\").",
          explanation:
            "Mieszanka czterech strategii w jednym akapicie — tak brzmi rozmowa strategiczna na C1+.",
        },
        {
          type: "spot_error",
          text: "„Personally, I think to be honest I feel that in my opinion we should pivot.\"",
          options: [
            "personally I think — redundantne",
            "to be honest — sugeruje brak szczerości wcześniej",
            "I feel — emocjonalne w C-level contexcie",
            "kumulacja czterech otwarć opinii w jednym zdaniu",
          ],
          correctAnswer: 3,
          explanation:
            "Cztery różne otwarcia opinii w jednym zdaniu, każde osłabia kolejne. Powinno być jedno czyste, np.: „I'd argue we should pivot.\"",
        },
      ],
      salon: {
        short:
          "„I think\" jest OK, ale na C1+ oczekuje się range. „In my view\" (soft), „I'd argue that\" (confident), „The data suggests\" (data-driven), „I see the appeal of X, but...\" (pushback) — to różne dźwignie do różnych momentów.",
        expand:
          "Soft opening dla opinii dyskusyjnych, confident dla rekomendacji, highlighting dla podkreślenia ważnego, acknowledging przed pushback, data-driven dla powagi. „I'd argue\" nie znaczy że się kłócisz — to akademicki / consulting standard. „What I find particularly compelling is...\" działa jako neon — kierujesz uwagę słuchacza na konkretny punkt. Mieszaj style — jeden powtarzany w kółko brzmi jak ćwiczenie.",
        trap:
          "„In my opinion\" nadużywane przez Polaków — lepsze „In my view / From my perspective\". „To be honest\" sugeruje, że wcześniej nie byłaś szczera — wytnij. „Personally I think\" jest redundantne (kto inny by miał twoją opinię?). „I feel\" zamiast „I think\" jest miękkie i emocjonalne — z C-level lepiej „I'd argue\".",
      },
    },
  },

  // ============================================================
  // 33. Angielski: pronunciation /s/, /t/, /æ/
  // ============================================================
  {
    slug: "angielski-pronunciation-s-t-ae",
    vaultSlug: "en",
    label: "Angielski C1 — pronunciation /s/, /t/, /æ/ (ELSA)",
    payload: {
      title: "Pronunciation tips: /s/, /t/, /æ/",
      summary:
        "ELSA wyceniła wymowę na C1, ale wskazała trzy konkretne dźwięki, które poprawione zauważalnie podniosą czystość i profesjonalizm: /s/, /t/, /æ/. To klasyczne polskie pułapki — polski ma podobne dźwięki, ale wymówione inaczej.",
      theory:
        "/s/ — na przykładzie „insights\", „firstly\".\nProblem polski: polskie „s\" jest twarde, ostre, z językiem w środku ust.\nCel angielski: /s/ jest sykające — język wysunięty do przodu, blisko górnych dziąseł i zębów, ale ich nie dotyka. Powietrze przepływa wąskim kanałem.\nĆwiczenie: powiedz polskie „s\" w „sok\", potem przesuń język do przodu, prawie dotykając górnych zębów, powtórz „sssssss\" — dźwięk powinien być wyższy, bardziej sykający.\nSłowa: insights, firstly, sustainable, strategy, suggest, system.\n\n/t/ — na przykładzie „customer\", „important\".\nProblem polski: polskie „t\" jest miękkie, z minimalnym wstrzymaniem powietrza.\nCel angielski: /t/ to plosive (zwarto-wybuchowy). Mocno zatrzymujesz powietrze za górnymi dziąsłami, potem nagle uwalniasz.\nĆwiczenie: czubek języka na górnych dziąsłach (tuż za przednimi zębami), zatrzymaj powietrze, uwolnij nagle — słyszalne „tłuk\".\nSłowa: customer, important, time, target, strategy, talent.\nUwaga: w US English /t/ między samogłoskami często zamienia się we „flap\" (jak miękkie „d\"): „water\" brzmi prawie jak „wader\". W UK /t/ pozostaje wyraźne — trzymaj się UK style w pracy.\n\n/æ/ — na przykładzie „that's\", „example\".\nProblem polski: w polskim nie ma /æ/. Polacy mówią albo „e\" („that\" → „det\"), albo „a\" („that\" → „dat\"). Oba są nieprawidłowe.\nCel angielski: /æ/ to coś pomiędzy „e\" a „a\", z szeroko otwartymi ustami i językiem nisko z przodu.\nĆwiczenie: rozciągnij usta jak na szerokim uśmiechu, opuść żuchwę, wymów „a\" — ale szerzej i bardziej spłaszczone niż polskie „a\".\nSłowa: that's, example, plan, manage, value, factor, action.\nTest: „cat / cut / cot\" — trzy różne dźwięki. „Cat\" /æ/ szerokie, „cut\" /ʌ/ neutralne, „cot\" /ɒ/ okrągłe.\n\nELSA ocenia te trzy dźwięki bardzo skrupulatnie. Drobna poprawa = duża różnica w score. Nagrywaj się i odsłuchuj — ucho szybko się przyzwyczaja do błędu, ale obiektywny zapis pokazuje prawdę.",
      questions: [
        {
          type: "abc",
          text: "Polskie „s\" w słowie „insights\" brzmi za:",
          options: [
            "wysoko",
            "twardo / w środku ust",
            "miękko",
          ],
          correctAnswer: 1,
          explanation:
            "Polskie „s\" jest twarde, z językiem w środku ust. Angielskie /s/ wymaga języka wysuniętego do przodu, sykającego.",
        },
        {
          type: "abc",
          text: "/t/ w angielskim to:",
          options: [
            "spółgłoska miękka",
            "plosive (zwarto-wybuchowa) — wstrzymanie + nagłe uwolnienie",
            "samogłoska",
          ],
          correctAnswer: 1,
          explanation:
            "/t/ to plosive — czubek języka na górnych dziąsłach, mocne zatrzymanie powietrza, nagłe uwolnienie. Polskie „t\" jest miękkie i mniej wybuchowe.",
        },
        {
          type: "fill",
          text: "Dźwięk pomiędzy „e\" a „a\", którego polski nie ma, w słowie „cat\": / _ /.",
          options: null,
          correctAnswer: "æ",
          explanation:
            "/æ/ — szerokie, spłaszczone, między „e\" a „a\". Polacy domyślnie podstawiają albo „e\", albo „a\" — oba błędne.",
        },
        {
          type: "fill",
          text: "Test trzech dźwięków: cat (/æ/), cut (/_ /), cot (/ɒ/).",
          options: null,
          correctAnswer: "ʌ",
          explanation:
            "„Cut\" to /ʌ/ — neutralne, krótkie. Trzy różne dźwięki w trzech bliskich słowach — klasyczny test rozróżnienia samogłosek.",
        },
        {
          type: "open",
          text: "Wyjaśnij, czemu warto się NAGRYWAĆ ćwicząc /s/, /t/, /æ/.",
          options: null,
          correctAnswer:
            "Ucho szybko przyzwyczaja się do własnego błędu — sami nie słyszymy, że wymawiamy „det\" zamiast „that\". Obiektywny zapis pokazuje prawdę. Plus ELSA ocenia te dźwięki skrupulatnie, więc drobna poprawa = duża różnica w score.",
          explanation:
            "Świadomość = nagranie + odsłuch + powtórka. Trening codzienny przez tydzień na konkretnych słowach przynosi szybki efekt.",
        },
        {
          type: "spot_error",
          text: "Polak na C1 świadomy /æ/ mówi „bæd\" zamiast „bed\". Co poszło nie tak?",
          options: [
            "hiperkorekcja — /æ/ tam, gdzie powinno być /e/",
            "/æ/ jest poprawne wszędzie",
            "to UK / US różnica",
          ],
          correctAnswer: 0,
          explanation:
            "Hiperkorekcja: świadomość /æ/ czasem prowadzi do nadużycia tego dźwięku tam, gdzie powinno być zwykłe /e/. „Bed\" to /bed/, nie /bæd/. Słuchaj kontekstu.",
        },
      ],
      salon: {
        short:
          "ELSA wskazała trzy dźwięki do dopieszczenia: /s/ (sykające, język do przodu), /t/ (plosive, mocne zatrzymanie + uwolnienie), /æ/ (między „e\" a „a\", szeroko otwarte usta).",
        expand:
          "Polskie „s\" jest twarde w środku ust — angielskie /s/ chce języka z przodu, blisko górnych dziąseł, ale ich nie dotyka. Polskie „t\" jest miękkie — angielskie /t/ to plosive, słyszalne „tłuk\" za górnymi dziąsłami. /æ/ w polskim nie istnieje — to spłaszczone, szerokie „a\", trochę uśmiech ust, żuchwa nisko. Test: „cat / cut / cot\" to trzy różne dźwięki. W UK /t/ pozostaje wyraźne, w US zmienia się we „flap\" („water\" → „wader\") — w pracy trzymaj się UK.",
        trap:
          "Hiperkorekcja /æ/: świadomość prowadzi do nadużycia (mówisz „bæd\" zamiast „bed\"). Słuchaj kontekstu. Polskie „insights\" z polskim „s\" — brzmi twardo, nie sykające. „Important\" wymawiane po polsku „impor-tant\" — angielski lubi „impor-nt\" z wyraźnym /t/. Nie kopiuj brytyjskiego „what?\" → „wha?\" — w pracy brzmi nieprofesjonalnie.",
      },
    },
  },

  // ============================================================
  // 34. Ekonomia: model Dalio — mapa całości
  // ============================================================
  {
    slug: "econ-dalio-mapa-calosci",
    vaultSlug: "econ",
    label: "Ekonomia — model Dalio (mapa całości)",
    payload: {
      title: "Model Dalio: jak działa gospodarka",
      summary:
        "Ray Dalio w „How the Economic Machine Works\" pokazuje gospodarkę jako system trzech sił: produktywności, krótkoterminowego cyklu zadłużenia (5–8 lat) i długoterminowego cyklu zadłużenia (dekady). Ta rama wyjaśnia, czemu gospodarka nie rośnie gładko, tylko falami — i czemu kryzysy są nieuniknione.",
      theory:
        "Gospodarka u Dalio to suma transakcji: wydatki jednej osoby są dochodem drugiej. Na tej podstawie działają trzy główne siły napędowe.\n\nProduktywność — długoterminowy, stabilny wzrost, bo ludzie z czasem uczą się robić więcej i lepiej. Gdyby nie kredyt, gospodarka rosłaby liniowo i wolno w tempie produktywności.\n\nKrótki cykl zadłużenia (5–8 lat) — sterowany głównie przez bank centralny przez stopy procentowe. Kredyt taniej → wydatki w górę → inflacja → stopy w górę → schłodzenie → stopy znów w dół. Każdy z nas przeżyje w życiu kilka takich cykli.\n\nDługi cykl zadłużenia (dekady, zwykle 50–75 lat) — fala wszystkich fal. Każdy krótki cykl zostawia trochę długu, który narasta w skali pokoleniowej. Gdy dług jest zbyt duży, klasyczne narzędzia banku centralnego przestają działać.\n\nDwóch głównych graczy systemowych: rząd centralny (polityka fiskalna — podatki, wydatki) i bank centralny (stopy procentowe, kreacja pieniądza). To dwie różne instytucje z różnymi narzędziami i innym mandatem. Kredyt napędza gospodarkę dziś, ale wymaga spłaty jutro — stąd boomy i kryzysy. Zbyt duży dług prowadzi do kryzysu; deleveraging to bolesne sprzątanie po okresie nadmiernego zadłużenia.",
      questions: [
        {
          type: "abc",
          text: "Trzy główne siły napędowe w modelu Dalio to:",
          options: [
            "produktywność, krótki cykl długu, długi cykl długu",
            "inflacja, bezrobocie, PKB",
            "polityka fiskalna, monetarna i kursowa",
          ],
          correctAnswer: 0,
          explanation:
            "Produktywność (liniowy wzrost) + dwa cykle kredytowe (krótki i długi) — to fundament całego modelu. Inflacja i bezrobocie to wskaźniki, nie siły.",
        },
        {
          type: "abc",
          text: "Bank centralny i rząd centralny:",
          options: [
            "to ta sama instytucja w różnych rolach",
            "to dwie różne instytucje z różnymi narzędziami",
            "bank centralny jest częścią rządu",
          ],
          correctAnswer: 1,
          explanation:
            "Bank centralny — stopy + kreacja pieniądza, formalnie niezależny. Rząd — podatki + wydatki (polityka fiskalna). Inny mandat, inne narzędzia.",
        },
        {
          type: "fill",
          text: "Bez kredytu gospodarka rosłaby liniowo, w tempie wzrostu _____.",
          options: null,
          correctAnswer: "produktywności",
          explanation:
            "Produktywność to długoterminowy realny wzrost. Kredyt sprawia, że wzrost jest falowy, nie liniowy.",
        },
        {
          type: "fill",
          text: "Suma wszystkich transakcji w gospodarce — wydatki jednej osoby są _____ drugiej.",
          options: null,
          correctAnswer: "dochodem",
          explanation:
            "Fundamentalne równanie Dalio: czyjeś wydatki = czyjś dochód. Brzmi banalnie, jest kluczem do reszty modelu (m.in. dlaczego austerity pogłębia recesję).",
        },
        {
          type: "open",
          text: "Wytłumacz znajomemu, dlaczego gospodarka rośnie falami, nie liniowo.",
          options: null,
          correctAnswer:
            "Gdyby nie kredyt, gospodarka rosłaby liniowo w tempie produktywności. Kredyt pozwala dziś wydać więcej, niż się zarobiło — przyspiesza wzrost, ale wymaga spłaty jutro. Stąd boomy (kiedy łatwo pożyczyć) i kryzysy (kiedy trzeba oddać). Dwa cykle kredytowe — krótki (5–8 lat) i długi (dekady) — nakładają się na liniową produktywność.",
          explanation:
            "Klucz: kredyt + produktywność = gospodarka realna. Cykle są wbudowane w system, nie są błędem.",
        },
        {
          type: "spot_error",
          text: "„Gospodarka USA rośnie 3% rocznie głównie dzięki produktywności, więc kryzys jest niemożliwy, jeśli rośnie produktywność.\"",
          options: [
            "3% to za mało",
            "produktywność i kredyt to to samo",
            "wzrost PKB ≠ wzrost produktywności; wzrost z kredytu wygląda tak samo aż do pęknięcia",
            "kryzysy są zawsze winą banku centralnego",
          ],
          correctAnswer: 2,
          explanation:
            "PKB rośnie też przez kredyt. Wzrost z kredytu i z produktywności wyglądają identycznie na wykresie aż do momentu, gdy dług trzeba oddać. Stąd kryzys jest możliwy nawet w gospodarce z realnym wzrostem produktywności.",
        },
      ],
      salon: {
        short:
          "Dalio: gospodarka = produktywność + krótki cykl długu (5–8 lat) + długi cykl długu (dekady). Produktywność buduje realne bogactwo, kredyt tworzy cykle.",
        expand:
          "Każda transakcja jest wymianą pieniądza/kredytu na dobro lub aktywo. Wydatki jednej osoby są dochodem drugiej — stąd austerity automatycznie zmniejsza dochody innych. Bank centralny (stopy, kreacja pieniądza) i rząd centralny (podatki, wydatki) to dwie różne instytucje. Krótki cykl resetuje się stopami, długi już nie — w nim narasta dług na lata. Klasyczne końce długich cykli: 1929 USA, 2008 USA, Japonia od 1990.",
        trap:
          "Mylenie wzrostu z kredytu z prawdziwym wzrostem produktywności — pierwszy jest pożyczony, drugi zarobiony. Mylenie banku centralnego z rządem. Założenie, że gospodarka „powinna\" rosnąć gładko — cykle są wbudowane w system, nie są błędem.",
      },
    },
  },

  // ============================================================
  // 35. Ekonomia: transakcje, rynek, produktywność
  // ============================================================
  {
    slug: "econ-transakcje-i-produktywnosc",
    vaultSlug: "econ",
    label: "Ekonomia — transakcje, rynek, produktywność",
    payload: {
      title: "Transakcje, rynek, produktywność",
      summary:
        "Gospodarka wygląda skomplikowanie, ale Dalio sprowadza ją do jednego prostego mechanizmu: ludzie kupują i sprzedają, a wszystkie te transakcje razem tworzą gospodarkę. Najzdrowszym źródłem długoterminowego wzrostu jest produktywność, czyli to, że ludzie z czasem uczą się robić więcej i lepiej.",
      theory:
        "Każda transakcja ma cztery elementy: kupującego, sprzedającego, pieniądz lub kredyt, oraz dobro / usługę / aktywo. Rynek = wszystkie transakcje danego typu (rynek pszenicy, rynek mieszkań, rynek pracy). Gospodarka = suma wszystkich rynków.\n\nFundamentalne równanie: wydatki jednej osoby są dochodem drugiej. Brzmi banalnie, jest kluczowe dla zrozumienia całej reszty modelu — w szczególności dlaczego austerity (cięcie wydatków) automatycznie zmniejsza dochody innych i pogłębia recesję.\n\nProduktywność to ile można wyprodukować na jednostkę czasu lub pracy. Rośnie dzięki wiedzy, technologii, organizacji i inwestycjom. Bez kredytu gospodarka rosłaby liniowo w tempie wzrostu produktywności. Kredyt sprawia, że wzrost jest falowy — stąd cykle.\n\nNajbardziej niedoceniana siła w gospodarce: produktywność realnie buduje bogactwo narodu w skali pokoleniowej. Wzrost z kredytu wygląda spektakularnie i jest na pierwszych stronach gazet, ale to inny rodzaj wzrostu — pożyczony, nie zarobiony.",
      questions: [
        {
          type: "abc",
          text: "Cztery elementy transakcji u Dalio to:",
          options: [
            "popyt, podaż, cena, ilość",
            "kupujący, sprzedający, pieniądz/kredyt, dobro/usługa/aktywo",
            "PKB, inflacja, bezrobocie, kurs",
          ],
          correctAnswer: 1,
          explanation:
            "Transakcja to konkretny akt wymiany: ktoś, ktoś, czym, za co. Popyt/podaż to abstrakcja z agregowania transakcji.",
        },
        {
          type: "abc",
          text: "Wysokie tempo wzrostu PKB to:",
          options: [
            "zawsze sukces produktywności",
            "może być wzrostem z kredytu, niekoniecznie z produktywności",
            "jest niemożliwe bez wzrostu produktywności",
          ],
          correctAnswer: 1,
          explanation:
            "Kraj może rosnąć szybko przez kredyt i wyglądać świetnie, dopóki nie przyjdzie spłata. PKB ≠ produktywność.",
        },
        {
          type: "fill",
          text: "Rynek to wszystkie _____ danego typu (rynek pszenicy, rynek mieszkań).",
          options: null,
          correctAnswer: "transakcje",
          explanation:
            "Rynek = agregacja transakcji w jednej kategorii. Gospodarka = suma wszystkich rynków.",
        },
        {
          type: "fill",
          text: "Wydatki jednej osoby są _____ drugiej.",
          options: null,
          correctAnswer: "dochodem",
          explanation:
            "Banalne, ale fundamentalne. Z tego równania wynika m.in. dlaczego sama austerity pogłębia recesję — cięcie wydatków jednych odbiera dochód drugim.",
        },
        {
          type: "open",
          text: "Wytłumacz różnicę między produktywnością a pracowitością.",
          options: null,
          correctAnswer:
            "Produktywność = ile produkujesz na jednostkę czasu / pracy. Pracowitość = ile godzin pracujesz. Można pracować 14 godzin dziennie i mieć niską produktywność (mało efektu na godzinę). Produktywność rośnie dzięki wiedzy, technologii, organizacji i inwestycjom, nie dzięki dłuższym godzinom. To dlatego kraje z krótszym czasem pracy (Niemcy, Szwajcaria) bywają bardziej produktywne niż kraje z dłuższym.",
          explanation:
            "Klucz w consultingu i analizie krajów: ile efektu na input, nie ile inputu. Też klasyczna lekcja na poziom osobisty.",
        },
        {
          type: "spot_error",
          text: "„Rząd cięł wydatki, więc deficyt spadł, a gospodarka automatycznie się ożywi.\"",
          options: [
            "cięcie wydatków nie redukuje deficytu",
            "wydatki rządu = dochody innych, więc cięcie pogłębia recesję, nie ożywia",
            "deficyt nie ma znaczenia",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Wydatki rządu (dotacje, zamówienia, pensje sektora publicznego) są bezpośrednio dochodem firm i ludzi. Sama austerity = pogłębienie recesji w krótkim okresie, nawet jeśli długoterminowo redukuje dług. To jeden z fundamentów modelu Dalio.",
        },
      ],
      salon: {
        short:
          "Gospodarka to suma transakcji, a transakcja ma cztery elementy: dwie strony, środek płatniczy i dobro. Wydatki jednej osoby są dochodem drugiej — z tego wynika cała reszta.",
        expand:
          "Produktywność to realny, długoterminowy wzrost: ile efektu na jednostkę pracy / czasu. Rośnie przez wiedzę, technologię, organizację, inwestycje. Bez kredytu gospodarka rosłaby liniowo w tempie produktywności. Z kredytem — falowo. To dlatego można mieć wysoki wzrost PKB i jednocześnie niski wzrost produktywności (jeśli wzrost jest pożyczony, nie zarobiony).",
        trap:
          "Wzrost PKB ≠ wzrost produktywności. Produktywność ≠ pracowitość. Cięcie wydatków rządu pogłębia recesję w krótkim okresie, bo cudze wydatki = czyjeś dochody. Spojrzenie tylko na PKB ukrywa, czy bogactwo jest realnie budowane, czy tylko pożyczane.",
      },
    },
  },

  // ============================================================
  // 36. Ekonomia: kredyt, dług, aktywa, zobowiązania
  // ============================================================
  {
    slug: "econ-kredyt-dlug-aktywa-zobowiazania",
    vaultSlug: "econ",
    label: "Ekonomia — kredyt, dług, aktywa, zobowiązania",
    payload: {
      title: "Kredyt, dług, aktywa, zobowiązania",
      summary:
        "Kredyt to silnik krótkoterminowy gospodarki — pozwala dziś wydać więcej, niż się dziś zarobiło. Brzmi niegroźnie, ale tworzy cykle i sprawia, że gospodarka nie rośnie gładko. Bez tego pojęcia nie da się zrozumieć ani inflacji, ani kryzysów, ani banków centralnych.",
      theory:
        "Kredyt = możliwość wydawania więcej niż obecne dochody, w zamian za obietnicę spłaty w przyszłości. Dług składa się z dwóch części: kwota główna (principal) i odsetki (interest).\n\nKluczowa obserwacja: każdy dług ma dwie strony. Dla pożyczkobiorcy kredyt to zobowiązanie (liability) — coś, co trzeba spłacić. Dla pożyczkodawcy ten sam kredyt to aktywo (asset) — coś, co ma wartość lub generuje dochód. Co dla jednego jest ciężarem, dla drugiego jest pozycją w portfelu. Twoja hipoteka jest dla Ciebie ciężarem, ale dla banku jest aktywem w portfelu.\n\nKredyt jest tworzony w momencie udzielenia. Bank nie „wyjmuje\" pieniędzy z czyichś oszczędności — kreuje nowy zapis na koncie. To jedna z najczęściej mylonych rzeczy w intuicyjnym myśleniu o pieniądzu.\n\nKonsekwencje:\n— Dług jednej osoby jest aktywem drugiej. Dlatego „po prostu skasujmy długi\" nie istnieje jako rozwiązanie. Skasowanie długu dłużnikowi zawsze oznacza stratę dla wierzyciela.\n— Kryzysy zadłużenia to zawsze kryzysy aktywów. Gdy długi przestają być spłacane, ktoś musi przyjąć stratę — i to politycznie najtrudniejsza część każdego kryzysu.\n— Dług nie jest zawsze zły. Zdrowy kredyt finansujący produktywność (inwestycje, edukacja, infrastruktura) jest korzystny. Problematyczny jest dług na konsumpcję — bo nie generuje przyszłych dochodów do spłaty.",
      questions: [
        {
          type: "abc",
          text: "Hipoteka jest:",
          options: [
            "zobowiązaniem dla Ciebie, aktywem dla banku",
            "aktywem dla obu stron",
            "zobowiązaniem dla obu stron",
          ],
          correctAnswer: 0,
          explanation:
            "Każdy dług ma dwie strony. Dla dłużnika — liability. Dla wierzyciela — asset. Stąd kryzysy zadłużenia są tak trudne politycznie.",
        },
        {
          type: "abc",
          text: "Bank udzielając kredytu:",
          options: [
            "wyjmuje pieniądze z czyichś oszczędności",
            "kreuje nowy zapis na koncie",
            "drukuje banknoty",
          ],
          correctAnswer: 1,
          explanation:
            "Kredyt powstaje w momencie udzielenia jako nowy zapis. To kreacja pieniądza, nie redystrybucja istniejących oszczędności.",
        },
        {
          type: "fill",
          text: "Dług składa się z dwóch części: kwota główna (principal) i _____ (interest).",
          options: null,
          correctAnswer: "odsetki",
          explanation:
            "Principal + interest. Klasyczne rozróżnienie w każdej umowie kredytowej.",
        },
        {
          type: "fill",
          text: "Dla pożyczkobiorcy kredyt to zobowiązanie. Dla pożyczkodawcy ten sam kredyt to _____.",
          options: null,
          correctAnswer: "aktywo",
          explanation:
            "Asset / liability — dwie strony tego samego długu. Z tego wynika, dlaczego kryzysy zadłużenia są zawsze kryzysami aktywów.",
        },
        {
          type: "open",
          text: "Wytłumacz, czemu „po prostu skasujmy długi\" nie istnieje jako proste rozwiązanie.",
          options: null,
          correctAnswer:
            "Każdy dług ma dwie strony — dłużnika i wierzyciela. Skasowanie długu dłużnikowi to automatycznie strata dla wierzyciela. Kryzysy zadłużenia są zawsze kryzysami aktywów. Ulga dla jednych musi być stratą dla drugich. Politycznie to najtrudniejsza część każdego kryzysu — komu odebrać, komu darować. Stąd zwykle stosuje się mix narzędzi (restrukturyzacja + drukowanie + redystrybucja + austerity) zamiast prostego skasowania.",
          explanation:
            "Klucz: dług jednej osoby = aktywo drugiej. Każde rozwiązanie kryzysu zadłużenia to redystrybucja strat, nie ich zniknięcie.",
        },
        {
          type: "spot_error",
          text: "„Dług hipoteczny na 30 lat na kupno mieszkania i kredyt konsumencki na nowy telewizor to ekonomicznie to samo — oba to dług na konsumpcję.\"",
          options: [
            "30 lat to za długo",
            "mieszkanie to aktywo, telewizor traci wartość — to dwa różne rodzaje długu",
            "oba to inwestycja",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Dług finansujący aktywo (mieszkanie, edukacja, infrastruktura) może budować przyszłe dochody / wartość. Dług finansujący konsumpcję (telewizor) — nie. Stąd różne ryzyko makroekonomiczne i osobiste.",
        },
      ],
      salon: {
        short:
          "Dług jednej osoby jest aktywem drugiej. Stąd „skasujmy długi\" nie istnieje — ulga dla jednych musi być stratą dla drugich. Kryzysy zadłużenia to zawsze kryzysy aktywów.",
        expand:
          "Kredyt = wydawanie więcej niż obecne dochody w zamian za obietnicę spłaty. Składa się z principalu i odsetek. Tworzony w momencie udzielenia (nie z czyichś oszczędności) — to kreacja pieniądza. Dług finansujący produktywność (inwestycje, edukacja, infrastruktura) jest zdrowy. Dług finansujący konsumpcję jest problematyczny — nie generuje przyszłych dochodów do spłaty.",
        trap:
          "Mylenie kredytu z pieniądzem — kredyt jest stworzony, nie pożyczony z oszczędności. Myślenie, że dług jest zawsze zły — bywa dźwignią produktywności. Niezauważenie, że kryzysy zadłużenia to kryzysy aktywów — gdy długi nie są spłacane, ktoś musi przyjąć stratę.",
      },
    },
  },

  // ============================================================
  // 37. Ekonomia: bank centralny i stopy procentowe
  // ============================================================
  {
    slug: "econ-bank-centralny-i-stopy",
    vaultSlug: "econ",
    label: "Ekonomia — bank centralny i stopy procentowe",
    payload: {
      title: "Bank centralny i stopy procentowe",
      summary:
        "Bank centralny to dyrygent krótkoterminowego cyklu zadłużenia. Decyduje, czy kredyt jest tani i powszechny, czy drogi i trudno dostępny. To jeden z najpotężniejszych aktorów w nowoczesnej gospodarce — dlatego newsy o decyzjach Fed, EBC czy NBP poruszają rynki.",
      theory:
        "Bank centralny ustala stopy procentowe — „cenę pieniądza\" i kredytu. Mechanizm kontrcykliczny:\n— Niskie stopy = tani kredyt → więcej pożyczek → większe wydatki → gospodarka przyspiesza.\n— Wysokie stopy = drogi kredyt → mniej pożyczek → niższe wydatki → gospodarka zwalnia.\n\nDrugi główny instrument: kreacja pieniądza i kupowanie aktywów (obligacje rządowe, korporacyjne). To narzędzie nadzwyczajne, używane gdy stopy nie wystarczają — głównie quantitative easing (QE).\n\nIstotne instytucje: w większości państw bank centralny jest formalnie niezależny od rządu, żeby uniknąć politycznej presji na drukowanie pieniędzy pod wybory. NBP w Polsce, Fed w USA (Federal Reserve), EBC w strefie euro. Główny cel większości banków centralnych: inflacja w okolicach 2%. Fed ma podwójny mandat: inflacja + zatrudnienie.\n\nDziałanie kontrcykliczne — gdy gospodarka się przegrzewa, bank centralny podnosi stopy; gdy hamuje, obniża. Problem zaczyna się dopiero przy „zero lower bound\" — gdy stopy są już przy zerze, a gospodarka nadal potrzebuje pomocy. Wtedy wchodzi QE i niestandardowe narzędzia.",
      questions: [
        {
          type: "abc",
          text: "Bank centralny i bank komercyjny to:",
          options: [
            "to samo",
            "dwie różne instytucje — NBP nie obsługuje Twojego konta",
            "bank centralny jest właścicielem banków komercyjnych",
          ],
          correctAnswer: 1,
          explanation:
            "Bank centralny (NBP) ustala stopy i nadzoruje system. Bank komercyjny (PKO, ING, mBank) udziela kredytów i obsługuje klientów detalicznych.",
        },
        {
          type: "abc",
          text: "Główny cel większości banków centralnych na świecie:",
          options: [
            "PKB na poziomie 5%",
            "inflacja w okolicach 2%",
            "bezrobocie pod 3%",
          ],
          correctAnswer: 1,
          explanation:
            "Standardowy target: ~2% inflacji. Fed ma podwójny mandat (inflacja + zatrudnienie), większość pozostałych banków centralnych — tylko inflacja.",
        },
        {
          type: "fill",
          text: "Niskie stopy procentowe oznaczają _____ kredyt — więcej pożyczek, wzrost wydatków.",
          options: null,
          correctAnswer: "tani",
          explanation:
            "Stopa procentowa = cena pieniądza. Niska stopa = tani kredyt = więcej pożyczek = ożywienie.",
        },
        {
          type: "fill",
          text: "Bank centralny strefy euro to skrót _____ .",
          options: null,
          correctAnswer: "EBC",
          explanation:
            "EBC (European Central Bank). Polski: NBP. Amerykański: Fed (Federal Reserve).",
        },
        {
          type: "open",
          text: "Dlaczego niezależność banku centralnego od rządu jest ważna?",
          options: null,
          correctAnswer:
            "Rząd ma krótki horyzont (cykl wyborczy) i pokusę finansowania wydatków drukowaniem pieniędzy. Bez niezależności bank centralny obniżyłby stopy pod wybory, żeby ożywić gospodarkę, kosztem wyższej inflacji za parę lat. Niezależność daje wiarygodność polityki monetarnej — rynki ufają, że bank centralny będzie walczył z inflacją niezależnie od cyklu politycznego. Dlatego np. Fed czy NBP są formalnie oddzielone od rządu.",
          explanation:
            "Klucz: kredyt makro = polityka długoterminowa, polityka rządu = horyzont krótki. Niezależność rozwiązuje konflikt interesów.",
        },
        {
          type: "spot_error",
          text: "„Inflacja w Polsce 2022 wzrosła do 18% wyłącznie przez błędy NBP. Bank centralny ma pełną kontrolę nad inflacją.\"",
          options: [
            "inflacja była niższa",
            "bank centralny ma wpływ, ale nie pełną kontrolę — są wstrząsy podażowe (energia, wojna, łańcuchy)",
            "rząd ma pełną kontrolę nad inflacją, nie bank centralny",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Bank centralny wpływa na inflację głównie przez kanał popytowy (stopy → kredyt → wydatki). Ale są też wstrząsy podażowe — wojna w Ukrainie, koszty energii, zerwanie łańcuchów po COVID — nad którymi NBP nie ma kontroli. Pełna kontrola to mit.",
        },
      ],
      salon: {
        short:
          "Bank centralny jest dyrygentem cyklu krótkoterminowego: stopy w górę, gdy gospodarka się przegrzewa, w dół — gdy hamuje. Problem zaczyna się przy 0%, kiedy stopy nie mają już dokąd spaść.",
        expand:
          "Główny instrument to stopy procentowe (cena pieniądza), drugi — kreacja pieniądza i zakupy aktywów (QE). Bank centralny formalnie niezależny od rządu, żeby uniknąć politycznej presji na drukowanie pod wybory. Cel większości: inflacja ~2%. Fed ma podwójny mandat (inflacja + zatrudnienie). NBP, Fed, EBC — trzy najczęściej omawiane.",
        trap:
          "Mylenie banku centralnego z bankiem komercyjnym (NBP nie obsługuje Twojego konta). Mylenie banku centralnego z rządem — inna instytucja, inne narzędzia. Myślenie, że obniżki stóp zawsze pomagają — przy 0% klasyczne narzędzia przestają działać. Założenie, że bank centralny „rządzi\" inflacją — wpływa mocno, ale wstrząsy podażowe (wojna, energia) są poza jego kontrolą.",
      },
    },
  },

  // ============================================================
  // 38. Ekonomia: krótkoterminowy cykl zadłużenia
  // ============================================================
  {
    slug: "econ-krotki-cykl-zadluzenia",
    vaultSlug: "econ",
    label: "Ekonomia — krótkoterminowy cykl zadłużenia (5–8 lat)",
    payload: {
      title: "Krótkoterminowy cykl zadłużenia",
      summary:
        "To codzienność gospodarki — to, co widać w newsach o stopach procentowych, inflacji i recesjach. Każdy z nas przeżyje w życiu kilka takich cykli, świadomie lub nie. Polska 2014–2024 to klasyczny przykład: boom, COVID, inflacja 2022–2023, podwyżki stóp, schłodzenie.",
      theory:
        "Krok po kroku, jak działa krótki cykl (5–8 lat):\n1. Bank centralny obniża stopy. Kredyt tanieje.\n2. Ludzie i firmy chętniej pożyczają. Wydatki rosną.\n3. Czyjeś wydatki są czyimś dochodem. Gospodarka przyspiesza.\n4. Większe dochody = większa zdolność kredytowa = jeszcze więcej kredytu.\n5. Popyt rośnie szybciej niż podaż. Pojawia się inflacja.\n6. Bank centralny reaguje: podnosi stopy.\n7. Kredyt drożeje. Wydatki spadają.\n8. Dochody spadają. Pojawia się spowolnienie albo recesja.\n9. Bank centralny znów obniża stopy. Cykl startuje od nowa.\n\nKrótki cykl jest sterowany głównie przez bank centralny i jego stopy procentowe. Inflacja w górę = stopy w górę = schłodzenie. Recesja = stopy w dół = ożywienie.\n\nWażna obserwacja: każdy kolejny krótki cykl zostawia trochę długu. Te długi narastają i w końcu zaczynają zaburzać cały system — wtedy mówimy o długoterminowym cyklu zadłużenia. Krótkie cykle resetują się stopami. Długi już nie.",
      questions: [
        {
          type: "abc",
          text: "Krótkoterminowy cykl zadłużenia trwa zwykle:",
          options: [
            "1–2 lata",
            "5–8 lat",
            "30–50 lat",
          ],
          correctAnswer: 1,
          explanation:
            "5–8 lat to klasyczny odstęp między recesjami. Dłuższy cykl (50–75 lat) to długoterminowy cykl zadłużenia.",
        },
        {
          type: "abc",
          text: "Co głównie steruje krótkim cyklem zadłużenia?",
          options: [
            "polityka fiskalna rządu",
            "bank centralny przez stopy procentowe",
            "kurs walutowy",
          ],
          correctAnswer: 1,
          explanation:
            "Bank centralny — kontrcyklicznie zmienia stopy. Polityka fiskalna ma wpływ, ale to nie ona definiuje krótki cykl.",
        },
        {
          type: "fill",
          text: "Gdy popyt rośnie szybciej niż podaż, pojawia się _____ .",
          options: null,
          correctAnswer: "inflacja",
          explanation:
            "Klasyczny mechanizm: za dużo pieniądza za mało dóbr = ceny w górę. Bank centralny reaguje podnosząc stopy.",
        },
        {
          type: "fill",
          text: "Recesja = bank centralny _____ stopy = ożywienie.",
          options: null,
          correctAnswer: "obniża",
          explanation:
            "Kontrcyklicznie. Recesja → obniżki → tani kredyt → wydatki → ożywienie. To klasyczny reset krótkiego cyklu.",
        },
        {
          type: "open",
          text: "Opisz polski cykl 2014–2024 w terminologii Dalio.",
          options: null,
          correctAnswer:
            "2014–2019: niskie stopy NBP (1,5%), boom kredytowy, wzrost wydatków, dochodów. 2020: COVID, dalsze obniżki (do 0,1%) i tarcza fiskalna, dalsze pompowanie. 2021–2022: efekty drukowania + wstrząsy podażowe (wojna, energia, łańcuchy) = inflacja przyspiesza do 18%. 2022–2023: NBP gwałtownie podnosi stopy (z 0,1% do 6,75%). 2023–2024: schłodzenie, spadek inflacji, dyskusja o obniżkach. Klasyczny krótki cykl Dalio.",
          explanation:
            "Pełen przebieg: tanie stopy → boom → inflacja → drogie stopy → schłodzenie → znów rozważanie obniżek. Idealny case study krótkiego cyklu.",
        },
        {
          type: "spot_error",
          text: "„Recesja jest oznaką, że system gospodarczy się załamuje i banki centralne robią coś źle.\"",
          options: [
            "recesja zwykle jest naturalnym elementem krótkiego cyklu, nie błędem",
            "recesji nie da się przewidzieć, więc to zawsze błąd banku centralnego",
            "recesja to to samo co depresja",
            "wszystko OK",
          ],
          correctAnswer: 0,
          explanation:
            "Krótkie recesje są wbudowane w system kredytowy. Bank centralny obniża stopy, gospodarka się ożywia, cykl rusza ponownie. Problem zaczyna się dopiero gdy stopy są przy 0% — wtedy zaczyna się długoterminowy kryzys zadłużenia.",
        },
      ],
      salon: {
        short:
          "Krótki cykl zadłużenia (5–8 lat) to fala sterowana stopami banku centralnego. Tanie stopy → boom → inflacja → drogie stopy → schłodzenie → znów obniżki. Każdy z nas przeżyje kilka takich cykli.",
        expand:
          "Mechanizm: niskie stopy = tani kredyt = wzrost wydatków = wzrost dochodów = większa zdolność kredytowa = jeszcze więcej kredytu = aż popyt przerasta podaż i pojawia się inflacja. Bank centralny reaguje podnoszeniem stóp. Kredyt drożeje, wydatki spadają, recesja, znów obniżki. Polska 2014–2024 to klasyczny przykład.",
        trap:
          "Mylenie krótkiego cyklu z długim. Krótki resetuje się stopami. Długi już nie. Myślenie, że każde spowolnienie to katastrofa — krótkie recesje są naturalne. Ignorowanie, że każdy krótki cykl zostawia trochę długu, który narasta w długim.",
      },
    },
  },

  // ============================================================
  // 39. Ekonomia: inflacja / deflacja / recesja / stagflacja / depresja
  // ============================================================
  {
    slug: "econ-inflacja-deflacja-recesja-stagflacja-depresja",
    vaultSlug: "econ",
    label: "Ekonomia — inflacja, deflacja, recesja, stagflacja, depresja",
    payload: {
      title: "Inflacja, deflacja, recesja, stagflacja, depresja",
      summary:
        "Pięć klasycznych zjawisk makro, które często mylą się ludziom. Każde wymaga innej reakcji od banku centralnego i rządu. Warto je rozróżniać, bo brzmią podobnie, a oznaczają zupełnie różne sytuacje — i wymagają zupełnie różnych narzędzi.",
      theory:
        "Inflacja — ogólny wzrost cen. Zwykle gdy popyt przerasta podaż lub gdy pieniądza jest za dużo. Cel większości banków centralnych: ok. 2%.\n\nDeflacja — ogólny spadek cen. Niegroźnie brzmi, ale zatrzymuje wydatki (po co kupować dziś, skoro jutro będzie taniej) i pogłębia kryzys. Niebezpieczna nawet w małych dawkach.\n\nRecesja — spadek aktywności gospodarczej. Klasyczna definicja techniczna: dwa kolejne kwartały spadku PKB. Bezrobocie rośnie, firmy redukują. Normalna część krótkiego cyklu.\n\nStagflacja — stagnacja + inflacja jednocześnie. Klasyczny koszmar (lata 70. w USA, w mniejszym stopniu Polska 2022–2023). Bank centralny w pułapce: podnieść stopy, żeby zbić inflację, znaczy pogłębić recesję; obniżyć stopy, żeby pomóc, znaczy napędzić inflację. Nie ma łatwego ruchu.\n\nDepresja — bardzo głęboka i długa recesja, zwykle związana z kryzysem zadłużenia. Wielki Kryzys lat 30. to klasyczny przykład. Zjawisko dziesięcioleci, nie kwartałów.\n\nKluczowe rozróżnienia:\n— Inflacja i deflacja to nie symetryczne lustra. Umiarkowana inflacja (2–3%) jest zdrowa; deflacja jest niebezpieczna nawet w małych dawkach.\n— Recesja jest normalna i krótka. Depresja jest dramatyczna i długa.\n— Stagflacja jest gorsza od zwykłej recesji, bo nie ma łatwego lekarstwa.\n— Inflacja ≠ drożyzna. Inflacja = tempo wzrostu cen (procent), drożyzna = poziom cen względem dochodów.",
      questions: [
        {
          type: "abc",
          text: "Stagflacja to:",
          options: [
            "wysoka inflacja i wysoki wzrost gospodarczy",
            "stagnacja gospodarcza i wysoka inflacja jednocześnie",
            "spadek cen z rosnącym PKB",
          ],
          correctAnswer: 1,
          explanation:
            "Stagnacja + inflacja = bank centralny w pułapce. Lata 70. w USA, częściowo Polska 2022–2023.",
        },
        {
          type: "abc",
          text: "Klasyczna techniczna definicja recesji to:",
          options: [
            "spadek PKB w jednym kwartale",
            "dwa kolejne kwartały spadku PKB",
            "wzrost bezrobocia powyżej 5%",
          ],
          correctAnswer: 1,
          explanation:
            "Standard: dwa kolejne kwartały spadku PKB. Definicja ma swoje wady (NBER w USA używa szerszego zestawu wskaźników), ale to klasyczna heurystyka.",
        },
        {
          type: "fill",
          text: "Ogólny spadek cen w gospodarce to _____ — zatrzymuje wydatki i pogłębia kryzys.",
          options: null,
          correctAnswer: "deflacja",
          explanation:
            "Po co kupować dziś, skoro jutro będzie taniej. Deflacyjna spirala — Japonia od lat 90. to klasyczny przykład.",
        },
        {
          type: "fill",
          text: "Bardzo głęboka i długa recesja, zwykle związana z kryzysem zadłużenia, to _____.",
          options: null,
          correctAnswer: "depresja",
          explanation:
            "Wielki Kryzys lat 30. to klasyczny przykład. Trwa dekady, nie kwartały.",
        },
        {
          type: "open",
          text: "Dlaczego stagflacja jest dla banku centralnego gorsza niż zwykła recesja?",
          options: null,
          correctAnswer:
            "W zwykłej recesji bank centralny obniża stopy → ożywienie. W stagflacji ma sprzeczne sygnały: inflacja każe podnieść stopy (żeby ją zbić), stagnacja każe obniżyć (żeby pomóc gospodarce). Każdy ruch pogarsza drugi problem. Podniesienie stóp pogłębi recesję; obniżenie napędzi inflację. Nie ma łatwego dobrego ruchu — stąd lata 70. w USA były tak trudne i wymagały radykalnych kroków (Volcker podniósł stopy do ~20%, kosztem głębokiej recesji).",
          explanation:
            "Klucz: stagflacja łamie standardowy model kontrcykliczny, bo wymusza wybór, który problem zaakceptować jako bolesny.",
        },
        {
          type: "spot_error",
          text: "„Deflacja to świetna wiadomość dla konsumentów — wszyscy zyskują, bo wszystko jest tańsze.\"",
          options: [
            "deflacja to wzrost cen",
            "deflacja zatrzymuje wydatki i pogłębia kryzys — krótkoterminowy zysk konsumenta = długoterminowy problem dla gospodarki",
            "deflacja jest dobra tylko dla rządu",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Spadek cen może wyglądać dobrze, ale gdy jest ogólny: ludzie odkładają zakupy, firmy ścinają wynagrodzenia, długi rosną realnie. Spirala deflacyjna (Japonia po 1990) to wieloletnia stagnacja.",
        },
      ],
      salon: {
        short:
          "Pięć zjawisk: inflacja (zdrowa ~2%), deflacja (niebezpieczna), recesja (normalna), stagflacja (pułapka banku centralnego), depresja (dziesięciolecia, kryzys zadłużenia).",
        expand:
          "Inflacja i deflacja to nie symetryczne lustra — umiarkowana inflacja jest zdrowa, deflacja jest niebezpieczna nawet w małych dawkach. Recesja jest normalną częścią cyklu, depresja jest tragedią. Stagflacja jest gorsza od zwykłej recesji, bo bank centralny nie ma dobrego ruchu. Lata 70. w USA, częściowo Polska 2022–2023 jako mini-version.",
        trap:
          "Mylenie recesji z depresją (różnica skali i czasu trwania). Mylenie inflacji z drożyzną (procent vs poziom). Założenie, że spadek cen jest dobry — krótkoterminowy zysk konsumenta = długoterminowy problem gospodarki. Myślenie, że inflacja jest tylko winą rządu — bywa też efektem wstrząsów podażowych.",
      },
    },
  },

  // ============================================================
  // 40. Ekonomia: długoterminowy cykl zadłużenia i bańka
  // ============================================================
  {
    slug: "econ-dlugi-cykl-zadluzenia-banka",
    vaultSlug: "econ",
    label: "Ekonomia — długoterminowy cykl zadłużenia i bańka",
    payload: {
      title: "Długoterminowy cykl zadłużenia i bańka spekulacyjna",
      summary:
        "Fala wszystkich fal, trwająca dekady (50–75 lat). Składa się z wielu krótkich cykli, z których każdy zostawia trochę długu. W końcu długu jest tyle, że klasyczne narzędzia banku centralnego przestają działać — to wtedy zaczynają się prawdziwe kryzysy systemowe. Większość ludzi przeżyje jeden, najwyżej dwa długie cykle w życiu.",
      theory:
        "Mechanizm: każdy krótki cykl kończy się większym poziomem długu. Z czasem dług narasta w skali pokoleniowej. Wzrost cen aktywów (mieszkania, akcje, obligacje) staje się napędzany kredytem, a nie produktywnością — to jest właśnie bańka.\n\nDynamika bańki: ludzie pożyczają coraz więcej, żeby kupować aktywa, wierząc, że ceny będą dalej rosły. Wzrost cen utwierdza w przekonaniu, że pożyczanie pod zakup aktywów jest bezpieczne. Spirala działa, dopóki spłaty długu nie zaczynają przekraczać możliwości dochodów.\n\nKlasyczne przykłady końca długiego cyklu:\n— 1929 USA (Wielki Kryzys)\n— 2008 USA (kryzys subprime)\n— Japonia od lat 90. (Lost Decades)\n\nKluczowa obserwacja: po pęknięciu długiego cyklu stopy procentowe są już zwykle przy zerze. Bank centralny ma związane ręce — klasyczne narzędzie monetarne (obniżki stóp) nie działa. To moment, w którym potrzebny jest deleveraging (sprzątanie po nadmiernym zadłużeniu) i sięga się po niestandardowe narzędzia jak QE.\n\nDługi cykl zadłużenia kończy się, gdy długu jest tyle, że klasyczna polityka monetarna przestaje pomagać. Stopy są przy 0%, ale gospodarka nadal nie rośnie.",
      questions: [
        {
          type: "abc",
          text: "Długoterminowy cykl zadłużenia trwa zwykle:",
          options: [
            "5–10 lat",
            "20–30 lat",
            "50–75 lat",
          ],
          correctAnswer: 2,
          explanation:
            "Skala pokoleniowa. Większość ludzi przeżyje raz, najwyżej dwa razy w życiu. To dlatego każde pokolenie myśli, że „tym razem jest inaczej\".",
        },
        {
          type: "abc",
          text: "Co odróżnia bańkę od zdrowego wzrostu cen aktywów?",
          options: [
            "skala wzrostu cen",
            "źródło wzrostu — bańka jest napędzana kredytem, zdrowy wzrost produktywnością",
            "ilość uczestników rynku",
          ],
          correctAnswer: 1,
          explanation:
            "Bańka = ceny aktywów rosną dzięki pożyczonemu pieniądzowi, nie dzięki realnym fundamentom. Dlatego pęka, gdy spłaty zaczynają przekraczać dochody.",
        },
        {
          type: "fill",
          text: "Klasyczne ostatnie słowa przed każdym pęknięciem bańki: „tym razem jest _____\".",
          options: null,
          correctAnswer: "inaczej",
          explanation:
            "Reinhart & Rogoff — „This Time Is Different\". Zawsze są dobre powody, dlaczego ten boom jest inny. Nigdy nie są wystarczająco dobre.",
        },
        {
          type: "fill",
          text: "Po pęknięciu długiego cyklu stopy procentowe są już zwykle przy _____ — bank centralny ma związane ręce.",
          options: null,
          correctAnswer: "zerze",
          explanation:
            "Zero lower bound. Klasyczne narzędzia nie działają — wtedy wchodzi QE i deleveraging.",
        },
        {
          type: "open",
          text: "Dlaczego 2008 był końcem długiego cyklu, a nie zwykłą recesją?",
          options: null,
          correctAnswer:
            "Klasyczna recesja jest częścią krótkiego cyklu — bank centralny obniża stopy, kredyt taniej, ożywienie. W 2008 stopy spadły z 5,25% do 0,25% — i klasyczne narzędzia się skończyły, a gospodarka nadal nie rosła. Trzeba było sięgnąć po niestandardowe (QE, TARP), które stały się stałym elementem polityki. Kryzys subprime to było pęknięcie bańki kredytowej na rynku mieszkaniowym, napędzanej dekadą niskich stóp i łatwego kredytu — peak długoterminowego cyklu, nie zwykłe schłodzenie.",
          explanation:
            "Klucz: skala długu, stopy do zera, QE. Krótki cykl resetuje się stopami. Długi już nie.",
        },
        {
          type: "spot_error",
          text: "„Recesja 2001 po pęknięciu bańki dotcom i kryzys 2008 to to samo zjawisko — pęknięcie długoterminowego cyklu zadłużenia w USA.\"",
          options: [
            "obie sytuacje to długi cykl",
            "2001 to krótki cykl (sektorowa bańka tech), 2008 to koniec długiego cyklu (system finansowy + dług gospodarstw)",
            "obie były bańkami nieruchomości",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "2001 — sektorowa bańka technologiczna, klasyczny krótki cykl. 2008 — pęknięcie bańki kredytowej w sercu systemu (mieszkania, banki, MBS/CDO), stopy do zera, QE. Skala i mechanizm zupełnie różne.",
        },
      ],
      salon: {
        short:
          "Długoterminowy cykl zadłużenia (50–75 lat) to fala dekad. Składa się z wielu krótkich cykli, z których każdy zostawia trochę długu. Kończy się, gdy stopy są przy 0%, a gospodarka nadal nie rośnie.",
        expand:
          "Bańka to wzrost cen aktywów napędzany kredytem, nie produktywnością. Powstaje, gdy ludzie pożyczają coraz więcej, żeby kupować aktywa, wierząc, że ceny dalej będą rosły. Pęka, gdy spłaty przekraczają dochody. Klasyczne końce długich cykli: 1929 USA, 2008 USA, Japonia od 1990. Większość ludzi przeżyje raz lub dwa razy w życiu.",
        trap:
          "„Tym razem jest inaczej\" — klasyczne ostatnie słowa przed pęknięciem. Mylenie wzrostu cen aktywów z prawdziwym wzrostem gospodarczym. Założenie, że bańki da się przewidzieć precyzyjnie — da się rozpoznać przewartościowanie, nie dokładny dzień pęknięcia. Mylenie krótkiego cyklu z długim (2001 vs 2008).",
      },
    },
  },

  // ============================================================
  // 41. Ekonomia: deleveraging i 4 dźwignie
  // ============================================================
  {
    slug: "econ-deleveraging-4-dzwignie",
    vaultSlug: "econ",
    label: "Ekonomia — deleveraging i 4 dźwignie (beautiful deleveraging)",
    payload: {
      title: "Deleveraging i 4 dźwignie",
      summary:
        "Gdy długi cykl zadłużenia kończy się, gospodarka musi zmniejszyć ciężar długu. Ten proces to deleveraging. Jest bolesny zawsze — pytanie tylko, jak bardzo i kto ucierpi najmocniej. Sztuka polega na mieszaniu czterech narzędzi w dobrych proporcjach. Stąd termin „beautiful deleveraging\" — piękne oddłużanie.",
      theory:
        "Cztery dźwignie deleveragingu:\n\n1. Cięcie wydatków (austerity) — rząd, firmy, gospodarstwa domowe ograniczają wydatki. Pomaga obniżyć dług, ale boli wszystkich i pogłębia recesję, bo czyjeś wydatki są czyimś dochodem.\n\n2. Restrukturyzacja długu — przedłużenie spłat, obniżenie odsetek, częściowe umorzenie. Boli wierzycieli, bo ich aktywo traci wartość.\n\n3. Redystrybucja pieniędzy — transfery od bogatych do biednych przez podatki, programy socjalne. Boli bogatych, politycznie trudne.\n\n4. Drukowanie pieniędzy (kreacja pieniądza, QE) — bank centralny kupuje aktywa i pompuje pieniądze do systemu. Boli oszczędzających (siła nabywcza maleje), grozi inflacją.\n\nBeautiful deleveraging — termin Dalio na sytuację, w której gospodarka oddłuża się BEZ wpadania w depresję i BEZ wyzwolenia hiperinflacji. Wymaga zrównoważonego mixu wszystkich czterech dźwigni.\n\nDlaczego sam mix, a nie wybór jednej?\n— Sama austerity = depresja (każde cięcie odbiera komuś dochód).\n— Samo drukowanie = ryzyko hiperinflacji.\n— Sama restrukturyzacja = bunt wierzycieli, krach systemu finansowego.\n— Sama redystrybucja = bunt bogatych, ucieczka kapitału.\n\nKażda dźwignia boli kogoś. Sztuka to mix proporcji, nie wybór jednego narzędzia. To proces na lata, czasem dekady (Japonia po 1990).",
      questions: [
        {
          type: "abc",
          text: "Cztery dźwignie deleveragingu wg Dalio to:",
          options: [
            "stopy, QE, podatki, cła",
            "austerity, restrukturyzacja długu, redystrybucja, drukowanie pieniędzy",
            "PKB, inflacja, bezrobocie, deficyt",
          ],
          correctAnswer: 1,
          explanation:
            "To nazwany zestaw czterech narzędzi do oddłużania. Każde boli kogoś — sztuka to dobry mix.",
        },
        {
          type: "abc",
          text: "„Beautiful deleveraging\" to:",
          options: [
            "oddłużanie bez wpadania w depresję i bez hiperinflacji",
            "oddłużanie wyłącznie przez cięcie wydatków",
            "kryzys, który nie wymaga interwencji",
          ],
          correctAnswer: 0,
          explanation:
            "Termin Dalio na zrównoważony mix czterech dźwigni — żadna nie dominuje, więc nie ma ani depresji, ani hiperinflacji.",
        },
        {
          type: "fill",
          text: "Sama austerity bez innych dźwigni prowadzi zwykle do _____.",
          options: null,
          correctAnswer: "depresji",
          explanation:
            "Cięcie wydatków odbiera dochody innym (czyjeś wydatki = czyjś dochód). Gdy nikt nie kompensuje cięć drukowaniem czy redystrybucją, gospodarka spada w spiralę.",
        },
        {
          type: "fill",
          text: "Restrukturyzacja długu boli wierzycieli, bo ich _____ traci wartość.",
          options: null,
          correctAnswer: "aktywo",
          explanation:
            "Dług jednej strony = aktywo drugiej. Obniżenie odsetek albo umorzenie = utrata wartości w portfelu wierzyciela.",
        },
        {
          type: "open",
          text: "Dlaczego sam dodruk pieniędzy nie wystarczy do deleveragingu?",
          options: null,
          correctAnswer:
            "Sam dodruk grozi hiperinflacją — bo kreuje pieniądz bez odpowiadającego mu dobra, więc rosną ceny. Plus pieniądz może utknąć w systemie finansowym (jak po 2008 w USA) i nie trafiać do realnej gospodarki, więc nie oddłuża faktycznie. Dodruk działa jako kompensacja deflacyjnych efektów austerity i restrukturyzacji — równoważy spadek wartości aktywów. Sam, bez tych dźwigni, jest niebezpieczny. Klucz to mix, nie pojedyncze narzędzie.",
          explanation:
            "Klucz: każda dźwignia ma sens tylko jako część zbalansowanego mixu. Dodruk neutralizuje deflacyjne skutki pozostałych dźwigni.",
        },
        {
          type: "spot_error",
          text: "„Drukowanie pieniędzy ZAWSZE prowadzi do hiperinflacji, więc QE po 2008 powinno było wywołać natychmiastową hiperinflację w USA.\"",
          options: [
            "to prawda — hiperinflacja przyszła w 2009",
            "QE po 2008 było ogromne, ale inflacja w USA była niska przez ~10 lat, bo pieniądz utknął w systemie finansowym, nie w realnej gospodarce",
            "po 2008 nie było QE",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Bilans Fed wzrósł z 900 mld do 4,5 bln dolarów, ale inflacja w USA pozostawała poniżej 2% przez większość dekady. Pieniądz utknął w sektorze finansowym — banki, aktywa, akcje — nie w realnej gospodarce. Inflacja wróciła dopiero 2021–2023 jako splot wielu czynników (COVID QE, wstrząsy podażowe, wojna).",
        },
      ],
      salon: {
        short:
          "Beautiful deleveraging to nie magiczne narzędzie — to dobry mix czterech bolesnych. Austerity, restrukturyzacja, redystrybucja, drukowanie pieniędzy. Każde boli kogoś, sztuka w proporcjach.",
        expand:
          "Sama austerity = depresja, samo drukowanie = inflacja, sama restrukturyzacja = bunt wierzycieli, sama redystrybucja = bunt bogatych. Klucz to mieszanie — drukowanie kompensuje deflacyjne skutki austerity, restrukturyzacja przerzuca część ciężaru na wierzycieli, redystrybucja łagodzi społeczny ból. Deleveraging to proces na lata, czasem dekady (Japonia po 1990).",
        trap:
          "Myślenie, że „drukowanie\" zawsze prowadzi do hiperinflacji — w deleveragingu może być konieczne, by neutralizować deflację. Mylenie deleveragingu z recesją (skala i czas trwania). Założenie, że deleveraging można przyspieszyć — to proces na lata. Myślenie, że jest „dobre\" i „złe\" narzędzie — każde ma sens w odpowiednich proporcjach.",
      },
    },
  },

  // ============================================================
  // 42. Ekonomia: stopy 0% i QE
  // ============================================================
  {
    slug: "econ-stopy-zero-qe",
    vaultSlug: "econ",
    label: "Ekonomia — stopy 0% i quantitative easing (QE)",
    payload: {
      title: "Stopy 0% i quantitative easing",
      summary:
        "Klasyczna polityka monetarna polega na zmienianiu stóp procentowych. Ale gdy stopy są już przy 0%, bank centralny nie może ich obniżyć dalej. To moment, w którym sięga po niestandardowe narzędzia. Wbrew nazwie, „drukowanie pieniędzy\" rzadko polega na fizycznym drukowaniu banknotów.",
      theory:
        "„Zero lower bound\" — teoretyczna granica obniżania stóp. W praktyce niektóre banki centralne wprowadzały lekko ujemne stopy (Japonia, strefa euro, Szwajcaria), ale to wciąż wąska skala.\n\nQE (quantitative easing) — bank centralny kreuje pieniądz cyfrowo i kupuje za niego aktywa, głównie obligacje rządowe i korporacyjne. Cele:\n— pompowanie płynności w system,\n— obniżenie długoterminowych stóp procentowych,\n— wsparcie cen aktywów,\n— podtrzymanie kredytowania w realnej gospodarce.\n\nKlasyczne przykłady: USA po 2008 (trzy rundy QE w latach 2008–2014), strefa euro po 2012, cały świat po COVID 2020.\n\nSkutki uboczne:\n— Wzrost cen aktywów (akcje, nieruchomości) → bogatsze gospodarstwa zyskują najwięcej, bo to one mają aktywa.\n— Pogłębienie nierówności.\n— Potencjalna inflacja, gdy pieniądz wreszcie trafi do realnej gospodarki (vide 2021–2023).\n\nSkala: w 2008 bilans Fed wzrósł z ok. 900 mld dolarów do ponad 4,5 bln. Po COVID przekroczył 8 bln.\n\nKluczowe rozróżnienie:\n— QE = zakup aktywów (głównie obligacje).\n— Helicopter money = bezpośredni transfer do ludzi. Drugie nigdy nie zostało wdrożone w klasycznej formie.\n\nQE to narzędzie nadzwyczajne. Bank centralny przestaje sterować ceną pieniądza, a zaczyna sterować jego ilością.",
      questions: [
        {
          type: "abc",
          text: "QE polega na:",
          options: [
            "fizycznym drukowaniu banknotów",
            "cyfrowej kreacji pieniądza przez bank centralny i zakupie aktywów",
            "obniżeniu podatków",
          ],
          correctAnswer: 1,
          explanation:
            "Wbrew nazwie potocznej („drukowanie\"), QE to elektroniczne kreowanie zapisów na kontach + zakup obligacji rządowych/korporacyjnych. Fizyczne banknoty nie są drukowane.",
        },
        {
          type: "abc",
          text: "Helicopter money różni się od QE tym, że:",
          options: [
            "to dosłownie zrzut banknotów z helikoptera",
            "to bezpośredni transfer pieniędzy do obywateli, podczas gdy QE to zakup aktywów",
            "to to samo, różne nazwy",
          ],
          correctAnswer: 1,
          explanation:
            "Helicopter money — bezpośredni transfer do gospodarstw. QE — zakup obligacji w systemie finansowym. Pierwsze nigdy nie zostało wdrożone w klasycznej formie.",
        },
        {
          type: "fill",
          text: "Granica obniżania stóp blisko 0% nazywa się „zero lower _____ \".",
          options: null,
          correctAnswer: "bound",
          explanation:
            "Klasyczny termin makroekonomiczny. Niektóre banki centralne (Japonia, EBC) testowały lekko ujemne stopy, ale to wąska skala.",
        },
        {
          type: "fill",
          text: "Po 2008 Fed zwiększył bilans z ok. 900 mld do ponad _____ bln dolarów.",
          options: null,
          correctAnswer: "4,5",
          explanation:
            "Skala QE 2008–2014. Po COVID bilans przekroczył 8 bln. To pokazuje, jaką skalę osiągnęły niestandardowe narzędzia.",
        },
        {
          type: "open",
          text: "Dlaczego po 2008 ogromne QE nie wywołało natychmiastowej wysokiej inflacji w USA?",
          options: null,
          correctAnswer:
            "Pieniądz z QE utknął w systemie finansowym — banki dostały płynność, kupowały aktywa, ale kredyt do realnej gospodarki rósł powoli. Gospodarstwa po kryzysie były bardziej ostrożne, firmy też. Pieniądz trafił głównie na rynki finansowe, podbijając ceny aktywów (akcje, nieruchomości), nie ceny dóbr konsumpcyjnych. Stąd dekada niskiej inflacji w USA mimo ogromnego QE. Inflacja wróciła dopiero 2021–2023 — splot QE po COVID, wstrząsów podażowych, wojny.",
          explanation:
            "Klucz: pieniądz może być w systemie, ale nie w realnej gospodarce. Dopiero gdy realnie krąży (popyt na dobra), pojawia się inflacja konsumencka.",
        },
        {
          type: "spot_error",
          text: "„QE pomaga równo wszystkim, bo dodaje pieniądze do systemu.\"",
          options: [
            "QE pomaga równo",
            "QE głównie podbija ceny aktywów — najwięcej zyskują ci, którzy je już mają (bogaci), więc pogłębia nierówności",
            "QE szkodzi wszystkim",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Klasyczna krytyka QE: pieniądz trafia do systemu finansowego → ceny aktywów rosną → bogaci posiadający aktywa zyskują, biedni nie mają ich w portfelu. Stąd pogłębienie nierówności jako udokumentowany skutek dekady QE w USA.",
        },
      ],
      salon: {
        short:
          "QE to nie drukowanie banknotów — to bank centralny kreujący pieniądz cyfrowo i kupujący za niego obligacje. Narzędzie nadzwyczajne, używane gdy stopy są przy 0%.",
        expand:
          "Bank centralny przestaje sterować ceną pieniądza (stopa), a zaczyna sterować jego ilością (bilans). Skutki: wsparcie kredytowania, wzrost cen aktywów (akcje, nieruchomości), pogłębienie nierówności (bogaci posiadający aktywa zyskują), potencjalna inflacja, gdy pieniądz trafi do realnej gospodarki. Po 2008 USA — bilans Fed 900 mld → 4,5 bln. Po COVID >8 bln.",
        trap:
          "Wyobrażanie sobie, że QE to fizyczne drukowanie banknotów. Myślenie, że QE = natychmiastowa inflacja (po 2008 inflacja była niska przez ~10 lat). Założenie, że QE jest „darmowe\" — wprowadza bańki na aktywach, nierówności, presje inflacyjne. Mylenie QE z helicopter money — QE to zakup aktywów, helicopter to transfer do ludzi (nigdy klasycznie nie wdrożony).",
      },
    },
  },

  // ============================================================
  // 43. Ekonomia: kryzys 2008 USA — case study
  // ============================================================
  {
    slug: "econ-kryzys-2008-usa",
    vaultSlug: "econ",
    label: "Ekonomia — kryzys 2008 USA (case study)",
    payload: {
      title: "Kryzys 2008 USA",
      summary:
        "Najlepszy przykład pęknięcia długoterminowego cyklu zadłużenia w nowoczesnej gospodarce. Pokazuje wszystkie elementy modelu Dalio w jednym wydarzeniu: bańkę kredytową, peak długu, pęknięcie, deleveraging, QE. Wspólna referencja w rozmowach o ekonomii.",
      theory:
        "Oś czasu:\n\n2000–2007 — niskie stopy procentowe Fed (po pęknięciu bańki dotcom Fed obniżył agresywnie), eksplozja kredytów hipotecznych, w tym subprime (dla osób o niskiej zdolności kredytowej). Ceny mieszkań w USA rosły systematycznie, więc kredyt subprime wydawał się bezpieczny: „ceny zawsze rosną\". Banki pakowały te kredyty w skomplikowane instrumenty (CDO, MBS) i sprzedawały na całym świecie.\n\n2007 — ceny mieszkań przestały rosnąć. Część kredytów subprime przestała być spłacana. Wartość CDO/MBS gwałtownie spadła.\n\nWrzesień 2008 — upadek Lehman Brothers. Systemowy kryzys finansowy. Panika.\n\nReakcja Fed — stopy obniżone praktycznie do 0% (z 5,25% w 2007 do 0,25% w grudniu 2008).\n\nReakcja rządu USA — TARP (Troubled Asset Relief Program), bailouty banków, programy stymulacyjne.\n\nReakcja Fed po dotarciu do 0% — trzy rundy QE w latach 2008–2014. Bilans Fed wzrósł z ok. 900 mld do ponad 4,5 bln dolarów.\n\nEfekt długofalowy — USA uniknęły depresji, ale weszły w długi okres niskiego wzrostu, niskich stóp i wysokich nierówności. Klasyczny przykład beautiful deleveraging w skali makro.\n\n2008 to przykład wszystkich elementów modelu Dalio jednocześnie: bańki kredytowej, peak długu, pęknięcia, deleveragingu z mixem austerity + restrukturyzacji + redystrybucji + drukowania. To moment, w którym narodziło się współczesne QE.",
      questions: [
        {
          type: "abc",
          text: "Bezpośrednim wyzwalaczem paniki finansowej we wrześniu 2008 był:",
          options: [
            "upadek Bear Stearns",
            "upadek Lehman Brothers",
            "bankructwo Grecji",
          ],
          correctAnswer: 1,
          explanation:
            "Lehman Brothers — 15 września 2008. Bear Stearns upadł wcześniej (marzec 2008), ale Fed go uratował. Lehmana nie — i to wyzwoliło systemową panikę.",
        },
        {
          type: "abc",
          text: "Kryzys subprime to:",
          options: [
            "kryzys obligacji rządowych USA",
            "kryzys kredytów hipotecznych dla osób o niskiej zdolności kredytowej, spakowanych w CDO/MBS",
            "kryzys waluty dolarowej",
          ],
          correctAnswer: 1,
          explanation:
            "Subprime = poniżej standardu („prime\"). Niska zdolność kredytowa + zerowy wkład własny + ceny mieszkań rosną → kredyty wydawały się bezpieczne. CDO/MBS to instrumenty, w które je pakowano.",
        },
        {
          type: "fill",
          text: "Po 2008 Fed obniżył stopy do 0,25% i uruchomił trzy rundy _____ (skrót na 2 litery).",
          options: null,
          correctAnswer: "QE",
          explanation:
            "Quantitative easing. W praktyce: 2008–2010 (QE1), 2010–2011 (QE2), 2012–2014 (QE3).",
        },
        {
          type: "fill",
          text: "Program ratunkowy dla banków po Lehmanie miał skrót _____ .",
          options: null,
          correctAnswer: "TARP",
          explanation:
            "Troubled Asset Relief Program. Bailout banków, pierwotnie ~700 mld dolarów, faktycznie wydane mniej.",
        },
        {
          type: "open",
          text: "Wyjaśnij, dlaczego 2008 zmieniło rolę banków centralnych na świecie.",
          options: null,
          correctAnswer:
            "Przed 2008 bank centralny działał głównie przez stopy procentowe — to było klasyczne narzędzie. Po 2008 stopy doszły do 0% i nie działały już dalej. Fed sięgnął po QE — kreację pieniądza i zakup aktywów. Co miało być nadzwyczajne, stało się standardem. EBC powtórzył to po 2012, Bank of Japan rozszerzył skalę, cały świat zrobił to po COVID. Bank centralny przestał sterować tylko ceną pieniądza (stopa), a zaczął sterować też jego ilością (bilans). To fundamentalna zmiana paradygmatu — i jeden z głównych powodów, dla których ceny aktywów (akcje, nieruchomości) rosły przez całą dekadę po 2008.",
          explanation:
            "Klucz: QE z narzędzia nadzwyczajnego stało się stałym elementem polityki monetarnej. To zmienia układ sił między rynkami finansowymi a realną gospodarką.",
        },
        {
          type: "spot_error",
          text: "„Kryzys 2008 i kryzys strefy euro 2010–2012 to to samo zjawisko z tych samych przyczyn.\"",
          options: [
            "tak, to było jedno globalne zjawisko",
            "to dwa różne kryzysy — 2008 to bańka kredytowa nieruchomości w USA, 2010–2012 to kryzys zadłużenia państw w strefie euro (Grecja, Hiszpania, Włochy, Portugalia, Irlandia)",
            "kryzys strefy euro nie istniał",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "2008 USA — dług gospodarstw domowych (hipoteki subprime) + dług sektora finansowego (CDO/MBS). 2010–2012 strefa euro — dług państw (PIIGS), problem braku wspólnej polityki fiskalnej przy wspólnej walucie. Powiązane (2008 nakręcił globalne problemy), ale inne mechanizmy.",
        },
      ],
      salon: {
        short:
          "2008 to nie była zwykła recesja, tylko pęknięcie długoterminowego cyklu zadłużenia. Bańka kredytowa na rynku mieszkaniowym, peak długu, panika po Lehmanie, stopy do zera, dekada QE.",
        expand:
          "Sekwencja: 2000–2007 niskie stopy + subprime + CDO/MBS, 2007 ceny przestają rosnąć, 2008 Lehman, panika. Fed obniża z 5,25% do 0,25%, uruchamia TARP i trzy rundy QE (bilans z 900 mld do 4,5 bln). USA uniknęły depresji, ale weszły w dekadę niskiego wzrostu, niskich stóp, wysokich nierówności. Klasyczny beautiful deleveraging w skali makro. To moment, w którym narodziło się współczesne QE jako stałe narzędzie.",
        trap:
          "Myślenie, że 2008 to zwykła recesja, tylko głębsza — to było pęknięcie długiego cyklu. Założenie, że winę ponoszą tylko banki — to efekt całego systemu (stopy, deregulacja, polityka mieszkaniowa, zachłanność, naiwność). Niezauważenie, że 2008 zmieniło rolę banków centralnych na trwałe. Mylenie 2008 USA z kryzysem strefy euro 2010–2012.",
      },
    },
  },

  // ============================================================
  // 44. Sztuka: Vermeer — Mleczarka
  // ============================================================
  {
    slug: "art-vermeer-mleczarka",
    vaultSlug: "art",
    label: "Sztuka — Vermeer, Mleczarka (1657–58)",
    payload: {
      title: "Vermeer — Mleczarka",
      summary:
        "Mała kuchenna scena (ok. 45×41 cm), służąca przelewa mleko z dzbanka — Vermeer robi z najprostszej czynności niemal sakrament. Holendrzy w XVII wieku odkryli, że codzienność może być tematem sztuki, nie tylko mity i święci.",
      theory:
        "Około 1657–1658, barok niderlandzki, Złoty Wiek Holandii. Dziś w Rijksmuseum w Amsterdamie. Vermeer pracował w Delft, malował powoli i mało — zachowało się około 35 obrazów. Genre painting, czyli scena rodzajowa: codzienne życie zamiast mitów i świętych. Protestancka Holandia uznała, że zwykłe życie jest godnym tematem sztuki.\n\nNajważniejsze techniczne i kulturowe ślady:\n— Mistrzowskie operowanie światłem z lewej strony, prawie filmowe.\n— Skrupulatne tekstury: chleb, mleko, ściana z dziurkami od gwoździ.\n— Prawdopodobnie używał camera obscura jako narzędzia kompozycyjnego.\n— Niezwykle drogi pigment ultramaryna (z lapis lazuli) na fartuchu — to nie była tania kuchenna scena.\n— Skupienie i cisza, niemal sakralne.\n\nVermeer zmarł młodo (43 lata), w długach, popadł w zapomnienie na 200 lat — odkryty na nowo w XIX wieku. Mleczarka to wypowiedź o świętości codzienności i godności pracy fizycznej.",
      questions: [
        {
          type: "abc",
          text: "Mleczarka pokazuje:",
          options: [
            "biblijną postać Marii",
            "codzienną scenę z kuchni — służącą przelewającą mleko",
            "alegorię umiarkowania",
          ],
          correctAnswer: 1,
          explanation:
            "Genre painting — scena rodzajowa. Vermeer celowo wybiera zwykły gest, nie temat religijny. To holenderska protestancka decyzja o tym, że codzienność jest godna obrazu.",
        },
        {
          type: "abc",
          text: "Niebieski na fartuchu mleczarki to:",
          options: [
            "tani pigment indygo",
            "drogi ultramarynowy pigment z lapis lazuli",
            "syntetyczny błękit pruski",
          ],
          correctAnswer: 1,
          explanation:
            "Ultramaryna z lapis lazuli była droższa niż złoto. Sygnalizuje, że Vermeer traktował tę scenę z najwyższą uwagą — nie tania kuchenna miniaturka.",
        },
        {
          type: "fill",
          text: "Vermeer pracował w mieście _____ (Holandia).",
          options: null,
          correctAnswer: "Delft",
          explanation:
            "Delft — niewielkie holenderskie miasto, miejsce niemal całej jego pracy. Stąd termin „Delft school\".",
        },
        {
          type: "fill",
          text: "Narzędzie optyczne, którego Vermeer prawdopodobnie używał do kompozycji: camera _____ .",
          options: null,
          correctAnswer: "obscura",
          explanation:
            "Camera obscura — narzędzie projekcji, użyteczne dla badania światła i proporcji. Dyskutowane, ale wiele cech jego obrazów to sugeruje.",
        },
        {
          type: "open",
          text: "Wytłumacz, dlaczego Mleczarka jest „wypowiedzią o świętości codzienności\", nie tylko ładną sceną kuchenną.",
          options: null,
          correctAnswer:
            "Vermeer wybrał najprostszą czynność — służącą przelewającą mleko — i potraktował ją z najwyższą uwagą techniczną (skrupulatne tekstury, dramatyczne światło, drogi ultramarynowy pigment na fartuchu). Holandia XVII wieku, protestancka, mieszczańska, postanowiła, że zwykłe życie jest godnym tematem sztuki, nie tylko mity i święci. Vermeer doprowadza to do skrajności: kompozycja jest niemal sakralna, jak ołtarzowa, ale temat — całkowicie świecki. To deklaracja, że godność człowieka pracy jest tematem na równi z biblijnymi.",
          explanation:
            "Klucz: kontekst kulturowy + decyzja artystyczna. Tani temat + drogie środki = świadomy gest.",
        },
        {
          type: "spot_error",
          text: "„Mleczarka i Dziewczyna z perłą to ten sam obraz Vermeera w różnych wersjach.\"",
          options: [
            "tak, to ten sam motyw",
            "nie — to dwa różne obrazy Vermeera, oba małe scenki rodzajowe, ale różne motywy i kompozycje",
            "Dziewczyna z perłą jest Rembrandta",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Klasyczna pułapka. Obie sceny to Vermeer, ale Mleczarka (1657–58, Rijksmuseum) to scena rodzajowa, a Dziewczyna z perłą (~1665, Mauritshuis) to tronie — popiersie postaci. Inne kompozycje.",
        },
      ],
      salon: {
        short:
          "U Vermeera fascynuje to, że bierze najprostszą czynność, służącą przelewającą mleko, i robi z tego niemal sakrament. Codzienność może być tematem sztuki, nie tylko mity i święci.",
        expand:
          "Mistrzowskie światło z lewej, skrupulatne tekstury (chleb, mleko, ściana z dziurkami), drogi ultramarynowy pigment na fartuchu. Vermeer prawdopodobnie używał camera obscura. Holandia protestancka XVII wieku odkryła, że zwykłe życie jest godnym tematem sztuki — Vermeer doprowadza to do mistrzostwa. Mały format (45×41 cm), wielka waga emocjonalna.",
        trap:
          "To NIE jest tylko „ładna scena kuchenna\" — to wypowiedź o świętości codzienności i godności pracy fizycznej. Nie mylić z Dziewczyną z perłą (też Vermeer, inny obraz). Nie redukować „Vermeer = camera obscura\" — narzędzie to nie geniusz.",
      },
      imageUrl: "/art/vermeer-mleczarka.jpg",
      imageCaption: "Johannes Vermeer, Mleczarka, ok. 1657–1658, Rijksmuseum, Amsterdam",
    },
  },

  // ============================================================
  // 45. Sztuka: Van Eyck — Portret Arnolfinich
  // ============================================================
  {
    slug: "art-van-eyck-arnolfini",
    vaultSlug: "art",
    label: "Sztuka — van Eyck, Portret Arnolfinich (1434)",
    payload: {
      title: "Van Eyck — Portret Arnolfinich",
      summary:
        "1434, renesans północny. Portret pary kupieckiej, w którym każdy szczegół niesie symbol — pies, pomarańcze, świeca, lustro. Pierwszy obraz, w którym malarz mówi „byłem tutaj\" — sygnaturą nad lustrem czyni z siebie świadka.",
      theory:
        "Olej na desce dębowej, dziś w National Gallery w Londynie. Jan van Eyck był nadwornym malarzem księcia Filipa Dobrego, jednym z pionierów malarstwa olejnego w Europie Północnej. Niderlandy w XV wieku to bogate, mieszczańskie centrum handlu.\n\nPortret pary: prawdopodobnie Giovanni di Nicolao Arnolfini (włoski kupiec w Brugii) i jego żona. Każdy element niesie symboliczne znaczenie:\n— Pies = wierność małżeńska.\n— Pomarańcze = bogactwo (importowane, drogie).\n— Jedna paląca się świeca = obecność Boga.\n— Zdjęte buty = sakralność miejsca.\n— Lustro z 10 scenami męki Pańskiej w ramie.\n\nNad lustrem podpis: „Johannes de Eyck fuit hic\" (Jan van Eyck był tutaj) — artysta jako świadek. W lustrze widać dwie postacie wchodzące do pomieszczenia (sam artysta + ktoś jeszcze). Nie wiadomo na 100%, czy to ślub, kontrakt małżeński czy portret pamiątkowy — historycy się spierają.\n\nKobieta nie jest w ciąży — taki krój sukni był wtedy modny. Realizm jest pozorny: każdy element ma znaczenie, nic nie jest przypadkowe.",
      questions: [
        {
          type: "abc",
          text: "Pies u stóp pary Arnolfinich symbolizuje:",
          options: [
            "bogactwo właścicieli",
            "wierność małżeńską",
            "dziedzictwo arystokratyczne",
          ],
          correctAnswer: 1,
          explanation:
            "Pies = wierność, klasyczny symbol małżeństwa. W obrazie van Eycka każdy element jest symbolem — pies pasuje do tematu sakralności związku.",
        },
        {
          type: "abc",
          text: "Sygnatura van Eycka nad lustrem brzmi:",
          options: [
            "Pinxit Johannes de Eyck",
            "Johannes de Eyck fuit hic",
            "Ex voto Johannes",
          ],
          correctAnswer: 1,
          explanation:
            "„Fuit hic\" = „był tutaj\". To pierwsze tak silne stwierdzenie artysty jako świadka sceny — niemal akt notarialny.",
        },
        {
          type: "fill",
          text: "Jedna paląca się świeca na żyrandolu symbolizuje obecność _____.",
          options: null,
          correctAnswer: "Boga",
          explanation:
            "Jedna świeca w pełnym świetle dnia = znak transcendencji. Świętość miejsca podkreślona też przez zdjęte buty.",
        },
        {
          type: "fill",
          text: "Bogactwo Arnolfinich sygnalizuje m.in. importowany owoc: _____ .",
          options: null,
          correctAnswer: "pomarańcze",
          explanation:
            "Pomarańcze w Brugii XV wieku to luksus — sprowadzane z południa, drogie. Sygnalizują status majątkowy.",
        },
        {
          type: "open",
          text: "Co fraza „Johannes de Eyck fuit hic\" zmienia w roli artysty?",
          options: null,
          correctAnswer:
            "Po raz pierwszy artysta staje się świadkiem sceny, nie tylko jej kreatorem. Sygnatura „był tutaj\" plus podwójne odbicie w lustrze (van Eyck + ktoś jeszcze wchodzący) czynią z malarza element samej sceny, niemal notariusza wydarzenia. To inny stosunek do roli niż w średniowieczu, gdzie artysta był rzemieślnikiem anonimowym. Tu artysta podpisuje się jako świadek i autoryzuje to, co widzimy. To radykalna zmiana w pojęciu autorstwa.",
          explanation:
            "Klucz: zmiana statusu artysty — od rzemieślnika do świadka i autora w nowoczesnym sensie.",
        },
        {
          type: "spot_error",
          text: "„Kobieta na obrazie jest wyraźnie w ciąży — to portret rodziny w oczekiwaniu na dziecko.\"",
          options: [
            "tak, ciąża jest oczywista",
            "nie — taki krój sukni był wtedy modny (powiększona partia brzucha), kobieta nie jest w ciąży",
            "to nie kobieta, tylko alegoria",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Klasyczne nieporozumienie współczesnych widzów. Krój sukni z fałdami zbieranymi pod biustem dawał taki kształt w modzie XV wieku. To nie ciąża.",
        },
      ],
      salon: {
        short:
          "Portret Arnolfinich wygląda jak fotografia z XV wieku, a tak naprawdę każdy szczegół jest symbolem. Pies = wierność, świeca = Bóg, pomarańcze = bogactwo, lustro = świadectwo.",
        expand:
          "Sygnatura „Johannes de Eyck fuit hic\" nad lustrem czyni z artysty świadka sceny — w lustrze widać sam van Eyck wchodzący do pomieszczenia. To pierwszy obraz, w którym malarz mówi: ja tu byłem, ja to widziałem. Pionierstwo techniki olejnej i symbolicznego realizmu Niderlandów XV wieku.",
        trap:
          "To NIE jest oczywista scena ślubna — historycy się spierają (ślub, kontrakt, portret pamiątkowy?). Realizm jest pozorny: każdy element ma znaczenie. Kobieta nie jest w ciąży — taki krój sukni był modny. Nie mylić van Eycka (XV w.) z Vermeerem (XVII w.) — 200 lat różnicy.",
      },
      imageUrl: "/art/van-eyck-arnolfini.jpg",
      imageCaption: "Jan van Eyck, Portret małżeństwa Arnolfinich, 1434, National Gallery, Londyn",
    },
  },

  // ============================================================
  // 46. Sztuka: Leonardo — Mona Lisa
  // ============================================================
  {
    slug: "art-leonardo-mona-lisa",
    vaultSlug: "art",
    label: "Sztuka — Leonardo, Mona Lisa (1503–19)",
    payload: {
      title: "Leonardo — Mona Lisa",
      summary:
        "1503–1519, renesans włoski. Olej na desce topolowej, mniejsza niż się wydaje (77×53 cm). Sfumato (przejścia bez ostrych granic, „jak dym\") + chyba pierwszy portret pokazujący człowieka MYŚLĄCEGO, nie tylko status czy podobiznę.",
      theory:
        "Leonardo malował ją przez 16 lat, nosił ze sobą do końca życia, do Francji, gdzie zmarł w 1519 na dworze Franciszka I. Dziś w Luwrze. Prawdopodobnie portret Lisy Gherardini, żony florenckiego kupca Francesca del Giocondo — stąd włoska nazwa „La Gioconda\".\n\nTechniczne i historyczne fakty:\n— Sfumato: technika rozmywania konturów, przejścia bez ostrych granic, „jak dym\".\n— Pejzaż za nią asymetryczny: dwa różne horyzonty po obu stronach.\n— Mniejsza niż wszyscy myślą (77×53 cm) — większość ludzi rozczarowuje się na żywo.\n— Skradziona z Luwru w 1911 roku przez Vincenza Peruggię (włoskiego pracownika muzeum) — to ta kradzież zrobiła z niej globalną ikonę.\n\nWcześniej była znana znawcom, ale nie była najbardziej sławnym obrazem świata — sława przyszła po kradzieży, mediach i kulturze masowej XX wieku. To NIE obraz nieukończony, tylko obraz wielokrotnie poprawiany. Nie ma „tajemniczego uśmiechu\" jako celowego efektu — to nasza projekcja XIX-wieczna (Walter Pater, romantyzm).\n\nPrawdziwa siła obrazu: chyba pierwszy portret pokazujący człowieka świadomego siebie. Nie pozę, nie status, tylko świadomość. Jeden z pierwszych portretów osoby prywatnej — nie władcy, świętego, mitu.",
      questions: [
        {
          type: "abc",
          text: "Sfumato Leonarda to:",
          options: [
            "technika złoceń",
            "rozmywanie konturów, przejścia bez ostrych granic — „jak dym\"",
            "perspektywa centralna",
          ],
          correctAnswer: 1,
          explanation:
            "„Sfumato\" pochodzi od „fumo\" (dym). Klucz techniki Leonarda — kontury rozpływają się, nie ma ostrych krawędzi, wszystko płynie. Twarz Mony Lisy to popis tej techniki.",
        },
        {
          type: "abc",
          text: "Globalna sława Mony Lisy przyszła głównie dzięki:",
          options: [
            "od początku była najbardziej sławnym obrazem świata",
            "kradzieży z Luwru w 1911 roku i kulturze masowej XX wieku",
            "promocji Napoleona",
          ],
          correctAnswer: 1,
          explanation:
            "Przed 1911 Mona Lisa była znana znawcom, nie była globalną ikoną. Kradzież + media + ruchy XX-wieczne (Duchamp, reklama, pop art) zrobiły z niej fenomen.",
        },
        {
          type: "fill",
          text: "Mona Lisa to portret _____ Gherardini, żony Francesca del Giocondo.",
          options: null,
          correctAnswer: "Lisy",
          explanation:
            "„La Gioconda\" = „pani Giocondo\". „Mona\" = skrót od „madonna\" (pani). „Lisa\" — imię własne.",
        },
        {
          type: "fill",
          text: "W którym muzeum wisi Mona Lisa?",
          options: null,
          correctAnswer: "Luwr",
          explanation:
            "Po śmierci Leonarda obraz został we Francji jako własność króla Franciszka I, potem trafił do królewskich kolekcji, po rewolucji do Luwru.",
        },
        {
          type: "open",
          text: "Co znaczy „pierwszy portret człowieka myślącego\" w przypadku Mony Lisy?",
          options: null,
          correctAnswer:
            "Wcześniejsze portrety pokazywały głównie status społeczny (władca, święty, kupiec) albo idealizowaną pozę. Mona Lisa nie pokazuje statusu (jest osobą prywatną, żoną kupca) ani pozy (jest spokojna, ale czujna). Pokazuje świadomość — wrażenie, że patrząca osoba MYŚLI, ma życie wewnętrzne, którego nie da się zredukować do podobizny. Sfumato wspiera to wrażenie — twarz nie ma ostrych konturów, jakby cały czas w ruchu, jak myśl. To nowy typ portretu — nie obiekt, tylko podmiot.",
          explanation:
            "Klucz: portret jako wgląd w psychikę, nie tylko jej dokumentacja zewnętrzna.",
        },
        {
          type: "spot_error",
          text: "„Mona Lisa jest gigantycznym obrazem — pełnowymiarowy portret na całe życie.\"",
          options: [
            "tak, jest ogromna",
            "nie — Mona Lisa jest mała (77×53 cm), większość turystów się rozczarowuje na żywo",
            "to fresk, nie obraz",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Klasyczne rozczarowanie w Luwrze. Obraz ma 77 cm wysokości, mniej niż wiele plakatów. Wielkość legendy jest większa niż samego obrazu.",
        },
      ],
      salon: {
        short:
          "Z Moną Lizą jest tak, że jej legenda jest większa niż sam obraz. Prawdziwa siła leży w tym, że to chyba pierwszy portret pokazujący człowieka myślącego — nie pozę, nie status, tylko świadomość.",
        expand:
          "Sfumato Leonarda jest genialne — kontury rozmyte, twarz „jak dym\". Pejzaż za nią asymetryczny, dwa horyzonty. Globalną gwiazdą zrobiła ją dopiero kradzież w 1911 i media XX wieku — wcześniej była znana znawcom, nie była najbardziej sławnym obrazem świata. Leonardo malował ją 16 lat i nosił ze sobą do Francji.",
        trap:
          "Nie ma „tajemniczego uśmiechu\" jako celowego efektu — to nasza projekcja XIX-wieczna (Walter Pater, romantyzm). To nie obraz nieukończony, tylko wielokrotnie poprawiany. Mniejsza niż się wydaje (77×53 cm) — większość ludzi się rozczarowuje na żywo.",
      },
      imageUrl: "/art/leonardo-mona-lisa.jpg",
      imageCaption: "Leonardo da Vinci, Mona Lisa, 1503–1519, Luwr, Paryż",
    },
  },

  // ============================================================
  // 47. Sztuka: Friedrich — Wędrowiec nad morzem mgły
  // ============================================================
  {
    slug: "art-friedrich-wedrowiec",
    vaultSlug: "art",
    label: "Sztuka — Friedrich, Wędrowiec nad morzem mgły (ok. 1818)",
    payload: {
      title: "Friedrich — Wędrowiec nad morzem mgły",
      summary:
        "Niemiecki romantyzm po wojnach napoleońskich. Mężczyzna w surducie stoi tyłem do widza, patrzy na morze mgły. Rückenfigur — postać od tyłu — to zaproszenie, żeby widz patrzył razem z nim, nie na niego. Pejzaż jako doświadczenie duchowe.",
      theory:
        "Olej na płótnie, Kunsthalle w Hamburgu. Friedrich malował po wojnach napoleońskich, w okresie kiedy Niemcy szukały tożsamości narodowej i duchowej. Romantyzm to reakcja na chłód oświeceniowego rozumu — powrót do uczucia, natury, jednostki.\n\nKluczowe pojęcia:\n— Rückenfigur (postać od tyłu) — charakterystyczny zabieg Friedricha. Widz patrzy razem z bohaterem, nie na niego.\n— Sublime / wzniosłość — filozoficzna koncepcja małości człowieka wobec nieskończoności (Burke, Kant).\n— „Inner eye\" — widzimy nie krajobraz fizyczny, tylko stan ducha bohatera.\n— Natura jako doświadczenie duchowe, niemal religijne (alternatywa wobec kościoła).\n\nFriedrich był protestantem, melancholikiem, miał trudne dzieciństwo (śmierć brata na jego oczach). Przez dekady traktowany jako „kicz nacjonalistyczny\", rehabilitowany dopiero w XX wieku. Nazistowska Rzesza przejęła go jako swojego, co potem skomplikowało jego odbiór — ale sam Friedrich nie ma z tym nic wspólnego.\n\nObraz nie jest „o przyrodzie\" — to obraz o człowieku w przyrodzie. Ostrożnie z interpretacją „władczego mężczyzny patrzącego z góry\" — to romantyczna kontemplacja, nie kolonialny gest.",
      questions: [
        {
          type: "abc",
          text: "Rückenfigur u Friedricha to:",
          options: [
            "alegoryczna postać z mitologii",
            "postać przedstawiona od tyłu, żeby widz patrzył razem z nią",
            "ukryty autoportret artysty",
          ],
          correctAnswer: 1,
          explanation:
            "Charakterystyczny zabieg romantyczny — widz nie patrzy NA bohatera, tylko Z bohaterem. Krajobraz to nie obiekt obserwacji, tylko współdoświadczenie.",
        },
        {
          type: "abc",
          text: "Pojęcie „sublime\" (wzniosłość) w romantyzmie oznacza:",
          options: [
            "perfekcja techniczna",
            "doświadczenie małości człowieka wobec nieskończoności",
            "harmonijne piękno greckie",
          ],
          correctAnswer: 1,
          explanation:
            "Burke i Kant rozwinęli pojęcie wzniosłości jako jakości innej niż piękno. Romantyzm robi z tego centralny temat — góra, morze mgły, nieskończony horyzont.",
        },
        {
          type: "fill",
          text: "Obraz powstał po wojnach _____ , w okresie szukania niemieckiej tożsamości.",
          options: null,
          correctAnswer: "napoleońskich",
          explanation:
            "Po klęsce Napoleona Niemcy zostały politycznie podzielone, ale kulturalnie szukały wspólnej tożsamości. Friedrich jest częścią tej fali.",
        },
        {
          type: "fill",
          text: "Friedrich był wyznania _____ (denominacja chrześcijańska).",
          options: null,
          correctAnswer: "protestanckiego",
          explanation:
            "Protestantyzm północnoniemiecki + melancholia + zainteresowanie naturą jako objawieniem — typowy zestaw dla niego.",
        },
        {
          type: "open",
          text: "Dlaczego to nie jest obraz „o przyrodzie\"?",
          options: null,
          correctAnswer:
            "To obraz o człowieku w przyrodzie, nie o samej przyrodzie. Bohater (Rückenfigur) jest centrum kompozycji, krajobraz jest jego doświadczeniem, nie przedmiotem. Friedrich nie maluje gór jako geograf — maluje stan ducha człowieka patrzącego na góry. Cała tradycja romantyczna polegała na tym, że pejzaż przestał być tłem albo dekoracją, a stał się sposobem mówienia o wnętrzu człowieka. „Inner eye\" — widzimy nie krajobraz fizyczny, tylko stan duchowy bohatera.",
          explanation:
            "Klucz: pejzaż jako lustro duszy, nie geografia. To centralne dla romantycznej rewolucji w malarstwie.",
        },
        {
          type: "spot_error",
          text: "„Wędrowiec patrzy z góry z gestem władcy nad krajobrazem — to imperialistyczna alegoria.\"",
          options: [
            "tak, to jest gest kolonialny",
            "to romantyczna kontemplacja, nie kolonialny gest — bohater nie posiada krajobrazu, on go doświadcza",
            "to nie jest obraz Friedricha",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Współczesna anachroniczna interpretacja. Friedrich maluje doświadczenie wzniosłości, nie zawłaszczenia. Bohater jest mały na tle nieskończoności mgły — to nie jest gest władzy, tylko medytacja.",
        },
      ],
      salon: {
        short:
          "Friedrich pokazuje człowieka tyłem nieprzypadkowo. Mamy patrzeć RAZEM z nim, nie na niego. Pejzaż nie jest tłem, jest doświadczeniem duchowym. To sedno romantyzmu.",
        expand:
          "Po wojnach napoleońskich Niemcy szukali sensu poza kościołem i rozumem. Znaleźli go we mgle nad górami. Rückenfigur, sublime, „inner eye\" — to słownictwo romantyczne, którym Friedrich operuje mistrzowsko. Mały bohater w nieskończonej mgle = małość człowieka wobec nieskończoności. Ale nie lęk, tylko spokój.",
        trap:
          "To NIE obraz o przyrodzie — to obraz o człowieku w przyrodzie. Ostrożnie z odczytaniem „władczego mężczyzny patrzącego z góry\" — to romantyczna kontemplacja, nie gest kolonialny. Friedrich był protestanckim melancholikiem, nie nacjonalistą — nazistowska Rzesza przejęła go później, ale on sam nie ma z tym nic wspólnego.",
      },
      imageUrl: "/art/friedrich-wedrowiec.jpg",
      imageCaption: "Caspar David Friedrich, Wędrowiec nad morzem mgły, ok. 1818, Kunsthalle, Hamburg",
    },
  },

  // ============================================================
  // 48. Sztuka: Van Gogh — Jedzący ziemniaki
  // ============================================================
  {
    slug: "art-van-gogh-jedzacy-ziemniaki",
    vaultSlug: "art",
    label: "Sztuka — Van Gogh, Jedzący ziemniaki (1885)",
    payload: {
      title: "Van Gogh — Jedzący ziemniaki",
      summary:
        "1885, Nuenen w Holandii. Wczesny van Gogh, ciemna paleta — przed Paryżem, przed słonecznikami. Chłopska rodzina przy kolacji z ziemniaków. Celowo brzydcy, celowo ciężcy — to świadoma moralna decyzja, nie błąd techniczny.",
      theory:
        "Van Gogh miał wtedy 32 lata, dopiero zaczynał poważnie malować. Olej na płótnie, Van Gogh Museum w Amsterdamie. Uważał ten obraz za swoje pierwsze ważne dzieło.\n\nNajważniejsze fakty:\n— Chłopska rodzina przy kolacji złożonej z ziemniaków, oświetlona surową lampą oliwną.\n— Van Gogh chciał pokazać „ręce, które jadły ziemniaki, tego samego dnia zrywały je z ziemi\" — moralna intencja.\n— Inspiracja: Jean-François Millet i francuski realizm społeczny (Siewca, Anioł Pański).\n— Twarze niemal karykaturalne, celowo brzydkie, nie upiększone — to świadoma decyzja.\n— Listy do brata Theo: van Gogh tłumaczył, dlaczego nie chciał ich pokazać „ładnymi\".\n— Cała seria szkiców głów chłopskich poprzedzała ostateczny obraz.\n\nObraz źle przyjęty przez krytyków i przyjaciół. Anthon van Rappard napisał ostry list — van Gogh zerwał z nim przyjaźń.\n\nKulturowe znaczenie: zwykli ludzie zasługują na portret, nie tylko bogaci czy święci. Prawda emocjonalna ważniejsza niż piękno akademickie. Sztuka może być moralna i społeczna, nie tylko estetyczna. Na tym etapie życia van Gogh był głęboko zaangażowanym społecznie człowiekiem, byłym ewangelizatorem wśród górników belgijskich w Borinage.",
      questions: [
        {
          type: "abc",
          text: "Twarze chłopów są na obrazie celowo:",
          options: [
            "wyidealizowane",
            "ciężkie, niemal karykaturalne — świadoma decyzja moralna",
            "abstrakcyjne i geometryczne",
          ],
          correctAnswer: 1,
          explanation:
            "Van Gogh w listach do Theo tłumaczył, że nie chciał pokazać chłopów „ładnymi\". Nieupiększenie to świadoma decyzja, nie brak umiejętności.",
        },
        {
          type: "abc",
          text: "Główna inspiracja Jedzących ziemniaki to:",
          options: [
            "japońskie drzeworyty",
            "Jean-François Millet i francuski realizm społeczny",
            "barokowe martwe natury",
          ],
          correctAnswer: 1,
          explanation:
            "Van Gogh uwielbiał Milleta (Siewcę, Anioł Pański). Realizm społeczny — godność ciężkiej pracy chłopskiej — to bezpośredni wpływ.",
        },
        {
          type: "fill",
          text: "Obraz powstał w holenderskiej wiosce _____ .",
          options: null,
          correctAnswer: "Nuenen",
          explanation:
            "Wczesna faza, „ciemna paleta\". Później van Gogh wyjechał do Paryża, potem do Arles — i kolory eksplodowały.",
        },
        {
          type: "fill",
          text: "„Ręce, które jadły ziemniaki, tego samego dnia _____ je z ziemi.\"",
          options: null,
          correctAnswer: "zrywały",
          explanation:
            "Cytat z listów van Gogha do Theo. Esencja jego moralnej intencji: pokazać godność pracy fizycznej.",
        },
        {
          type: "open",
          text: "Czemu Jedzący ziemniaki nie są „brzydkim van Goghem\"?",
          options: null,
          correctAnswer:
            "Nieupiększenie chłopów to świadoma artystyczna i moralna decyzja, nie brak umiejętności. Van Gogh chciał pokazać prawdę o ich życiu — ciężkie ręce, zmęczone twarze, surowe światło lampy. Inspirowany Milletem i realizmem społecznym, świadomie zerwał z akademickim ideałem piękna. Sam tłumaczył w listach do Theo, że nie chciał ich pokazać „ładnymi\", bo to byłoby ich kłamliwe odzobrazowanie. To wczesny etap (1885), przed Paryżem i Arles — ciemna paleta, ale techniczna decyzja świadoma.",
          explanation:
            "Klucz: brzydota tutaj jest narzędziem prawdy, nie defektem. To deklaracja moralna o godności pracy.",
        },
        {
          type: "spot_error",
          text: "„Jedzący ziemniaki to typowy van Gogh z eksplodującymi żółciami i błękitami z okresu Arles.\"",
          options: [
            "tak, to klasyczny van Gogh\",",
            "nie — to wczesny van Gogh z 1885, ciemna paleta. Arles (1888) i słoneczniki dopiero później, po Paryżu",
            "obraz nie istnieje",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Klasyczne pomieszanie. „Słonecznikowy\" van Gogh to lata 1887–90. Jedzący ziemniaki to 1885, ciemna paleta, jeszcze przed wyjazdem do Paryża, gdzie van Gogh poznał impresjonistów.",
        },
      ],
      salon: {
        short:
          "Wcześniejszy van Gogh jest ważniejszy niż się zakłada. Jedzący ziemniaki są celowo ciężcy i nieupiększeni — to moralna decyzja, nie błąd techniczny.",
        expand:
          "Chciał pokazać, że ręce, które jedzą ziemniaki, to te same ręce, które je wyrywały z ziemi. Inspiracja: Millet i francuski realizm społeczny. Listy do Theo tłumaczą, czemu nie chciał ich „ładnymi\". Cała seria szkiców głów chłopskich poprzedzała ten obraz. To długo zanim namalował słoneczniki.",
        trap:
          "To NIE jest „brzydki van Gogh\" — świadoma decyzja artystyczna. To NIE jest jeszcze ten van Gogh od słoneczników — dopiero później w Arles. Nie redukować go do „szaleńca\" — na tym etapie życia był głęboko zaangażowanym społecznie człowiekiem, byłym ewangelizatorem wśród górników.",
      },
      imageUrl: "/art/van-gogh-jedzacy-ziemniaki.jpg",
      imageCaption: "Vincent van Gogh, Jedzący ziemniaki, 1885, Van Gogh Museum, Amsterdam",
    },
  },

  // ============================================================
  // 49. Sztuka: Van Gogh — Gwiaździsta noc
  // ============================================================
  {
    slug: "art-van-gogh-gwiezdzista-noc",
    vaultSlug: "art",
    label: "Sztuka — Van Gogh, Gwiaździsta noc (1889)",
    payload: {
      title: "Van Gogh — Gwiaździsta noc",
      summary:
        "Czerwiec 1889, sanatorium Saint-Paul-de-Mausole w Saint-Rémy-de-Provence. Spirale na niebie nie są chaosem szaleńca — to kontrolowana geometria, obraz świadomego widzenia świata jako energii. Van Gogh NIE namalował tego w ataku.",
      theory:
        "Olej na płótnie, dziś w MoMA w Nowym Jorku. Van Gogh był w sanatorium po załamaniu nerwowym i odcięciu sobie ucha w Arles (grudzień 1888). Zmarł rok później, w lipcu 1890.\n\nFakty kluczowe:\n— Widok z okna sanatorium na wioskę i Alpilles — ale wieś z kościołem i smukłą wieżą została DODANA (nie było jej w Saint-Rémy).\n— Spirale na niebie częściowo astronomicznie realne (Wenus, gwiazdy).\n— Cyprys na pierwszym planie — symbol śmierci i wieczności w kulturze śródziemnomorskiej.\n— Gruba farba (impasto), widoczne pociągnięcia pędzla jako bezpośrednia emocja.\n— Inspiracja: japońskie drzeworyty (Hokusai, Wielka fala).\n— Listy do Theo: „potrzeba religii sprawia, że wychodzę nocą malować gwiazdy\".\n\nVan Gogh NIE namalował tego w ataku — był w okresie remisji, świadomie pracował. Za życia sprzedał kilka obrazów, sławę zyskał pośmiertnie dzięki bratowej Jo Bonger-van Gogh, która zachowała listy i obrazy. „Szalony van Gogh\" to romantyczny mit XX wieku, sprzedający się dobrze.\n\nKulturowe znaczenie: malować to, co się czuje, nie to, co się widzi. Chaos może stać się formą — spirale są uporządkowane, nie panika. To kontrolowana ekstaza, nie atak.",
      questions: [
        {
          type: "abc",
          text: "Gwiaździsta noc powstała w sytuacji:",
          options: [
            "ataku psychotycznego — van Gogh malował w napadzie",
            "okresie remisji w sanatorium — świadoma, kontrolowana praca",
            "ostatniego dnia życia",
          ],
          correctAnswer: 1,
          explanation:
            "Mit „szalonego van Gogha\" malującego w napadzie jest XX-wiecznym romantyzmem. Faktycznie obraz powstał w spokojnym okresie — w sanatorium, ale świadomie.",
        },
        {
          type: "abc",
          text: "Wieś z kościołem na obrazie:",
          options: [
            "była rzeczywiście za oknem sanatorium",
            "została dodana przez van Gogha — w Saint-Rémy jej nie było",
            "to widok Arles",
          ],
          correctAnswer: 1,
          explanation:
            "Van Gogh nie kopiował widoku. Wieś + wieża kościelna to dodanie kompozycyjne, prawdopodobnie wspomnienie holenderskiego pejzażu z dzieciństwa.",
        },
        {
          type: "fill",
          text: "Cyprys na pierwszym planie to w kulturze śródziemnomorskiej symbol _____.",
          options: null,
          correctAnswer: "śmierci",
          explanation:
            "Cyprysy sadzono na cmentarzach. Symbol śmierci i wieczności. Van Gogh malował je obsesyjnie w ostatnich miesiącach życia.",
        },
        {
          type: "fill",
          text: "Obraz wisi dziś w muzeum _____ w Nowym Jorku (skrót).",
          options: null,
          correctAnswer: "MoMA",
          explanation:
            "Museum of Modern Art. Jeden z najbardziej znanych obrazów ich kolekcji.",
        },
        {
          type: "open",
          text: "Dlaczego spirale Gwiaździstej nocy nie są chaosem szaleńca?",
          options: null,
          correctAnswer:
            "Są geometryczne, uporządkowane, rytmiczne — nie panika, nie atak. Van Gogh był w okresie remisji, świadomie pracował nad kompozycją, inspirując się japońskimi drzeworytami i obserwacjami astronomicznymi (Wenus, układ gwiazd). Listy do brata Theo pokazują artystę w pełni świadomego, planującego: „potrzeba religii sprawia, że wychodzę nocą malować gwiazdy\". Mit „szalonego van Gogha malującego w napadzie\" to romantyczna konstrukcja XX wieku — fakty mówią o kontrolowanej ekstazie, świadomym widzeniu świata jako energii.",
          explanation:
            "Klucz: forma + biografia + listy. Wszystkie trzy źródła obalają mit ataku.",
        },
        {
          type: "spot_error",
          text: "„Gwiaździsta noc to ostatni obraz van Gogha — namalował go w dzień śmierci.\"",
          options: [
            "tak, to ostatni",
            "nie — powstał w czerwcu 1889, van Gogh zmarł rok później (lipiec 1890), namalował setki innych obrazów po Gwiaździstej nocy",
            "namalował go w Arles",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Klasyczna pomyłka. Gwiaździsta noc to czerwiec 1889. Van Gogh żył jeszcze rok i namalował m.in. Krukowie nad polem pszenicy, Pole pszenicy z kosiarzem, wiele autoportretów.",
        },
      ],
      salon: {
        short:
          "Gwiaździsta noc to nie obraz szaleństwa, mimo że van Gogh był w sanatorium. To kontrolowana ekstaza — spirale są geometryczne, nie chaotyczne. Świadome widzenie świata jako energii.",
        expand:
          "Powstał w okresie remisji, czerwiec 1889. Listy do Theo pokazują artystę w pełni świadomego: „potrzeba religii każe mi wychodzić nocą i malować gwiazdy\". Inspiracje: Hokusai, astronomia, holenderskie wspomnienia. Wieś z kościołem została dodana — nie było jej za oknem. Cyprys jako symbol śmierci. Gruba farba (impasto) jako bezpośrednia emocja.",
        trap:
          "Van Gogh NIE namalował tego w ataku szaleństwa — był w okresie remisji. „Szalony van Gogh\" to romantyczny mit XX wieku. To nie ostatni jego obraz — żył jeszcze rok. Sprzedał za życia raczej kilka obrazów, nie „jeden\" — to popularny, nieprecyzyjny mit.",
      },
      imageUrl: "/art/van-gogh-gwiezdzista-noc.jpg",
      imageCaption: "Vincent van Gogh, Gwiaździsta noc, 1889, MoMA, Nowy Jork",
    },
  },

  // ============================================================
  // 50. Sztuka: Monet — Nenufary
  // ============================================================
  {
    slug: "art-monet-nenufary",
    vaultSlug: "art",
    label: "Sztuka — Monet, Nenufary (1914–26)",
    payload: {
      title: "Monet — Nenufary",
      summary:
        "Cykl monumentalnych płócien (8 paneli, każdy ok. 2 m wysokości) z lat 1914–1926, zaprojektowany dla dwóch owalnych sal Musée de l'Orangerie. Powstają w czasie I wojny światowej. Monet ofiarował obrazy Francji dzień po podpisaniu rozejmu — to pomnik pokoju, nie ładny kwiatek.",
      theory:
        "Ostatnie 12 lat życia Moneta w Giverny, jego ogrodzie pod Paryżem. Łącznie około 250 prac Moneta na temat nenufarów w różnych formatach. Monet zmarł w 1926, ekspozycja Orangerie otwarta w 1927.\n\nIstotne fakty:\n— Orangerie: dwie owalne sale, panoramiczne, immersyjne — widz wchodzi w obraz.\n— Monet ofiarował obrazy Francji w dniu po podpisaniu rozejmu (11 listopada 1918) — traktował to jako pomnik pokoju i pamięć o wojnie.\n— Pogarszający się wzrok (zaćma) — operowany w 1923 roku.\n— Brak horyzontu w obrazach — widz nie wie, gdzie góra, gdzie dół, jest zanurzony.\n— Kolory nie mieszane na palecie, kładzione obok siebie — oko widza miesza je z dystansu.\n— Współpracował z architektem przy projektowaniu sal Orangerie.\n\nPrzez dekady niedoceniane jako „ładne lilie\", dopiero amerykański ekspresjonizm abstrakcyjny (Rothko, Pollock) „odkrył\" Moneta na nowo w latach 50. — zobaczyli w nich prekursora abstrakcji.\n\nPóźny Monet jest radykalny, niemal abstrakcyjny, nie tylko ładny. Piękno jako odpowiedź na cierpienie (wojnę). Monet zaprojektował przestrzeń, nie tylko obrazy — to immersyjne doświadczenie, niemal kaplica.",
      questions: [
        {
          type: "abc",
          text: "Monet ofiarował Nenufary Francji:",
          options: [
            "na 100-lecie rewolucji francuskiej",
            "dzień po podpisaniu rozejmu kończącego I wojnę światową (11.11.1918)",
            "jako prezent prywatny dla Clemenceau",
          ],
          correctAnswer: 1,
          explanation:
            "Daty mają znaczenie. To gest polityczny i emocjonalny: pomnik pokoju, pamięć o wojnie, dar narodowi po katastrofie.",
        },
        {
          type: "abc",
          text: "Specyfika sal Orangerie:",
          options: [
            "klasyczne prostokątne galerie",
            "dwie owalne sale, immersyjne — widz wchodzi w obraz",
            "freski na suficie",
          ],
          correctAnswer: 1,
          explanation:
            "Monet projektował to z architektem. Owalna sala + brak horyzontu w obrazach = widz zanurzony, niemal jak w kaplicy.",
        },
        {
          type: "fill",
          text: "Ogród Moneta znajduje się w miejscowości _____ pod Paryżem.",
          options: null,
          correctAnswer: "Giverny",
          explanation:
            "Giverny — miejsce ostatnich dekad życia Moneta, jego prywatny ogród z japońskim mostkiem, sadzawkami i nenufarami.",
        },
        {
          type: "fill",
          text: "Pod koniec życia Monet zmagał się z chorobą oczu — _____ .",
          options: null,
          correctAnswer: "zaćmą",
          explanation:
            "Operacja w 1923. Zaćma wpłynęła na percepcję kolorów — niektórzy widzą w późnych Nenufarach jej ślad, ale Monet pracował świadomie pomimo.",
        },
        {
          type: "open",
          text: "Czemu Nenufary nie są „ładnymi liliami\"?",
          options: null,
          correctAnswer:
            "Cykl powstawał w trakcie i po I wojnie światowej. Monet ofiarował obrazy Francji dzień po podpisaniu rozejmu — traktował je jako pomnik pokoju i pamięć o katastrofie. Orangerie to nie galeria, to kaplica — owalne sale, brak horyzontu w obrazach, widz zanurzony. Późny Monet jest radykalny, niemal abstrakcyjny — amerykański ekspresjonizm abstrakcyjny lat 50. (Rothko, Pollock) zobaczył w nich prekursora. To kontemplacja po katastrofie, nie dekoracja salonu. Dzisiejsze magnesy i kubki z nenufarami to zafałszowanie kontekstu.",
          explanation:
            "Klucz: kontekst historyczny + zamiar artysty + radykalność formy. Trzy warstwy, których nie widać w reprodukcjach.",
        },
        {
          type: "spot_error",
          text: "„Monet to klasyczny impresjonista — Nenufary to typowy plener z lat 70. XIX wieku.\"",
          options: [
            "tak, klasyczny plener",
            "nie — Nenufary to 1914–26, późny Monet (po 75. roku życia), radykalny, niemal abstrakcyjny — inny świat niż wczesny impresjonizm",
            "Monet nie malował nenufarów",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Wczesny Monet (Impresja wschód słońca, 1872, Most kolejowy w Argenteuil) to lata 70. XIX wieku. Późny Monet (Nenufary, 1914–26) to inny artysta — bez horyzontu, bez kompozycji klasycznej, prekursor abstrakcji.",
        },
      ],
      salon: {
        short:
          "Z Nenufarami jest cały żart, że dziś wiszą na kubkach i magnesach jako synonim ładności. A to są obrazy wojenne — ofiarowane Francji dzień po rozejmie w 1918.",
        expand:
          "Cykl 8 paneli, każdy ok. 2 m wysokości, zaprojektowany dla dwóch owalnych sal Orangerie. Brak horyzontu, kolory niemieszane na palecie. Późny Monet jest radykalny, niemal abstrakcyjny — Rothko i Pollock w latach 50. odkryli go jako prekursora. Orangerie to nie galeria do przejścia, to kaplica niemal — trzeba usiąść i być.",
        trap:
          "To NIE „ładne lilie\" do salonu, choć dziś wiszą na kubkach. Choroba oczu (zaćma) wpłynęła, ale nie redukować dzieła do tego — to świadoma decyzja artystyczna. Nie mylić impresjonizmu wczesnego Moneta (lata 70–80 XIX w.) z późnym Monetem — to różne światy.",
      },
      imageUrl: "/art/monet-nenufary.jpg",
      imageCaption: "Claude Monet, Refleksje chmur na sadzawce lilii wodnych (z cyklu Nenufary), 1920, Orangerie",
    },
  },

  // ============================================================
  // 51. Sztuka: Manet — Śniadanie na trawie
  // ============================================================
  {
    slug: "art-manet-sniadanie-na-trawie",
    vaultSlug: "art",
    label: "Sztuka — Manet, Śniadanie na trawie (1863)",
    payload: {
      title: "Manet — Śniadanie na trawie",
      summary:
        "1863, Paryż. Skandal otworzył drogę nowoczesności. Dwóch ubranych mężczyzn i naga kobieta na pikniku. Skandal NIE wynikał z nagości samej w sobie (nagość była OK w mitologii) — wynikał z kontekstu: codzienność zamiast mitu.",
      theory:
        "Édouard Manet — ojciec nowoczesności w malarstwie, choć sam tego określenia nie znosił. Olej na płótnie, dziś w Musée d'Orsay w Paryżu. Drugie Cesarstwo, Paryż Haussmanna, sztuka oficjalna kontrolowana przez paryski Salon i Akademię.\n\nKluczowe fakty:\n— Dwóch ubranych mężczyzn w surdutach i naga kobieta siedzą na pikniku.\n— Druga kobieta w głębi, niemal nadnaturalnie duża — świadomie błędna perspektywa.\n— Modelka: Victorine Meurent (która sama była malarką, choć przez lata sprowadzana tylko do roli „muzy\").\n— Odrzucony przez oficjalny Salon, pokazany na Salon des Refusés zorganizowanym przez Napoleona III.\n— Inspiracja: kompozycja zapożyczona z renesansowej ryciny Marcantonia Raimondiego po obrazie Rafaela.\n— Widoczne, szybkie pociągnięcia pędzla, brak gładkiego „akademickiego\" wykończenia — manifest.\n\nSkandal nie wynikał z nagości jako takiej — Wenus mogła być naga, Diana mogła. Wynikał z tego, że paryżanka w 1863 roku, na pikniku, w towarzystwie ubranych mężczyzn, jest naga. Codzienność uderzyła w konwencje mitu.\n\nKulturowe znaczenie: moment narodzin awangardy — sztuka przestaje udawać i zaczyna pytać. Współczesność jako uprawniony temat sztuki. Skandal jako narzędzie artystyczne, świadomie użyte.",
      questions: [
        {
          type: "abc",
          text: "Skandal Śniadania na trawie wynikał z:",
          options: [
            "nagości samej w sobie",
            "kontekstu — naga współczesna paryżanka obok ubranych mężczyzn na pikniku",
            "tematu mitologicznego",
          ],
          correctAnswer: 1,
          explanation:
            "Wenus mogła być naga, Diana mogła. Paryżanka w 1863 — nie. To kontekst, nie nagość per se, otworzył drogę nowoczesności.",
        },
        {
          type: "abc",
          text: "Salon des Refusés to:",
          options: [
            "alternatywna galeria dla awangardy, zorganizowana przez Napoleona III dla odrzuconych z oficjalnego Salonu",
            "spotkanie krytyków w Café Guerbois",
            "prywatna galeria Maneta",
          ],
          correctAnswer: 0,
          explanation:
            "Po fali odrzuceń z oficjalnego Salonu Napoleon III zorganizował alternatywę — żeby pokazać publiczności, „co odrzucamy\". Manet, Whistler, inni — wszyscy tam byli.",
        },
        {
          type: "fill",
          text: "Modelka na obrazie to malarka i muza Maneta — _____ Meurent.",
          options: null,
          correctAnswer: "Victorine",
          explanation:
            "Victorine Meurent — sama była malarką, przez lata redukowana w historii sztuki do roli muzy. Pojawia się też w Olimpii (1863).",
        },
        {
          type: "fill",
          text: "Manet zainspirował kompozycję ryciną renesansowego artysty — _____ Raimondiego.",
          options: null,
          correctAnswer: "Marcantonia",
          explanation:
            "Marcantonio Raimondi, rycina po Rafaelowskiej kompozycji. Manet świadomie cytuje renesans, żeby zderzyć go z paryską codziennością.",
        },
        {
          type: "open",
          text: "Wytłumacz, czemu Śniadanie na trawie to „moment narodzin awangardy\".",
          options: null,
          correctAnswer:
            "Manet zderza klasyczną kompozycję renesansową (cytat z Raimondiego po Rafaelu) ze współczesnością paryską (1863 rok, surduty, modelka Meurent). To zderzenie mitu z codziennością otwiera pytanie: jeśli sztuka może rezygnować z mitologicznych pretekstów i pokazywać współczesność, to czym jest sztuka? Plus widoczne pociągnięcia pędzla, brak akademickiego wykończenia, świadomie błędna perspektywa (druga kobieta zbyt duża) — wszystko to jest manifest, że konwencja nie jest święta. To otwarcie drogi dla impresjonistów, potem postimpresjonistów, kubistów, całej sztuki XX wieku.",
          explanation:
            "Klucz: cytat z tradycji + zderzenie ze współczesnością + manifestacyjne odrzucenie konwencji = sztuka jako pytanie, nie jak ozdoba.",
        },
        {
          type: "spot_error",
          text: "„Manet był impresjonistą — Śniadanie na trawie to klasyczny impresjonizm.\"",
          options: [
            "tak, klasyczny impresjonizm",
            "nie — Manet to PRE-impresjonizm, ojciec ruchu, ale sam nie wystawiał z impresjonistami. Śniadanie (1863) jest przed pierwszą wystawą impresjonistów (1874)",
            "Manet nie istniał",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Manet to ojciec impresjonistów, ale sam wolał oficjalny Salon. Jego prace inspirowały Moneta, Renoira, Degasa, ale on sam nigdy nie był na ich wystawach. Manet ≠ Monet (klasyczne pomieszanie).",
        },
      ],
      salon: {
        short:
          "Manet wywołał skandal nie nagością, tylko kontekstem. Wenus może być naga. Paryżanka na pikniku w Lasku Bulońskim — nie. To zderzenie mitu z codziennością otworzyło drogę nowoczesności.",
        expand:
          "Inspiracja: rycina Raimondiego po Rafaelu — Manet świadomie cytuje renesans. Modelka: Victorine Meurent, sama malarka, przez lata redukowana do roli „muzy\". Salon des Refusés organizowany przez Napoleona III — Manet, Whistler, inni odrzuceni. Widoczne pociągnięcia pędzla, świadomie błędna perspektywa, brak akademickiego wykończenia. Można powiedzieć, że cała sztuka XX wieku zaczęła się od tego niezręcznego pikniku.",
        trap:
          "Skandal NIE wynikał z nagości samej w sobie — nagość była OK w mitologii. Wynikał z kontekstu (codzienność zamiast mitu). To NIE jeszcze impresjonizm — Manet to PRE-impresjonizm. Victorine Meurent była sama malarką — niesprawiedliwie redukowana do „tylko modelki\". Nie mylić ze „Śniadaniem nad wodą\" Moneta (zupełnie inny obraz).",
      },
      imageUrl: "/art/manet-sniadanie-na-trawie.jpg",
      imageCaption: "Édouard Manet, Śniadanie na trawie, 1863, Musée d'Orsay, Paryż",
    },
  },

  // ============================================================
  // 52. Sztuka: Seurat — Grande Jatte
  // ============================================================
  {
    slug: "art-seurat-grande-jatte",
    vaultSlug: "art",
    label: "Sztuka — Seurat, Grande Jatte (1884–86)",
    payload: {
      title: "Seurat — Niedzielne popołudnie na wyspie La Grande Jatte",
      summary:
        "1884–1886, schyłek belle époque. Ogromny format (~2×3 m). Pointylizm — naukowa reakcja na „rozmyte\" plenery impresjonistów. Ludzie celowo sztywni jak figury egipskie, chłód jako świadoma artystyczna wypowiedź.",
      theory:
        "Olej na płótnie, dziś w Art Institute of Chicago. Georges Seurat zmarł młodo, w wieku 31 lat — cały jego dorobek powstał w ciągu ok. 10 lat. Założył kierunek pointylizmu (neo-impresjonizmu).\n\nTechniczne i kulturowe fakty:\n— Pointylizm: malowanie milionami drobnych punktów czystego, niemieszanego koloru.\n— Oko widza miesza kolory optycznie (np. żółty + niebieski punkt = zielony widziany z dystansu).\n— Seurat oparł się na naukowych teoriach koloru: Michel Eugène Chevreul, Ogden Rood.\n— 2 lata pracy, ponad 60 szkiców przygotowawczych — skrajne przeciwieństwo szybkich plenerów impresjonistów.\n— Ludzie celowo sztywni, niemal jak figury egipskie — „frozen moment\".\n— Różne klasy społeczne na jednym obrazie: robotnicy, mieszczanie, prawdopodobnie kobiety lekkich obyczajów (małpka na smyczy była ich symbolem).\n\nSeurat zmarł nagle w 1891, ruch szybko stracił impet. Kontynuował Paul Signac, ale to już nie była ta sama szkoła. Pointylizm wpłynął jednak na późnego van Gogha, fauwistów, Mondriana.\n\nKulturowe znaczenie: nauka i sztuka mogą się spotkać (teoria koloru, percepcja, optyka). Chłód i porządek mogą być wyborem artystycznym, nie brakiem emocji. Perfekcja konstrukcji może odebrać życie — i to też jest świadoma wypowiedź.",
      questions: [
        {
          type: "abc",
          text: "Pointylizm to:",
          options: [
            "malowanie kropkami losowo, jako reakcja na akademizm",
            "system optyczny — drobne punkty czystego koloru, mieszane optycznie przez oko widza",
            "technika japońska",
          ],
          correctAnswer: 1,
          explanation:
            "Pointylizm NIE jest „kropkami losowo\". To naukowy system — Seurat opierał się na teoriach koloru Chevreula i Rooda.",
        },
        {
          type: "abc",
          text: "Postacie na Grande Jatte są:",
          options: [
            "spontaniczne, w ruchu",
            "celowo sztywne, niemal jak figury egipskie — zamrożony rytuał mieszczański",
            "zniekształcone surrealistycznie",
          ],
          correctAnswer: 1,
          explanation:
            "Sztywność jest świadoma. Seurat chciał chłodu i porządku, „zamrożonego momentu\" — kontrast wobec spontanicznych impresjonistów.",
        },
        {
          type: "fill",
          text: "Seurat oparł się na teoriach koloru chemika francuskiego — Michel Eugène _____ .",
          options: null,
          correctAnswer: "Chevreul",
          explanation:
            "Chevreul badał kontrasty kolorów. Seurat aplikował te zasady jako artysta — np. że oko miesza kolory położone obok siebie.",
        },
        {
          type: "fill",
          text: "Wyspa La Grande Jatte leży na rzece _____ pod Paryżem.",
          options: null,
          correctAnswer: "Sekwanie",
          explanation:
            "Wyspa na Sekwanie, popularne miejsce niedzielnych spacerów paryżan w XIX wieku. Dziś nadal istnieje.",
        },
        {
          type: "open",
          text: "Czemu chłód postaci na Grande Jatte to świadoma decyzja, nie błąd?",
          options: null,
          correctAnswer:
            "Seurat chciał zracjonalizować impresjonizm. Impresjoniści malowali wrażenie chwili, on chciał zamrozić wrażenie i przeanalizować je naukowo. Sztywność postaci — niemal jak figurki egipskie — to manifestacja: nie spontaniczność, tylko konstrukcja. Sztuka oparta na nauce, nie na natchnieniu. Ponad 60 szkiców przygotowawczych poprzedzało ostateczny obraz — to przeciwieństwo szybkich plenerów. Zamrożony rytuał mieszczański XIX-wiecznego Paryża jest też socjologicznym komentarzem — pokazuje społeczeństwo jako sztywne, klasowo zorganizowane, niemal teatralne.",
          explanation:
            "Klucz: chłód jako wybór, nie brak emocji. Seurat chciał sztuki obiektywnej, systematycznej, naukowej.",
        },
        {
          type: "spot_error",
          text: "„Pointylizm to po prostu drobny impresjonizm — Seurat malował to samo co Monet, tylko mniejszymi pociągnięciami pędzla.\"",
          options: [
            "tak, to ten sam ruch",
            "nie — pointylizm (neo-impresjonizm) jest świadomą reakcją na impresjonizm, oparty na nauce, z chłodem i sztywnością przeciwną do spontanicznego pleneru",
            "Seurat nie był pointylistą",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Pointylizm = NEO-impresjonizm. „Neo\" oznacza świadomą reakcję, nie kontynuację. Seurat chciał odejść od spontaniczności na rzecz systemu naukowego.",
        },
      ],
      salon: {
        short:
          "Seurat zrobił coś dziwnego. Impresjoniści malowali wrażenie, on chciał to wrażenie zracjonalizować. Niedzielne popołudnie na Grande Jatte wygląda jak zamrożony rytuał mieszczański.",
        expand:
          "Pointylizm: drobne punkty czystego koloru, mieszane optycznie przez oko widza. Teorie Chevreula i Rooda jako podstawa. 2 lata pracy, 60 szkiców przygotowawczych. Ludzie sztywni jak figury egipskie — to nie błąd, to manifest. Różne klasy społeczne na jednym obrazie. Seurat zmarł młodo (31 lat), ruch szybko stracił impet.",
        trap:
          "Pointylizm NIE jest „kropkami losowo\" — to system optyczny oparty na nauce. To nie impresjonizm — neo-impresjonizm, świadoma reakcja na „rozmyte\" plenery. Ludzie celowo nieemocjonalni, to nie błąd. Nie mylić Seurata z Signakiem — obaj pointyliści, ale Signac żył dłużej i kontynuował ruch.",
      },
      imageUrl: "/art/seurat-grande-jatte.jpg",
      imageCaption: "Georges Seurat, Niedzielne popołudnie na wyspie La Grande Jatte, 1884–1886, Art Institute of Chicago",
    },
  },

  // ============================================================
  // 53. Sztuka: Artemisia Gentileschi — Judyta
  // ============================================================
  {
    slug: "art-artemisia-judyta",
    vaultSlug: "art",
    label: "Sztuka — Artemisia Gentileschi, Judyta (~1620)",
    payload: {
      title: "Artemisia Gentileschi — Judyta odcinająca głowę Holofernesowi",
      summary:
        "Wersja florencka ok. 1620, barok włoski. Biblijna scena: Judyta ścina głowę asyryjskiemu wodzowi. U Caravaggia Judyta się wzdraga — u Artemisii dwie kobiety pracują wspólnie, jak rzeźniczki. Inna perspektywa, inna siła. Długo zapomniana, odkrywana na nowo w XX wieku.",
      theory:
        "Olej na płótnie, dziś w Galleria degli Uffizi we Florencji. Wcześniejsza wersja (ok. 1612–1613) jest w Museo di Capodimonte w Neapolu. Artemisia była córką malarza Orazia Gentileschi — sama jedną z najwybitniejszych malarek baroku, długo zapomnianą i odkrywaną na nowo dopiero w XX wieku.\n\nBiograficzny kontekst:\n— Artemisia była zgwałcona w wieku 17 lat (1611) przez Agostina Tassiego, przyjaciela i współpracownika jej ojca.\n— Proces w Rzymie 1612 — była przesłuchiwana z użyciem tortury sznurkami na palcach („sibille\"), żeby „potwierdzić prawdziwość zeznań\".\n— Tassi został skazany, ale wyrok formalnie nie wykonany — wpływy.\n— Jedna z pierwszych kobiet przyjętych do florenckiej Accademia delle Arti del Disegno (1616).\n\nKluczowa różnica wobec wersji Caravaggia: u Caravaggia Judyta wzdraga się, odsuwa, ma delikatność salonu. U Artemisii dwie kobiety pracują wspólnie, jak rzeźniczki — pochylone, zaangażowane fizycznie, zdeterminowane. To inny stosunek do tej samej sceny biblijnej.\n\nKrew tryska realistycznie, bo Artemisia konsultowała się z lekarzem — to nie sensacja, to studium.\n\nKulturowe znaczenie: sztuka może odzyskiwać godność po traumie. Kobieta jako podmiot, nie obiekt (nawet w temacie przemocy). Różnica perspektywy — ta sama scena u mężczyzny i kobiety wygląda zupełnie inaczej.",
      questions: [
        {
          type: "abc",
          text: "Główna różnica między Judytą Artemisii a Judytą Caravaggia:",
          options: [
            "różny moment biblijny",
            "u Artemisii dwie kobiety pracują fizycznie, jak rzeźniczki — u Caravaggia Judyta wzdraga się, salonowa",
            "różne malowane medium",
          ],
          correctAnswer: 1,
          explanation:
            "Ta sama scena, kompletnie inny stosunek. Caravaggio: delikatność i odsunięcie. Artemisia: determinacja, fizyczna praca, wspólnota dwóch kobiet.",
        },
        {
          type: "abc",
          text: "Artemisia była:",
          options: [
            "jedną z pierwszych kobiet przyjętych do florenckiej Accademia delle Arti del Disegno",
            "uczennicą Caravaggia",
            "siostrą Bernardo Cavallino",
          ],
          correctAnswer: 0,
          explanation:
            "Przyjęta 1616, jedna z pierwszych kobiet w Accademia. Niezależna artystka, wybitna postać baroku.",
        },
        {
          type: "fill",
          text: "Florencka wersja Judyty wisi dziś w galerii _____ .",
          options: null,
          correctAnswer: "Uffizi",
          explanation:
            "Galleria degli Uffizi we Florencji. Wcześniejsza wersja jest w Capodimonte w Neapolu — Artemisia namalowała ich kilka.",
        },
        {
          type: "fill",
          text: "Ojciec Artemisii, też malarz, to _____ Gentileschi.",
          options: null,
          correctAnswer: "Orazio",
          explanation:
            "Orazio Gentileschi — jeden z czołowych caravaggionistów, pierwsza nauczyciel Artemisii. Ojciec i córka byli w bliskich relacjach zawodowych.",
        },
        {
          type: "open",
          text: "Dlaczego nie wolno redukować Artemisii do „ofiary gwałtu malującej zemstę\"?",
          options: null,
          correctAnswer:
            "Była wybitną artystką niezależnie od biografii. Jej technika, kompozycje, znajomość anatomii, dramatyzm — to ranga baroku, na poziomie najlepszych mężczyzn epoki. Redukowanie jej do traumy spłaszcza ją do jednowymiarowej postaci. Owszem, biografia jest istotna — proces 1612, tortura sibille, niewydany wyrok Tassiego — ale jej sztuka stoi sama. Judyta Artemisii to nie tylko emocjonalna reakcja na gwałt, to świadome przemyślenie sceny biblijnej z perspektywy kobiecej siły i wspólnoty (dwie kobiety pracujące razem). Wartość artystyczna i wartość biograficzna są dwiema rzeczami, których nie należy mieszać.",
          explanation:
            "Klucz: niezależność dzieła od biografii. Trauma nie tłumaczy mistrzostwa. Mistrzostwo stoi samo.",
        },
        {
          type: "spot_error",
          text: "„Artemisia Gentileschi to pierwsza kobieta malarka w historii sztuki.\"",
          options: [
            "tak, pierwsza",
            "nie — były inne kobiety malarki przed Artemisią (np. Sofonisba Anguissola, Lavinia Fontana). Artemisia była jedną z największych, ale nie pierwszą",
            "Artemisia nie była kobietą",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Sofonisba Anguissola (ok. 1532–1625), Lavinia Fontana (1552–1614) — to kobiety malarki działające przed Artemisią. Artemisia jest najsłynniejszą, nie pierwszą.",
        },
      ],
      salon: {
        short:
          "U Artemisii Judyta nie odwraca głowy, nie wzdraga się. U Caravaggia tak. Ta sama scena, ten sam moment, kompletnie inny stosunek.",
        expand:
          "Artemisia maluje to jak ktoś, kto wie, z czego trzeba się oczyścić, nie jak ktoś, kto obserwuje z boku. I to długo zanim ktokolwiek mówił o kobiecym spojrzeniu w sztuce. Dwie kobiety pracują razem fizycznie, jak rzeźniczki. Krew tryska realistycznie — Artemisia konsultowała się z lekarzem. Jedna z pierwszych kobiet w Accademia delle Arti del Disegno (1616).",
        trap:
          "NIE redukować Artemisii do „ofiary gwałtu malującej zemstę\" — była wybitną artystką niezależnie od biografii. Nie mylić jej Judyty z wersją Caravaggia. Nie nazywać jej „pierwszą kobietą malarką\" — były inne (Anguissola, Fontana), ale ona była jedną z największych.",
      },
      imageUrl: "/art/artemisia-judyta.jpg",
      imageCaption: "Artemisia Gentileschi, Judyta odcinająca głowę Holofernesowi, ok. 1620, Galleria degli Uffizi, Florencja",
    },
  },

  // ============================================================
  // 54. Sztuka: Magritte — Kochankowie II
  // ============================================================
  {
    slug: "art-magritte-kochankowie",
    vaultSlug: "art",
    label: "Sztuka — Magritte, Kochankowie II (1928)",
    payload: {
      title: "Magritte — Kochankowie II",
      summary:
        "1928, belgijski surrealizm. Dwie postacie całują się z głowami owiniętymi w białą tkaninę. Bliskość fizyczna nie oznacza pełnego poznania drugiego człowieka. Codzienność + jedno zniekształcenie = niepokój.",
      theory:
        "Olej na płótnie, dziś w MoMA w Nowym Jorku. Część serii „Kochankowie\". René Magritte mieszkał wtedy w Paryżu, w centrum ruchu surrealistycznego (André Breton, Dalí, Ernst).\n\nBiograficzny kontekst (kontrowersyjny):\n— Matka Magritte'a popełniła samobójstwo topiąc się w rzece Sambre (1912), miał wtedy 13 lat.\n— Według biografii znaleziono jej ciało z koszulą nocną owiniętą wokół twarzy.\n— Biograficzna interpretacja jest kusząca, ale sam Magritte nigdy jej nie potwierdzał i wręcz odrzucał psychoanalizę swojego dzieła.\n\nMechanika surrealizmu Magritte'a — codzienne sceny + jeden element absurdu = niepokój.\n\nStyl: gładki, niemal komercyjny. Magritte pracował przez lata jako projektant reklam, co wpłynęło na jego „chłodną\" estetykę. Magritte to NIE Dalí — styl jest spokojny, niemal reklamowy, nie ekstatyczny. Magritte był ironiczny i filozoficzny.\n\nEfekt obcości właśnie przez kontrast: spokojna forma + niepokojąca treść. Magritte odrzucał interpretacje psychoanalityczne swojego dzieła — sam mówił, że „obrazy są tym, czym są\".\n\nKulturowe znaczenie: bliskość fizyczna nie oznacza pełnego poznania drugiego człowieka. Obraz jako pytanie, nie odpowiedź. Surrealizm = codzienność + jedno zniekształcenie = niepokój.",
      questions: [
        {
          type: "abc",
          text: "Mechanika surrealizmu Magritte'a to:",
          options: [
            "ekstaza i automatyzm",
            "codzienne sceny + jeden element absurdu = niepokój",
            "abstrakcyjne kolory",
          ],
          correctAnswer: 1,
          explanation:
            "Magritte ≠ Dalí. Spokojna forma + niepokojąca treść. Pocałunek (codzienność) + tkanina na twarzach (absurd) = efekt obcości.",
        },
        {
          type: "abc",
          text: "Styl wizualny Magritte'a jest:",
          options: [
            "gładki, niemal komercyjny — wpływ pracy w reklamie",
            "ekspresyjny i emocjonalny",
            "geometrycznie abstrakcyjny",
          ],
          correctAnswer: 0,
          explanation:
            "Magritte pracował lata jako projektant reklam, stąd ten chłodny, gładki styl. Spokojna forma kontrastuje z niepokojącą treścią.",
        },
        {
          type: "fill",
          text: "Magritte był z kraju _____ (narodowość).",
          options: null,
          correctAnswer: "Belgia",
          explanation:
            "Belgijski surrealizm. Mieszkał też w Paryżu w latach 20., ale jego korzenie i tożsamość są belgijskie.",
        },
        {
          type: "fill",
          text: "Tragedia z dzieciństwa Magritte'a: jego matka popełniła samobójstwo, topiąc się w rzece _____ .",
          options: null,
          correctAnswer: "Sambre",
          explanation:
            "Rzeka Sambre w Belgii. Magritte miał 13 lat. Biograficzna interpretacja Kochanków jest kusząca, ale sam Magritte ją odrzucał.",
        },
        {
          type: "open",
          text: "Wytłumacz, czemu redukcja obrazu do „traumy po matce\" jest spłaszczająca.",
          options: null,
          correctAnswer:
            "Magritte sam odrzucał psychoanalityczne interpretacje swojego dzieła. Mówił, że „obrazy są tym, czym są\". Pomijając już to — Kochankowie pytają o coś szerszego niż konkretna trauma: czy kiedykolwiek naprawdę widzimy twarz osoby, którą kochamy? Czy nie zawsze patrzymy przez warstwę projekcji i wyobrażeń? To filozoficzne pytanie o granice poznania drugiego człowieka, nie autobiograficzna terapia. Redukcja do biografii sprowadza dzieło do jednego prywatnego przypadku, kiedy obraz mówi o uniwersalnym doświadczeniu.",
          explanation:
            "Klucz: Magritte był filozoficzny, nie autobiograficzny. Biograficzny klucz spłaszcza filozoficzne pytanie.",
        },
        {
          type: "spot_error",
          text: "„Magritte to ten sam typ surrealizmu co Dalí — ekstatyczny, snowy, sensualny.\"",
          options: [
            "tak, to ten sam ruch",
            "nie — Magritte jest spokojny, ironiczny, filozoficzny. Styl niemal reklamowy. Dalí jest ekstatyczny, surrealizm spod znaku sennych ekstaz",
            "Magritte to ten sam artysta co Dalí",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Surrealizm to nie monolitryczny ruch. Magritte (belgijski, filozoficzny, chłodny) i Dalí (kataloński, ekstatyczny, sensualny) reprezentują dwa różne nurty. Łatwo pomylić, ale to różne podejścia.",
        },
      ],
      salon: {
        short:
          "Magritte fascynuje tym, że pokazuje coś tak intymnego jak pocałunek, a jednocześnie kompletnie nie wiemy, kto kogo całuje. Obraz pyta: czy kiedykolwiek naprawdę widzimy twarz osoby, którą kochamy?",
        expand:
          "Codzienność + jedno zniekształcenie = niepokój. Spokojna forma kontrastuje z niepokojącą treścią. Styl niemal reklamowy (Magritte pracował jako projektant reklam). Belgijski surrealizm, lata 20. w Paryżu. Magritte odrzucał psychoanalityczne interpretacje — mówił, że „obrazy są tym, czym są\".",
        trap:
          "Redukowanie do „traumy po matce\" jest kuszące, ale spłaszczające. Magritte to NIE Dalí — styl spokojny, niemal reklamowy, nie ekstatyczny. Nie mylić z „The Lovers I\" — tej samej serii, ale inny układ postaci. Magritte odrzucał psychoanalizę swojego dzieła.",
      },
      imageUrl: "/art/magritte-kochankowie.jpg",
      imageCaption: "René Magritte, Kochankowie II, 1928, MoMA, Nowy Jork",
    },
  },

  // ============================================================
  // 55. Sztuka: Tanning — Gry dzieci (bez obrazu — copyright)
  // ============================================================
  {
    slug: "art-tanning-gry-dzieci",
    vaultSlug: "art",
    label: "Sztuka — Tanning, Gry dzieci (1942)",
    payload: {
      title: "Tanning — Children's Games",
      summary:
        "1942, amerykański surrealizm. Dorothea Tanning pokazuje dzieciństwo, którego nie ma w bajkach. Dwie dziewczynki w korytarzu, tapeta odrywa się jak druga skóra. Surrealizm kobiet jest inny niż surrealizm Dalego — bardziej psychologiczny, bardziej o transformacji.",
      theory:
        "Olej na płótnie. Dorothea Tanning była młodą amerykańską malarką, która właśnie poznała Maxa Ernsta (uciekiniera z Europy podczas II wojny światowej). Później została jego żoną i partnerką twórczą. Tanning była jedną z niewielu kobiet, którym udało się zaistnieć w bardzo męskim ruchu surrealistycznym.\n\nKluczowe elementy:\n— Dwie dziewczynki w niejednoznacznej, niepokojącej scenie w korytarzu.\n— Tapeta odrywa się od ściany, jakby rozdarły ją same dziewczynki — odsłania niepokojącą głębię.\n— Temat: dojrzewanie, kobiecość, psychika, niepokojąca transformacja.\n— Drzwi, korytarze, tapety w jej obrazach to przejścia psychiczne, nie tylko architektura.\n\nKobiety surrealistki: Tanning była jedną z grupy obok Leonory Carrington, Remedios Varo, Méret Oppenheim, Fridy Kahlo (na obrzeżach ruchu). Pisała: „kobiece sny są inne niż męskie sny\" — surrealizm kobiet różnił się od męskiego.\n\nŻyła 101 lat (1910–2012), pracowała do końca — malowała, rzeźbiła, pisała. Surrealizm kobiet przez dekady był odsuwany na bok historiografii — dopiero ostatnie 30 lat to zmienia.\n\nKulturowe znaczenie: kobiecość i dziewczęcość są złożone, nie idylliczne. Surrealizm kobiet różni się od surrealizmu mężczyzn (Dalí, Magritte) — bardziej psychologiczny, mniej erotyczny, bardziej o transformacji. Drzwi, korytarze, tapety jako przejścia psychiczne.",
      questions: [
        {
          type: "abc",
          text: "Surrealizm kobiet różnił się od męskiego głównie tym, że był:",
          options: [
            "bardziej psychologiczny i o transformacji",
            "bardziej polityczny",
            "bardziej religijny",
          ],
          correctAnswer: 0,
          explanation:
            "Kobiety surrealistki (Tanning, Carrington, Varo, Oppenheim, Kahlo na obrzeżach) szły w psychologię, transformację, dojrzewanie — nie tak ekstatycznie sensualnie jak Dalí.",
        },
        {
          type: "abc",
          text: "Tapeta odrywająca się od ściany w obrazach Tanning to symbol:",
          options: [
            "biedy domowej",
            "przejścia psychicznego, drugiej skóry — niepokojącej transformacji",
            "amerykańskiej architektury",
          ],
          correctAnswer: 1,
          explanation:
            "Drzwi, korytarze, tapety to u Tanning przejścia psychiczne, nie architektura. Tapeta jak druga skóra, którą się zdziera.",
        },
        {
          type: "fill",
          text: "Tanning była partnerką i żoną innego surrealisty, uciekiniera z Europy — Maxa _____ .",
          options: null,
          correctAnswer: "Ernsta",
          explanation:
            "Max Ernst, niemiecki surrealista, uciekł przed nazizmem do USA. Tanning poznała go i wyszła za niego.",
        },
        {
          type: "fill",
          text: "Tanning żyła _____ lat (cyfrowo) — pracowała do końca.",
          options: null,
          correctAnswer: "101",
          explanation:
            "1910–2012. Wybitnie długie życie + ciągła praca twórcza (malarstwo, rzeźba, pisanie) do śmierci.",
        },
        {
          type: "open",
          text: "Dlaczego nie wolno redukować Tanning do „żony Maxa Ernsta\"?",
          options: null,
          correctAnswer:
            "Była całkowicie niezależną artystką, nie tylko współmałżonką. Jej biografia jest często tak redukowana, bezpodstawnie. Tanning miała własne, mocne dzieło — surrealizm psychologiczny, dziewczęcość, transformacja, tapety jako druga skóra. Żyła 101 lat, malowała, rzeźbiła, pisała do końca. Była częścią grupy kobiet surrealistek (Carrington, Varo, Oppenheim), które przez dekady były odsuwane na bok historii sztuki — dopiero ostatnie 30 lat odbudowuje ich miejsce. Redukcja do „żony\" powtarza tę historyczną niesprawiedliwość.",
          explanation:
            "Klucz: niezależność dzieła. Łączenie biograficzne (związek z Ernstem) jest mniej istotne niż artystyczne osiągnięcia.",
        },
        {
          type: "spot_error",
          text: "„Children's Games to klasyczna idylliczna scena dzieciństwa, jak u Renoira.\"",
          options: [
            "tak, idylla",
            "nie — to niepokojąca scena z odrywającą się tapetą, o transformacji i niepokoju dziewczęcości, nie o idylli",
            "to obraz Renoira",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Tanning pokazuje dzieciństwo, którego nie ma w bajkach. To nie idylla — to surrealistyczna scena o transformacji psychicznej.",
        },
      ],
      salon: {
        short:
          "Tanning pokazuje dzieciństwo, którego nie ma w bajkach. Dwie dziewczynki w korytarzu, tapeta odrywająca się jak druga skóra. Surrealizm kobiet jest inny niż surrealizm Dalego.",
        expand:
          "Bardziej psychologiczny, bardziej o transformacji niż o snach. Drzwi, korytarze, tapety to przejścia psychiczne. Tanning była jedną z grupy kobiet surrealistek (Carrington, Varo, Oppenheim, Kahlo na obrzeżach). „Kobiece sny są inne niż męskie sny\" — pisała. I jakoś przez dekady ten nurt był spychany w cień — dopiero ostatnio go odkrywamy.",
        trap:
          "Nie wszystko trzeba „rozwiązywać\" — surrealizm zostawia niejednoznaczność celowo. Tanning była CAŁKOWICIE niezależną artystką, nie tylko „żoną Maxa Ernsta\" — jej biografia często jest tak redukowana, bezpodstawnie. Surrealizm kobiet przez dekady odsuwany na bok historiografii.",
      },
    },
  },

  // ============================================================
  // 56. Sztuka: Hopper — Nighthawks
  // ============================================================
  {
    slug: "art-hopper-nighthawks",
    vaultSlug: "art",
    label: "Sztuka — Hopper, Nighthawks (1942)",
    payload: {
      title: "Hopper — Nighthawks",
      summary:
        "1942, kilka miesięcy po Pearl Harbor. Cztery postacie w pustym diner-ze w nocnym Manhattanie. Geniusz Hoppera: cztery osoby w jednym pomieszczeniu, każda jest sama. I bar NIE MA drzwi — my, widzowie, też jesteśmy zamknięci na zewnątrz.",
      theory:
        "Edward Hopper, amerykański realista. Olej na płótnie, dziś w Art Institute of Chicago. Lata 30. i 40. w USA: Wielki Kryzys, potem wojna. Atmosfera niepokoju, izolacji, miejskiego osamotnienia.\n\nKluczowe fakty:\n— Powstał kilka miesięcy po Pearl Harbor — atmosfera narodowego niepokoju.\n— Bar NIE ma drzwi (nie ma wejścia widocznego na obrazie) — to celowa decyzja Hoppera.\n— Żona Hoppera Josephine „Jo\" Nivison pozowała do wszystkich kobiet w jego obrazach (kobieta w czerwonej sukience to ona).\n— Filmowe światło, kompozycja jak kadr — Hopper inspirował później Hitchcocka, Lyncha, „Drogę do zatracenia\", całą estetykę amerykańskiego noir.\n— Sam Hopper mówił niechętnie o swoich obrazach: „może mimowolnie maluję samotność wielkiego miasta\".\n\nJo Nivison była sama malarką, ale poświęciła karierę dla Edwarda — bolesny aspekt jej biografii.\n\nKulturowe znaczenie: można być samotnym wśród ludzi (cztery osoby w jednym pomieszczeniu, każda osobno). Cisza opowiada historię tak samo jak rozmowa. Hopper stworzył estetyczny język amerykańskiej samotności miejskiej. To NIE jest impresjonizm ani realizm naiwny — to bardzo świadoma, niemal filmowa kompozycja.",
      questions: [
        {
          type: "abc",
          text: "Bar w Nighthawks:",
          options: [
            "ma drzwi po lewej",
            "NIE ma drzwi widocznych na obrazie — celowa decyzja Hoppera",
            "ma drzwi w głębi",
          ],
          correctAnswer: 1,
          explanation:
            "Klasyczna subtelność. Bez widocznych drzwi widz jest zamknięty na zewnątrz — wzmocnienie tematu izolacji.",
        },
        {
          type: "abc",
          text: "Modelka do kobiety w czerwonej sukience to:",
          options: [
            "Jo Nivison, żona Hoppera (sama też malarka)",
            "anonimowa modelka z Bronxu",
            "siostra Hoppera",
          ],
          correctAnswer: 0,
          explanation:
            "Jo pozowała do wszystkich kobiet w obrazach Edwarda. Sama była malarką, ale poświęciła karierę dla niego — bolesny aspekt jej biografii.",
        },
        {
          type: "fill",
          text: "Hopper namalował Nighthawks kilka miesięcy po ataku na _____ Harbor.",
          options: null,
          correctAnswer: "Pearl",
          explanation:
            "Atak Japonii na Pearl Harbor: grudzień 1941. Nighthawks: 1942. Kontekst narodowego niepokoju i wojennej izolacji.",
        },
        {
          type: "fill",
          text: "Hopper wpłynął na filmowców — m.in. Hitchcocka, Lyncha i amerykański _____ (gatunek filmowy).",
          options: null,
          correctAnswer: "noir",
          explanation:
            "Amerykański film noir lat 40. i 50. korzystał z Hopperowskiego światła, kompozycji, atmosfery samotności miejskiej.",
        },
        {
          type: "open",
          text: "Co znaczy „samotność wśród ludzi\" w kontekście Nighthawks?",
          options: null,
          correctAnswer:
            "W Nighthawks są cztery osoby w jednym pomieszczeniu — kobieta i mężczyzna obok siebie, drugi mężczyzna obok nich, barman pracujący. Mimo fizycznej bliskości każda osoba jest sama: nikt na siebie nie patrzy, nikt nie mówi, każdy jest w swoim świecie. To paradoks wielkiego miasta — można być otoczonym ludźmi i jednocześnie głęboko samotnym. Hopper wzmacnia ten efekt brakiem drzwi (widz też zamknięty na zewnątrz) i filmowym, chłodnym światłem. To stało się DNA wizualnego języka amerykańskiej samotności miejskiej — Hitchcock, Lynch, „Droga do zatracenia\" wszyscy to potem cytowali.",
          explanation:
            "Klucz: bliskość fizyczna ≠ bliskość emocjonalna. Hopper diagnozuje to wizualnie.",
        },
        {
          type: "spot_error",
          text: "„Hopper sam mówił, że Nighthawks to obraz o samotności wielkiego miasta — to był jego główny temat.\"",
          options: [
            "tak, sam tak mówił",
            "Hopper mówił o tym niechętnie i ostrożnie — „może mimowolnie maluję samotność\", nie chciał być uważany za „malarza samotności\"",
            "Hopper nie żył w mieście",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Hopper był wstrzemięźliwy w komentowaniu swoich obrazów. „Malarz samotności\" to projekcja krytyków i widzów, nie jego deklaracja. On sam czasem prostował.",
        },
      ],
      salon: {
        short:
          "Hopper zrobił największy paradoks: w Nighthawks są cztery osoby w jednym pomieszczeniu i każda jest sama. I zauważ, że bar nie ma drzwi — nie wejdziesz do środka.",
        expand:
          "Powstał kilka miesięcy po Pearl Harbor — atmosfera narodowego niepokoju. Jo Nivison pozowała do wszystkich kobiet w jego obrazach. Filmowe światło, kompozycja jak kadr — DNA amerykańskiego noir. Hitchcock, Lynch, „Droga do zatracenia\" — wszyscy go cytowali. Cisza opowiada historię tak samo jak rozmowa.",
        trap:
          "Hopper sam mówił niechętnie o swoich obrazach — nie chciał być uważany za „malarza samotności\". To nasza projekcja. To NIE impresjonizm ani realizm naiwny — bardzo świadoma, niemal filmowa kompozycja. Bar bez drzwi to celowa decyzja, nie błąd. Nie redukować Hoppera do „noir\" — on był wcześniej, on stworzył ten język wizualny.",
      },
      imageUrl: "/art/hopper-nighthawks.jpg",
      imageCaption: "Edward Hopper, Nighthawks, 1942, Art Institute of Chicago",
    },
  },

  // ============================================================
  // 57. Sztuka: Rothko — Seagram Murals
  // ============================================================
  {
    slug: "art-rothko-seagram-murals",
    vaultSlug: "art",
    label: "Sztuka — Rothko, Seagram Murals (1958–59)",
    payload: {
      title: "Rothko — Seagram Murals",
      summary:
        "1958–59, abstrakcyjny ekspresjonizm. Rothko dostał gigantyczny kontrakt na murale do luksusowej restauracji Four Seasons. Po wizycie w już otwartej restauracji ODDAŁ honorarium i ODMÓWIŁ dostarczenia obrazów — „nie chcę, żeby moja sztuka wisiała tam, gdzie ludzie obrażają jedzenie pieniędzmi\".",
      theory:
        "Mark Rothko (urodzony jako Markus Rothkowitz w Dźwińsku, dziś Łotwa, w żydowskiej rodzinie, emigrant w USA od 1913). Cykl 30+ murali zamówionych przez Four Seasons Restaurant w nowo zbudowanym Seagram Building (architekci Mies van der Rohe i Philip Johnson). Olej na płótnie, ciemne czerwienie, brązy, bordo.\n\nDramatyczna historia kontraktu:\n— Największy w karierze Rothki kontrakt na zestaw murali do luksusowej restauracji.\n— Po wizycie w już otwartej restauracji oddał honorarium i odmówił dostarczenia obrazów.\n— Uznał, że jego sztuka nie pasuje do „miejsca, gdzie bogaci ludzie obrażają jedzenie pieniędzmi\".\n— Część obrazów ostatecznie trafiła do Tate Modern w Londynie w 1969.\n— Dzień dostawy tych obrazów do Tate — dzień śmierci Rothki przez samobójstwo (25 lutego 1970).\n\nInspiracje i estetyka:\n— Ciemne czerwienie i brązy — inspiracja: biblioteka Michała Anioła Laurenziana we Florencji (Rothko jeździł tam specjalnie).\n— Mówił o „Mozarcie uśmiechającym się przez łzy\" — inspiracja Nietzschem (Narodziny tragedii).\n— Rothko Chapel w Houston (1971) — kontynuacja tego pomysłu, prawdziwie sakralna przestrzeń z obrazami Rothki.\n\nKluczowe stwierdzenie: Rothko BARDZO nie lubił słowa „abstrakcja\". Mówił, że jego obrazy to „tragiczne emocje\", nie kompozycje kolorów.",
      questions: [
        {
          type: "abc",
          text: "Rothko po wizycie w otwartej restauracji Four Seasons:",
          options: [
            "dostarczył obrazy i zgarnął honorarium",
            "oddał honorarium i odmówił dostarczenia obrazów",
            "podniósł cenę",
          ],
          correctAnswer: 1,
          explanation:
            "Klasyczna historia integralności artysty. Uznał, że restauracja luksusowa to złe miejsce dla jego sztuki — i wycofał się, oddając pieniądze.",
        },
        {
          type: "abc",
          text: "Rothko nie lubił słowa „abstrakcja\" — wolał mówić, że jego obrazy to:",
          options: [
            "kompozycje koloru",
            "tragiczne emocje",
            "medytacje",
          ],
          correctAnswer: 1,
          explanation:
            "„Tragiczne emocje\" — to jego określenie. Inspiracja Nietzschem (Narodziny tragedii). Sztuka jako doświadczenie egzystencjalne, nie estetyka.",
        },
        {
          type: "fill",
          text: "Część murali trafiła ostatecznie do Tate Modern w mieście _____ .",
          options: null,
          correctAnswer: "Londynie",
          explanation:
            "Tate Modern w Londynie, 1969. To jeden z najbardziej znanych zestawów obrazów ich kolekcji.",
        },
        {
          type: "fill",
          text: "Dzień dostawy murali do Tate to też dzień samobójstwa Rothki — 25 lutego _____ (rok).",
          options: null,
          correctAnswer: "1970",
          explanation:
            "Tragiczna klamra: Rothko popełnia samobójstwo w pracowni dokładnie tego dnia, gdy obrazy są transportowane do Londynu.",
        },
        {
          type: "open",
          text: "Czemu Rothko zrezygnował z kontraktu Four Seasons?",
          options: null,
          correctAnswer:
            "Po wizycie w już otwartej restauracji uznał, że jego sztuka nie pasuje do „miejsca, gdzie bogaci ludzie obrażają jedzenie pieniędzmi\". Dla niego obraz miał być doświadczeniem, niemal sakralnym — „tragiczną emocją\", inspirowaną Nietzschem i biblioteką Laurenziany. Luksusowa restauracja, gdzie obrazy byłyby tłem dla biznesowych lunchów, sprowadzała jego dzieło do dekoracji. Wybór był radykalny: oddał honorarium (gigantyczne, największe w jego karierze) i zatrzymał obrazy. Tę samą wrażliwość później kontynuował w Rothko Chapel w Houston — przestrzeń jako kaplica, nie galeria. Kontekst pokazu jest częścią sztuki, nie tylko sam obraz.",
          explanation:
            "Klucz: integralność miejsca. Dla Rothki kontekst eksponowania był integralną częścią dzieła, nie wymienialny.",
        },
        {
          type: "spot_error",
          text: "„Rothko to abstrakcjonista — jego obrazy to po prostu kolorowe prostokąty.\"",
          options: [
            "tak, kolorowe prostokąty",
            "Rothko BARDZO nie lubił słowa „abstrakcja\" — dla niego obrazy to „tragiczne emocje\", warstwy z niemal niewidocznymi przejściami i świetlistością, nie kolory ułożone obok siebie",
            "Rothko malował figuratywnie",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Reprodukcje pokazują kolorowe prostokąty. Na żywo widać warstwy, świetlistość, niemal wibrację. Rothko walczył z redukcją do „kolor = emocja\".",
        },
      ],
      salon: {
        short:
          "Najmocniejsza historia Rothki: dostał gigantyczny kontrakt na restaurację w Seagram Building. Poszedł zjeść kolację. Wrócił, oddał kasę, zatrzymał obrazy. Trafiły do Tate dokładnie w dniu jego samobójstwa.",
        expand:
          "Sztuka ma być przeżywana, nie oglądana. Kolor jako doświadczenie duchowe, nie estetyczne. Inspiracja: biblioteka Michała Anioła Laurenziana we Florencji. „Mozart uśmiechający się przez łzy\" — Nietzsche, Narodziny tragedii. Rothko Chapel w Houston (1971) jako kontynuacja idei. Trudno o bardziej tragiczną klamrę: dzień dostawy obrazów do Tate = dzień samobójstwa.",
        trap:
          "Rothko BARDZO nie lubił słowa „abstrakcja\" — to nie „kolorowe prostokąty\", to warstwy, prawie niewidoczne przejścia, świetlistość, prawie wibracja. Redukowanie do „kolor = emocja\" jest banalizujące — trzeba zobaczyć na żywo, reprodukcje nie oddają. Nie mylić z Barnetem Newmanem czy Adolphem Gottliebem — inni ekspresjoniści, inna estetyka.",
      },
      imageUrl: "/art/rothko-seagram-murals.jpg",
      imageCaption: "Mark Rothko, Seagram Murals (fragment wystawy), 1958–59, część w Tate Modern, Londyn",
    },
  },

  // ============================================================
  // 58. Sztuka: Łempicka — Tamara w Zielonym Bugatti
  // ============================================================
  {
    slug: "art-lempicka-bugatti",
    vaultSlug: "art",
    label: "Sztuka — Łempicka, Tamara w Zielonym Bugatti (1929)",
    payload: {
      title: "Łempicka — Tamara w Zielonym Bugatti",
      summary:
        "1929, art déco. Autoportret jako manifest: kobieta sama za kierownicą, w skórzanym kasku i rękawiczkach. Powstał jako okładka niemieckiego magazynu mody Die Dame. Polka, biseksualna, samodzielna — Łempicka tworzyła swoją tożsamość jak markę, długo zanim to było modne.",
      theory:
        "Tamara Łempicka, urodzona jako Maria Górska w Warszawie w 1898, jedna z najbardziej charakterystycznych artystek międzywojnia. Olej na płycie.\n\nKluczowe fakty:\n— Autoportret jako manifest emancypacji — kobieta sama za kierownicą, w skórzanym kasku i rękawiczkach.\n— Łempicka NIE miała Bugatti (miała żółty Renault) — to artystyczna licencja, marzenie o luksusie.\n— Styl art déco: geometria, połysk, metaliczne refleksy, kobieta-maszyna.\n— Biseksualna, otwarcie miała relacje z mężczyznami i kobietami w Paryżu lat 20.\n— Urodzona w Warszawie 1898, wyemigrowała z Rosji po rewolucji 1917, mieszkała w Paryżu, USA, Meksyku. Zmarła w Cuernavaca w Meksyku w 1980, prochy rozsypane nad wulkanem Popocatépetl.\n\nRecepcja:\n— Styl został zapomniany w latach 50–60 (modernizm i abstrakcja go zepchnęły).\n— Odkryty na nowo w latach 70.\n— Madonna jest kolekcjonerką jej prac — bardzo przyczyniła się do współczesnej sławy Łempickiej.\n— W 2024 sprzedaż jednego z portretów za rekordowe sumy (ok. 13 mln dolarów).\n\nKulturowe znaczenie: styl jako forma władzy i komunikatu. Można siebie stworzyć — tożsamość jako projekt artystyczny. Art déco = nowoczesność, prędkość, kontrola, geometria, luksus z odwagą.",
      questions: [
        {
          type: "abc",
          text: "Tamara w Zielonym Bugatti powstała jako:",
          options: [
            "zamówienie portretowe",
            "okładka niemieckiego magazynu mody Die Dame — manifest nowoczesnej kobiecości",
            "prywatny prezent dla męża",
          ],
          correctAnswer: 1,
          explanation:
            "Die Dame to publikacja mody, kierowana do nowoczesnej, świadomej kobiety. Łempicka świadomie projektowała obraz jako wizualne credo emancypacji.",
        },
        {
          type: "abc",
          text: "Łempicka:",
          options: [
            "rzeczywiście miała Bugatti",
            "miała żółty Renault, Bugatti to artystyczna licencja",
            "nie miała samochodu",
          ],
          correctAnswer: 1,
          explanation:
            "Bugatti = marzenie o luksusie, manifest. Renault to rzeczywistość. Łempicka tworzyła swój wizerunek artystycznie, nie biograficznie.",
        },
        {
          type: "fill",
          text: "Łempicka urodziła się jako Maria _____ w Warszawie w 1898.",
          options: null,
          correctAnswer: "Górska",
          explanation:
            "Maria Górska. Łempicka to nazwisko po pierwszym mężu, Tadeuszu Łempickim. Nazwisko zachowała, bo była już znana zawodowo pod nim.",
        },
        {
          type: "fill",
          text: "Łempicka zmarła w Meksyku, prochy rozsypano nad wulkanem _____ .",
          options: null,
          correctAnswer: "Popocatépetl",
          explanation:
            "Zmarła w Cuernavaca, prochy nad Popocatépetlem — wulkan symboliczny dla niej. Spektakularna decyzja, zgodna z jej estetyką.",
        },
        {
          type: "open",
          text: "Co znaczy „autoportret jako manifest\" w tym konkretnym obrazie?",
          options: null,
          correctAnswer:
            "Łempicka tworzy nie portret siebie, tylko wizerunek, jakim chce być widziana — i jakim chce, żeby kobiety XX wieku były widziane. Sama za kierownicą (autonomia), w skórzanym kasku i rękawiczkach (siła, kontrola), patrząca z góry (władza spojrzenia). To rok 1929, kobiety dopiero zdobywają prawo głosu w wielu krajach, jeszcze niedawno były głównie obiektem męskiego spojrzenia. Łempicka odwraca to: ona patrzy, ona prowadzi, ona stworzyła samochód, ubranie, sytuację. „Nie miała Bugatti\" jest tu kluczowe — to nie dokument, to projektowanie tożsamości jako artystycznego dzieła. Sama siebie wymyśla, długo zanim to było modne.",
          explanation:
            "Klucz: autoportret jako projekt, nie dokument. Tożsamość jako medium artystyczne — to bardzo nowoczesne myślenie.",
        },
        {
          type: "spot_error",
          text: "„Łempicka to francuska artystka art déco bez polskich korzeni.\"",
          options: [
            "tak, Francuzka",
            "nie — urodzona w Warszawie jako Maria Górska, polskie korzenie (w międzynarodowej recepcji często pomijane), choć żyła w Paryżu, USA, Meksyku",
            "Łempicka nie istniała",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Polskie korzenie często pomijane w międzynarodowej recepcji. Była Polką, nawet jeśli mieszkała wszędzie. To istotny element jej biografii, ale często marginalizowany.",
        },
      ],
      salon: {
        short:
          "Tamara w Zielonym Bugatti jest jednym z najbardziej zuchwałych autoportretów XX wieku. Kobieta w skórze, sama za kierownicą, patrząca z góry. To 1929 rok. I jeszcze polski paszport.",
        expand:
          "Stworzyła sobie tożsamość jak markę, długo zanim to było modne. Naprawdę nawet nie miała Bugatti, miała Renault — ale to przecież nie o samochód chodziło. Powstał jako okładka niemieckiego Die Dame — manifest nowoczesnej kobiecości. Biseksualna, w Paryżu lat 20. Styl art déco: geometria, połysk, kobieta-maszyna. Madonna jest kolekcjonerką jej prac, bardzo przyczyniła się do współczesnej sławy.",
        trap:
          "To nie jest „ładny obrazek z lat 20\" — to manifest emancypacji. Styl Łempickiej jest często redukowany do dekoracji, ignorując polityczny ładunek (kobieta za kierownicą w 1929!). Polskie korzenie często pomijane w międzynarodowej recepcji. Nie mylić z Tamarą Karsavinę (rosyjska tancerka) ani Tamarą Toumanovą.",
      },
      imageUrl: "/art/lempicka-bugatti.jpg",
      imageCaption: "Tamara Łempicka, Autoportret w Zielonym Bugatti, 1929, kolekcja prywatna",
    },
  },

  // ============================================================
  // 59. Sztuka: Riepin — Iwan Groźny
  // ============================================================
  {
    slug: "art-riepin-iwan-grozny",
    vaultSlug: "art",
    label: "Sztuka — Riepin, Iwan Groźny zabija syna (1885)",
    payload: {
      title: "Riepin — Iwan Groźny i jego syn",
      summary:
        "1885, rosyjski realizm. Car Iwan IV w napadzie furii uderza berłem w głowę własnego syna — kompozycja to świecka Pieta, ojciec trzyma umierającego syna. Riepin namalował to po zamachu na cara Aleksandra II — obraz polityczny, dwukrotnie atakowany w muzeum (1913 nożem, 2018 metalową rurą).",
      theory:
        "Ilja Riepin, jeden z najważniejszych malarzy rosyjskich XIX wieku, członek grupy Pieriedwiżników (wędrowników). Olej na płótnie, Galeria Tretiakowska w Moskwie. Powstał w kontekście Rosji po zamachu na cara Aleksandra II (1881).\n\nScena z 1581 roku:\n— Car Iwan IV Groźny w napadzie furii uderza berłem w głowę własnego syna Iwana Iwanowicza, ten umiera.\n— Twarz cara: oczy szaleńca. Twarz syna: blada, gasnąca.\n— Kompozycja to świecka Pieta — ojciec trzyma umierającego syna, jak Maria trzyma Chrystusa.\n— Świętość przeniesiona z religijnej do politycznej.\n\nKontekst polityczny:\n— Riepin namalował to jako reakcję na zamordowanie cara Aleksandra II — obraz polityczny, nie tylko historyczny.\n— Car Aleksander III zakazał wystawiania obrazu na pewien czas — za bardzo wstrząsający, za blisko aktualnej polityki.\n— Obraz dwukrotnie atakowany w muzeum: 1913 (nożem) i 2018 (metalową rurą) — wciąż polityczny w Rosji.\n\nNiepewność historyczna: historycy spierają się, czy Iwan rzeczywiście zabił syna — są inne hipotezy (otrucie, naturalna śmierć), ale obraz Riepina utrwalił tę wersję jako ikoniczną.\n\nKulturowe znaczenie: władza bez kontroli prowadzi do zniszczenia własnej kontynuacji. Kompozycja świecka jako Pieta — świętość przeniesiona z religijnej do politycznej. Sztuka może być świadectwem politycznym, bezpośrednio aktualnym.",
      questions: [
        {
          type: "abc",
          text: "Kompozycja Iwana Groźnego Riepina to:",
          options: [
            "świecka Pieta — ojciec trzyma umierającego syna",
            "klasyczny portret koronacyjny",
            "scena bitwy",
          ],
          correctAnswer: 0,
          explanation:
            "Świecka Pieta. Riepin świadomie cytuje religijną kompozycję (Maria trzyma Chrystusa) i przenosi ją w sferę polityczną — władza zabijająca własne dziedzictwo.",
        },
        {
          type: "abc",
          text: "Bezpośredni polityczny kontekst obrazu:",
          options: [
            "rewolucja 1917 roku",
            "zamach na cara Aleksandra II w 1881 roku",
            "wojna krymska",
          ],
          correctAnswer: 1,
          explanation:
            "Aleksander II zamordowany 1881. Riepin maluje 1885 — przetwarza świeże doświadczenie politycznej przemocy w historyczną alegorię.",
        },
        {
          type: "fill",
          text: "Obraz wisi w Galerii _____ w Moskwie.",
          options: null,
          correctAnswer: "Tretiakowskiej",
          explanation:
            "Galeria Tretiakowska — główna kolekcja sztuki rosyjskiej w Moskwie. Także miejsce dwóch ataków na obraz.",
        },
        {
          type: "fill",
          text: "Riepin był członkiem grupy malarzy „wędrowników\" — _____ (po rosyjsku).",
          options: null,
          correctAnswer: "Pieriedwiżników",
          explanation:
            "Pieriedwiżnicy (передвижники) = „wędrownicy\". Grupa malarzy organizujących wystawy wędrowne po Rosji, łącząca realizm i społeczne zaangażowanie.",
        },
        {
          type: "open",
          text: "Co znaczy, że obraz Riepina „jest nadal aktualny politycznie\"?",
          options: null,
          correctAnswer:
            "Obraz pyta, co się dzieje z państwem, w którym furia zastępuje rozsądek. Władza zabijająca własną kontynuację, syna, dziedzictwo. To pytanie zostało aktualne w Rosji XIX, XX i XXI wieku — stąd dwa ataki na obraz (1913 nożem, 2018 metalową rurą). Ataki nie były przypadkowe — to akty polityczne, próby unicestwienia obrazu, który zadaje niewygodne pytania o naturę rosyjskiej władzy. Sztuka może być świadectwem politycznym, bezpośrednio aktualnym, nawet po 140 latach. Aleksander III zakazał wystawiania go na pewien czas — bo widział to samo zagrożenie.",
          explanation:
            "Klucz: obraz historyczny może być komentarzem do bieżącej polityki. Akty wandalizmu w 1913 i 2018 dowodzą, że nadal funkcjonuje politycznie.",
        },
        {
          type: "spot_error",
          text: "„To dokumentalny obraz historyczny — wiemy ze 100% pewnością, że Iwan IV zabił syna.\"",
          options: [
            "tak, w pełni udokumentowane",
            "historycy spierają się — są inne hipotezy (otrucie, naturalna śmierć). Obraz Riepina utrwalił TĘ wersję, ale historycznie sprawa nie jest jednoznaczna",
            "to legenda kompletnie zmyślona",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Riepin namalował konkretną wersję wydarzeń. Współcześni historycy są bardziej ostrożni — są inne teorie. To pokazuje, jak silnie obraz może utrwalić jedną interpretację jako oczywistą.",
        },
      ],
      salon: {
        short:
          "Riepin namalował Iwana Groźnego trzymającego umierającego syna jako odwróconą Pietę. Władza, która zabija własną kontynuację. I to nie jest tylko XVI wiek, to obraz z 1885, namalowany po zamachu na Aleksandra II.",
        expand:
          "Riepin pytał, co się dzieje z państwem, w którym furia zastępuje rozsądek. Te pytania są nadal aktualne, dosłownie — obraz był dwukrotnie atakowany w muzeum, ostatnio w 2018. Aleksander III zakazał wystawiania na pewien czas. Świętość kompozycji Piety przeniesiona z religijnej do politycznej. Ilja Riepin, grupa Pieriedwiżników, rosyjski realizm.",
        trap:
          "To nie jest „historyczny obraz\" w sensie neutralnym — to komentarz do współczesnej Riepinowi Rosji. Nie mylić Iwana IV (XVI w.) z innymi carami o tym imieniu. Nie wiadomo z całkowitą pewnością, czy Iwan rzeczywiście zabił syna — obraz to JEGO ikona, ale historia jest sporna. Riepin to NIE Repin (transliteracja) — po polsku poprawnie Riepin.",
      },
      imageUrl: "/art/riepin-iwan-grozny.jpg",
      imageCaption: "Ilja Riepin, Iwan Groźny i jego syn Iwan, 1885, Galeria Tretiakowska, Moskwa",
    },
  },

  // ============================================================
  // 60. Sztuka: Bruegel — Myśliwi w śniegu
  // ============================================================
  {
    slug: "art-bruegel-mysliwi-w-sniegu",
    vaultSlug: "art",
    label: "Sztuka — Bruegel, Myśliwi w śniegu (1565)",
    payload: {
      title: "Bruegel — Myśliwi w śniegu",
      summary:
        "1565, renesans niderlandzki. Myśliwi wracają z polowania z jednym lisem, zmęczeni. Poniżej w wiosce dzieci jeżdżą na łyżwach, ktoś gasi pożar, ktoś gotuje. Pierwszy raz „zwykli ludzie też zasługują na obraz\" bez konieczności religijnego pretekstu. I dokument klimatyczny: Mała epoka lodowcowa.",
      theory:
        "Pieter Bruegel Starszy, jeden z najważniejszych artystów Niderlandów XVI wieku. Olej na desce dębowej. Część cyklu sześciu obrazów o porach roku (zachowanych jest pięć). Dziś w Kunsthistorisches Museum w Wiedniu. Niderlandy w tym okresie pod hiszpańskim panowaniem, narastał konflikt religijny.\n\nFakty kluczowe:\n— Myśliwi z psami wracają z polowania, mają tylko jednego lisa — polowanie kiepskie.\n— Wieś poniżej, zamarznięte stawy, ludzie łyżwiarczący, ktoś gasi pożar po lewej.\n— „Little Ice Age\" (Mała epoka lodowcowa) — okres ochłodzenia klimatu w Europie od XIV do XIX wieku, zimy były dużo cięższe niż dziś, kanały w Holandii często zamarzały.\n— Bruegel jako pierwszy w sztuce europejskiej traktuje krajobraz i codzienne życie chłopów jako godny temat sam w sobie (bez pretekstu religijnego czy mitologicznego).\n— Kompozycja diagonalna prowadzi wzrok od góry-lewej do dołu-prawej.\n— Wszystkie elementy w jednym obrazie: trud (zmęczeni myśliwi), radość (łyżwiarze), praca (kobiety przy ogniu), niebezpieczeństwo (pożar).\n\nBruegel zmarł młodo (1569), pozostawił bardzo niewiele obrazów (ok. 40), za to ogromny wpływ na sztukę.\n\nKulturowe znaczenie: życie zwykłych ludzi jako historia, nie tylko królów i świętych. Życie jest jednocześnie trudne i radosne (myśliwi vs łyżwiarze w tym samym kadrze). Bruegel jako pionier „krajobrazu jako tematu\", bez konieczności mitologicznego pretekstu.",
      questions: [
        {
          type: "abc",
          text: "Myśliwi wracają z polowania z:",
          options: [
            "dużą zdobyczą — udane polowanie",
            "jednym lisem — polowanie kiepskie, są zmęczeni",
            "pustymi rękami",
          ],
          correctAnswer: 1,
          explanation:
            "Jeden lis na grupę myśliwych = kiepskie polowanie. Bruegel maluje codzienność z jej trudami, nie heroiczne triumfy.",
        },
        {
          type: "abc",
          text: "Pionierstwo Bruegla polega na tym, że:",
          options: [
            "wprowadził technikę olejną",
            "jako pierwszy traktuje krajobraz i życie chłopów jako godny temat sam w sobie, bez religijnego pretekstu",
            "namalował pierwszą Pietę",
          ],
          correctAnswer: 1,
          explanation:
            "Przed Brueglem krajobrazy były tłem dla biblijnych scen, chłopi pojawiali się jako rodzajowe ozdoby. Bruegel czyni z nich główny temat.",
        },
        {
          type: "fill",
          text: "Okres ochłodzenia klimatu w Europie od XIV do XIX wieku to Mała _____ lodowcowa.",
          options: null,
          correctAnswer: "epoka",
          explanation:
            "„Little Ice Age\". Wpływał na rolnictwo, gospodarkę, kulturę — zimy były dużo cięższe, kanały holenderskie zamarzały, malarstwo zimowe miało realne źródło.",
        },
        {
          type: "fill",
          text: "Obraz wisi dziś w Kunsthistorisches Museum w stolicy _____ .",
          options: null,
          correctAnswer: "Austrii",
          explanation:
            "Wiedeń. Kunsthistorisches Museum ma największą kolekcję Bruegla na świecie. Część cyklu pór roku.",
        },
        {
          type: "open",
          text: "Co znaczy „życie jest jednocześnie trudne i radosne\" w tym obrazie?",
          options: null,
          correctAnswer:
            "Bruegel pokazuje wszystkie wymiary życia w jednym kadrze: zmęczonych myśliwych z jednym lisem (trud, niepowodzenie), dzieci na łyżwach (radość, gra), kobiety przy ogniu (praca, gospodarstwo domowe), pożar po lewej (niebezpieczeństwo, niespodzianka), zamarzniętą wieś (surowość klimatu). To nie idylla i nie tragedia — to życie jako całość. Bruegel patrzy z dystansu antropologicznym, niemal jak fotograf z drona, widząc wszystko naraz. To radykalne nowoczesne spojrzenie — życie zwykłych ludzi traktowane z powagą, ale bez nadęcia. „Życie nie jest jedną emocją\".",
          explanation:
            "Klucz: jeden kadr, wiele emocji równolegle. Bruegel jako antropolog, nie moralista.",
        },
        {
          type: "spot_error",
          text: "„Bruegel Starszy i Bruegel Młodszy to ten sam artysta — używał obu nazwisk.\"",
          options: [
            "tak, to ten sam",
            "to dwie różne osoby — Pieter Bruegel Starszy (wielki, ok. 1525–1569) i jego syn Pieter Bruegel Młodszy, który głównie kopiował ojca",
            "Bruegel nie istniał",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Klasyczna pomyłka. Starszy to oryginał, wielki innowator. Młodszy to syn, głównie kopiujący. Łatwo pomylić, ale to inne osoby z innymi rolami w historii.",
        },
      ],
      salon: {
        short:
          "U Bruegla zima nie jest tłem, jest bohaterką. Myśliwi wracają z niczym, jeden lis, wszyscy zmęczeni. A poniżej w wiosce dzieci jeżdżą na łyżwach, ktoś gasi pożar, ktoś gotuje.",
        expand:
          "XVI-wieczna kronika klimatyczna — byliśmy wtedy w Małej epoce lodowcowej, kanały w Niderlandach zamarzały. Ale ważniejsze: Bruegel po raz pierwszy uznał, że zwykli ludzie też zasługują na obraz, bez konieczności wciskania świętego w róg. Część cyklu sześciu obrazów o porach roku (zachowane pięć). Diagonalna kompozycja prowadzi wzrok. Niewiele obrazów (~40), ogromny wpływ.",
        trap:
          "To NIE jest „ładny pejzaż zimowy\" — to dokument klimatyczny i społeczny. Bruegel Starszy jest często mylony z synem (Pieter Bruegel Młodszy) — Starszy to wielki, Młodszy głównie kopiował. Pisownia: po polsku Bruegel, czasem Brueghel. Nie traktować chłopów na obrazach Bruegla jako karykatury — patrzył z dystansu antropologicznym, ale z szacunkiem.",
      },
      imageUrl: "/art/bruegel-mysliwi-w-sniegu.jpg",
      imageCaption: "Pieter Bruegel Starszy, Myśliwi w śniegu, 1565, Kunsthistorisches Museum, Wiedeń",
    },
  },

  // ============================================================
  // 61. Savoir-vivre: powitania i przedstawianie
  // ============================================================
  {
    slug: "savoir-powitania-i-przedstawianie",
    vaultSlug: "savoir",
    label: "Savoir-vivre — powitania i przedstawianie",
    payload: {
      title: "Powitania i przedstawianie",
      summary:
        "Pierwsze 30 sekund kontaktu decyduje o tym, jak Cię zapamiętają. Dwie różne reguły: towarzyskie (kobieta i starszy pierwsze) vs biznesowe (stanowisko, nie płeć). Większość ludzi wpada, bo myli kody.",
      theory:
        "Sytuacja towarzyska. Hierarchia: kobieta > osoba starsza > młodszy mężczyzna. Kobieta podaje rękę pierwsza. Starszy mężczyzna podaje rękę młodszemu.\n\nSytuacja biznesowa. Hierarchia stanowisk, nie płeć i nie wiek. Osoba wyższa rangą podaje rękę pierwsza — CEO podaje rękę pierwszy, nawet jeśli jest mężczyzną, a kobieta jest junior.\n\nPrzedstawianie: zawsze „do góry\" — osobę niższą w hierarchii przedstawiamy osobie wyższej. Format: najpierw imię osoby wyższej, potem nowa osoba. „Pani Anno, to jest Marek Nowak, nasz analityk. Marek, Pani Anna Wiśniewska, head of strategy.\"\n\nSam uścisk: krótki, pewny, kontakt wzrokowy, jedno-dwa pociągnięcia. Lekki uśmiech, nie ostentacyjny. Wstajemy do powitania (w biznesie zawsze, towarzysko mężczyźni do kobiet i starszych).",
      questions: [
        {
          type: "abc",
          text: "Kobieta junior i mężczyzna senior na spotkaniu biznesowym — kto podaje rękę pierwszy?",
          options: [
            "kobieta — bo towarzyska reguła ma zawsze pierwszeństwo",
            "senior — bo w biznesie liczy się stanowisko, nie płeć",
            "obie strony jednocześnie",
          ],
          correctAnswer: 1,
          explanation:
            "Biznes: hierarchia stanowisk, nie płci. Senior podaje pierwszy. Towarzyska reguła „kobieta pierwsza\" tu nie obowiązuje.",
        },
        {
          type: "abc",
          text: "Przedstawiasz dwie osoby. Format poprawny:",
          options: [
            "najpierw imię nowej osoby, potem ważniejszej",
            "najpierw imię osoby wyższej rangą, potem nowa",
            "kolejność alfabetyczna",
          ],
          correctAnswer: 1,
          explanation:
            "Przedstawiamy „do góry\". „Pani Anno, to jest Marek\" — najpierw zwracamy się do osoby wyższej rangą.",
        },
        {
          type: "fill",
          text: "Towarzyska hierarchia: kobieta > osoba _____ > młodszy mężczyzna.",
          options: null,
          correctAnswer: "starsza",
          explanation:
            "Wiek jest drugim wymiarem. Starszy mężczyzna podaje rękę młodszemu w sytuacji towarzyskiej.",
        },
        {
          type: "fill",
          text: "Reakcja na powitanie: kontakt wzrokowy, krótki uścisk, _____ uśmiech.",
          options: null,
          correctAnswer: "lekki",
          explanation:
            "Lekki, nie ostentacyjny. Powitanie ma być profesjonalne, nie performatywne.",
        },
        {
          type: "open",
          text: "Sformułuj poprawne przedstawienie analityka (Marek Nowak) head of strategy (Anna Wiśniewska).",
          options: null,
          correctAnswer:
            "„Pani Anno, to jest Marek Nowak, nasz analityk. Marek, Pani Anna Wiśniewska, head of strategy.\" Najpierw zwracamy się do osoby wyższej rangą (Anna), przedstawiamy nową osobę (Marek), potem do nowej osoby kierujemy pełne nazwisko i tytuł wyższej osoby. Tytuł pomaga w kontekście, ale nie powinien być przesadny.",
          explanation:
            "Klucz: do góry, najpierw imię wyższej rangą, potem nowa osoba, opcjonalnie krótkie role. Wszystko spokojnie.",
        },
        {
          type: "spot_error",
          text: "„Spotykam CEO mężczyznę na korytarzu, jestem kobietą junior. Czekam aż on poda rękę, ale czuję, że to ja powinnam — w końcu w towarzyskim kontekście kobieta pierwsza.\"",
          options: [
            "tak — kobieta zawsze pierwsza",
            "nie — w biznesie hierarchia stanowisk: CEO podaje rękę pierwszy, nawet jeśli jest mężczyzną, a Ty kobietą junior",
            "obie strony naraz",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Klasyczne mylenie kodów. W biznesie CEO ma pierwszeństwo niezależnie od płci. Czekanie na inicjatywę CEO jest poprawne.",
        },
      ],
      salon: {
        short:
          "Towarzysko: kobieta i starszy pierwsze. Biznesowo: stanowisko, nie płeć. CEO podaje rękę pierwszy, nawet jeśli jest mężczyzną, a Ty kobietą junior.",
        expand:
          "Przedstawiamy „do góry\" — najpierw imię osoby wyższej rangą, potem nowa osoba. „Pani Anno, to jest Marek Nowak, nasz analityk. Marek, Pani Anna Wiśniewska, head of strategy.\" Sam uścisk: krótki, pewny, kontakt wzrokowy, jedno-dwa pociągnięcia. Lekki uśmiech, nie ostentacyjny. W biznesie zawsze wstajemy do powitania.",
        trap:
          "Czekać aż mężczyzna senior poda rękę, gdy Ty jesteś jeszcze wyżej rangą — błąd. Powtarzać „miło mi, miło mi\" — raz wystarczy. Zbyt mocny uścisk (próba dominacji) albo zbyt wiotki (sygnał niepewności). Patrzeć w bok podczas powitania.",
      },
    },
  },

  // ============================================================
  // 62. Savoir-vivre: etykieta stołu
  // ============================================================
  {
    slug: "savoir-etykieta-stolu",
    vaultSlug: "savoir",
    label: "Savoir-vivre — etykieta stołu",
    payload: {
      title: "Etykieta stołu",
      summary:
        "Stół to scena. Większość zasad sprowadza się do dwóch rzeczy: nie wyprzedzaj gospodarza, dawaj sygnały sztućcami. Pauza = V, koniec = równolegle na 4:20.",
      theory:
        "Kiedy zaczynamy jeść: gdy zaczyna gospodarz lub gdy wszyscy mają już talerze i gospodarz daje znak. Nie zaczynamy „bo mi wystygnie\".\n\nSerwetka: na kolana zaraz po usiądnięciu, składamy w pół zagiętą stroną do siebie. W trakcie krótkiej przerwy (np. wyjście do toalety): NA KRZEŚLE, nie na stole. Na koniec posiłku: lekko zwinięta z lewej strony talerza, nie składamy starannie.\n\nSygnały sztućcami. Pauza w jedzeniu: sztućce w „V\" na talerzu, widelec lewo, nóż prawo, czubki ku środkowi. Koniec posiłku: sztućce równolegle, ułożone na pozycji 4:20 jak na zegarze, ostrza noża do siebie, uchwyty w prawo-dół.\n\nPieczywo: łamiemy kęsy palcami, nie odgryzamy z całej kromki. Smarujemy małe porcje, nie całą kromkę naraz. Pieczywo trzymamy nad talerzykiem lub talerzem, nie nad obrusem.\n\nToasty: wstajemy razem z gospodarzem (jeśli on wstaje). Patrzymy w oczy osobie, do której pijemy. Lekkie uniesienie kieliszka, delikatny kontakt jeśli w ogóle, nie stukanie.\n\nGdy gospodarz wstaje w trakcie posiłku: ODKŁADAMY sztućce w pauzę V, NIE wstajemy z nim. Chyba że na koniec posiłku — wtedy wszyscy.\n\nTempo: dostosowane do reszty stołu. Nie pierwsza, nie ostatnia.",
      questions: [
        {
          type: "abc",
          text: "Sygnał „pauza w jedzeniu\" sztućcami:",
          options: [
            "sztućce równolegle na 4:20",
            "sztućce w V, czubki ku środkowi (widelec lewo, nóż prawo)",
            "sztućce skrzyżowane na X",
          ],
          correctAnswer: 1,
          explanation:
            "V = pauza, robię przerwę. Równolegle = koniec posiłku. To kod międzynarodowy dla kelnera.",
        },
        {
          type: "abc",
          text: "Gospodarz wstaje od stołu na chwilę. Co robisz?",
          options: [
            "wstajesz z nim, z grzeczności",
            "zostajesz, odkładasz sztućce w pauzę V",
            "kontynuujesz jedzenie",
          ],
          correctAnswer: 1,
          explanation:
            "Wstajemy razem z gospodarzem tylko gdy on wstaje NA KONIEC posiłku. Przy krótkiej przerwie — zostajemy, robimy pauzę V.",
        },
        {
          type: "fill",
          text: "W trakcie krótkiej przerwy (np. wyjście do toalety) serwetkę kładziemy na _____ , nie na stole.",
          options: null,
          correctAnswer: "krześle",
          explanation:
            "Stół jest dla zastawy i czystego obrusu. Serwetka na krześle = wracamy. Po zakończeniu posiłku — lekko zwinięta z lewej strony talerza.",
        },
        {
          type: "fill",
          text: "Pieczywo _____ palcami, nie odgryzamy z całej kromki.",
          options: null,
          correctAnswer: "łamiemy",
          explanation:
            "Małe kęsy łamane, smarujemy małe porcje pojedynczo, trzymamy nad talerzykiem (nie nad obrusem).",
        },
        {
          type: "open",
          text: "Wytłumacz, dlaczego sygnały sztućcami są ważne, nawet jeśli nikt ich nie „odczytuje\" świadomie.",
          options: null,
          correctAnswer:
            "Sygnały V (pauza) i równolegle (koniec) są międzynarodowym kodem dla kelnera — wie, czy zabrać talerz, czy poczekać. Pomagają obsłudze, ale też tworzą rytm całego stołu: wszyscy widzą wzajemnie sygnały, dostosowują tempo, nikt nie czeka samotnie z pustym talerzem ani nie jest pospieszany. Plus: świadomie ułożone sztućce to drobny gest kontroli — sygnał, że jesz spokojnie, świadomie, że nie krzątasz się przy stole. Drobiazg, ale buduje wrażenie obycia.",
          explanation:
            "Klucz: funkcja (komunikacja z kelnerem) + estetyka (rytm stołu, brak nerwowych ruchów).",
        },
        {
          type: "spot_error",
          text: "„Stukam mocno kieliszkiem do toastu, krzyczę «Sto lat!» — to świadczy o entuzjazmie.\"",
          options: [
            "tak, entuzjastycznie jest dobrze",
            "nie — toast: delikatne uniesienie kieliszka, kontakt wzrokowy z osobą, do której pijemy, ewentualnie minimalny kontakt — nie stukanie",
            "kieliszek powinien być pusty",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Stukanie kieliszkami jest popularne w polskiej tradycji, ale w eleganckim kontekście — minimalne. Toast to gest wzajemnego spojrzenia, nie hałasu.",
        },
      ],
      salon: {
        short:
          "Pauza = V, koniec = równolegle. Gospodarz daje rytm. Serwetka na krześle przy przerwie, nie na stole. Pieczywo łamiemy palcami, nie odgryzamy.",
        expand:
          "Sygnały sztućcami są międzynarodowym kodem dla kelnera. Toast: patrzymy w oczy, delikatne uniesienie kieliszka, nie stukanie. Tempo dostosowane do reszty stołu — nie pierwsza, nie ostatnia. Gdy gospodarz wstaje na chwilę: odkładamy sztućce w V, zostajemy, nie wstajemy z nim.",
        trap:
          "Wstać z gospodarzem, gdy on wstaje na chwilę. Zaczynać jeść przed gospodarzem. Trzymać serwetkę na stole przy krótkim wyjściu. Stukać kieliszkiem przy toaście. Mówić z pełnymi ustami. Krzątać się przy sztućcach, kiedy nie jemy (gest niepewności).",
      },
    },
  },

  // ============================================================
  // 63. Savoir-vivre: torebka i przestrzeń przy stole
  // ============================================================
  {
    slug: "savoir-torebka-i-przestrzen",
    vaultSlug: "savoir",
    label: "Savoir-vivre — torebka i przestrzeń przy stole",
    payload: {
      title: "Torebka i przestrzeń przy stole",
      summary:
        "Kobiety wpadają najczęściej na torebce. Reguła jest prosta: torebka ma być niewidoczna, nie kolidować z obsługą i nie zaśmiecać estetyki stołu. Mała na kolanach od lewej, duża przy nodze krzesła.",
      theory:
        "Gdzie torebka NIGDY. Nie na stole — stół jest dla zastawy, torebka zaśmieca optycznie i koliduje z talerzami i kieliszkami. Nie na oparciu krzesła — spadnie, kelner się potknie, ktoś o nią zaczepi. Nie na podłodze (poza ekstremalnymi sytuacjami).\n\nMała torebka / kopertówka: na kolanach, od strony lewej, między udem a lewym oparciem. Albo na krześle obok TYLKO jeśli krzesło jest puste i lokal kameralny. W restauracjach premium często jest niski stołeczek lub haczyk pod blatem — korzystamy.\n\nDuża torba: między nogami krzesła a stołem, oparta o nogę krzesła od strony siedzenia. NIE w przejściu. NIE na drugim krześle, gdy lokal pełny.\n\nZasada lewej nogi: mała torebka kładziona na kolanach idzie z lewej strony. Lewa, bo prawą ręką jemy i sięgamy po kieliszek.\n\nCo robimy w torebce przy stole: NIC. Otwieramy ją tylko w sytuacjach koniecznych. Sprawdzenie telefonu, poprawka makijażu, szukanie czegoś — wychodzimy do toalety. Telefon w ręce podczas posiłku to czerwona flaga.",
      questions: [
        {
          type: "abc",
          text: "Mała kopertówka przy stole — gdzie?",
          options: [
            "na stole obok talerza",
            "na oparciu krzesła",
            "na kolanach, od strony lewej",
          ],
          correctAnswer: 2,
          explanation:
            "Zasada lewej nogi — prawa ręka wolna do jedzenia i kieliszka. Stół jest dla zastawy, oparcie się grozi spadnięciem.",
        },
        {
          type: "abc",
          text: "Duża torba w restauracji — gdzie?",
          options: [
            "na oparciu krzesła",
            "między nogą krzesła a stołem, oparta o nogę od strony siedzenia",
            "na drugim krześle",
          ],
          correctAnswer: 1,
          explanation:
            "Bezpiecznie, nie w przejściu, nie blokuje obsługi. Drugie krzesło rezerwujemy dla potencjalnego gościa.",
        },
        {
          type: "fill",
          text: "Mała torebka idzie z _____ strony, bo prawą ręką jemy.",
          options: null,
          correctAnswer: "lewej",
          explanation:
            "Logika praktyczna — wolna ręka do sztućców i kieliszka. „Zasada lewej nogi\" jest standardową regułą savoir-vivre.",
        },
        {
          type: "fill",
          text: "Jeśli musisz sprawdzić telefon lub poprawić makijaż, wychodzisz do _____ .",
          options: null,
          correctAnswer: "toalety",
          explanation:
            "Otwieranie torebki przy stole, sprawdzanie telefonu, gorączkowe szukanie — psuje rytm stołu. Toaleta to neutralna przestrzeń do tych czynności.",
        },
        {
          type: "open",
          text: "Wytłumacz, czemu „powieszę torebkę na oparciu, będę mieć pod ręką\" to zły pomysł.",
          options: null,
          correctAnswer:
            "Trzy powody. Bezpieczeństwo: torebka spada, ktoś o nią zaczepi, kelner może się potknąć. Estetyka: w lokalu premium wisząca torba wygląda chaotycznie, łamie linię oparcia. Logistyka: gdy wstajesz albo ktoś przechodzi za Twoim krzesłem, torba jest na drodze. Lepiej: mała kopertówka na kolanach od lewej (kontrola, czystość), duża pod stołem przy nodze krzesła (bezpiecznie schowana). Premium restauracje często oferują niski stołeczek lub haczyk pod blatem — wtedy korzystamy z nich.",
          explanation:
            "Klucz: bezpieczeństwo + estetyka + logistyka. Trzy razem wykluczają oparcie krzesła.",
        },
        {
          type: "spot_error",
          text: "„Na pełnej kolacji w premium restauracji telefon trzymam obok talerza — mam alerty z pracy, czekam na ważnego maila.\"",
          options: [
            "tak, kontekst pracy uzasadnia",
            "nie — telefon poza stołem zawsze. Jeśli czekasz na coś naprawdę pilnego: telefon na kolanach w torebce, krótkie wyjście jeśli wibruje, „przepraszam na chwilę\"",
            "telefon na głośnomówiącym OK",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Telefon na stole sygnalizuje, że spotkanie nie jest w pełni Twoim priorytetem. W premium kontekście to czerwona flaga niezależnie od kontekstu zawodowego.",
        },
      ],
      salon: {
        short:
          "Mała torebka na kolanach od lewej, duża pod stołem przy nodze krzesła. Nigdy na stole, nigdy na oparciu, nigdy w przejściu. Telefon trzymamy w torebce, otwieramy w toalecie.",
        expand:
          "Zasada lewej nogi — prawa ręka wolna do sztućców i kieliszka. W restauracjach premium często jest niski stołeczek lub haczyk pod blatem, korzystamy. „Powieszę na oparciu, będę miała pod ręką\" — fatalny pomysł: spada, kelner się potyka, w premium lokalu wygląda chaotycznie.",
        trap:
          "Położyć torebkę na drugim krześle, gdy lokal pełny — krzesło może być potrzebne. Otwierać torebkę przy stole, żeby sprawdzić telefon — wychodzimy. Trzymać telefon w ręce podczas posiłku. Zasłaniać torebką kieliszek wina.",
      },
    },
  },

  // ============================================================
  // 64. Savoir-vivre: elegancka komunikacja
  // ============================================================
  {
    slug: "savoir-elegancka-komunikacja",
    vaultSlug: "savoir",
    label: "Savoir-vivre — elegancka komunikacja",
    payload: {
      title: "Elegancka komunikacja",
      summary:
        "Jak mówisz, jak reagujesz na komplement, jak nie poprawiasz innych — to poziom, na którym widać, czy ktoś ma realne obycie. Można umieć wszystko o stole i wpaść tu w ciągu trzech zdań.",
      theory:
        "Tempo i ton. Mówimy spokojniej i niżej niż naturalny impuls. Mikropauzy między zdaniami. Nie podnosimy głosu, żeby coś podkreślić — raczej ściszamy. Ludzie wtedy słuchają uważniej.\n\nNie przerywamy. Czekamy do końca myśli drugiej osoby. Mikropauza po jej zdaniu. Dopiero potem mówimy. Jeśli sami zostaniemy przerwani: zatrzymujemy się, mikropauza, patrzymy spokojnie, druga osoba kończy, wracamy.\n\nReakcja na komplement. „Dziękuję, to bardzo miłe.\" Albo: „Dziękuję, miło mi to słyszeć.\" NIE: „ależ nie\", „co Ty\", „to stare\", „no niestety jeszcze nie tak dobrze\". Pomniejszanie komplementu odrzuca uprzejmość drugiej osoby. To nie skromność — to brak elegancji.\n\nNie poprawiamy publicznie. Nawet jeśli ktoś przekręcił nazwisko, popełnił błąd merytoryczny, źle wymówił słowo. Publicznie: nie. Prywatnie, w cztery oczy, delikatnie, w odpowiednim momencie.\n\nEleganckie zamienniki potocznych zwrotów. „Słucham?\" zamiast „co?\". „Oczywiście / naturalnie / z przyjemnością\" zamiast „spoko\". „Dobrze / w porządku\" zamiast „OK\". „Przepraszam\" zamiast „sorry\". „Dzień dobry\" w mailu biznesowym zamiast „Hej\".",
      questions: [
        {
          type: "abc",
          text: "Ktoś mówi: „Wyglądasz fantastycznie w tej sukience.\" Najlepsza reakcja:",
          options: [
            "„Ależ nie, stara jest, kupiłam dawno.\"",
            "„Dziękuję, to bardzo miłe.\"",
            "„No, tak myślałam, że dobrze leży.\"",
          ],
          correctAnswer: 1,
          explanation:
            "Krótko, ciepło, bez umniejszania. Pomniejszanie komplementu („ależ nie\") odrzuca uprzejmość drugiej osoby — to nie skromność, to brak elegancji.",
        },
        {
          type: "abc",
          text: "Ktoś przy stole popełnia błąd merytoryczny przy wszystkich. Reakcja:",
          options: [
            "publicznie korygujesz, by inni nie żyli w błędzie",
            "nie korygujesz publicznie — jeśli to ważne, w cztery oczy, później, delikatnie",
            "ostentacyjnie milczysz",
          ],
          correctAnswer: 1,
          explanation:
            "Poprawianie kogoś publicznie upokarza, nawet jeśli masz rację merytorycznie. Cztery oczy + delikatnie + odpowiedni moment.",
        },
        {
          type: "fill",
          text: "Eleganckie zamiennik „co?\" — _____ ?",
          options: null,
          correctAnswer: "słucham",
          explanation:
            "„Słucham?\" albo „Przepraszam, nie dosłyszałam?\" — eleganckie, spokojne. „Co?\" brzmi potocznie i ostro.",
        },
        {
          type: "fill",
          text: "Aby coś podkreślić w wypowiedzi, lepiej _____ głos, nie podnosić.",
          options: null,
          correctAnswer: "ściszyć",
          explanation:
            "Kontrintuicyjne: ludzie nachylają się i słuchają uważniej, gdy mówisz ciszej, niż gdy podnosisz głos. Cisza buduje uwagę.",
        },
        {
          type: "open",
          text: "Wytłumacz, czemu „ależ nie, to stare\" w odpowiedzi na komplement to brak elegancji.",
          options: null,
          correctAnswer:
            "Komplement to akt uprzejmości od drugiej osoby — ona daje Ci coś (uznanie, dobre słowo). Pomniejszając („ależ nie\", „to stare\") odrzucasz jej dar, sygnalizujesz, że uznajesz jej osąd za błędny, niemądry albo nadgorliwy. To nie jest skromność, tylko publiczne kwestionowanie smaku komentującej osoby. „Dziękuję, to bardzo miłe\" przyjmuje gest, oddaje ciepło, nie wymaga rozwijania. Mikrokod elegancji: nie odrzucasz darów uprzejmości, nawet jeśli czujesz wewnętrzny dyskomfort. Przyjmujesz, dziękujesz, idziesz dalej.",
          explanation:
            "Klucz: komplement to dar uprzejmości — odrzucenie go = odrzucenie osądu drugiej osoby. Krótkie podziękowanie zamyka pętlę bez umniejszania.",
        },
        {
          type: "spot_error",
          text: "„Aniu, ale nazwisko Pana Kowalskiego wymawiasz źle — Kowálski, nie Kowalski!\" — przy całym stole, z półprzymrużeniem oka.",
          options: [
            "tak — pomagasz koleżance",
            "nie — poprawianie publicznie, nawet żartem, upokarza. W cztery oczy, później, delikatnie",
            "powinnaś krzyczeć głośniej",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Klasyczna pułapka — żart przy świadkach to nadal upokorzenie. „Z półprzymrużeniem oka\" tu nie rozbraja sytuacji, tylko podkreśla cię jako autorytet kosztem koleżanki. Cztery oczy, później, delikatnie.",
        },
      ],
      salon: {
        short:
          "Wolniej, niżej, mniej. Komplement: „Dziękuję, to bardzo miłe.\" Nie poprawiamy publicznie. Mikropauza zamiast natychmiastowej reakcji.",
        expand:
          "Pomniejszanie komplementu jako „skromność\" odrzuca uprzejmość drugiej osoby — to nie skromność, to brak elegancji. „Słucham?\" zamiast „co?\". „Oczywiście\" zamiast „spoko\". „Dzień dobry\" w mailu biznesowym, nie „Hej\". Cisza buduje uwagę — gdy chcesz coś podkreślić, ścisz, nie podnoś głosu.",
        trap:
          "Mówienie „no\" zamiast „tak\" — bardzo potoczne. Wtrącenia: „wiesz?\", „ogólnie\", „po prostu\", „jakby\", „tego\". Podnoszenie głosu, by coś podkreślić — dokładnie odwrotnie: ścisz. Poprawianie publicznie nawet żartem — upokarza, w cztery oczy.",
      },
    },
  },

  // ============================================================
  // 65. Savoir-vivre: rozmowa i small talk
  // ============================================================
  {
    slug: "savoir-rozmowa-i-small-talk",
    vaultSlug: "savoir",
    label: "Savoir-vivre — rozmowa i small talk",
    payload: {
      title: "Rozmowa i small talk",
      summary:
        "Small talk to nie wypełniacz ciszy. To narzędzie, które buduje poziom komfortu i zaufania, zanim cokolwiek poważniejszego się wydarzy. Dobry small talk to MNIEJ gadania, nie więcej. Zasada 70/30: 70 słuchasz, 30 mówisz.",
      theory:
        "Czego unikamy. Pieniędzy (zarobki, ceny, koszty, pensje). Polityki. Religii. Plotek o nieobecnych. Narzekania (pogoda, korki, szef). Własnych dramatów. Zdrowia (poza grzecznościowym „jak się Pani miewa\").\n\nBezpieczne i ciekawe tematy. Podróże (gdzie ostatnio, co zaskoczyło). Kultura (wystawy, książki, koncerty, teatr). Jedzenie i wino. Sport (jeśli wiesz, że osoba się interesuje). Aktualne wydarzenia kulturalne (bez polityki). Miasto, w którym jesteście. Pogoda jako wstęp, nie temat główny.\n\nZasada 70/30: 70 procent słuchasz, 30 mówisz. Pytania otwarte zamiast zamkniętych. „Co Panią ostatnio zaciekawiło?\" / „Byłaś ostatnio na czymś, co Cię poruszyło?\" / „Skąd pomysł na ten kierunek?\"\n\nJak mówić o sobie: konkretnie, bez chwalenia się, bez fałszywej skromności. „Pracuję w consultingu strategicznym w EY\" wystarczy. NIE: „jestem tylko zwykłą konsultantką\" ani „robię gigantyczne projekty dla zarządów\".\n\nReguły wewnętrzne. Jeśli mówisz dłużej niż dwie minuty bez przerwy — oddaj głos. Nie konkurujemy historiami („też tam byłam, ja jeszcze lepiej...\"). Nie domykamy cudzych zdań.",
      questions: [
        {
          type: "abc",
          text: "Zasada 70/30 w small talku to:",
          options: [
            "70% mówisz, 30% słuchasz",
            "70% słuchasz, 30% mówisz",
            "70% pijesz wodę, 30% wino",
          ],
          correctAnswer: 1,
          explanation:
            "Słuchanie buduje relację, mówienie tylko ją demonstruje. Większość ludzi robi odwrotnie i to widać.",
        },
        {
          type: "abc",
          text: "Lepsze otwarcie rozmowy:",
          options: [
            "„Co u Ciebie?\" — uniwersalne i grzeczne",
            "„Co u Ciebie po Lizbonie?\" / „Jak udała się rozmowa o awansie?\" — konkretne pytanie z kontekstem",
            "„Ile teraz zarabiasz?\"",
          ],
          correctAnswer: 1,
          explanation:
            "Konkret + pamięć o drugiej osobie. „Co u Ciebie?\" jest puste, otwarcie z konkretem pokazuje zainteresowanie.",
        },
        {
          type: "fill",
          text: "Tematy, których unikamy w small talku: pieniądze, polityka, religia, plotki, _____ .",
          options: null,
          correctAnswer: "narzekanie",
          explanation:
            "Plus własne dramaty i zdrowie. Narzekanie na pogodę, korki, szefa to klasyczna pułapka — wciąga rozmówcę w negatywność.",
        },
        {
          type: "fill",
          text: "Jeśli mówisz dłużej niż _____ minuty bez przerwy, oddaj głos.",
          options: null,
          correctAnswer: "dwie",
          explanation:
            "Wewnętrzny licznik. Po 2 minutach jesteś już na granicy monologu — dobry moment na pytanie zwrotne.",
        },
        {
          type: "open",
          text: "Sformułuj uniwersalne otwarcie do nowej rozmowy, które zaprasza do osobistej, ale bezpiecznej odpowiedzi.",
          options: null,
          correctAnswer:
            "„A co ostatnio Cię naprawdę poruszyło? Cokolwiek — książka, wystawa, wieczór z kimś, podróż.\" Otwarte (nie tak/nie), wymaga konkretu, daje pole na osobistość bez przymusu, naturalnie prowadzi dalej. Alternatywy: „Co Pana ostatnio zaciekawiło?\" / „Byłaś gdzieś w ostatnim czasie, co zaskoczyło?\" / „Co teraz czytasz / oglądasz, co warto?\". Wszystkie z pytaniem otwartym, konkretnym, niebanalnym, ale bezpiecznym.",
          explanation:
            "Klucz: otwartość + konkret + bezpieczeństwo. Pytanie ma zaprosić, nie wymusić odpowiedź.",
        },
        {
          type: "spot_error",
          text: "„Bardzo dobre opowiadanie o Twojej wycieczce do Kioto. A ja właśnie też tam byłam, ale w lepszym hotelu i z lepszym przewodnikiem — chcesz, opowiem Ci, jak my to zrobiliśmy?\"",
          options: [
            "tak, dzielimy się doświadczeniem",
            "nie — konkurowanie historiami („jeszcze lepiej u mnie\") jest sygnałem braku pewności, nie elegancji",
            "Kioto to złe miasto",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Klasyczna pułapka „ja jeszcze lepiej\". Każda Twoja historia jako lepsza wersja cudzej sygnalizuje, że nie potrafisz po prostu słuchać.",
        },
      ],
      salon: {
        short:
          "70 procent słuchaj, 30 mów. Pytania otwarte zamiast zamkniętych. Unikać: pieniądze, polityka, religia, plotki, narzekanie. O sobie konkretnie — bez minimalizmu i podbijania.",
        expand:
          "Bezpieczne i ciekawe tematy: podróże, kultura, jedzenie i wino, sport (jeśli interesuje rozmówcę), aktualne wydarzenia kulturalne, miasto. Pogoda tylko jako wstęp. „Co Pana ostatnio zaciekawiło?\" zamiast „Co u Pana?\". Jeśli mówisz dłużej niż dwie minuty bez przerwy — oddaj głos.",
        trap:
          "Wypełnianie ciszy — cisza jest OK i często pożądana. Konkurowanie historiami („też tam byłam, ja jeszcze lepiej\") to sygnał braku pewności. Pytania o pieniądze („ile zarabiasz?\", „ile to kosztowało?\"). Mówienie o własnych dramatach na pierwszym spotkaniu.",
      },
    },
  },

  // ============================================================
  // 66. Savoir-vivre: biznes
  // ============================================================
  {
    slug: "savoir-biznes",
    vaultSlug: "savoir",
    label: "Savoir-vivre — biznes (hierarchia, mail, wideo, lunch)",
    payload: {
      title: "Savoir-vivre biznesowy",
      summary:
        "Biznes ma własną hierarchię i rytuały. Główna różnica od życia towarzyskiego: hierarchia płynie ze stanowiska, nie z płci ani wieku. Profesjonalnie, ciepło, ale bez przesadnej swojskości.",
      theory:
        "Hierarchia: stanowisko > wiek > płeć. CEO podaje rękę pierwszy niezależnie od tego, kim jest. W mailach, telefonach, spotkaniach: ten sam kod.\n\nWstawanie do powitania: klient zawsze, w pełni. Przełożony zawsze. Równi rangą: sytuacyjnie, ale z grzeczności lepiej wstać.\n\nU klienta: nie siadamy, dopóki gospodarz nie zaprosi. Czekamy, często wskazują miejsce. Nie wybieramy „tej fajnej kanapy\". Płaszcz, torba: czekamy, aż ktoś nam pokaże, gdzie odłożyć.\n\nMail biznesowy: konkret, struktura, jedna myśl główna. Jasne „czego oczekuję\". Pełne powitanie i pełen podpis. BEZ nadmiernych przeprosin („przepraszam, że zawracam głowę\") — są zbędne i osłabiają. Temat: konkretny, nie „Pytanie\" tylko „Pytanie o termin spotkania w sprawie X\".\n\nWideokonferencja: kamera włączona. Tło neutralne, oświetlenie z przodu (nie pod światło). Mikrofon wyciszony, gdy nie mówisz. Nie jemy, nie czytamy maili — widać. Nie przerywamy: na Zoomie jest „raise hand\". Punktualność: minuta wcześniej w pokoju.\n\nLinkedIn follow-up: w ciągu 24–48 godzin od spotkania. Krótko, konkretnie, z odniesieniem do tego, o czym rozmawialiście. Nie ogólne „miło było poznać\".\n\nLunch biznesowy: kto zaprasza, ten płaci. Nie zamawiamy najdroższych pozycji w menu. Nie pijemy alkoholu, chyba że gospodarz zaproponuje (i nawet wtedy ostrożnie). Telefon poza stołem. Tematy zawodowe pojawiają się raczej w drugiej części lunchu, nie od razu.",
      questions: [
        {
          type: "abc",
          text: "Mail biznesowy — najlepszy temat:",
          options: [
            "„Pytanie\"",
            "„Pytanie o termin spotkania w sprawie X\"",
            "„Pilne!!!\"",
          ],
          correctAnswer: 1,
          explanation:
            "Temat to praca dla odbiorcy — szuka maila później, filtruje, planuje. Konkret zawsze wygrywa z „Pytaniem\" czy „Pilne!!!\".",
        },
        {
          type: "abc",
          text: "Lunch biznesowy — kto płaci?",
          options: [
            "dzielimy rachunek",
            "ten, kto zaprasza",
            "junior",
          ],
          correctAnswer: 1,
          explanation:
            "Kto zaprasza, ten płaci. Junior zaproszony przez senior — senior płaci. Senior zaproszony przez junior — junior płaci. Zasada jest jasna.",
        },
        {
          type: "fill",
          text: "Wideokonferencja: punktualność — minuta _____ w pokoju.",
          options: null,
          correctAnswer: "wcześniej",
          explanation:
            "Wchodzimy minutę przed, sprawdzamy mikrofon, kamerę, tło. Spóźnienie z trzaskiem mikrofonu sygnalizuje brak przygotowania.",
        },
        {
          type: "fill",
          text: "LinkedIn follow-up po spotkaniu — w ciągu _____ –48 godzin.",
          options: null,
          correctAnswer: "24",
          explanation:
            "Świeże w pamięci obu stron. Po tygodniu już niezręczne. Krótko, konkretnie, z odniesieniem do tego, o czym rozmawialiście.",
        },
        {
          type: "open",
          text: "Napisz krótki mail po spotkaniu z klientem (dziękujesz, przesyłasz notatkę).",
          options: null,
          correctAnswer:
            "„Dzień dobry, Pani Anno, dziękuję za czas wczoraj. Przesyłam, jak ustaliliśmy, krótką notatkę i propozycję kolejnych kroków. W razie pytań jestem do dyspozycji. Pozdrawiam serdecznie, Natalia.\" Pełne powitanie, konkret, jasne czego się spodziewam, brak przesadnych przeprosin, pełen podpis. Bez „przepraszam, że zawracam głowę\" — to osłabia.",
          explanation:
            "Klucz: konkret + struktura + pełne powitanie i podpis. Brak nadmiernych przeprosin — osłabiają.",
        },
        {
          type: "spot_error",
          text: "„Hej Marek! Sorry że tak późno, ale chciałam Cię tylko spytać czy może byłaby szansa, gdybyś miał chwilę, dopytać o ten projekt — ale jeśli nie, to oczywiście rozumiem.\"",
          options: [
            "tak, ciepłe i grzeczne",
            "nie — w mailu biznesowym do CEO: „Hej\" zamiast „Dzień dobry, Panie Marku\", nadmierne przeprosiny i tentative phrasing, brak konkretnej prośby",
            "powinno być po angielsku",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Klasyczne błędy: zbyt swojski ton („Hej\"), kumulacja przeprosin („sorry że...\", „chciałam tylko spytać\", „jeśli miałbyś chwilę\"), brak konkretnej prośby. Mail rozmywa odbiorcę.",
        },
      ],
      salon: {
        short:
          "Hierarchia: stanowisko, nie płeć. U klienta: czekamy na zaproszenie do siadania. Mail: konkret, struktura, bez nadmiernych przeprosin. Kamera włączona, mikrofon wyciszony.",
        expand:
          "Lunch biznesowy: kto zaprasza, ten płaci. Nie zamawiamy najdroższych pozycji. Telefon poza stołem. Tematy zawodowe pojawiają się w drugiej części lunchu. LinkedIn follow-up w 24–48 godzin, krótko i konkretnie. Wideokonferencja: minuta wcześniej w pokoju, neutralne tło, mikrofon wyciszony gdy nie mówisz.",
        trap:
          "„Hej Marek\" do CEO — powinno być „Dzień dobry, Panie Marku\". Wchodzenie do meetingu z dziesięciosekundowym spóźnieniem bez „przepraszam za spóźnienie\". Sprawdzanie telefonu przy stole na lunchu biznesowym. Pisanie do klienta po godzinach jako standard — wyjątkowo, z asekuracją.",
      },
    },
  },

  // ============================================================
  // 67. Savoir-vivre: w domu i jako gość
  // ============================================================
  {
    slug: "savoir-w-domu-i-jako-gosc",
    vaultSlug: "savoir",
    label: "Savoir-vivre — w domu i jako gość (RSVP, prezent, wyjście)",
    payload: {
      title: "W domu i jako gość",
      summary:
        "Bycie gościem to mały test charakteru. RSVP, godzina przyjścia, prezent, zachowanie przy stole, wyjście, podziękowanie następnego dnia. Większość ludzi wpada na trzech: brak RSVP, niewłaściwy prezent, komentowanie jedzenia.",
      theory:
        "RSVP. Odpowiadamy najszybciej jak się da, najpóźniej w ciągu 2–3 dni. NIE zostawiamy gospodarza w niewiedzy. Jeśli przyjdziemy: „Z przyjemnością przyjdę, dziękuję za pamięć.\" Jeśli nie: „Niestety nie dam rady, mam już zaplanowane X. Bardzo dziękuję za zaproszenie.\" Alergie i preferencje zgłaszamy NA TYM etapie, nie przy stole.\n\nPrezent dla gospodarza: wino (jakościowe, nie najtańsze, nie ostentacyjnie drogie), czekoladki (premium), świeca zapachowa (klasyczna marka), kwiaty (bez róż — mogą mieć symbolikę romantyczną).\n\nCzego nie nosimy: ciasto / danie (gospodarz miał własny plan menu), żywe rośliny (kłopot), zbyt drogi prezent (zobowiązuje, robi niezręcznie). Kwiaty: lepiej wysłać wcześniej, niż przynieść w ręce — gospodarz musi szukać wazonu w trakcie przyjmowania innych gości.\n\nGodzina przyjścia: 5–10 minut po wyznaczonej godzinie. Na czas to za wcześnie (gospodarz może jeszcze nie być gotowy). 20+ minut to spóźnienie (informujemy SMSem).\n\nPrzy stole — danie, którego nie jemy: jemy, co możemy. Resztę zostawiamy BEZ KOMENTARZA. NIE: „ja nie jadam ryb\", „tego nie jem\". Jeśli mamy alergię — zgłaszaliśmy ją na etapie RSVP.\n\nPochwała jedzenia: krótko, konkretnie, bez przesady. „Pyszna ta zupa, co tam jest?\" zamiast „O Boże, NAJLEPSZE co jadłam\". Jeśli coś nie wyszło: milczymy.\n\nWyjście: nie pierwsi, nie ostatni. Dziękujemy gospodarzowi przy drzwiach, krótko, ciepło. Nie przeciągamy. Następnego dnia: krótka wiadomość lub kartka z podziękowaniem.",
      questions: [
        {
          type: "abc",
          text: "RSVP — kiedy odpowiadamy?",
          options: [
            "tydzień przed wydarzeniem",
            "w ciągu 2–3 dni od otrzymania zaproszenia",
            "dzień przed",
          ],
          correctAnswer: 1,
          explanation:
            "Gospodarz musi wiedzieć, na ile osób gotować i jak rozsadzić. Brak RSVP to brak szacunku dla jego planowania.",
        },
        {
          type: "abc",
          text: "Wybór prezentu na kolację — NAJLEPIEJ:",
          options: [
            "domowe ciasto",
            "wino (jakościowe), czekoladki (premium), świeca zapachowa",
            "żywa roślina doniczkowa",
          ],
          correctAnswer: 1,
          explanation:
            "Ciasto koliduje z planem menu gospodarza. Roślina to kłopot dla niego. Wino, czekoladki, świeca: bezpieczne i konsumowalne.",
        },
        {
          type: "fill",
          text: "Godzina przyjścia: _____ –10 minut po wyznaczonej godzinie (na czas to za wcześnie).",
          options: null,
          correctAnswer: "5",
          explanation:
            "Gospodarz dokończ przygotowania w ostatnich minutach. Punktualność „na minutę\" zmusza go do otwarcia drzwi w momencie chaosu.",
        },
        {
          type: "fill",
          text: "Następnego dnia po wydarzeniu wysyłamy krótkie _____ za zaproszenie.",
          options: null,
          correctAnswer: "podziękowanie",
          explanation:
            "SMS, krótka wiadomość, kartka przy większym wydarzeniu. Drobiazg, który gospodarz pamięta.",
        },
        {
          type: "open",
          text: "Napisz SMS z podziękowaniem do gospodyni, dzień po kolacji.",
          options: null,
          correctAnswer:
            "„Aniu, bardzo dziękuję za wczoraj. Wyjątkowo dobry wieczór, kolacja absolutnie pyszna. Następnym razem ja gotuję. Buziaki.\" Krótko, konkretnie, ciepło. Konkret („kolacja\", „wieczór\"). Wzajemność („następnym razem ja\"). Bez patosu („nigdy nie zapomnę!\") i bez minimalizmu („dzięki za zaproszenie\").",
          explanation:
            "Klucz: ciepło + konkret + propozycja wzajemności. Trzy elementy w 4 zdaniach.",
        },
        {
          type: "spot_error",
          text: "Na kolacji u znajomych podają rybę, której nie jesz: „Ach, ja akurat ryb nie jadam — czy mogłabym dostać coś innego?\"",
          options: [
            "tak, gospodarz powinien wiedzieć",
            "nie — alergie i preferencje zgłaszamy na etapie RSVP. Przy stole: jemy co możemy (warzywa, dodatki), resztę zostawiamy bez komentarza",
            "trzeba wyjść",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Klasyczny błąd. Zmienianie zamówienia w trakcie kolacji u kogoś w domu stawia gospodarza w niezręcznej sytuacji. Preferencje — RSVP. Przy stole: jemy, co można.",
        },
      ],
      salon: {
        short:
          "RSVP zawsze i szybko. Prezent: wino, kwiaty (wcześniej), czekoladki, świeca. Przyjście: 5–10 minut po godzinie. Danie, którego nie jesz: bez komentarza. Następnego dnia: krótkie podziękowanie.",
        expand:
          "Czego nie nosimy w prezencie: ciasto / danie (gospodarz miał własny plan menu), żywe rośliny (kłopot), zbyt drogi prezent (zobowiązuje). Pochwała jedzenia: krótko, konkretnie. „Pyszna ta zupa, co tam jest?\" zamiast „O Boże, najlepsze co jadłam\". Jeśli coś nie wyszło — milczymy.",
        trap:
          "Nie odpowiadać na zaproszenie. Przyjść równo o godzinie (gospodarz może jeszcze nie być gotowy). Przynieść tort, gdy gospodarz przygotował deser. Komentować jedzenie negatywnie. Wyjść jako pierwsi, tuż po posiłku. Nie podziękować następnego dnia.",
      },
    },
  },

  // ============================================================
  // 68. Savoir-vivre: old money micro-rules
  // ============================================================
  {
    slug: "savoir-old-money-micro-rules",
    vaultSlug: "savoir",
    label: "Savoir-vivre — old money micro-rules (rób mniej)",
    payload: {
      title: "Old money micro-rules",
      summary:
        "Mikrokod, który wynosi się z domów, w których obycie było normą, a nie projektem. Rozpoznawalny dla tych, którzy wiedzą — niewidoczny dla reszty. Większość polega na jednej rzeczy: robić mniej, niż chce się robić.",
      theory:
        "Rób mniej. Mniej gestów, mniej mimiki, mniej ozdoby, mniej biżuterii, mniej perfum. Mniej słów na potwierdzenie czegoś oczywistego. Mniej zawsze wygląda lepiej.\n\nRób chwilę później. Nie jesteś pierwsza, która reaguje, mówi, sięga, śmieje się. Mikrosekunda opóźnienia daje dystans i władzę nad rytmem. Nie wskakujesz z odpowiedzią natychmiast po pytaniu.\n\nDrugi plan. Nie środek pokoju. Nie środek rozmowy. Nie pierwsza opowiadasz, jak było. Zostawiasz przestrzeń, żeby inni mogli się pokazać. Centrum nie jest sygnałem statusu — jest sygnałem braku statusu.\n\nRytm, nie tempo. Nie chodzi o sztuczne spowolnienie. Chodzi o ten sam rytm w ruchu, który zaczęłaś. Sięgnęłaś po kieliszek — dopijasz spokojnie, odkładasz. Nie krzątasz się, nie zaczynasz trzech rzeczy naraz.\n\nNie obciążaj. Innych swoją obecnością, swoimi problemami przy każdej okazji, potrzebą uwagi. Bycie w pokoju ma być przyjemnością dla wszystkich, nie projektem.\n\nNie dominuj przestrzeni. Głosem, gestami, śmiechem. Perfumami (lekkie, dyskretne). Biżuterią (jakość ponad ilość). Opowieściami o sobie.\n\nNie tłumacz się. Z prezentu, który dałaś. Z wyboru jedzenia, ubrania, miejsca. Z opinii. „Tak postanowiłam\" wystarczy. Nadmiar wyjaśnień osłabia.\n\nZdanie-kotwica: „Robię mniej, trochę później i zawsze zostawiam przestrzeń.\"",
      questions: [
        {
          type: "abc",
          text: "Klucz old money micro-rules to:",
          options: [
            "robić więcej i lepiej niż inni",
            "robić mniej, trochę później i zostawiać przestrzeń",
            "być w centrum uwagi",
          ],
          correctAnswer: 1,
          explanation:
            "Zdanie-kotwica. Mniej zawsze wygląda lepiej. Centrum nie jest sygnałem statusu — jest sygnałem braku statusu.",
        },
        {
          type: "abc",
          text: "Ktoś pyta, czemu kupiłaś tę konkretną świecę dla gospodyni. Reakcja:",
          options: [
            "rozbudowany wykład o pochodzeniu, marce, cenie i intencji",
            "„Tak postanowiłam\" / krótka konkretna odpowiedź bez tłumaczenia",
            "milczysz",
          ],
          correctAnswer: 1,
          explanation:
            "Nie tłumacz się z prezentów, wyborów, opinii. Nadmiar wyjaśnień osłabia. „Tak postanowiłam\" wystarczy.",
        },
        {
          type: "fill",
          text: "Cel obecności w pokoju to być „tą, przy której _____ być\", nie „tą, która była głośna\".",
          options: null,
          correctAnswer: "dobrze",
          explanation:
            "Test: po wyjściu z pokoju, jaką pamięć po sobie zostawiasz? „Tą, przy której było dobrze być\" — to cel.",
        },
        {
          type: "fill",
          text: "Mikrosekunda _____ przed reakcją daje dystans i władzę nad rytmem.",
          options: null,
          correctAnswer: "opóźnienia",
          explanation:
            "Nie wskakujesz z odpowiedzią natychmiast po pytaniu. Pół sekundy ciszy = sygnalizacja, że myślisz, że masz dystans.",
        },
        {
          type: "open",
          text: "Wytłumacz, czemu tłumaczenie wyborów („kupiłam to tylko dlatego, że...\") osłabia.",
          options: null,
          correctAnswer:
            "Tłumaczenie zakłada, że Twoja decyzja wymaga obrony — sygnalizujesz, że spodziewasz się krytyki albo niezrozumienia. To osłabia pozycję: stajesz się petentką własnej decyzji. Plus tłumaczenia są nudne (rozmówca pyta z grzeczności, nie dla analizy zakupu) i przedłużają temat, który już powinien być zamknięty. „Tak postanowiłam\" / „Bo lubię\" zamyka pętlę z godnością — to wybór, nie obrona. Ta sama zasada w pracy: tłumaczenie się z decyzji strategicznej przed zarządem osłabia, krótkie i konkretne uzasadnienie wzmacnia.",
          explanation:
            "Klucz: tłumaczenie = obrona = słaba pozycja. „Tak postanowiłam\" = decyzja = pewność.",
        },
        {
          type: "spot_error",
          text: "Na przyjęciu chcesz pokazać klasę: wchodzisz pierwsza do środka pokoju, mówisz głośno, śmiejesz się intensywnie z każdego żartu, opowiadasz swoją najnowszą historię.",
          options: [
            "tak — pokazujesz pewność",
            "nie — to dokładnie odwrotnie do old money mikrokodu. Drugi plan, mniej gestów, chwilę później, mniej opowieści o sobie",
            "powinnaś tańczyć",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Klasyczna pułapka: próba „wypełnienia\" przestrzeni, żeby pokazać wartość. Dokładnie odwrotnie. Bycie pierwszą, która reaguje na wszystko — sygnał napięcia, nie pewności.",
        },
      ],
      salon: {
        short:
          "Mikrokod: rób mniej, trochę później i zawsze zostawiaj przestrzeń. Centrum nie jest sygnałem statusu — jest sygnałem braku statusu.",
        expand:
          "Mniej gestów, mniej mimiki, mniej ozdoby, mniej biżuterii, mniej perfum. Rytm, nie tempo — kończ jeden ruch, zanim zaczniesz kolejny. Nie tłumacz się z prezentów, wyborów, opinii — „Tak postanowiłam\" wystarczy. Test po wyjściu z pokoju: „tą, przy której było dobrze być\", nie „tą, która była głośna\".",
        trap:
          "Próba „wypełnienia\" przestrzeni, żeby pokazać wartość — dokładnie odwrotnie. Bycie pierwszą, która reaguje na wszystko — sygnał napięcia. Tłumaczenie wyborów osłabia. Nadmiar perfum, biżuterii, opowieści, śmiechu, obecności. Wymyślanie historii, żeby zabłysnąć — drugi plan jest mocniejszy.",
      },
    },
  },

  // ============================================================
  // 69. Savoir-vivre: przestrzeń publiczna
  // ============================================================
  {
    slug: "savoir-przestrzen-publiczna",
    vaultSlug: "savoir",
    label: "Savoir-vivre — przestrzeń publiczna (test klasy)",
    payload: {
      title: "Przestrzeń publiczna",
      summary:
        "Jak zachowujesz się tam, gdzie Cię nikt nie zna, to Twoja prawdziwa wersja. Restauracja, teatr, hotel, samolot, taksówka, ulica. Główna zasada: traktuj personel z szacunkiem zawsze. To największy test klasy.",
      theory:
        "Restauracja: „Dzień dobry\" przy wejściu, kontakt wzrokowy. Kelner to człowiek — „dzień dobry, proszę, dziękuję\". Nie wołamy „halo!\". Telefon na stole: nie. Płacenie dyskretne. Napiwek: 10–15% w Polsce i Europie, 18–20% w USA.\n\nTeatr / opera: spóźnienie = czekamy do przerwy, NIE wchodzimy w trakcie aktu. Ubranie smart, raczej ciemne, klasyczne. Telefon całkowicie wyciszony (nie wibracja — słychać). Bisy: klaskamy do końca, nie wychodzimy gwałtownie. Po wejściu do rzędu: idziemy twarzą do siedzących, mówimy „przepraszam\".\n\nTaksówka / Uber: „Dzień dobry\" przy wsiadaniu, „Dziękuję\" przy wysiadaniu. Nie głośne rozmowy telefoniczne. Drzwi zamykamy bez trzaskania. Nie zostawiamy śmieci.\n\nHotel: personel „dzień dobry, dziękuję\", kontakt wzrokowy. W lobby nie głośno, nie z telefonem na głośnomówiącym. Pokój zostawiamy w stanie cywilizowanym. Napiwek dla porterki (10–20 zł), dla housekeepingu na nocnym stoliku ostatniego dnia.\n\nSamolot: personel pokładowy — szacunek bezwarunkowy. Oparcie fotela opuszczamy delikatnie. Bagaż podręczny — nie blokujemy przejścia. Cisza nocna na długodystansowych. W klasach wyższych: nie ostentacyjnie.\n\nUlica: nie zatrzymujemy się w środku przejścia. Drzwi przytrzymujemy następnej osobie. Telefon na głośnomówiącym w miejscu publicznym: nie. Schody, eskalator: stoimy z prawej, lewa do wyprzedzania.\n\nZdanie-kotwica: „Klasa nie polega na tym, jak traktujesz tych, którzy są nad Tobą. Polega na tym, jak traktujesz tych, którzy są pod Tobą służbowo.\"",
      questions: [
        {
          type: "abc",
          text: "Spóźniasz się 5 minut na teatr — co robisz?",
          options: [
            "wchodzisz cicho do rzędu",
            "czekasz do przerwy, NIE wchodzisz w trakcie aktu",
            "wracasz do domu",
          ],
          correctAnswer: 1,
          explanation:
            "Wejście w trakcie aktu zakłóca wszystkim — aktorom i publiczności. Czekamy do przerwy, nawet jeśli to godzina.",
        },
        {
          type: "abc",
          text: "Test klasy w przestrzeni publicznej to:",
          options: [
            "jak traktujesz tych, którzy są nad Tobą",
            "jak traktujesz tych, którzy są pod Tobą służbowo (kelner, kierowca, recepcja)",
            "jak się ubierasz",
          ],
          correctAnswer: 1,
          explanation:
            "Wszyscy są mili do przełożonych. Klasę widać w stosunku do osób, które „nie muszą\" Ci się odwdzięczać. Kelner zapamięta gościa miłego i niemiłego.",
        },
        {
          type: "fill",
          text: "Standardowy napiwek w Polsce i Europie: _____ –15%.",
          options: null,
          correctAnswer: "10",
          explanation:
            "10–15% w Europie. W USA 18–20% (tam kelnerzy żyją głównie z napiwków). W Japonii napiwek jest uznawany za niegrzeczny.",
        },
        {
          type: "fill",
          text: "Eskalator: stoimy z _____ , lewa do wyprzedzania.",
          options: null,
          correctAnswer: "prawej",
          explanation:
            "Międzynarodowy standard (poza UK, gdzie odwrotnie). Stanie po lewej blokuje ruch, irytuje zazwyczaj milcząco.",
        },
        {
          type: "open",
          text: "Wytłumacz, czemu sposób traktowania kelnera mówi więcej niż sposób traktowania CEO klienta.",
          options: null,
          correctAnswer:
            "Wszyscy są mili do CEO klienta — to oczywiste, on ma władzę, opinia o nas się liczy. Ale kelner, kierowca, recepcjonistka nie mogą Cię „ukarać\" w żaden poważny sposób. Jeśli z nimi też jesteś miła i konkretnie pomocna, to znaczy, że uprzejmość jest Twoją wartością, nie strategią. Jeśli jesteś dobra do CEO i opryskliwa do kelnera, to ujawniasz, że dobre maniery są transakcją, nie tożsamością. Klasa to spójność zachowania niezależnie od relacji władzy — i to widzi każdy obserwator z zewnątrz, łącznie z tym samym CEO, który zaprosił Cię na kolację.",
          explanation:
            "Klucz: spójność = klasa. Niespójność = grzeczność jako strategia.",
        },
        {
          type: "spot_error",
          text: "Kelner wolno cię obsługuje, chcesz wezwać uwagę — wołasz głośno „Halo, halo! Tu poproszę!\".",
          options: [
            "tak — trzeba czasem stanowczo",
            "nie — spokojny kontakt wzrokowy wystarczy. „Halo!\" w kelnera nigdy",
            "kelner nie istnieje",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Klasyczna pułapka. Spokojne uniesienie wzroku, lekki gest dłonią, ewentualnie cicho „Przepraszam\" gdy kelner mija. „Halo!\" jest agresywne i obniża własną klasę.",
        },
      ],
      salon: {
        short:
          "Klasa nie polega na tym, jak traktujesz tych, którzy są nad Tobą. Polega na tym, jak traktujesz tych, którzy są pod Tobą służbowo. Kelner, kierowca, recepcjonistka — to jest test.",
        expand:
          "Wszędzie: „dzień dobry, dziękuję, proszę\" z kontaktem wzrokowym. Teatr: spóźnienie = czekamy do przerwy. Restauracja: telefon poza stołem. Samolot, hotel, taxi: personel z szacunkiem zawsze. Ulica: prawa strona na schodach, drzwi przytrzymujemy następnej osobie. Telefon na głośnomówiącym w miejscu publicznym — nigdy.",
        trap:
          "Wołanie na kelnera („halo!\") — nigdy. Wejście do teatru w trakcie aktu — nigdy. Telefon na głośnomówiącym w restauracji, Uberze, hotelu, samolocie. Pasywno-agresywne uwagi do personelu („no nie wiem, w innych miejscach to robią szybciej\"). Trzaskanie drzwiami auta.",
      },
    },
  },

  // ============================================================
  // 70. Savoir-vivre: tempo i cisza
  // ============================================================
  {
    slug: "savoir-tempo-i-cisza",
    vaultSlug: "savoir",
    label: "Savoir-vivre — tempo i cisza (mikropauzy, niżej/wolniej)",
    payload: {
      title: "Tempo i cisza",
      summary:
        "Cisza jest częścią rozmowy. Tempo, w którym się poruszasz, to sygnał. Spokój czyta się jako pewność siebie. Pośpiech zawsze wygląda na panikę. To jeden z elementów, który najbardziej zmienia wrażenie ogólne, niezależnie od ubioru i słów.",
      theory:
        "Mikropauzy. Krótkie momenty ciszy między pytaniem a odpowiedzią. Między zdaniami. Przed reakcją emocjonalną. Sygnalizują, że myślisz, że masz dystans, że nie reagujesz na automacie. Pół sekundy do sekundy w zupełności wystarczy.\n\nNiewypełnianie ciszy. Jeśli druga osoba zrobi pauzę, NIE wskakujemy z gadaniem. Cisza buduje napięcie i daje przestrzeń obu stronom. W rozmowach biznesowych szczególnie: kto pierwszy wypełnia ciszę, ten ma słabszą pozycję.\n\nSpokojne ruchy. Sięgamy po kieliszek bez nerwowości. Otwieramy torebkę bez gorączkowych ruchów. Wstajemy bez podrywania się. Siadamy z kontrolą, nie z opadem. Każdy ruch zaczynamy świadomie i kończymy świadomie.\n\nBrak pośpiechu w odbiorze. Nawet jeśli mamy mało czasu, nie sprawiamy wrażenia, że biegniemy. Pośpiech wygląda na panikę. Lepiej spóźnić się o 2 minuty i wejść spokojnie, niż wpaść zdyszany dokładnie na czas.\n\nKończenie ruchu. Sięgnęłaś po szklankę — dopijasz spokojnie, odkładasz. Nie zaczynasz trzech rzeczy naraz. To samo z zdaniami: nie urywamy w połowie.\n\nMowa. Niżej niż naturalny impuls. Wolniej niż naturalny impuls. Ciszej, gdy chcesz coś podkreślić (nie głośniej). Ludzie z prawdziwą obecnością mówią niżej i wolniej, niż im się chce.",
      questions: [
        {
          type: "abc",
          text: "Aby coś podkreślić w wypowiedzi:",
          options: [
            "mówimy głośniej",
            "mówimy ciszej",
            "krzyczymy",
          ],
          correctAnswer: 1,
          explanation:
            "Kontrintuicyjne. Ludzie nachylają się i słuchają uważniej, gdy ściszasz. Głośność sygnalizuje napięcie i niepewność, nie autorytet.",
        },
        {
          type: "abc",
          text: "W rozmowie biznesowej pauzuje druga osoba — co robisz?",
          options: [
            "wskakujesz z gadaniem, żeby wypełnić ciszę",
            "trzymasz ciszę, nie wskakujesz",
            "wychodzisz z pokoju",
          ],
          correctAnswer: 1,
          explanation:
            "Kto pierwszy wypełnia ciszę, ma słabszą pozycję. Cisza buduje napięcie i daje przestrzeń obu stronom.",
        },
        {
          type: "fill",
          text: "Mikropauza przed reakcją — pół sekundy do _____ sekundy w zupełności wystarczy.",
          options: null,
          correctAnswer: "jednej",
          explanation:
            "Pół sekundy do sekundy. Niewidoczny dla rozmówcy, ale wystarczający, żeby pokazać dystans i przemyślaną reakcję.",
        },
        {
          type: "fill",
          text: "Lepiej spóźnić się 2 minuty i wejść spokojnie, niż wpaść _____ dokładnie na czas.",
          options: null,
          correctAnswer: "zdyszany",
          explanation:
            "Pierwsze wrażenie po wejściu liczy się bardziej niż minuta punktualności. Zdyszany pokazuje panikę, spokojny 2-minutowy spóźniony — kontrolę.",
        },
        {
          type: "open",
          text: "Trzy konkretne rzeczy do ćwiczenia tygodniami, żeby tempo i cisza weszły automatycznie.",
          options: null,
          correctAnswer:
            "1) Jeden ruch do końca — sięgnęłaś po kieliszek, dopij spokojnie, odłóż, dopiero potem sięgnij po sztućce. Nie krzątaj się. 2) Mikropauza przed odpowiedzią — pół sekundy ciszy po pytaniu zanim odpowiesz. Nie wskakuj. 3) Niższy ton — mów ciemniejszym tonem niż czujesz, że masz ochotę. Po dwóch tygodniach świadomego ćwiczenia te trzy rzeczy wejdą automatycznie. To bardziej praktyka niż wiedza.",
          explanation:
            "Klucz: trzy proste, mierzalne nawyki. Ćwiczenie świadome 2 tygodnie → automatyzm.",
        },
        {
          type: "spot_error",
          text: "W trakcie meetingu sięgasz po długopis, zaczynasz pisać, w połowie odkładasz, sięgasz po szklankę, dopijasz w pośpiechu, jeszcze nie odłożona — już sięgasz po telefon.",
          options: [
            "tak — efektywne wielozadaniowość",
            "nie — to klasyczne „krzątanie\", sygnał napięcia. Jeden ruch do końca, dopiero potem kolejny",
            "powinnaś jeszcze sprawdzać maila",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Krzątanie = sygnał niepewności. Spokojne kończenie każdego ruchu, świadomie, daje obraz osoby skupionej i kontrolującej sytuację.",
        },
      ],
      salon: {
        short:
          "Cisza jest częścią rozmowy. Mikropauzy = czas na myśl, sygnał dystansu. Kończ jeden ruch, zanim zaczniesz kolejny. Niżej, wolniej, ciszej. Pośpiech wygląda na panikę.",
        expand:
          "Trzy rzeczy do ćwiczenia tygodniami: jeden ruch do końca, mikropauza przed odpowiedzią, niższy ton. Po dwóch tygodniach wchodzą automatycznie. Lepiej spóźnić się 2 minuty i wejść spokojnie, niż wpaść zdyszanym na czas. Aby podkreślić coś — ścisz, nie podnoś.",
        trap:
          "Wypełnianie każdej pauzy „yyy\", „no\", „jakby\", „po prostu\". Reagowanie na pytanie zanim druga osoba je skończy. Krzątanie się przy stole — poprawianie włosów, telefonu, serwetki, biżuterii. Mówienie głośniej, gdy chcesz coś podkreślić. Spóźnienie 2 minut + wpadnięcie zdyszanym.",
      },
    },
  },

  // ============================================================
  // 71. Savoir-vivre: sytuacje ryzykowne cheat sheet
  // ============================================================
  {
    slug: "savoir-sytuacje-ryzykowne",
    vaultSlug: "savoir",
    label: "Savoir-vivre — sytuacje ryzykowne (cheat sheet)",
    payload: {
      title: "Sytuacje ryzykowne — cheat sheet",
      summary:
        "Krótka lista pułapek, na których ludzie z dobrą bazą i tak wpadają. Sytuacje, w których pierwszy odruch jest często zły. Powtarzaj przed wyjściem na ważne wydarzenie. Zdanie-kotwica: „Robię mniej, trochę później i zawsze zostawiam przestrzeń.\"",
      theory:
        "Klasyczne scenariusze i poprawne reakcje:\n\n1. Biznes, mężczyzna senior, ja kobieta junior. Czy podaję rękę pierwsza? NIE w biznesie. On podaje. Hierarchia stanowisk, nie płci.\n\n2. Gospodarz wstaje od stołu na chwilę. NIE wstaję. Odkładam sztućce w pauzę V.\n\n3. Spóźniłam się na teatr 5 minut. NIE wchodzę w trakcie aktu — czekam do przerwy.\n\n4. Danie, którego nie jem, na kolacji u kogoś. Jem, co mogę. Resztę bez komentarza. Alergie zgłaszałam na etapie RSVP.\n\n5. Ktoś spóźnia się 10 minut na call bez odzewu. Po 10–15 minutach krótkie miękkie pingnięcie: „Cześć, jesteś? Czekam na linku.\" Bez czekania w nieskończoność i bez pretensji.\n\n6. Komplement „Wyglądasz świetnie\". „Dziękuję, to bardzo miłe.\" Nie „ależ nie\".\n\n7. Ktoś głośno krytykuje obecnego polityka / aktora przy stole. Nie wchodzę. „Hm, interesujące, ja akurat tematu nie znam za dobrze\" lub łagodne przekierowanie: „A propos, kto wybierał wino?\"\n\n8. Prezent, który Ci się nie podoba. „O, to bardzo miłe, dziękuję.\" Bez wymyślania, bez nadgorliwości.\n\n9. Kelner pomylił zamówienie. Spokojnie, ciszej: „Przepraszam, prosiłam o X.\" Bez ostentacji.\n\n10. Ktoś przerywa Ci w rozmowie. Zatrzymujesz się. Mikropauza. Patrzysz spokojnie. Druga osoba kończy. Wracasz: „Wracając do tego, co mówiłam...\" Bez ostentacyjnego „mogę dokończyć?\".\n\n11. Ktoś popełnia błąd merytoryczny publicznie. NIE poprawiamy publicznie. W cztery oczy, później, delikatnie.\n\n12. Wchodzisz do windy z 6 nieznajomymi. „Dzień dobry\" cicho ale wyraźnie. Kontakt wzrokowy.\n\n13. Pytanie o pieniądze („Ile zarabiasz?\"). „Nie chciałabym wchodzić w szczegóły\" lub humorystycznie: „Tyle, ile trzeba.\"",
      questions: [
        {
          type: "abc",
          text: "Dostajesz prezent, który Ci się nie podoba. Najlepsza reakcja:",
          options: [
            "„No nie wiem, ja akurat takich rzeczy nie używam.\"",
            "„O, to bardzo miłe, dziękuję.\"",
            "milczysz",
          ],
          correctAnswer: 1,
          explanation:
            "Bez wymyślania, bez nadgorliwości, bez korygowania na żywo. Szczerość przy prezentach jest brutalna i niesprawiedliwa wobec dawcy.",
        },
        {
          type: "abc",
          text: "Ktoś krytykuje przy stole obecnego polityka — sytuacja gorąca. Co robisz?",
          options: [
            "wchodzisz w dyskusję, bronisz swojego stanowiska",
            "nie wchodzisz, łagodnie przekierowujesz: „A propos, kto wybierał wino?\"",
            "wstajesz i wychodzisz",
          ],
          correctAnswer: 1,
          explanation:
            "Polityka jest na liście tematów do unikania w small talku. Łagodne przekierowanie zachowuje atmosferę. „Hm, interesujące, ja akurat tematu nie znam za dobrze\" też działa.",
        },
        {
          type: "fill",
          text: "Pytanie o pieniądze („Ile zarabiasz?\"). Reakcja: „Nie chciałabym _____ w szczegóły.\"",
          options: null,
          correctAnswer: "wchodzić",
          explanation:
            "„Nie chciałabym wchodzić w szczegóły\" lub humorystycznie: „Tyle, ile trzeba.\" Bez wykładu, bez urażenia.",
        },
        {
          type: "fill",
          text: "Ktoś przerywa Ci w rozmowie. Reakcja: zatrzymujesz się, _____ pauza, patrzysz spokojnie.",
          options: null,
          correctAnswer: "mikro",
          explanation:
            "Mikropauza. Druga osoba kończy. Wracasz: „Wracając do tego, co mówiłam...\" Bez ostentacyjnego „mogę dokończyć?\" — to jest agresywne.",
        },
        {
          type: "open",
          text: "Wymień 3 sytuacje, w których jeden moment pauzy przed reakcją rozwiązuje problem.",
          options: null,
          correctAnswer:
            "1) Ktoś Ci przerwał — mikropauza zamiast natychmiastowej obrony pozwala drugiej osobie skończyć, a Ty wracasz spokojnie. 2) Dostałaś niewygodne pytanie (o pieniądze, prywatne życie) — pauza daje czas na sformułowanie spokojnej odpowiedzi zamiast emocjonalnej reakcji. 3) Słyszysz coś, co Cię zirytowało (krytyka polityka, błąd merytoryczny, nieuprzejmy komentarz) — mikropauza pozwala wybrać, czy w ogóle wchodzić, czy łagodnie przekierować. Zdanie-kotwica: „Robię mniej, trochę później i zawsze zostawiam przestrzeń.\"",
          explanation:
            "Klucz: pauza = wybór. Bez pauzy → automat, często zły. Z pauzą → świadoma reakcja.",
        },
        {
          type: "spot_error",
          text: "Ktoś przy stole popełnia ewidentny błąd merytoryczny. Mówisz głośno: „Aniu, no nie, to jest dokładnie odwrotnie, sprawdź sobie!\"",
          options: [
            "tak — pomagasz koleżance",
            "nie — poprawianie publicznie upokarza, nawet jeśli masz rację merytorycznie. Cztery oczy, później, delikatnie",
            "powinnaś dzwonić do redakcji",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Klasyczna pułapka. Poprawianie publicznie = upokarzanie. W cztery oczy, później, delikatnie. „Aniu, słuchaj, drobiazg, ale wiesz co — chyba pomyliłaś X z Y\". I to też dopiero jeśli to naprawdę ważne.",
        },
      ],
      salon: {
        short:
          "Cheat sheet sytuacji, na których wpada się z dobrym instynktem. Komplement: „Dziękuję, to bardzo miłe.\" Prezent, który się nie podoba: „O, to bardzo miłe, dziękuję.\" Pytanie o pieniądze: „Nie chciałabym wchodzić w szczegóły.\"",
        expand:
          "Gospodarz wstaje na chwilę → ja zostaję, sztućce w V. Spóźnienie na teatr → czekam do przerwy. Danie którego nie jem → jem co mogę, bez komentarza. Ktoś krytykuje polityka → łagodne przekierowanie. Ktoś przerywa → mikropauza, czekam, wracam spokojnie. Pomylenie kelnera → spokojnie, ciszej.",
        trap:
          "Poprawianie publicznie nawet w słusznej sprawie. Wchodzenie w dyskusję polityczną przy stole. Brutalna szczerość przy prezentach. Ostentacyjne „no, mogę dokończyć?\" gdy ktoś przerwał. Wykład w odpowiedzi na pytanie o pieniądze. Jeden moment pauzy przed reakcją zwykle rozwiązuje połowę sytuacji.",
      },
    },
  },

  // ============================================================
  // 72. Muzyka: pojęcia klasyczne (słownik bazowy)
  // ============================================================
  {
    slug: "music-pojecia-muzyki-klasycznej",
    vaultSlug: "music",
    label: "Muzyka — pojęcia klasyczne (słownik bazowy)",
    payload: {
      title: "Pojęcia muzyki klasycznej",
      summary:
        "Działający słownik dla obycia kulturowego — koncert vs symfonia vs uwertura, tempa po włosku, muzyka programowa vs absolutna. Te same pojęcia wracają przy każdym kompozytorze.",
      theory:
        "Formy muzyczne. Koncert — utwór na instrument solowy (lub kilka) i orkiestrę. Solista i orkiestra prowadzą dialog. Najczęściej trzyczęściowy: szybko–wolno–szybko. Przykład: Cztery pory roku Vivaldiego.\n\nSymfonia — duży utwór na całą orkiestrę, bez solisty (chyba że dodany jak w IX Beethovena). Najczęściej czteroczęściowy. Przykład: IX Symfonia Beethovena.\n\nUwertura — oryginalnie utwór otwierający operę lub balet. Z czasem pojawiła się też uwertura koncertowa, czyli samodzielny utwór orkiestrowy (Uwertura 1812 Czajkowskiego).\n\nOpera — dzieło sceniczne łączące muzykę, śpiew, dramat i scenografię. Postaci śpiewają zamiast mówić.\n\nTempa (po włosku — Włochy były kolebką muzyki europejskiej w XVII w.): Allegro — szybko, żywo. Adagio — wolno, spokojnie. Largo — jeszcze wolniej, dostojnie. Andante — tempo spacerowe, „idąc\". Vivace — żywo, szybciej niż allegro. Presto — bardzo szybko.\n\nPojęcia narracyjne. Movement / część / ruch — segment większego utworu. Muzyka programowa — opowiada konkretną historię lub maluje obraz (Uwertura 1812). Przeciwieństwo: muzyka absolutna, czysto dźwiękowa. Motyw — rozpoznawalny krótki fragment melodii, który się powtarza („pa-pa-pa-paaaam\" z V Symfonii). Fanfara — mocny, uroczysty motyw na blaszanych dęciakach. Crescendo — stopniowe narastanie głośności; odwrotność: diminuendo. Aria — solowa pieśń w operze. Recytatyw — półśpiewane fragmenty popychające akcję.",
      questions: [
        {
          type: "abc",
          text: "Czym różni się koncert od symfonii?",
          options: [
            "koncert ma chór, symfonia nie",
            "koncert = solista + orkiestra (dialog); symfonia = cała orkiestra bez solisty",
            "koncert jest krótszy, symfonia dłuższa",
          ],
          correctAnswer: 1,
          explanation:
            "Główna różnica strukturalna. „Koncert skrzypcowy\" = utwór, w którym skrzypek jest solistą obok orkiestry. Symfonia to praca orkiestry jako całości.",
        },
        {
          type: "abc",
          text: "Uwertura zawsze coś otwiera?",
          options: [
            "tak — to z definicji wstęp do opery lub baletu",
            "nie — może też być samodzielnym utworem (uwertura koncertowa, np. Uwertura 1812)",
            "tylko symfonię",
          ],
          correctAnswer: 1,
          explanation:
            "Oryginalnie tak (wstęp), ale z czasem pojawiła się uwertura koncertowa — samodzielne dzieło orkiestrowe. Czajkowski 1812 to klasyczny przykład.",
        },
        {
          type: "fill",
          text: "Tempo „wolno, spokojnie\" po włosku to _____ .",
          options: null,
          correctAnswer: "adagio",
          explanation:
            "Adagio = wolno. Largo jeszcze wolniej, andante tempo spacerowe. Allegro = szybko, vivace szybciej, presto bardzo szybko.",
        },
        {
          type: "fill",
          text: "Muzyka opowiadająca konkretną historię to muzyka _____ .",
          options: null,
          correctAnswer: "programowa",
          explanation:
            "Programowa = z „programem\" (fabułą, sonetem, opisem). Przeciwieństwo: muzyka absolutna, czysto dźwiękowa bez narracji.",
        },
        {
          type: "open",
          text: "Wytłumacz różnicę między arią a recytatywem w operze.",
          options: null,
          correctAnswer:
            "Aria to solowa pieśń, moment, w którym postać staje na scenie i wyraża swoje emocje muzycznie — pełne melodie, rozwinięte, często wirtuozowskie. Przykład: Habanera Carmen, Pieśń Torreadora Escamilla. Recytatyw to półśpiewane–półmówione fragmenty, służące do popychania akcji — dialog, narracja, przejścia między scenami. Recytatyw jest tekstem z muzycznym akcentem, aria jest muzyką z tekstem. W operze barokowej rozróżnienie jest bardzo wyraźne, w XIX-wiecznej (Verdi, Wagner) zaczyna się zacierać.",
          explanation:
            "Klucz: aria = pieśń (emocje), recytatyw = mówione/śpiewane (akcja). Dwa różne narzędzia w operze.",
        },
        {
          type: "spot_error",
          text: "„Allegro to wesoły, optymistyczny utwór — Beethoven napisał wiele takich.\"",
          options: [
            "tak, allegro znaczy wesoły",
            "nie — allegro w muzyce to TEMPO (szybko), nie nastrój. Po włosku znaczy „wesoły\", ale w muzyce funkcjonuje jako wskazówka tempa",
            "allegro znaczy „bardzo wolno\"",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Klasyczne nieporozumienie. „Allegro\" jako etykieta części utworu mówi o tempie (szybkie). Nastrój może być wesoły, dramatyczny, niepokojący — niezależnie.",
        },
      ],
      salon: {
        short:
          "Koncert = solista + orkiestra. Symfonia = sama orkiestra. Uwertura = otwarcie lub samodzielny utwór. Opera = teatr ze śpiewem. Tempa po włosku.",
        expand:
          "Allegro (szybko), adagio (wolno), largo (jeszcze wolniej), andante (spacerowe), vivace (żywo), presto (bardzo szybko). Muzyka programowa opowiada historię (Uwertura 1812), absolutna jest czystym dźwiękiem. Motyw = powtarzający się „podpis\" utworu (pa-pa-pa-paaaam z V Beethovena). Aria w operze = solowa pieśń, recytatyw = mówione/śpiewane fragmenty.",
        trap:
          "Koncertu jako utworu nie mylić z koncertem jako wydarzeniem. Uwertura nie zawsze coś otwiera. „Symfonia\" w mowie potocznej („coś wielkiego\") to nie to samo co forma muzyczna z konkretną strukturą. Allegro to tempo, nie nastrój — choć po włosku znaczy „wesoły\".",
      },
    },
  },

  // ============================================================
  // 73. Muzyka: Vivaldi — Cztery pory roku
  // ============================================================
  {
    slug: "music-vivaldi-cztery-pory-roku",
    vaultSlug: "music",
    label: "Muzyka — Vivaldi, Cztery pory roku (1720)",
    payload: {
      title: "Vivaldi — Cztery pory roku",
      summary:
        "Około 1720, barok włoski. Cykl czterech koncertów skrzypcowych (NIE symfonii), z dołączonymi sonetami opisującymi muzyczne obrazy. Vivaldi pisał je dla dziewcząt z weneckiego sierocińca. Zapomniany na 200 lat, wrócił do kanonu w XX wieku.",
      theory:
        "Antonio Vivaldi (1678–1741), włoski kompozytor baroku, ksiądz katolicki o rudych włosach — „il Prete Rosso\" (Czerwony Ksiądz). Większość życia w Wenecji, uczył muzyki dziewczęta w Ospedale della Pietà (sierociniec i konserwatorium). To dla nich pisał wiele swoich koncertów. Cztery pory roku skomponował ok. 1720, opublikowane w 1725.\n\nStruktura. Cykl czterech koncertów skrzypcowych, nie jeden utwór i nie symfonia. Każdy koncert ma trzy części w klasycznym układzie barokowym: szybka–wolna–szybka (allegro, largo/adagio, allegro/presto).\n\nMuzyka programowa. Vivaldi dołączył do każdej pory roku sonet opisujący, co dzieje się w muzyce. Wiosna: śpiew ptaków, strumień, burza, taniec pasterzy. Lato: upał, leniwe komary, kukułka, gołąb, dzika burza letnia. Jesień: żniwa, taniec wieśniaków, sen po winie, polowanie. Zima: mróz, drżenie z zimna, ciepły kominek, dzieci ślizgające się na lodzie, wichura.\n\nNajsłynniejsza, najczęściej „reklamowa\" część to Zima, ruch pierwszy — ostro tnąca, dramatyczna melodia z reklam, filmów i czołówek.\n\nPo śmierci jego muzyka zniknęła z głównego obiegu na ok. 200 lat i wróciła do kanonu dopiero w XX wieku.",
      questions: [
        {
          type: "abc",
          text: "Cztery pory roku to:",
          options: [
            "jedna symfonia w czterech częściach",
            "cykl czterech koncertów skrzypcowych, każdy w trzech częściach",
            "opera",
          ],
          correctAnswer: 1,
          explanation:
            "Cztery koncerty, każdy z trzema częściami (12 części razem). To nie symfonia — to cykl koncertów na skrzypce solo plus orkiestra.",
        },
        {
          type: "abc",
          text: "Sonety dołączone przez Vivaldiego do każdej pory roku:",
          options: [
            "to luźna inspiracja, nie odpowiadają konkretnym fragmentom",
            "są dosłowne — burza w sonecie to burza w muzyce, ptaki w sonecie to ptaki w muzyce",
            "powstały dopiero w XX wieku",
          ],
          correctAnswer: 1,
          explanation:
            "Muzyka programowa w czystej postaci. Vivaldi mapował konkretne wersy sonetów na konkretne fragmenty muzyki. To nie metafora — to dosłowne ilustrowanie.",
        },
        {
          type: "fill",
          text: "Vivaldi nauczał muzyki dziewczęta w sierocińcu _____ della Pietà.",
          options: null,
          correctAnswer: "Ospedale",
          explanation:
            "Ospedale della Pietà — wenecki sierociniec, jednocześnie konserwatorium. To dla tych uczennic powstała duża część dorobku Vivaldiego.",
        },
        {
          type: "fill",
          text: "Vivaldi był nazywany „Czerwonym _____ \" z powodu rudych włosów.",
          options: null,
          correctAnswer: "Księdzem",
          explanation:
            "Po włosku „il Prete Rosso\". Był księdzem katolickim, miał rude włosy. Trzy słowa-klucze do Vivaldiego: Wenecja, sierociniec dla dziewcząt, Czerwony Ksiądz.",
        },
        {
          type: "open",
          text: "Wytłumacz, czemu Vivaldi to barok, nie klasycyzm.",
          options: null,
          correctAnswer:
            "Vivaldi działa w pierwszej połowie XVIII wieku, w okresie późnego baroku (1600–1750). Cechy barokowe: koncertująca forma (solista vs orkiestra w dialogu), basso continuo (klawesyn + wiolonczela jako podkład), szybka–wolna–szybka struktura, melodyczna ozdobność, kontrast dynamik. Klasycyzm zaczyna się dopiero z Haydnem i Mozartem w drugiej połowie XVIII wieku, z czteroczęściową symfonią, formą sonatową, większą orkiestrą. Vivaldi i Bach to barok; Haydn, Mozart i wczesny Beethoven to klasycyzm; późny Beethoven i Schubert otwierają romantyzm.",
          explanation:
            "Klucz: chronologia (przed 1750 = barok), forma (basso continuo + concerto grosso), kontrast z Haydnem/Mozartem.",
        },
        {
          type: "spot_error",
          text: "„Vivaldi był uznawany za genialnego kompozytora przez całe życie i przez kolejne pokolenia po śmierci.\"",
          options: [
            "tak, niezmienna sława",
            "nie — był doceniany lokalnie w Wenecji, ale po śmierci jego muzyka zniknęła z głównego obiegu na ok. 200 lat i wróciła do kanonu dopiero w XX wieku",
            "Vivaldi nigdy nie istniał",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Klasyczna pułapka „zawsze sławny\". Vivaldi zmarł w biedzie w Wiedniu, popadł w zapomnienie, jego muzyka odkrywana była w XX wieku przy okazji prac nad Bachem (Bach przepisywał i adaptował Vivaldiego).",
        },
      ],
      salon: {
        short:
          "Vivaldi pisał Cztery pory roku dla dziewcząt z weneckiego sierocińca. Muzyka programowa: każda pora ma sonet, burza w sonecie to burza w muzyce, dosłownie.",
        expand:
          "Cykl czterech koncertów skrzypcowych (nie symfonia), każdy z trzech części (szybka–wolna–szybka). Najsłynniejsza część: Zima ruch I, ten dramatyczny motyw z reklam i filmów. Vivaldi — barok włoski, nie klasycyzm. Po śmierci zapomniany na 200 lat, wrócił do kanonu w XX wieku przy okazji prac nad Bachem.",
        trap:
          "Vivaldi to BAROK, nie klasycyzm. Cztery pory roku to KONCERTY, nie symfonia. Sonety są DOSŁOWNE, nie luźna inspiracja. Vivaldi NIE był sławny przez całe życie — zmarł w biedzie w Wiedniu, odkryty na nowo w XX wieku.",
      },
    },
  },

  // ============================================================
  // 74. Muzyka: Beethoven — IX Symfonia / Oda do radości
  // ============================================================
  {
    slug: "music-beethoven-ix-symfonia",
    vaultSlug: "music",
    label: "Muzyka — Beethoven, IX Symfonia / Oda do radości (1824)",
    payload: {
      title: "Beethoven — IX Symfonia",
      summary:
        "Premiera 7 maja 1824 w Wiedniu. Beethoven był wtedy całkowicie głuchy — pisał „wewnętrznym słuchem\". Pierwsza symfonia w historii z chórem i solistami w finale. Tekst: Schillerowska „Oda do radości\". Dziś hymn Unii Europejskiej.",
      theory:
        "Ludwig van Beethoven (1770–1827), niemiecki kompozytor — postać przełomowa między klasycyzmem a romantyzmem. IX Symfonia („Chóralna\", Choral Symphony) miała premierę 7 maja 1824 w Wiedniu. Beethoven był już wtedy całkowicie głuchy — uczył się partytur tylko z papieru. Tekst finału to wiersz Friedricha Schillera „An die Freude\" (Oda do radości) z 1785 roku. Beethoven nosił pomysł zamiany tego wiersza w muzykę przez większość dorosłego życia.\n\nStruktura: cztery części, podróż od chaosu do radości.\n1. Allegro ma non troppo — chaos, napięcie, walka, motywy rodzące się z ciszy.\n2. Molto vivace, scherzo — rytmiczna, ognista, taneczna, z mocnymi kotłami.\n3. Adagio molto e cantabile — liryczna, spokojna, kontemplacyjna, prawie modlitewna.\n4. Finał — orkiestra cytuje wcześniejsze części i je odrzuca, potem wchodzą soliści i chór z „Odą do radości\".\n\nPierwsza symfonia w historii z chórem i solistami wokalnymi w finale. Rewolucyjne — przepisało reguły gatunku.\n\nPremiera: Beethoven stał przy orkiestrze, ale realnym dyrygentem był Michael Umlauf. Beethoven nie słyszał oklasków po finale. Caroline Unger, młoda altystka, odwróciła go w stronę publiczności, żeby zobaczył brawa.\n\n„Oda do radości\" w aranżacji Herberta von Karajana jest od 1972 oficjalnym hymnem Rady Europy, a od 1985 hymnem Unii Europejskiej (wersja bez tekstu — UE ma wiele języków).",
      questions: [
        {
          type: "abc",
          text: "Co było rewolucyjne w IX Symfonii w 1824 roku?",
          options: [
            "pierwsza symfonia z drukowaną partyturą",
            "pierwsza symfonia w historii z chórem i solistami wokalnymi w finale",
            "pierwszy utwór w tonacji d-moll",
          ],
          correctAnswer: 1,
          explanation:
            "Beethoven przepisał reguły gatunku. Symfonia była dotąd czysto instrumentalna. Dodanie chóru i solistów w finale = całkowita nowość, otwarcie drogi dla późniejszych romantyków (Mahler).",
        },
        {
          type: "abc",
          text: "Beethoven podczas pisania i premiery IX Symfonii:",
          options: [
            "słyszał dobrze",
            "był całkowicie głuchy — pisał „wewnętrznym słuchem\", na premierze ktoś musiał go odwrócić, by zobaczył oklaski",
            "tracił słuch dopiero w trakcie",
          ],
          correctAnswer: 1,
          explanation:
            "Słuch tracił stopniowo od ok. 26 roku życia, pełna głuchota pod koniec. IX powstała w pełnej głuchocie. Caroline Unger odwróciła go w stronę publiczności na premierze — drobiazg, którym można zabłysnąć.",
        },
        {
          type: "fill",
          text: "Tekst finału IX Symfonii to wiersz Friedricha _____ „An die Freude\".",
          options: null,
          correctAnswer: "Schillera",
          explanation:
            "Schiller napisał wiersz w 1785. Beethoven dodał muzykę kilkadziesiąt lat później. „Beethoven napisał Odę do radości\" to skrót — tekst jest Schillerowski.",
        },
        {
          type: "fill",
          text: "Od 1985 roku „Oda do radości\" jest hymnem _____ (organizacja).",
          options: null,
          correctAnswer: "Unii Europejskiej",
          explanation:
            "Aranżacja Herberta von Karajana. UE używa wersji bez tekstu, bo Unia ma wiele języków. Wcześniej od 1972 jako hymn Rady Europy.",
        },
        {
          type: "open",
          text: "Co znaczy „podróż od chaosu do radości\" w strukturze IX Symfonii?",
          options: null,
          correctAnswer:
            "Cztery części opisują wewnętrzną podróż słuchacza. Część I (Allegro ma non troppo) — chaos, napięcie, motywy rodzące się z ciszy, walka. Część II (Molto vivace, scherzo) — taneczna, ale wciąż niespokojna, mocne kotły. Część III (Adagio molto e cantabile) — liryczna, kontemplacyjna, modlitewna. Część IV (Finał) — orkiestra cytuje wcześniejsze części i ODRZUCA je („nie, nie to\"), zanim pojawia się temat Ody do radości w niskich smyczkach, narastający, aż wchodzą soliści i chór z tekstem Schillera. To dramatyczna struktura: od walki przez ciszę do zbiorowej, wokalnej radości.",
          explanation:
            "Klucz: cztery części jako sekwencja narracyjna. Cytowanie i odrzucanie wcześniejszych motywów w finale to jeden z najbardziej dramatycznych momentów w historii muzyki.",
        },
        {
          type: "spot_error",
          text: "„Beethoven napisał i tekst, i muzykę «Ody do radości» — to jego oryginalny wiersz.\"",
          options: [
            "tak, oba elementy są Beethovena",
            "nie — tekst napisał Friedrich Schiller w 1785, Beethoven dodał muzykę kilkadziesiąt lat później (premiera IX Symfonii: 1824)",
            "Schiller był synem Beethovena",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Klasyczna pułapka. Schiller — poeta, niemiecki klasyk, napisał „An die Freude\" w 1785. Beethoven kilkadziesiąt lat później zamienił go w muzykę. To partnerstwo poeta + kompozytor, nie jeden autor.",
        },
      ],
      salon: {
        short:
          "IX Symfonia Beethovena to muzyczna podróż od chaosu do radości. Cztery części, ostatnia z chórem śpiewającym Schillerowską „Odę do radości\". Beethoven był głuchy, gdy ją pisał i stał na premierze.",
        expand:
          "Pierwsza symfonia w historii z chórem i solistami w finale — rewolucja gatunku. Na premierze Caroline Unger, młoda altystka, odwróciła Beethovena w stronę publiczności, żeby zobaczył oklaski, których nie słyszał. Drobiazg, którym można zabłysnąć w rozmowie. Aranżacja Karajana jest dziś hymnem Unii Europejskiej.",
        trap:
          "„Oda do radości\" to wiersz Schillera, Beethoven dodał muzykę. „Choral Symphony\" to przezwisko, nie oficjalna nazwa (oficjalnie: IX Symfonia d-moll op. 125). Beethoven nie był głuchy „od urodzenia\" — tracił słuch stopniowo od 26 roku życia. W Spotify pięć ścieżek nie oznacza pięciu części, finał bywa dzielony technicznie.",
      },
    },
  },

  // ============================================================
  // 75. Muzyka: Czajkowski — Uwertura 1812
  // ============================================================
  {
    slug: "music-czajkowski-uwertura-1812",
    vaultSlug: "music",
    label: "Muzyka — Czajkowski, Uwertura 1812 (1880)",
    payload: {
      title: "Czajkowski — Uwertura 1812",
      summary:
        "1880, romantyzm rosyjski. Utwór programowy o wojnie 1812 (Napoleon vs Rosja) — z Marsylianką, hymnem carskim i prawdziwymi armatami w finale. Pikantny detal: sam Czajkowski tego utworu nie znosił, pisał go na zamówienie.",
      theory:
        "Piotr Czajkowski (1840–1893), rosyjski kompozytor romantyzmu. Uwerturę 1812 napisał w 1880 na zamówienie, z okazji rocznicy zwycięstwa Rosji nad Napoleonem w 1812 (68 lat po wydarzeniu). Sam Czajkowski tego utworu nie lubił — pisał o nim, że jest „bardzo głośny i hałaśliwy\", napisany „bez ciepła i miłości\". Mimo to stał się jednym z jego najsłynniejszych dzieł.\n\nStruktura jako narracja wojny:\n1. Modlitwa rosyjska na początek — motyw cerkiewny, spokojny.\n2. Wejście Francuzów — motyw Marsylianki, francuskiego hymnu.\n3. Bitwa — ścieranie się motywów rosyjskich i francuskich.\n4. Moskwa jako pułapka — Francuzi wchodzą do miasta, ale jest puste i podpalone.\n5. Zima i odwrót — motyw francuski słabnie, zanika, gaśnie.\n6. Triumf Rosji — dzwony cerkiewne, armaty, hymn carski „Boże, chroń cara\".\n\nW oryginalnej wersji Czajkowski przewidział prawdziwe armaty jako instrument. Dziś na otwartych koncertach często odpalane są realne działa lub salwy. Klasyk dętych koncertów plenerowych, zwłaszcza w USA na 4 lipca.\n\nDetale historyczne (anachronizmy): Marsylianka była w 1812 we Francji napoleońskiej już zakazana. Hymn „Boże, chroń cara\" powstał dopiero w 1833 — w 1812 nie istniał. Czajkowski używa obu jako rozpoznawalnych skrótów kulturowych, nie dokumentacji historycznej.",
      questions: [
        {
          type: "abc",
          text: "Stosunek Czajkowskiego do własnej Uwertury 1812 to:",
          options: [
            "duma — uważał ją za swoje arcydzieło",
            "niechęć — pisał, że jest hałaśliwa, „bez ciepła i miłości\", napisał na zamówienie",
            "obojętność",
          ],
          correctAnswer: 1,
          explanation:
            "Pikantny detal historyczny. Mimo niechęci kompozytora — utwór stał się jednym z najsłynniejszych jego dzieł. Klasyczna ironia.",
        },
        {
          type: "abc",
          text: "Rok „1812\" w tytule oznacza:",
          options: [
            "rok kompozycji",
            "rok wojny Napoleona z Rosją, której utwór opowiada",
            "rok śmierci Czajkowskiego",
          ],
          correctAnswer: 1,
          explanation:
            "Czajkowski napisał utwór w 1880 — 68 lat po wydarzeniu, na rocznicę zwycięstwa. Tytuł odnosi się do tematu, nie daty kompozycji.",
        },
        {
          type: "fill",
          text: "Motyw Francuzów w utworze to _____ (hymn francuski).",
          options: null,
          correctAnswer: "Marsylianka",
          explanation:
            "Marsylianka jako skrót kulturowy „Francuzi\". Anachronizm — w 1812 napoleońska Francja zakazała Marsylianki jako pieśni rewolucyjnej. Czajkowski używa jej symbolicznie.",
        },
        {
          type: "fill",
          text: "W finale Czajkowski przewidział prawdziwe _____ jako instrument muzyczny.",
          options: null,
          correctAnswer: "armaty",
          explanation:
            "W partyturze są naprawdę partycerzane „cannons\". Na koncertach plenerowych (zwłaszcza w USA na 4 lipca) odpalane są realne działa lub salwy.",
        },
        {
          type: "open",
          text: "Wymień dwa anachronizmy historyczne w Uwerturze 1812.",
          options: null,
          correctAnswer:
            "1) Marsylianka jako motyw Francuzów — w 1812 napoleońska Francja już zakazała Marsylianki jako pieśni rewolucyjnej, kojarzonej z obaleniem monarchii. Napoleon używał innych pieśni państwowych. Czajkowski używa Marsylianki symbolicznie, bo była rozpoznawalnym skrótem „Francja\" dla publiczności XIX wieku. 2) Hymn carski „Boże, chroń cara\" powstał dopiero w 1833 — w 1812 jeszcze nie istniał. Czajkowski używa go anachronicznie jako symbolu Rosji caratu, choć w realiach 1812 ten hymn jeszcze nie funkcjonował. Oba anachronizmy to dramaturgia, nie historia — Czajkowski pisał uwerturę programową, nie dokument.",
          explanation:
            "Klucz: dwa konkretne anachronizmy + zrozumienie, że programowa muzyka używa skrótów kulturowych, nie dokumentacji.",
        },
        {
          type: "spot_error",
          text: "„Uwertura 1812 to wstęp do opery «1812» Czajkowskiego — opowiada o wydarzeniach przed akcją główną.\"",
          options: [
            "tak, to wstęp do opery",
            "nie — to uwertura koncertowa (concert overture), samodzielne dzieło orkiestrowe, nie wstęp do żadnej opery",
            "Czajkowski nie pisał oper",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "„Uwertura\" sugeruje wstęp, ale uwertura koncertowa to gatunek samodzielny. Czajkowski pisał opery (Eugeniusz Oniegin, Dama pikowa), ale Uwertura 1812 nie należy do żadnej z nich.",
        },
      ],
      salon: {
        short:
          "Uwertura 1812 to muzyczna inscenizacja wojny — Marsylianka naprzeciw rosyjskich melodii cerkiewnych, finał to dzwony i armaty, dosłownie. Najciekawsze: Czajkowski sam tego utworu nie znosił.",
        expand:
          "Pisał o nim, że jest „bardzo głośny i hałaśliwy\", napisany „bez ciepła i miłości\". Mimo to stał się klasykiem dętych koncertów plenerowych, zwłaszcza w USA na 4 lipca. Czajkowski używa anachronizmów (Marsylianka była w 1812 we Francji zakazana, hymn „Boże, chroń cara\" powstał w 1833) jako rozpoznawalnych skrótów kulturowych, nie dokumentacji historycznej.",
        trap:
          "1812 to ROK WOJNY, nie rok kompozycji (utwór z 1880). „Uwertura\" tu nie otwiera opery — to uwertura koncertowa, samodzielna. Marsylianka i „Boże, chroń cara\" są anachroniczne — Czajkowski używa ich symbolicznie. Nie pisał uwertury z patriotycznego porywu — pisał na zamówienie, stąd jego niechęć.",
      },
    },
  },

  // ============================================================
  // 76. Muzyka: Bizet — Carmen
  // ============================================================
  {
    slug: "music-bizet-carmen",
    vaultSlug: "music",
    label: "Muzyka — Bizet, Carmen (1875)",
    payload: {
      title: "Bizet — Carmen",
      summary:
        "Premiera marzec 1875, Opéra-Comique w Paryżu. Skandal — publiczność uznała ją za niemoralną i wulgarną. Bizet zmarł 3 miesiące po premierze (36 lat), nie dożył triumfu. Dziś jedna z najczęściej granych oper świata. Habanera, Pieśń Torreadora, tragiczny finał.",
      theory:
        "Georges Bizet (1838–1875), francuski kompozytor romantyzmu. Carmen, jego najsłynniejsza opera, miała premierę w marcu 1875 w Opéra-Comique w Paryżu. Spotkała się z chłodnym, niemal skandalicznym przyjęciem — publiczność i krytyka uznali ją za niemoralną i wulgarną, bo główna bohaterka to namiętna, niezależna kobieta robotnica, której zachowanie łamało ówczesne konwencje.\n\nBizet zmarł trzy miesiące po premierze, mając 36 lat. Nie dożył triumfu Carmen. Libretto bazuje na noweli Prospera Mériméego z 1845. Akcja w Sewilli.\n\nGłówne postacie:\n— Carmen: cygańska robotnica z fabryki cygar, namiętna, wolna, uwodzicielska, klasyczna femme fatale.\n— Don José: żołnierz, początkowo wzorowy, popada w obsesję na punkcie Carmen i niszczy sobie życie.\n— Micaëla: delikatna, pobożna wieśniaczka, narzeczona Don Joségo, symbol tradycyjnej kobiecości.\n— Escamillo: torreador, gwiazda, celebryta swoich czasów.\n\nKluczowe sceny: fabryka cygar — Carmen śpiewa Habanerę: „Miłość jest dzikim ptakiem, którego nie da się oswoić\". Programowa deklaracja jej filozofii. Bójka, aresztowanie, uwiedzenie Don Joségo. Tawerna w górach z przemytnikami, Escamillo śpiewa Pieśń Torreadora. Carmen wróży sobie z tarota — wypada śmierć. Finał: na arenie w Sewilli Escamillo walczy z bykiem, a Carmen na zewnątrz odrzuca Don Joségo — on zabija ją nożem.\n\nDetale: Habanera nie jest hiszpańska — to rytm KUBAŃSKI, dotarł do Hiszpanii przez Hawanę. Bizet nie był Hiszpanem, pisał o Hiszpanii jako Francuz, nigdy nie był w Sewilli.",
      questions: [
        {
          type: "abc",
          text: "Premiera Carmen w 1875:",
          options: [
            "od razu triumf, owacje na stojąco",
            "skandal — uznana za niemoralną i wulgarną. Bizet zmarł 3 miesiące później, nie dożył triumfu",
            "odwołana przez cenzurę",
          ],
          correctAnswer: 1,
          explanation:
            "Klasyczna historia: krytyka za wulgarność (główna bohaterka — niezależna robotnica), Bizet umarł, opera potem stała się jedną z najczęściej granych na świecie. Ironia.",
        },
        {
          type: "abc",
          text: "Habanera (najsłynniejsza aria Carmen) ma rodowód:",
          options: [
            "czysto hiszpański",
            "kubański — rytm dotarł do Hiszpanii przez Hawanę. Stąd nazwa „habanera\" (od Habana)",
            "francuski",
          ],
          correctAnswer: 1,
          explanation:
            "Habanera = rytm z Hawany, kubański w pochodzeniu. Trafił do Hiszpanii w XIX wieku, stał się popularny w Europie. Bizet (Francuz piszący operę o Hiszpanii) używa go jako lokalnego kolorytu.",
        },
        {
          type: "fill",
          text: "Don José zabija Carmen na końcu opery _____ (czym?).",
          options: null,
          correctAnswer: "nożem",
          explanation:
            "Akt finałowy: na arenie Escamillo walczy z bykiem, a Carmen na zewnątrz odrzuca Don Joségo. Z obsesyjnej miłości i niemożności zaakceptowania jej wolności — zabija ją nożem.",
        },
        {
          type: "fill",
          text: "Sławna aria Escamilla to _____ Torreadora.",
          options: null,
          correctAnswer: "Pieśń",
          explanation:
            "Pieśń Torreadora — wjazdowa aria torreadora, w której opowiada o walce z bykiem. Druga najbardziej rozpoznawalna aria opery po Habanerze.",
        },
        {
          type: "open",
          text: "Wytłumacz, czemu Carmen to nie jest opera „o miłości\".",
          options: null,
          correctAnswer:
            "To opera o OBSESJI, POSIADANIU i WOLNOŚCI, nie o miłości w sentymentalnym sensie. Don José nie kocha Carmen — chce ją mieć i kontrolować. Gdy ona odrzuca go (bo jest wolnym ptakiem, jak deklaruje w Habanerze: „miłość jest dzikim ptakiem, którego nie da się oswoić\"), on jej nie wypuszcza, tylko zabija. Carmen z perspektywy współczesnej to ofiara przemocy ze strony mężczyzny, który nie potrafi zaakceptować, że ona ma prawo go zostawić. W 1875 publiczność zobaczyła to jako „niemoralność\" Carmen, dziś widzimy to jako tragedię patriarchatu. To dlatego opera jest tak żywa — bohaterka mówi „nie\", a system odpowiada przemocą.",
          explanation:
            "Klucz: opera o obsesji i kontroli, nie o miłości. Współczesna interpretacja widzi Carmen jako ofiarę, nie jako „złą kobietę\".",
        },
        {
          type: "spot_error",
          text: "„Carmen to opera napisana przez hiszpańskiego kompozytora, który dorastał w Sewilli i znał miejscowy folklor.\"",
          options: [
            "tak, Bizet był Hiszpanem",
            "nie — Bizet był Francuzem, nigdy nie był w Sewilli. Pisał operę o Hiszpanii jako outsider, używając rytmów (jak kubańska habanera) jako lokalnego kolorytu",
            "Bizet był Włochem",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Bizet to klasyczny przykład XIX-wiecznego „egzotyzmu\" — francuski kompozytor pisze operę o Hiszpanii (egzotyczny południowy temat dla paryskiej publiczności), nigdy nie będąc w Sewilli. Używa rytmów i obrazów jako fantazji o Hiszpanii.",
        },
      ],
      salon: {
        short:
          "Carmen to jedna z tych oper, które przy premierze były skandalem, a dziś są klasykiem. Femme fatale śpiewa Habanerę o tym, że miłość jest jak ptak, którego nie da się zamknąć. Don José zabija ją z zazdrości w finale.",
        expand:
          "Bizet nie dożył sukcesu, umarł trzy miesiące po prapremierze, mając 36 lat. Publiczność 1875 odrzuciła operę jako wulgarną — niezależna robotnica łamała konwencje. Habanera ma rodowód KUBAŃSKI (nie hiszpański), Bizet był Francuzem (nie Hiszpanem) i nigdy nie był w Sewilli. To francuska fantazja o Hiszpanii, klasyczny XIX-wieczny egzotyzm.",
        trap:
          "Carmen to NIE opera „o miłości\" — to opera o obsesji, posiadaniu i wolności. Carmen nie jest „złą kobietą\" — to ofiara przemocy mężczyzny, który nie akceptuje jej wolności. Habanera nie jest hiszpańska, to rytm kubański. Bizet nie był Hiszpanem ani nie był w Sewilli.",
      },
    },
  },

  // ============================================================
  // 77. Blackjack: podstawy i ruchy
  // ============================================================
  {
    slug: "blackjack-podstawy-i-ruchy",
    vaultSlug: "blackjack",
    label: "Blackjack — podstawy i ruchy",
    payload: {
      title: "Blackjack — podstawy i ruchy",
      summary:
        "Grasz przeciw krupierowi, nie przeciw innym graczom. Cała strategia bierze się z trzech rzeczy: Twojej ręki, odkrytej karty krupiera i SZTYWNYCH zasad, według których gra krupier. Im lepiej to znasz, tym mniej decyzji jest „z głowy\".",
      theory:
        "Cel: zbliżyć się do 21 bardziej niż krupier, ale nie przekroczyć 21. Przekroczenie = bust = przegrana automatyczna.\n\nWartości kart: 2–10 wartość nominalna, J/Q/K = 10, As = 1 albo 11 elastycznie (na Twoją korzyść). Blackjack = 21 z dwóch pierwszych kart (As + karta o wartości 10). Wypłaca więcej niż zwykła wygrana (zwykle 3:2).\n\nRozgrywka: Ty i krupier dostajecie po 2 karty. Widzisz jedną odkrytą kartę krupiera, druga jest zakryta. Decydujesz, co zrobić ze swoją ręką. Na końcu krupier odsłania kartę i dobiera według sztywnych zasad.\n\nZasady krupiera (kluczowe dla strategii): krupier DOBIERA do 16 włącznie, STOI na 17 lub więcej. Krupier nie ma wyboru, nie myśli, nie improwizuje. To dlatego przy karcie krupiera 2–6 (słabe karty — łatwo mu się zbustować) grasz zachowawczo, a przy 7–As (silne karty) musisz sama walczyć o lepszy wynik.\n\nMożliwe ruchy:\n— Hit = dobierz kolejną kartę.\n— Stand = zostaję z tym, co mam.\n— Double down = podwajam stawkę i dobieram DOKŁADNIE JEDNĄ kartę (potem stand).\n— Split = mam parę, rozdzielam ją na dwa układy z osobnymi stawkami.\n— Surrender = poddaję się, oddaję połowę stawki (nie zawsze dostępne).\n— Insurance = „ubezpieczenie\", gdy krupier ma Asa. Zła stawka matematycznie — NIE bierz.\n\nBlackjack płaci 3:2, zwykła wygrana 1:1 — dlatego blackjacka nie „ulepsza\" się splittem dziesiątek.",
      questions: [
        {
          type: "abc",
          text: "Zasady krupiera (te sztywne, niezmienne):",
          options: [
            "krupier dobiera do 17, stoi na 18+",
            "krupier dobiera do 16, stoi na 17+",
            "krupier sam decyduje, kiedy stoi",
          ],
          correctAnswer: 1,
          explanation:
            "Fundament całej strategii. Krupier dobiera do 16 włącznie, stoi na 17+. Nie ma wyboru, nie myśli. Stąd wynika logika kart słabych (2–6) vs silnych (7–As).",
        },
        {
          type: "abc",
          text: "Insurance, gdy krupier pokazuje Asa:",
          options: [
            "zawsze bierz — to ubezpieczenie przed jego blackjackiem",
            "matematycznie to zła stawka — pomijaj",
            "tylko przy wysokich stawkach",
          ],
          correctAnswer: 1,
          explanation:
            "Insurance brzmi sensownie, ale matematycznie jest niekorzystne — kasyno na tym zarabia. Pomijaj zawsze, niezależnie od ręki.",
        },
        {
          type: "fill",
          text: "Blackjack (21 z dwóch pierwszych kart) wypłaca _____ :2 — więcej niż zwykła wygrana 1:1.",
          options: null,
          correctAnswer: "3",
          explanation:
            "3:2 = postawisz 100 zł, wygrywasz 150 zł zysku (plus zwrot stawki). Stąd nie ulepsza się blackjacka splittem dziesiątek — 20 to nadal 1:1, a oryginalny 21 to byłoby 3:2.",
        },
        {
          type: "fill",
          text: "Ruch „double down\" pozwala dobrać DOKŁADNIE _____ karta.",
          options: null,
          correctAnswer: "jedną",
          explanation:
            "Podwajasz stawkę, dostajesz tylko jedną kartę, potem stand. To nie nieskończony hit — decyzja jest ostateczna. Stąd double działa najlepiej, gdy masz mocną rękę (9–11) i wiesz, że jedna karta wystarczy.",
        },
        {
          type: "open",
          text: "Czemu „mam 16\" nie jest pełną decyzją w blackjacku?",
          options: null,
          correctAnswer:
            "Bo decyzja zawsze zależy od KARTY KRUPIERA, nie tylko od Twojej ręki. „Mam 16\" to dopiero pół informacji. „Mam 16, a krupier ma 6\" = stand (jego słaba karta, niech sam się bustuje). „Mam 16, a krupier ma 10\" = hit (jego prawdopodobnie 20, musisz ryzykować na lepszy wynik). Cała strategia bazuje na dwóch zmiennych jednocześnie: ja + krupier. Patrzenie tylko na siebie to klasyczny błąd początkujących.",
          explanation:
            "Klucz: dwie zmienne, nie jedna. Ręka gracza + karta krupiera = decyzja. To dlatego basic strategy jest tabelą 2D, nie listą.",
        },
        {
          type: "spot_error",
          text: "„Bustowałam się, ale krupier potem też się zbustował — więc remis.\"",
          options: [
            "tak, remis",
            "nie — bust = automatyczna przegrana, NAWET jeśli krupier potem też się zbustuje. Dlatego nie naciska się na 17+",
            "kasyno musi zwrócić stawkę",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Klasyczny błąd. Bust gracza = natychmiastowa przegrana, krupier nawet nie odsłania karty. Stąd asymetria: nie ma sensu hitować na 17+, lepiej przegrać po cichu z lepszym krupierem niż dobrowolnie się zbustować.",
        },
      ],
      salon: {
        short:
          "Krupier dobiera do 16, stoi na 17. Nie myśli, nie improwizuje. Stąd cała strategia: gdy krupier ma 2–6 grasz zachowawczo, gdy 7–As musisz sama walczyć o wynik.",
        expand:
          "Decyzja w blackjacku zawsze zależy od DWÓCH zmiennych: Twojej ręki + karty krupiera. „Mam 16\" nie jest decyzją — dopiero „Mam 16, a krupier ma 6\" (stand) lub „Mam 16, a krupier ma 10\" (hit) jest. Ruchy: hit, stand, double (jedna karta, podwojona stawka), split (para na dwa układy), surrender (połowa stawki z powrotem), insurance (matematycznie zła — pomijaj).",
        trap:
          "Bust = automatyczna przegrana, nawet jeśli krupier potem też się zbustuje. Dlatego nie naciska się na 17+. Double down to JEDNA karta, decyzja ostateczna. Insurance brzmi sensownie, jest złą stawką matematycznie. Blackjack płaci 3:2, więc nie ulepsza się go splittem dziesiątek (20 to 1:1, oryginalny blackjack to 3:2).",
      },
    },
  },

  // ============================================================
  // 78. Blackjack: basic strategy (hard, soft, pary)
  // ============================================================
  {
    slug: "blackjack-basic-strategy",
    vaultSlug: "blackjack",
    label: "Blackjack — basic strategy (hard, soft, pary)",
    payload: {
      title: "Blackjack — basic strategy",
      summary:
        "Wyliczona matematycznie tabela najlepszych decyzji. NIE intuicja, NIE „czuję, że teraz nie wezmę\" — to są twarde liczby. Trzy części: hard hands, soft hands (z Asem jako 11), pary. Każda wymaga innej logiki.",
      theory:
        "Filozofia całej strategii w jednym zdaniu: gdy krupier ma słabą kartę (2–6), grasz zachowawczo i pozwalasz mu się zbustować. Gdy krupier ma silną kartę (7–As), musisz sama wycisnąć więcej, bo on prawdopodobnie wyciągnie dobry wynik.\n\nHARD HANDS (bez Asa albo z Asem liczonym jako 1):\n— 17+ vs każda karta krupiera → STAND.\n— 13–16 vs 2–6 → STAND. 13–16 vs 7–As → HIT.\n— 12 vs 4–6 → STAND. 12 vs 2–3 lub 7–As → HIT. (Granica jest na CZWÓRCE krupiera, nie na dwójce.)\n— 11 vs prawie każda → DOUBLE.\n— 10 vs 2–9 → DOUBLE. 10 vs 10–As → HIT.\n— 9 vs 3–6 → DOUBLE. 9 vs inne → HIT.\n— 8 lub mniej → HIT.\n\nSOFT HANDS (z Asem jako 11): As jako 11 daje bezpieczeństwo — jeśli przesadzisz, przeskoczy na 1 i nie zbustujesz. Grasz odważniej.\n— Soft 13–17 (A+2 do A+6): hit; przeciw słabej karcie krupiera (3–6) często double.\n— Soft 18 (A+7) — WAŻNY niuans:\n  • vs 2, 7, 8 → STAND.\n  • vs 3–6 → DOUBLE (jeśli zasady pozwalają, inaczej stand).\n  • vs 9, 10, As → HIT (tak, hit! 18 to za mało przeciw silnej karcie).\n— Soft 19+ (A+8, A+9) → STAND.\n\nPARY (split): A,A — ZAWSZE split. 8,8 — ZAWSZE split. 10,10 — NIGDY split (20 to świetna ręka). 5,5 — NIGDY split (traktuj jak 10, częściej double). 9,9 — split vs 2–6 i 8–9; stand vs 7, 10, As. 7,7 — split vs 2–7. 6,6 — split vs 2–6. 2,2 / 3,3 — split vs 2–7.\n\nTrzy mantry, które działają w 80% przypadków:\n1. 17+ stand, 8 lub mniej hit — bez myślenia.\n2. 12–16: krupier 2–6 → stand, krupier 7–As → hit.\n3. Asy i ósemki ZAWSZE split, dziesiątki i piątki NIGDY.",
      questions: [
        {
          type: "abc",
          text: "Soft 18 (A+7) vs 10 — co robisz?",
          options: [
            "STAND — mam 18, wystarczy",
            "HIT — 18 to za mało przeciw silnej karcie krupiera, prawdopodobnie wyciągnie 19+",
            "DOUBLE",
          ],
          correctAnswer: 1,
          explanation:
            "Kontrintuicyjne, ale prawidłowe. Soft 18 vs 9, 10, As → HIT. As pozwala na bezpieczne dobieranie (przeskoczy na 1 jeśli przesadzisz). Przeciw silnej karcie krupiera 18 nie wystarcza.",
        },
        {
          type: "abc",
          text: "Pary 10,10 — najlepsza decyzja:",
          options: [
            "split, bo dwie ręce po 10",
            "NIGDY split — masz 20, jedną z najlepszych rąk, nie psuj",
            "double",
          ],
          correctAnswer: 1,
          explanation:
            "Klasyczna pułapka — split 10,10 kusi, ale jest błędem. 20 to praktyczna pewna wygrana. Rozbijając na dwa razy 10, dostaniesz dwie ręce słabsze niż 20. Pamiętaj: blackjack płaci 3:2, ale split dziesiątek nie da Ci blackjacka.",
        },
        {
          type: "fill",
          text: "12 vs 2 — decyzja: _____ (hit/stand).",
          options: null,
          correctAnswer: "hit",
          explanation:
            "Granica jest na CZWÓRCE krupiera, nie na dwójce. 12 vs 2 i 12 vs 3 → HIT. 12 vs 4–6 → STAND. 12 vs 7+ → HIT. To jedna z najtrudniejszych decyzji — łatwo o pomyłkę.",
        },
        {
          type: "fill",
          text: "Pary, które zawsze splitujemy: A,A i _____ , _____ .",
          options: null,
          correctAnswer: "8,8",
          explanation:
            "A,A — bo dwa Asy razem to słabe 12 (albo 2), a osobno każdy może dać blackjacka. 8,8 — bo 16 to fatalna ręka, dwie ósemki dają szansę na coś lepszego.",
        },
        {
          type: "open",
          text: "Wytłumacz filozofię basic strategy w jednym zdaniu i podaj przykład.",
          options: null,
          correctAnswer:
            "Gdy krupier ma słabą kartę (2–6), grasz zachowawczo i pozwalasz mu się zbustować — bo on musi dobierać do 16. Gdy krupier ma silną kartę (7–As), musisz sama wycisnąć więcej, bo on prawdopodobnie wyciągnie dobry wynik. Przykład: mam 13. Vs 5 (słaby krupier) → STAND, niech sam się męczy. Vs 9 (silny krupier) → HIT, muszę ryzykować, bo 13 nie wygra z jego prawdopodobnym 19+. Ta sama ręka, dwie różne decyzje, bo karta krupiera zmienia kontekst.",
          explanation:
            "Klucz: filozofia + przykład. Ta sama ręka gracza, dwie różne decyzje w zależności od karty krupiera.",
        },
        {
          type: "spot_error",
          text: "Mam 9,9. Krupier pokazuje 7. Najlepsza decyzja: splituję pary, żeby dostać dwie szanse.",
          options: [
            "tak, split zawsze warto",
            "nie — 9,9 vs 7 to STAND, nie split. 18 wygrywa z jego prawdopodobnym 17 (krupier z odkrytą 7 zwykle ma 17). Split rozbija pewną wygraną",
            "powinien być double",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Klasyczna pułapka. 9,9 splituje się vs 2–6 i 8–9. Vs 7, 10, As — STAND. Vs 7: krupier z odkrytą 7 najczęściej kończy na 17, Ty masz pewne 18 — nie rozbijaj.",
        },
      ],
      salon: {
        short:
          "Trzy mantry działają w 80% przypadków: 1) 17+ stand, 8 lub mniej hit. 2) 12–16: krupier 2–6 → stand, krupier 7–As → hit. 3) Asy i ósemki zawsze split, dziesiątki i piątki nigdy.",
        expand:
          "Hard hands: 17+ stand, 13–16 stand vs 2–6 hit vs 7–As, 12 stand vs 4–6 hit vs 2–3 i 7–As, 11 double, 10 double vs 2–9. Soft hands (As jako 11) grane odważniej: soft 13–17 hit lub double, soft 18 stand vs 2,7,8 / double vs 3–6 / HIT vs 9,10,As, soft 19+ stand. Pary: A,A i 8,8 zawsze split, 10,10 i 5,5 nigdy, reszta zależy od krupiera.",
        trap:
          "Splitowanie 10,10 (kuszące, ale głupie — 20 to świetna ręka). Splitowanie 5,5 (to jest 10, częściej double). HIT na soft 18 vs 9/10/As — kontrintuicyjne, ale prawidłowe. STAND na 12 vs 2 lub 3 (powinno być HIT, granica na 4). Niesplitowanie 9,9 vs 8–9 (gdy split daje lepszy expected value).",
      },
    },
  },

  // ============================================================
  // 79. Blackjack: pułapki i błędy do utrwalenia
  // ============================================================
  {
    slug: "blackjack-pulapki-i-bledy",
    vaultSlug: "blackjack",
    label: "Blackjack — pułapki i błędy do utrwalenia",
    payload: {
      title: "Blackjack — pułapki i błędy do utrwalenia",
      summary:
        "Skupiona dawka trzech miejsc, gdzie najłatwiej zgubić punkty: za mało agresywne double, błędna obsługa soft 18, mylenie granicy 12. Te trzy zasady wyrównują 80% błędów początkujących.",
      theory:
        "Twój wzorzec błędu: zbyt mało agresji przy double. Gdy widzisz krupier 2–6, a u siebie masz 9, 10, 11, albo soft 13–18 — DOUBLE jest częściej dobrą odpowiedzią niż hit. Kasyno nie pozwala na double bez powodu — to działa na korzyść gracza w słusznych sytuacjach.\n\nKonkretne błędy z quizu:\n\n10 vs 6 → DOUBLE. Ty masz 10, krupier słabą szóstkę. Prawdopodobnie wyciągniesz 20 (1/3 szansa na 10/J/Q/K w talii). Krupier ma dużą szansę zbusta (musi dobierać do 16). Tylko hit zamiast double = tracisz pieniądze.\n\n11 vs 10 → DOUBLE. 11 to NAJLEPSZA ręka do double, prawie zawsze. Tak, nawet przeciw 10 — bo Ty masz większą szansę na 21 niż on. Wyjątek tylko: 11 vs As (czasem hit zamiast double, zależnie od zasad).\n\nSoft 18 — cały zestaw przypadków:\n— vs 2 → STAND (krupier słaby, ale Ty masz 18).\n— vs 3–6 → DOUBLE (krupier słaby, idź na większą stawkę).\n— vs 7 → STAND (18 bije jego prawdopodobne 17).\n— vs 8 → STAND (remis z prawdopodobnym 18).\n— vs 9, 10, As → HIT (jego prawdopodobne 19+ Cię bije, musisz ryzykować).\n\nGranica 12 (łatwo o pomyłkę):\n— 12 vs 2 → HIT (nie stand!).\n— 12 vs 3 → HIT (nie stand!).\n— 12 vs 4, 5, 6 → STAND.\n— 12 vs 7+ → HIT.\nGranica jest na CZWÓRCE krupiera, nie na dwójce.\n\nPary łatwe do pomylenia:\n— 9,9 vs 7 → STAND (nie split! 18 wygrywa z jego prawdopodobnym 17).\n— 9,9 vs 8 lub 9 → SPLIT.\n— 9,9 vs 10 lub As → STAND (nie warto rozbijać 18, gdy on prawdopodobnie ma 19+).\n\nZasada przewagi: double = „wykorzystuję sytuację, w której matematyka jest po mojej stronie\". Jeśli widzisz słabą kartę krupiera i mocną własną rękę — to JEST ta sytuacja. Strach ≠ ryzyko.",
      questions: [
        {
          type: "abc",
          text: "Mam 10, krupier pokazuje 6. Najlepsza decyzja:",
          options: [
            "hit — bezpieczniej, jedna karta",
            "DOUBLE — masz mocną rękę, krupier ma słabą, podwajaj stawkę",
            "stand na 10",
          ],
          correctAnswer: 1,
          explanation:
            "10 vs 6 to klasyczne double. 1/3 szansa, że dobierzesz 10/J/Q/K → 20. Krupier z 6 ma dużą szansę zbusta (musi dobierać do 16). Hit zamiast double = pieniądze zostawione na stole.",
        },
        {
          type: "abc",
          text: "Mam 11, krupier pokazuje 10. Najlepsza decyzja:",
          options: [
            "hit — bo krupier ma silną kartę",
            "DOUBLE — 11 to najlepsza ręka do double, masz większą szansę na 21 niż on",
            "stand na 11",
          ],
          correctAnswer: 1,
          explanation:
            "11 to NAJLEPSZA ręka do double, prawie zawsze. Nawet vs 10 — Ty masz większą szansę na 21 (jedna karta o wartości 10 daje Ci 21). Wyjątek tylko vs As (czasem hit, zależnie od zasad).",
        },
        {
          type: "fill",
          text: "Soft 18 vs 9 — decyzja: _____ (hit/stand/double).",
          options: null,
          correctAnswer: "hit",
          explanation:
            "Soft 18 vs 9, 10, As → HIT. Jego prawdopodobne 19+ Cię bije, musisz ryzykować. „Mam 18, wystarczy\" przy soft 18 vs silnej karcie krupiera to klasyczny błąd.",
        },
        {
          type: "fill",
          text: "12 vs 3 — decyzja: _____ (hit/stand).",
          options: null,
          correctAnswer: "hit",
          explanation:
            "Granica jest na czwórce krupiera. 12 vs 2 i 12 vs 3 → HIT. 12 vs 4–6 → STAND. Łatwa pomyłka: „2 to słaba karta, zostanę\" — błąd, bo krupier z 2 i tak prawdopodobnie wyciągnie 17+.",
        },
        {
          type: "open",
          text: "Wymień trzy zasady, które wyrównują 80% błędów początkujących.",
          options: null,
          correctAnswer:
            "1) „Krupier 2–6 + ja 9/10/11 → DOUBLE\" (a nie hit). Gdy widzę słabą kartę krupiera i mocną własną rękę, podwajam stawkę — matematyka jest po mojej stronie. 2) „Soft 18 vs 9, 10, As → HIT\" (nie stand). Kontrintuicyjne, ale prawidłowe — As pozwala na bezpieczne dobieranie. 3) „12 vs 2 lub 3 → HIT\" (granica stand zaczyna się od 4 krupiera). Łatwo o pomyłkę. Te trzy wzory pokrywają większość błędów początkujących.",
          explanation:
            "Klucz: trzy konkretne zasady. End-fix w głowie przed wejściem do stołu.",
        },
        {
          type: "spot_error",
          text: "Mam 9,9, krupier pokazuje 7. Decyzja: split — bo zawsze warto rozbijać pary.",
          options: [
            "tak, split zawsze warto",
            "nie — 9,9 vs 7 → STAND, nie split. 18 wygrywa z jego prawdopodobnym 17. Pary nie zawsze splitujemy",
            "powinno być double",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Pary mają niuans. 9,9 vs 7 → STAND, bo krupier z odkrytą 7 najczęściej kończy na 17, a Ty masz pewne 18. Split rozbija pewną wygraną. 9,9 splitujemy vs 2–6 i 8–9, stoimy vs 7, 10, As.",
        },
      ],
      salon: {
        short:
          "Wzorzec błędu: za mało agresji przy double. Trzy zasady na koniec: krupier 2–6 + ja 9/10/11 → DOUBLE. Soft 18 vs 9/10/As → HIT. 12 vs 2 lub 3 → HIT (granica na 4).",
        expand:
          "Kasyno nie pozwala na double bez powodu — to działa na korzyść gracza w słusznych sytuacjach. 10 vs 6 → DOUBLE (1/3 szansa na 20 + krupier prawdopodobnie zbustuje). 11 vs 10 → DOUBLE (masz większą szansę na 21 niż on). Soft 18 vs 9/10/As → HIT (jego prawdopodobne 19+ Cię bije). 9,9 vs 7 → STAND (18 wygrywa z jego prawdopodobnym 17).",
        trap:
          "„Mam 18, wystarczy\" — przy soft 18 vs 9/10/As NIE wystarczy. HIT. „Boję się podwoić\" — to dokładnie te momenty, kiedy trzeba. Strach ≠ ryzyko. „12 to za blisko 21, lepiej stać\" — vs 2 i 3 HIT, granica stand zaczyna się od 4. „Mam parę, to splitnę\" — nie zawsze: 10,10 i 5,5 NIGDY, 9,9 zależy od krupiera.",
      },
    },
  },

  // ============================================================
  // 80. Excel: skróty i szybka nawigacja
  // ============================================================
  // Uwaga: dla tematów praktycznych (Excel, lotnictwo, narzędzia)
  // pomijamy Salon — to nie są tematy „przy winie\". Topic ląduje
  // normalnie w Vault i sesji 15 min, nie pojawia się w rotacji Salonu.
  {
    slug: "excel-skroty-i-szybka-nawigacja",
    vaultSlug: "excel",
    label: "Excel — skróty i szybka nawigacja",
    payload: {
      title: "Excel — skróty i szybka nawigacja",
      summary:
        "Alt sumuje, Ctrl+A zaznacza, prawy klik na strzałki znajduje zakładki, plus dodaje, minus usuwa. Jedno zdanie pokrywa ~80% codziennych mikro-czynności w Excelu.",
      theory:
        "Autosuma — Alt + =. Automatycznie wstawia formułę „=SUMA(...)\" („=SUM(...)\" po angielsku) dla danych obok lub nad komórką, w której stoisz. Excel sam zgaduje zakres, ale warto sprawdzić, czy nie obciął lub nie dorzucił czegoś za dużo.\n\nZaznaczanie — Ctrl + A. Pierwsze użycie: zaznacza aktualny blok danych lub tabelę, w której stoi kursor. Drugie użycie: zaznacza cały arkusz. Działa kontekstowo — jeśli stoisz w pustej komórce, od razu zaznaczy cały arkusz.\n\nLista wszystkich arkuszy — prawy klik na strzałki przewijania zakładek w lewym dolnym rogu (te małe trójkąciki obok nazw arkuszy). Pokazuje pełną listę wszystkich arkuszy w pliku. Klikasz w nazwę, przechodzisz od razu do tego arkusza. Ratuje życie przy plikach z 20+ zakładkami.\n\nDodawanie wierszy / kolumn — Ctrl + Shift + Plus (+). Najpierw zaznacz cały wiersz (Shift + Spacja) albo kolumnę (Ctrl + Spacja), potem skrót. Wiersz dodaje się NAD zaznaczonym, kolumna NA LEWO od zaznaczonej.\n\nUsuwanie wierszy / kolumn / komórek — Ctrl + Minus (-). Usuwa zaznaczone. Jeśli zaznaczysz pojedyncze komórki, Excel zapyta, w którą stronę przesunąć resztę.\n\nMac: Alt → Option, Ctrl → Cmd. Czyli Cmd + Shift + + dodaje wiersz. Na PC (EY i większość biur) nie będzie problemu — wszystko działa pod Ctrl.",
      questions: [
        {
          type: "abc",
          text: "Skrót na autosumę (wstawia =SUMA dla danych obok/nad komórką):",
          options: [
            "Ctrl + S",
            "Alt + =",
            "Ctrl + Shift + S",
          ],
          correctAnswer: 1,
          explanation:
            "Alt + = wywołuje autosumę. Excel zgaduje zakres, więc warto rzucić okiem przed Enterem, czy nie obciął lub dorzucił za dużo.",
        },
        {
          type: "abc",
          text: "Stoję w pustej komórce. Wciskam Ctrl + A. Co się stanie?",
          options: [
            "nic, bo brak danych do zaznaczenia",
            "zaznaczy się cały arkusz (bo brak bloku do złapania)",
            "zaznaczy się tylko aktywna komórka",
          ],
          correctAnswer: 1,
          explanation:
            "Ctrl + A działa kontekstowo. W środku danych: zaznacza blok. W pustej komórce: cały arkusz. Jeśli chcesz tylko tabelę, najpierw stań W ŚRODKU danych, potem Ctrl + A.",
        },
        {
          type: "abc",
          text: "Plik z 22 zakładkami, chcesz szybko skoczyć do arkusza „2024_Q3\". Najszybsza droga:",
          options: [
            "scrollować strzałkami przewijania zakładek aż znajdę",
            "prawy klik na strzałki przewijania zakładek → lista wszystkich arkuszy, klik w nazwę",
            "Ctrl + F",
          ],
          correctAnswer: 1,
          explanation:
            "Prawy klik na trójkąciki przewijania (lewy dolny róg) daje pełną listę arkuszy. Klikasz w nazwę, jesteś od razu. Trik, którego mało osób zna — pierwsza rzecz, na którą koledzy reagują „czekaj, jak to zrobiłaś?\".",
        },
        {
          type: "fill",
          text: "Skrót do zaznaczenia całego WIERSZA (przed dodawaniem/usuwaniem): Shift + _____ .",
          options: null,
          correctAnswer: "Spacja",
          explanation:
            "Shift + Spacja = cały wiersz. Ctrl + Spacja = cała kolumna. Potem Ctrl + Shift + Plus dodaje nowy wiersz/kolumnę.",
        },
        {
          type: "fill",
          text: "Skrót do zaznaczenia całej KOLUMNY: _____ + Spacja.",
          options: null,
          correctAnswer: "Ctrl",
          explanation:
            "Ctrl + Spacja = kolumna. Shift + Spacja = wiersz. Pamiętaj: na Macu Ctrl staje się Cmd.",
        },
        {
          type: "fill",
          text: "Dodanie wiersza (po zaznaczeniu wiersza): Ctrl + Shift + _____ .",
          options: null,
          correctAnswer: "+",
          explanation:
            "Ctrl + Shift + Plus. Wiersz wstawi się NAD zaznaczonym, kolumna NA LEWO od zaznaczonej. Usuwanie: Ctrl + Minus.",
        },
        {
          type: "spot_error",
          text: "„Stoję w pojedynczej komórce, wciskam Ctrl + Shift + +. Powinno od razu dodać się wiersz nad nią.\"",
          options: [
            "tak, wiersz się doda",
            "nie — bez zaznaczonego wiersza/kolumny Excel pyta, co właściwie wstawić (komórki w prawo, w dół, wiersz, kolumna). Wolniej. Najpierw Shift + Spacja, potem Ctrl + Shift + +",
            "skrót nie istnieje",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Klasyczna pułapka. Ctrl + Shift + + na pojedynczej komórce → okienko z pytaniem. Trzeba dwóch ruchów: najpierw Shift + Spacja (cały wiersz), potem Ctrl + Shift + + (dodaje nad). Z dialogiem to wciąż działa, ale wolniej.",
        },
        {
          type: "spot_error",
          text: "„Alt + = wstawiło autosumę. Excel sam zgadł zakres, więc na pewno jest dobrze, walę Enter.\"",
          options: [
            "tak, Excel nigdy się nie myli",
            "nie — Excel zgaduje po pustych wierszach i czasem łapie zły zakres. Zawsze rzuć okiem na podświetlone komórki przed Enterem",
            "Alt + = nie istnieje",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Excel zgaduje zakres po pustych komórkach — czasem obcina (gdy w środku jest pusty wiersz), czasem dorzuca za dużo. Sekunda na sprawdzenie podświetlonego zakresu = brak fatalnych pomyłek w raporcie.",
        },
      ],
      salon: null,
    },
  },

  // ============================================================
  // 81. Sport: Polo — podstawy dla widza (nowy vault "sport")
  // ============================================================
  // Pierwszy preset w sekcji Sport. vaultMeta sprawia, że PresetClient
  // utworzy vault on-demand, jeśli user go jeszcze nie ma w Firestore.
  // Salon zostaje (Polo to klasyczny temat „przy winie", treading
  // the divots z kieliszkiem to dosłowna scena salonowa).
  {
    slug: "sport-polo-podstawy-dla-widza",
    vaultSlug: "sport",
    label: "Sport — Polo, podstawy dla widza",
    vaultMeta: {
      name: "Sport",
      icon: "Trophy",
      level: "Obycie",
      color: "forest",
      order: 13,
    },
    payload: {
      title: "Polo — podstawy dla widza",
      summary:
        "Polo to konie + drużyna + mallet + bramka. Reszta to detale. Pozycja widza: wiesz, jak się ubrać, co się dzieje na boisku, i nie pytasz głupio o piłkę. Klasyczna lekcja obycia.",
      theory:
        "Na czym to polega: gra się konno, drużynowo (4 zawodników na drużynę). Cel — trafić piłkę długim młotkiem (mallet) do bramki przeciwnika. Mecz dzieli się na rundy zwane CHUKKERAMI. Po każdym golu drużyny zamieniają się stronami boiska. Konie są często zmieniane, bo gra jest morderczo intensywna dla zwierzęcia — zawodnik ma więcej niż jednego konia na mecz.\n\nSłownictwo do znania:\n— Chukker — runda gry.\n— Mallet — długi młotek do uderzania piłki.\n— Ride-off — walka bark w bark, gdy dwóch zawodników stara się wypchnąć siebie nawzajem z linii piłki.\n— Line of the ball — linia piłki. Zasada pierwszeństwa i bezpieczeństwa, żeby nie doszło do groźnego zderzenia.\n— Handicap — ranking/poziom zawodnika.\n\nRole na boisku: każdy z czterech graczy ma numer, który oznacza jego rolę. NUMER 3 to często rozgrywający (playmaker) — trochę jak „10\" w piłce nożnej. Reszta numerów to atak, obrona i pivot, ale numer 3 jest najważniejszy dla rytmu drużyny.\n\nTradycja widza: TREADING THE DIVOTS. W przerwie meczu publiczność wychodzi na boisko i PRZYDEPTUJE ślady po kopytach koni (divots). To rytuał, w którym uczestniczą wszyscy, niezależnie od statusu. Z kieliszkiem w ręce. Nie pomijaj tego, jeśli jesteś na meczu — to część doświadczenia.\n\nDress code dla widza: boisko jest darnią, nie parkietem. SZPILKI = sabotaż (niszczą darń, a Ty zostajesz aeratorem w sukience). Płaskie, eleganckie, stabilne.",
      questions: [
        {
          type: "abc",
          text: "Runda gry w polo nazywa się:",
          options: [
            "kwarta",
            "chukker",
            "połowa",
          ],
          correctAnswer: 1,
          explanation:
            "„Chukker\" to najważniejsze słowo z polo — od razu zdradza, czy widz wie, o czym mówi. Powiedzenie „połowa\" zamiast „chukker\" sygnalizuje pierwszy raz.",
        },
        {
          type: "abc",
          text: "NUMER 3 w drużynie polo to:",
          options: [
            "obrońca",
            "rozgrywający / playmaker — najważniejszy dla rytmu drużyny",
            "bramkarz",
          ],
          correctAnswer: 1,
          explanation:
            "Numer 3 = playmaker, jak „10\" w piłce nożnej. Patrzysz na niego, jeśli chcesz zrozumieć grę swojej drużyny.",
        },
        {
          type: "abc",
          text: "Co najlepiej założyć na mecz polo jako widz?",
          options: [
            "wysokie szpilki (eleganckie wydarzenie)",
            "płaskie, eleganckie, stabilne buty (boisko to darń, szpilki ją niszczą)",
            "sportowe trampki",
          ],
          correctAnswer: 1,
          explanation:
            "Klasyczna pułapka. Polo to eleganckie wydarzenie, ale boisko jest darnią. Szpilki ją niszczą + treading the divots w szpilkach = porażka. Płaskie i eleganckie.",
        },
        {
          type: "fill",
          text: "Długi młotek do uderzania piłki nazywa się _____ .",
          options: null,
          correctAnswer: "mallet",
          explanation:
            "Mallet. Bez tego słowa nie ma rozmowy o polo.",
        },
        {
          type: "fill",
          text: "Tradycja, w której widzowie w przerwie meczu wychodzą na boisko i przydeptują ślady kopyt: treading the _____ .",
          options: null,
          correctAnswer: "divots",
          explanation:
            "„Divots\" to wgłębienia w darni wykopane przez kopyta. Publiczność w przerwie je przydeptuje, z kieliszkiem w ręce — obowiązkowa atrakcja widza, nie opcja.",
        },
        {
          type: "fill",
          text: "Zasada pierwszeństwa i bezpieczeństwa, która chroni przed zderzeniem zawodników: line of the _____ .",
          options: null,
          correctAnswer: "ball",
          explanation:
            "„Line of the ball\" — święta zasada, jak prawo pierwszeństwa na drodze. Złamanie = niebezpieczeństwo, faul.",
        },
        {
          type: "spot_error",
          text: "„Mój zawodnik wjechał na boisko na innym koniu niż w pierwszej rundzie — chyba musieli zmienić skład drużyny.\"",
          options: [
            "tak, nowy zawodnik",
            "nie — konie zmieniają się w trakcie meczu, bo gra jest morderczo intensywna dla zwierzęcia. To NORMALNE, nie zmiana zawodnika",
            "to znaczy że jego koń padł",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Klasyczne nieporozumienie widza. Każdy zawodnik ma kilka koni na mecz. Konie się zmieniają, zawodnicy zostają.",
        },
        {
          type: "spot_error",
          text: "„Mecz polo był ciekawy. Druga połowa była mocniejsza od pierwszej.\"",
          options: [
            "tak, polo ma połowy",
            "nie — polo NIE ma kwart ani połów. Ma chukkery. „Połowa\" zamiast „chukker\" od razu zdradza, że jesteś pierwszy raz",
            "polo ma kwarty",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Słownictwo zdradza obycie. „Chukker\", „mallet\", „line of the ball\" — to są słowa-klucze. „Połowa\" przeniesiona z piłki nożnej brzmi obco.",
        },
      ],
      salon: {
        short:
          "Najbardziej fascynujące w polo jest to, że nie patrzysz tylko na piłkę. Patrzysz na linię piłki, kto ma pierwszeństwo, i na konia tak samo jak na zawodnika. A numer 3 jest praktycznie rozgrywającym całej drużyny.",
        expand:
          "Polo to konie + drużyna + mallet + bramka. Mecz ma chukkery (rundy), nie połowy. Po każdym golu zmiana stron. Konie się zmieniają — zawodnik ma kilka koni na mecz, bo intensywność jest morderczza dla zwierzęcia. Najbardziej lubię moment TREADING THE DIVOTS — jedyny sport, w którym publiczność dosłownie wchodzi na boisko i je naprawia. Z kieliszkiem w ręce.",
        trap:
          "Szpilki na trawie = sabotaż (boisko to darń, nie parkiet). Mówienie „połowa\" zamiast „chukker\" od razu zdradza pierwszy raz. Patrzenie wyłącznie na piłkę — błąd początkującego, trzeba patrzeć na ustawienie, kontrolę koni i kto trzyma linię. Konie się zmieniają w trakcie meczu — to normalne, nie zmiana zawodnika.",
      },
    },
  },

  // ============================================================
  // 82. Hiszpański: zaimki me/te/le/nos/les — pozycja
  // ============================================================
  // Format praktyczny (salon: null) — to gramatyka recall, nie temat
  // „przy winie". Bazuje na Duolingo Section 4 Unit 24 „Talk about classes".
  {
    slug: "es-zaimki-pozycja",
    vaultSlug: "es",
    label: "Hiszpański — zaimki me/te/le/nos/les (pozycja)",
    payload: {
      title: "Zaimki me/te/le/nos/les — pozycja",
      summary:
        "Małe słowa „me, te, le, nos, les\" stoją PRZED czasownikiem. Wyjątek: gdy są DWA czasowniki i drugi to bezokolicznik, możesz je postawić przed pierwszym ALBO doczepić do bezokolicznika. Dwie formy, ten sam sens.",
      theory:
        "Reguła główna: w hiszpańskim zaimki dopełnienia (me, te, le, nos, les) stoją PRZED czasownikiem. „Te expliqué eso\" (Wyjaśniłam ci to), „Yo le compro un regalo\" (Kupuję mu / jej prezent), „¿Me pasas el estuche?\" (Podasz mi piórnik?).\n\nZnaczenia:\n— me = mi / mnie\n— te = ci / tobie (forma „ty\")\n— le = mu / jej / Panu / Pani (formalne lub trzecia osoba)\n— nos = nam / nas\n— les = im / Państwu\n\nWyjątek z dwoma czasownikami + bezokolicznikiem. Gdy w zdaniu są dwa czasowniki i drugi jest w bezokoliczniku (np. „quiero hablar\", „va a dar\", „puedes pasar\"), masz DWIE opcje:\n\nA) zaimek PRZED pierwszym czasownikiem:\n— „No te quiero dar mi estuche.\" (Nie chcę ci dać mojego piórnika.)\n— „La maestra te va a dar una nota buena.\" (Nauczycielka da ci dobrą ocenę.)\n— „¿Me puedes dar esa mochila?\" (Możesz mi dać ten plecak?)\n\nB) zaimek DOCZEPIONY do bezokolicznika (jako jedno słowo):\n— „No quiero darte mi estuche.\" (Nie chcę ci dać mojego piórnika.)\n— „La maestra va a darte una nota buena.\" (Nauczycielka da ci dobrą ocenę.)\n— „¿Puedes darme esa mochila?\" (Możesz mi dać ten plecak?)\n\nObie formy są poprawne i znaczą dokładnie to samo. W mowie codziennej obie są naturalne — wybór zależy od rytmu zdania i nawyku.\n\nKluczowy warunek: bezokolicznik musi być w zdaniu (czasownik -ar, -er, -ir w pełnej formie). Bez bezokolicznika można tylko przed (forma A). „Te expliqué eso\" — jeden czasownik (expliqué), brak bezokolicznika, więc TYLKO przed.\n\nPrzykłady z Duolingo Section 4 Unit 24 „Talk about classes\":\n— „¿Me pasas el estuche, por favor?\" — jeden czasownik, zaimek przed.\n— „No te quiero dar mi estuche.\" lub „No quiero darte mi estuche.\" — dwa czasowniki + bezokolicznik, obie opcje.\n— „¿Vas a decirle la verdad?\" lub „¿Le vas a decir la verdad?\" — z konstrukcją „ir a + infinitivo\" też obie opcje.\n— „Quiero darte un consejo para la clase.\" — doczepione, ale można też „Te quiero dar un consejo\".",
      questions: [
        {
          type: "abc",
          text: "„¿___ pasas el estuche, por favor?\" (Podasz mi piórnik?) — jeden czasownik. Wstaw zaimek:",
          options: [
            "Me",
            "Te",
            "Le",
          ],
          correctAnswer: 0,
          explanation:
            "„Me\" = mi / mnie. Zaimek przed czasownikiem, bo jest tylko jeden czasownik (pasas) — bez bezokolicznika nie ma alternatywy.",
        },
        {
          type: "abc",
          text: "„Yo ___ compro un regalo.\" (Kupuję jej prezent) — wstaw zaimek:",
          options: [
            "te",
            "le",
            "me",
          ],
          correctAnswer: 1,
          explanation:
            "„Le\" = jej / mu / Panu / Pani (trzecia osoba lub formalne). Stoi przed czasownikiem „compro\".",
        },
        {
          type: "abc",
          text: "Dwie poprawne formy: „Nie chcę ci dać piórnika\" to:",
          options: [
            "„No te quiero dar mi estuche\" — jedyna forma",
            "„No quiero darte mi estuche\" — jedyna forma",
            "Obie: „No te quiero dar mi estuche\" ORAZ „No quiero darte mi estuche\" — bo jest bezokolicznik (dar)",
          ],
          correctAnswer: 2,
          explanation:
            "Klucz: gdy drugi czasownik to bezokolicznik (dar), masz wybór — przed pierwszym czasownikiem (te quiero dar) ALBO doczepiony do bezokolicznika (darte). Obie poprawne, ten sam sens.",
        },
        {
          type: "fill",
          text: "Doczepienie zaimka do bezokolicznika: „¿Puedes dar___ esa mochila?\" (Możesz mi dać ten plecak?)",
          options: null,
          correctAnswer: "me",
          explanation:
            "„Darme\" = dar + me (doczepione razem, jedno słowo). Druga forma: „¿Me puedes dar esa mochila?\". Obie OK.",
        },
        {
          type: "fill",
          text: "Konstrukcja „ir a + infinitivo\": „¿Vas a decir___ la verdad?\" (Powiesz jej prawdę?)",
          options: null,
          correctAnswer: "le",
          explanation:
            "„Decirle\" = decir + le. „Le\" bo trzecia osoba (jej). Alternatywa: „¿Le vas a decir la verdad?\". Te dwie formy są wymienne.",
        },
        {
          type: "fill",
          text: "„La maestra ___ va a dar una nota buena.\" (Nauczycielka da CI dobrą ocenę) — przed pierwszym czasownikiem:",
          options: null,
          correctAnswer: "te",
          explanation:
            "„Te\" = ci / tobie. Forma A (przed pierwszym czasownikiem). Forma B: „La maestra va a darte una nota buena\" — doczepione do bezokolicznika.",
        },
        {
          type: "open",
          text: "Przekształć z formy A (przed czasownikiem) na formę B (doczepione do bezokolicznika): „Te quiero dar un consejo\".",
          options: null,
          correctAnswer:
            "„Quiero darte un consejo.\" Zaimek „te\" odczepia się od pozycji przed „quiero\" i doczepia do bezokolicznika „dar\" jako jedno słowo „darte\". Obie formy mają identyczne znaczenie: „Chcę ci dać radę.\" To samo działa z „le, me, nos, les\" w analogicznych konstrukcjach.",
          explanation:
            "Klucz: mechaniczna transformacja. Te + quiero + dar → quiero + darte. Bezokolicznik jako kotwica dla zaimka.",
        },
        {
          type: "spot_error",
          text: "„Te expliqué eso darme\" — w jednej rozmowie chcę powiedzieć „Wyjaśniłam ci to\" i potem „daj mi to\".",
          options: [
            "tak, „te expliqué eso\" jest OK",
            "„Te expliqué eso\" — OK (jeden czasownik, zaimek przed). Ale „darme\" w izolacji to bezokolicznik z zaimkiem, czyli „dać mi\" jako forma niefinalna — żeby powiedzieć rozkaz „daj mi to\" trzeba „dámelo\" (rozkaz + zaimki)",
            "„te expliqué\" to błąd",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Subtelność. Bezokolicznik z zaimkiem („darme\") to konstrukcja, która działa W zdaniu z innym czasownikiem („¿Puedes darme?\"), nie samodzielnie. Sam rozkaz „daj mi to\" wymaga trybu rozkazującego: „dámelo\" (dar + me + lo). To wykracza poza ten preset, ale warto wiedzieć.",
        },
        {
          type: "spot_error",
          text: "„No quiero te dar mi estuche.\" — chcę powiedzieć „Nie chcę ci dać mojego piórnika\".",
          options: [
            "OK, „te\" pomiędzy",
            "BŁĄD — zaimek „te\" nie może stać MIĘDZY czasownikami. Albo przed pierwszym („No te quiero dar\") albo doczepiony do bezokolicznika („No quiero darte\")",
            "powinno być „le\"",
            "wszystko OK",
          ],
          correctAnswer: 1,
          explanation:
            "Klasyczny błąd Polaków. Zaimek nigdy NIE stoi luźno między dwoma czasownikami. Tylko dwie opcje: przed pierwszym (te quiero dar) albo doczepiony do bezokolicznika (quiero darte).",
        },
      ],
      salon: null,
    },
  },
  // ============================================================
  // 83. Hiszpański: porównania z rzeczownikami (más/menos/tanto + nombre)
  // ============================================================
  // Format praktyczny (salon: null) — gramatyka recall, nie temat „przy winie".
  // Bazuje na notatce z książki: różnica między porównaniem cech
  // (más bonita que / menos difícil que) a porównaniem ilości rzeczy,
  // gdzie „tanto" musi się zgadzać z rzeczownikiem co do rodzaju i liczby.
  {
    slug: "es-porownania-z-rzeczownikami",
    vaultSlug: "es",
    label: "Hiszpański — porównania z rzeczownikami (más/menos/tanto + nombre)",
    payload: {
      title: "Porównania z rzeczownikami — más / menos / tanto + nombre",
      summary:
        "Porównanie z rzeczownikiem działa inaczej niż porównanie cech (más bonita que, menos difícil que). Tu porównujesz ilość rzeczy, więc forma „tanto\" musi zgadzać się z rzeczownikiem co do rodzaju i liczby: tanto / tanta / tantos / tantas. Pułapka: „tanta hambre\" (nie „tanto hambre\"), bo hambre jest rodzaju żeńskiego — el hambre to tylko zabieg fonetyczny.",
      theory:
        "Trzy schematy porównań z rzeczownikami:\n\n1) más + rzeczownik + que = więcej czegoś niż\n— „Tengo más libros que tú.\" (Mam więcej książek niż ty.)\n— „Hay más espectadores que el año pasado.\" (Jest więcej widzów niż w zeszłym roku.)\n\n2) menos + rzeczownik + que = mniej czegoś niż\n— „He recibido menos postales que vosotros.\" (Dostałam mniej pocztówek niż wy.)\n\n3) tanto/tanta/tantos/tantas + rzeczownik + como = tyle samo czegoś co\nTu „tanto\" SIĘ ODMIENIA i musi zgadzać się z rzeczownikiem:\n— tanto (m. lp.): „tanto dinero\", „tanto tiempo\"\n— tanta (ż. lp.): „tanta hambre\", „tanta paciencia\"\n— tantos (m. lm.): „tantos libros\", „tantos años\"\n— tantas (ż. lm.): „tantas postales\", „tantas veces\"\n\nPRZYKŁADY:\n— „Irena tiene tanta hambre como yo.\" (Irena jest tak samo głodna jak ja.)\n— „No tengo tantos libros como tú.\" (Nie mam tylu książek co ty.)\n\nPUŁAPKA Z HAMBRE. Mówi się „el hambre\" (rodzajnik męski), ale rzeczownik jest ŻEŃSKI. „El\" pojawia się tylko fonetycznie — przed akcentowanym „a-\" w liczbie pojedynczej, żeby uniknąć zbiegu „la a-\". Sam rzeczownik jest żeński i wszystkie inne formy się do tego dostosowują:\n— tanta hambre (nie tanto hambre)\n— mucha hambre (nie mucho hambre)\n— poca hambre (nie poco hambre)\nTak samo: „el agua fría\" (nie „frío\"), „mucha agua\", „toda el agua\".\n\nDOPASOWANIE OSOBY W PORÓWNANIU. Po „que\" / „como\" wstawiasz tę osobę, do której pytanie / zdanie się odnosi:\n— Pytanie: „¿Has recibido cinco postales?\" (do jednej osoby, tú) → odpowiedź: „He recibido menos postales que tú.\"\n— Pytanie: „¿Habéis recibido cinco postales?\" (do grupy, vosotros) → odpowiedź: „He recibido menos postales que vosotros.\"\nForma czasownika w pytaniu (has vs habéis) zdradza, czy to „tú\" czy „vosotros\".\n\nPOMIJANIE „COMO X\" GDY KONTEKST JEST OCZYWISTY:\n— „Tengo unos 500 libros.\" — „Yo no tengo tantos. Tengo unos 300.\"\nWystarczy „no tengo tantos\" — wiadomo, do czego się porównuje. Pełna forma „no tengo tantos como tú\" też jest poprawna, ale ćwiczenia często wymagają wersji krótszej, bo trenują pomijanie oczywistego porównania.\n\nESPECTADORES = widzowie, publiczność. „En el teatro había muchos espectadores.\" (W teatrze było wielu widzów.) W lp.: el espectador (widz), la espectadora (widzka).\n\nŚCIĄGA NA PAMIĘĆ:\n— más libros que tú — więcej książek niż ty\n— menos postales que vosotros — mniej pocztówek niż wy\n— tanta hambre como yo — tak samo głodna jak ja\n— tantos libros como tú — tyle samo książek co ty\n— No tengo tantos. — Nie mam tylu.",
      questions: [
        {
          type: "abc",
          text: "„Irena tiene ___ hambre como yo.\" (Irena jest tak samo głodna jak ja.)",
          options: [
            "tanto",
            "tanta",
            "tantas",
          ],
          correctAnswer: 1,
          explanation:
            "„Hambre\" jest rodzaju ŻEŃSKIEGO, mimo że mówi się „el hambre\" (rodzajnik męski tylko fonetycznie, przed akcentowanym a-). Wszystkie formy zgadzające się z hambre są żeńskie: tanta hambre, mucha hambre, poca hambre.",
        },
        {
          type: "abc",
          text: "Pytanie: „¿Habéis recibido cinco postales este verano? Yo he recibido tres.\" Wybierz poprawną odpowiedź:",
          options: [
            "He recibido menos postales que tú.",
            "He recibido menos postales que vosotros.",
            "He recibido menos postales como vosotros.",
          ],
          correctAnswer: 1,
          explanation:
            "Pytanie jest w formie „habéis recibido\" → wy (vosotros). Porównanie musi się dopasować: „que vosotros\". „Tú\" byłoby OK gdyby pytanie brzmiało „¿Has recibido…?\". Z „menos / más\" łączysz przez „que\", nie „como\".",
        },
        {
          type: "abc",
          text: "Kontekst: „Tengo unos 500 libros.\" — odpowiadasz, że masz 300. Książka ćwiczy krótką formę. Wybierz:",
          options: [
            "Yo no tengo tantos como tú.",
            "Yo no tengo tantos.",
            "Yo no tengo tanto.",
          ],
          correctAnswer: 1,
          explanation:
            "Obie pierwsze są gramatycznie OK, ale ćwiczenie wymaga pominięcia „como tú\" — kontekst już mówi, z kim porównujesz. „Tanto\" (m. lp.) byłoby błędne: „libros\" to liczba mnoga, więc „tantos\".",
        },
        {
          type: "fill",
          text: "Wstaw poprawną formę „tanto\": „No he leído ___ libros como tú.\"",
          options: null,
          correctAnswer: "tantos",
          explanation:
            "„Libros\" — rzeczownik męski, liczba mnoga → tantos. Schemat: tanto/tanta/tantos/tantas + rzeczownik + COMO (nie que).",
        },
        {
          type: "fill",
          text: "Wstaw poprawną formę „tanto\": „Hoy tengo ___ paciencia como ayer.\" (Mam dziś tyle samo cierpliwości co wczoraj.)",
          options: null,
          correctAnswer: "tanta",
          explanation:
            "„Paciencia\" — rzeczownik żeński, liczba pojedyncza → tanta. Łącznik „como\", nie „que\", bo to porównanie równości.",
        },
        {
          type: "fill",
          text: "Wstaw brakujący łącznik: „Tengo más libros ___ tú.\"",
          options: null,
          correctAnswer: "que",
          explanation:
            "Z „más\" i „menos\" idzie „que\" (więcej / mniej NIŻ). Z „tanto / tanta / tantos / tantas\" idzie „como\" (tyle samo CO). Klucz: nierówność = que, równość = como.",
        },
        {
          type: "open",
          text: "Przetłumacz: „W tym roku film miał więcej widzów niż w zeszłym.\"",
          options: null,
          correctAnswer:
            "„Este año la película tuvo más espectadores que el año pasado.\" Schemat: más + rzeczownik (espectadores) + que. „Espectadores\" = widzowie (l.m.). W l.p.: el espectador / la espectadora.",
          explanation:
            "Klucz: schemat „más + nombre + que\". Słowo: espectadores (widzowie / publiczność).",
        },
        {
          type: "spot_error",
          text: "„Irena tiene tanto hambre como yo.\" — gdzie błąd?",
          options: [
            "wszystko OK",
            "powinno być „tanta hambre\", bo hambre jest rodzaju żeńskiego (el hambre tylko fonetycznie)",
            "powinno być „tantos hambres\"",
            "powinno być „que yo\" zamiast „como yo\"",
          ],
          correctAnswer: 1,
          explanation:
            "Klasyczny błąd. „El hambre\" wygląda męsko, ale rzeczownik jest ŻEŃSKI — „el\" pojawia się tylko przed akcentowanym a- w l.p. (fonetyka, nie rodzaj). Dlatego: tanta hambre, mucha hambre, poca hambre. Tak samo el agua fría, mucha agua.",
        },
        {
          type: "spot_error",
          text: "„Tengo más libros como tú.\" — gdzie błąd?",
          options: [
            "wszystko OK",
            "powinno być „que tú\" — z „más\" / „menos\" łączymy przez „que\", nie „como\"",
            "powinno być „mucho libros\"",
            "powinno być „tantos libros\"",
          ],
          correctAnswer: 1,
          explanation:
            "Reguła: nierówność (más / menos) → QUE. Równość (tanto / tanta / tantos / tantas) → COMO. „Más libros que tú\", „tantos libros como tú\".",
        },
      ],
      salon: null,
    },
  },

  // ============================================================
  // 84. Hiszpański: desastres naturales (huracán, terremoto, volcán)
  // ============================================================
  // Z rozmowy konwersacyjnej o Meksyku (27.05.2026) — słownictwo katastrof.
  // Temat „przy winie" (salon), bo to obycie kulturowe + konwersacja.
  {
    slug: "es-desastres-naturales-mexico",
    vaultSlug: "es",
    label: "Hiszpański — desastres naturales (huracán, terremoto, volcán)",
    payload: {
      title: "Desastres naturales — huracán, terremoto, volcán",
      summary:
        "Słownictwo o katastrofach naturalnych w Meksyku z rozmowy konwersacyjnej: huracán, tornado, terremoto (temblor / sismo), volcán, la falla. Klucz: huragan tworzy się NAD wodą i niesie deszcz, a tornado powstaje na lądzie i to sam wiatr, bez wody.",
      theory:
        "Meksyk leży w strefie wielu zagrożeń naturalnych naraz — stąd to słownictwo wraca w rozmowach o codziennym życiu.\n\nHURACÁN (huragan) kontra TORNADO:\n— el huracán tworzy się NAD wodą (sobre el agua / en el mar) i niesie silny wiatr ORAZ deszcz; uderza w wybrzeże (la costa).\n— el tornado powstaje na lądzie (en la tierra) i to sam wiatr, bez wody.\n— Zdanie z rozmowy: „Los huracanes se forman en el mar y los tornados en la tierra.\"\nHuragany dzieli się na kategorie 1–5 wg prędkości wiatru: categoría 1 (najsłabszy) → daños en techos y árboles; categoría 5 (najsilniejszy) → destrucción de techos y colapso de paredes. Pacyfik (el Pacífico) ma silniejsze huragany niż Atlantyk (el Atlántico).\n\nTERREMOTO i jego synonimy (to samo zjawisko, różny rejestr):\n— el terremoto = trzęsienie ziemi (formalnie, o dużych wstrząsach)\n— el temblor = wstrząs / drżenie (potocznie; „está temblando\" = trzęsie się)\n— el sismo = wstrząs sejsmiczny (technicznie, w mediach)\nDwa typy ruchu: oscilatorio (kołyszący, poziomy) i trepidatorio (skaczący, pionowy). Trzęsienie z 2017 połączyło oba — stąd było tak niszczące i trwało prawie minutę.\nla alerta sísmica = alarm sejsmiczny (daje tylko kilka–kilkanaście sekund).\nla falla = uskok geologiczny; la falla de San Andrés ciągnie się od Kalifornii na południe.\n\nVOLCÁN:\n— el volcán activo = czynny wulkan; lanzar ceniza = wyrzucać popiół; la lava = lawa.\n— la ceniza (popiół) trzeba zmiatać (barrer), bo z deszczem się zbryla; „no es nieve, es ceniza\".\n\nINNE:\n— la inundación = powódź; el daño / los daños = szkody; la costa = wybrzeże.\n— „es una zona de terremotos / de huracanes\" = to strefa trzęsień / huraganów.",
      questions: [
        {
          type: "abc",
          text: "Czym różni się huracán od tornado?",
          options: [
            "Huracán powstaje na lądzie, a tornado nad wodą",
            "Huracán tworzy się nad wodą i niesie deszcz; tornado powstaje na lądzie i to sam wiatr",
            "To dwa słowa na to samo zjawisko",
          ],
          correctAnswer: 1,
          explanation:
            "„Los huracanes se forman en el mar y los tornados en la tierra.\" Huragan = woda + wiatr + deszcz; tornado = sam wiatr na lądzie, sin agua.",
        },
        {
          type: "abc",
          text: "Które słowa znaczą to samo co „terremoto\" (trzęsienie ziemi)?",
          options: [
            "temblor i sismo",
            "tornado i huracán",
            "ceniza i lava",
          ],
          correctAnswer: 0,
          explanation:
            "el terremoto / el temblor / el sismo to to samo zjawisko, różny rejestr: terremoto formalnie o dużym, temblor potocznie, sismo technicznie / w mediach.",
        },
        {
          type: "fill",
          text: "Uskok San Andreas, źródło trzęsień: „la ___ de San Andrés\".",
          options: null,
          correctAnswer: "falla",
          explanation:
            "la falla = uskok geologiczny. Ciągnie się od Kalifornii na południe — stąd tyle trzęsień w tym regionie.",
        },
        {
          type: "abc",
          text: "Trzęsienie „trepidatorio\" to ruch:",
          options: [
            "poziomy, kołyszący",
            "pionowy, skaczący",
            "okrężny",
          ],
          correctAnswer: 1,
          explanation:
            "trepidatorio = pionowy (skacze), oscilatorio = poziomy (kołysze). Sismo z 2017 połączył oba i dlatego był tak groźny.",
        },
        {
          type: "fill",
          text: "Wulkan wyrzuca popiół: „El volcán lanza ___\" (popiół).",
          options: null,
          correctAnswer: "ceniza",
          explanation:
            "la ceniza = popiół. Trzeba ją zmiatać (barrer), bo z deszczem się zbryla. Uwaga: „no es nieve, es ceniza\" — to nie śnieg.",
        },
        {
          type: "abc",
          text: "„Categoría 5\" huraganu oznacza:",
          options: [
            "najsłabszy, drobne szkody",
            "najsilniejszy: zerwane dachy i zawalone ściany",
            "tornado nad miastem",
          ],
          correctAnswer: 1,
          explanation:
            "Skala 1–5 wg prędkości wiatru. 1 → daños en techos y árboles; 5 → destrucción de techos y colapso de paredes. Pacyfik silniejszy niż Atlantyk.",
        },
        {
          type: "open",
          text: "Opisz po hiszpańsku różnicę między huracánem a tornado (jedno zdanie).",
          options: null,
          correctAnswer:
            "„Los huracanes se forman en el mar (sobre el agua) y traen viento y lluvia; los tornados se forman en la tierra y son solo viento.\" Klucz: huracán = nad wodą + deszcz; tornado = na lądzie + sam wiatr.",
          explanation:
            "To dokładnie sformułowanie z rozmowy: se forman en el mar vs en la tierra.",
        },
        {
          type: "spot_error",
          text: "„Ayer hubo un tornado muy fuerte en el mar con mucha lluvia.\" — gdzie błąd?",
          options: [
            "wszystko OK",
            "tornado nie tworzy się „en el mar\" ani nie niesie „lluvia\" — to opis huracánu; tornado powstaje na lądzie i to sam wiatr",
            "powinno być „un terremoto\"",
            "powinno być „muy fuerta\"",
          ],
          correctAnswer: 1,
          explanation:
            "Pułapka huracán / tornado. Nad wodą + deszcz = huracán. Tornado: en la tierra, solo viento, sin agua.",
        },
      ],
      salon: {
        short:
          "Meksyk żyje naraz w strefie huraganów, trzęsień ziemi i czynnych wulkanów. Stąd codzienne słownictwo katastrof: huracán, temblor, ceniza.",
        expand:
          "Huragan tworzy się nad wodą i niesie wiatr z deszczem (kategorie 1–5, Pacyfik silniejszy niż Atlantyk); tornado to sam wiatr na lądzie. Trzęsienia bywają oscilatorios albo trepidatorios — to z 2017 połączyło oba i trwało prawie minutę. Alerta sísmica daje ledwie kilkanaście sekund.",
        trap:
          "Nie myl terremoto / temblor / sismo (to samo zjawisko, różny rejestr) ani huracánu z tornado: huragan jest NAD wodą i z deszczem, tornado na lądzie i bez wody.",
      },
    },
  },

  // ============================================================
  // 85. Hiszpański: el clima — temporada de lluvias, calor, humedad
  // ============================================================
  // Z tej samej rozmowy o Meksyku — jak mówić o pogodzie i porach roku.
  {
    slug: "es-clima-temporada-de-lluvias",
    vaultSlug: "es",
    label: "Hiszpański — clima y temporada de lluvias",
    payload: {
      title: "El clima — temporada de lluvias, calor, humedad",
      summary:
        "Jak mówić o pogodzie i porach roku w Meksyku: la temporada de lluvias / de secas, hace calor, baja el calor, la humedad, los mosquitos. Klucz: pogodę opisuje się przez „hacer\" (hace calor), a deszcz przez czasownik „llover\" (llueve) — nie „hace lluvia\".",
      theory:
        "Pory roku w Meksyku to nie zima / lato, tylko PORA SUCHA i PORA DESZCZOWA:\n— la temporada de secas (sucha) — kwiecień i maj (abril y mayo) to miesiące najgorętsze.\n— la temporada de lluvias (deszczowa) — zaczyna się około czerwca; pokrywa się z la temporada de huracanes.\n\nPOGODA przez „HACER\" (dosł. „robi\"):\n— hace calor = jest gorąco; hace mucho calor = bardzo gorąco; hace menos calor = mniej gorąco.\n— hace frío = jest zimno; hace sol = jest słonecznie.\nUWAGA: o pogodzie NIE mówi się „es caliente\" — używa się „hace calor\".\n\nDESZCZ przez czasownik „LLOVER\" (o→ue):\n— llueve = pada; está lloviendo = właśnie pada; empezó a llover = zaczęło padać.\n— „Aquí llueve solo en la noche.\" (Tu pada tylko w nocy.)\n\nSKUTKI pory deszczowej:\n— baja el calor / bajó el calor = spada / spadł upał.\n— la humedad = wilgoć („hay humedad\" = jest wilgotno).\n— el mosquito / los mosquitos = komary — pojawiają się przez wilgoć.\n— „Si llueve en la noche y hace sol en el día, entonces tienes humedad.\"\n\nPRZYDATNE:\n— casi verano = prawie lato; empieza la lluvia = zaczyna się deszcz.\n— es algo extraño = to coś dziwnego; el tiempo perfecto = idealna pogoda.",
      questions: [
        {
          type: "abc",
          text: "„Jest bardzo gorąco\" po hiszpańsku:",
          options: [
            "Es muy caliente",
            "Hace mucho calor",
            "Está mucho calor",
          ],
          correctAnswer: 1,
          explanation:
            "Pogodę opisuje się przez „hacer\": hace calor / hace frío / hace sol. „Es caliente\" to typowy błąd kalkowany z polskiego.",
        },
        {
          type: "fill",
          text: "„Tu pada tylko w nocy\": „Aquí ___ solo en la noche.\" (czasownik llover)",
          options: null,
          correctAnswer: "llueve",
          explanation:
            "llover (o→ue): llueve = pada. Deszcz to czasownik, nie „hace lluvia\".",
        },
        {
          type: "abc",
          text: "„La temporada de lluvias\" pokrywa się w Meksyku z:",
          options: [
            "la temporada de secas",
            "la temporada de huracanes",
            "el invierno",
          ],
          correctAnswer: 1,
          explanation:
            "Pora deszczowa (od ~czerwca) zbiega się z porą huraganów. Pora sucha (secas) to m.in. gorące abril y mayo.",
        },
        {
          type: "fill",
          text: "Skutek deszczu w nocy i słońca w dzień: „hay ___\" (wilgoć).",
          options: null,
          correctAnswer: "humedad",
          explanation:
            "la humedad = wilgoć. Z wilgoci biorą się los mosquitos (komary).",
        },
        {
          type: "abc",
          text: "„Bajó el calor\" znaczy:",
          options: [
            "zrobiło się goręcej",
            "spadł upał",
            "zaczęło padać",
          ],
          correctAnswer: 1,
          explanation:
            "bajar = spadać; „bajó el calor\" = upał zelżał — dzięki deszczowi w nocy.",
        },
        {
          type: "open",
          text: "Powiedz po hiszpańsku: „Tu w kwietniu i maju jest bardzo gorąco, ale w czerwcu zaczyna się pora deszczowa\".",
          options: null,
          correctAnswer:
            "„Aquí en abril y mayo hace mucho calor, pero en junio empieza la temporada de lluvias.\" Klucz: hace calor (pogoda przez hacer) + empieza la temporada de lluvias.",
          explanation:
            "Uwaga na „hace calor\" (nie „es caliente\") i na nazwę pory: la temporada de lluvias.",
        },
        {
          type: "spot_error",
          text: "„Hoy es muy caliente y hace mucha lluvia.\" — gdzie błędy?",
          options: [
            "wszystko OK",
            "dwa błędy: pogoda to „hace mucho calor\" (nie „es caliente\"), a deszcz to czasownik „llueve mucho\" (nie „hace lluvia\")",
            "tylko „caliente\" jest źle",
            "powinno być „está caliente\"",
          ],
          correctAnswer: 1,
          explanation:
            "Pogoda: hace calor. Deszcz: llueve / está lloviendo. „Es caliente\" i „hace lluvia\" to kalki, których Hiszpan nie powie.",
        },
      ],
      salon: {
        short:
          "W Meksyku liczą się dwie pory: secas i lluvias. Deszcz pada w nocy, dzień zostaje słoneczny — ale przychodzą wilgoć i komary.",
        expand:
          "Abril y mayo to szczyt upału; około czerwca zaczyna się temporada de lluvias, która pokrywa się z temporada de huracanes. Upał spada (baja el calor), ale rośnie la humedad i wychodzą los mosquitos.",
        trap:
          "O pogodzie mów przez „hace\" (hace calor, hace frío), nie „es caliente\". Deszcz to czasownik: „llueve\", nie „hace lluvia\".",
      },
    },
  },

  // ============================================================
  // 86. Hiszpański: ofertas de trabajo y tomar decisiones
  // ============================================================
  // Z tej samej rozmowy — początek o ofercie pracy i decydowaniu.
  // Perełka idiomatyczna: „consultarlo con la almohada" (sleep on it).
  {
    slug: "es-ofertas-de-trabajo-y-decisiones",
    vaultSlug: "es",
    label: "Hiszpański — ofertas de trabajo y tomar decisiones",
    payload: {
      title: "Ofertas de trabajo y decisiones — consultarlo con la almohada",
      summary:
        "Słownictwo i zwroty do rozmowy o ofercie pracy i podejmowaniu decyzji: una oferta de trabajo, el sueldo, los beneficios, leer los detalles. Perełka: „consultarlo con la almohada\" = przespać się z decyzją (ang. sleep on it).",
      theory:
        "OFERTA PRACY — słownictwo:\n— una oferta de trabajo = oferta pracy; un trabajo = praca / posada.\n— el sueldo / el salario = pensja; los beneficios = benefity, dodatki.\n— las horas de trabajo = godziny pracy; viajar mucho = dużo podróżować.\n— el contrato / el trato = umowa, układ; leer los detalles = czytać szczegóły.\n— el currículum (vitae) = CV; enviar el currículum = wysłać CV.\n\nPODEJMOWANIE DECYZJI:\n— tomar una decisión = podjąć decyzję (NIE „hacer una decisión\"); decidir = decydować.\n— „No voy a decidir hoy.\" = Nie zdecyduję dziś.\n— Idiom: CONSULTARLO CON LA ALMOHADA = przespać się z decyzją (dosł. „skonsultować to z poduszką\"; la almohada = poduszka). Odpowiednik angielskiego „sleep on it\". W rozmowie padło swobodne „preguntar a la almohada\", ale utrwalona forma to „consultarlo con la almohada\".\n— „Cuando tengo una decisión importante, necesito dormir bien y después decidir.\"\n\nWAŻENIE ZA I PRZECIW:\n— los pros y los contras = za i przeciw; sopesar = ważyć (opcje).\n— „es una cosa por otra\" = coś za coś, kompromis (jedno kosztem drugiego).\n— „lo que sea mejor para ti\" = cokolwiek będzie dla ciebie lepsze.\n\nPRZYDATNE ZWROTY:\n— „Voy a leer todo y después decidir.\" = Przeczytam wszystko i potem zdecyduję.\n— „Si ya te hablaron, es porque están interesados en ti.\" = Skoro się odezwali, to znaczy, że są tobą zainteresowani.",
      questions: [
        {
          type: "abc",
          text: "„Consultarlo con la almohada\" znaczy:",
          options: [
            "zapytać kogoś o radę",
            "przespać się z decyzją przed wyborem",
            "iść spać zamiast pracować",
          ],
          correctAnswer: 1,
          explanation:
            "la almohada = poduszka. Idiom = „sleep on it\", przespać się z ważną decyzją. W rozmowie padło też swobodne „preguntar a la almohada\".",
        },
        {
          type: "abc",
          text: "„Podjąć decyzję\" po hiszpańsku:",
          options: [
            "hacer una decisión",
            "tomar una decisión",
            "tener una decisión",
          ],
          correctAnswer: 1,
          explanation:
            "Decyzję się „bierze\": tomar una decisión. „Hacer una decisión\" to kalka z angielskiego / polskiego.",
        },
        {
          type: "fill",
          text: "„Pensja jest lepsza, ale będę więcej pracować\": „El ___ es mejor, pero voy a trabajar más.\"",
          options: null,
          correctAnswer: "sueldo",
          explanation:
            "el sueldo / el salario = pensja. los beneficios = dodatki, benefity.",
        },
        {
          type: "abc",
          text: "„Es una cosa por otra\" oznacza:",
          options: [
            "to bez znaczenia",
            "coś za coś, kompromis",
            "to ta sama rzecz",
          ],
          correctAnswer: 1,
          explanation:
            "Idiom: jedno kosztem drugiego, trade-off. Np. lepsza pensja, ale więcej podróży.",
        },
        {
          type: "fill",
          text: "„Przeczytam wszystko i potem zdecyduję\": „Voy a ___ todo y después decidir.\" (czasownik: czytać)",
          options: null,
          correctAnswer: "leer",
          explanation:
            "leer = czytać; leer los detalles / el contrato = czytać szczegóły / umowę przed decyzją.",
        },
        {
          type: "open",
          text: "Powiedz po hiszpańsku: „To ważna decyzja, więc nie zdecyduję dziś — prześpię się z tym\".",
          options: null,
          correctAnswer:
            "„Es una decisión importante, así que no voy a decidir hoy — lo voy a consultar con la almohada.\" Klucz: voy a decidir / tomar una decisión + idiom consultar con la almohada.",
          explanation:
            "Można też „necesito dormir y después decidir\". Idiom: consultarlo con la almohada.",
        },
        {
          type: "spot_error",
          text: "„Mañana voy a hacer una decisión sobre el trabajo.\" — gdzie błąd?",
          options: [
            "wszystko OK",
            "decyzję się „toma\", nie „hace\": „voy a tomar una decisión\"",
            "powinno być „del trabajo\"",
            "powinno być „un decisión\"",
          ],
          correctAnswer: 1,
          explanation:
            "tomar una decisión = podjąć decyzję. „Hacer una decisión\" to kalka. (una decisión — rodzaj żeński.)",
        },
      ],
      salon: {
        short:
          "Przy decyzji o pracy Meksykanin powie „lo voy a consultar con la almohada\" — prześpię się z tym. To ich „sleep on it\".",
        expand:
          "Wokół oferty pracy krąży zestaw słów: la oferta, el sueldo, los beneficios, las horas de trabajo, leer los detalles. Decyzję się „toma\" (tomar una decisión), a opcje się waży: los pros y los contras, es una cosa por otra.",
        trap:
          "„Consultarlo con la almohada\" to idiom o przespaniu się z decyzją — nie tłumacz dosłownie na „pytać poduszki\". I pamiętaj: tomar una decisión, nie „hacer\".",
      },
    },
  },
];
