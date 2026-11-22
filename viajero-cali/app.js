(() => {
'use strict';
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = n => '$ ' + Number(n).toLocaleString('es-CO');
const LANGS = ['es','en','fr','de','pt','it','nl'];

/* ---------- textos de la interfaz ---------- */
const T = {
es:{ribbon:'Demo de guía digital · hecho por LEGION Studio',ribbonCta:'Ver propuesta',kicker:'San Antonio · Cali',h1:'Bienvenido a la capital de la salsa.',heroSub:'Todo lo que necesitas durante tu estadía, en un solo lugar.',chipNfc:'Acerca tu celular o escanea',qToday:'Hoy',qBar:'Bar y piscina',qBreak:'Desayuno',qInfo:'Info útil',qRev:'Califícanos',wifiNet:'Red',wifiPass:'Clave',copy:'Copiar clave',copied:'Clave copiada',todayKicker:'Agenda de la semana',todayTitle:'¿Qué pasa hoy en Viajero?',todayNote:'Horarios de ejemplo para el demo. La recepción los actualiza desde su panel, sin reimprimir nada.',salsaKicker:'Salsa School',salsaTitle:'Clase grupal gratis todos los días.',salsaText:'¿Quieres llegar a Juanchito bailando de verdad? Reserva una clase privada con nuestros profes.',salsaCta:'Reservar clase privada',barKicker:'Bar y piscina · 7:00 a 22:00',barTitle:'Pide desde la piscina o tu mesa.',barLead:'Tu pedido le llega directo a la recepción de Cali. Sin hacer fila.',priceNote:'Precios de ejemplo para el demo.',breakKicker:'Desayuno',breakTitle:'Arepa, huevos, fruta y café del Valle.',breakText:'Resérvalo hoy para mañana y paga la tarifa especial.',breakCta:'Agregar a mi pedido',toursKicker:'Tours y planes',toursTitle:'Vive Cali con el grupo.',infoKicker:'Info útil',infoTitle:'Lo que siempre preguntan.',revKicker:'Tu opinión',revTitle:'¿Cómo va tu estadía?',revGood:'Nos alegra mucho. ¿Nos ayudas con una reseña? Toma 30 segundos.',revBad:'Lo sentimos. Cuéntanos qué pasó y la recepción lo resuelve hoy mismo.',revPh:'Ej.: el aire de mi cuarto no enfría',revSend:'Enviar a recepción',revDone:'Recibido. Alguien de recepción te busca en unos minutos.',nextKicker:'Tu próximo Viajero',nextTitle:'Sigue la ruta con nosotros.',nextLead:'Reserva tu siguiente destino desde aquí con beneficio del programa de lealtad.',helpTitle:'¿Necesitas algo?',helpText:'Escríbele a la recepción de Cali. Respondemos 24 horas.',helpCta:'Escribir a recepción',by:'Demo creado por LEGION Studio · legionestudio.com',order:'Pedido',free:'Gratis',from:'Desde',book:'Reservar',added:'Agregado a tu pedido',cartTitle:'Tu pedido',cartEmpty:'Aún no has agregado nada. Mira la carta del bar o los tours.',total:'Total',where:'¿Dónde estás?',wherePh:'Ej.: piscina, cama 12, habitación 4',name:'Tu nombre',send:'Enviar a recepción',prevTitle:'Así le llega a la recepción',prevNote:'Tú escribes en tu idioma; a la recepción le llega en español. En el demo no se envía nada.',people:'Personas',day:'Día',bookTitle:'Reservar',helpSheet:'Escribir a recepción',helpPh:'¿En qué te ayudamos?',goTo:'Ver sede',now:'Ahora',done:'Listo'},
en:{ribbon:'Digital guest guide demo · made by LEGION Studio',ribbonCta:'See proposal',kicker:'San Antonio · Cali',h1:'Welcome to the salsa capital of the world.',heroSub:'Everything you need during your stay, in one place.',chipNfc:'Tap your phone or scan',qToday:'Today',qBar:'Bar & pool',qBreak:'Breakfast',qInfo:'Good to know',qRev:'Rate us',wifiNet:'Network',wifiPass:'Password',copy:'Copy password',copied:'Password copied',todayKicker:'This week',todayTitle:'What’s on today at Viajero?',todayNote:'Sample times for the demo. Reception updates them from their panel, no reprinting.',salsaKicker:'Salsa School',salsaTitle:'Free group class every day.',salsaText:'Want to hit Juanchito and really dance? Book a private class with our teachers.',salsaCta:'Book a private class',barKicker:'Bar & pool · 7am to 10pm',barTitle:'Order from the pool or your table.',barLead:'Your order goes straight to the Cali front desk. No queues.',priceNote:'Sample prices for the demo.',breakKicker:'Breakfast',breakTitle:'Arepa, eggs, fruit and Valle coffee.',breakText:'Book it today for tomorrow and get the special rate.',breakCta:'Add to my order',toursKicker:'Tours & plans',toursTitle:'Live Cali with the crew.',infoKicker:'Good to know',infoTitle:'What everyone asks.',revKicker:'Your opinion',revTitle:'How is your stay going?',revGood:'We love to hear that. Could you leave us a review? It takes 30 seconds.',revBad:'We’re sorry. Tell us what happened and reception will fix it today.',revPh:'E.g. the AC in my room isn’t cooling',revSend:'Send to reception',revDone:'Got it. Someone from reception will find you in a few minutes.',nextKicker:'Your next Viajero',nextTitle:'Keep travelling with us.',nextLead:'Book your next stop from here with loyalty program perks.',helpTitle:'Need anything?',helpText:'Message the Cali front desk. We reply 24/7.',helpCta:'Message reception',by:'Demo made by LEGION Studio · legionestudio.com',order:'Order',free:'Free',from:'From',book:'Book',added:'Added to your order',cartTitle:'Your order',cartEmpty:'Nothing here yet. Check the bar menu or the tours.',total:'Total',where:'Where are you?',wherePh:'E.g. pool, bed 12, room 4',name:'Your name',send:'Send to reception',prevTitle:'This is what reception gets',prevNote:'You write in your language; reception gets it in Spanish. Nothing is sent in the demo.',people:'People',day:'Day',bookTitle:'Book',helpSheet:'Message reception',helpPh:'How can we help?',goTo:'See hostel',now:'Now',done:'Done'},
fr:{ribbon:'Démo de guide numérique · par LEGION Studio',ribbonCta:'Voir la proposition',kicker:'San Antonio · Cali',h1:'Bienvenue dans la capitale de la salsa.',heroSub:'Tout ce qu’il vous faut pendant votre séjour, au même endroit.',chipNfc:'Approchez votre téléphone ou scannez',qToday:'Aujourd’hui',qBar:'Bar et piscine',qBreak:'Petit-déj',qInfo:'Infos utiles',qRev:'Votre avis',wifiNet:'Réseau',wifiPass:'Mot de passe',copy:'Copier le mot de passe',copied:'Mot de passe copié',todayKicker:'Programme de la semaine',todayTitle:'Quoi de neuf aujourd’hui chez Viajero ?',todayNote:'Horaires d’exemple pour la démo. La réception les met à jour depuis son panneau, sans rien réimprimer.',salsaKicker:'Salsa School',salsaTitle:'Cours collectif gratuit tous les jours.',salsaText:'Envie de vraiment danser à Juanchito ? Réservez un cours privé avec nos profs.',salsaCta:'Réserver un cours privé',barKicker:'Bar et piscine · 7h à 22h',barTitle:'Commandez depuis la piscine ou votre table.',barLead:'Votre commande arrive directement à la réception de Cali. Sans file d’attente.',priceNote:'Prix d’exemple pour la démo.',breakKicker:'Petit-déjeuner',breakTitle:'Arepa, œufs, fruits et café du Valle.',breakText:'Réservez-le aujourd’hui pour demain au tarif spécial.',breakCta:'Ajouter à ma commande',toursKicker:'Tours et sorties',toursTitle:'Vivez Cali avec le groupe.',infoKicker:'Infos utiles',infoTitle:'Les questions de tout le monde.',revKicker:'Votre avis',revTitle:'Comment se passe votre séjour ?',revGood:'Ça nous fait plaisir. Un petit avis ? Ça prend 30 secondes.',revBad:'Désolés. Dites-nous ce qui s’est passé, la réception s’en occupe aujourd’hui.',revPh:'Ex. : la clim de ma chambre ne refroidit pas',revSend:'Envoyer à la réception',revDone:'Reçu. Quelqu’un de la réception vient vous voir dans quelques minutes.',nextKicker:'Votre prochain Viajero',nextTitle:'Continuez la route avec nous.',nextLead:'Réservez votre prochaine étape ici avec les avantages fidélité.',helpTitle:'Besoin de quelque chose ?',helpText:'Écrivez à la réception de Cali. Réponse 24 h/24.',helpCta:'Écrire à la réception',by:'Démo créée par LEGION Studio · legionestudio.com',order:'Commande',free:'Gratuit',from:'Dès',book:'Réserver',added:'Ajouté à votre commande',cartTitle:'Votre commande',cartEmpty:'Rien pour l’instant. Regardez la carte du bar ou les tours.',total:'Total',where:'Où êtes-vous ?',wherePh:'Ex. : piscine, lit 12, chambre 4',name:'Votre prénom',send:'Envoyer à la réception',prevTitle:'Voici ce que reçoit la réception',prevNote:'Vous écrivez dans votre langue ; la réception le reçoit en espagnol. Rien n’est envoyé dans la démo.',people:'Personnes',day:'Jour',bookTitle:'Réserver',helpSheet:'Écrire à la réception',helpPh:'Comment pouvons-nous aider ?',goTo:'Voir l’auberge',now:'Maintenant',done:'OK'},
de:{ribbon:'Demo digitaler Gästeguide · von LEGION Studio',ribbonCta:'Angebot ansehen',kicker:'San Antonio · Cali',h1:'Willkommen in der Hauptstadt der Salsa.',heroSub:'Alles für deinen Aufenthalt an einem Ort.',chipNfc:'Handy dranhalten oder scannen',qToday:'Heute',qBar:'Bar & Pool',qBreak:'Frühstück',qInfo:'Wichtige Infos',qRev:'Bewerten',wifiNet:'Netzwerk',wifiPass:'Passwort',copy:'Passwort kopieren',copied:'Passwort kopiert',todayKicker:'Wochenprogramm',todayTitle:'Was ist heute bei Viajero los?',todayNote:'Beispielzeiten für die Demo. Die Rezeption aktualisiert sie im Panel, ohne neu zu drucken.',salsaKicker:'Salsa School',salsaTitle:'Jeden Tag kostenloser Gruppenkurs.',salsaText:'Willst du in Juanchito richtig tanzen? Buch eine Privatstunde bei unseren Lehrern.',salsaCta:'Privatstunde buchen',barKicker:'Bar & Pool · 7 bis 22 Uhr',barTitle:'Bestell direkt vom Pool oder Tisch.',barLead:'Deine Bestellung geht direkt an die Rezeption in Cali. Ohne Anstehen.',priceNote:'Beispielpreise für die Demo.',breakKicker:'Frühstück',breakTitle:'Arepa, Eier, Obst und Kaffee aus dem Valle.',breakText:'Heute für morgen buchen und Sonderpreis zahlen.',breakCta:'Zur Bestellung hinzufügen',toursKicker:'Touren & Pläne',toursTitle:'Erlebe Cali mit der Gruppe.',infoKicker:'Wichtige Infos',infoTitle:'Was alle fragen.',revKicker:'Deine Meinung',revTitle:'Wie läuft dein Aufenthalt?',revGood:'Das freut uns sehr. Hilfst du uns mit einer Bewertung? Dauert 30 Sekunden.',revBad:'Das tut uns leid. Erzähl uns, was los war – die Rezeption kümmert sich heute darum.',revPh:'Z. B.: die Klimaanlage kühlt nicht',revSend:'An die Rezeption senden',revDone:'Erhalten. Jemand von der Rezeption kommt gleich zu dir.',nextKicker:'Dein nächstes Viajero',nextTitle:'Reise mit uns weiter.',nextLead:'Buche dein nächstes Ziel direkt hier mit Treueprogramm-Vorteil.',helpTitle:'Brauchst du etwas?',helpText:'Schreib der Rezeption in Cali. Wir antworten rund um die Uhr.',helpCta:'Rezeption anschreiben',by:'Demo von LEGION Studio · legionestudio.com',order:'Bestellung',free:'Gratis',from:'Ab',book:'Buchen',added:'Zur Bestellung hinzugefügt',cartTitle:'Deine Bestellung',cartEmpty:'Noch nichts drin. Schau dir die Barkarte oder die Touren an.',total:'Summe',where:'Wo bist du?',wherePh:'Z. B. Pool, Bett 12, Zimmer 4',name:'Dein Name',send:'An die Rezeption senden',prevTitle:'So kommt es an der Rezeption an',prevNote:'Du schreibst in deiner Sprache, die Rezeption bekommt es auf Spanisch. In der Demo wird nichts gesendet.',people:'Personen',day:'Tag',bookTitle:'Buchen',helpSheet:'Rezeption anschreiben',helpPh:'Wie können wir helfen?',goTo:'Hostel ansehen',now:'Jetzt',done:'Fertig'},
pt:{ribbon:'Demo de guia digital · feito por LEGION Studio',ribbonCta:'Ver proposta',kicker:'San Antonio · Cali',h1:'Bem-vindo à capital da salsa.',heroSub:'Tudo o que você precisa durante a estadia, em um só lugar.',chipNfc:'Aproxime o celular ou escaneie',qToday:'Hoje',qBar:'Bar e piscina',qBreak:'Café da manhã',qInfo:'Info útil',qRev:'Avalie',wifiNet:'Rede',wifiPass:'Senha',copy:'Copiar senha',copied:'Senha copiada',todayKicker:'Agenda da semana',todayTitle:'O que rola hoje no Viajero?',todayNote:'Horários de exemplo para o demo. A recepção atualiza pelo painel, sem reimprimir nada.',salsaKicker:'Salsa School',salsaTitle:'Aula em grupo grátis todos os dias.',salsaText:'Quer chegar em Juanchito dançando de verdade? Reserve uma aula particular com nossos professores.',salsaCta:'Reservar aula particular',barKicker:'Bar e piscina · 7h às 22h',barTitle:'Peça da piscina ou da sua mesa.',barLead:'Seu pedido chega direto na recepção de Cali. Sem fila.',priceNote:'Preços de exemplo para o demo.',breakKicker:'Café da manhã',breakTitle:'Arepa, ovos, frutas e café do Valle.',breakText:'Reserve hoje para amanhã e pague a tarifa especial.',breakCta:'Adicionar ao pedido',toursKicker:'Tours e passeios',toursTitle:'Viva Cali com a galera.',infoKicker:'Info útil',infoTitle:'O que todo mundo pergunta.',revKicker:'Sua opinião',revTitle:'Como está sua estadia?',revGood:'Que bom! Pode nos deixar uma avaliação? Leva 30 segundos.',revBad:'Sentimos muito. Conte o que aconteceu e a recepção resolve hoje mesmo.',revPh:'Ex.: o ar do meu quarto não gela',revSend:'Enviar à recepção',revDone:'Recebido. Alguém da recepção vai te procurar em minutos.',nextKicker:'Seu próximo Viajero',nextTitle:'Continue a viagem com a gente.',nextLead:'Reserve o próximo destino daqui com benefício do programa de fidelidade.',helpTitle:'Precisa de algo?',helpText:'Fale com a recepção de Cali. Respondemos 24 horas.',helpCta:'Falar com a recepção',by:'Demo criado por LEGION Studio · legionestudio.com',order:'Pedido',free:'Grátis',from:'A partir de',book:'Reservar',added:'Adicionado ao pedido',cartTitle:'Seu pedido',cartEmpty:'Nada por aqui ainda. Veja o cardápio do bar ou os tours.',total:'Total',where:'Onde você está?',wherePh:'Ex.: piscina, cama 12, quarto 4',name:'Seu nome',send:'Enviar à recepção',prevTitle:'Assim chega na recepção',prevNote:'Você escreve no seu idioma; a recepção recebe em espanhol. No demo nada é enviado.',people:'Pessoas',day:'Dia',bookTitle:'Reservar',helpSheet:'Falar com a recepção',helpPh:'Como podemos ajudar?',goTo:'Ver hostel',now:'Agora',done:'Pronto'},
it:{ribbon:'Demo di guida digitale · di LEGION Studio',ribbonCta:'Vedi proposta',kicker:'San Antonio · Cali',h1:'Benvenuto nella capitale della salsa.',heroSub:'Tutto ciò che ti serve durante il soggiorno, in un unico posto.',chipNfc:'Avvicina il telefono o scansiona',qToday:'Oggi',qBar:'Bar e piscina',qBreak:'Colazione',qInfo:'Info utili',qRev:'Valutaci',wifiNet:'Rete',wifiPass:'Password',copy:'Copia password',copied:'Password copiata',todayKicker:'Programma della settimana',todayTitle:'Cosa succede oggi al Viajero?',todayNote:'Orari di esempio per la demo. La reception li aggiorna dal pannello, senza ristampare nulla.',salsaKicker:'Salsa School',salsaTitle:'Lezione di gruppo gratis ogni giorno.',salsaText:'Vuoi arrivare a Juanchito ballando davvero? Prenota una lezione privata con i nostri maestri.',salsaCta:'Prenota lezione privata',barKicker:'Bar e piscina · 7:00–22:00',barTitle:'Ordina dalla piscina o dal tuo tavolo.',barLead:'L’ordine arriva diretto alla reception di Cali. Senza fila.',priceNote:'Prezzi di esempio per la demo.',breakKicker:'Colazione',breakTitle:'Arepa, uova, frutta e caffè del Valle.',breakText:'Prenotala oggi per domani alla tariffa speciale.',breakCta:'Aggiungi all’ordine',toursKicker:'Tour e attività',toursTitle:'Vivi Cali con il gruppo.',infoKicker:'Info utili',infoTitle:'Quello che chiedono tutti.',revKicker:'La tua opinione',revTitle:'Come va il tuo soggiorno?',revGood:'Che bello! Ci lasci una recensione? Bastano 30 secondi.',revBad:'Ci dispiace. Raccontaci cosa è successo e la reception lo risolve oggi.',revPh:'Es.: l’aria condizionata non raffredda',revSend:'Invia alla reception',revDone:'Ricevuto. Qualcuno della reception ti raggiunge tra pochi minuti.',nextKicker:'Il tuo prossimo Viajero',nextTitle:'Continua il viaggio con noi.',nextLead:'Prenota la prossima tappa da qui con i vantaggi fedeltà.',helpTitle:'Ti serve qualcosa?',helpText:'Scrivi alla reception di Cali. Rispondiamo 24 ore su 24.',helpCta:'Scrivi alla reception',by:'Demo creata da LEGION Studio · legionestudio.com',order:'Ordine',free:'Gratis',from:'Da',book:'Prenota',added:'Aggiunto all’ordine',cartTitle:'Il tuo ordine',cartEmpty:'Ancora niente. Guarda il menu del bar o i tour.',total:'Totale',where:'Dove sei?',wherePh:'Es.: piscina, letto 12, camera 4',name:'Il tuo nome',send:'Invia alla reception',prevTitle:'Ecco cosa riceve la reception',prevNote:'Tu scrivi nella tua lingua; la reception lo riceve in spagnolo. Nella demo non viene inviato nulla.',people:'Persone',day:'Giorno',bookTitle:'Prenota',helpSheet:'Scrivi alla reception',helpPh:'Come possiamo aiutarti?',goTo:'Vedi ostello',now:'Ora',done:'Fatto'},
nl:{ribbon:'Demo digitale gastengids · door LEGION Studio',ribbonCta:'Bekijk voorstel',kicker:'San Antonio · Cali',h1:'Welkom in de hoofdstad van de salsa.',heroSub:'Alles wat je nodig hebt tijdens je verblijf, op één plek.',chipNfc:'Houd je telefoon ertegen of scan',qToday:'Vandaag',qBar:'Bar & zwembad',qBreak:'Ontbijt',qInfo:'Handige info',qRev:'Beoordeel ons',wifiNet:'Netwerk',wifiPass:'Wachtwoord',copy:'Wachtwoord kopiëren',copied:'Wachtwoord gekopieerd',todayKicker:'Weekprogramma',todayTitle:'Wat is er vandaag bij Viajero?',todayNote:'Voorbeeldtijden voor de demo. De receptie past ze aan in het paneel, zonder opnieuw te printen.',salsaKicker:'Salsa School',salsaTitle:'Elke dag een gratis groepsles.',salsaText:'Wil je in Juanchito echt kunnen dansen? Boek een privéles bij onze leraren.',salsaCta:'Privéles boeken',barKicker:'Bar & zwembad · 7.00–22.00',barTitle:'Bestel vanaf het zwembad of je tafel.',barLead:'Je bestelling gaat direct naar de receptie in Cali. Geen rij.',priceNote:'Voorbeeldprijzen voor de demo.',breakKicker:'Ontbijt',breakTitle:'Arepa, eieren, fruit en koffie uit de Valle.',breakText:'Boek vandaag voor morgen en betaal het speciale tarief.',breakCta:'Aan bestelling toevoegen',toursKicker:'Tours & plannen',toursTitle:'Beleef Cali met de groep.',infoKicker:'Handige info',infoTitle:'Wat iedereen vraagt.',revKicker:'Jouw mening',revTitle:'Hoe bevalt je verblijf?',revGood:'Wat fijn! Laat je een review achter? Duurt 30 seconden.',revBad:'Sorry. Vertel wat er gebeurde, de receptie lost het vandaag op.',revPh:'Bijv.: de airco koelt niet',revSend:'Naar de receptie sturen',revDone:'Ontvangen. Iemand van de receptie komt zo naar je toe.',nextKicker:'Jouw volgende Viajero',nextTitle:'Reis met ons verder.',nextLead:'Boek je volgende bestemming hier met voordeel van het loyaliteitsprogramma.',helpTitle:'Iets nodig?',helpText:'Stuur de receptie in Cali een bericht. We reageren 24/7.',helpCta:'Bericht naar receptie',by:'Demo gemaakt door LEGION Studio · legionestudio.com',order:'Bestelling',free:'Gratis',from:'Vanaf',book:'Boeken',added:'Toegevoegd aan je bestelling',cartTitle:'Je bestelling',cartEmpty:'Nog niets toegevoegd. Bekijk de barkaart of de tours.',total:'Totaal',where:'Waar ben je?',wherePh:'Bijv. zwembad, bed 12, kamer 4',name:'Je naam',send:'Naar de receptie sturen',prevTitle:'Zo komt het binnen bij de receptie',prevNote:'Jij schrijft in je eigen taal; de receptie krijgt het in het Spaans. In de demo wordt niets verstuurd.',people:'Personen',day:'Dag',bookTitle:'Boeken',helpSheet:'Bericht naar receptie',helpPh:'Waarmee kunnen we helpen?',goTo:'Bekijk hostel',now:'Nu',done:'Klaar'}
};

/* ---------- agenda (0 = domingo) ---------- */
const EV = {
salsa:{paid:0,es:['Clase de salsa','Grupal, en la terraza. Todos los niveles.'],en:['Salsa class','Group class on the terrace. All levels.'],fr:['Cours de salsa','Collectif, sur la terrasse. Tous niveaux.'],de:['Salsakurs','Gruppenkurs auf der Terrasse. Alle Level.'],pt:['Aula de salsa','Em grupo, no terraço. Todos os níveis.'],it:['Lezione di salsa','Di gruppo, in terrazza. Tutti i livelli.'],nl:['Salsales','Groepsles op het terras. Alle niveaus.']},
walk:{paid:1,es:['Walking tour San Antonio','Iglesia, miradores y cafés del barrio.'],en:['San Antonio walking tour','Church, viewpoints and neighborhood cafés.'],fr:['Visite à pied de San Antonio','Église, belvédères et cafés du quartier.'],de:['Stadtrundgang San Antonio','Kirche, Aussichtspunkte und Cafés im Viertel.'],pt:['Walking tour San Antonio','Igreja, mirantes e cafés do bairro.'],it:['Walking tour San Antonio','Chiesa, belvedere e caffè del quartiere.'],nl:['Wandeltour San Antonio','Kerk, uitkijkpunten en cafés in de wijk.']},
yoga:{paid:0,es:['Yoga al amanecer','Junto a la piscina. Trae tu toalla.'],en:['Sunrise yoga','By the pool. Bring your towel.'],fr:['Yoga au lever du soleil','Au bord de la piscine. Apportez votre serviette.'],de:['Yoga bei Sonnenaufgang','Am Pool. Bring dein Handtuch mit.'],pt:['Yoga ao amanhecer','Ao lado da piscina. Traga sua toalha.'],it:['Yoga all’alba','A bordo piscina. Porta l’asciugamano.'],nl:['Yoga bij zonsopgang','Bij het zwembad. Neem je handdoek mee.']},
spanish:{paid:0,es:['Clase de español','Frases para la calle, la rumba y el mercado.'],en:['Spanish class','Phrases for the street, the party and the market.'],fr:['Cours d’espagnol','Phrases pour la rue, la fête et le marché.'],de:['Spanischkurs','Sätze für die Straße, die Party und den Markt.'],pt:['Aula de espanhol','Frases para a rua, a festa e o mercado.'],it:['Lezione di spagnolo','Frasi per la strada, la festa e il mercato.'],nl:['Spaanse les','Zinnen voor de straat, het feest en de markt.']},
olymp:{paid:1,es:['Olimpiadas de bebidas','Retos y juegos. Compra una cerveza en recepción para entrar.'],en:['Drinking Olympics','Games and challenges. Buy a beer at reception to join.'],fr:['Olympiades de boissons','Jeux et défis. Achetez une bière à la réception pour participer.'],de:['Trink-Olympiade','Spiele und Challenges. Kauf ein Bier an der Rezeption zum Mitmachen.'],pt:['Olimpíadas de bebidas','Jogos e desafios. Compre uma cerveja na recepção para entrar.'],it:['Olimpiadi del bere','Giochi e sfide. Compra una birra alla reception per partecipare.'],nl:['Drankspelen','Spellen en uitdagingen. Koop een biertje bij de receptie om mee te doen.']},
chiva:{paid:1,es:['Chiva Rumbera','Bus de fiesta con música, juegos y city tour.'],en:['Chiva Rumbera','Party bus with music, games and a city tour.'],fr:['Chiva Rumbera','Bus de fête avec musique, jeux et tour de ville.'],de:['Chiva Rumbera','Partybus mit Musik, Spielen und Stadtrundfahrt.'],pt:['Chiva Rumbera','Ônibus de festa com música, jogos e city tour.'],it:['Chiva Rumbera','Bus della festa con musica, giochi e city tour.'],nl:['Chiva Rumbera','Feestbus met muziek, spellen en stadstour.']},
party:{paid:0,es:['Fiesta en la terraza','DJ, salsa y reggaetón hasta tarde.'],en:['Terrace party','DJ, salsa and reggaeton till late.'],fr:['Soirée sur la terrasse','DJ, salsa et reggaeton jusque tard.'],de:['Terrassenparty','DJ, Salsa und Reggaeton bis spät.'],pt:['Festa no terraço','DJ, salsa e reggaeton até tarde.'],it:['Festa in terrazza','DJ, salsa e reggaeton fino a tardi.'],nl:['Terrasfeest','DJ, salsa en reggaeton tot laat.']},
juanchito:{paid:1,es:['Noche de salsa en Juanchito','Salimos en grupo a las salsotecas más famosas.'],en:['Salsa night in Juanchito','We head out together to the most famous salsa clubs.'],fr:['Soirée salsa à Juanchito','On sort en groupe dans les salsothèques les plus célèbres.'],de:['Salsanacht in Juanchito','Gemeinsam in die berühmtesten Salsaclubs.'],pt:['Noite de salsa em Juanchito','Saímos em grupo para as salsotecas mais famosas.'],it:['Notte di salsa a Juanchito','Usciamo in gruppo nelle salsoteche più famose.'],nl:['Salsanacht in Juanchito','Samen naar de bekendste salsaclubs.']},
pool:{paid:0,es:['Domingo de piscina','Música tranquila y happy hour en el bar.'],en:['Pool Sunday','Chill music and happy hour at the bar.'],fr:['Dimanche piscine','Musique tranquille et happy hour au bar.'],de:['Pool-Sonntag','Entspannte Musik und Happy Hour an der Bar.'],pt:['Domingo de piscina','Música tranquila e happy hour no bar.'],it:['Domenica in piscina','Musica rilassata e happy hour al bar.'],nl:['Zwembadzondag','Rustige muziek en happy hour aan de bar.']}
};
const WEEK = {
0:[['08:00','yoga'],['12:00','pool'],['17:00','salsa']],
1:[['10:00','walk'],['16:00','spanish'],['17:00','salsa']],
2:[['10:00','walk'],['17:00','salsa'],['21:00','olymp']],
3:[['08:00','yoga'],['10:00','walk'],['17:00','salsa']],
4:[['10:00','walk'],['16:00','spanish'],['17:00','salsa'],['21:30','juanchito']],
5:[['10:00','walk'],['17:00','salsa'],['20:30','chiva'],['22:00','party']],
6:[['10:00','walk'],['17:00','salsa'],['22:00','party']]
};

/* ---------- carta del bar ---------- */
const CATS = {beer:{es:'Cervezas',en:'Beers',fr:'Bières',de:'Biere',pt:'Cervejas',it:'Birre',nl:'Bieren'},cock:{es:'Cócteles',en:'Cocktails',fr:'Cocktails',de:'Cocktails',pt:'Coquetéis',it:'Cocktail',nl:'Cocktails'},soft:{es:'Sin alcohol',en:'Non-alcoholic',fr:'Sans alcool',de:'Alkoholfrei',pt:'Sem álcool',it:'Analcolici',nl:'Alcoholvrij'},food:{es:'Para picar',en:'Snacks',fr:'À grignoter',de:'Snacks',pt:'Petiscos',it:'Da sgranocchiare',nl:'Hapjes'}};
const MENU = [
['beer','Cerveza nacional',7000],['beer','Club Colombia',8000],['beer','Michelada',10000],['beer','Balde x5',32000],
['cock','Mojito',22000],['cock','Cuba libre',18000],['cock','Margarita de maracuyá',22000],['cock','Shot de aguardiente',6000],
['soft','Limonada de coco',9000],['soft','Jugo de lulo',7000],['soft','Agua',4000],['soft','Tinto (café)',3000],
['food','Empanadas x4',12000],['food','Patacones con hogao',14000],['food','Nachos',20000],['food','Hamburguesa',25000]
];
const EXTRA = {desayuno:{n:'Desayuno (mañana)',p:18000}, privada:{n:'Clase privada de salsa',p:60000}};

/* ---------- tours ---------- */
const TOURS = [
{k:'chiva',img:'img/chiva.jpg',p:60000},
{k:'walk',img:'img/walking.jpg',p:35000},
{k:'juanchito',img:'img/calinoche.jpg',p:45000},
{k:'cristo',img:'img/cristo.jpg',p:55000}
];
const TOURTX = {
cristo:{es:['Cristo Rey y miradores','Atardecer con la mejor vista de Cali.'],en:['Cristo Rey & viewpoints','Sunset with the best view of Cali.'],fr:['Cristo Rey et belvédères','Coucher de soleil avec la plus belle vue de Cali.'],de:['Cristo Rey & Aussichtspunkte','Sonnenuntergang mit dem besten Blick auf Cali.'],pt:['Cristo Rey e mirantes','Pôr do sol com a melhor vista de Cali.'],it:['Cristo Rey e belvedere','Tramonto con la vista più bella di Cali.'],nl:['Cristo Rey & uitkijkpunten','Zonsondergang met het mooiste uitzicht op Cali.']}
};

/* ---------- preguntas ---------- */
const FAQ = [
{i:'i-key',es:['Check-in y check-out','Check-in desde las 15:00 (recepción 24 h). Check-out hasta las 11:00. Puedes dejar tu equipaje en consigna antes o después.'],en:['Check-in & check-out','Check-in from 3pm (24h reception). Check-out by 11am. You can leave your luggage before or after.'],fr:['Arrivée et départ','Arrivée dès 15h (réception 24h/24). Départ avant 11h. Bagagerie disponible avant et après.'],de:['Check-in & Check-out','Check-in ab 15 Uhr (Rezeption 24 h). Check-out bis 11 Uhr. Gepäckaufbewahrung davor und danach.'],pt:['Check-in e check-out','Check-in a partir das 15h (recepção 24 h). Check-out até 11h. Pode deixar a bagagem antes ou depois.'],it:['Check-in e check-out','Check-in dalle 15:00 (reception 24 h). Check-out entro le 11:00. Deposito bagagli prima e dopo.'],nl:['In- en uitchecken','Inchecken vanaf 15.00 (receptie 24 uur). Uitchecken tot 11.00. Bagage kan je voor en na achterlaten.']},
{i:'i-shield',es:['IVA para extranjeros','Si no resides en Colombia y tu pasaporte tiene sello TP, no pagas el 19 % de IVA. Muéstralo en recepción.'],en:['VAT for foreigners','If you don’t live in Colombia and your passport has a TP stamp, you don’t pay the 19% VAT. Show it at reception.'],fr:['TVA pour les étrangers','Si vous ne résidez pas en Colombie et avez le tampon TP, vous ne payez pas les 19 % de TVA. Montrez-le à la réception.'],de:['MwSt. für Ausländer','Wenn du nicht in Kolumbien lebst und einen TP-Stempel hast, zahlst du keine 19 % MwSt. Zeig ihn an der Rezeption.'],pt:['IVA para estrangeiros','Se você não mora na Colômbia e tem o carimbo TP, não paga os 19% de IVA. Mostre na recepção.'],it:['IVA per stranieri','Se non risiedi in Colombia e hai il timbro TP, non paghi il 19% di IVA. Mostralo alla reception.'],nl:['Btw voor buitenlanders','Woon je niet in Colombia en heb je een TP-stempel, dan betaal je geen 19% btw. Laat het zien bij de receptie.']},
{i:'i-wave',es:['Piscina','Abierta de 7:00 a 22:00. Toallas en recepción.'],en:['Pool','Open 7am to 10pm. Towels at reception.'],fr:['Piscine','Ouverte de 7h à 22h. Serviettes à la réception.'],de:['Pool','Geöffnet von 7 bis 22 Uhr. Handtücher an der Rezeption.'],pt:['Piscina','Aberta das 7h às 22h. Toalhas na recepção.'],it:['Piscina','Aperta dalle 7:00 alle 22:00. Asciugamani alla reception.'],nl:['Zwembad','Open van 7.00 tot 22.00. Handdoeken bij de receptie.']},
{i:'i-shirt',es:['Lavandería','Deja tu ropa en recepción antes de las 10:00 y la recibes el mismo día.'],en:['Laundry','Drop your clothes at reception before 10am and get them back the same day.'],fr:['Laverie','Déposez votre linge à la réception avant 10h, rendu le jour même.'],de:['Wäscheservice','Wäsche bis 10 Uhr an der Rezeption abgeben, am selben Tag zurück.'],pt:['Lavanderia','Deixe sua roupa na recepção antes das 10h e receba no mesmo dia.'],it:['Lavanderia','Lascia i vestiti alla reception entro le 10:00, pronti in giornata.'],nl:['Wasserij','Lever je kleren voor 10.00 in bij de receptie, dezelfde dag terug.']},
{i:'i-pin',es:['Cómo moverte','Pide taxi o app desde recepción. Al aeropuerto: unos 40 minutos.'],en:['Getting around','Ask reception for a taxi or ride app. Airport: about 40 minutes.'],fr:['Se déplacer','Demandez un taxi ou une appli à la réception. Aéroport : environ 40 minutes.'],de:['Unterwegs','Taxi oder App über die Rezeption. Flughafen: ca. 40 Minuten.'],pt:['Como se locomover','Peça táxi ou app na recepção. Aeroporto: cerca de 40 minutos.'],it:['Come muoversi','Chiedi un taxi o un’app alla reception. Aeroporto: circa 40 minuti.'],nl:['Vervoer','Vraag een taxi of app via de receptie. Luchthaven: ongeveer 40 minuten.']},
{i:'i-info',es:['Emergencias','Línea de emergencias en Colombia: 123. La recepción está abierta las 24 horas.'],en:['Emergencies','Emergency line in Colombia: 123. Reception is open 24/7.'],fr:['Urgences','Numéro d’urgence en Colombie : 123. Réception ouverte 24h/24.'],de:['Notfälle','Notruf in Kolumbien: 123. Die Rezeption ist rund um die Uhr geöffnet.'],pt:['Emergências','Linha de emergência na Colômbia: 123. Recepção aberta 24 horas.'],it:['Emergenze','Numero di emergenza in Colombia: 123. Reception aperta 24 ore su 24.'],nl:['Noodgevallen','Alarmnummer in Colombia: 123. De receptie is 24/7 open.']}
];

/* ---------- otras sedes ---------- */
const DEST = [
['Medellín','Hostel','#1d6b49'],['Salento','Hostel','#b8862b'],['Cartagena','Getsemaní & Rooftop','#d8412b'],['Bogotá','Hostel & Spa','#3e5a8a'],
['Santa Marta','Hostel','#1b8c88'],['Tayrona','Hostel & Ecohabs','#14513a'],['San Andrés','Hostel','#0e7fa8'],['Guatapé','Hostel & Lake Club','#a0306a']
];

/* ---------- estado ---------- */
let lang = 'es', day = new Date().getDay(), cat = 'beer', cart = {}, bookings = [];
try { const s = localStorage.getItem('vj_lang'); if (LANGS.includes(s)) lang = s; else { const n = (navigator.language||'es').slice(0,2); if (LANGS.includes(n)) lang = n; } } catch(e) {}
const t = k => (T[lang] && T[lang][k]) || T.es[k] || k;

function applyText(){
  document.documentElement.lang = lang;
  $$('[data-t]').forEach(el => el.textContent = t(el.dataset.t));
  $$('[data-tp]').forEach(el => el.placeholder = t(el.dataset.tp));
  $('#lang').value = lang;
  renderDays(); renderAgenda(); renderMenuTabs(); renderMenu(); renderTours(); renderFaq(); renderDest(); renderStars(); updateCount();
}

/* agenda */
function renderDays(){
  const fmt = new Intl.DateTimeFormat(lang, {weekday:'short'});
  const base = new Date(); const today = base.getDay();
  let html = '';
  for (let i = 0; i < 7; i++){
    const d = new Date(base); d.setDate(base.getDate() + i); const wd = d.getDay();
    html += `<button type="button" role="tab" aria-selected="${wd===day}" data-day="${wd}"><span>${esc(fmt.format(d).replace('.',''))}</span><b>${d.getDate()}</b>${wd===today?'<i class="today-dot"></i>':''}</button>`;
  }
  $('#days').innerHTML = html;
}
function renderAgenda(){
  const now = new Date(), isToday = day === now.getDay(), hm = now.getHours()*60 + now.getMinutes();
  const list = WEEK[day];
  let nextIdx = -1;
  if (isToday) nextIdx = list.findIndex(([h]) => { const [a,b] = h.split(':').map(Number); return a*60+b+60 > hm; });
  $('#agenda').innerHTML = list.map(([h,k],i) => { const e = EV[k], tx = e[lang] || e.es; return `<li class="ev${i===nextIdx?' now':''}"><time>${h}</time><div><h3>${esc(tx[0])}</h3><p>${esc(tx[1])}</p></div><span class="pill ${e.paid?'paid':'free'}">${e.paid?esc(t('book')):esc(t('free'))}</span></li>`; }).join('');
}

/* carta */
function renderMenuTabs(){ $('#menuTabs').innerHTML = Object.keys(CATS).map(c => `<button type="button" role="tab" data-cat="${c}" aria-selected="${c===cat}">${esc(CATS[c][lang]||CATS[c].es)}</button>`).join(''); }
function renderMenu(){
  $('#menu').innerHTML = MENU.map((m,i) => m[0]!==cat ? '' : `<li class="item"><div><h4>${esc(m[1])}</h4><p class="p">${money(m[2])}</p></div><div class="qty">${cart['m'+i]?`<button type="button" data-dec="m${i}" aria-label="-"><svg><use href="#i-minus"/></svg></button><span>${cart['m'+i]}</span>`:''}<button type="button" class="add" data-inc="m${i}" aria-label="+"><svg><use href="#i-plus"/></svg></button></div></li>`).join('');
}
function itemOf(id){ if (id[0]==='m'){ const m = MENU[+id.slice(1)]; return {n:m[1],p:m[2]}; } return EXTRA[id]; }
function updateCount(){ const n = Object.values(cart).reduce((a,b)=>a+b,0) + bookings.length; $('#cartCount').textContent = n; }
function bump(){ const b = $('#cartBtn'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
function add(id){ cart[id] = (cart[id]||0)+1; renderMenu(); updateCount(); bump(); toast(t('added')); }

/* tours */
function tourTx(k){ return (TOURTX[k]||EV[k])[lang] || (TOURTX[k]||EV[k]).es; }
function renderTours(){
  $('#toursList').innerHTML = TOURS.map(o => { const tx = tourTx(o.k); return `<article class="tour"><img src="${o.img}" alt="" loading="lazy"><div class="tour-b"><h3>${esc(tx[0])}</h3><p>${esc(tx[1])}</p><div class="tour-f"><b>${esc(t('from'))} ${money(o.p)}</b><button type="button" data-tour="${o.k}">${esc(t('book'))}</button></div></div></article>`; }).join('');
}

function renderFaq(){ $('#faq').innerHTML = FAQ.map(f => { const tx = f[lang]||f.es; return `<details><summary><svg><use href="#${f.i}"/></svg>${esc(tx[0])}</summary><p>${esc(tx[1])}</p></details>`; }).join(''); }
function renderDest(){ $('#dest').innerHTML = DEST.map(([c,s,col]) => `<a class="dcard" style="background:${col}" href="https://www.viajerohostels.com/es/destinos" target="_blank" rel="noopener"><small>Viajero</small><div><h3>${esc(c)}</h3><p>${esc(s)}</p></div><span>${esc(t('goTo'))} <svg><use href="#i-arrow"/></svg></span></a>`).join(''); }

/* reseña */
let rating = 0;
function renderStars(){ $('#stars').innerHTML = [1,2,3,4,5].map(n => `<button type="button" role="radio" aria-checked="${n===rating}" aria-label="${n}" data-star="${n}" class="${n<=rating?'on':''}"><svg><use href="#i-star"/></svg></button>`).join(''); }

/* hoja */
const sheet = $('#sheet'), back = $('#sheetBack');
function openSheet(title, html){ $('#sheetTitle').textContent = title; $('#sheetBody').innerHTML = html; sheet.hidden = false; back.hidden = false; document.body.style.overflow = 'hidden'; setTimeout(()=>{ const f = sheet.querySelector('input,select,textarea'); if (f && matchMedia('(min-width:760px)').matches) f.focus(); }, 60); }
function closeSheet(){ sheet.hidden = true; back.hidden = true; document.body.style.overflow = ''; }

function cartHtml(){
  const ids = Object.keys(cart).filter(k=>cart[k]);
  if (!ids.length && !bookings.length) return `<p class="empty">${esc(t('cartEmpty'))}</p><button type="button" class="btn dark" data-close>${esc(t('done'))}</button>`;
  let total = 0, lines = '';
  ids.forEach(id => { const it = itemOf(id), s = it.p*cart[id]; total += s; lines += `<div class="line"><span>${cart[id]} × ${esc(it.n)}</span><b>${money(s)}</b></div>`; });
  bookings.forEach(b => { total += b.p*b.people; lines += `<div class="line"><span>${esc(b.label)} · ${b.people} × ${esc(b.dayLabel)}</span><b>${money(b.p*b.people)}</b></div>`; });
  return `${lines}<div class="total"><span>${esc(t('total'))}</span><span>${money(total)}</span></div>
  <label class="field">${esc(t('where'))}<input id="fWhere" placeholder="${esc(t('wherePh'))}"></label>
  <label class="field">${esc(t('name'))}<input id="fName" autocomplete="given-name"></label>
  <button type="button" class="btn orange" id="sendOrder">${esc(t('send'))}</button>`;
}

/* mensaje que recibe la recepción: siempre en español */
const LNAME = {es:'español',en:'inglés',fr:'francés',de:'alemán',pt:'portugués',it:'italiano',nl:'neerlandés'};
function preview(msg){
  const hh = new Date().toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit'});
  openSheet(t('prevTitle'), `<div class="wa-prev"><div class="wa-head"><span class="wa-av">V</span><div><b>Recepción Viajero Cali</b><br>Panel LEGION</div></div><div class="bubble">${esc(msg)}<small>${hh}</small></div></div>
  <p class="demo-note"><svg><use href="#i-info"/></svg><span>${esc(t('prevNote'))}</span></p>
  <button type="button" class="btn dark" data-close>${esc(t('done'))}</button>`);
}

function bookSheet(kind){
  const isPriv = kind === 'privada';
  const tx = isPriv ? [t('salsaCta'), ''] : tourTx(kind);
  const price = isPriv ? EXTRA.privada.p : TOURS.find(o=>o.k===kind).p;
  const fmt = new Intl.DateTimeFormat(lang,{weekday:'long',day:'numeric',month:'short'});
  const opts = [0,1,2,3,4,5,6].map(i => { const d = new Date(); d.setDate(d.getDate()+i); return `<option value="${i}">${esc(fmt.format(d))}</option>`; }).join('');
  openSheet(tx[0], `<p class="lead">${esc(t('from'))} ${money(price)}</p>
  <div class="row2"><label class="field">${esc(t('people'))}<select id="bPeople">${[1,2,3,4,5,6].map(n=>`<option>${n}</option>`).join('')}</select></label>
  <label class="field">${esc(t('day'))}<select id="bDay">${opts}</select></label></div>
  <button type="button" class="btn orange" id="bOk" data-kind="${kind}">${esc(t('breakCta'))}</button>`);
}

function toast(msg){ const el = $('#toast'); el.textContent = msg; el.hidden = false; clearTimeout(toast._t); toast._t = setTimeout(()=> el.hidden = true, 1800); }

/* ---------- eventos ---------- */
document.addEventListener('click', e => {
  const q = s => e.target.closest(s);
  let el;
  if ((el = q('[data-day]'))) { day = +el.dataset.day; renderDays(); renderAgenda(); }
  else if ((el = q('[data-cat]'))) { cat = el.dataset.cat; renderMenuTabs(); renderMenu(); }
  else if ((el = q('[data-inc]'))) add(el.dataset.inc);
  else if ((el = q('[data-dec]'))) { const id = el.dataset.dec; cart[id] = Math.max(0,(cart[id]||0)-1); renderMenu(); updateCount(); }
  else if ((el = q('[data-add]'))) add(el.dataset.add);
  else if ((el = q('[data-tour]'))) bookSheet(el.dataset.tour);
  else if ((el = q('[data-book]'))) bookSheet(el.dataset.book);
  else if ((el = q('#bOk'))) {
    const kind = el.dataset.kind, isPriv = kind==='privada';
    const people = +$('#bPeople').value, off = +$('#bDay').value, d = new Date(); d.setDate(d.getDate()+off);
    const es = isPriv ? 'Clase privada de salsa' : (TOURTX[kind]||EV[kind]).es[0];
    bookings.push({label: isPriv ? t('salsaCta') : tourTx(kind)[0], es, p: isPriv?EXTRA.privada.p:TOURS.find(o=>o.k===kind).p, people,
      dayLabel: new Intl.DateTimeFormat(lang,{weekday:'short',day:'numeric'}).format(d), dayEs: new Intl.DateTimeFormat('es-CO',{weekday:'long',day:'numeric',month:'short'}).format(d)});
    closeSheet(); updateCount(); bump(); toast(t('added'));
  }
  else if ((el = q('[data-star]'))) {
    rating = +el.dataset.star; renderStars();
    $('#revGood').hidden = rating < 4; $('#revBad').hidden = rating >= 4; $('#revDone').hidden = true;
  }
  else if (q('#cartBtn')) openSheet(t('cartTitle'), cartHtml());
  else if (q('#sendOrder')) {
    const where = $('#fWhere').value.trim() || '(sin indicar)', name = $('#fName').value.trim() || 'Huésped';
    let lines = [], total = 0;
    Object.keys(cart).filter(k=>cart[k]).forEach(id => { const it = itemOf(id); total += it.p*cart[id]; lines.push(`• ${cart[id]} × ${it.n}`); });
    bookings.forEach(b => { total += b.p*b.people; lines.push(`• ${b.es}: ${b.people} persona(s), ${b.dayEs}`); });
    preview(`NUEVO PEDIDO\n${name} · ${where}\nIdioma del huésped: ${LNAME[lang]}\n\n${lines.join('\n')}\n\nTotal: ${money(total)}`);
    cart = {}; bookings = []; renderMenu(); updateCount();
  }
  else if (q('#helpBtn')) openSheet(t('helpSheet'), `<label class="field">${esc(t('where'))}<input id="hWhere" placeholder="${esc(t('wherePh'))}"></label><label class="field">${esc(t('helpPh'))}<textarea id="hMsg" rows="3"></textarea></label><button type="button" class="btn orange" id="hSend">${esc(t('send'))}</button>`);
  else if (q('#hSend')) { const w = $('#hWhere').value.trim() || '(sin indicar)', m = $('#hMsg').value.trim() || '(mensaje vacío)'; preview(`MENSAJE DE HUÉSPED\nUbicación: ${w}\nIdioma del huésped: ${LNAME[lang]}\n\n"${m}"\n\n(Traducido automáticamente al español en el sistema real)`); }
  else if (q('[data-close]') || q('#sheetClose') || e.target === back) closeSheet();
});
$('#revBad').addEventListener('submit', e => { e.preventDefault(); $('#revBad').hidden = true; $('#revDone').hidden = false; });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !sheet.hidden) closeSheet(); });
$('#lang').addEventListener('change', e => { lang = e.target.value; try { localStorage.setItem('vj_lang', lang); } catch(_) {} applyText(); });
$('#copyWifi').addEventListener('click', async () => {
  const txt = $('#wifiPass').textContent, b = $('#copyWifi');
  try { await navigator.clipboard.writeText(txt); } catch(_) { const r = document.createRange(); r.selectNodeContents($('#wifiPass')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
  b.classList.add('ok'); b.querySelector('span').textContent = t('copied'); toast(t('copied'));
  setTimeout(()=>{ b.classList.remove('ok'); b.querySelector('span').textContent = t('copy'); }, 2000);
});

/* ---------- video del banner ---------- */
(function(){
  const v = $('#heroVideo'); if (!v) return;
  const mq = matchMedia('(min-aspect-ratio: 1/1)'), rm = matchMedia('(prefers-reduced-motion: reduce)');
  function load(){
    v.poster = mq.matches ? v.dataset.ph : v.dataset.pv;
    if (rm.matches || (navigator.connection && navigator.connection.saveData)) { v.removeAttribute('src'); return; }
    const src = mq.matches ? v.dataset.h : v.dataset.v;
    if (v.getAttribute('src') !== src) { v.src = src; v.play().catch(()=>{}); }
  }
  mq.addEventListener('change', load); load();
})();

applyText();
})();
