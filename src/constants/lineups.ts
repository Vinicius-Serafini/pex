export const POSITIONS = {
  GOLEIRO: {
    GOL: 'Goleiro'
  },
  DEFESA: {
    'LAT-E': 'Lateral Esquerdo',
    'LAT-D': 'Lateral Direito',
    'ZAG-E': 'Zagueiro Esquerdo',
    'ZAG-D': 'Zagueiro Direito',
    LIB: 'Líbero',
  },
  MEIO_CAMPO: {
    'ALA-E': 'Ala Esquerdo',
    'ALA-D': 'Ala Direito',
    'VOL-E': 'Volante Esquerdo',
    'VOL-D': 'Volante Direito',
    'VOL': 'Volante',
    'MLA-E': 'Meia Lateral Esquerdo',
    'MLA-D': 'Meia Lateral Direito',
    'MEC': 'Meio Campo',
    'MEC-E': 'Meio Campo Esquerdo',
    'MEC-D': 'Meio Campo Direito',
    'MEA-E': 'Meia Atacante Esquerdo',
    'MEA-D': 'Meia Atacante Esquerdo',
    'MCA': 'Meio Campo Armador',
    'MCA-D': 'Meio Campo Armador Direito',
    'MCA-E': 'Meio Campo Armador Esquerdo',
  },
  ATAQUE: {
    'PON-E': 'Ponta Esqueda',
    'PON-D': 'Ponta Direita',
    'ATC': 'Atacante',
    'ATC-E': 'Atacante Esquerdo',
    'ATC-D': 'Atacante Direito'
  }
}

export const LINEUP = [
  [
    { position: 'PON-E', first: {}, substitutes: [] },
    { position: 'ATC-E', first: {}, substitutes: [] },
    { position: 'ATC', first: {}, substitutes: [] },
    { position: 'ATC-D', first: {}, substitutes: [] },
    { position: 'PON-D', first: {}, substitutes: [] },
  ],
  [
    { position: 'MEA-E', first: {}, substitutes: [] },
    { position: 'MCA-E', first: {}, substitutes: [] },
    { position: 'MCA', first: {}, substitutes: [] },
    { position: 'MCA-D', first: {}, substitutes: [] },
    { position: 'MEA-D', first: {}, substitutes: [] },
  ],
  [
    { position: 'MLA-E', first: {}, substitutes: [] },
    { position: 'MEC-E', first: {}, substitutes: [] },
    { position: 'MEC', first: {}, substitutes: [] },
    { position: 'MEC-D', first: {}, substitutes: [] },
    { position: 'MLA-D', first: {}, substitutes: [] },
  ],
  [
    { position: 'ALA-E', first: {}, substitutes: [] },
    { position: 'VOL-E', first: {}, substitutes: [] },
    { position: 'VOL', first: {}, substitutes: [] },
    { position: 'VOL-D', first: {}, substitutes: [] },
    { position: 'ALA-D', first: {}, substitutes: [] },
  ],
  [
    { position: 'LAT-E', first: {}, substitutes: [] },
    { position: 'ZAG-E', first: {}, substitutes: [] },
    { position: 'LIB', first: {}, substitutes: [] },
    { position: 'ZAG-D', first: {}, substitutes: [] },
    { position: 'LAT-D', first: {}, substitutes: [] },
  ],
  [
    null,
    null,
    { position: 'GOL', first: {}, substitutes: [] },
    null,
    null
  ],
]