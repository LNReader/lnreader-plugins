import { styled } from '@mui/system';
import React, { useRef, useState } from 'react';

class TripleSwitchClasses {
  root = 'TripleSwitchRoot';
  base = 'TripleSwitchBase';
  track = 'TripleSwitchTrack';
  thumb = 'TripleSwitchThumb';
  input = 'TripleSwitchInput';
  checked: string;
  unchecked: string;
  neutral: string;
  offsets = {
    neutral: 18,
    checked: 18 * 2,
    unchecked: 0,
  };
  width = 16 * 4 + 10;
  constructor() {
    this.base;
    this.checked = `${this.base}-checked`;
    this.neutral = `${this.base}-neutral`;
    this.unchecked = `${this.base}-unchecked`;
  }
}

const classes = new TripleSwitchClasses();

const TripleSwitchRoot = styled(`span`, {
  name: classes.root,
  slot: 'root',
})(() => ({
  display: 'inline-flex',
  width: `${classes.width}px`,
  height: '38px',
  overflow: 'hidden',
  boxSizing: 'border-box',
  position: 'relative',
  flexShrink: 0,
  zIndex: 0,
  verticalAlign: 'middle',
  padding: '8px',
}));

const TripleSwitchTrack = styled(`span`, {
  name: classes.track,
  slot: 'track',
})(({ theme }) => ({
  // Android12 visuals:
  borderRadius: 22 / 2,
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    width: 16,
    height: 16,
    transform: 'translateY(-50%)',
  },
  '&::before': {
    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
      theme.palette.getContrastText(theme.palette.primary.main),
    )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
    right: 12,
  },
  '&::after': {
    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
      theme.palette.getContrastText(theme.palette.primary.main),
    )}" d="M19,13H5V11H19V13Z" /></svg>')`,
    left: 12,
  },
  // base Track
  width: '100%',
  height: '100%',
  zIndex: -1,
  content: `''`,
  transition:
    'opacity 150ms cubic-bezier(0.4,0,0.2,1) 0ms, background-color 150ms cubic-bezier(0.4,0,0.2,1) 0ms',
  backgroundColor: '#000',
  opacity: 0.38,
}));

const TripleSwitchBase = styled(`span`, {
  name: classes.base,
  slot: 'base',
})(({ theme }) => ({
  [`&.${classes.unchecked}`]: {
    transform: `translateX(${classes.offsets.unchecked}px)`,
    color: '#f33',
  },
  [`&.${classes.checked}`]: {
    transform: `translateX(${classes.offsets.checked}px)`,
    color: theme.palette.primary.main,
  },
  [`&.${classes.neutral}`]: {
    transform: `translateX(${classes.offsets.neutral}px)`,
    color: 'gray',
  },

  [`&.${classes.checked} + span`]: {
    opacity: 0.5,
    backgroundColor: theme.palette.primary.main,
  },
  [`&.${classes.unchecked} + span`]: {
    opacity: 0.5,
    backgroundColor: '#f33',
  },
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent',
  outline: 0,
  border: 0,
  margin: 0,
  cursor: 'pointer',
  userSelect: 'none',
  textDecoration: 'none',
  padding: '9px',
  borderRadius: '50%',
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 1,
  color: '#fff',
  transition:
    'left 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;',
}));

const TripleSwitchInput = styled(`input`, {
  name: classes.input,
  slot: 'input',
})(() => ({
  left: '-100%',
  width: '300%',
  cursor: 'inherit',
  position: 'absolute',
  opacity: 0,
  height: '100%',
  top: 0,
  margin: 0,
  padding: 0,
  zIndex: 1,
}));

const TripleSwitchThumb = styled(`span`, {
  name: classes.thumb,
  slot: 'thumb',
})(() => ({
  boxShadow: 'none',
  width: '16px',
  height: '16px',
  margin: '2px',
  backgroundColor: 'currentColor',
  borderRadius: '50%',
}));
type TripleSwitchState = 'checked' | 'unchecked' | 'neutral';

export const TripleSwitch = function ({
  value,
  onChange,
}: {
  value?: TripleSwitchState;
  onChange?: (newValue: TripleSwitchState) => void;
}) {
  const [state, sSt] = useState<TripleSwitchState>(value ?? 'neutral');
  const setState = (v: TripleSwitchState) => {
    onChange?.(v);
    sSt(value ?? v);
  };

  const root = useRef<HTMLSpanElement>(null);
  return (
    <>
      <TripleSwitchRoot
        data-state={state}
        ref={root}
        onClick={e => {
          const offsetX =
            e.clientX - (root.current?.getBoundingClientRect().x ?? 0);

          const inputWidth = parseFloat(
            getComputedStyle(e.currentTarget).width,
          );
          const clickPercentage = offsetX / inputWidth;
          const sidePressed =
            clickPercentage < 0.33
              ? 'left'
              : clickPercentage > 0.66
                ? 'right'
                : 'center';

          console.log(inputWidth, offsetX);

          switch (sidePressed) {
            case 'center':
              return setState('neutral');
            case 'left':
              return setState('unchecked');
            case 'right':
              return setState('checked');
          }
        }}
      >
        <TripleSwitchBase className={classes[value ?? state]}>
          <TripleSwitchInput />
          <TripleSwitchThumb />
        </TripleSwitchBase>
        <TripleSwitchTrack />
      </TripleSwitchRoot>
    </>
  );
};
