// Editorial layer for the 26 full-draft web case studies (content/case-studies/web/CSW-*.md).
// Every line here restates the draft and its sources; nothing new. Every page carries
// "Draft – facts to confirm". Photo credits follow the CLAUDE.md caption rule (the draft's hero_caption).
// Private homes (privateHome: true): named by town and source type only; sources print the host, never a path.
'use strict';
const COMP = 'Comparable Bromic installation, not this project: replace with project photography once licensed.';

module.exports = {

'CSW-01': {
  name: 'The Luna', sector: 'Builder Show Home', country: 'USA', line: 'Recessed Warmth Over The Pool', pages: 1, privateHome: true,
  lede: 'On a custom coastal home built for the Wilmington Parade of Homes, custom recessed Bromic heaters warm the porch above the pool – in a home that took Gold for Best Outdoor Living.',
  data: [['Location', 'Wilmington, North Carolina'], ['Setting', 'Parade of Homes show home – pool porch'], ['Heaters', 'Custom recessed Bromic heaters – model to confirm'], ['Controls', 'To confirm']],
  beats: [
    ['The Space', 'The Luna is a custom coastal home by Hardison Building, with a gunite pool and hot tub, exotic-wood porch ceilings and an outdoor kitchen.'],
    ['The Challenge', 'The porch overlooking the pool had to be as inviting as the rooms inside, with heat that disappears into the timber ceiling.'],
    ['The Solution', 'Custom recessed Bromic heaters are set into the porch ceiling above the pool terrace. The listing records a Gold award for Best Outdoor Living.']],
  team: ['Builder: Hardison Building', 'Interior design: Elle/A. Interiors'],
  products: [{ p: 'bromic', where: 'Porch overlooking the pool', mount: 'Recessed in the porch ceiling' }],
},

'CSW-02': {
  name: 'Mountain Estate, Breckenridge', sector: 'Residential', country: 'USA', line: 'Heated Terraces At Altitude', pages: 1, privateHome: true,
  lede: 'High in the mountains of Breckenridge, a newly built estate of about 10,250 sq ft lists heated terraces, a full outdoor kitchen and Bromic heaters among its outdoor spaces.',
  data: [['Location', 'Breckenridge, Colorado'], ['Setting', 'New-build private estate – terraces'], ['Heaters', 'Bromic heaters – model to confirm'], ['Controls', 'To confirm'], ['Date', '2026 (year built)']],
  beats: [
    ['The Space', 'A newly built mountain estate of about 10,250 sq ft, with resort-level outdoor spaces finished in charred-wood cladding.'],
    ['The Challenge', 'In a ski town, outdoor living depends on heat: the terraces had to be usable in the cold.'],
    ['The Solution', 'Bromic heaters warm the terraces beside a full Hestan outdoor kitchen. The listing does not give the model, the mounting or the number of heaters.']],
  products: [{ p: 'bromic', where: 'Terraces beside the outdoor kitchen', mount: 'To confirm' }],
  notes: ['A private home known from a real-estate listing: named by town only, no address.'],
},

'CSW-03': {
  name: 'Juneau Showhome', sector: 'Designer Show Home', country: 'USA', line: 'Outdoor Living In A Rainforest', pages: 2,
  lede: 'In Juneau’s temperate rainforest, a showhome divides its outdoor space into living, dining and grilling zones. The owners chose electric over gas, with Platinum Electric for the grill and matte black Tungsten Electric on the walls.',
  data: [['Location', 'Juneau, Alaska'], ['Setting', 'Designer show home – outdoor living, dining and grilling'], ['Heaters', 'Platinum Smart-Heat® Electric · Tungsten Smart-Heat® Electric, matte black'], ['Controls', 'To confirm']],
  beats: [
    ['The Space', 'Set in Juneau’s temperate rainforest, the showhome, designed by Bauer/Clifton Interiors, splits its outdoor space into zones for living, dining and grilling.'],
    ['The Challenge', 'In Alaska the designer called outdoor heat close to a necessity. The clients wanted electric rather than propane or natural gas.'],
    ['The Solution', 'A Platinum Electric heater, chosen for its durability, warms the open grilling zone of about 75 sq ft; matte black wall-mounted Tungsten Electric heaters were chosen to read as part of the architecture.']],
  zones: { title: 'Three Outdoor Zones', shape: 'plan', items: [
    { l: 'A', name: 'Living', text: 'Outdoor living zone.', w: 1.2 },
    { l: 'B', name: 'Dining', text: 'Outdoor dining zone.', w: 1.1 },
    { l: 'C', name: 'Grilling', text: 'Open grilling zone, about 75 sq ft, warmed by Platinum Electric.', w: 0.8, dims: 'about 75 sq ft' }] },
  team: ['Interior design: Bauer/Clifton Interiors'],
  products: [
    { p: 'platinum-electric', where: 'Open grilling zone', mount: 'To confirm' },
    { p: 'tungsten-electric', img: 'w-juneau-showhome-1', where: 'Outdoor living areas', mount: 'Wall-mounted', extra: [['Finish', 'Matte black']] }],
  notes: ['Which Tungsten heaters warm the living and dining zones is to confirm; the plan shows heated zones only.'],
},

'CSW-04': {
  name: 'Two Michigan Pergolas', sector: 'Residential', country: 'USA', line: 'Four Seasons Under The Louvres', pages: 2, privateHome: true,
  lede: 'In Livonia and Chelsea, a Detroit-area StruXure dealer built Bromic radiant heaters into louvred pergolas with motorised screens, so two backyards stay inviting as the temperature drops.',
  data: [['Location', 'Livonia and Chelsea, Michigan'], ['Setting', 'Two private homes – louvred pergolas'], ['Heaters', 'Bromic radiant heaters – model to confirm'], ['Controls', 'To confirm'], ['Date', '2025']],
  photos: [{ img: 'v-skyview-chelsea-1', caption: 'Chelsea. Photo: Skyview, via skyviewusa.com. Permission to publish to be confirmed.' }, { img: 'v-skyview-livonia-2', caption: 'Livonia. Photo: Skyview, via skyviewusa.com. Permission to publish to be confirmed.' }],
  beats: [
    ['The Space', 'In Livonia, a roof-mounted StruXure pergola attaches to the house, with motorised louvres and solar screens. In Chelsea, an elevated patio sits under a three-zone pergola with screens and an outdoor kitchen.'],
    ['The Challenge', 'Both owners wanted a four-season room in a cold state: louvred roof and screens, with heat that keeps the space in use as autumn comes in.'],
    ['The Solution', 'In both homes, Skyview built Bromic heaters into the pergola structure. Neither project page gives the model or the count.']],
  table: { title: 'Two Projects', tag: 'As listed by the dealer', cols: ['Home', 'Structure', 'Size', 'Completed'], rows: [
    ['Livonia', 'Roof-mounted StruXure louvred pergola, solar screens', 'About 720 sq ft', 'Fall 2025'],
    ['Chelsea', 'Three-zone pergola, screens, outdoor kitchen', 'About 420 sq ft', 'Summer 2025']] },
  team: ['Installer: Skyview (StruXure dealer, Detroit area)'],
  products: [{ p: 'bromic', img: 'v-skyview-livonia-2', where: 'Built into each pergola', mount: 'Within the louvred pergola structure' }],
},

'CSW-05': {
  name: 'Reveal Design Backyards', sector: 'Residential', country: 'USA', line: 'Warmth Hung From The Louvres', pages: 2, privateHome: true,
  lede: 'A Chicago landscape design-build firm specifies Bromic into its pergola work. In Glenview, electric heaters hang from an opening louvred pergola; in North Center, a city backyard pergola is equipped with heaters too.',
  data: [['Location', 'Glenview, Illinois · North Center, Chicago'], ['Setting', 'Two private homes – louvred pergolas'], ['Heaters', 'Bromic electric heaters – model to confirm'], ['Controls', 'To confirm']],
  photos: [{ img: 'v-reveal-glenview-1', caption: 'Glenview. Photo: Reveal Design, via revealdesignchicago.com. Permission to publish to be confirmed.' }],
  beats: [
    ['The Space', 'In Glenview, a suburban backyard brings together a composite deck, an opening louvred pergola, an outdoor kitchen, a fire table and privacy planting. In North Center, a city backyard pairs a pergola with a garage party door and a deck.'],
    ['The Challenge', 'In a cold city, both backyards were designed for long outdoor seasons, with heat built into the structure.'],
    ['The Solution', 'In Glenview, Bromic electric heaters hang from the aluminium pergola. For North Center, the firm’s listing names Bromic heaters and the project page says the pergola is equipped with heaters.']],
  team: ['Designer and builder: Reveal Design LLC'],
  products: [{ p: 'bromic', img: 'v-reveal-glenview-1', where: 'Glenview pergola; North Center pergola', mount: 'Hung from the aluminium pergola (Glenview)' }],
  notes: ['Pergolas named by the firm: Pratic Brera (Glenview) and Apollo (North Center).'],
},

'CSW-06': {
  name: 'Patio Cover, Sammamish', sector: 'Residential', country: 'USA', line: 'Heat And Air Under Cedar', pages: 1, privateHome: true,
  lede: 'Built for chilly Pacific Northwest evenings, a cedar gable-roof patio cover shelters a new deck, with Bromic heaters and ceiling fans so warmth and airflow can be tuned all year.',
  data: [['Location', 'Sammamish, Washington'], ['Setting', 'Private home – gable-roof patio cover and deck'], ['Heaters', 'Bromic heaters – model to confirm'], ['Controls', 'To confirm']],
  hero: { img: 'w-ar-homes-4118-opt', pos: '50% 40%', caption: COMP },
  beats: [
    ['The Space', 'A cedar gable-roof patio cover with skylights over a new custom deck, built by a design-build contractor.'],
    ['The Challenge', 'Pacific Northwest evenings are cool and often wet; the covered deck had to be comfortable through the year.'],
    ['The Solution', 'Bromic outdoor heaters were fitted together with ceiling fans under the cedar roof. The model, count and controls are not stated.']],
  team: ['Installer: PCF Group'],
  products: [{ p: 'bromic', where: 'Under the cedar patio cover', mount: 'To confirm' }],
  notes: ['A 2025 Washington permit for this contractor lists two 30 A Bromic heaters on timer controls; whether it is this job is to confirm.'],
},

'CSW-07': {
  name: 'Outdoor Room, Houston', sector: 'Residential', country: 'USA', line: 'Warm All Year, Even In Texas', pages: 1, privateHome: true,
  lede: 'In Houston’s Memorial area, a patio builder created an outdoor living space of about 550 sq ft, with an outdoor kitchen and Bromic heaters so it stays comfortable all year.',
  data: [['Location', 'Memorial area, Houston, Texas'], ['Setting', 'Private home – outdoor living area, about 550 sq ft'], ['Heaters', 'Bromic heaters – model to confirm'], ['Controls', 'To confirm']],
  hero: { img: 'l-010-076', pos: '50% 50%', caption: COMP },
  beats: [
    ['The Space', 'An outdoor living area of about 550 sq ft with an outdoor kitchen, built by Texas Custom Patios.'],
    ['The Challenge', 'In a warm-climate market, the outdoor room still had to be usable on the few cold evenings – all year round.'],
    ['The Solution', 'Bromic heaters were installed for year-round comfort. The project page has since been taken down; the details come from its search listing.']],
  team: ['Builder and installer: Texas Custom Patios'],
  products: [{ p: 'bromic', where: 'Outdoor living area', mount: 'To confirm' }],
},

'CSW-08': {
  name: 'The Queen’s Club', sector: 'Members’ Club', country: 'United Kingdom', line: 'Room For A Hundred More', pages: 1,
  lede: 'The Queen’s Club renovated its outdoor terrace and opened it to about 100 more restaurant and bar guests, with white Tungsten Electric heaters for spring and late autumn.',
  data: [['Location', 'London'], ['Setting', 'Sports and members’ club – restaurant and bar terrace'], ['Heaters', 'Tungsten Smart-Heat® Electric, white'], ['Controls', 'To confirm']],
  hero: { img: 'l-001-000', pos: '50% 60%', caption: COMP },
  beats: [
    ['The Space', 'The club’s outdoor terrace serves its restaurant and bar.'],
    ['The Challenge', 'After a renovation, the terrace opened to about 100 more guests, who needed to be comfortable in the shoulder seasons.'],
    ['The Solution', 'White Tungsten Smart-Heat Electric heaters were chosen to suit the decor and the club’s tennis theme, so members can dine outside in spring and late autumn.']],
  products: [{ p: 'tungsten-electric', where: 'Restaurant and bar terrace', mount: 'To confirm', extra: [['Finish', 'White']] }],
},

'CSW-09': {
  name: 'Café Sydney', sector: 'Restaurant', country: 'Australia', line: 'Heat That Recedes', pages: 1,
  lede: 'From the top of Customs House, Café Sydney looks out over the harbour. Its manager chose Platinum gas heaters after seeing them at another venue, because they visually recede when off.',
  data: [['Location', 'Customs House, Circular Quay, Sydney'], ['Setting', 'Restaurant – harbour-view terrace'], ['Heaters', 'Platinum Smart-Heat® Gas'], ['Controls', 'To confirm'], ['Date', 'By 2013']],
  beats: [
    ['The Space', 'Café Sydney sits on the top of Customs House at Circular Quay, with a large outdoor dining terrace over the harbour.'],
    ['The Challenge', 'The terrace needed heat that would not spoil the view or the room when it was switched off.'],
    ['The Solution', 'The manager chose Platinum Smart-Heat gas heaters after seeing them elsewhere. Whether they are still installed, and how many, is to confirm.']],
  products: [{ p: 'platinum-gas', where: 'Outdoor dining terrace', mount: 'Under the retractable roof, as photographed – to confirm' }],
  notes: ['A Bromic customer video, “Customer Profile – Cafe Sydney (AU)”, exists on Bromic’s channel.'],
},

'CSW-10': {
  name: 'The Camellia Hotel', sector: 'Pub', country: 'Australia', line: 'Warmth That Starts On The Roof', pages: 1,
  lede: 'Through a cold Sydney winter, The Camellia Hotel wanted heat that stays discreet, adjusts to the evening and recesses neatly into the ceiling. The owner is reported to run the Bromic heaters on the pub’s rooftop solar.',
  data: [['Location', 'Rosehill, western Sydney'], ['Setting', 'Pub'], ['Heaters', 'Bromic heaters – model to confirm'], ['Controls', 'To confirm'], ['Date', '2022']],
  hero: { img: 'w-platinum-electric-del-friscos-century-city-2', pos: '50% 45%', caption: COMP },
  beats: [
    ['The Space', 'A local pub in Rosehill, in Sydney’s west, with newly built outdoor areas.'],
    ['The Challenge', 'The brief was heat that stays discreet, adjusts to the evening, recesses neatly into the ceiling and sits in harmony with the decor.'],
    ['The Solution', 'The pub chose Bromic heaters, and the owner is reported to run them on the venue’s rooftop solar, so the warmth overhead begins with the sun on the roof.']],
  products: [{ p: 'bromic', where: 'Outdoor areas', mount: 'Recessed – to confirm' }],
  notes: ['The solar system (80 kW) is from the solar supplier’s own page, which does not mention Bromic.'],
},

'CSW-11': {
  name: 'Chiswick', sector: 'Restaurant', country: 'Australia', line: 'Warmth At Every Table', pages: 1,
  lede: 'Chiswick in Woollahra is a relaxed Sydney restaurant with dining inside and out. Tungsten gas heaters keep a table on the terrace as inviting on a cool evening as one indoors.',
  data: [['Location', 'Woollahra, Sydney'], ['Setting', 'Restaurant – terrace dining'], ['Heaters', 'Tungsten Smart-Heat® Gas'], ['Controls', 'To confirm']],
  beats: [
    ['The Space', 'A relaxed restaurant from a well-known chef, with dining inside and on the terrace, a bar, a long communal table and shaded outdoor seating.'],
    ['The Challenge', 'Diners outside had to be as comfortable as those indoors on cool Sydney evenings.'],
    ['The Solution', 'Tungsten Smart-Heat Gas heaters were chosen to keep diners comfortable wherever they sit, the terrace included. The quantity and mounting are to confirm.']],
  products: [{ p: 'tungsten-gas', where: 'Indoor and terrace dining', mount: 'To confirm' }],
},

'CSW-12': {
  name: 'Azotea Del Círculo', sector: 'Rooftop Restaurant', country: 'Spain', line: 'Madrid Laid Out Below', pages: 1,
  lede: 'Seven floors above the city, the rooftop of Madrid’s Círculo de Bellas Artes is a bar and restaurant known for its 360-degree view. A Bromic trade listing names Platinum Electric heaters there.',
  data: [['Location', 'Círculo de Bellas Artes, Madrid'], ['Setting', 'Rooftop bar and restaurant at a cultural centre'], ['Heaters', 'Platinum Smart-Heat® Electric'], ['Controls', 'To confirm']],
  beats: [
    ['The Space', 'The rooftop of the Círculo de Bellas Artes cultural centre, seven floors up, with a covered dining area and an open terrace over Madrid.'],
    ['The Challenge', 'Guests come for the view; the terrace had to stay comfortable as the evening cools.'],
    ['The Solution', 'According to a Bromic trade listing, Platinum Smart-Heat Electric heaters warm the rooftop. The venue’s own page does not mention the heaters.']],
  products: [{ p: 'platinum-electric', img: 'v-azotea-circulo-2', where: 'Rooftop', mount: 'To confirm' }],
},

'CSW-13': {
  name: 'Wonder Of The Seas', sector: 'Marine', country: 'Cruise', line: 'More Than A Hundred Heaters On Deck', pages: 2,
  lede: 'Royal Caribbean’s Wonder of the Seas, described at launch as the world’s biggest cruise ship, lives much of its voyage outdoors. More than a hundred Platinum Electric Marine heaters warm its restaurants, bars, pool decks and balconies.',
  data: [['Vessel', 'Wonder of the Seas, Royal Caribbean International'], ['Setting', 'Restaurants, bars, pool decks and balconies'], ['Heaters', 'Platinum Smart-Heat® Electric Marine (more than 100)'], ['Controls', 'To confirm'], ['Date', '2022']],
  photos: [{ img: 'm-wonder-of-the-seas-2', caption: 'An outdoor lounge deck. Photograph from Bromic’s marine presentation (2022).' }],
  beats: [
    ['The Space', 'A floating resort where so much of the voyage happens outside: restaurants, bars, pool decks and suite balconies.'],
    ['The Challenge', 'Passengers needed to stay comfortable outdoors over dinner or a drink when the weather turns cool.'],
    ['The Solution', 'More than a hundred Platinum Smart-Heat Electric Marine heaters, in AISI316 stainless steel, warm the restaurants, bars, pool decks and balconies.']],
  zones: { title: 'Warmth Across The Ship', shape: 'hull', note: 'Spaces shown together on one outline; drawn from the trade press list, not from the ship’s plans.', items: [
    { l: 'A', name: 'Restaurants', text: 'Outdoor dining.', w: 1 }, { l: 'B', name: 'Bars', text: 'Outdoor bars.', w: 1 },
    { l: 'C', name: 'Pool decks', text: 'Pool decks.', w: 1 }, { l: 'D', name: 'Balconies', text: 'Suite balconies.', w: 1 }] },
  products: [{ p: 'platinum-marine', img: 'm-wonder-of-the-seas-2', where: 'Restaurants, bars, pool decks, balconies', qty: 'More than 100', mount: 'To confirm', extra: [['Build', 'AISI316 stainless steel']] }],
},

'CSW-14': {
  name: 'Expedition Ships', sector: 'Marine', country: 'Polar Cruise', line: 'Out On Deck At The Edge Of The World', pages: 2,
  lede: 'Ice-class expedition ships carry a few hundred guests at a time to Antarctica and the Arctic, where the open decks are a treasured part of the journey and the air is cold. Four of them carry Platinum Electric Marine heaters.',
  data: [['Vessels', 'Scenic Eclipse · World Navigator · SH Minerva · SH Vega'], ['Setting', 'Expedition cruise ships – open decks'], ['Heaters', 'Platinum Smart-Heat® Electric Marine'], ['Controls', 'To confirm'], ['Date', '2020–2021']],
  photos: [{ img: 'm-scenic-eclipse-2', caption: 'A heater on the deckhead of a promenade deck, Scenic Eclipse. Photograph from Bromic’s marine presentation (2022).' }, { img: 'm-world-navigator-1', caption: 'World Navigator. Photograph from Bromic’s marine presentation (2022).' }],
  beats: [
    ['The Space', 'Small expedition ships for polar waters, where guests spend time on open decks, bars and balconies between landings.'],
    ['The Challenge', 'Few settings test outdoor heat like the polar regions: the decks have to be welcoming in cold air.'],
    ['The Solution', 'All four ships carry Platinum Smart-Heat Electric Marine heaters. On SH Minerva, Bromic’s presentation names the top-deck bar, the restaurant and the suite balconies.']],
  table: { title: 'Four Ships', tag: 'As listed by the sources', cols: ['Ship', 'Year', 'Design', 'Heated spaces'], rows: [
    ['Scenic Eclipse', '2020', 'Oliver Design', 'To confirm'],
    ['World Navigator', '2021', 'Mystic Cruises', 'To confirm'],
    ['SH Minerva', '2021', 'Tillberg Design of Sweden', 'Top-deck bar, restaurant, suite balconies'],
    ['SH Vega', 'To confirm', 'Swan Hellenic', 'To confirm']] },
  products: [{ p: 'platinum-marine', img: 'm-scenic-eclipse-2', where: 'Open decks on all four ships', mount: 'Deckhead, as photographed – to confirm' }],
},

'CSW-15': {
  name: 'Mein Schiff 4', sector: 'Marine', country: 'Cruise', line: 'A Private Terrace At The Top', pages: 1,
  lede: 'The Himmel & Meer loft suites sit on the top deck of TUI Cruises’ Mein Schiff 4, each with its own terrace. As part of an upgrade, Platinum Electric Marine heaters let guests sit out whenever the air turns cool.',
  data: [['Vessel', 'Mein Schiff 4, TUI Cruises'], ['Setting', 'Himmel & Meer loft suites – private terraces'], ['Heaters', 'Platinum Smart-Heat® Electric Marine'], ['Controls', 'To confirm'], ['Date', '2019 upgrade']],
  beats: [
    ['The Space', 'Loft suites on the top deck, each opening onto its own private terrace with a view of the sea.'],
    ['The Challenge', 'Guests wanted to use their terraces in the cool air of northern itineraries.'],
    ['The Solution', 'Platinum Smart-Heat Electric Marine heaters were fitted to the suite terraces as part of an upgrade in 2019.']],
  products: [{ p: 'platinum-marine', img: 'm-mein-schiff-4-2', where: 'Private suite terraces', mount: 'Wall-mounted, as photographed – to confirm' }],
},

'CSW-16': {
  name: 'Seven Superyachts', sector: 'Marine', country: 'Superyachts', line: 'Heat Tailored To Each Yacht', pages: 2,
  lede: 'From two heaters on a production motor yacht to nine across three decks of a 63-metre Benetti, Platinum Electric Marine heaters let owners use their outdoor decks in every season and at every latitude.',
  data: [['Vessels', 'Seven yachts, 2018–2022'], ['Setting', 'Outdoor dining and lounge decks'], ['Heaters', 'Platinum Smart-Heat® Electric Marine'], ['Controls', 'To confirm'], ['Date', '2018–2022']],
  photos: [{ img: 'm-lady-charlotte-2', caption: 'Aft deck dining on M/Y Lady Charlotte. Photograph from Bromic’s marine presentation (2022).' }, { img: 'm-cloudbreak-2', caption: 'A ceiling-mounted heater on M/Y Cloudbreak. Photograph from Bromic’s marine presentation (2022).' }],
  beats: [
    ['The Space', 'Seven yachts from Feadship, Abeking & Rasmussen, Benetti, Amels, Turquoise and Ocean Alexander, cruising from the Mediterranean to the polar regions.'],
    ['The Challenge', 'Owners and guests wanted their outdoor decks in use in every season and at every latitude.'],
    ['The Solution', 'Every yacht carries Platinum Smart-Heat Electric Marine heaters, from two on the OA100 to nine on Metis. On Emocean four are recessed into the deck heads; on Lady Charlotte six warm the outdoor dining area.']],
  table: { title: 'Seven Yachts', tag: 'As listed in Bromic’s marine presentation', cols: ['Yacht', 'Yard and year', 'Heaters', 'Design'], rows: [
    ['Lady Charlotte', 'Feadship · 2022 refit', '6', 'Azure Naval Architects'],
    ['Emocean', '2020', '4, recessed', 'Hydro Tec with Burdisso & Capponi'],
    ['GO', 'Turquoise · 2018', '6', 'H2 Yacht Design'],
    ['Cloudbreak', 'Abeking & Rasmussen · 2018', '8', 'Espen Oeino with Christian Liaigre'],
    ['Metis', 'Benetti 63 m · 2019', '9', 'Giorgio M. Cassetta with Bannenberg & Rowell'],
    ['Just B', 'Amels 1973 · 2020 rebuild', '4', 'Vripack'],
    ['OA100', 'Ocean Alexander · 2019', '2', 'Evan K. Marshall with Arrabito']] },
  products: [{ p: 'platinum-marine', img: 'm-cloudbreak-2', where: 'Outdoor decks on all seven yachts', qty: '39 across the seven, as listed', mount: 'Recessed on Emocean; others to confirm' }],
  notes: ['Installer named for Just B: Arrow Services Monaco. Designer pairings are as the presentation lists them, in order.'],
},

'CSW-17': {
  name: 'Taberna Puertalsol', sector: 'Rooftop Restaurant', country: 'Spain', line: 'White Heat Over Sol', pages: 1,
  lede: 'High above Plaza Puerta del Sol, a rooftop restaurant looks out over the heart of Madrid. A Bromic trade listing names white 6000 W Tungsten Electric heaters, chosen to suit its clean look and spread warmth across the seating.',
  data: [['Location', 'Plaza Puerta del Sol, Madrid'], ['Setting', 'Rooftop restaurant'], ['Heaters', 'Tungsten Smart-Heat® Electric 6000 W, white'], ['Controls', 'To confirm']],
  beats: [
    ['The Space', 'A rooftop restaurant over Madrid’s best-known square, linked in the listing to a well-known television chef.'],
    ['The Challenge', 'The heaters had to suit the restaurant’s clean look and warm the whole seating area.'],
    ['The Solution', 'White 6000 W Tungsten Smart-Heat Electric heaters, according to the listing. One snippet of the same listing also mentions Platinum Gas: electric alone, or both, is to confirm.']],
  products: [{ p: 'tungsten-electric', where: 'Rooftop seating', qty: '6000 W', mount: 'To confirm', extra: [['Finish', 'White']] }],
},

'CSW-18': {
  name: 'Greenwood Restaurant', sector: 'Restaurant', country: 'USA', line: 'Mid-Century Lines, Warm Patio', pages: 1,
  lede: 'Greenwood’s interior pairs mid-century modern lines with rustic warmth, and that character runs out onto the patio. Platinum gas heaters were chosen for their looks and their output, fitted around the tables and the traffic.',
  data: [['Location', 'Highwood, Illinois'], ['Setting', 'Restaurant – outdoor dining patio'], ['Heaters', 'Platinum Smart-Heat® Gas'], ['Controls', 'To confirm']],
  photos: [{ img: 'v-greenwood-highwood-2', caption: 'Photo: Gunn & Pegelow, via gunnpegelow.com. Permission to publish to be confirmed.' }],
  beats: [
    ['The Space', 'An independent, design-led restaurant on Chicago’s North Shore, with an outdoor dining patio.'],
    ['The Challenge', 'The heat had to suit the restaurant’s look and work with the patio’s table layout, traffic paths and heat requirements.'],
    ['The Solution', 'The team chose the Bromic Platinum gas heater. Gunn & Pegelow worked with WT Engineering to place each heater around the tables and paths.']],
  team: ['Bromic representative: Gunn & Pegelow', 'Engineering: WT Engineering'],
  products: [{ p: 'platinum-gas', img: 'v-greenwood-highwood-2', where: 'Outdoor dining patio', mount: 'Angled from the beam, as photographed – to confirm' }],
},

'CSW-19': {
  name: 'Howard Park Public House', sector: 'Restaurant', country: 'USA', line: 'Skaters And Diners, Warm Outside', pages: 2,
  lede: 'In a South Bend city park, a year-round bar and restaurant sits beside the skating rink. Tungsten gas heaters around the building warm the patio and the skate-rental area through the colder months.',
  data: [['Location', 'Howard Park, South Bend, Indiana'], ['Setting', 'Park restaurant patio and skate-rental area'], ['Heaters', 'Tungsten Smart-Heat® Gas'], ['Controls', 'To confirm'], ['Date', 'Winter 2020']],
  photos: [{ img: 'v-howard-park-south-bend-2', caption: 'Photo: Gunn & Pegelow, via gunnpegelow.com. Permission to publish to be confirmed.' }],
  beats: [
    ['The Space', 'Howard Park is a city park with a year-round bar and restaurant beside its ice rink, and a shop where skaters rent their skates.'],
    ['The Challenge', 'Skaters and diners had to stay comfortable outside through the colder months of a snow-belt city.'],
    ['The Solution', 'Bromic Tungsten gas heaters are set around the perimeter of the building, warming the restaurant patio and the skate-rental area. The project was completed in winter 2020.']],
  zones: { title: 'Around The Building', shape: 'plan', items: [
    { l: 'A', name: 'Restaurant patio', text: 'Tungsten Gas around the building perimeter.', w: 1.4 },
    { l: 'B', name: 'Skate rental', text: 'Tungsten Gas around the building perimeter.', w: 1 }] },
  team: ['Bromic representative and HVAC partner: Gunn & Pegelow', 'Design: M/E Design Services; Alliance Architects'],
  products: [{ p: 'tungsten-gas', img: 'v-howard-park-south-bend-1', where: 'Restaurant patio; skate-rental area', mount: 'Around the building perimeter' }],
},

'CSW-20': {
  name: 'Lambeau Field Alumni Suite Terrace', sector: 'Stadium', country: 'USA', line: 'Late-Season Games, Warm Terrace', pages: 2,
  lede: 'At the home of the Green Bay Packers, the Alumni Suite opens onto an 800 sq ft terrace in one of the coldest markets in the US. Six black Tungsten Electric heaters with dimmers keep it welcoming for late-season games.',
  data: [['Location', 'Green Bay, Wisconsin'], ['Setting', 'Stadium suite terrace, 800 sq ft'], ['Heaters', 'Tungsten Smart-Heat® Electric 4 kW 277 V, black (6)'], ['Controls', 'Dimmer controls, each heater adjustable'], ['Date', 'About 2024']],
  photos: [{ img: 'v-lambeau-alumni-terrace-2', caption: 'Photo: Gunn & Pegelow, via gunnpegelow.com. Permission to publish to be confirmed.' }],
  beats: [
    ['The Space', 'The Alumni Suite at Lambeau Field opens onto an outdoor terrace of 800 sq ft, with high-top tables.'],
    ['The Challenge', 'Green Bay is one of the coldest markets in the US: the terrace had to stay welcoming deep into the season.'],
    ['The Solution', 'Gunn & Pegelow and Somerville Architects specified six black Tungsten 4 kW 277 V electric heaters, each on its own dimmer, so the warmth can be turned up or down.']],
  team: ['Architect: Somerville Architects', 'Builder: Miron Construction', 'Also named: August Winter & Sons, First Supply'],
  products: [{ p: 'tungsten-electric', img: 'v-lambeau-alumni-terrace-2', pos: '50% 30%', where: '800 sq ft suite terrace', qty: '6 × 4 kW, 277 V, black', mount: 'Drop rod, as photographed – to confirm', controls: 'Dimmer controls – each heater turned up or down' }],
},

'CSW-21': {
  name: 'Catch The Wave Swim School', sector: 'Leisure', country: 'USA', line: 'Every Heater On Its Own Dimmer', pages: 1,
  lede: 'At a swim school in South Beloit, a 40 by 20 ft covered patio is warmed by Bromic Tungsten Electric heaters placed to a Bromic layout. Each has its own dimmer, so staff can match the warmth to the day.',
  data: [['Location', 'South Beloit, Illinois'], ['Setting', 'Swim school – covered patio, 40 × 20 ft'], ['Heaters', 'Tungsten Smart-Heat® Electric'], ['Controls', 'One dimmer per heater, 0–100%']],
  beats: [
    ['The Space', 'A covered patio of 40 by 20 ft at a swim school.'],
    ['The Challenge', 'Families and staff needed the patio comfortable in cooler weather, with heat that could be set to the day.'],
    ['The Solution', 'Tungsten Electric heaters were placed at the locations and heights set by a Bromic layout, checked on site. Each heater has its own dimmer, from 0 to 100% output.']],
  team: ['Recommendation and site assessment: Gunn & Pegelow', 'Layout: Bromic'],
  products: [{ p: 'tungsten-electric', img: 'v-catch-the-wave-beloit-1', where: 'Covered patio', mount: 'Locations and heights set by a Bromic layout', controls: 'Bromic dimmer controls, one per heater, 0–100%' }],
},

'CSW-22': {
  name: 'Predator Ridge, Range Restaurant', sector: 'Golf Resort', country: 'Canada', line: 'Three Seasons Under One Roof', pages: 1,
  lede: 'At the Predator Ridge golf resort, a retractable-roof pergola turned the Range restaurant and bar’s patio into a three-season dining room. Fourteen 6000 W Bromic electric heaters, LED lighting and screens keep it open in most weather.',
  data: [['Location', 'Vernon, British Columbia'], ['Setting', 'Golf-resort restaurant – pergola patio, 65 × 24 ft'], ['Heaters', 'Bromic electric, 6000 W (14) – model to confirm'], ['Controls', 'To confirm'], ['Date', 'About 2024']],
  beats: [
    ['The Space', 'A patio at the Range restaurant and bar, under a custom retractable-roof pergola 65 ft wide, 24 ft deep and 10 ft high, on a steel platform.'],
    ['The Challenge', 'The restaurant wanted its patio to welcome guests well beyond the summer.'],
    ['The Solution', 'Bella Outdoor Living designed and installed the pergola in two weeks, with fourteen 6000 W Bromic electric heaters, LED lighting and screens integrated.']],
  team: ['Design and install: Bella Outdoor Living', 'Builder: Sawchuk Construction'],
  products: [{ p: 'bromic', where: 'Pergola patio', qty: '14 × 6000 W', mount: 'Integrated into the retractable-roof pergola' }],
  notes: ['6000 W fits Tungsten Electric, but the model is to confirm.'],
},

'CSW-23': {
  name: 'Front Yard, New Jersey', sector: 'Residential', country: 'USA', line: 'Warmth Planned From The Front', pages: 1, privateHome: true,
  lede: 'A Deckorators press release presents a front-of-home redesign at a New Jersey farmhouse-style home: an all-season lounge with Bromic Platinum Electric heaters built in, beside a custom swing bed.',
  data: [['Location', 'New Jersey'], ['Setting', 'Private home – front-yard lounge'], ['Heaters', 'Platinum Smart-Heat® Electric, built in'], ['Controls', 'To confirm'], ['Date', '2026']],
  beats: [
    ['The Space', 'The front yard of a farmhouse-style home, redesigned around a deck, a porch and a lounge.'],
    ['The Challenge', 'The lounge was to be used in every season, as part of the national “Year of the Front Yard” campaign.'],
    ['The Solution', 'Premier Outdoor Living built Bromic Platinum Electric heaters into the all-season lounge, beside a custom Deckorators swing bed.']],
  team: ['Builder and installer: Premier Outdoor Living (Deckorators Certified Elite Pro)'],
  products: [{ p: 'platinum-electric', where: 'All-season front-yard lounge', mount: 'Built in' }],
},

'CSW-24': {
  name: 'Babylon Rooftop', sector: 'Rooftop Restaurant', country: 'Australia', line: 'Thirty-Four Heaters Over Sydney', pages: 2,
  lede: 'On the rooftop of Westfield Sydney, Babylon’s outdoor terrace and alfresco dining are warmed by 34 Platinum gas heaters in two sizes. Bromic worked with the architects on the heat, for an operator returning for a second venue.',
  data: [['Location', 'Level 7, Westfield Sydney, Pitt Street'], ['Setting', 'Rooftop bar and restaurant – terrace and alfresco'], ['Heaters', 'Platinum Smart-Heat® Gas, two sizes (34)'], ['Controls', 'To confirm'], ['Date', 'Opened 2019']],
  beats: [
    ['The Space', 'Babylon sits on the rooftop of Westfield Sydney: a Mantle Group restaurant and bar designed by Hogg & Lamb and built by Xenia, with an outdoor terrace and alfresco dining.'],
    ['The Challenge', 'The open terrace and alfresco areas had to stay comfortable for diners through the cooler months.'],
    ['The Solution', 'Thirty-four Platinum Smart-Heat Gas heaters – 22 of the smaller size and 12 of the larger – warm the outdoor areas. Bromic worked with the architects on the heating.']],
  zones: { title: 'Terrace And Alfresco', shape: 'plan', items: [
    { l: 'A', name: 'Outdoor terrace', text: 'Platinum Gas.', w: 1.2 },
    { l: 'B', name: 'Alfresco dining', text: 'Platinum Gas.', w: 1 }] },
  team: ['Architect: Hogg & Lamb', 'Builder: Xenia', 'Operator and project manager: Mantle Group'],
  products: [{ p: 'platinum-gas', img: 'v-babylon-sydney-1', where: 'Outdoor terrace and alfresco dining', qty: '34: 22 smaller, 12 larger', mount: 'To confirm' }],
  notes: ['The source names the sizes with a legacy numbering; current model names to confirm. Mantle Group also worked with Bromic at Squire’s Landing, Circular Quay.'],
},

'CSW-25': {
  name: 'Summer Kitchen, Blainville', sector: 'Residential', country: 'Canada', line: 'Screens First, Then Heat', pages: 1, privateHome: true,
  lede: 'In Blainville, north of Montréal, an installer planned a backyard as one outdoor room. Once motorised screens closed the exposed side, two Tungsten heaters were enough where the first calculation called for four.',
  data: [['Location', 'Blainville, Quebec'], ['Setting', 'Private home – summer kitchen and terrace'], ['Heaters', 'Tungsten Smart-Heat® (2) – electric or gas to confirm'], ['Controls', 'To confirm'], ['Date', 'By 2025']],
  beats: [
    ['The Space', 'A backyard planned as one outdoor room: a summer kitchen with a Dekton counter, a barbecue, a wood-fired oven, a wood fireplace and motorised screens.'],
    ['The Challenge', 'The kitchen and terrace had to be comfortable on cool Quebec evenings, with as little equipment as the space would allow.'],
    ['The Solution', 'Mughet put the screens in before the heaters. With the exposed side closed, two Bromic Tungsten heaters were enough where the first calculation called for four.']],
  team: ['Design and installation: Mughet'],
  products: [{ p: 'tungsten', where: 'Summer kitchen and terrace', qty: '2', mount: 'Hung from the timber ceiling, as photographed – to confirm' }],
},

'CSW-26': {
  name: 'Summer Kitchen, Saint-Hippolyte', sector: 'Residential', country: 'Canada', line: 'Heat Along The Whole Kitchen', pages: 1, privateHome: true,
  lede: 'In Saint-Hippolyte, an installer fitted out an open summer kitchen. The brief asked for heat spread along a long prep-and-dining zone rather than one piece over a table, so Tungsten heaters sit in the structure and do their job.',
  data: [['Location', 'Saint-Hippolyte, Quebec'], ['Setting', 'Private home – open summer kitchen'], ['Heaters', 'Tungsten Smart-Heat® – electric or gas, and quantity, to confirm'], ['Controls', 'To confirm'], ['Date', 'By 2025']],
  beats: [
    ['The Space', 'An open summer kitchen with a Dekton counter, a barbecue and a smoker. One page of the installer’s describes it facing a lake, another as a pavilion by a pool.'],
    ['The Challenge', 'The space is open and exposed, and the heat had to reach along a long prep-and-dining zone.'],
    ['The Solution', 'Mughet integrated Bromic Tungsten infrared heaters into the structure. An architect and the design studio Les Coupables worked on the project.']],
  team: ['Installer: Mughet', 'Design: an architect and Les Coupables'],
  products: [{ p: 'tungsten', where: 'Along the prep-and-dining zone', mount: 'Integrated into the structure' }],
  notes: ['The two installer pages differ on the setting (lakeside or poolside); to confirm.'],
},
};
