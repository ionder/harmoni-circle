// src/engine/theory/makamProgressionEngine.ts
import { buildModeScale, type ModeName, isMakamMode } from './modeEngine';

export interface MakamTemplate {
  id: string;
  label: string;
  description: string;
  // scale index'leri (0–6)
  degrees: number[];
}

export interface MakamModulation {
  id: string;
  label: string;
  description: string;
  from: ModeName;
  to: ModeName;
  // from makamı içinde yürüyüş dereceleri
  degrees: number[];
}

// Derece → scale notası
export function realizeMakamPattern(
  keyRoot: string,
  mode: ModeName,
  degrees: number[],
): string[] {
  const scale = buildModeScale(keyRoot, mode);
  if (scale.length === 0) return [keyRoot];

  return degrees.map((deg) => {
    const idx = ((deg % scale.length) + scale.length) % scale.length;
    return scale[idx];
  });
}

// Makam bazlı seyir template'leri
export function getMakamTemplatesForMode(mode: ModeName): MakamTemplate[] {
  if (!isMakamMode(mode)) return [];

  switch (mode) {
    case 'makam_hicaz':
      return [
        {
          id: 'hicaz_karar',
          label: 'Hicaz Karar Yürüyüşü',
          description: 'Karar – Güçlü – Yeden – Karar (klasik Hicaz hissi).',
          degrees: [0, 4, 6, 0], // Karar (1), Güçlü (5), Yeden (7), Karar
        },
        {
          id: 'hicaz_duygusal',
          label: 'Hicaz Duygusal Iniș',
          description: 'Karar üstünden Yeden’e tırmanıp tekrar karara iniş.',
          degrees: [0, 4, 6, 4, 0],
        },
      ];
    case 'makam_ussak':
      return [
        {
          id: 'ussak_karar',
          label: 'Uşşak Karar Seyri',
          description: 'Karar – Güçlü – Karar, sade Uşşak yürüyüşü.',
          degrees: [0, 3, 0, 3, 0],
        },
        {
          id: 'ussak_uzanma',
          label: 'Uşşak Genişleme',
          description: 'Karar – Güçlü – üst derece – tekrar karar.',
          degrees: [0, 3, 5, 3, 0],
        },
      ];
    case 'makam_huseyni':
      return [
        {
          id: 'huseyni_karar',
          label: 'Hüseynî Basit Seyir',
          description: 'Karar – Güçlü – Karar, şarkı formu girişine uygun.',
          degrees: [0, 4, 0, 4, 0],
        },
        {
          id: 'huseyni_yaygin',
          label: 'Hüseynî Yaygın Seyir',
          description: 'Karar – üst derece – Güçlü – Karar.',
          degrees: [0, 2, 4, 2, 0],
        },
      ];
    case 'makam_kurdi':
      return [
        {
          id: 'kurdi_karar',
          label: 'Kürdi Karar Seyri',
          description: 'Karar – Güçlü – Karar, melankolik hissiyat.',
          degrees: [0, 3, 0, 3, 0],
        },
        {
          id: 'kurdi_cikis',
          label: 'Kürdi Çıkış',
          description: 'Karar – üst derece – Güçlü – Yeden – Karar.',
          degrees: [0, 2, 3, 6, 0],
        },
      ];
    default:
      return [];
  }
}

// Makamlar arası geçki önerileri (from makamı içinde yürüyüş)
export function getMakamModulationsForMode(mode: ModeName): MakamModulation[] {
  if (!isMakamMode(mode)) return [];

  switch (mode) {
    case 'makam_hicaz':
      return [
        {
          id: 'hicaz_to_huseyni',
          label: 'Hicaz → Hüseynî',
          description:
            'Hicaz kararından güçlüye çıkıp Hüseynî’ye oturan bir kadans hazırlığı. Hedef makamı panelden manuel olarak Hüseynî seçebilirsin.',
          from: 'makam_hicaz',
          to: 'makam_huseyni',
          degrees: [0, 4, 2, 0],
        },
        {
          id: 'hicaz_to_ussak',
          label: 'Hicaz → Uşşak',
          description:
            'Karardan güçlüyü vurgulayıp, alt dereceye inişle Uşşak karakterine bağlanan yürüyüş.',
          from: 'makam_hicaz',
          to: 'makam_ussak',
          degrees: [0, 4, 3, 0],
        },
      ];
    case 'makam_ussak':
      return [
        {
          id: 'ussak_to_huseyni',
          label: 'Uşşak → Hüseynî',
          description:
            'Uşşak kararından başlayıp Hüseynî’nin güçlü derecesine hazırlayan yumuşak geçiş.',
          from: 'makam_ussak',
          to: 'makam_huseyni',
          degrees: [0, 3, 4, 0],
        },
      ];
    case 'makam_kurdi':
      return [
        {
          id: 'kurdi_to_hicaz',
          label: 'Kürdi → Hicaz',
          description:
            'Kürdi kararından, üst derecelerle Hicaz karakterine yaklaşan kısa geçki.',
          from: 'makam_kurdi',
          to: 'makam_hicaz',
          degrees: [0, 2, 3, 0],
        },
      ];
    case 'makam_huseyni':
      return [
        {
          id: 'huseyni_to_hicaz',
          label: 'Hüseynî → Hicaz',
          description:
            'Hüseynî kararından güçlüye tırmanıp Hicaz rengine açılan köprü yürüyüş.',
          from: 'makam_huseyni',
          to: 'makam_hicaz',
          degrees: [0, 4, 6, 0],
        },
      ];
    default:
      return [];
  }
}