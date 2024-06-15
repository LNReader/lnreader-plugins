import { TextField } from '@mui/material';
import React, { useState } from 'react';
import AccordionContainer from '../components/AccordionContainer';
export default function PopularNovels() {
  const [loading, setLoading] = useState(true);
  return (
    <AccordionContainer title="Popular Novels" loading={loading}>
      <TextField />
    </AccordionContainer>
  );
}
