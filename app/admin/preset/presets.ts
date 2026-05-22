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
    vaultSlug: "art",
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
    vaultSlug: "art",
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
];
