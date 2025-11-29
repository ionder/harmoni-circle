import type { FC } from 'react';
import { getArcPath } from './circleUtils';
import type { CircleSlice } from '../../data/chords/chordDefinitions';

interface SliceProps {
  data: CircleSlice;
  index: number;
  isSelected: boolean;
  isDiatonic: boolean;
  onClick: () => void;
}

export const Slice: FC<SliceProps> = ({
  data,
  index,
  isSelected,
  isDiatonic,
  onClick,
}) => {
  // 12 dilim → her biri 30°
  const startAngle = index * 30;
  const endAngle = (index + 1) * 30;
  const midAngleDeg = (startAngle + endAngle) / 2;
  const midAngleRad = midAngleDeg * (Math.PI / 180);

  // Dış halka path’i
  const d = getArcPath(200, 200, 120, 200, startAngle, endAngle);

  // Renk mantığı
  const baseFill = isDiatonic ? data.color : '#181818';
  const fill = baseFill;
  const stroke = isSelected ? '#ffffff' : '#000000';
  const strokeWidth = isSelected ? 3 : 1;

  // Majör ve minör yazı konumları
  const majorRadius = 160;
  const minorRadius = 130;

  const majorX = 200 + Math.cos(midAngleRad) * majorRadius;
  const majorY = 200 + Math.sin(midAngleRad) * majorRadius;

  const minorX = 200 + Math.cos(midAngleRad) * minorRadius;
  const minorY = 200 + Math.sin(midAngleRad) * minorRadius;

  // Key signature yazısı için biraz dışarı (staff yerine text)
  const ksRadius = 215;
  const ksX = 200 + Math.cos(midAngleRad) * ksRadius;
  const ksY = 200 + Math.sin(midAngleRad) * ksRadius;

  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      {/* Dilim */}
      <path d={d} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />

      {/* Majör (dış yazı, büyük) */}
      <text
        x={majorX}
        y={majorY}
        fill="#ffffff"
        dominantBaseline="middle"
        textAnchor="middle"
        style={{ fontSize: '16px', fontWeight: 600 }}
      >
        {data.major}
      </text>

      {/* Relative minör (iç yazı, küçük) */}
      <text
        x={minorX}
        y={minorY}
        fill="#f0f0f0"
        dominantBaseline="middle"
        textAnchor="middle"
        style={{ fontSize: '11px', opacity: 0.9 }}
      >
        {data.minor}
      </text>

      {/* Key signature (dış kenar) */}
      <text
        x={ksX}
        y={ksY}
        fill="#bbbbbb"
        dominantBaseline="middle"
        textAnchor="middle"
        style={{ fontSize: '9px', opacity: 0.85 }}
      >
        {data.keySignature}
      </text>
    </g>
  );
};