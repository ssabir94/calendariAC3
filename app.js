// ==========================================================================
// PRÀCTICA: CALENDARI I AGENDA EN JAVASCRIPT VANILLA
// ==========================================================================

// --- ESTAT GLOBAL I ELEMENTS DEL DOM ---

let currentDate = new Date(); // Data actual que es mostra al calendari

// Fixem el dia 1 per evitar salts en navegar cap a mesos més curts.
currentDate.setDate(1);

let selectedDateKey = null; // Data seleccionada en format 'YYYY-MM-DD'

// En la Fase 1 i 2 farem servir aquest objecte en memòria.
// En la Fase 3 el connectarem amb LocalStorage!
let events = {};

// Selecció d'elements del DOM (Ja completat)
const monthYearDisplay = document.getElementById("month-year-display");
const daysGrid = document.getElementById("days-grid");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

const selectedDateDisplay = document.getElementById("selected-date-display");
const eventForm = document.getElementById("event-form");
const eventInput = document.getElementById("event-input");
const eventsList = document.getElementById("events-list");

const notifyBtn = document.getElementById("notify-btn");
const shareBtn = document.getElementById("share-btn");

const monthNames = [
  "Gener",
  "Febrer",
  "Març",
  "Abril",
  "Maig",
  "Juny",
  "Juliol",
  "Agost",
  "Setembre",
  "Octubre",
  "Novembre",
  "Desembre",
];

// ==========================================================================
// FASE 1: RENDERITZAT DEL CALENDARI I NAVEGACIÓ (DATE + DOM)
// ==========================================================================

/**
 * Retorna una data en format YYYY-MM-DD amb zeros a l'esquerra si cal.
 */
function formatDateKey(year, month, day) {
  //DONE!!!: Converteix el mes (+1) i el dia, respectivament, a String i omple amb zeros a l'esquerra amb .padStart(2, '0')

  // Sumem 1 al mes per passar de l'índex de JavaScript al mes real.
  // Convertim el resultat a text i assegurem un mínim de dos dígits.
  const formattedMonth = String(month + 1).padStart(2, "0");

  // Convertim el dia a text i afegim un zero davant si té un sol dígit.
  const formattedDay = String(day).padStart(2, "0");

  // DONE!!: Retorna data en format YYYY-MM-DD
  // Unim l'any, el mes i el dia amb guions.
  return `${year}-${formattedMonth}-${formattedDay}`;
}
/**
 * Genera i dibuixa la graella de dies del mes actual.
 */

function renderCalendar() {
  // DONE: Neteja el contingut actual de 'daysGrid'
  daysGrid.innerHTML = "";

  // DONE: Obtén l'any i el mes de 'currentDate' i actualitza el text de '#monthYearDisplay'
  // Obtenim l'any i l'índex del mes que estem mostrant.
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Busquem el nom del mes a l'array i mostrem el mes i l'any.
  monthYearDisplay.textContent = `${monthNames[month]} ${year}`;

  /**EXPLICACIÓ:
  currentDate guarda la data del calendari que estem mostrant.
  getFullYear() n’obté l’any.
  getMonth() retorna un índex del 0 a l’11.
  monthNames[month] utilitza aquest índex per trobar el nom del mes. Aquí no sumem 1, 
  perquè l’array també comença a la posició 0.
*/

  // DONE 3 (2 al dossier): Càlcul de caselles buides inicials (padding):

  //  - Obtén el primer dia de la setmana del mes: new Date(year, month, 1).getDay()

  // getDay() retorna: diumenge = 0, dilluns = 1, ..., dissabte = 6.
  const firstDayIndex = new Date(year, month, 1).getDay();

  //  - Ajusta-ho perquè la setmana comenci en Dilluns (Dilluns = 0, Diumenge = 6)

  // Adaptem l'índex perquè el nostre calendari comenci en dilluns:
  // dilluns = 0, dimarts = 1, ..., diumenge = 6.
  const paddingDays = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  // Creem una casella buida per cada dia anterior al dia 1.
  //  - Crea les caselles buides (<div class="day empty"></div>) i afegeix-les a 'daysGrid' (appendChild)
  for (let i = 0; i < paddingDays; i++) {
    // Creem el div que representarà la casella buida.
    const emptyDay = document.createElement("div");

    // Afegim les classes que li donen l'estil de casella buida.
    emptyDay.classList.add("day", "empty");

    // Afegim la casella a la graella del calendari.
    daysGrid.appendChild(emptyDay);
  }

  // DONE 4 (3 al dossier): Càlcul de dies totals del mes:
  //  - Utilitza el truc: new Date(year, month + 1, 0).getDate()

  // El dia 0 del mes següent és l'últim dia del mes actual.
  const totalDays = new Date(year, month + 1, 0).getDate();

  /**NOTA
   * Si possesim per exemple:
   * new Date(2026, 10, 0).getDate() // Octubre: 31
   * new Date(2026, 2, 0).getDate()  // Febrer de 2026: 28
   * new Date(2028, 2, 0).getDate()  // Febrer de 2028: 29
   * Compta l'últim dia del mes anterior :)
   */

  // DONE 5: Bucle per dibuixar cada dia (1..totalDays):
  for (let day = 1; day <= totalDays; day++) {
    //  - Crea un div amb la classe .day i el text del número de dia

    const dayElement = document.createElement("div");
    dayElement.classList.add("day");
    dayElement.textContent = day;
    //NOTA
    //El for comença amb day = 1, es repeteix mentre day <= totalDays
    //i incrementa el dia amb day++. A cada volta crea una casella amb el número corresponent.

    //  - Genera la clau 'dateKey' fent servir formatDateKey()
    const dateKey = formatDateKey(year, month, day);
    /** NOTA:
     * Cridem la funció que ja hem completat i provat, passant-li:
     * - year: l’any del calendari.
     * - month: l’índex del mes, del 0 a l’11.
     * - day: el dia de la volta actual del bucle.
     *
     * a CONSOLA:  formatDateKey(2026, 9, 5) // Retorna "2026-10-05"
     * No sumem 1 a month aquí, perquè formatDateKey() ja ho fa internament.
     * Cada casella tindrà així la seva clau per consultar els esdeveniments i
     * comprovar si està seleccionada. La pàgina encara es veurà igual.
     */

    //  - Afegeix la classe .today si el dia, mes i any coincideixen amb la data actual d'avui (new Date())
    const today = new Date();
    // Han de coincidir les tres dades perquè sigui exactament avui.
    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      dayElement.classList.add("today");
    }
    /**NOTA
     * today conté la data actual de l’ordinador. Comparem:
     * - day amb el dia d’avui.
     * - month amb el mes d’avui.
     * - year amb l’any d’avui.
     * Els && exigeixen que les tres comparacions siguin certes.
     * Així no destaquem, per exemple, el dia 12 de tots els mesos, sinó només el dia 12 del mes i l’any actuals.
     * Quan coincideixen, afegim "today"
     */

    //  - Afegeix la classe .has-events si existeix events[dateKey] amb elements
    if (events[dateKey] && events[dateKey].length > 0) {
      dayElement.classList.add("has-events");
    }
    /**NOTA:
     * Comprovem dues coses amb &&:
     * 1. events[dateKey]: que existeixi una llista d’esdeveniments per a aquest dia.
     * 2. events[dateKey].length > 0: que la llista contingui almenys un esdeveniment.
     * Si la llista no existeix, JavaScript no avalua la segona part. Així evitem intentar consultar .length d’un valor undefined.
     * Quan es compleixen les dues condicions, afegim "has-events" i el CSS mostra un punt a la casella.
     */

    //  - Afegeix la classe .selected si dateKey === selectedDateKey
    if (dateKey === selectedDateKey) {
      dayElement.classList.add("selected");
    }
    /**NOTA:
     * Comparem la clau del dia que estem dibuixant (dateKey) amb la clau del dia seleccionat (selectedDateKey).
     * Si coincideixen, afegim "selected" i el CSS marca la casella amb una vora blava.
     * Això permet recuperar la marca de selecció quan redibuixem el calendari,
     * ja que en començar renderCalendar() esborrem les caselles anteriors.
     */

    //  - Assigna l'esdeveniment click per cridar a selectDate(dateKey, dayElement)
    dayElement.addEventListener("click", () => {
      selectDate(dateKey, dayElement);
    });
    /**NOTA
     * addEventListener("click", ...) indica què ha de passar quan es cliqui aquesta casella.
     * En aquell moment, cridem selectDate() amb:
     * - dateKey: la clau de la data clicada.
     * - dayElement: el div d’aquesta casella.
     * La funció fletxa () => { ... } ajorna la crida fins al clic.
     * Si poséssim directament selectDate(dateKey, dayElement) com a segon argument, la cridaríem mentre dibuixem el calendari.
     */

    //  - Afegeix la casella a 'daysGrid' (appendChild)
    daysGrid.appendChild(dayElement);
  } //Aquí tanco bucle dies.
} // Aquuí tanco RenderCalendar!

// PAS 1.3
// DONE: Escoltadors d'esdeveniments per als botons de navegació prevBtn i nextBtn
// (Sumar o restar 1 mes a 'currentDate' i tornar a cridar renderCalendar())

// Quan cliquem enrere, retrocedim un mes
prevBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  // Redibuixem la graella i actualitzem la capçalera
  renderCalendar();
});

// Quan cliquem endavant, avancem un mes
nextBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  // Redibuixem la graella i actualitzem la capçalera.
  renderCalendar();
});
/**NOTA
 * getMonth() obté el mes que estem mostrant i setMonth() modifica currentDate.
 * JavaScript ajusta automàticament l’any quan passem de desembre a gener o de gener a desembre.
 */

// ==========================================================================
// FASE 2: SELECCIÓ DE DIA I GESTIÓ D'ESDEVENIMENTS EN MEMÒRIA
// ==========================================================================

/**
 * Selecciona un dia del calendari i actualitza la interfície.
 */
function selectDate(dateKey, element) {
  // DONE 1: Elimina la classe .selected de tots els dies (.day)
  document.querySelectorAll(".day").forEach((dayElement) => {
    // Traiem la marca de selecció que pogués tenir cada casella.
    dayElement.classList.remove("selected");
  });
  /**NOTA
   * querySelectorAll(".day") selecciona totes les caselles i forEach() les recorre una per una.
   * A cadascuna li traiem "selected"; si no tenia aquesta classe, no passa res.
   */

  // DONE 2: Afegeix la classe .selected al dia clicat i actualitza 'selectedDateKey'
  // Marquem visualment la casella que hem clicat.
  element.classList.add("selected");

  // Guardem la clau de la data seleccionada a la variable global.
  selectedDateKey = dateKey;
  /**NOTA
   * Els dos paràmetres venen de l’escoltador de clic que hem creat a la fase 1:
   * - element és la casella clicada.
   * - dateKey és la seva data en format "YYYY-MM-DD".
   */

  // DONE 3: Actualitza el títol 'selectedDateDisplay' i crida a renderEvents()
  // Mostrem la data que acabem de seleccionar.
  selectedDateDisplay.textContent = `Esdeveniments del dia ${dateKey}`;

  // Actualitzem la llista d'esdeveniments del dia seleccionat.
  renderEvents();
  /**Nota:
   * textContent substitueix «Selecciona un dia» pel text de la data clicada.
   * Després, renderEvents() s’encarregarà de mostrar els esdeveniments d’aquell dia; encara està pendent d’implementar.
   */
}
/**
 * Renderitza la llista d'esdeveniments del dia seleccionat.
 */

function renderEvents() {
  // DONE 1: Neteja 'eventsList'
  eventsList.innerHTML = "";
  //Això elimina el contingut anterior de la llista abans de mostrar els esdeveniments del dia seleccionat.
  // Així no s’acumularan ni es barrejaran els de dies diferents.

  // DONE 2: Si no hi ha 'selectedDateKey', surt de la funció
  if (!selectedDateKey) {
    return;
  } //NOTA: Inicialment, selectedDateKey val null. !selectedDateKey és cert quan no tenim una data seleccionada,
  //i return atura l’execució de renderEvents().
  //Quan seleccionem un dia, la variable conté una cadena com "2026-10-15": la condició és falsa i la funció continua.

  // DONE 3: Obtén els esdeveniments de 'selectedDateKey' o un array buit
  const dayEvents = events[selectedDateKey] || [];
  //events[selectedDateKey] busca la llista guardada per a aquella data.
  //Si la data no té una llista, obtenim undefined i || [] proporciona un array buit.
  //Així podrem recórrer dayEvents amb seguretat, encara que no hi hagi esdeveniments.

  // DONE 4: Recorre els esdeveniments i crea els <li> amb un <span> (✕) per eliminar-los
  dayEvents.forEach((eventText, index) => {
    // Creem un element de llista amb el text de l'esdeveniment.
    const eventItem = document.createElement("li");
    eventItem.textContent = eventText;

    // Creem el botó d'eliminar amb el símbol i la classe CSS.
    const deleteBtn = document.createElement("span");
    deleteBtn.textContent = "✕";
    deleteBtn.classList.add("delete-btn");

    // Quan es cliqui, eliminarem l'esdeveniment d'aquesta posició.
    deleteBtn.addEventListener("click", () => {
      removeEvent(index);
    });

    // Afegim el botó al li i després el li a la llista.
    eventItem.appendChild(deleteBtn);
    eventsList.appendChild(eventItem);
  });
} /**NOTA
 * A cada volta del forEach():
 * - eventText és el text de l’esdeveniment.
 * - index és la seva posició dins de l’array, començant per 0. La passem a removeEvent() perquè sàpiga quin element ha d’eliminar.
 */

/**
 * Afegir un nou esdeveniment a la data seleccionada.
 */

function addEvent(e) {
  e.preventDefault();
  // DONE 1: Valida que hi hagi un dia seleccionat (selectedDateKey) i text a l'input
  // Si no s'ha seleccionat cap dia, aturem la funció.
  if (!selectedDateKey) {
    return;
  }

  // Llegim el text i eliminem els espais del principi i del final.
  const text = eventInput.value.trim();

  // Si el text queda buit, no afegim cap esdeveniment.
  if (text === "") {
    return;
  }

  // DONE 2: Si no existeix events[selectedDateKey], inicialitza-ho com un array buit []
  if (!events[selectedDateKey]) {
    events[selectedDateKey] = [];
  } /**Nota
  //Si és el primer esdeveniment d’aquell dia, encara no tenim una llista on guardar-lo: per això la creem amb [].
  //Si la llista ja existeix, la conservem amb els esdeveniments que conté. 
  //No l’hem de tornar a buidar cada vegada que afegim una tasca. */

  // DONE 3: Afegeix el text a l'array d'esdeveniments de la data
  events[selectedDateKey].push(text);
  // .push(text) afegeix el text al final de l’array, conservant els esdeveniments anteriors.

  // CORRESPON A FASE 3:
  //  Desem les dades després d'afegir l'esdeveniment.
  saveEvents();

  // CORRESPON A FASE 4: Notifiquem la creació del nou esdeveniment.
  sendNotification(
    "Nou esdeveniment",
    `${selectedDateKey}: ${text}`
  );

  // DONE 4: Neteja l'input i torna a cridar renderEvents() i renderCalendar()
  // Buidem el camp després d'afegir l'esdeveniment.
  eventInput.value = "";

  // Mostrem la llista actualitzada del dia seleccionat.
  renderEvents();

  // Redibuixem el calendari perquè aparegui l'indicador .has-events.
  renderCalendar();
}

/**
 * Elimina un esdeveniment per la seva posició (índex).
 */
function removeEvent(index) {
  // DONE 1: Elimina l'element de l'array amb splice(index, 1)
  events[selectedDateKey].splice(index, 1);
  /**NOTA
   * .splice(index, 1) modifica l’array original:
   *    - index indica la posició des d’on eliminem.
        - 1 indica que eliminem un sol element.
   */

  // DONE 2: Si l'array es queda buit, elimina la clau de l'objecte 'events' amb 'delete'
  if (events[selectedDateKey].length === 0) {
    delete events[selectedDateKey];
  } // Després del .splice(), comprovem quants esdeveniments queden.
  // Si no en queda cap, delete elimina de l’objecte events la propietat d’aquella data.

  // CORRESPON A FASE 3:
  //  Desem les dades després d'eliminar i netejar la clau.
  saveEvents();



  // DONE 3: Torna a cridar renderEvents() i renderCalendar()
  renderEvents(); // Actualitzem la llista perquè desaparegui l'esdeveniment eliminat.

  renderCalendar(); // Actualitzem el calendari: si no queden esdeveniments,
  // desapareixerà el punt indicador del dia.
  //Si hem eliminat l’últim esdeveniment, renderEvents() utilitzarà l’array buit de reserva (|| []) i deixarà la llista buida.
  // renderCalendar() mantindrà el dia seleccionat, però li traurà l’indicador d’esdeveniments.
}

// DONEE: Escoltador d'esdeveniment per al formulari eventForm (submit -> addEvent)
// Quan s'envia el formulari, executem addEvent.
eventForm.addEventListener("submit", addEvent);
// Escoltem submit perquè funcioni tant prement «Afegir» com prement Enter dins del camp.
// Passem addEvent sense parèntesis: el navegador la cridarà quan s’enviï el formulari i li passarà l’esdeveniment e

// ==========================================================================
// FASE 3: PERSISTÈNCIA DE DADES (LOCALSTORAGE I JSON)
// ==========================================================================

/**
 * Desa l'objecte 'events' a LocalStorage convertit a text JSON.
 */
function saveEvents() {
  // DONE: Utilitza JSON.stringify(events) i localStorage.setItem('calendar_events', ...)
  // Convertim l'objecte a text JSON i el desem amb la clau indicada.
  localStorage.setItem("calendar_events", JSON.stringify(events));
}

/**
 * Carrega els esdeveniments de LocalStorage en iniciar l'aplicació.
 */
function loadEvents() {
  // DONE: Utilitza localStorage.getItem('calendar_events') i JSON.parse()
  // Retorna l'objecte obtingut o un objecte buit {} si no hi havia res guardat.

  // Recuperem el text JSON desat.
  const saved = localStorage.getItem("calendar_events");

  // Si existeix, el convertim de nou en un objecte JavaScript.
  if (saved !== null) {
    return JSON.parse(saved);
  }

  // Si no hi ha dades desades, retornem un objecte buit.
  return {};
}

// DONE: Modifica addEvent() i removeEvent() perquè cridin a saveEvents() després de modificar dades.


// ==========================================================================
// FASE 4: RESTA D'APIS DEL NAVEGADOR (NOTIFICATION I WEB SHARE)
// ==========================================================================

/**
 * Mostra una notificació del sistema si tenim permís concedit.
 */
function sendNotification(title, body) {
  // DONE: Comprova si Notification.permission === 'granted' i crea una new Notification()
  
  if (!("Notification" in window)) {
    return;
  }

  // Només creem la notificació si l'usuari ha concedit el permís.
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  }
}
/**Nota
 * title és el títol de la notificació. body és el text del missatge.
{ body } és la forma abreujada d’escriure { body: body }.
La comprovació de suport evita accedir a Notification si el navegador no té aquesta API. 
Si el permís encara no està concedit, la funció acaba sense enviar res.
 */



// DONE: Escoltador d'esdeveniment per a 'notifyBtn' (Sol·licitar permisos de notificació)

notifyBtn.addEventListener("click", async () => {
  // Comprovem que el navegador admeti notificacions.
  if (!("Notification" in window)) {
    alert("Aquest navegador no admet notificacions.");
    return;
  }

  try {
    // Demanem permís i esperem la resposta de l'usuari.
    const permission = await Notification.requestPermission();

    // Si concedeix el permís, enviem la notificació de benvinguda.
    if (permission === "granted") {
      sendNotification(
        "Notificacions activades",
        "Rebràs una notificació quan afegeixis un esdeveniment."
      );
    }
  } catch (error) {
    // Informem si falla la petició o l'enviament de la notificació.
    console.error("Error en activar les notificacions:", error);
    alert("No s'han pogut activar les notificacions.");
  }
}); // async permet utilitzar await, que espera el resultat de la petició de permís. 
// Si el resultat és "granted", cridem la funció que acabem d’implementar.


// DONE: Escoltador d'esdeveniment per a 'shareBtn' (Web Share API amb fallback a clipboard)

shareBtn.addEventListener("click", async () => {
  // Necessitem una data seleccionada per preparar el resum del dia.
  if (!selectedDateKey) {
    alert("Selecciona un dia abans de compartir.");
    return;
  }

  // Aquí prepararem el resum dels esdeveniments.
  // Obtenim els esdeveniments del dia o un array buit.
  const dayEvents = events[selectedDateKey] || [];

  // Preparem un títol i una línia per cada esdeveniment.
  const textSummary = `Agenda del dia ${selectedDateKey}\n${dayEvents.length > 0
      ? dayEvents.map((eventText) => `- ${eventText}`).join("\n")
      : "No hi ha esdeveniments."
    }`;
  /**NOTAS:
 * \n introdueix un salt de línia.
 * .map() crea un array amb "- " davant de cada text.
 * .join("\n") uneix aquests textos en una sola cadena, cadascun en una línia.
 * Si l’array és buit, hi escrivim «No hi ha esdeveniments».
 */

  // Comprovem si el navegador disposa de l'API de compartició.
  if (navigator.share) {
    try {
      // Obrim el diàleg del sistema per compartir el resum.
      await navigator.share({
        title: `Agenda del dia ${selectedDateKey}`,
        text: textSummary
      });
    } catch (error) {
      // Cancel·lar el diàleg és una acció normal de l'usuari.
      if (error.name !== "AbortError") {
        console.error("Error en compartir l'agenda:", error);
        alert("No s'ha pogut compartir l'agenda.");
      }
    }
  } //if (navigator.share) comprova que l’API existeixi abans de cridar-la.
  // await espera que l’operació acabi i catch gestiona un possible error.

  else {
    // Si no hi ha Web Share, intentem copiar el resum al porta-retalls.
    try {
      await navigator.clipboard.writeText(textSummary);

      // Informem que el resum ja es pot enganxar.
      alert("Agenda copiada al porta-retalls.");
    } catch (error) {
      console.error("Error en copiar l'agenda:", error);
      alert("No s'ha pogut copiar l'agenda al porta-retalls.");
    }
  }
});



// ==========================================================================
// INICIALITZACIÓ DE L'APLICACIÓ
// ==========================================================================

function initApp() {
  // DONE 1: Carrega els esdeveniments des de LocalStorage cridant loadEvents()
  events = loadEvents();

  // DONE 2: Crida inicial a renderCalendar() per dibuixar la interfície inicial
  renderCalendar();
}

initApp();
/**Nota
 * Primer recuperem les dades i després dibuixem el calendari. Així, renderCalendar() ja pot consultar events 
 * i mostrar els punts dels dies amb esdeveniments.
  Fem servir events = loadEvents() sense let ni const, perquè actualitzem la variable global que ja existeix.
 */