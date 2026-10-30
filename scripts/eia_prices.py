"""State energy prices for the A20 five-year cost tool, from the US Energy Information Administration (EIA).

  python3 scripts/eia_prices.py            # download the three EIA tables into data/_eia/ (gitignored) and write the JSON
  python3 scripts/eia_prices.py --offline  # rebuild from the files already in data/_eia/

Writes tools/A20-tco/state-prices.json: per state, $/kWh (commercial), $/therm (commercial natural gas) and $/gal
(residential propane), each with where it came from. Needs `pip install xlrd`.

  Electricity  EIA Electric Power Monthly, Table 5.6.B: commercial average price, year to date (cents/kWh)
  Natural gas  EIA Natural Gas Prices, commercial price by state, latest full year ($/thousand cubic feet),
               converted at the tool's therms_per_mcf (config.json)
  Propane      EIA Weekly Heating Oil and Propane Prices, residential propane by state ($/gal, excluding taxes),
               averaged over the latest full heating season (October to March). EIA surveys only some states:
               the rest take their PADD region's average, or the US average where EIA publishes no region (the West
               Coast). Each state says which.
Propane is a residential bulk price: a venue on exchange cylinders usually pays more. The tool says so.
"""
import datetime, html, json, os, re, subprocess, sys
import xlrd

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
RAW = os.path.join(ROOT, 'data', '_eia')
OUT = os.path.join(ROOT, 'tools', 'A20-tco', 'state-prices.json')
CFG = json.load(open(os.path.join(ROOT, 'tools', 'A20-tco', 'config.json')))
THERMS_PER_MCF = CFG['conversions']['therms_per_mcf']['value']

SRC = {
    'elec': ('https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_b', 'e56b.html'),
    'gas': ('https://www.eia.gov/dnav/ng/xls/NG_PRI_SUM_A_EPG0_PCS_DMCF_A.xls', 'ng_comm_annual.xls'),
    'propane': ('https://www.eia.gov/dnav/pet/xls/PET_PRI_WFR_A_EPLLPA_PRS_DPGAL_W.xls', 'propane_res_weekly.xls'),
}
PAGES = {
    'elec': 'https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_b',
    'gas': 'https://www.eia.gov/dnav/ng/ng_pri_sum_a_EPG0_PCS_DMcf_a.htm',
    'propane': 'https://www.eia.gov/dnav/pet/pet_pri_wfr_a_EPLLPA_PRS_dpgal_w.htm',
}
STATES = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut',
    'DE': 'Delaware', 'DC': 'District of Columbia', 'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois',
    'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri', 'MT': 'Montana',
    'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
    'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania',
    'RI': 'Rhode Island', 'SC': 'South Carolina', 'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
    'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
}
# Petroleum Administration for Defense Districts, used where EIA does not survey a state's propane price.
PADD = {
    'New England (PADD 1A)': 'CT ME MA NH RI VT', 'Central Atlantic (PADD 1B)': 'DE DC MD NJ NY PA',
    'Lower Atlantic (PADD 1C)': 'FL GA NC SC VA WV', 'Midwest (PADD 2)': 'IL IN IA KS KY MI MN MO NE ND OH OK SD TN WI',
    'Gulf Coast (PADD 3)': 'AL AR LA MS NM TX', 'Rocky Mountain (PADD 4)': 'CO ID MT UT WY',
}
REGION_OF = {s: r for r, ss in PADD.items() for s in ss.split()}


def fetch():
    os.makedirs(RAW, exist_ok=True)
    for url, name in SRC.values():
        subprocess.run(['curl', '-sSf', '--max-time', '60', '-o', os.path.join(RAW, name), url], check=True)


def electricity():
    s = open(os.path.join(RAW, SRC['elec'][1]), encoding='utf-8', errors='replace').read()
    rows = []
    for tr in re.findall(r'<tr[^>]*>(.*?)</tr>', s, re.S | re.I):
        cells = [re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', c))).strip() for c in re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', tr, re.S | re.I)]
        rows.append(cells)
    head = next(r for r in rows if r and r[0] == 'Census Division and State')
    period = head[3]  # commercial, latest year to date ("August 2026 YTD")
    out = {}
    for r in rows:
        if len(r) >= 5 and r[0] in list(STATES.values()) + ['U.S. Total']:
            try: out['US' if r[0] == 'U.S. Total' else r[0]] = round(float(r[3]) / 100, 4)
            except ValueError: pass
    return out, f'commercial, {period}'


def series(path):
    b = xlrd.open_workbook(path)
    sh = b.sheet_by_index(1)
    cols = {}
    for c in range(1, sh.ncols):
        cols[sh.cell_value(2, c)] = [(datetime.date(*xlrd.xldate_as_tuple(sh.cell_value(r, 0), b.datemode)[:3]), sh.cell_value(r, c))
                                     for r in range(3, sh.nrows) if sh.cell_value(r, c) not in ('', None)]
    return cols


def gas():
    cols = series(os.path.join(RAW, SRC['gas'][1]))
    out, year = {}, None
    for name, pts in cols.items():
        place = name.split(' Price of Natural Gas')[0]
        if not pts: continue
        d, v = pts[-1]
        year = max(year or d.year, d.year)
        out['US' if place == 'U.S.' else place] = (d.year, v)
    res = {k: round(v / THERMS_PER_MCF, 3) for k, (y, v) in out.items() if y == year}
    return res, f'commercial, {year} annual average', year


def propane():
    cols = series(os.path.join(RAW, SRC['propane'][1]))
    latest = max(d for pts in cols.values() for d, _ in pts)
    end_year = latest.year if latest.month >= 4 else latest.year - 1  # the last heating season that has ended
    lo, hi = datetime.date(end_year - 1, 10, 1), datetime.date(end_year, 3, 31)
    out = {}
    for name, pts in cols.items():
        place = re.sub(r'^(Weekly )+', '', name.split(' Propane')[0]).strip()
        vals = [v for d, v in pts if lo <= d <= hi]
        if vals: out['US' if place == 'U.S.' else place] = round(sum(vals) / len(vals), 3)
    return out, f'residential, heating season Oct {end_year - 1} to Mar {end_year} average, excluding taxes'


def main():
    if '--offline' not in sys.argv: fetch()
    e, e_period = electricity()
    g, g_period, _ = gas()
    p, p_period = propane()
    states = {}
    for code, name in STATES.items():
        rec = {'name': name, 'kwh': e.get(name), 'therm': g.get(name), 'gal': p.get(name), 'gal_from': 'state'}
        if rec['gal'] is None:
            reg = REGION_OF.get(code)
            if reg and reg in p: rec['gal'], rec['gal_from'] = p[reg], reg
            else: rec['gal'], rec['gal_from'] = p['US'], 'US average'
        for k in ('kwh', 'therm'):
            if rec[k] is None: rec[k], rec[k + '_from'] = {'kwh': e, 'therm': g}[k]['US'], 'US average'
        states[code] = rec
    doc = {
        '_readme': 'Generated by scripts/eia_prices.py from EIA tables. Do not edit: rerun the script.',
        'built': datetime.date.today().isoformat(),
        'sources': {
            'kwh': {'label': f'EIA Electric Power Monthly, Table 5.6.B ({e_period})', 'url': PAGES['elec'], 'unit': '$/kWh'},
            'therm': {'label': f'EIA Natural Gas Prices ({g_period}), converted at {THERMS_PER_MCF} therms per thousand cubic feet', 'url': PAGES['gas'], 'unit': '$/therm'},
            'gal': {'label': f'EIA Weekly Heating Oil and Propane Prices ({p_period})', 'url': PAGES['propane'], 'unit': '$/gal',
                    'note': 'A residential bulk price. Venues on exchange cylinders usually pay more per gallon: enter your own price.'},
        },
        'US': {'name': 'United States (average)', 'kwh': e['US'], 'therm': g['US'], 'gal': p['US'], 'gal_from': 'state'},
        'states': states,
    }
    json.dump(doc, open(OUT, 'w'), indent=1)
    print(f'{len(states)} states · US {doc["US"]} · propane from region or US: {sum(1 for s in states.values() if s["gal_from"] != "state")}')


if __name__ == '__main__':
    main()
