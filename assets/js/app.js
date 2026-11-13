// Fanger alle de elementer, der skal glide blødt ind på skærmen, når man scroller ned.
// Vi starter med at gemme dem med klassen "skjult", så de ikke bare står der fra start.
const skalTonesInd = document.querySelectorAll(".kort, .caseKort, .kontaktKort, .infoBoks, .kompetence, .fig, .vaerktoej");

skalTonesInd.forEach(element => {
    element.classList.add("skjult");
});

// Kilde: idéen med IntersectionObserver er fra lærerens eksempler (intersection observer, UCN MMD). Jeg har selv skrevet, hvilke elementer der skal tones ind.
// Holder øje med hvornår elementerne rammer skærmen (0.15 betyder, at mindst 15% skal være synligt).
// Når kortet er tonet ind, stopper vi med at observere det igen.
const observer = new IntersectionObserver(elementer => {
    elementer.forEach(element => {
        if (element.isIntersecting) {
            element.target.classList.remove("skjult");
            element.target.classList.add("tonerInd");
            observer.unobserve(element.target);
        }
    });
}, { threshold: 0.15 });

skalTonesInd.forEach(element => {
    observer.observe(element);
});


// Fanger alle kompetence-boksene på siden.
const kompetencer = document.querySelectorAll(".kompetence");

// Giver knapperne liv: Når man klikker på én boks, lukker vi alle de andre 
// og slår åben/lukket-klassen til på den, man netop har trykket på.
kompetencer.forEach(boks => {
    const knap = boks.querySelector(".kompKnap");

    knap.addEventListener("click", () => {
        kompetencer.forEach(andenBoks => {
            if (andenBoks !== boks) {
                andenBoks.classList.remove("aaben");
            }
        });

        boks.classList.toggle("aaben");
    });
});

// Hvis man lander på siden via et direkte ankerlink (fx kompetencer.html#ux),
// fanger ":target" den specifikke boks og folder den ud med det samme, når siden er loadet.
window.addEventListener("load", () => {
    const valgtBoks = document.querySelector(":target");

    if (valgtBoks) {
        valgtBoks.classList.add("aaben");
    }
});


// Fanger proces-fanerne (knapperne) og de tilhørende indholdstrin.
const faner = document.querySelectorAll(".fane");
const trin = document.querySelectorAll(".trin");

// Styrer hvilket trin der vises: Sætter klassen "valgt" på den rigtige fane og det tilhørende trin,
// og fjerner den fra resten.
function visTrin(trinNr) {
    faner.forEach((fane, i) => {
        if (i === trinNr) {
            fane.classList.add("valgt");
            trin[i].classList.add("valgt");
        } else {
            fane.classList.remove("valgt");
            trin[i].classList.remove("valgt");
        }
    });
}

// Gør hver fane klikbar, så den viser sit respektive trin.
faner.forEach((fane, i) => {
    fane.addEventListener("click", () => {
        visTrin(i);
    });
});

// Sørg for at trin 1 altid er aktivt som standard, når man lander på siden.
if (faner.length > 0) {
    visTrin(0);
}


// Fanger procesbillederne og den store lightbox-boks, hvor de kan ses i fuld størrelse.
const procesBilleder = document.querySelectorAll(".fig img");
const storBoks = document.querySelector(".stor");

// Kører kun hvis boksen rent faktisk findes på den side, vi er på (fx case-siderne).
if (storBoks) {
    const storBillede = storBoks.querySelector("img");

    procesBilleder.forEach(billede => {
        billede.addEventListener("click", () => {
            storBillede.src = billede.src;
            storBoks.classList.add("aaben");
        });
    });

    storBoks.addEventListener("click", () => {
        storBoks.classList.remove("aaben");
    });
}


// Tjekker om galleriet findes (bruges primært på "Om mig"-siden).
const galleri = document.querySelector("#galleri");

if (galleri) {
    const spor = galleri.querySelector(".spor");
    const billeder = galleri.querySelectorAll(".billede");
    const prikker = galleri.querySelectorAll(".prikker button");
    const venstre = galleri.querySelector(".venstre");
    const hoejre = galleri.querySelector(".hoejre");
    const forstoer = galleri.querySelector(".forstoer");

    // Holder styr på hvilket billede vi kigger på (starter på det første, altså 0).
    let billedeNr = 0;

    // Styrer billedskiftet: Sørger for at loade det rigtige billede, 
    // lader det køre i ring hvis man når enden, og opdaterer prikkerne i bunden.
    function visBillede(nytNr) {
        if (nytNr < 0) {
            nytNr = billeder.length - 1;
        }
        if (nytNr > billeder.length - 1) {
            nytNr = 0;
        }
        billedeNr = nytNr;

        // Flytter sporet via CSS-klasser (fx flyt1, flyt2 osv.), så CSS-transitionen klarer animationen.
        spor.className = "spor flyt" + billedeNr;

        // Markér kun den prik, der passer til det aktuelle billede.
        prikker.forEach((prik, i) => {
            if (i === billedeNr) {
                prik.classList.add("valgt");
            } else {
                prik.classList.remove("valgt");
            }
        });
    }

    // Piletasterne skifter ét billede frem eller tilbage.
    venstre.addEventListener("click", () => visBillede(billedeNr - 1));
    hoejre.addEventListener("click", () => visBillede(billedeNr + 1));

    // Klik direkte på en prik for at hoppe til det pågældende billede.
    prikker.forEach((prik, i) => {
        prik.addEventListener("click", () => visBillede(i));
    });

    // Åbner eller lukker fuldskærms-visningen af billedet.
    function skiftFuldSkaerm() {
        galleri.classList.toggle("fuldSkaerm");
    }

    forstoer.addEventListener("click", skiftFuldSkaerm);

    // Tastatur-genveje i fuldskærm: Pil til siderne bladrer, og Escape lukker ned igen.
    document.addEventListener("keydown", (event) => {
        if (galleri.classList.contains("fuldSkaerm")) {
            if (event.key === "ArrowRight") {
                visBillede(billedeNr + 1);
            }
            if (event.key === "ArrowLeft") {
                visBillede(billedeNr - 1);
            }
            if (event.key === "Escape") {
                skiftFuldSkaerm();
            }
        }
    });

    // Start altid med at vise det første billede, så det hele er klar.
    visBillede(0);
}


// Kilde: beregningen af, hvor pupillen skal flytte sig (Math.hypot og afstand til musen), er taget fra lærerens eksempel "distance" (UCN MMD) og tilpasset til mit øje.
// Fanger øjet og pupillen på kontaktsiden, så den kan følge med musen inden for rammerne.
const oeje = document.querySelector(".oeje");
const pupil = document.querySelector(".pupil");

if (oeje) {
    const maks = 50;

    addEventListener("mousemove", (event) => {
        // Find øjets præcise midtpunkt på skærmen.
        const oejeBoks = oeje.getBoundingClientRect();
        const midtX = oejeBoks.left + oejeBoks.width / 2;
        const midtY = oejeBoks.top + oejeBoks.height / 2;

        // Udregn afstanden fra øjets midte til musens position.
        const dx = event.clientX - midtX;
        const dy = event.clientY - midtY;
        const afstand = Math.hypot(dx, dy);

        // Lad pupillen følge med (1/4 af afstanden), men hold den inden for vores 'maks'-grænse.
        const flyt = Math.min(afstand / 4, maks);

        // Hvis musen ikke er præcis i midten, flytter vi pupillen.
        if (afstand > 0) {
            const x = dx / afstand * flyt;
            const y = dy / afstand * flyt;

            pupil.style.transform = `translate(${x}px, ${y}px)`;
        }
    });
}