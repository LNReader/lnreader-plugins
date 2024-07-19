import { styled } from '@mui/system';
import React, { useRef, useState } from 'react';

class TriStateCheckboxClasses {
  root = 'TriStateCheckboxRoot';
  base = 'TriStateCheckboxBase';
  input = 'TriStateCheckboxInput';
  svg = 'TriStateCheckboxSVG';
  checked: string;
  unchecked: string;
  neutral: string;
  offsets = {
    neutral: 16,
    checked: 16 * 2,
    unchecked: 0,
  };
  constructor() {
    this.checked = `${this.base}-checked`;
    this.neutral = `${this.base}-neutral`;
    this.unchecked = `${this.base}-unchecked`;
  }
}

const classes = new TriStateCheckboxClasses();

const TriStateCheckboxRoot = styled(`span`, {
  name: classes.root,
  slot: 'root',
})(({ theme }) => ({
  [`&.${classes.checked}`]: {
    color: theme.palette.primary.main,
  },
  [`&.${classes.unchecked}`]: {
    color: 'red',
  },
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  boxSizing: 'border-box',
  outline: 0,
  border: 0,
  margin: 0,
  cursor: 'pointer',
  userSelect: 'none',
  textDecoration: 'none',
  borderRadius: '50%',
  padding: '9px',
}));

const TriStateCheckboxInput = styled(`input`, {
  name: classes.input,
  slot: 'input',
})(() => ({
  cursor: 'inherit',
  position: 'absolute',
  opacity: 0,
  height: '100%',
  width: '100%',
  top: 0,
  left: 0,
  margin: 0,
  padding: 0,
  zIndex: 1,
}));

const TriStateCheckboxSVG = styled(`svg`, { name: classes.svg, slot: 'image' })(
  () => ({
    userSelect: 'none',
    width: '1em',
    height: '1em',
    display: 'inline-block',
    fill: 'currentcolor',
    flexShrink: 0,
    fontSize: '1.5rem',
    transition: 'fill 200ms cubic-bezier(0.4,0,0.2,1) 0ms',
  }),
);

const emptyPath = (
  <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
);

const checkmarkPath = (
  <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
);

const uncheckedPath = (
  <path
    d={`M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zM8 6l4 4l4-4l2 2l-4 4l4,4l-2 2l-4-4l-4 4l-2-2l4-4l-4-4z`}
  ></path>
);

export type TriStateCheckboxState = 'checked' | 'unchecked' | 'neutral';

export const TriStateCheckbox = function ({
  value,
  onChange,
}: {
  value?: TriStateCheckboxState;
  onChange?: (newValue: TriStateCheckboxState) => void;
}) {
  const [state, sSt] = useState<TriStateCheckboxState>(value ?? 'neutral');
  const setState = (v: TriStateCheckboxState) => {
    onChange?.(v);
    sSt(value ?? v);
  };
  const root = useRef<HTMLSpanElement>(null);

  const curVal = value ?? state;

  return (
    <>
      <TriStateCheckboxRoot
        className={classes[curVal]}
        data-state={curVal}
        ref={root}
        onClick={() => {
          switch (curVal) {
            case 'checked':
              return setState('unchecked');
            case 'neutral':
              return setState('checked');
            case 'unchecked':
              return setState('neutral');
          }
        }}
      >
        <TriStateCheckboxInput />
        <TriStateCheckboxSVG>
          {curVal === 'checked'
            ? checkmarkPath
            : curVal === 'unchecked'
              ? uncheckedPath
              : emptyPath}
        </TriStateCheckboxSVG>
      </TriStateCheckboxRoot>
    </>
  );
};
