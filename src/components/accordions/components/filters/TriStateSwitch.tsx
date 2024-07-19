import { styled } from '@mui/system';
import React, { useRef, useState } from 'react';

class TriStateSwitchClasses {
  root = 'TriStateSwitchRoot';
  base = 'TriStateSwitchBase';
  track = 'TriStateSwitchTrack';
  thumb = 'TriStateSwitchThumb';
  input = 'TriStateSwitchInput';
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

const classes = new TriStateSwitchClasses();

const TriStateSwitchRoot = styled(`span`, {
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

const TriStateSwitchTrack = styled(`span`, {
  name: classes.track,
  slot: 'track',
})(() => ({
  // Android12 visuals:
  borderRadius: 22 / 2,
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

const TriStateSwitchBase = styled(`span`, {
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

const TriStateSwitchInput = styled(`input`, {
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

const TriStateSwitchThumb = styled(`span`, {
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
type TriStateSwitchState = 'checked' | 'unchecked' | 'neutral';

export const TriStateSwitch = function ({
  value,
  onChange,
}: {
  value?: TriStateSwitchState;
  onChange?: (newValue: TriStateSwitchState) => void;
}) {
  const [state, sSt] = useState<TriStateSwitchState>(value ?? 'neutral');
  const setState = (v: TriStateSwitchState) => {
    onChange?.(v);
    sSt(value ?? v);
  };

  const root = useRef<HTMLSpanElement>(null);
  return (
    <>
      <TriStateSwitchRoot
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
        <TriStateSwitchBase className={classes[value ?? state]}>
          <TriStateSwitchInput />
          <TriStateSwitchThumb />
        </TriStateSwitchBase>
        <TriStateSwitchTrack />
      </TriStateSwitchRoot>
    </>
  );
};
