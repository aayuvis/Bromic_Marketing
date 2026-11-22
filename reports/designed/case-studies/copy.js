// Editorial layer for the Project Files: the words on each sheet.
// Bromic-published studies: written from the bromic.com case-study page (re-read 22 Nov 2026) and
// data/site-inventory.json – nothing beyond what the page states. Web drafts: copy-web.js, from the CSW files.
// Rules kept here: only what the source states; Controls always shown ("To confirm" when silent);
// a quote only when it is a complete, attributed sentence on the page; never a homeowner's name;
// private homes by town and source type only; en dashes; no exclamation marks.
// Fields: name, sector, country, line, lede, data [[k,v]], beats [[h,t]x3], hero {img,pos,caption},
// photos [{img,pos,caption}], zones {title, shape plan|hull|none, items [{l,name,text,w,dims}]},
// quote {text, who, role}, products [{p, where, qty, mount, controls, extra, img, pos}], team, sources, notes,
// pages (preferred 1|2|3), dateText (for the source line), skip (reason; not built).
'use strict';
const BC = 'Bromic-published photograph from the case study.';
const QNOTE = 'The quotation is as published on the case study; check the wording against the live page before print.';

const C = {

'cs-eclipse-electric-and-tungsten-electric-at-pink-hill-hotel': {
  name: 'Pink Hill Hotel', sector: 'Hospitality', country: 'Australia', line: 'Warmth Under Every Ceiling', pages: 3, dateText: 'December 2023',
  lede: 'A newly built pub and live entertainment venue wanted its outdoor terraces full through the colder months, with nothing taking away from the room. Bromic matched a heater to each ceiling, keeping precise directional heat on the tables and every feature wall in view.',
  data: [['Location', 'Beaconsfield, Australia'], ['Setting', 'Pub and live entertainment venue – outdoor terraces'], ['Heaters', 'Eclipse Smart-Heat® Electric · Eclipse Pendant · Tungsten Smart-Heat® Electric'], ['Controls', 'Eclipse Dimmer Controller on Eclipse; Tungsten to confirm'], ['Date', 'December 2023']],
  hero: { img: 'w-tungsten-electric-bromic-pinkhill-547-1', pos: '50% 55%', caption: 'Tungsten Smart-Heat® Electric on drop poles over the dining terrace.' },
  beats: [
    ['The Space', 'Pink Hill is a new pub built for live music, with function rooms and outdoor terraces under high ceilings, sections of operable roof and feature walls that give each room its character.'],
    ['The Challenge', 'The venue wanted its terraces in use through the colder months without losing the atmosphere. Heaters had to suit ceilings of very different heights, work with only certain parts of the operable roof’s structure and leave every feature wall in view.'],
    ['The Solution', 'After reviewing the site plans, Bromic’s commercial sales team specified a mix: compact Eclipse Pendants under the high fixed ceiling, Eclipse Electric over the dining tables and high-output Tungsten Electric in the larger rooms and under the operable roof.']],
  zones: { title: 'One Heater For Each Ceiling', shape: 'plan', items: [
    { l: 'A', name: 'Feature-wall lounge', text: 'Higher fixed ceiling. The smaller Eclipse Pendant keeps the view of the feature wall clear.', w: 1.1 },
    { l: 'B', name: 'Modern dining', text: 'Eclipse Electric gives spot heat and light over each table, on a 24-inch twin pole and a custom pole.', w: 1 },
    { l: 'C', name: 'Industrial-style room', text: 'Tungsten Electric for high output, lowered to a suitable height on a 1200 mm pole.', w: 1 },
    { l: 'D', name: 'Operable roof', text: 'Tungsten Electric mounted on the structural beams and angled toward guests, chosen for Melbourne’s winter.', w: 1 }] },
  photos: [
    { img: 'w-eclipse-electric-tungsten-electric-bromic-pi', pos: '50% 40%', caption: 'Tungsten Electric and Eclipse heaters under the timber-slat ceiling, the feature wall left clear.' },
    { img: 'w-pink-hills-hotel-aus-2', pos: '50% 30%', caption: 'Eclipse Pendants on drop rods in the feature-wall lounge.' }],
  products: [
    { p: 'eclipse-electric', img: 'w-eclipse-electric-bromic-pinkhill-532-2', pos: '50% 55%', where: 'Modern dining, over the tables', mount: '24-inch twin pole and a custom pole', controls: 'Eclipse Dimmer Controller – three built-in heat and light presets for staff' },
    { p: 'eclipse-pendant', img: 'w-eclipse-electric-bromic-pinkhill-553-1', pos: '20% 30%', where: 'Feature-wall lounge, higher fixed ceiling', mount: 'Pendant on drop rods', controls: 'Eclipse Dimmer Controller – three built-in heat and light presets for staff' },
    { p: 'tungsten-electric', img: 'w-tungsten-electric-bromic-pinkhill-524', pos: '30% 50%', where: 'Industrial-style room and operable roof', mount: '1200 mm pole; structural beams, angled', controls: 'To confirm – the case study does not name them' }],
  sources: ['Photography: Bromic-published images from the case study and the Eclipse 24-inch Twin Pole and Tungsten Smart-Heat® Electric product pages. Photographer credit to confirm.'],
  notes: ['The case study gives no heater quantities or positions; the plan shows heated zones only. It lists the Tungsten pole as “3 ft (1200 mm)” – 1200 mm is about 4 ft, so the length is shown in millimetres only until it is confirmed.'],
},

'cs-albany-zero-emissions-multifamily-building': {
  name: 'Industrie', sector: 'Multifamily Residential', country: 'USA', line: 'Warmth Without A Flame', pages: 2, dateText: '2024',
  lede: 'An all-electric apartment building in Albany wanted its rooftop patio in use on cool evenings, without a gas fire table in sight. A freestanding Eclipse heater brings heat and light to the deck and comes inside for the winter.',
  data: [['Location', 'Albany, New York'], ['Setting', 'Zero-emissions apartment building – rooftop patio'], ['Heaters', 'Eclipse Smart-Heat® Freestanding'], ['Controls', 'To confirm – residents adjust the heat; the control is not named'], ['Date', '2024']],
  hero: { img: 'w-industrie-roof-deck-1', pos: '50% 60%', caption: BC },
  photos: [{ img: 'w-rdc-industrie-may-2024-14-edit', pos: '50% 40%', caption: 'The rooftop amenity deck. ' + BC }, { img: 'w-industrie-apartments-exterior', pos: '50% 50%', caption: 'Industrie, Albany. ' + BC }],
  beats: [
    ['The Space', 'Industrie, The Rosenblum Companies’ all-electric, zero-emissions building, has a rooftop patio that serves as its residents’ social hub, with views of the Downtown Albany skyline and the Hudson River.'],
    ['The Challenge', 'The developer wanted the patio usable into the cooler months and evenings. In an all-electric building, gas fire pits and heaters were ruled out: the warmth had to come without combustion.'],
    ['The Solution', 'Bromic recommended an Eclipse Smart-Heat Freestanding heater, provided heat maps for the furniture layout and worked with Rosenblum’s engineers on the install. A dedicated outlet set into the deck avoids visible cords, and the heater can be taken down and stored when the rooftop closes for winter.']],
  quote: { text: 'Bromic’s Eclipse heater allows our residents to comfortably enjoy this key amenity well into the cooler months.', who: 'Jeff Mirel', role: 'Principal, The Rosenblum Companies' },
  products: [{ p: 'eclipse-freestanding', img: 'w-rdc-industrie-may-2024-14-edit', pos: '50% 30%', where: 'Rooftop patio', mount: 'Freestanding; dedicated outlet set into the deck; stored over winter', extra: [['Warmth', 'A warming area 11 ft across, with integrated LED light, as the case study states']] }],
  notes: [QNOTE],
},

'cs-christophers-at-wrigley-mansion': {
  name: 'Christopher’s At Wrigley Mansion', sector: 'Restaurant', country: 'USA', line: 'The Heater That Made The Patio', pages: 2, dateText: '2022',
  lede: 'A new restaurant at Phoenix’s historic Wrigley Mansion needed a patio to meet demand, and the patio needed heat that suited a 1931 landmark. Freestanding Eclipse heaters now arch over the tables, warmth and light in one.',
  data: [['Location', 'Wrigley Mansion, Phoenix, Arizona'], ['Setting', 'Restaurant patio at a 1931 landmark'], ['Heaters', 'Eclipse Smart-Heat® Freestanding'], ['Controls', 'To confirm'], ['Date', '2022']],
  hero: { img: 'w-wrigley-mansion-phoenix-arizona-22', pos: '50% 50%', caption: BC },
  photos: [{ img: 'w-wrigleys-mansion-eclipse-portable-heater-4', caption: 'The terrace below the mansion at dusk. ' + BC }, { img: 'w-wrigley-mansion-phoenix-arizona-17', caption: BC }],
  beats: [
    ['The Space', 'Completed in 1931, the Wrigley Mansion is a Phoenix landmark with a view over the city skyline. Owner Jamie Hormel and restaurateur Christopher Gross, partners of more than 15 years, opened a new Christopher’s there, with a new patio.'],
    ['The Challenge', 'To meet demand the restaurant needed the patio, and the patio needed heat. Architect Wendell Burnette had to find heaters that fit the historic design and the atmosphere of the space.'],
    ['The Solution', 'Working with Bromic’s heating experts, Burnette chose the Eclipse Smart-Heat Freestanding: an electric heater with dimmable LED lighting built in, standing beside each table and reaching over it.']],
  quote: { text: 'We had to find the right heater or we couldn’t do the patio, that’s what it came down to.', who: 'Wendell Burnette', role: 'Architect, Wendell Burnette Architects' },
  team: ['Architect: Wendell Burnette Architects'],
  products: [{ p: 'eclipse-freestanding', img: 'w-wrigleys-mansion-eclipse-portable-heater-4', pos: '60% 50%', where: 'Restaurant patio', mount: 'Freestanding, arching over the tables', extra: [['Light', 'Dimmable LED, built in']] }],
  notes: [QNOTE],
},

'cs-del-friscos-double-eagle-steakhouse': {
  name: 'Del Frisco’s Double Eagle Steakhouse', sector: 'Restaurant', country: 'USA', line: 'Year-Round Dining In Century City', pages: 1, dateText: 'January 2019',
  lede: 'On the patio of a Los Angeles steakhouse, three Platinum Electric heaters keep outdoor dining open all year, with a wireless dimmer to set the heat through the day.',
  data: [['Location', 'Westfield Century City, Los Angeles'], ['Setting', 'Steakhouse dining patio in a shopping centre'], ['Heaters', 'Platinum Smart-Heat® Electric, 3400 W (3)'], ['Controls', 'Wireless controller and wireless dimmer'], ['Date', 'January 2019']],
  hero: { img: 'w-platinum-electric-del-friscos-century-city-2', pos: '50% 45%', caption: 'Platinum Smart-Heat® Electric at Del Frisco’s, Century City. Bromic-published photograph (Platinum Electric Mounting Poles product page).' },
  beats: [
    ['The Space', 'Del Frisco’s Double Eagle Steakhouse has an outdoor dining patio at Westfield Century City, a shopping and entertainment centre in Los Angeles.'],
    ['The Challenge', 'The restaurant group wanted the patio in use year-round, with guests comfortable from lunch through the evening in a Southern California climate.'],
    ['The Solution', 'Three 3400-watt Platinum Smart-Heat Electric heaters were installed on the patio. A wireless controller and wireless dimmer let staff turn the output down when less heat is needed.']],
  products: [{ p: 'platinum-electric', where: 'Outdoor dining patio', qty: '3 × 3400 W', mount: 'To confirm', controls: 'Wireless controller and wireless dimmer – output can be dimmed' }],
},

'cs-desert-mirage-blurring-the-lines-between-home-and-nature': {
  name: 'Desert Mirage', sector: 'Residential', country: 'USA', line: 'Desert Living, Late Into The Evening', pages: 2, privateHome: true,
  lede: 'In the Sonoran Desert, a home built to bring the outside in needed its patio warm on cold evenings. A freestanding Eclipse heater arches over the lounge, giving warmth and light, and moves wherever the evening goes.',
  data: [['Location', 'Scottsdale, Arizona'], ['Setting', 'Private home – outdoor patio'], ['Heaters', 'Eclipse Smart-Heat® Freestanding'], ['Controls', 'To confirm']],
  hero: { img: 'w-desert-mirage', pos: '50% 50%', caption: 'Photograph published with the case study (credited there to Chris Smith and Istoria Films).' },
  photos: [{ img: 'w-dwellimage2', caption: 'The covered terrace and stone fireplace wall. ' + BC }, { img: 'w-dwell-modern-sunset-house', caption: 'The home at dusk. ' + BC }],
  beats: [
    ['The Space', 'Framed by the McDowell Mountains, the home pairs expansive indoor and outdoor living with large glazed walls and glass hallways, bringing the desert landscape inside.'],
    ['The Challenge', 'The owners wanted convenience and luxury, and a patio they could use on colder evenings, as part of a design that joins indoor and outdoor living.'],
    ['The Solution', 'An Eclipse Smart-Heat Freestanding infrared heater stands on the patio, with an integrated dimmable LED light. It is not fixed in place, so it can be moved across the patio as needed.']],
  quote: { text: 'The clients are here throughout fall, winter, and spring and they entertain frequently and spend a lot of time outside.', who: 'Bradley Leavitt', role: 'Founder, AFT Construction' },
  team: ['Contractor: AFT Construction', 'Architecture: Cosan Studio', 'Interior design: Alisha Taylor Interiors'],
  products: [{ p: 'eclipse-freestanding', img: 'w-dwellimage6', pos: '50% 40%', where: 'Outdoor patio and seating area', mount: 'Freestanding; moved across the patio as needed', extra: [['Light', 'Integrated dimmable LED']] }],
  notes: [QNOTE, 'Featured by Dwell, as the case study notes. A private home: named by town only.'],
},

'cs-eclipse-freestanding-and-tungsten-electric-at-hyatt-regency-': {
  name: 'Hyatt Regency Dehradun', sector: 'Hospitality', country: 'India', line: 'Heat That Holds Against The Wind', pages: 3, dateText: 'May 2023',
  lede: 'In the foothills of the Himalayas, a new luxury hotel wanted its terraces and rooftop bar warm despite strong winds. Bromic’s heat plan put Tungsten Electric where the wind blows hardest and freestanding Eclipse heaters where there is nothing to mount to.',
  data: [['Location', 'Himalayan foothills, Uttarakhand, India'], ['Setting', 'Five-star hotel – rooftop bar, restaurants, lounges'], ['Heaters', 'Tungsten Smart-Heat® Electric · Eclipse Smart-Heat® Freestanding'], ['Controls', 'Eclipse Dimmer Controller; Tungsten to confirm'], ['Date', 'May 2023']],
  hero: { img: 'w-23-03-12-bromic-heating-hyatt-dehradun-14', pos: '50% 55%', caption: 'Tungsten Smart-Heat® Electric beside a dining table, the mountains beyond. ' + BC },
  photos: [
    { img: 'w-23-03-12-bromic-heating-hyatt-dehradun-52', pos: '50% 45%', caption: 'Tungsten Electric along the glass facade of a lounge terrace. ' + BC },
    { img: 'w-23-03-12-bromic-heating-hyatt-dehradun-61', pos: '50% 50%', stripPos: '50% 12%', caption: 'Eclipse Freestanding over a rooftop lounge at night. ' + BC }],
  beats: [
    ['The Space', 'Opened in March 2022 on 4.25 acres, the hotel has more than 250 rooms over seven floors, with restaurants, lounges and Beyul, a rooftop bar, all designed around the view.'],
    ['The Challenge', 'Strong winds were common at the rooftop bar and the all-day dining restaurant. The heaters had to hold up to them and blend into each space without changing its look.'],
    ['The Solution', 'Working with architect Love Chaudhary of AND Studio through Bromic’s complimentary design service, the team chose Tungsten Electric for precise directional heat in the restaurants and on the rooftop, and Eclipse Freestanding for heat and light in lounges with no ceiling or wall to mount to.']],
  zones: { title: 'A Heater For Every Space', shape: 'plan', items: [
    { l: 'A', name: 'Beyul rooftop bar', text: 'Tungsten Electric and Eclipse Freestanding, set against strong winds.', w: 1.2 },
    { l: 'B', name: 'Pan Asian restaurant', text: 'Tungsten Electric.', w: 1 },
    { l: 'C', name: 'All-day dining', text: 'Tungsten Electric, against the strong winds.', w: 1 },
    { l: 'D', name: 'Lounges', text: 'Eclipse Freestanding – heat and light where there are no ceilings or walls for mounting.', w: 1.1 }] },
  quote: { text: 'The heat plan helped us optimize the placement of the heaters for maximum efficiency and comfort.', who: 'Love Chaudhary', role: 'Principal Architect, AND Studio' },
  team: ['Architect: AND Studio, New Delhi'],
  products: [
    { p: 'tungsten-electric', img: 'w-23-03-12-bromic-heating-hyatt-dehradun-85', pos: '50% 35%', where: 'Rooftop bar, Pan Asian restaurant, all-day dining', mount: 'To confirm', controls: 'To confirm – the case study names only the Eclipse Dimmer Controller' },
    { p: 'eclipse-freestanding', img: 'w-23-03-12-bromic-heating-hyatt-dehradun-61', pos: '50% 40%', where: 'Lounges and rooftop bar', mount: 'Freestanding', controls: 'Eclipse Dimmer Controller' }],
  notes: ['The case study gives no heater quantities; the plan shows heated spaces only. ' + QNOTE],
},

'cs-eclipse-pendant-and-platinum-electric-at-stellas-wine-bar': {
  name: 'Stella’s Wine Bar', sector: 'Hospitality', country: 'USA', line: 'A Patio For Every Season', pages: 2, dateText: '2021',
  lede: 'At Landry’s The Post Oak Hotel, the patio of Stella’s Wine Bar is bigger than the room inside. Four Eclipse pendants and two Platinum Electric heaters, planned with Bromic’s design service, keep it full through fall and winter.',
  data: [['Location', 'The Post Oak Hotel, Houston, Texas'], ['Setting', 'Wine bar patio around an olive tree'], ['Heaters', 'Eclipse Smart-Heat® Electric pendant (4) · Platinum Smart-Heat® Electric (2)'], ['Controls', 'Eclipse Dimmer Controller (4) · Wireless Dimmer Controller'], ['Date', '2021']],
  hero: { img: 'w-stellas-wine-bar-houston-tx-3', pos: '50% 50%', caption: 'Eclipse pendants over the tables around the olive tree. ' + BC },
  photos: [{ img: 'w-stellas-bromic-eclipse-and-platinum-electric', caption: BC }, { img: 'w-stellas-bromic-platinum-electric', caption: 'Platinum Smart-Heat® Electric over the bar seating. ' + BC }],
  beats: [
    ['The Space', 'Stella’s outdoor patio is larger than its indoor seating and is centred on a signature olive tree, in a hotel built around a luxurious atmosphere.'],
    ['The Challenge', 'On cool evenings and overcast days, guests stayed inside. Landry’s wanted the patio used all year, to keep revenue steady through fall and winter.'],
    ['The Solution', 'Bromic’s complimentary design service produced a 2D heat plan. Four Eclipse Electric pendants hang on 24-inch straight poles over the tables, and two Platinum Electric heaters sit on a 2-foot ceiling mount.']],
  quote: { text: 'I like that you can adjust the heat and the light from afar without intruding on the guests’ experience.', who: 'Julie Dalton', role: 'Sommelier, Stella’s Wine Bar' },
  products: [
    { p: 'eclipse-electric', img: 'w-stellas-bromic-eclipse-heater', where: 'Over the patio tables', qty: '4', mount: 'Pendant on 24-inch straight poles', controls: 'Eclipse Dimmer Controller, one per heater – heat and light' },
    { p: 'platinum-electric', img: 'w-stellas-bromic-platinum-electric', pos: '50% 40%', where: 'Patio', qty: '2', mount: '2-foot ceiling mount, Platinum Electric mounting poles', controls: 'Wireless Dimmer Controller' }],
  notes: [QNOTE],
},

'cs-embracing-earthy-elegance-at-oran-park-hotel': {
  name: 'Oran Park Hotel', sector: 'Hospitality', country: 'Australia', line: 'Moulded From The Earth', pages: 3,
  lede: 'A newly completed hotel in Sydney’s south-west, built of raw materials and natural forms, needed heat that either disappears into the design or becomes part of it. Platinum Electric warms the terraces; Eclipse pendants hang among the courtyard lights.',
  data: [['Location', 'Oran Park, south-west Sydney'], ['Setting', 'Hotel – terraces, courtyard and rooftop'], ['Heaters', 'Platinum Smart-Heat® Electric · Eclipse Smart-Heat® Electric pendants'], ['Controls', 'To confirm']],
  hero: { img: 'w-eclipseelectric-oranparkhotel-stevenwoodburn', pos: '50% 50%', caption: 'Eclipse pendants in the courtyard. Photograph: Steve Woodburn, as credited by Bromic.' },
  photos: [
    { img: 'w-bromicheaters-oranparkhotel-stevenwoodburn-4', pos: '50% 50%', caption: 'Eclipse heaters on twin drop rods among the pendant lights. Photograph: Steve Woodburn, as credited by Bromic.' },
    { img: 'w-eclispe', pos: '50% 50%', caption: 'High tables under Eclipse heaters in the courtyard. Bromic-published photograph.' }],
  beats: [
    ['The Space', 'Designed by Achiebiosis Architects, the hotel blends natural materials, organic forms and modern hospitality, with semi-enclosed and open-air spaces under high ceilings – among them a double-height central courtyard.'],
    ['The Challenge', 'Some areas had no ceiling structure and others little wall space. The heating had to work around lighting, TV screens and fans, either blend in or become a focal point, and leave no cold spots.'],
    ['The Solution', 'With Bromic’s complimentary design service, the team prioritised seated zones and the perimeter. Platinum Electric heaters on wall mounts and pole suspensions warm the terraces and courtyard; Eclipse pendants are custom-integrated with the courtyard’s light fittings.']],
  zones: { title: 'Three Outdoor Rooms', shape: 'plan', items: [
    { l: 'A', name: 'Northern Terrace', text: 'Platinum Electric.', w: 396, dims: '36 m × 11 m' },
    { l: 'B', name: 'Central Courtyard', text: 'Double height. Platinum Electric, with Eclipse pendants integrated into the light fittings.', w: 420, dims: '28 m × 15 m' },
    { l: 'C', name: 'Rooftop Terrace', text: 'Platinum Electric.', w: 420, dims: '28 m × 15 m' }] },
  quote: { text: 'The Bromic team helped us position the units efficiently based on the performance limits of the heaters.', who: 'Edith Clark', role: 'Architect, Achiebiosis Architects' },
  team: ['Architect: Achiebiosis Architects'],
  products: [
    { p: 'platinum-electric', where: 'Northern Terrace, Central Courtyard, Rooftop Terrace', mount: 'Wall mounts and pole suspensions – which where, to confirm' },
    { p: 'eclipse-electric', img: 'w-bromicheaters-oranparkhotel-stevenwoodburn-4', pos: '50% 40%', where: 'Central Courtyard', mount: 'Pendant, integrated with the light fittings' }],
  notes: ['Areas are as the case study gives them; it gives no heater quantities. ' + QNOTE],
},

'cs-embracing-natures-elegance-ambiente-sedona': {
  name: 'Ambiente Sedona', sector: 'Hospitality', country: 'USA', line: 'Warmth Among The Red Rocks', pages: 3,
  lede: 'Sedona’s desert nights turn cold from fall to spring. At Ambiente, freestanding Eclipse heaters arch over the communal lounges and fire pits, while Tungsten Electric warms each guest deck and the places where staff stand outside.',
  data: [['Location', 'Sedona, Arizona'], ['Setting', 'Landscape hotel – communal lounges, guest decks'], ['Heaters', 'Eclipse Smart-Heat® Freestanding · Tungsten Smart-Heat® Electric'], ['Controls', 'To confirm']],
  hero: { img: 'w-bromic-ambiente-sedona-10', pos: '50% 55%', caption: 'Eclipse Freestanding over the sofas and fire pits at dusk. ' + BC },
  photos: [
    { img: 'w-bromic-ambiente-sedona', pos: '50% 50%', caption: 'Tungsten Electric over a sunken lounge, the red rocks beyond. ' + BC },
    { img: 'w-bromic-ambiente-sedona-4', pos: '50% 50%', caption: 'Eclipse heaters over the communal lounge. ' + BC }],
  beats: [
    ['The Space', 'Ambiente sits among Sedona’s red rocks, with modern architecture that balances private guest quarters with communal spaces: outdoor couches, linear fire pits and a pool.'],
    ['The Challenge', 'Temperatures can drop sharply from fall to spring. The hotel needed heaters powerful enough for cold desert conditions that also suited its modern design.'],
    ['The Solution', 'Bromic’s design team drafted heat plans for both models and coordinated with Ambiente’s electrician before the grand opening. Eclipse Freestanding reaches over the couches and fire pits; Tungsten Electric covers the private patio decks and staff work areas.']],
  zones: { title: 'Communal, Private, Working', shape: 'plan', items: [
    { l: 'A', name: 'Communal lounges', text: 'Eclipse Freestanding over the couches and fire pits, and along the areas that border them.', w: 1.5 },
    { l: 'B', name: 'Guest patio decks', text: 'Tungsten Electric on the decks of guests’ private quarters.', w: 1 },
    { l: 'C', name: 'Staff areas', text: 'Tungsten Electric where employees stand outside for long periods.', w: 0.8 }] },
  quote: { text: 'We sought sleek, contemporary elements that seamlessly melded with the surrounding natural beauty.', who: 'Jennifer May', role: 'Co-owner, Ambiente' },
  products: [
    { p: 'eclipse-freestanding', img: 'w-bromic-ambiente-sedona-5', pos: '50% 40%', where: 'Communal lounges, couches and fire pits', mount: 'Freestanding' },
    { p: 'tungsten-electric', img: 'w-bromic-ambiente-sedona-11', pos: '50% 40%', where: 'Guest patio decks; staff work areas', mount: 'To confirm' }],
  notes: ['The case study gives no heater quantities, and says more heaters are planned. ' + QNOTE],
},

'cs-enhancing-rooftop-bar-designs-with-cutting-edge-outdoor-heat': {
  name: 'Rooftop Bar, Irvine', sector: 'Hospitality', country: 'USA', line: 'Sixteen Storeys Up, Warm And Clear', pages: 2, dateText: '2023',
  lede: 'Irvine’s first rooftop bar is windy, open to the skyline and cleared now and then for window washing. Freestanding Eclipse heaters move where they are needed, and white Tungsten Electric blends into the ceiling.',
  data: [['Location', 'Irvine, California'], ['Setting', 'Rooftop bar on a hotel, 16 storeys up'], ['Heaters', 'Eclipse Smart-Heat® Freestanding · Tungsten Smart-Heat® Electric'], ['Controls', 'Eclipse Dimmer Controller · On/Off switches for Tungsten'], ['Date', '2023']],
  hero: { img: 'w-bromic-sep18th-28', pos: '50% 55%', caption: 'Eclipse Freestanding over the lounge chairs at night. ' + BC },
  photos: [{ img: 'w-bromic-sep18th-14', caption: 'White Tungsten Electric above the bar. ' + BC }, { img: 'w-eclipse-portable-hive-and-honey-2', caption: BC }],
  beats: [
    ['The Space', 'Set atop a hotel in Irvine, the bar opens onto a patio with views to Saddleback Mountain, framed by external columns and alternating beams under a high ceiling in neutral tones.'],
    ['The Challenge', 'The rooftop is windy and the skyline had to stay in view. Window-washing equipment hangs over the building’s side, so the patio is cleared from time to time and nothing could be mounted on the perimeter.'],
    ['The Solution', 'Bromic’s design service reviewed the plans and sent a heat plan with spec sheets. Eclipse Freestanding gives directional heat over each lounge and table group and can be unplugged and moved; white Tungsten Electric heaters are hardwired to On/Off switches for staff.']],
  products: [
    { p: 'eclipse-freestanding', img: 'w-eclipse-portable-hive-and-honey-3', pos: '50% 35%', where: 'Lounges and table groups on the patio', mount: 'Freestanding; disconnected and moved for window washing', controls: 'Eclipse Dimmer Controller' },
    { p: 'tungsten-electric', img: 'w-white-tungsten-electric-hive-and-honey-1', where: 'Under the white ceiling', mount: 'Hardwired; Tungsten Electric mounting poles listed', extra: [['Finish', 'White, to blend with the ceiling and walls']], controls: 'On/Off switches, so staff can run them independently' }],
  notes: ['The case study names its client only as a private developer; the venue is not named on the page.'],
},

'cs-enhancing-work-life-balance-with-year-round-outdoor-comfort-': {
  name: 'The Boardwalk', sector: 'Workplace', country: 'USA', line: 'Work Outside, All Year', pages: 1, dateText: '2024',
  lede: 'At The Boardwalk, a two-acre courtyard extends the office outdoors for meetings, focused work and lunch. Platinum Electric heaters built into its pergolas keep it in use through the cooler months.',
  data: [['Location', 'Irvine, California'], ['Setting', 'Office campus – two-acre courtyard with pergolas'], ['Heaters', 'Platinum Smart-Heat® Electric'], ['Controls', 'To confirm'], ['Date', '2024']],
  hero: { img: 'w-boardwalk-edits-49', pos: '50% 50%', caption: 'Platinum Electric on a pergola beam above a long table. ' + BC },
  beats: [
    ['The Space', 'Managed by CBRE, The Boardwalk is a luxury office complex in Irvine with resort-style outdoor space: a two-acre courtyard with pergolas, an onsite restaurant and a café.'],
    ['The Challenge', 'The aim was flexible outdoor space for meetings, brainstorming, focused work and dining, with heating that looks good and works, so the courtyard is used all year.'],
    ['The Solution', 'Platinum Smart-Heat Electric heaters were installed within the courtyard’s pergolas on Platinum Electric mounting poles, their stainless steel chassis and tinted ceramic glass suiting the resort-style design.']],
  products: [{ p: 'platinum-electric', where: 'Courtyard pergolas', mount: 'Within the pergolas; Platinum Electric mounting poles', extra: [['Build', '304-grade stainless steel chassis, tinted ceramic glass']] }],
},

'cs-from-gut-renovation-to-outdoor-bliss-how-bromics-tungsten-he': {
  name: 'Screened Porch, New Jersey', sector: 'Residential', country: 'USA', line: 'Two Heaters, Not Three', pages: 2, privateHome: true, dateText: '2024',
  lede: 'In a gut-renovated 1960s colonial, the new screened porch has become the family’s gathering place, all day long. Two black Tungsten Electric heaters, hung above the screens, keep it warm through a New Jersey winter.',
  data: [['Location', 'New Jersey (suburban)'], ['Setting', 'Private home – screened porch'], ['Heaters', 'Tungsten Smart-Heat® Electric 4000 W, black (2)'], ['Controls', 'Dimmer Controller'], ['Date', '2024']],
  hero: { img: 'w-dsc05737-courtney-saib', pos: '50% 45%', caption: 'Two black Tungsten Electric heaters on drop poles under the vaulted ceiling. ' + BC },
  photos: [{ img: 'w-tungsten-electric-courtney-thompson-1', caption: BC }, { img: 'w-dsc05545-courtney-saib', caption: 'Tungsten Electric under the timber ceiling. ' + BC }],
  beats: [
    ['The Space', 'The first floor was gutted and reconfigured, adding a screened porch with a lounge and a dining area. A traditional fireplace adds ambience but is not the heat source.'],
    ['The Challenge', 'The porch had to stay warm through cold winters and hot summers. The heaters had to sit above the metal screens yet direct heat downward, without overheating the space.'],
    ['The Solution', 'The first plan called for three heaters on three walls. Bromic’s specialists advised that three would be too much heat for the square footage, so two black Tungsten Electric 4000 W heaters hang on ceiling-mounted suspension poles above the screens, facing down.']],
  zones: { title: 'One Porch, Two Zones', shape: 'plan', items: [
    { l: 'A', name: 'Lounge', text: 'Seating around the fireplace, warmed by the two heaters together.', w: 1 },
    { l: 'B', name: 'Dining', text: 'The dining table, warmed by the same pair; the case study does not say which heater covers which.', w: 1 }] },
  quote: { text: 'This was my first-time purchasing and installing a Bromic product, and I couldn’t be happier.', who: 'Homeowner', role: 'New Jersey' },
  products: [{ p: 'tungsten-electric', img: 'w-dsc05545-courtney-saib', where: 'Screened porch – lounge and dining', qty: '2 × 4000 W, black', mount: 'Ceiling-mounted suspension poles, above the screens', controls: 'Dimmer Controller – on at the push of a button, output dimmable' }],
  notes: ['A private home: named by area only. The case study says Bromic worked with the family’s architect, designer, builder and electrician. ' + QNOTE],
},

'cs-hide-restaurant': {
  name: 'HIDE', sector: 'Restaurant', country: 'United Kingdom', line: 'Alfresco On Piccadilly', pages: 1, dateText: '2020',
  lede: 'When dining moved outdoors, HIDE extended onto the streets of Piccadilly. Matte black freestanding Tungsten gas heaters keep its gazebo terrace comfortable in an unpredictable London climate.',
  data: [['Location', 'Piccadilly, London'], ['Setting', 'Michelin-starred restaurant – street terrace'], ['Heaters', 'Tungsten Smart-Heat® Freestanding Gas, matte black'], ['Controls', 'To confirm'], ['Date', '2020']],
  hero: { img: 'w-hide-london-4', pos: '50% 50%', caption: 'Freestanding gas heaters among the tables on the terrace. ' + BC },
  beats: [
    ['The Space', 'HIDE is a three-storey Michelin-starred restaurant. During the pandemic it extended onto Piccadilly with an alfresco terrace sheltered by gazebos and framed by pampas grass.'],
    ['The Challenge', 'With dining limited to outdoors and the weather unpredictable even in summer, guests needed to feel safe and comfortable outside.'],
    ['The Solution', 'Bromic Tungsten Smart-Heat Freestanding gas heaters in matte black stand among the tables, bringing heat to the terrace without fixed mounting.']],
  products: [{ p: 'tungsten-freestanding-gas', img: 'w-hide-london-5', where: 'Alfresco terrace under gazebos', mount: 'Freestanding', extra: [['Finish', 'Matte black']] }],
},

'cs-hotel-skansen-elevates-outdoor-dining-with-the-bromic-smart-': {
  name: 'Hotel Skansen', sector: 'Hospitality', country: 'Sweden', line: 'Warm From Breakfast On', pages: 2, dateText: 'November 2023',
  lede: 'On Sweden’s west coast, Hotel Skansen wanted the terraces of its new SAND restaurant and lounge used in the colder months, with even heat and a calm, luxurious feel. Eclipse Freestanding heaters hang their heads over the middle of the tables.',
  data: [['Location', 'Båstad, Sweden'], ['Setting', 'Resort hotel – SAND restaurant and lounge'], ['Heaters', 'Eclipse Smart-Heat® Freestanding (2)'], ['Controls', 'Eclipse Dimmer Controller · wireless controls'], ['Date', 'November 2023']],
  hero: { img: 'w-bromic-eclipse-portable-hotel-skansen-01', pos: '50% 55%', caption: 'Eclipse Freestanding over a dining table at dusk. ' + BC },
  photos: [{ img: 'w-bromic-eclipse-portable-hotel-skansen-06-v02', caption: 'Two Eclipse heaters over the sofas along the courtyard wall. ' + BC }, { img: 'w-bromic-eclipse-portable-hotel-skansen-04', caption: 'The Eclipse disc and its LED ring. ' + BC }],
  beats: [
    ['The Space', 'Hotel Skansen in Båstad, run by GRAM Group, has more than 172 rooms, conference centres, a spa with a cold bathhouse and a rooftop banquet hall. Its new SAND restaurant and lounge open onto outdoor seating.'],
    ['The Challenge', 'The hotel wanted its outdoor areas usable in colder months without losing the ambience its guests expect. Even distribution of heat was the priority.'],
    ['The Solution', 'After reviewing plans and images, Bromic recommended Eclipse Freestanding: each heater head hangs from a mounting arm over the middle of a table, and the heaters can be moved to where they are needed. Staff run them with wireless controls.']],
  quote: { text: 'We use them with wireless controls, which work very well.', who: 'Siggo Plato', role: 'Assistant Restaurant Manager, Hotel Skansen' },
  products: [{ p: 'eclipse-freestanding', img: 'w-bromic-eclipse-portable-hotel-skansen-05-v02', where: 'SAND terraces and the entrance', qty: '2 specified', mount: 'Freestanding; the head hangs from a mounting arm over the table centre', controls: 'Eclipse Dimmer Controller and wireless controls – heat percentage, light brightness, three heat and light presets' }],
  notes: ['Staff say they run the heaters from 7 am for breakfast service. ' + QNOTE],
},

'cs-kahite-golf-course-pub-grill': {
  name: 'Kahite Pub & Grill', sector: 'Golf Club', country: 'USA', line: 'Room For Every Member', pages: 2, dateText: 'October 2020',
  lede: 'At a golf course in the foothills of the Great Smoky Mountains, a new covered patio doubles the pub’s room for events. Nine Tungsten Electric heaters under its low ceiling, with curtains against the wind, keep it open all year.',
  data: [['Location', 'Vonore, Tennessee'], ['Setting', 'Covered golf-club patio for about 100 guests'], ['Heaters', 'Tungsten Smart-Heat® Electric 6000 W (9)'], ['Controls', 'To confirm'], ['Date', 'October 2020']],
  hero: { img: 'portfolio:tungsten-electric', pos: '50% 50%', caption: 'Tungsten Smart-Heat® Electric – a product photograph, not this project. The case study carries no photographs of the patio.' },
  beats: [
    ['The Space', 'Kahite Golf Course covers 200 acres in the foothills of the Great Smoky Mountains, with views over Tellico Lake. A covered patio for about 100 people was added to the Pub & Grill to extend its entertainment space.'],
    ['The Challenge', 'Events often outgrew the pub. The patio had to be usable all year – through regular winds and winter lows the case study puts at 5 °C – under a relatively low ceiling.'],
    ['The Solution', 'With technical help from Bromic’s sales team, the club installed nine Tungsten Electric 6000 W heaters, each covering up to 15 m², and added curtains to keep the heat in.']],
  zones: { title: 'One Patio, Closed To The Wind', shape: 'plan', items: [
    { l: 'A', name: 'Covered patio', text: 'About 100 seats under a relatively low ceiling, warmed by Tungsten Electric; curtains hold the heat against the wind.', w: 1 }] },
  products: [{ p: 'tungsten-electric', where: 'Covered patio', qty: '9 × 6000 W', mount: 'To confirm', extra: [['Coverage', 'Up to 15 m² a heater, as the case study states']] }],
  notes: ['The case study gives no positions; the plan shows the heated patio only.'],
},

'cs-london-restauranteur-incorporates-full-bromic-line-across-lo': {
  name: 'Paris Grill, Paris Bar & Kadie’s Club', sector: 'Hospitality', country: 'United Kingdom', line: 'Three Venues, Three Answers', pages: 2, dateText: 'April 2023',
  lede: 'A London restaurateur brought Bromic into all three of his venues, each with a different problem at the door. Through certified dealer Heatport, every site got its own answer: Eclipse, Tungsten and Platinum Electric.',
  data: [['Location', 'London – the City, Farringdon, Piccadilly'], ['Setting', 'A grill, a bar and a nightclub'], ['Heaters', 'Eclipse Smart-Heat® Electric · Tungsten Smart-Heat® Electric · Platinum Smart-Heat® Electric'], ['Controls', 'Eclipse Dimmer Controller · On/Off controller · others to confirm'], ['Date', 'April 2023']],
  hero: { img: 'w-paris-grill-case-study-hero-image', pos: '50% 50%', caption: 'Eclipse pendants under the Paris Grill entrance canopy. ' + BC },
  photos: [{ img: 'w-tungsten-electric-wall-mount-paris-bar-londo', caption: 'Tungsten Electric over the doors at Paris Bar. ' + BC }, { img: 'w-paris-grill-case-study-image', caption: 'Paris Grill from the street. ' + BC }],
  beats: [
    ['The Space', 'Paris Grill sits near Liverpool Street among the City’s towers, Paris Bar in an industrial-style brick building in Farringdon, and Kadie’s Club, a boutique nightclub, in Piccadilly.'],
    ['The Challenge', 'Paris Grill’s entrance doubles as a smoking area that passers-by see. Paris Bar needed heat for outdoor dining and a quiet replacement for a loud HVAC heat curtain. At Kadie’s, a doorman works the entrance on chilly evenings.'],
    ['The Solution', 'Bromic’s heating experts visited each site. Two Eclipse Electric pendants on 24-inch straight poles warm the Paris Grill entrance; at Paris Bar a 6 kW Tungsten Electric covers the outdoor area and a Platinum Electric just inside replaces the heat curtain; a Tungsten Electric warms the door at Kadie’s.']],
  zones: { title: 'Three Sites', shape: 'none', tag: 'As described', items: [
    { l: 'A', name: 'Paris Grill entrance', text: 'Two Eclipse Electric pendants, heat and light set by the doorman on the Eclipse Dimmer Controller.' },
    { l: 'B', name: 'Paris Bar', text: 'Tungsten Electric, 6 kW dual element, over the covered outdoor area on an On/Off controller; Platinum Electric inside the front entrance.' },
    { l: 'C', name: 'Kadie’s Club entrance', text: 'Tungsten Electric for the doorman.' }] },
  quote: { text: 'They want to have Bromic because everyone else does, and they know they can trust their durability.', who: 'George Ketley', role: 'Heatport, Bromic certified dealer – on neighbouring businesses' },
  products: [
    { p: 'eclipse-electric', img: 'w-eclipse-electric-24inch-single-pole-ceiling-', pos: '50% 40%', where: 'Paris Grill entrance', qty: '2', mount: 'Ceiling-mounted on 24-inch straight poles', controls: 'Eclipse Dimmer Controller – heat and light' },
    { p: 'tungsten-electric', img: 'w-tungsten-electric-wall-mount-paris-bar-londo', where: 'Paris Bar outdoor area; Kadie’s Club entrance', mount: 'To confirm', extra: [['Output', '6 kW, dual element (Paris Bar)']], controls: 'On/Off controller at Paris Bar; Kadie’s to confirm' },
    { p: 'platinum-electric', where: 'Paris Bar, just inside the front entrance', qty: '1', mount: 'Ceiling-mounted' }],
  notes: ['The case study does not name the restaurateur. ' + QNOTE],
},

'cs-m-y-lady-lene-superyacht': {
  name: 'M/Y Lady Lene', sector: 'Marine', country: 'Superyacht', line: 'Aft Decks For Every Season', pages: 2, dateText: '2021',
  lede: 'On a custom 34-metre explorer yacht from Van der Valk, white Platinum Electric Marine heaters are recessed into the deck heads of the VIP balcony and the aft entertainment deck, so the owner and guests use them all year.',
  data: [['Vessel', '34-metre explorer superyacht'], ['Setting', 'Aft deck entertainment area and VIP balcony'], ['Heaters', 'Platinum Smart-Heat® Electric Marine, white'], ['Controls', 'To confirm'], ['Date', '2021']],
  hero: { img: 'w-marine-grade-platinum-electric-white-lady-le', pos: '50% 50%', caption: 'Heaters recessed flush in the curved aft deck ceiling. ' + BC },
  photos: [{ img: 'w-bromic-heating-marine-platinum-electric-lady', pos: '50% 15%', caption: 'Platinum Electric Marine over the aft lounge at sunset. ' + BC }],
  beats: [
    ['The Space', 'The aft entertainment area is the yacht’s design focus, with zones to relax and dine, a bar and a swim platform. Built by Van der Valk, she was designed by a team including Diana Yacht Design and Ginton Naval Architects.'],
    ['The Challenge', 'The owner and guests wanted the aft decks comfortable and usable year-round, with heating that suited the yacht’s clean, elegant design.'],
    ['The Solution', 'White Platinum Smart-Heat Electric Marine heaters, in AISI316 stainless steel, were recessed into the bridge deck aft VIP balcony and the aft deck entertainment area.']],
  zones: { title: 'Two Decks Aft', shape: 'hull', note: 'Decks shown side by side; drawn from the case study’s description, not from the yacht’s plans.', items: [
    { l: 'A', name: 'Aft deck entertainment', text: 'Relaxing, dining and the bar, above the swim platform. Recessed Platinum Electric Marine.', w: 1.3 },
    { l: 'B', name: 'Bridge deck VIP balcony', text: 'Recessed Platinum Electric Marine.', w: 1 }] },
  quote: { text: 'Each time the heaters are turned on, the heat is felt immediately at the perfect temperature.', who: 'Andre Caixêta', role: 'Chief Engineer, M/Y Lady Lene' },
  team: ['Shipyard: Van der Valk', 'Design: Diana Yacht Design', 'Naval architecture: Ginton Naval Architects', 'Exteriors: Guido de Groot', 'Interior styling: Carla Guilhem'],
  products: [{ p: 'platinum-marine', img: 'w-bromic-heating-marine-platinum-electric-lady', pos: '50% 30%', where: 'Aft deck entertainment area; bridge deck aft VIP balcony', mount: 'Recessed in the deck heads', extra: [['Finish', 'White; AISI316 stainless steel']] }],
  notes: ['The case study states the heaters are certified by Lloyd’s Register. ' + QNOTE],
},

'cs-pecora-bianca': {
  name: 'Pecora Bianca', sector: 'Restaurant', country: 'USA', line: 'Keeping The Table Set', pages: 1, dateText: 'September 2020',
  lede: 'When the pandemic moved dining outdoors, Pecora Bianca chose Bromic heaters so it could keep sharing Italian food and human connection with its guests.',
  data: [['Location', 'New York'], ['Setting', 'Restaurant – outdoor dining'], ['Heaters', 'Platinum Smart-Heat® Electric · Tungsten Smart-Heat® Electric'], ['Controls', 'To confirm'], ['Date', 'September 2020']],
  hero: { img: 'w-img-13962', pos: '50% 50%', caption: 'The outdoor dining enclosure, heaters along its roof edge. ' + BC },
  beats: [
    ['The Space', 'Pecora Bianca serves Italian food in New York. During the pandemic, its tables moved into outdoor dining structures on the street.'],
    ['The Challenge', 'The restaurant wanted to keep up its mission – sharing the joy of Italian food and celebrating human connection – with guests seated outside.'],
    ['The Solution', 'Platinum Smart-Heat Electric and Tungsten Smart-Heat Electric heaters were installed for the outdoor dining. The case study gives no quantities or positions.']],
  products: [{ p: 'platinum-electric', where: 'Outdoor dining', mount: 'To confirm' }, { p: 'tungsten-electric', where: 'Outdoor dining', mount: 'To confirm' }],
  notes: ['The case study does not state the location in its text; New York is from its photographs’ captions.'],
},

'cs-perfecting-the-modern-outdoor-pool-house-with-bromics-eclips': {
  name: 'Pool House, Germany', sector: 'Residential', country: 'Germany', line: 'Warmth After The Swim', pages: 2, privateHome: true, dateText: 'June 2023',
  lede: 'A contemporary pool house in a German garden needed heat and light under a lower ceiling than ideal. An Eclipse Electric on an 8-inch pole meets the clearances and makes the lounge a place to dry off after a swim.',
  data: [['Location', 'Germany'], ['Setting', 'Private home – pool house lounge'], ['Heaters', 'Eclipse Smart-Heat® Electric'], ['Controls', 'Eclipse Dimmer Controller'], ['Date', 'June 2023']],
  hero: { img: 'w-dsc01890-hdr-bearbeitet', pos: '50% 50%', caption: 'The pool house lounge at blue hour. ' + BC },
  photos: [{ img: 'w-dsc01972-bearbeitet', caption: BC }, { img: 'w-dsc01860-bearbeitet', caption: 'The Eclipse heater glowing on the ceiling at dusk. ' + BC }],
  beats: [
    ['The Space', 'The pool house, planned with Will Pools & Wellness of Bellheim, uses modern materials and opens onto the garden. Its outdoor lounge is where people dry off after swimming.'],
    ['The Challenge', 'The heating had to match the modern look. The ceiling was lower than ideal, the heater had to meet its clearance requirements, and it needed a more substantial power supply.'],
    ['The Solution', 'With Bromic’s complimentary design service, the team chose an Eclipse Smart-Heat Electric on an Eclipse 8-inch straight pole to meet the clearances, and planned in a power line with voltage requirements unusual for Germany.']],
  quote: { text: 'We had to install the correct power line, which had unconventional voltage requirements for Germany.', who: 'Regina Schaurer-Will', role: 'Owner, Will Pools & Wellness' },
  team: ['Pool and wellness dealer: Will Pools & Wellness, Bellheim'],
  products: [{ p: 'eclipse-electric', img: 'w-dsc01860-bearbeitet', pos: '50% 35%', where: 'Pool house lounge', mount: 'Eclipse 8-inch straight pole', controls: 'Eclipse Dimmer Controller – light intensity and heat level' }],
  notes: ['A private home: the case study does not name the owner or the town. ' + QNOTE],
},

'cs-platinum-electric-heaters-in-pangbourne': {
  name: 'Barn Conversion, Pangbourne', sector: 'Residential', country: 'United Kingdom', line: 'Heat You Barely Notice', pages: 2, privateHome: true, dateText: '2022',
  lede: 'On two acres an hour from London, a former tennis court became an outdoor entertaining space inside a barn conversion. Black Platinum Electric heaters, with zoned dimming, replace open-element heaters the owner never liked.',
  data: [['Location', 'Pangbourne, England'], ['Setting', 'Private home – outdoor room in a barn conversion'], ['Heaters', 'Platinum Smart-Heat® Electric 3400 W, black (12 recommended)'], ['Controls', 'Wireless Dimmer Controller · Master Remote'], ['Date', '2022']],
  hero: { img: 'w-p1020710-hdr-2-denoiseai-clear', pos: '50% 50%', caption: 'Black Platinum Electric heaters along both eaves of the pavilion. ' + BC },
  photos: [{ img: 'w-p1021414-hdr-denoiseai-low-light', caption: 'The heaters at night. ' + BC }, { img: 'w-p1021449-hdr-denoiseai-low-light', caption: 'The lounge around the fire pit. ' + BC }],
  beats: [
    ['The Space', 'The 1920s house sits on two acres outside Pangbourne. Where a tennis court once was, the owner built an entertaining space in a barn conversion that fully shelters it from the weather.'],
    ['The Challenge', 'He wanted the space in use year-round, with heat whenever it cooled, in place of open-element heaters that looked ugly, rusted and gathered cobwebs – and he needed guidance on which heaters, and how many.'],
    ['The Solution', 'Bromic’s design service recommended twelve black Platinum Electric 3400 W heaters, with a Wireless Dimmer Controller and a Master Remote for dimming and zoned control.']],
  quote: { text: 'Our guests have been wowed by the entertainment space and impressed with the heaters.', who: 'Homeowner', role: 'Pangbourne' },
  products: [{ p: 'platinum-electric', img: 'w-p1020691-denoiseai-clear', where: 'Outdoor entertaining space in the barn conversion', qty: '12 × 3400 W, black (recommended)', mount: 'To confirm', controls: 'Wireless Dimmer Controller and Master Remote – dimming and zones' }],
  notes: ['The case study gives twelve as the number recommended. A private home: named by town only. ' + QNOTE],
},

'cs-platinum-electric-heaters-recessed-using-the-low-clearance-r': {
  name: 'Artivo Shades New Build', sector: 'Residential', country: 'North America', line: 'Recessed, Clean And Modern', pages: 1, dateText: 'June 2023',
  lede: 'On a part-built project with a pergola already in place, Artivo Shades wanted heat that kept a clean, modern look. Platinum Electric heaters, recessed with the Low Clearance Recess Kit, sit flush in the ceiling.',
  data: [['Location', 'Not stated'], ['Setting', 'New build – outdoor entertaining space with pergola'], ['Heaters', 'Platinum Smart-Heat® Electric · Low Clearance Recess Kit'], ['Controls', 'To confirm'], ['Date', 'June 2023']],
  hero: { img: 'w-bromic-shoot-may-11-2023-54', pos: '50% 50%', caption: 'Platinum Electric recessed flush in a timber-lined ceiling. ' + BC },
  beats: [
    ['The Space', 'The client wanted an outdoor entertaining space usable all year. The project was part-built when the heaters were specified, with an outdoor pergola already in place.'],
    ['The Challenge', 'The heating had to keep a minimalist, modern look, and the recess had to work with construction that was already under way.'],
    ['The Solution', 'Bromic’s design service recommended the Platinum Electric Low Clearance Recess Kit, whose lower clearance requirements make installation easier, and the heaters were recessed directly into the ceiling.']],
  quote: { text: 'The Platinum Electric heaters are so clean and modern looking that people don’t even recognize them as heaters.', who: 'Nikhil Barua', role: 'Project Manager, Artivo Shades' },
  products: [{ p: 'platinum-electric', img: 'w-bromic-shoot-may-11-2023-39', where: 'Outdoor entertaining space', mount: 'Recessed with the Platinum Electric Low Clearance Recess Kit' }],
  notes: ['The case study lists the kit as “Platinum Electric Recess Kit” in its product list and “Low Clearance Recess Kit” in its text; the kit name is to confirm. ' + QNOTE],
},

'cs-platinum-electric-marine-heaters-aboard-iconic-superyacht-m-': {
  name: 'M/Y Coral Ocean', sector: 'Marine', country: 'Superyacht', line: 'Dinner For Twelve On Deck', pages: 2, dateText: '2019',
  lede: 'Aboard the refurbished superyacht Coral Ocean, the aft decks are where everyone gathers. Recessed Platinum Electric Marine heaters let twelve guests dine outside on chilly evenings, all year.',
  data: [['Vessel', 'Superyacht, Lürssen-built'], ['Setting', 'Main deck aft and owner’s deck aft'], ['Heaters', 'Platinum Smart-Heat® Electric Marine · Platinum Electric Recess Kit'], ['Controls', 'Wireless Dimmer Controller'], ['Date', '2019']],
  hero: { img: 'w-my-coral-ocean-platinum-electric-4', pos: '50% 50%', caption: 'The covered aft deck, heaters recessed in the white ceiling. ' + BC },
  photos: [{ img: 'w-my-coral-ocean-platinum-electric-6', caption: 'M/Y Coral Ocean at anchor. ' + BC }, { img: 'w-my-coral-ocean-platinum-electric-2', caption: BC }],
  beats: [
    ['The Space', 'Designed by Bannenberg & Rowell, with naval architecture by Lürssen, the recently refurbished yacht has two aft decks that each seat twelve – her most important gathering places, her captain says.'],
    ['The Challenge', 'The outdoor decks had to be usable year-round, including for dining on chilly evenings, with even heat and few cold spots.'],
    ['The Solution', 'Through Bromic’s complimentary design service, a heating expert prepared a free 2D heat plan. Platinum Smart-Heat Electric Marine heaters were recessed with the Platinum Electric Recess Kit on both aft decks and run on a Wireless Dimmer Controller.']],
  zones: { title: 'Two Decks Aft', shape: 'hull', note: 'Decks shown side by side; drawn from the case study’s description, not from the yacht’s plans.', items: [
    { l: 'A', name: 'Main deck aft', text: 'Seats twelve for dinner. Recessed Platinum Electric Marine.', w: 1 },
    { l: 'B', name: 'Owner’s deck aft', text: 'Seats twelve. Recessed Platinum Electric Marine.', w: 1 }] },
  quote: { text: 'The evenness of the heat emission is one of our customers’ favorite features of Bromic’s heating solutions.', who: 'Will Kaye', role: 'Captain, M/Y Coral Ocean' },
  team: ['Design: Bannenberg & Rowell', 'Naval architecture: Lürssen'],
  products: [{ p: 'platinum-marine', where: 'Main deck aft; owner’s deck aft', mount: 'Recessed – Platinum Electric Recess Kit', controls: 'Wireless Dimmer Controller', extra: [['Build', 'Sealed body, tinted ceramic glass, AISI 316 stainless steel']] }],
  notes: [QNOTE],
},

'cs-platinum-electric-marine-heaters-aboard-ritz-carlton-yacht-c': {
  name: 'Evrima', sector: 'Marine', country: 'Cruise', line: 'Heat Hidden In The Ceiling', pages: 2, dateText: '2022',
  lede: 'The first ship of The Ritz-Carlton Yacht Collection was built as a hotel at sea, with a superyacht’s design. Platinum Electric Marine heaters, recessed into the ceilings of six open deck areas, keep its 298 passengers comfortable outside all year.',
  data: [['Vessel', 'Evrima, The Ritz-Carlton Yacht Collection'], ['Setting', 'Six open deck areas – restaurants and lounges'], ['Heaters', 'Platinum Smart-Heat® Electric Marine · Platinum Electric Recess Kit'], ['Controls', 'To confirm'], ['Date', '2022']],
  hero: { img: 'w-platinum-marine-ritz-carlton-evrima-jack-har-2', pos: '50% 50%', caption: 'The pool bar, heaters recessed in the curved ceiling. ' + BC },
  photos: [{ img: 'w-platinum-marine-ritz-carlton-evrima-jack-har', caption: 'Evrima’s stern and marina deck at dusk. ' + BC }, { img: 'w-platinum-marine-ritz-carlton-evrima-jack-har-3', caption: 'The pool deck under the overhang. ' + BC }],
  beats: [
    ['The Space', 'Evrima has 149 suite-style cabins, six restaurants, four pools, two bars, a spa deck and a water-level marina terrace, all designed to blend with their surroundings.'],
    ['The Challenge', 'The open decks needed heating that matched the luxury design – concealed and recessed in the ceiling – and made the outdoor spaces usable all year.'],
    ['The Solution', 'Bromic’s Daniel Bruntsch provided a 2D heat plan through the complimentary design service. The layout followed the restaurant seating and the lounge sofas, and the heaters were recessed with the Platinum Electric Recess Kit across six open deck areas.']],
  quote: { text: 'The passenger comfort level on a luxury cruise ship or yacht should be the main goal of the experience.', who: 'Elena Cristofari', role: 'Interior Architect and Project Manager' },
  products: [{ p: 'platinum-marine', where: 'Six open deck areas', mount: 'Recessed in the ceiling – Platinum Electric Recess Kit', extra: [['Build', 'Sealed body, tinted ceramic glass, AISI 316 stainless steel']] }],
  notes: ['The case study states the heaters are certified by Lloyd’s Register; it does not name the six areas or give quantities. ' + QNOTE],
},

'cs-print-restaurant': {
  name: 'Print Restaurant', sector: 'Restaurant', country: 'USA', line: 'Open To The Hudson', pages: 2, dateText: 'January 2017',
  lede: 'Print serves seasonal, organic American food in an old print factory, with outdoor spaces exposed to New York’s weather. Tungsten Electric heaters throughout the outdoor and pool areas keep guests out with the view.',
  data: [['Location', 'New York, overlooking the Hudson River'], ['Setting', 'Restaurant in a former print factory – outdoor and pool areas'], ['Heaters', 'Tungsten Smart-Heat® Electric 6000 W'], ['Controls', 'To confirm'], ['Date', 'January 2017']],
  hero: { img: 'w-printrestaurant-tungstenelectric-02', pos: '50% 50%', caption: 'Tungsten Electric on the window frame, the skyline beyond. ' + BC },
  photos: [{ img: 'w-2014-01-29-17-10-54', caption: 'Over the river at sunset. ' + BC }, { img: 'w-tungsten-2', caption: BC }],
  beats: [
    ['The Space', 'Print occupies an old print factory and serves sustainable, seasonal and organic modern American food in an elegant setting. Its outdoor spaces look out over the Hudson River.'],
    ['The Challenge', 'The outdoor spaces take the full force of New York’s weather. The restaurant wanted guests to use them fully and enjoy the view.'],
    ['The Solution', 'Tungsten Smart-Heat Electric 6000 W heaters were installed throughout the outdoor and pool areas.']],
  products: [{ p: 'tungsten-electric', img: 'w-tungsten-3', where: 'Outdoor spaces and pool area', qty: '6000 W', mount: 'To confirm', extra: [['Finish', 'Black, as photographed']] }],
},

'cs-private-residence-connecticut': {
  name: 'Porch, Connecticut', sector: 'Residential', country: 'USA', line: 'New England, Past Summer', pages: 2, privateHome: true, dateText: 'September 2015',
  lede: 'The owner of a traditional Connecticut house wanted the outdoor spaces in use once the warm weather was over. White Tungsten Electric heaters, recessed into the porch ceiling, make it so.',
  data: [['Location', 'Connecticut'], ['Setting', 'Private home – covered porch'], ['Heaters', 'Tungsten Smart-Heat® Electric 6000 W, white, recessed'], ['Controls', 'Wireless Dimmer Controllers'], ['Date', 'September 2015']],
  hero: { img: 'w-connecticut-privateresidence-tungstenelectri', pos: '50% 50%', caption: 'Recessed heaters in the white porch ceiling. ' + BC },
  photos: [{ img: 'w-tungsten-electric-white-recessed', caption: 'Three white Tungsten Electric heaters in a beadboard ceiling. ' + BC }, { img: 'w-connecticut-private-res-tungsten-electric-1', caption: 'The dimmer controller enclosure. ' + BC }],
  beats: [
    ['The Space', 'An elegant, traditional residence in Connecticut, with outdoor spaces that its owner wanted to keep using in the New England climate.'],
    ['The Challenge', 'Once the warm weather was over, the outdoor spaces went unused. Extending their season was the priority.'],
    ['The Solution', 'White Tungsten Smart-Heat Electric 6000 W heaters were recessed into the outdoor ceilings with a flush mounting kit, run on Wireless Dimmer Controllers.']],
  products: [{ p: 'tungsten-electric', img: 'w-connecticut-privateresidence-tungstenelectri-2', where: 'Covered outdoor spaces', qty: '6000 W', mount: 'Recessed – Tungsten Electric Recess Kit; flush mounting kit', extra: [['Finish', 'White']], controls: 'Wireless Dimmer Controllers' }],
  notes: ['A private home: named by state only. The case study gives no heater quantities.'],
},

'cs-provenance': {
  name: 'Provenance', sector: 'Restaurant', country: 'USA', line: 'Garden To Terrace', pages: 1, dateText: 'September 2016',
  lede: 'Provenance cooks from its own 1,300 sq ft organic garden and serves it on an outdoor terrace. Platinum Gas heaters keep the terrace warm on cool Californian evenings and its tables in use all year.',
  data: [['Location', 'Newport Beach, California'], ['Setting', 'Restaurant terrace beside its kitchen garden'], ['Heaters', 'Platinum Smart-Heat® Gas'], ['Controls', 'To confirm'], ['Date', 'September 2016']],
  hero: { img: 'w-california-laprovenance-platinumgas-01', pos: '50% 50%', caption: 'Platinum Gas on the walls and beams of the timber pergola. ' + BC },
  beats: [
    ['The Space', 'A restaurant with a European bistro-style menu, Provenance sources from a 1,300 sq ft organic garden on site, the backdrop to its outdoor terrace.'],
    ['The Challenge', 'The terrace had to stay warm on cool Californian evenings, so the restaurant could offer more tables all year.'],
    ['The Solution', 'Platinum Smart-Heat Gas heaters keep the terrace warm. The case study gives no quantities or positions.']],
  products: [{ p: 'platinum-gas', where: 'Outdoor terrace', mount: 'To confirm' }],
},

'cs-smart-heating-aboard-the-most-technologically-advanced-cruis': {
  name: 'Silver Nova', sector: 'Marine', country: 'Cruise', line: 'Seventy Heaters, Out Of Sight', pages: 3, dateText: '2023',
  lede: 'Silversea’s Silver Nova was designed to bring guests closer to their destination. Seventy Platinum Electric Marine heaters, recessed or suspended, warm its main gathering spaces without drawing the eye from the view.',
  data: [['Vessel', 'Silver Nova, Silversea Cruises'], ['Setting', 'Outdoor gathering spaces and decks'], ['Heaters', 'Platinum Smart-Heat® Electric Marine (70)'], ['Controls', 'To confirm'], ['Date', '2023']],
  hero: { img: 'w-most-advanced-cruise-ship-built', pos: '50% 50%', caption: 'Platinum Electric Marine on the beam of a ship-top terrace. ' + BC },
  photos: [
    { img: 'w-web-bromic-heating-silversea-silver-nova-202-2', pos: '50% 50%', caption: 'A deck lounge under the glazed canopy. ' + BC },
    { img: 'w-web-bromic-heating-silversea-silver-nova-202-3', pos: '50% 50%', caption: 'White heaters flush in a promenade ceiling. ' + BC }],
  beats: [
    ['The Space', 'The twelfth ship in Silversea’s fleet carries up to 728 guests. Its asymmetrical, horizontal design links public areas in one continuous flow, and aft suites have 270° views.'],
    ['The Challenge', 'The Royal Caribbean Group’s designers wanted comfortable warmth in outdoor and gathering areas that stayed visually unobtrusive and supported year-round use.'],
    ['The Solution', 'Working with Bromic’s Daniel Bruntsch on a free 2D heat plan, the team placed 70 Platinum Smart-Heat Electric Marine heaters, with recess kits and mounting poles for flush and suspended installs. Meyer Werft installed them in Papenburg, Germany.']],
  zones: { title: 'Where The Warmth Goes On Board', shape: 'hull', note: 'Spaces shown together on one outline; drawn from the case study’s list, not from the ship’s plans.', items: [
    { l: 'A', name: 'SALT LAB', text: 'Dining.', w: 1 },
    { l: 'B', name: 'Shade House', text: 'Dining.', w: 1 },
    { l: 'C', name: 'Stargazing Deck', text: 'Open deck.', w: 1 },
    { l: 'D', name: 'The Marquee', text: 'Gathering space.', w: 1 }] },
  quote: { text: 'We worked with Daniel to place the heaters near where they would work best and be the most efficient.', who: 'Analise Bizzotto', role: 'Lead of Architectural Design, Newbuilding and Innovation, Royal Caribbean Group' },
  team: ['Installer: Meyer Werft, Papenburg'],
  products: [{ p: 'platinum-marine', img: 'w-web-bromic-heating-silversea-silver-nova-202-4', where: 'Main gathering spaces; decks 4, 5, 5 Crew and 10A–10C', qty: '70', mount: 'Recessed (Platinum Electric Recess Kit) and suspended (Platinum Electric Mounting Poles)', extra: [['Build', 'Sealed body, tinted ceramic glass, AISI 316 stainless steel']] }],
  notes: ['The case study does not say which mounting is used where, or how many heaters are in each space. ' + QNOTE],
},

'cs-talon-bar-brooklyn': {
  name: 'Talon Bar', sector: 'Bar', country: 'USA', line: 'A Backyard Kept Open', pages: 1,
  lede: 'Talon Bar’s lush backyard patio carried it through the pandemic, with Tungsten Electric heaters suspended from the ceiling over the guests.',
  data: [['Location', 'Brooklyn, New York'], ['Setting', 'Bar – backyard patio'], ['Heaters', 'Tungsten Smart-Heat® Electric'], ['Controls', 'To confirm']],
  hero: { img: 'w-dsc000111', pos: '50% 50%', caption: 'Tungsten Electric over the plant-filled courtyard. ' + BC },
  beats: [
    ['The Space', 'Talon is a bar in Brooklyn with a lush backyard patio.'],
    ['The Challenge', 'The case study says the patio, with its heaters, helped the bar through the COVID-19 pandemic; it does not set out the brief.'],
    ['The Solution', 'Tungsten Smart-Heat Electric heaters, suspended from the ceiling, warm the patio. The case study gives no quantities.']],
  products: [{ p: 'tungsten-electric', img: 'w-dsc00012', where: 'Backyard patio', mount: 'Suspended from the ceiling' }],
},

'cs-the-calile-hotel': {
  name: 'The Calile Hotel', sector: 'Hospitality', country: 'Australia', line: 'A Heater In Every Cabana', pages: 1, dateText: '2019',
  lede: 'Seven private cabanas line the pool deck of The Calile, Brisbane’s urban resort hotel on James Street. Each has its own power, a ceiling fan and an overhead Bromic heater that guests control from inside.',
  data: [['Location', 'James Street, Brisbane'], ['Setting', 'Urban resort hotel – seven pool-deck cabanas'], ['Heaters', 'Platinum Smart-Heat® Electric'], ['Controls', 'Guest-controlled in each cabana; control to confirm'], ['Date', '2019']],
  hero: { img: 'w-calilehero-2', pos: '50% 50%', caption: 'The pool deck and its cabanas. ' + BC },
  beats: [
    ['The Space', 'Developed by Michael and Cal Malouf, The Calile is a high-end urban resort designed around the guest experience, with seven private cabanas along its pool deck.'],
    ['The Challenge', 'Each cabana was to be a private, self-contained retreat, with comfort the guest can set for themselves.'],
    ['The Solution', 'Every cabana has private power, a USB charging point, a ceiling fan and an overhead Bromic heater, controlled by the guest from inside.']],
  products: [{ p: 'platinum-electric', where: 'Seven pool-deck cabanas, one each', mount: 'Overhead', controls: 'Guests control it from inside the cabana; the control is not named' }],
},

'cs-the-modern-heating-solution-for-vintage-upscale-dining': {
  name: 'Rare Society', sector: 'Restaurant', country: 'USA', line: 'Old World Arches, Modern Heat', pages: 2, dateText: '2023',
  lede: 'In San Clemente, a two-storey steakhouse wraps Spanish Colonial arches around Las Vegas glamour. Platinum Electric heaters in its semi-enclosed spaces keep the patios open through the winter, without breaking the look.',
  data: [['Location', 'Avenida Del Mar, San Clemente, California'], ['Setting', 'Two-storey restaurant – patios and bar'], ['Heaters', 'Platinum Smart-Heat® Electric'], ['Controls', 'Hardwired On/Off switches'], ['Date', '2023']],
  hero: { img: 'w-rare-society-platinum-electric-1', pos: '50% 50%', caption: 'Platinum Electric above the terrace doors under the timber-beamed roof. ' + BC },
  photos: [{ img: 'w-bromic-sep18th-9-1', caption: 'Heaters on mounting poles in the arched arcade. ' + BC }, { img: 'w-bromic-sep18th-3-1', caption: 'A balcony table. ' + BC }],
  beats: [
    ['The Space', 'The 5,500 sq ft, two-storey restaurant centres on wood-fired Santa Maria-style grilling, pairing black marble and tufted leather with wood beams, herringbone brick floors, rounded arches and a porch arcade.'],
    ['The Challenge', 'Trust Restaurant Group wanted to respect the Spanish Colonial architecture while opening the dining room to San Clemente’s climate, with areas usable by day and at night.'],
    ['The Solution', 'Platinum Smart-Heat Electric heaters were chosen for their sleek look and installed in the semi-enclosed spaces, on hardwired On/Off switches, so the patios stay in use through the winter.']],
  products: [{ p: 'platinum-electric', img: 'w-black-platinum-electric-close-up', where: 'Semi-enclosed spaces – downstairs patio, bar, upper patio', mount: 'To confirm', controls: 'Hardwired On/Off switches' }],
},

'cs-the-sheraton-carlsbad-resort-spa': {
  name: 'Sheraton Carlsbad Resort & Spa', sector: 'Hospitality', country: 'USA', line: 'Twelve Years On The Coast', pages: 2, dateText: 'October 2020',
  lede: 'On a 120-seat patio facing the Pacific, fifteen Platinum Gas heaters have warmed sunset dinners since 2008. When parts wore after twelve coastal years, Bromic replaced the components, not the heaters.',
  data: [['Location', 'Carlsbad, California'], ['Setting', 'Twenty/20 Grill & Wine Bar – 120-seat patio'], ['Heaters', 'Platinum Smart-Heat® Gas (15)'], ['Controls', 'To confirm'], ['Date', 'October 2020 (installed 2008)']],
  hero: { img: 'w-platinum-gas-sheraton-carlsbad-ca-usa', pos: '50% 50%', caption: 'Platinum Gas on drop poles behind the fire feature at night. ' + BC },
  photos: [{ img: 'w-20-twenty-westin-carlsbad-6-1024x576-1', caption: 'The dining terrace at dusk. ' + BC }, { img: 'w-26962413-10155347734127686-68414710268315124', caption: BC }],
  beats: [
    ['The Space', 'The 209-room resort’s Twenty/20 Grill & Wine Bar has an outdoor patio for 120 guests overlooking the Pacific, where diners come for the sunset.'],
    ['The Challenge', 'Coastal breezes make evenings chilly. After about twelve years on the coast, the heaters showed wear, and the hotel needed parts fast – without the time and cost of replacing every heater.'],
    ['The Solution', 'Fifteen Platinum Smart-Heat Gas heaters were installed in 2008. Their modular design meant only critical components – from inside the control module to the ignition wires and burners – had to be exchanged.']],
  quote: { text: 'Guests love to sit in this area especially during dinner to view the setting sun over the Pacific Ocean while dining.', who: 'Kent Bailey', role: 'Complex Director of Engineering, Sheraton Carlsbad Resort & Spa' },
  products: [{ p: 'platinum-gas', where: '120-seat outdoor patio', qty: '15', mount: 'To confirm', extra: [['Service', 'Modular: critical parts exchanged, heaters kept']] }],
  notes: ['The case study dates the page October 2020 and the installation 2008. ' + QNOTE],
},

'cs-the-w-hotel': {
  name: 'W Hotel, POV Terrace', sector: 'Hospitality', country: 'USA', line: 'Heat With A View', pages: 1,
  lede: 'At the W Hotel’s POV Terrace Bar in Washington, D.C., new Tungsten and Platinum Electric heaters drew questions from the tables about how they work and how good they look.',
  data: [['Location', 'Washington, D.C.'], ['Setting', 'Hotel rooftop terrace bar'], ['Heaters', 'Tungsten Smart-Heat® Electric · Platinum Smart-Heat® Electric'], ['Controls', 'To confirm']],
  hero: { img: 'w-pov-terrace-dome-bar5', pos: '50% 50%', caption: 'The terrace at night, a heater on the canopy edge. ' + BC },
  beats: [
    ['The Space', 'The POV Terrace Bar sits on top of the W Hotel in Washington, D.C., with tables under a canopy and the city beyond.'],
    ['The Challenge', 'The case study does not set out the brief: the bar wanted heaters that worked for the size of the space and looked right.'],
    ['The Solution', 'Tungsten Smart-Heat Electric and Platinum Smart-Heat Electric heaters were installed at the terrace bar. The case study gives no quantities or positions.']],
  quote: { text: 'We remember having a lot of tables ask and inquire about how efficient and cool they looked.', who: 'Scott Vollmer', role: 'Director of Bar Concepts' },
  products: [{ p: 'tungsten-electric', where: 'Terrace bar', mount: 'To confirm', extra: [['Finish', 'Black, as photographed']] }, { p: 'platinum-electric', where: 'Terrace bar', mount: 'To confirm' }],
  notes: ['The case study’s text calls the Platinum unit gas while its product list says Electric; the model is to confirm. ' + QNOTE],
},

'cs-tungsten-electric-heaters-at-clinica-las-condes': {
  name: 'Clínica Las Condes', sector: 'Healthcare', country: 'Chile', line: 'Terraces For Every Season', pages: 2, dateText: 'August 2023',
  lede: 'At a Santiago hospital, three restaurant terraces were too hot in summer and unusable in winter, with icy winds off the Andes. Thirty-two Tungsten Electric heaters, planned into new bioclimatic pergolas, keep them open all year for patients, visitors and staff.',
  data: [['Location', 'Santiago, Chile'], ['Setting', 'Hospital – three restaurant terraces'], ['Heaters', 'Tungsten Smart-Heat® Electric 6000 W (32)'], ['Controls', 'To confirm'], ['Date', 'August 2023']],
  hero: { img: 'portfolio:tungsten-electric', pos: '50% 50%', caption: 'Tungsten Smart-Heat® Electric – a product photograph, not this project. The case study carries no photographs of the terraces.' },
  beats: [
    ['The Space', 'Clínica Las Condes wanted comfortable outdoor areas for patients, visitors and staff. Its three restaurant terraces had only sunshades and lie open to cold winds from the Andes.'],
    ['The Challenge', 'The architect asked for a powerful electric heating solution, so the new outdoor spaces could be used all year, within the hospital’s guidelines for renewable electricity.'],
    ['The Solution', 'Bromic’s Daniel Bruntsch recommended Tungsten Smart-Heat Electric and chose the 6000 W model with the client. Thirty-two heaters were planned into new louvred bioclimatic pergolas, directing radiant heat over the seating.']],
  zones: { title: 'Three Terraces Under Pergolas', shape: 'plan', items: [
    { l: 'A', name: 'Restaurant terrace', text: 'Tungsten Electric under a bioclimatic pergola.', w: 1 },
    { l: 'B', name: 'Restaurant terrace', text: 'Tungsten Electric under a bioclimatic pergola.', w: 1 },
    { l: 'C', name: 'Restaurant terrace', text: 'Tungsten Electric under a bioclimatic pergola.', w: 1 }] },
  quote: { text: 'Undoubtedly, it was a success to use Bromic Heating in this project.', who: 'Eugenio Dominguez', role: 'General Manager, Comercial Dominguez' },
  products: [{ p: 'tungsten-electric', where: 'Three restaurant terraces', qty: '32 (6000 W model selected)', mount: 'Planned into louvred bioclimatic pergolas', extra: [['Power', 'Electric, within the hospital’s renewable-electricity guidelines']] }],
  notes: ['The case study gives 32 heaters across three terraces, not the number on each; the plan shows the terraces only. The speaker’s title is given in Spanish on the page (Gerente General). ' + QNOTE],
},

'cs-welcoming-guests-with-the-warmth-of-mexican-hospitality': {
  name: 'Centrico', sector: 'Restaurant', country: 'USA', line: 'Warm At Every Table', pages: 2,
  lede: 'Centrico, an open-air Mexican restaurant from Patina Restaurant Group and Michelin-starred chef Carlos Gaytán, wraps its tables around a central bar under a complex timber ceiling. Double-mounted Platinum Gas heaters keep every table warm.',
  data: [['Location', 'North Orange County, California'], ['Setting', 'Open-air restaurant around a central bar'], ['Heaters', 'Platinum Smart-Heat® Gas, natural gas, two sizes'], ['Controls', 'To confirm']],
  hero: { img: 'w-bromic-centrico-photos-2', pos: '50% 50%', caption: 'The bar under the circular timber pavilion, heaters on the beams. ' + BC },
  photos: [{ img: 'w-centrico-case-study', caption: 'The heat plan published with the case study. Bromic-published image.' }, { img: 'w-bromic-centrico-photos-29', caption: 'Platinum Gas angled on beam brackets. ' + BC }],
  beats: [
    ['The Space', 'With custom wooden elements and greenery by architect Jorge Gracia, Centrico is open and airy, built around a central bar with tables wrapping the space, for outdoor dining all year.'],
    ['The Challenge', 'The open-air design made a steady temperature hard to hold, and the ceiling was the main complexity: the heaters had to blend in, meet fire ratings per code and reach every table.'],
    ['The Solution', 'Ignisio Studios brought Bromic in for a design charrette. Platinum natural gas heaters in two sizes were ceiling-mounted with flexible mounting and double-mounted, so guests at every table are warm. Sister restaurant Paseo uses Platinum Gas too.']],
  quote: { text: 'Bromic provided the flexibility of how it was mounted into the ceiling.', who: 'Duc Tran', role: 'Principal, Ignisio Studios' },
  team: ['Architecture and engineering: Ignisio Studios', 'Design: Jorge Gracia'],
  products: [{ p: 'platinum-gas', img: 'w-bromic-centrico-photos-19', where: 'Throughout the restaurant, around the central bar', mount: 'Ceiling-mounted and double-mounted', extra: [['Gas', 'Natural gas, two sizes']], controls: 'To confirm – the case study does not name them' }],
  notes: ['The case study names the two sizes with a legacy numbering; current model names to confirm. ' + QNOTE],
},

// ---- not built, with the reason (kept here so the index lists them)
'cs-untied-rooftop-bar-barangaroo-sydney-unc': { skip: 'Unconfirmed: known from a search listing only; no page, products or photos.' },
'cs-barangaroo-house': { skip: 'Search listing only: bromic.com.au blocks reading; no facts beyond the product.' },
'cs-sunbury-bowling-club': { skip: 'Search listing only: no page, products or photos.' },
'cs-neumanns-restaurant': { skip: 'Too thin for a sheet: the page gives only the city and the product; no photographs, space or solution.' },
'cs-tonys-di-napoli': { skip: 'Too thin for a sheet: no space, solution or controls on the page, and the one photograph is captioned for another venue (Tony’s Bar, Brooklyn).' },
};

module.exports = Object.assign(C, require('./copy-web.js'));
