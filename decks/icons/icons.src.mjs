// The Bromic icon set, drawn by hand on a 48 grid (content inside 2..46).
// ink: 2 px strokes in #231F20. glow: the ONE flame #EF4123 element of each icon.
export const INK = '#231F20';
export const FLAME = '#EF4123';
const g3 = (d) => `<path stroke="${FLAME}" stroke-width="3" d="${d}"/>`;
const g2 = (d) => `<path stroke="${FLAME}" stroke-width="2" d="${d}"/>`;
const c = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;
const gc = (cx, cy, r, w = 2) => `<circle stroke="${FLAME}" stroke-width="${w}" cx="${cx}" cy="${cy}" r="${r}"/>`;

const I = (group) => (name, label, ink, glow) => ({ name, label, group, ink, glow });
const heaters = I('Heaters'), heat = I('Heat'), mount = I('Mounting'), ctl = I('Controls'),
  pw = I('Power and weather'), sp = I('Spaces'), ppl = I('People and work'), as = I('Assurance');

export const ICONS = [
  // Heaters
  heaters('heater-tungsten', 'Tungsten', ['M4 17H44V27H4Z', 'M9 17V27', 'M39 17V27'], g3('M13 22H35')),
  heaters('heater-platinum', 'Platinum', ['M8 14H40V36H8Z', 'M18 8V14', 'M30 8V14'], g2('M13 20H35M13 25H35M13 30H35')),
  heaters('heater-eclipse', 'Eclipse', ['M24 3V11', c(24, 27, 16), c(24, 27, 3)], gc(24, 27, 10, 3)),
  heaters('heater-freestanding', 'Freestanding', ['M10 8H38V16H10Z', 'M24 16V43', 'M14 43H34'], g3('M14 12H34')),
  heaters('heater-gas', 'Gas Heater', ['M6 12H42V34H6Z', 'M14 12V5', 'M34 12V5', 'M42 23H45'], g2('M24 16L29 21V26L26 29H22L19 26V21Z')),

  // Heat
  heat('radiant-heat', 'Radiant Heat', ['M8 6H40V12H8Z'], g2('M16 18V36M24 18V42M32 18V36')),
  heat('coverage-area', 'Coverage Area', ['M4 12V4H12', 'M36 4H44V12', 'M44 36V44H36', 'M12 44H4V36', 'M13 20H35V28H13Z'], g3('M17 24H31')),
  heat('mount-height', 'Mount Height', ['M4 9H28V15H4Z', 'M4 44H44'], g2('M38 9V44M34 13L38 9L42 13M34 40L38 44L42 40')),
  heat('clearance', 'Clearance', ['M4 8H44', 'M10 3L6 7', 'M20 3L16 7', 'M30 3L26 7', 'M40 3L36 7', 'M8 26H40V34H8Z'], g2('M24 11V23M20 15L24 11L28 15M20 19L24 23L28 19')),
  heat('fan-ventilated', 'Fan-Ventilated', ['M6 16H42V36H6Z', c(15, 26, 5), c(33, 26, 5), 'M13 24L17 28M17 24L13 28', 'M31 24L35 28M35 24L31 28'], g2('M15 13V4M11 8L15 4L19 8M33 13V4M29 8L33 4L37 8')),

  // Mounting
  mount('mount-ceiling', 'Ceiling Mount', ['M4 10H44', 'M10 5L6 9', 'M22 5L18 9', 'M34 5L30 9', 'M44 5L42 7', 'M16 10V16', 'M32 10V16', 'M8 16H40V24H8Z'], g3('M12 20H36')),
  mount('mount-wall', 'Wall Mount', ['M8 4V44', 'M3 9L7 5', 'M3 21L7 17', 'M3 33L7 29', 'M3 44L7 40', 'M8 15H15', 'M18 13L34 29L29 34L13 18Z'], g3('M19 19L28 28')),
  mount('mount-pole', 'Pole Mount', ['M10 4V44', 'M4 44H16', 'M10 14H18', 'M18 10H44V18H18Z'], g3('M22 14H40')),
  mount('mount-pitched', 'Pitched Ceiling', ['M6 28L30 4H44', 'M22 12V30', 'M8 30H36V38H8Z'], g3('M12 34H32')),
  mount('recess-kit', 'Recess Kit', ['M4 26H10V10H38V26H44', 'M13 18H35V26H13Z', 'M4 34H44'], g3('M17 22H31')),
  mount('single-post', 'Single Post', ['M4 6H44', 'M18 10H30', 'M24 10V22', 'M6 22H42V30H6Z'], g3('M10 26H38')),
  mount('hidden-wiring', 'Hidden Wiring', ['M4 6H44', 'M20 6V24', 'M28 6V24', 'M6 24H42V32H6Z'], `<path stroke="${FLAME}" stroke-width="2" stroke-dasharray="3 3" d="M24 7V27"/>`),

  // Controls
  ctl('controller-onoff', 'On/Off Control', ['M12 4H36V44H12Z', 'M18.3 20.3A8 8 0 1 0 29.7 20.3'], g3('M24 14V25')),
  ctl('controller-dimmer', 'Dimmer', ['M12 4H36V44H12Z', 'M24 10V16', 'M18 19H30V25H18Z'], g3('M24 29V38')),
  ctl('app', 'App', ['<rect x="13" y="3" width="22" height="42" rx="4"/>', 'M21 39H27', 'M24 15V21'], g3('M18.3 16.8A8 8 0 1 0 29.7 16.8')),
  ctl('wall-switch', 'Wall Switch', ['M10 6H38V42H10Z', 'M17 12H31V36H17Z', 'M17 24H31'], g3('M24 15V21')),
  ctl('voice', 'Voice', ['M4 18H10L18 10V38L10 30H4Z'], g2('M24 18L30 24L24 30M31 11L44 24L31 37')),
  ctl('schedule', 'Schedule', ['M6 9H42V43H6Z', 'M6 18H42', 'M15 5V12', 'M33 5V12', 'M12 26H18', 'M21 26H27', 'M12 35H18', 'M21 35H27', 'M30 35H36'], g2('M30 23H36V29H30Z')),
  ctl('zones', 'Zones', ['M5 8H43V40H5Z', 'M21 8V40', 'M21 24H43'], g3('M26 16H38')),
  ctl('timer', 'Timer', ['M20 4H28', 'M24 4V10', c(24, 27, 16), 'M24 27V19', 'M38 11L41 8'], g3('M24 15A12 12 0 0 1 36 27')),

  // Power and weather
  pw('electric', 'Electric', ['M12 20H36V32H12Z', 'M24 32V44'], g3('M18 9V18M30 9V18')),
  pw('gas', 'Gas', ['M4 40H44', 'M24 40V34', 'M19 34H29'], g2('M24 6L32 14V23L28 27H20L16 23V14Z')),
  pw('circuit', 'Dedicated Circuit', ['M4 6H18V42H4Z', 'M8 13H14', 'M8 20H14', 'M8 34H14', 'M26 32H44V38H26Z'], g2('M8 27H35V32')),
  pw('water-rating', 'Water Rating', ['M24 4L31 11A9.9 9.9 0 1 1 17 11Z', 'M6 33H42V41H6Z'], g3('M10 37H38')),
  pw('coastal', 'Coastal', ['M4 32L9 27L14 32L19 27L24 32L29 27L34 32L39 27L44 32', 'M4 42L9 37L14 42L19 37L24 42L29 37L34 42L39 37L44 42', 'M8 6H40V14H8Z'], g3('M12 10H36')),
  pw('wind', 'Wind', ['M8 6H40V14H8Z', 'M4 24H34L38 20', 'M4 32H42', 'M4 40H28L32 44'], g3('M12 10H36')),
  pw('cold', 'Cold', ['M24 4V44', 'M6 14L42 34', 'M6 34L42 14', 'M19 7L24 12L29 7', 'M19 41L24 36L29 41'], g3('M20 24H28')),
  pw('evening', 'Evening', ['M4 34H44', 'M10 42H38', 'M24 6V12', 'M9 19L13 23', 'M39 19L35 23', 'M4 27H6', 'M42 27H44'], g3('M14 34A10 10 0 0 1 34 34')),
  pw('all-seasons', 'All Seasons', ['M24 4V44', 'M6 14L18 21', 'M6 34L18 27', 'M8 24H18', 'M38 9L36 11', 'M38 39L36 37', 'M44 24H41', 'M31 4V7', 'M31 41V44'], g3('M24 15A9 9 0 0 1 24 33')),

  // Spaces
  sp('pergola', 'Pergola', ['M4 14H44', 'M8 10L12 6', 'M17 10L21 6', 'M26 10L30 6', 'M35 10L39 6', 'M8 14V44', 'M40 14V44'], g3('M16 20H32')),
  sp('covered-patio', 'Covered Patio', ['M8 4V44', 'M8 10H44V16H8', 'M40 16V44', 'M4 44H44'], g3('M18 21H34')),
  sp('open-terrace', 'Open Terrace', ['M4 42H44', 'M4 28H26', 'M8 28V42', 'M15 28V42', 'M22 28V42', 'M36 14V42', 'M30 42H42'], g3('M30 10H42')),
  sp('rooftop', 'Rooftop', ['M4 28H44', 'M8 28V44', 'M40 28V44', 'M14 28V16', 'M26 28V12H33V28', 'M33 18H40V28'], g3('M8 13H20')),
  sp('restaurant', 'Restaurant', ['M4 6H44', 'M14 6V10', 'M34 6V10', 'M5 30H21', 'M13 30V44', 'M27 30H43', 'M35 30V44'], g3('M12 13H36')),
  sp('hotel', 'Hotel', ['M8 44V5H40V44', 'M14 13H20', 'M28 13H34', 'M14 21H20', 'M28 21H34', 'M14 30H34', 'M20 44V38H28V44', 'M4 44H44'], g3('M18 33H30')),
  sp('home', 'Home', ['M5 23L24 4L43 23', 'M10 18V44H38V18', 'M20 44V34H28V44'], g3('M16 26H32')),
  sp('dining', 'Dining', ['M14 26H34', 'M18 26V42', 'M30 26V42', 'M5 18V42', 'M5 32H10V42', 'M43 18V42', 'M43 32H38V42'], g3('M14 10H34')),
  sp('lounge', 'Lounge', ['M6 26V40H42V26', 'M11 30V20H37V30', 'M6 30H42', 'M9 40V44', 'M39 40V44'], g3('M14 10H34')),
  sp('pool', 'Pool', ['M16 34V16L20 12', 'M28 34V16L32 12', 'M16 22H28', 'M16 29H28', 'M4 38L8 34L12 38L16 34', 'M28 34L32 38L36 34L40 38L44 34', 'M4 44L8 40L12 44L16 40L20 44L24 40L28 44L32 40L36 44L40 40L44 44'], g3('M10 5H38')),

  // People and work
  ppl('architect', 'Architect', ['M22 6H26', 'M24 6V9', c(24, 11, 2), 'M23 13L13 37', 'M25 13L35 37'], g3('M13 37A26 26 0 0 0 35 37')),
  ppl('builder', 'Builder', ['M4 32H44', 'M8 32A16 16 0 0 1 40 32', 'M8 32V37H40V32'], g3('M24 20V28')),
  ppl('installer', 'Installer', [c(35, 13, 6), 'M31 17L10 38', 'M8 12L12 8L21 17L17 21Z'], g3('M21 21L37 37')),
  ppl('dealer', 'Dealer', ['M4 18L8 10H40L44 18Z', 'M7 18V44', 'M41 18V44', 'M4 44H44', 'M12 25H24V36H12Z', 'M30 44V25H37V44'], g3('M13 14H35')),
  ppl('customer', 'Customer', ['M4 6H30V22H14L8 28V22H4Z', 'M18 26H44V40H40V44L36 40H18Z', 'M24 33H38'], g3('M10 14H24')),
  ppl('quote', 'Quote', ['M10 4H38V42L34 38L30 42L26 38L22 42L18 38L14 42L10 38Z', 'M16 12H32', 'M16 18H28'], g3('M16 29H32')),
  ppl('measure', 'Measure', ['M4 12H24V34H4Z', c(14, 23, 5), 'M44 26V35', 'M30 25V28', 'M36 25V28'], g3('M24 31H42')),
  ppl('plan', 'Plan', ['M8 4H31L40 13V44H8Z', 'M31 4V13H40', 'M13 19H35V38H13Z', 'M24 19V29'], g3('M27 24H32')),

  // Assurance
  as('warranty', 'Warranty', ['M8 8L24 4L40 8V26L24 42L8 26Z'], g3('M16 22L22 28L32 17')),
  as('safety', 'Safety', ['M24 12L4 40H44Z'], g3('M24 21V29M24 34V35')),
  as('certified', 'Certified', ['M12 12H36V36H12Z', 'M24 7L41 24L24 41L7 24Z'], gc(24, 24, 6, 3)),
  as('check', 'Knowledge Check', ['M6 7H14V15H6Z', 'M6 20H14V28H6Z', 'M6 33H14V41H6Z', 'M20 11H42', 'M20 24H42', 'M20 37H36'], g3('M8 24L11 27L17 20')),
  as('exercise', 'Exercise', ['M6 4H30V40', 'M6 4V44H22', 'M12 12H24', 'M12 18H24', 'M12 24H18', 'M28 32L38 22L42 26L32 36Z'], g3('M28 32L26 38L32 36')),
  as('idea', 'Idea', ['M17 34V30A12 12 0 1 1 31 30V34Z', 'M18 39H30', 'M21 44H27'], g2('M20 20L24 24L28 20M24 24V33')),
  as('finishes', 'Finishes', ['M14 26H6V6H26V14', 'M22 34H14V14H34V22'], g2('M22 22H42V42H22Z')),
  as('design-style', 'Design Style', ['M18 6H30V13H18Z', 'M18 13L13 27L24 44L35 27L30 13', c(24, 24, 2)], g2('M24 27V40')),
];
