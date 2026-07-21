export type MuscleGroup = 'Borst' | 'Rug' | 'Benen' | 'Schouders' | 'Armen' | 'Core' | 'Cardio'

export interface Exercise {
  id: string
  name: string
  muscleGroup: MuscleGroup
  description: string
}

export const MUSCLE_GROUPS: MuscleGroup[] = [
  'Borst', 'Rug', 'Benen', 'Schouders', 'Armen', 'Core', 'Cardio',
]

export const EXERCISES: Exercise[] = [
  // Borst
  { id: 'b1',  name: 'Bench Press',               muscleGroup: 'Borst',     description: 'Basisoefening voor de borst. Lig op een bank, laat de stang zakken tot aan de borst en druk omhoog. Hou je schouderbladen samengeknepen.' },
  { id: 'b2',  name: 'Incline Bench Press',        muscleGroup: 'Borst',     description: 'Bank onder een hoek van 30–45°. Traint de bovenkant van de borst. Houd je ellebogen iets naar binnen om de schouders te ontzien.' },
  { id: 'b3',  name: 'Decline Bench Press',        muscleGroup: 'Borst',     description: 'Bank aflopend. Traint de onderkant van de borst. Voelt zwaarder aan dan flat bench omdat de spierleverarm gunstiger is.' },
  { id: 'b4',  name: 'Dumbbell Fly',               muscleGroup: 'Borst',     description: 'Dumbells in een boog bewegen vanuit gestrekte armen tot boven de borst. Geeft een diepe stretch en isoleert de borstspiervezels.' },
  { id: 'b5',  name: 'Cable Fly',                  muscleGroup: 'Borst',     description: 'Kabels van opzij of boven naar het midden kruisen. Continu spanning op de borst gedurende de hele beweging. Goed als finisher.' },
  { id: 'b6',  name: 'Push-Up',                    muscleGroup: 'Borst',     description: 'Klassieke drukbeweging met eigen lichaamsgewicht. Houd je romp recht als een plank. Handen iets breder dan schouderbreedte.' },
  { id: 'b7',  name: 'Chest Dip',                  muscleGroup: 'Borst',     description: 'Dip waarbij je je lichaam voorover leunt om de borst te targetten. Goed voor de onderborst. Controleer de beweging langzaam omlaag.' },
  { id: 'b8',  name: 'Pec Deck',                   muscleGroup: 'Borst',     description: 'Machine die de vluchtbeweging nabootst. Armen samenknijpen in het midden voor maximale spiercontractie. Goed voor isolatie.' },
  { id: 'b9',  name: 'Incline Dumbbell Press',     muscleGroup: 'Borst',     description: 'Zoals incline bench maar met dumbells, wat een grotere bewegingsbaan geeft. Traint de bovenborst en de voorste schouderkoppen.' },
  { id: 'b10', name: 'Decline Dumbbell Press',     muscleGroup: 'Borst',     description: 'Dumbells drukken op een aflopende bank. Activeert de onderkant van de pectoralis major sterker dan flat of incline.' },
  { id: 'b11', name: 'Cable Crossover',            muscleGroup: 'Borst',     description: 'Kabels van hoog naar laag of laag naar hoog kruisen voor de borst. Zorgt voor aanhoudende spanning en isolatie op de borst.' },
  { id: 'b12', name: 'Machine Chest Press',        muscleGroup: 'Borst',     description: 'Gecontroleerde drukbeweging in een machine. Goed voor beginners of als veilige finisher. Laat de stabilisatoren grotendeels buiten beschouwing.' },
  { id: 'b13', name: 'Svend Press',                muscleGroup: 'Borst',     description: 'Twee schijfjes voor de borst samendrukken en naar voren uitstrekken. Activeert de binnenborst intensief. Gebruik licht gewicht.' },
  { id: 'b14', name: 'Landmine Press',             muscleGroup: 'Borst',     description: 'Eén kant van de stang drukken vanuit een geankerd punt. Schoudervriendelijke persvariант die ook de bovenborst traint.' },
  { id: 'b15', name: 'Diamond Push-Up',            muscleGroup: 'Borst',     description: 'Push-up met handen dicht bij elkaar in een driehoek. Traint de borst en met name de triceps intensief.' },

  // Rug
  { id: 'r1',  name: 'Deadlift',                   muscleGroup: 'Rug',       description: 'Koningin van de rugkracht. Stang van de grond tillen met rechte rug en actieve lats. Traint de gehele achterste keten.' },
  { id: 'r2',  name: 'Pull-Up',                    muscleGroup: 'Rug',       description: 'Optrekken aan een stang met pronatie greep (palmen naar voren). Traint lats, biceps en mid-rug. Kin boven de stang als einddoel.' },
  { id: 'r3',  name: 'Chin-Up',                    muscleGroup: 'Rug',       description: 'Optrekken met supinatie greep (palmen naar je toe). Meer bicepsbetrokkenheid dan pull-up. Goed beginnersvariант.' },
  { id: 'r4',  name: 'Bent-Over Row',              muscleGroup: 'Rug',       description: 'Voorovergebogen rijen met de stang. Rug parallel aan de grond, stang naar de navel trekken. Zware compound rugbeweging.' },
  { id: 'r5',  name: 'Seated Cable Row',           muscleGroup: 'Rug',       description: 'Zittend rijen aan een kabel. Houd de rug recht en trek de ellebogen naar achteren. Goed voor mid-rugdikte.' },
  { id: 'r6',  name: 'Lat Pulldown',               muscleGroup: 'Rug',       description: 'Stang van boven naar de borst trekken aan een kabelstation. Traint de lats breed. Laat je schouders niet ophalen.' },
  { id: 'r7',  name: 'T-Bar Row',                  muscleGroup: 'Rug',       description: 'Rijen met een T-staaf of landmine. Neutrale greep is schoudervriendelijker. Zware optie voor rugdikte.' },
  { id: 'r8',  name: 'Single-Arm Dumbbell Row',    muscleGroup: 'Rug',       description: 'Één arm rijen met een dumbbell, andere hand op een bank. Grote bewegingsbaan, weinig compensatie mogelijk.' },
  { id: 'r9',  name: 'Face Pull',                  muscleGroup: 'Rug',       description: 'Kabel op hoofdhoogte naar het gezicht trekken met een touw. Traint de achterste deltaspieren en externe rotators. Goed voor schoudergezondheid.' },
  { id: 'r10', name: 'Straight-Arm Pulldown',      muscleGroup: 'Rug',       description: 'Gestrekte armen van boven naar beneden trekken aan een kabel. Isoleert de lats zonder bicepsbetrokkenheid.' },
  { id: 'r11', name: 'Rack Pull',                  muscleGroup: 'Rug',       description: 'Deadlift gestart vanuit een hogere positie (kniehoogte). Meer focus op bovenrug en trapezius. Geschikt voor zwaardere belasting.' },
  { id: 'r12', name: 'Pendlay Row',                muscleGroup: 'Rug',       description: 'Explosieve rij waarbij de stang elke herhaling de grond raakt. Dwingt een rechte rug af en stimuleert kracht en explosiviteit.' },
  { id: 'r13', name: 'Chest-Supported Row',        muscleGroup: 'Rug',       description: 'Rijen op een schuin bankje met de borst als steun. Elimineert rugcompensatie, volledige focus op de rugspieren.' },
  { id: 'r14', name: 'Good Morning',               muscleGroup: 'Rug',       description: 'Stang op de schouders, vooroverbuigen met rechte rug. Traint de hamstrings en erector spinae. Gebruik licht gewicht.' },
  { id: 'r15', name: 'Meadows Row',                muscleGroup: 'Rug',       description: 'Eénarmige rij met een landmine-setup in een gespleten houding. Zware belasting mogelijk, goed voor breedte en dikte.' },

  // Benen
  { id: 'l1',  name: 'Squat',                      muscleGroup: 'Benen',     description: 'De koningin van alle beenoefeningen. Stang op de bovenrug, diep zakken en omhoog drukken. Traint quads, billen en hamstrings.' },
  { id: 'l2',  name: 'Front Squat',                muscleGroup: 'Benen',     description: 'Stang voor op de schouders. Meer kniodominant dan back squat, traint de quads intensiever. Vereist goede mobiliteit.' },
  { id: 'l3',  name: 'Romanian Deadlift',          muscleGroup: 'Benen',     description: 'Stang langs de benen zakken door te buigen in de heupen met licht gebogen knieën. Primair voor hamstrings en bilspieren.' },
  { id: 'l4',  name: 'Leg Press',                  muscleGroup: 'Benen',     description: 'Voeten op een platform duwen in een machine. Voetpositie bepaalt welke spiergroep meer werkt. Veilig alternatief voor squat.' },
  { id: 'l5',  name: 'Lunge',                      muscleGroup: 'Benen',     description: 'Stap naar voren, zak verticaal totdat de achterste knie bijna de grond raakt. Traint quads, billen en balans.' },
  { id: 'l6',  name: 'Bulgarian Split Squat',      muscleGroup: 'Benen',     description: 'Achterste voet op een bank, voorste been buigen. Intensieve eenbeensoefening voor quads en billen. Zeer effectief.' },
  { id: 'l7',  name: 'Leg Extension',              muscleGroup: 'Benen',     description: 'Isolatieoefening voor de quadriceps in een machine. Goed als finisher. Let op kniebandbelasting bij volledig gestrekte positie.' },
  { id: 'l8',  name: 'Leg Curl',                   muscleGroup: 'Benen',     description: 'Hamstrings isoleren in liggend of zittend in een machine. Houd de heupen op de bank en curl volledig door.' },
  { id: 'l9',  name: 'Standing Calf Raise',        muscleGroup: 'Benen',     description: 'Hakken optillen terwijl je rechtop staat. Traint de gastrocnemius. Gebruik een volledig bewegingsbereik voor beste resultaten.' },
  { id: 'l10', name: 'Seated Calf Raise',          muscleGroup: 'Benen',     description: 'Zittend de hakken optillen met gewicht op de knieën. Traint de soleus (dieper kuitspier) effectiever dan staand.' },
  { id: 'l11', name: 'Hack Squat',                 muscleGroup: 'Benen',     description: 'Squat in een schuin slee-machine. Kniodominant, traint de quads intensief met minder rugbelasting dan een back squat.' },
  { id: 'l12', name: 'Goblet Squat',               muscleGroup: 'Benen',     description: 'Squat met een kettlebell of dumbbell voor de borst. Goed voor squattechniek en mobiliteitsontwikkeling.' },
  { id: 'l13', name: 'Step-Up',                    muscleGroup: 'Benen',     description: 'Op een bankje of box stappen met één been. Traint quads en billen unilateraal. Gebruik gewichten voor extra belasting.' },
  { id: 'l14', name: 'Box Jump',                   muscleGroup: 'Benen',     description: 'Explosief op een box springen. Traint kracht, explosiviteit en coördinatie. Zacht landen met gebogen knieën.' },
  { id: 'l15', name: 'Sumo Deadlift',              muscleGroup: 'Benen',     description: 'Deadlift met brede voetstand. Meer billen en adductoren dan conventionele deadlift. Kortere heffingshoogte.' },
  { id: 'l16', name: 'Hip Thrust',                 muscleGroup: 'Benen',     description: 'Schouders op een bank, stang op de heupen, heupen omhoog drukken. De effectiefste oefening voor de bilspieren.' },
  { id: 'l17', name: 'Glute Bridge',               muscleGroup: 'Benen',     description: 'Liggend op de grond de heupen omhoog drukken. Lichtere variant van hip thrust, goed als activatie of beginnersoefening.' },
  { id: 'l18', name: 'Nordic Hamstring Curl',      muscleGroup: 'Benen',     description: 'Enkels vastgehouden, langzaam voorover vallen en terugkomen. Uiterst effectief voor hamstring kracht en blessuurepreventie.' },
  { id: 'l19', name: 'Sissy Squat',                muscleGroup: 'Benen',     description: 'Knieën ver naar voren brengen terwijl de heupen recht blijven. Isoleert de quads extreem. Vereist goede kniemobiliteit.' },
  { id: 'l20', name: 'Reverse Lunge',              muscleGroup: 'Benen',     description: 'Stap naar achteren in plaats van vooruit. Minder kniestress dan forward lunge, traint quads en billen effectief.' },

  // Schouders
  { id: 's1',  name: 'Overhead Press',             muscleGroup: 'Schouders', description: 'Stang van schouderhoogte recht omhoog drukken. Traint de deltaspieren en triceps. Strak de core aan voor stabiliteit.' },
  { id: 's2',  name: 'Dumbbell Shoulder Press',    muscleGroup: 'Schouders', description: 'Dumbells van schouderhoogte omhoog drukken. Meer bewegingsvrijheid dan met een stang. Goed voor symmetrische schoudersontwikkeling.' },
  { id: 's3',  name: 'Lateral Raise',              muscleGroup: 'Schouders', description: 'Armen zijwaarts omhoog heffen tot schouderhoogte. Isoleert de middelste deltakop. Gebruik licht gewicht en voer langzaam uit.' },
  { id: 's4',  name: 'Front Raise',                muscleGroup: 'Schouders', description: 'Armen recht naar voren heffen tot schouderhoogte. Traint de voorste deltakop. Voorkom schommelen met de romp.' },
  { id: 's5',  name: 'Rear Delt Fly',              muscleGroup: 'Schouders', description: 'Voorovergebogen armen zijwaarts spreiden. Traint de achterste deltakop en verbetert de schouderhouding. Gebruik licht gewicht.' },
  { id: 's6',  name: 'Upright Row',                muscleGroup: 'Schouders', description: 'Stang of dumbells langs het lichaam omhoog trekken tot kin hoogte. Traint deltaspieren en trapezius. Let op schoudermobiliteit.' },
  { id: 's7',  name: 'Arnold Press',               muscleGroup: 'Schouders', description: 'Rotatiedrukbeweging waarbij je begint met palmen naar je toe en eindigt met palmen naar voren. Traint alle drie de deltakoppen.' },
  { id: 's8',  name: 'Cable Lateral Raise',        muscleGroup: 'Schouders', description: 'Lateral raise met een kabel voor continue spanning door de hele beweging. Effectiever dan dumbells in de toppositie.' },
  { id: 's9',  name: 'Machine Shoulder Press',     muscleGroup: 'Schouders', description: 'Gecontroleerde drukbeweging in een machine. Geschikt voor herstel of beginners. Minder stabilisatie vereist dan vrij gewicht.' },
  { id: 's10', name: 'Barbell Shrug',              muscleGroup: 'Schouders', description: 'Schouders ophalen met een stang. Traint de trapezius. Houd de beweging puur verticaal, geen cirkelbeweging.' },
  { id: 's11', name: 'Dumbbell Shrug',             muscleGroup: 'Schouders', description: 'Schouders ophalen met dumbells langs het lichaam. Zelfde als barbell shrug maar met iets meer bewegingsvrijheid.' },
  { id: 's12', name: 'Reverse Fly',                muscleGroup: 'Schouders', description: 'Zittend of voorovergebogen dumbells zijwaarts spreiden. Traint de achterste deltaspier en rhomboids. Goed voor rughouding.' },

  // Armen
  { id: 'a1',  name: 'Bicep Curl',                 muscleGroup: 'Armen',     description: 'Dumbells of stang omhoog curlen met supinatie greep. Basisoefening voor de biceps. Houd de ellebogen stil naast het lichaam.' },
  { id: 'a2',  name: 'Hammer Curl',                muscleGroup: 'Armen',     description: 'Curl met neutrale greep (duimen omhoog). Traint de brachialis en brachioradialis naast de biceps. Goed voor armdikte.' },
  { id: 'a3',  name: 'Preacher Curl',              muscleGroup: 'Armen',     description: 'Bicep curl op een schuine preacher bank. Elimineert swingen en isoleert de bicep volledig, met name de lange kop.' },
  { id: 'a4',  name: 'Concentration Curl',         muscleGroup: 'Armen',     description: 'Zittend met de elleboog op de binnenknie curlen. Maximale isolatie van de biceps. Goed voor piek-ontwikkeling.' },
  { id: 'a5',  name: 'Cable Curl',                 muscleGroup: 'Armen',     description: 'Bicep curl aan een kabel. Continue spanning in zowel de gecurde als de gestrekte positie. Goed als finisher.' },
  { id: 'a6',  name: 'Barbell Curl',               muscleGroup: 'Armen',     description: 'Stang curlen met beide handen. Laat zwaardere belasting toe dan dumbells. Supinatie greep activeert de biceps optimaal.' },
  { id: 'a7',  name: 'Spider Curl',                muscleGroup: 'Armen',     description: 'Voorover op een incline bank liggend curlen. De biceps werkt in het volledig verkorte bereik, wat een intense burn geeft.' },
  { id: 'a8',  name: 'Reverse Curl',               muscleGroup: 'Armen',     description: 'Curl met pronatie greep (palmen naar beneden). Traint de brachioradialis en extensoren van de onderarm.' },
  { id: 'a9',  name: 'Tricep Pushdown',            muscleGroup: 'Armen',     description: 'Kabel of touw naar beneden drukken. Basisoefening voor de triceps. Houd de ellebogen stil naast het lichaam.' },
  { id: 'a10', name: 'Skull Crusher',              muscleGroup: 'Armen',     description: 'Stang of dumbells naar het voorhoofd laten zakken liggend op een bank. Traint alle drie de tricepskoppen. Gebruik licht gewicht.' },
  { id: 'a11', name: 'Tricep Dip',                 muscleGroup: 'Armen',     description: 'Dip met rechte romp. Traint de triceps intensief. Houd de ellebogen naar achteren gericht, niet naar buiten.' },
  { id: 'a12', name: 'Overhead Tricep Extension',  muscleGroup: 'Armen',     description: 'Gewicht boven het hoofd zakken door de ellebogen te buigen. Traint de lange kop van de triceps door de extra stretch.' },
  { id: 'a13', name: 'Close-Grip Bench Press',     muscleGroup: 'Armen',     description: 'Bench press met smalle greep (schouderbreedte). Plaatst meer nadruk op de triceps dan op de borst.' },
  { id: 'a14', name: 'Wrist Curl',                 muscleGroup: 'Armen',     description: 'Polsen omhoog curlen met de onderarmen op de knieën of bank. Traint de onderarm flexoren. Gebruik licht gewicht.' },
  { id: 'a15', name: 'Rope Pushdown',              muscleGroup: 'Armen',     description: 'Tricep pushdown met een touw-attachment. Het touw splitsen aan het einde vergroot de range of motion en activatie.' },

  // Core
  { id: 'c1',  name: 'Plank',                      muscleGroup: 'Core',      description: 'Lichaamsgewicht op onderarmen en tenen, houd de positie. Traint de gehele core isometrisch. Adem rustig door.' },
  { id: 'c2',  name: 'Crunch',                     muscleGroup: 'Core',      description: 'Schouders van de grond tillen door de bovenbuik te contracteren. Houd de onderrug op de grond. Geen nekspanning.' },
  { id: 'c3',  name: 'Sit-Up',                     muscleGroup: 'Core',      description: 'Volledig rechtop komen vanuit liggende positie. Traint de buikspieren over een grote bewegingsbaan. Voetjes kunnen vasthouden.' },
  { id: 'c4',  name: 'Leg Raise',                  muscleGroup: 'Core',      description: 'Gestrekte benen omhoog heffen vanuit liggende positie. Traint de onderbuik intensief. Houd de onderrug op de grond.' },
  { id: 'c5',  name: 'Russian Twist',              muscleGroup: 'Core',      description: 'Zittend met geheven benen roteren van links naar rechts. Traint de schuine buikspieren. Gebruik een gewicht voor meer intensiteit.' },
  { id: 'c6',  name: 'Cable Crunch',               muscleGroup: 'Core',      description: 'Geknield een kabelgewicht naar de grond crunchen. Laat progressieve overbelasting toe op de buikspieren.' },
  { id: 'c7',  name: 'Ab Rollout',                 muscleGroup: 'Core',      description: 'Met een ab-roller of stang naar voren rollen en terugkomen. Extreem effectief voor de core-kracht en stabiliteit.' },
  { id: 'c8',  name: 'Hanging Leg Raise',          muscleGroup: 'Core',      description: 'Hangend aan een stang de benen omhoog brengen. Traint onderbuik en heupbuigers. Gevorderde variант van leg raise.' },
  { id: 'c9',  name: 'Bicycle Crunch',             muscleGroup: 'Core',      description: 'Crunch met rotatiebeweging waarbij de knie afwisselend naar de tegenoverliggende elleboog beweegt. Traint de schuine spieren.' },
  { id: 'c10', name: 'Side Plank',                 muscleGroup: 'Core',      description: 'Zijwaartse plankpositie op één onderarm. Traint de obliques en laterale stabiliteit. Houd de heupen omhoog.' },
  { id: 'c11', name: 'Dead Bug',                   muscleGroup: 'Core',      description: 'Op de rug liggend afwisselend arm en been strekken. Traint de diepe buikspieren met lage rugbelasting. Perfect voor stabiliteit.' },
  { id: 'c12', name: 'Pallof Press',               muscleGroup: 'Core',      description: 'Kabel voor de borst houden en uitstrekken terwijl je weerstand biedt aan rotatie. Anti-rotatie core training.' },
  { id: 'c13', name: 'Mountain Climber',           muscleGroup: 'Core',      description: 'Vanuit plankpositie afwisselend knieën naar de borst trekken. Combineert core-training met cardiovasculaire belasting.' },

  // Cardio
  { id: 'ca1', name: 'Treadmill',                  muscleGroup: 'Cardio',    description: 'Lopen of hardlopen op een loopband. Instelbaar tempo en helling. Goed voor aerobe conditie en calorieverbranding.' },
  { id: 'ca2', name: 'Stationary Bike',            muscleGroup: 'Cardio',    description: 'Fietsen op een hometrainer. Weinig belasting op de gewrichten. Geschikt voor herstel en duurtraining.' },
  { id: 'ca3', name: 'Rowing Machine',             muscleGroup: 'Cardio',    description: 'Roeiroeier die het hele lichaam traint. Combineert rug, benen en armen. Hoge calorieverbranding per tijdseenheid.' },
  { id: 'ca4', name: 'Elliptical',                 muscleGroup: 'Cardio',    description: 'Ellipsvormige beenbeweging met handvaten voor armbewegen. Schoudervriendelijk en belastingarm voor knieën en heupen.' },
  { id: 'ca5', name: 'Jump Rope',                  muscleGroup: 'Cardio',    description: 'Touwtjespringen. Hoge intensiteit, verbetert coördinatie, conditie en explosiviteit. Goed als opwarming of finisher.' },
  { id: 'ca6', name: 'Stair Climber',              muscleGroup: 'Cardio',    description: 'Traplopen op een machine. Traint de billen en benen terwijl het hart- en vaatstelsel belast wordt. Hoog calorieverbruik.' },
  { id: 'ca7', name: 'Battle Ropes',               muscleGroup: 'Cardio',    description: 'Zware touwen in golven bewegen. Traint de armen, schouders en core tegelijk. Interval-training bij uitstek.' },
  { id: 'ca8', name: 'Sled Push',                  muscleGroup: 'Cardio',    description: 'Een weighted sled over de vloer duwen. Traint de benen en conditie tegelijk. Geen excentrische fase, minder spierpijn.' },
  { id: 'ca9', name: 'Assault Bike',               muscleGroup: 'Cardio',    description: 'Luchtfietsmachine waarbij armen en benen tegelijk werken. Extreem hoge intensiteit mogelijk. Favoriet voor HIIT.' },
  { id: 'ca10',name: 'Box Step',                   muscleGroup: 'Cardio',    description: 'Stappatroon op en neer van een box in een rustig ritme. Laag-intensieve cardio, goed voor herstel of warming-up.' },
]
