import { Box, Button, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import AccordionContainer from '../components/AccordionContainer';
import Textarea from '@components/Textarea';
import { useAppStore } from '@store';
export default function ParseChapter() {
  const plugin = useAppStore(state => state.plugin);
  const [loading, setLoading] = useState(false);
  const [chapterPath, setchapterPath] = useState('');
  const [chapterText, setChapterText] = useState('');
  const fetchChapter = () => {
    if (plugin) {
      setLoading(true);
      plugin
        .parseChapter(chapterPath)
        .then(res => setChapterText(res))
        .finally(() => setLoading(false));
    }
  };
  return (
    <AccordionContainer title="Parse Chapter" loading={loading}>
      <Stack direction={'row'} spacing={2}>
        <TextField
          value={chapterPath}
          onChange={e => setchapterPath(e.target.value)}
          size="small"
          label="Chapter path"
        />
        <Button
          disabled={plugin === undefined}
          onClick={fetchChapter}
          variant="contained"
        >
          Fetch
        </Button>
      </Stack>
      <Box sx={{ height: 10 }} />
      {chapterText ? (
        <Textarea
          style={{
            width: '100%',
          }}
          maxRows={20}
          disabled
          value={chapterText}
        />
      ) : null}
    </AccordionContainer>
  );
}
