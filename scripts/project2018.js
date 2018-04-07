// global variable for the project

// default initial width and heigth for the target
var TARGET_WIDTH = 40;
var TARGET_HEIGHT = 40;

// chrono management
// value of time in tenth of seconds
var time = 0;
// timer variable
var chronoTimer = null;
var ciblesRestantes = 0;


// Kim Vallee

var setup = function() {
  var demarrer = document.getElementById('start');
  demarrer.addEventListener('click', lancer_jeu);
}

window.addEventListener('load', setup);


/*
Fonction qui lance le jeu !
*/
var lancer_jeu = function() {
  reset();
  lance_timer();
  var n = ciblesRestantes = document.getElementById('nbtargets').value;
  creerCibles();
  updateCibles();
}

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
  var ter = document.getElementById('terrain');
  var max_width = ter.offsetWidth;
  var max_height = ter.offsetHeight;
  for (var i = 0; i < ciblesRestantes; i++) {
    var target = document.createElement("div");
    var left = randomValue(0, max_width - TARGET_WIDTH);
    var top = randomValue(0, max_height - TARGET_HEIGHT);
    target.style.left = String(left) + "px";
    target.style.top = String(top) + "px";
    target.setAttribute('class', "target on");
    target.addEventListener('click', touchee);
    ter.appendChild(target);
  }
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

var finDuJeu = function(){
  window.clearInterval(chronoTimer);
}

var randomValue = function(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}
