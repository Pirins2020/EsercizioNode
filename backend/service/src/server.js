var express = require("express");              // Importa il framework Express.
var path = require("path");                    // Importa il modulo per gestire i percorsi dei file.
var app = express();                           // Crea l'applicazione Express.
var port = process.env.Port || 3000;           // Definisce la porta del server.
var bodyParser = require("body-parser");       // Importa il middleware per leggere il corpo delle richieste.
var axios = require("axios");                  // Importa il client HTTP per chiamare l'API meteo.
require("dotenv").config();                   // Carica le variabili d'ambiente dal file .env.




const pageroutes = require("./routes/pageroutes");
const weather = require("./routes/weather");            // per gestire la parte di routing delle pagine statiche, importo il file pageroutes.js che contiene le route per le pagine statiche.
const login = require("./routes/login");
const signup = require("./routes/signup");



// il body parser serve per leggere i dati inviati dal form
app.use(bodyParser.json());                    // Abilita la lettura del corpo in formato JSON.
app.use(bodyParser.urlencoded({ extended: true })); // Abilita la lettura dei dati inviati dai form HTML.


app.use(express.static(path.join(__dirname, "../../../frontend/public"))); // Serve i file statici della cartella public.


app.use("/", pageroutes); // Usa le route definite in pageroutes.js per tutte le richieste alla radice.
app.use("/", weather);  // usa le route di weather
app.use("/", login);
app.use("/", signup);
//definizione dello stato visualizzabile da prompt
app.listen(port, () => {                        // Avvia il server sulla porta definita.
    console.log("Server in ascolto alla porta " + port); // Scrive in console la porta di ascolto.
    console.log('accedi all indirizzo http://localhost:' + port) // Scrive in console l'indirizzo da aprire nel browser.
}); // Chiude il metodo listen.






