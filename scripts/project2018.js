// global variable for the project

// default initial width and heigth for the target
var TARGET_WIDTH = 40;
var TARGET_HEIGHT = 40;
var W = H = 400;

// chrono management
// value of time in tenth of seconds
var time = 0;
// timer variable
var chronoTimer = null;
var ciblesRestantes = ciblesInitiales = 0;

// Local storage
var stockage = localStorage;


// Kim Vallee

var setup = function() {
  updateStockage();
  var demarrer = document.getElementById('start');
  demarrer.addEventListener('click', lancer_jeu);
  var uneCible = document.getElementById('create');
  uneCible.addEventListener('click', une_cible)
  var difficulty = document.getElementById('difficulty');
  difficulty.addEventListener('change', changeDiff);
}

window.addEventListener('load', setup);

/*
Fonction qui change la difficulté
*/
var changeDiff = function() {
  if(ciblesRestantes === 0 || ciblesRestantes === -1){
    TARGET_WIDTH = TARGET_HEIGHT = 10*this.value;
    var terrain = document.getElementById('terrain');
    W = H = 400 - (this.value - 2)*200;
    terrain.style.width = terrain.style.height = String(W) + "px";
  }
}

/*
Met le stockage à jour et initialise avec des valeurs de base si besoin
*/
var updateStockage = function(){
  if(stockage.length === 0){
    stockage.dupont = 2000;
    stockage.dupond = 3000;
    stockage.dupondt = 4000;
  }
  var records = document.getElementById('records');
  records.innerHTML = "";
  for (item of allStorage().sort(function(a, b){
    return a[1]-b[1];
  })){
     var elem = document.createElement('div');
     var temps = pad2(Math.floor(item[1] / 600)) + " minutes " + pad2(Math.floor(item[1] / 10) % 60) + " secondes " + pad2(Math.floor(time % 10)) + " dixiemes ";
     elem.innerHTML = item[0] + " : " + temps;
     records.appendChild(elem);
  }
}


/*
Fonction qui lance le jeu !
*/
var lancer_jeu = function() {
  reset();
  lance_timer();
  ciblesInitiales = ciblesRestantes = document.getElementById('nbtargets').value;
  creerCibles();
  updateCibles();
}

/*
Fonction qui génère une cible
*/
var une_cible = function() {
  window.clearInterval(chronoTimer);
  reset();
  creerUneCible();
}


/*
Fonction qui lance le timer
*/
var lance_timer = function() {

  chronoTimer = window.setInterval(function() {
    time += 1;
    document.getElementById('tenth').innerHTML = time % 10;
    document.getElementById('seconds').innerHTML = pad2(Math.floor(time / 10) % 60);
    document.getElementById('minutes').innerHTML = pad2(Math.floor(time / 600));
  }, 100);
}

var pad2 = function(d){
  return (d < 10) ? '0' + d.toString() : d.toString();
}

/*
Fonction qui créer des cibles positionnées aléatoirement sur le terrain
*/
var creerCibles = function() {
  for (var i = 0; i < ciblesRestantes; i++) {
    creerUneCible();
  }
}

/*
Fonction qui créer une cible
*/
var creerUneCible = function(){
  var ter = document.getElementById('terrain');
  var target = document.createElement("div");
  var left = randomValue(0, W - TARGET_WIDTH);
  var top = randomValue(0, H - TARGET_HEIGHT);
  target.style.left = String(left) + "px";
  target.style.top = String(top) + "px";
  target.style.width = String(TARGET_WIDTH) + "px";
  target.style.height = String(TARGET_HEIGHT) + "px";
  target.setAttribute('class', "target on");
  target.addEventListener('click', touchee);
  ter.appendChild(target);
}


/*
Fonction qui supprime la cible touchée après 1s
*/
var touchee = function(){
  ciblesRestantes -= 1;
  if (ciblesRestantes === 0){
    finDuJeu();
  }
  updateCibles();
  this.className += " hit";
  window.setTimeout(function(elem) {
    elem.parentNode.removeChild(elem);
  }, 1000, this);
}

/*
Fonction qui met à jour le nombre de cibles restantes
*/
var updateCibles = function(){
  document.getElementById('remaining').innerHTML = ciblesRestantes;
}

/*
Fonction qui vide le terrain de toute ses cibles
*/
var reset = function() {
  time = 0;
  chronoTimer = null;
  document.getElementById('resultat').innerHTML = '';
  document.getElementById('tenth').innerHTML = 0;
  document.getElementById('seconds').innerHTML = "00";
  document.getElementById('minutes').innerHTML = 0;
  var ter = document.getElementById('terrain');
  while (ter.hasChildNodes()) {
    ter.removeChild(ter.firstChild);
  }
  ciblesRestantes = 0;
  updateCibles();
}

/*
Déclenche la fin du jeu
*/
var finDuJeu = function(){
  window.clearInterval(chronoTimer);
  var dixieme = document.getElementById('tenth').innerHTML;
  var seconde = document.getElementById('seconds').innerHTML;
  var minute = document.getElementById('minutes').innerHTML;

  majRec(Number(dixieme) + 10*Number(seconde) + 600*Number(minute));

  var temps = String(minute) + " min " + String(seconde) + " secondes " + String(dixieme) + " dixieme ";
  var message = "Bravo ! Vous avez fait " + temps + " pour " + String(ciblesInitiales) + " cibles";
  document.getElementById('resultat').innerHTML = message;
}

/*
Met à jour les recoords si nécessaire
*/
var majRec = function(timing){
  for (item of allStorage()){
    if (item[0] > timing){
      var pseudo = prompt('Vous avez battu un record veuillez entrer un pseudo : ')
      stockage.setItem(pseudo, timing);
      var stockageTrie = allStorage();
      stockageTrie.sort(function(a,b){
        return a[1] - b[1];
      });
      var toRemove = stockageTrie[stockageTrie.length - 1][0];
      stockage.removeItem(toRemove);
      updateStockage();
      break;
    }
  }
}

/*
Fonction qui retourne toute les clés et valeurs du stockage local
*/
function allStorage() {
    var values = [],
    keys = Object.keys(localStorage),
    i = keys.length;

    while ( i-- ) {
        values.push([keys[i], localStorage.getItem(keys[i])]);
    }

    return values;
}

var randomValue = function(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}
