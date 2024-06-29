let API = "https://random-word-api.herokuapp.com/word?length=6&lang=en";
let intentos = 6;
document.getElementById("intentos").innerHTML = intentos;

//Arreglo de palabras por default
let diccionario = ['APPLE', 'HURLS', 'WINGS', 'YOUTH'];
let palabra;

//FUNCIONALIDAD EXTRA
/*
    Busca los puntajes de ganados o perdidos en el localstorage
*/
function getPuntajes() {
    let ganados = localStorage.getItem('ganados');
    let perdidos = localStorage.getItem('perdidos');

    if (ganados === null) {
        ganados = 0;
    } else {
        ganados = parseInt(ganados);
    }

    if (perdidos === null) {
        perdidos = 0;
    } else {
        perdidos = parseInt(perdidos);
    }
    document.getElementById("ganados").innerHTML = ganados;
    document.getElementById("perdidos").innerHTML = perdidos;
}
getPuntajes();

let BOTON = document.getElementById("guess-button");
BOTON.addEventListener("click", intentar);

function getPalabrasDefaultRandom(){
    let posicion = Math.floor(Math.random() * diccionario.length);
    palabra = diccionario[posicion];
    return palabra;
}
function getPalabraApi(){
  fetch(API)
    .then((response) => {
      response.json()
      .then((data) => {
        palabra = data[0].toUpperCase();
        console.log(palabra)
      });
    }).catch((e)=>{
        swal("🚧Error de comunicación con el server🚧", "a continuación tomará nuestra palabras local por default", "warning");
        palabra = getPalabrasDefaultRandom();
    });  
}
getPalabraApi();

function leerIntento() {
    let intento = document.getElementById("guess-input").value;
    if(intento.length==6){
        intento = intento.toUpperCase();
        return intento;
    }else{
        swal("La palabra ingresada debe tener una longitud de 6 caracteres","", "warning");
        return null;
    }
}

function intentar() {
    const INTENTO = leerIntento();
    if(INTENTO===null){
        return;
    }
    if (INTENTO === palabra) {
        document.getElementById("reset").style.display = "block";
        terminar("<h1>GANASTE BRO, RUIDO DE VAPE😎</h1>");
        swal("Excelente 😎", "Eres el mejor", "success");
        setGanados();
        return
    }
    const GRID = document.getElementById("grid");
    const ROW = document.createElement('div');
    ROW.className = 'row';
    for (let i in palabra) {
        const SPAN = document.createElement('span');
        SPAN.className = 'letter';
        if (INTENTO[i] === palabra[i]) { //VERDE
            SPAN.innerHTML = INTENTO[i];
            SPAN.style.backgroundColor = 'green';
        } else if (palabra.includes(INTENTO[i])) { //AMARILLO
            SPAN.innerHTML = INTENTO[i];
            SPAN.style.backgroundColor = 'yellow';
        } else {      //GRIS
            SPAN.innerHTML = INTENTO[i];
            SPAN.style.backgroundColor = 'grey';
        }
        ROW.appendChild(SPAN)
    }
    GRID.appendChild(ROW);
    intentos--
    //actualizo los intentos
    document.getElementById("intentos").innerHTML = intentos;
    if (intentos == 0) {
        document.getElementById('grid').innerHTML = "";
        //hago aparecer btn reset
        document.getElementById("reset").style.display = "block";
        terminar("<h1>PERDISTE BRO 😢</h1>");
        swal("Oops!", "Ha terminado tus oportunidades, presiona el boton reset y juega de nuevo", "error");
        setPerdidos();
        return
    }
}
function terminar(mensaje) {
    const INPUT = document.getElementById("guess-input");
    INPUT.disabled = true;
    BOTON.disabled = true;
    let contenedor = document.getElementById('guesses');
    contenedor.innerHTML = mensaje;
}

//Evento click de btn reset
let btnReset = document.getElementById("reset");
btnReset.addEventListener("click", function () {
    intentos = 6;
    document.getElementById("intentos").innerHTML = intentos;
    //hago desaparecer btn reset
    document.getElementById("reset").style.display = "none";
    let INPUT = document.getElementById("guess-input");
    INPUT.value = "";
    INPUT.disabled = false;
    BOTON.disabled = false;
    let contenedor = document.getElementById("guesses");
    let grid = document.getElementById("grid");
    grid.innerHTML = "";
    contenedor.innerHTML = "";
    getPalabraApi();
});

//FUNCIONALIDAD EXTRA
/* En este parte almaceno en el localStorage cuantas veces gano o perdio el usuario.
    Tambien el reseto de los puntajes
*/
function setGanados() {
    let ganados = localStorage.getItem('ganados');
    if (ganados === null) {
        ganados = 0;
    } else {
        ganados = parseInt(ganados);
    }
    ganados++;
    localStorage.setItem('ganados', ganados);
    getPuntajes();
}

function setPerdidos() {
    let perdidos = localStorage.getItem('perdidos');
    if (perdidos === null) {
        perdidos = 0;
    } else {
        perdidos = parseInt(perdidos);
    }
    perdidos++;
    localStorage.setItem('perdidos', perdidos);
    getPuntajes();
}

function resetPuntajes() {
    swal({
        title: "¿Estás seguro que quieres resetear los puntajes?",
        text: "Luego no hay vuelta atrás si confirmas",
        icon: "warning",
        buttons: {
            cancel: "Cancelar",
            confirm: {
                text: "Aceptar",
                value: true,
            }
        },
        dangerMode: true,
    }).then(willReset => {
        if (willReset) {
            localStorage.setItem('ganados', 0);
            localStorage.setItem('perdidos', 0);
            getPuntajes();
            swal("Puntajes reseteados", "", "success");
        }
    });    
}
//Evento click de btn resetear los puntajes almacenados en el localstorage
let btnResetPuntajes = document.getElementById("btnResetPuntajes");
btnResetPuntajes.addEventListener("click", function () {
    resetPuntajes();
})