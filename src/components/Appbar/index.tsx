import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import {
  Avatar,
  Backdrop,
  FormControl,
  InputAdornment,
  Link,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { searchPlugins } from '@provider/plugins';
import { Plugin } from '@typings/plugin';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { useAppStore } from '@store';

const resovleIcon = (iconPath: string) => {
  return '/static/' + iconPath;
};

function renderPlugin(setListVisible: (v: boolean) => void) {
  return function (props: ListChildComponentProps<Plugin.PluginBase[]>) {
    const { index, style, data } = props;
    const plugin = data[index];
    const { selectPlugin, pluginItem } = useAppStore(state => state);

    return (
      <ListItem style={style} key={index} component="div" disablePadding>
        <ListItemButton
          selected={plugin.id === pluginItem?.id}
          onClick={() => {
            selectPlugin({
              id: plugin.id,
              name: plugin.name,
              version: plugin.version,
              icon: plugin.icon,
              site: plugin.site,
            });
            setListVisible(false);
          }}
        >
          <ListItemAvatar>
            <Avatar variant="square" src={resovleIcon(plugin.icon)} />
          </ListItemAvatar>
          <ListItemText primary={plugin.name} />
        </ListItemButton>
      </ListItem>
    );
  };
}

export default function Appbar() {
  const [searchedPlugins, setSearchPlugins] = useState<Plugin.PluginBase[]>([]);
  const [keyword, setKeyword] = useState('');
  const [listVisible, setListVisible] = useState(false);

  const plugin = useAppStore(state => state.plugin);

  useEffect(() => {
    const plugins = searchPlugins(keyword);
    setSearchPlugins(plugins);
  }, [keyword]);

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" color="inherit" elevation={0}>
        <Toolbar>
          <FormControl
            sx={{
              display: 'block',
              position: 'relative',
              zIndex: 10,
              width: {
                xs: '80%',
                md: '40%',
              },
            }}
          >
            <TextField
              size="small"
              variant="outlined"
              placeholder="Seach plugin"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              fullWidth
              autoComplete="off"
              onFocus={() => {
                setListVisible(true);
                if (searchedPlugins.length === 0)
                  setSearchPlugins(searchPlugins(keyword));
              }}
            />
            {listVisible ? (
              <FixedSizeList
                height={400}
                width={'100%'}
                itemData={searchedPlugins}
                itemSize={46}
                itemCount={searchedPlugins.length}
                overscanCount={5}
                style={{
                  position: 'absolute',
                  boxShadow: '2px 10px 20px rgba(0, 0, 0, 0.2)',
                  backgroundColor: 'white',
                }}
              >
                {renderPlugin(setListVisible)}
              </FixedSizeList>
            ) : null}
          </FormControl>
          <Backdrop
            open={listVisible}
            onClick={() => setListVisible(false)}
            sx={{ zIndex: 9 }}
            invisible={true}
          />
          {plugin ? (
            <Link
              sx={{
                pl: 2,
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
              }}
              href={plugin.site}
              target="_blank"
            >
              <Avatar
                sx={{ mr: 1 }}
                src={resovleIcon(plugin.icon)}
                variant="square"
              />
              <Typography
                sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}
              >
                {plugin.name} - v{plugin.version}
              </Typography>
            </Link>
          ) : null}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
