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
];
