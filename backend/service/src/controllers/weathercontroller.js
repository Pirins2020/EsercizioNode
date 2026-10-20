const fetch = require("node-fetch");


const { validateCity } = require("../utils/validateCity"); // Importa la funzione di validazione della città
const { getWeather } = require("../utils/apiClient"); // Importa la funzione per ottenere i dati meteo dall'API
const { WEATHER_API_KEY } = require("../utils/constants"); // Importa la chiave API per l'API meteo
const { normalizeWeather } = require("../utils/normalizeWeather"); // Importa la funzione per normalizzare i dati meteo
const { logError } = require("../utils/logger"); // Importa la funzione per loggare gli errori

exports.weatherController = async (req, res) => {
    const city = req.body.city;                       // Estrae la città dal corpo della richiesta.


    console.group("DEBUB API KEY:", WEATHER_API_KEY);
    console.log("DEBUG CITY:", city);

    if (!validateCity(city)) {
        return res.json({
            error: true,
            message: "Città non valida"
        });
    }

    try {                                            
        const data = await getWeather(city, WEATHER_API_KEY); // Chiama l'API meteo di OpenWeatherMap.

        if (data.cod !== 200) {                       // Controlla se la risposta è valida.
            return res.json({
                error: true,
                message: "Città non trovata"
            });
        }

        res.json(normalizeWeather(data)); // Invia la risposta JSON al client con i dati meteo.

    } catch (err) {
        logError(err);
        res.json({
            error: true,
            message: "Errore nel server"
        });
    }
};

// qua metto la logica di manipolazione dei dati