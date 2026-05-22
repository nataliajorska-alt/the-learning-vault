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
];
