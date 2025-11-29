export function getArcPath(
  cx: number,
  cy: number,
  r1: number,
  r2: number,
  startAngle: number,
  endAngle: number
) {
  const rad = Math.PI / 180;
  const x1 = cx + r1 * Math.cos(startAngle * rad);
  const y1 = cy + r1 * Math.sin(startAngle * rad);
  const x2 = cx + r1 * Math.cos(endAngle * rad);
  const y2 = cy + r1 * Math.sin(endAngle * rad);
  const x3 = cx + r2 * Math.cos(endAngle * rad);
  const y3 = cy + r2 * Math.sin(endAngle * rad);
  const x4 = cx + r2 * Math.cos(startAngle * rad);
  const y4 = cy + r2 * Math.sin(startAngle * rad);

  return `M${x1},${y1} A${r1},${r1} 0 0 1 ${x2},${y2} L${x3},${y3} A${r2},${r2} 0 0 0 ${x4},${y4} Z`;
}