# Bromic white paper: heaters built into pergolas (2027). Words, figures and sources.
# Rules: every figure carries [n] -> SOURCES; product facts only from data/product-facts.json and
# data/product-marketing/*.json; open facts are marked "to confirm"; pergola makers' figures from their own published documents.
TITLE = 'Heat The Pergola · Bromic Planning Guide 2027'
FILE = 'Bromic-Heat-The-Pergola-Planning-Guide-2027'
FOLIO = 'Heat The Pergola · Planning Guide 2027'

NOTE = ('Draft for review. Product facts come from Bromic launch material, the Lookbook 2026, cut sheets and manuals, and await Product '
        'team sign-off. Pergola figures come from each maker\'s published documents as read in November 2026; the sketches show '
        'mounting concepts, not engineering drawings, and every install follows the heater manual, the pergola maker\'s guidance, '
        'the local authority and a licensed electrician. Survey figures are as published; market-size figures are a research '
        'firm\'s own estimate.')

SOURCES = []          # filled in order of first use by S()
_SRC = {}
def S(key, text):
    """Register a source once and return its number."""
    if key not in _SRC:
        SOURCES.append(text); _SRC[key] = len(SOURCES)
    return _SRC[key]

FRAMES = []           # (name, colour, maker) for the colour sketch; filled with the structures research
PAGES = []            # filled below
