/** Bandera emoji a partir del código ISO 3166-1 alpha-2. */
export const banderaEmoji = iso =>
  iso
    .toUpperCase()
    .replace(/./g, letra =>
      String.fromCodePoint(0x1f1e6 - 65 + letra.charCodeAt(0))
    )

/**
 * Indicativo: prefijo con el que se identifica al país en el aire.
 * Series: bloques de letras que emiten las estaciones de ese país
 * (clases de licencia, especiales o asignaciones ITU).
 */
export const PAISES_INDICATIVOS = [
  {
    pais: 'Chile',
    iso: 'CL',
    indicativo: 'CE',
    series: ['CD', 'CA', 'CE', 'XQ'],
    nota: 'CD aspirante, CA novicio, CE general, XQ superior. También 3G.'
  },
  {
    pais: 'Argentina',
    iso: 'AR',
    indicativo: 'LU',
    series: ['LU', 'LW', 'AY', 'AZ', 'L2–L9']
  },
  {
    pais: 'Bolivia',
    iso: 'BO',
    indicativo: 'CP',
    series: ['CP']
  },
  {
    pais: 'Brasil',
    iso: 'BR',
    indicativo: 'PY',
    series: ['PP–PY', 'PU', 'ZV–ZZ'],
    nota: 'PU suele ser clase C; PY y vecinos, A/B.'
  },
  {
    pais: 'Colombia',
    iso: 'CO',
    indicativo: 'HK',
    series: ['HJ', 'HK', '5J', '5K']
  },
  {
    pais: 'Ecuador',
    iso: 'EC',
    indicativo: 'HC',
    series: ['HC', 'HD']
  },
  {
    pais: 'Paraguay',
    iso: 'PY',
    indicativo: 'ZP',
    series: ['ZP']
  },
  {
    pais: 'Perú',
    iso: 'PE',
    indicativo: 'OA',
    series: ['OA', 'OB', 'OC']
  },
  {
    pais: 'Uruguay',
    iso: 'UY',
    indicativo: 'CX',
    series: ['CV', 'CW', 'CX']
  },
  {
    pais: 'Venezuela',
    iso: 'VE',
    indicativo: 'YV',
    series: ['YV', 'YW', 'YY', '4M']
  },
  {
    pais: 'Guyana',
    iso: 'GY',
    indicativo: '8R',
    series: ['8R']
  },
  {
    pais: 'Surinam',
    iso: 'SR',
    indicativo: 'PZ',
    series: ['PZ']
  },
  {
    pais: 'México',
    iso: 'MX',
    indicativo: 'XE',
    series: ['XE', 'XF', '6D', '4A']
  },
  {
    pais: 'Estados Unidos',
    iso: 'US',
    indicativo: 'K',
    series: ['K', 'N', 'W', 'AA–AL']
  },
  {
    pais: 'Canadá',
    iso: 'CA',
    indicativo: 'VE',
    series: ['VE', 'VA', 'VO', 'VY']
  },
  {
    pais: 'Cuba',
    iso: 'CU',
    indicativo: 'CM',
    series: ['CL', 'CM', 'CO', 'T4']
  },
  {
    pais: 'Costa Rica',
    iso: 'CR',
    indicativo: 'TI',
    series: ['TI', 'TE']
  },
  {
    pais: 'Panamá',
    iso: 'PA',
    indicativo: 'HP',
    series: ['HO', 'HP']
  },
  {
    pais: 'Guatemala',
    iso: 'GT',
    indicativo: 'TG',
    series: ['TD', 'TG']
  },
  {
    pais: 'Honduras',
    iso: 'HN',
    indicativo: 'HR',
    series: ['HQ', 'HR']
  },
  {
    pais: 'El Salvador',
    iso: 'SV',
    indicativo: 'YS',
    series: ['YS', 'HU']
  },
  {
    pais: 'Nicaragua',
    iso: 'NI',
    indicativo: 'YN',
    series: ['YN', 'HT']
  },
  {
    pais: 'República Dominicana',
    iso: 'DO',
    indicativo: 'HI',
    series: ['HI']
  },
  {
    pais: 'Haití',
    iso: 'HT',
    indicativo: 'HH',
    series: ['HH']
  },
  {
    pais: 'Jamaica',
    iso: 'JM',
    indicativo: '6Y',
    series: ['6Y']
  },
  {
    pais: 'Trinidad y Tobago',
    iso: 'TT',
    indicativo: '9Y',
    series: ['9Y', '9Z']
  },
  {
    pais: 'España',
    iso: 'ES',
    indicativo: 'EA',
    series: ['EA', 'EB', 'EC', 'ED', 'EE', 'EF', 'EG', 'EH']
  },
  {
    pais: 'Portugal',
    iso: 'PT',
    indicativo: 'CT',
    series: ['CR', 'CS', 'CT']
  },
  {
    pais: 'Francia',
    iso: 'FR',
    indicativo: 'F',
    series: ['F', 'TM']
  },
  {
    pais: 'Reino Unido',
    iso: 'GB',
    indicativo: 'G',
    series: ['G', 'M', '2E', 'GD', 'GI', 'GJ', 'GM', 'GU', 'GW']
  },
  {
    pais: 'Alemania',
    iso: 'DE',
    indicativo: 'DL',
    series: ['DA–DR', 'DL', 'DJ', 'DK']
  },
  {
    pais: 'Italia',
    iso: 'IT',
    indicativo: 'I',
    series: ['I', 'IK', 'IZ', 'IW', 'IU']
  },
  {
    pais: 'Países Bajos',
    iso: 'NL',
    indicativo: 'PA',
    series: ['PA', 'PB', 'PC', 'PD', 'PE', 'PF', 'PG', 'PH', 'PI']
  },
  {
    pais: 'Bélgica',
    iso: 'BE',
    indicativo: 'ON',
    series: ['ON', 'OO', 'OP', 'OQ', 'OR', 'OS', 'OT']
  },
  {
    pais: 'Suiza',
    iso: 'CH',
    indicativo: 'HB',
    series: ['HB', 'HE']
  },
  {
    pais: 'Austria',
    iso: 'AT',
    indicativo: 'OE',
    series: ['OE']
  },
  {
    pais: 'Suecia',
    iso: 'SE',
    indicativo: 'SM',
    series: ['SA–SM', '7S', '8S']
  },
  {
    pais: 'Noruega',
    iso: 'NO',
    indicativo: 'LA',
    series: ['LA', 'LB', 'LC', 'LN']
  },
  {
    pais: 'Dinamarca',
    iso: 'DK',
    indicativo: 'OZ',
    series: ['OU', 'OV', 'OW', 'OX', 'OY', 'OZ']
  },
  {
    pais: 'Finlandia',
    iso: 'FI',
    indicativo: 'OH',
    series: ['OF', 'OG', 'OH', 'OI']
  },
  {
    pais: 'Polonia',
    iso: 'PL',
    indicativo: 'SP',
    series: ['SN', 'SO', 'SP', 'SQ', '3Z']
  },
  {
    pais: 'República Checa',
    iso: 'CZ',
    indicativo: 'OK',
    series: ['OK', 'OL']
  },
  {
    pais: 'Hungría',
    iso: 'HU',
    indicativo: 'HA',
    series: ['HA', 'HG']
  },
  {
    pais: 'Rumania',
    iso: 'RO',
    indicativo: 'YO',
    series: ['YO', 'YP', 'YQ', 'YR']
  },
  {
    pais: 'Grecia',
    iso: 'GR',
    indicativo: 'SV',
    series: ['SV', 'SW', 'SX', 'J4']
  },
  {
    pais: 'Turquía',
    iso: 'TR',
    indicativo: 'TA',
    series: ['TA', 'TB', 'TC', 'YM']
  },
  {
    pais: 'Rusia',
    iso: 'RU',
    indicativo: 'UA',
    series: ['R', 'UA–UI']
  },
  {
    pais: 'Ucrania',
    iso: 'UA',
    indicativo: 'UR',
    series: ['UR–UZ', 'EM–EO']
  },
  {
    pais: 'Japón',
    iso: 'JP',
    indicativo: 'JA',
    series: ['JA–JS', '7J–7N']
  },
  {
    pais: 'China',
    iso: 'CN',
    indicativo: 'BY',
    series: ['B', 'BA–BL', 'BY']
  },
  {
    pais: 'Corea del Sur',
    iso: 'KR',
    indicativo: 'HL',
    series: ['HL', 'DS', '6K']
  },
  {
    pais: 'India',
    iso: 'IN',
    indicativo: 'VU',
    series: ['VU', 'AT']
  },
  {
    pais: 'Indonesia',
    iso: 'ID',
    indicativo: 'YB',
    series: ['YB–YH', '7A–7I', '8A–8I']
  },
  {
    pais: 'Tailandia',
    iso: 'TH',
    indicativo: 'HS',
    series: ['HS', 'E2']
  },
  {
    pais: 'Filipinas',
    iso: 'PH',
    indicativo: 'DU',
    series: ['DU', 'DW', 'DX', '4D–4I']
  },
  {
    pais: 'Vietnam',
    iso: 'VN',
    indicativo: 'XV',
    series: ['XV', '3W']
  },
  {
    pais: 'Australia',
    iso: 'AU',
    indicativo: 'VK',
    series: ['VK', 'AX']
  },
  {
    pais: 'Nueva Zelanda',
    iso: 'NZ',
    indicativo: 'ZL',
    series: ['ZL', 'ZM']
  },
  {
    pais: 'Sudáfrica',
    iso: 'ZA',
    indicativo: 'ZS',
    series: ['ZS', 'ZR', 'ZU']
  },
  {
    pais: 'Egipto',
    iso: 'EG',
    indicativo: 'SU',
    series: ['SU', '6A']
  },
  {
    pais: 'Marruecos',
    iso: 'MA',
    indicativo: 'CN',
    series: ['CN', '5C']
  },
  {
    pais: 'Argelia',
    iso: 'DZ',
    indicativo: '7X',
    series: ['7R', '7T–7Y']
  },
  {
    pais: 'Túnez',
    iso: 'TN',
    indicativo: '3V',
    series: ['3V', 'TS']
  },
  {
    pais: 'Kenia',
    iso: 'KE',
    indicativo: '5Z',
    series: ['5Y', '5Z']
  },
  {
    pais: 'Israel',
    iso: 'IL',
    indicativo: '4X',
    series: ['4X', '4Z']
  },
  {
    pais: 'Arabia Saudita',
    iso: 'SA',
    indicativo: 'HZ',
    series: ['HZ', '7Z', '8Z']
  },
  {
    pais: 'Emiratos Árabes Unidos',
    iso: 'AE',
    indicativo: 'A6',
    series: ['A6']
  },
  {
    pais: 'Irán',
    iso: 'IR',
    indicativo: 'EP',
    series: ['EP', 'EQ']
  },
  {
    pais: 'Pakistán',
    iso: 'PK',
    indicativo: 'AP',
    series: ['AP', '6P']
  },
  {
    pais: 'Bangladés',
    iso: 'BD',
    indicativo: 'S2',
    series: ['S2', 'S3']
  },
  {
    pais: 'Malasia',
    iso: 'MY',
    indicativo: '9M',
    series: ['9M', '9W']
  },
  {
    pais: 'Singapur',
    iso: 'SG',
    indicativo: '9V',
    series: ['9V', 'S6']
  },
  {
    pais: 'Taiwán',
    iso: 'TW',
    indicativo: 'BV',
    series: ['BM–BQ', 'BU–BX']
  },
  {
    pais: 'Hong Kong',
    iso: 'HK',
    indicativo: 'VR',
    series: ['VR']
  },
  {
    pais: 'Irlanda',
    iso: 'IE',
    indicativo: 'EI',
    series: ['EI', 'EJ']
  },
  {
    pais: 'Islandia',
    iso: 'IS',
    indicativo: 'TF',
    series: ['TF']
  },
  {
    pais: 'Luxemburgo',
    iso: 'LU',
    indicativo: 'LX',
    series: ['LX']
  },
  {
    pais: 'Mónaco',
    iso: 'MC',
    indicativo: '3A',
    series: ['3A']
  },
  {
    pais: 'Andorra',
    iso: 'AD',
    indicativo: 'C3',
    series: ['C3']
  },
  {
    pais: 'Croacia',
    iso: 'HR',
    indicativo: '9A',
    series: ['9A']
  },
  {
    pais: 'Eslovenia',
    iso: 'SI',
    indicativo: 'S5',
    series: ['S5']
  },
  {
    pais: 'Serbia',
    iso: 'RS',
    indicativo: 'YU',
    series: ['YT', 'YU']
  },
  {
    pais: 'Bulgaria',
    iso: 'BG',
    indicativo: 'LZ',
    series: ['LZ']
  },
  {
    pais: 'Eslovaquia',
    iso: 'SK',
    indicativo: 'OM',
    series: ['OM']
  },
  {
    pais: 'Lituania',
    iso: 'LT',
    indicativo: 'LY',
    series: ['LY']
  },
  {
    pais: 'Letonia',
    iso: 'LV',
    indicativo: 'YL',
    series: ['YL']
  },
  {
    pais: 'Estonia',
    iso: 'EE',
    indicativo: 'ES',
    series: ['ES']
  },
  {
    pais: 'Bielorrusia',
    iso: 'BY',
    indicativo: 'EU',
    series: ['EU', 'EV', 'EW']
  },
  {
    pais: 'Kazajistán',
    iso: 'KZ',
    indicativo: 'UN',
    series: ['UN', 'UO', 'UP', 'UQ']
  },
  {
    pais: 'Mongolia',
    iso: 'MN',
    indicativo: 'JT',
    series: ['JT', 'JU', 'JV']
  },
  {
    pais: 'Nepal',
    iso: 'NP',
    indicativo: '9N',
    series: ['9N']
  },
  {
    pais: 'Sri Lanka',
    iso: 'LK',
    indicativo: '4S',
    series: ['4P–4S']
  },
  {
    pais: 'Nigeria',
    iso: 'NG',
    indicativo: '5N',
    series: ['5N']
  },
  {
    pais: 'Ghana',
    iso: 'GH',
    indicativo: '9G',
    series: ['9G']
  },
  {
    pais: 'Senegal',
    iso: 'SN',
    indicativo: '6W',
    series: ['6V', '6W']
  },
  {
    pais: 'Costa de Marfil',
    iso: 'CI',
    indicativo: 'TU',
    series: ['TU']
  },
  {
    pais: 'Camerún',
    iso: 'CM',
    indicativo: 'TJ',
    series: ['TJ']
  },
  {
    pais: 'Congo (RDC)',
    iso: 'CD',
    indicativo: '9Q',
    series: ['9O–9T']
  },
  {
    pais: 'Angola',
    iso: 'AO',
    indicativo: 'D2',
    series: ['D2', 'D3']
  },
  {
    pais: 'Mozambique',
    iso: 'MZ',
    indicativo: 'C9',
    series: ['C8', 'C9']
  },
  {
    pais: 'Namibia',
    iso: 'NA',
    indicativo: 'V5',
    series: ['V5']
  },
  {
    pais: 'Botsuana',
    iso: 'BW',
    indicativo: 'A2',
    series: ['A2']
  },
  {
    pais: 'Zimbabue',
    iso: 'ZW',
    indicativo: 'Z2',
    series: ['Z2']
  },
  {
    pais: 'Madagascar',
    iso: 'MG',
    indicativo: '5R',
    series: ['5R', '6X']
  },
  {
    pais: 'Mauricio',
    iso: 'MU',
    indicativo: '3B',
    series: ['3B']
  }
]
