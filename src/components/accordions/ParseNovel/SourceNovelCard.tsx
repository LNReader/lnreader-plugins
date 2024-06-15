import React, { ReactNode } from 'react';
import { Plugin } from '@typings/plugin';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  ListItem,
  Paper,
  Stack,
  styled,
  TextareaAutosize,
  Tooltip,
  Typography,
} from '@mui/material';
import CopiableItem from '@components/CopiableItem';
import PathItem from '@components/PathItem';

const FlexRow = ({ children }: { children: ReactNode }) => (
  <Stack direction="row" gap={1} sx={{ alignItems: 'center' }}>
    {children}
  </Stack>
);

export default function SourceNovelCard({
  sourceNovel,
}: {
  sourceNovel: Plugin.SourceNovel;
}) {
  const blue = {
    100: '#DAECFF',
    200: '#b6daff',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    900: '#003A75',
  };

  const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
  };

  const Textarea = styled(TextareaAutosize)(
    ({ theme }) => `
    box-sizing: border-box;
    width: 320px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `,
  );
  return (
    <Card sx={{ display: 'flex', p: 1, width: '100%', textAlign: 'left' }}>
      <CopiableItem content={sourceNovel.cover}>
        <Tooltip title={sourceNovel.cover}>
          <CardMedia
            component="img"
            sx={{ width: 200, height: '100%' }}
            image={sourceNovel.cover}
          />
        </Tooltip>
      </CopiableItem>
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <CardContent>
          <Tooltip title={sourceNovel.name}>
            <Box>
              <CopiableItem content={sourceNovel.name}>
                <Button variant="outlined">
                  <Typography
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: '5',
                      WebkitBoxOrient: 'vertical',
                      fontSize: 14,
                    }}
                  >
                    {sourceNovel.name}
                  </Typography>
                </Button>
              </CopiableItem>
            </Box>
          </Tooltip>
        </CardContent>
        <CardContent>
          <FlexRow>
            <Typography sx={{ width: 50 }}>Status:</Typography>
            <Chip variant="outlined" label={sourceNovel.status} color="info" />
          </FlexRow>
          <FlexRow>
            <Typography sx={{ width: 50 }}>Author:</Typography>
            <Chip variant="outlined" label={sourceNovel.author} color="info" />
          </FlexRow>
          <FlexRow>
            <Typography sx={{ width: 50 }}>Artist: </Typography>
            <Chip variant="outlined" label={sourceNovel.artist} color="info" />
          </FlexRow>
        </CardContent>
        <CardContent sx={{ width: '50%' }}>
          <PathItem path={sourceNovel.path} />
        </CardContent>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent>
          <Typography>Genres</Typography>
          <Box
            sx={{
              width: 600,
              overflowX: 'auto',
            }}
          >
            <Stack sx={{ width: 'max-content' }} direction={'row'}>
              {sourceNovel.genres?.split(/,\s*/).map((genre, index) => (
                <ListItem key={'genre_' + index}>
                  <Chip label={genre} />
                </ListItem>
              ))}
            </Stack>
          </Box>
        </CardContent>
        <CardContent>
          <Typography>Summary</Typography>
          <Textarea
            sx={{ width: '100%' }}
            maxRows={5}
            defaultValue={sourceNovel.summary}
            disabled
          />
        </CardContent>
      </Box>
    </Card>
  );
}
