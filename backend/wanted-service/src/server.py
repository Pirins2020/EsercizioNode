from datetime import date
from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import os
from pathlib import Path
from urllib.error import URLError
import random
from urllib.parse import urlparse
from urllib.request import Request, urlopen
from utilis.converter import item_to_json

FBI_API_URL = "https://api.fbi.gov/wanted/v1/list"
PORT = int(os.environ.get("WANTED_PORT", "3002"))
PUBLIC_DIR = Path(__file__).resolve().parents[2] / "frontend" / "public"


def get_daily_item():
    # ser-Agent identifica il servizio; Accept dichiara che vogliamo dati JSON.
    request = Request(
        FBI_API_URL,
        headers={
            "Accept": "application/json",
            "User-Agent": "FBI-Wanted-Daily-Service/1.0",
        },
    )

    try:
        # timeout evita di lasciare la richiesta bloccata se l'API non risponde.
        with urlopen(request, timeout=10) as response:
            payload = json.load(response)
            print("payload", payload)
    except Exception as error:
        raise RuntimeError("Impossibile contattare l'API FBI.") from error

    # API restituisce le schede nella proprietà "items".
    items = payload.get("items") if isinstance(payload, dict) else None

    if not isinstance(items, list):
        raise RuntimeError("La risposta dell'API FBI non contiene una lista valida.")

    valid_items = [item for item in items if isinstance(item, dict)]
    print("valid_items: ", valid_items)

    # persona ricercata e non catturata (more funny).
    wanted_items = [item for item in valid_items
        if str(item.get("poster_classification", "")).lower() == "wanted"
        and str(item.get("status", "")).lower() != "captured"
    ]
    # se non ne troviamo, usiamo una scheda disponibile qualsiasi.
    candidates = wanted_items or valid_items

    if not candidates:
        raise RuntimeError("L'API FBI non ha restituito schede disponibili.")

    # La data fa sì che tutti vedano la stessa scheda durante il giorno.
    return candidates[(date.today().toordinal() - 1) % len(candidates)]


class WantedHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # server usa la cartella pubblica del frontend per pagina, CSS e JavaScript.
        super().__init__(*args, directory=str(PUBLIC_DIR), **kwargs)

    def send_content(self, content, content_type, status=200):
        # Content-Type dice al browser come interpretare la risposta.
        encoded = content.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(encoded)))
        self.send_end_headers()
        self.wfile.write(encoded)

    def do_GET(self):
        path = urlparse(self.path).path
        # La root del servizio mostra la pagina FBI.
        if path == "/":
            self.path = "/fbi.html"

        if path == "/api/wanted/today":
            try:
                # get_daily_item() restituisce la lista o l'elemento da convertire
                person = item_to_json(get_daily_item())
                self.send_content(json.dumps(person), "application/json")
            except RuntimeError as error:
                print(f"Errore API FBI: {error}", flush=True)
                error_response = {"error": str(error)}
                self.send_content(json.dumps(error_response), "application/json", status=500)
            return

            body = json.dumps(person, ensure_ascii=False)
            self.send_content(body, "application/json; charset=utf-8")
            return

        super().do_GET()        

if __name__ == "__main__":
    print(f"Wanted service avviato su http://localhost:{PORT}", flush=True)
    HTTPServer(("0.0.0.0", PORT), WantedHandler).serve_forever()