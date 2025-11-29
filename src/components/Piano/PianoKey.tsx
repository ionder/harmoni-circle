import type { FC } from 'react';

interface PianoKeyProps {
  label: string;
  isActive: boolean;
  isBlack: boolean;
}

export const PianoKey: FC<PianoKeyProps> = ({ label, isActive, isBlack }) => {
  const classes = [
    'piano-key',
    isBlack ? 'black' : 'white',
    isActive ? 'active' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{label}</div>;
};