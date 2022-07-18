import { useEffect, useState, ReactElement } from 'react';

// redux
import { useDispatch, useSelector } from 'store';
import { getSpaces, addSpace } from 'store/slices/spaces';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Grid, TextField, MenuItem, Stack, Box, InputAdornment, OutlinedInput, Button, Typography } from '@mui/material';

// project imports
import { abbreviateValue } from 'utils/utils';
import { gridSpacing } from 'store/constant';
import SpacesPlaceholder from 'components/cards/Skeleton/SpacesPlaceholder';
import SpaceCard from './SpaceCard';

// assets
import { IconSearch } from '@tabler/icons';
import { shouldForwardProp } from '@mui/system';
import { FormikValues } from 'formik';

// graphql
import { useQuery, useMutation } from '@apollo/client';
import { mutations, queries } from '../../graphql/graphql';

// styles
const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(({ theme }) => ({
    width: 434,
    marginLeft: 16,
    paddingLeft: 16,
    paddingRight: 16,
    '& input': {
        background: 'transparent !important',
        paddingLeft: '4px !important'
    },
    [theme.breakpoints.down('lg')]: {
        width: 250
    },
    [theme.breakpoints.down('md')]: {
        width: '100%',
        marginLeft: 4,
        background: theme.palette.mode === 'dark' ? theme.palette.dark[800] : '#fff'
    }
}));

// data
const status = [
    {
        value: 'all',
        label: 'All'
    },
    {
        value: 'partnered',
        label: 'Partnered'
    }
];

const Spaces = () => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const { data, loading, error } = useQuery(queries.GET_SPACES, { fetchPolicy: 'cache-and-network' });
    const [AddSpace] = useMutation(mutations.ADD_SPACE);

    const [value, setValue] = useState('all');
    const [search, setSearch] = useState('');

    let spaces: ReactElement | ReactElement[] = <></>;
    if (data && data.spaces && data.spaces.length > 0) {
        spaces = data.spaces.map((space: any, index: any) => (
            <Grid key={index} item xs={4} md={3} lg={3}>
                <SpaceCard space={space} />
            </Grid>
        ));
    } else {
        spaces = (
            <Grid container sx={{ mt: 5, mb: 5 }}>
                <Grid item xs={12}>
                    <Box sx={{ maxWidth: 720, m: '0 auto', textAlign: 'center' }}>
                        <Grid container justifyContent="center" spacing={2}>
                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="h1" color="inherit" component="div">
                                            There are no spaces at this time.
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <OutlineInputStyle
                            id="input-search-header"
                            value={search}
                            onChange={(e) => console.log('test', e)}
                            placeholder="Search"
                            startAdornment={
                                <InputAdornment position="start">
                                    <IconSearch stroke={5} size="1rem" color={theme.palette.grey[500]} />
                                </InputAdornment>
                            }
                            sx={{ width: 250 }}
                            aria-describedby="search-helper-text"
                            inputProps={{ 'aria-label': 'weight' }}
                        />

                        <TextField
                            id="standard-select-type"
                            select
                            value={value}
                            size="medium"
                            sx={{ width: 150, textAlign: 'left', ml: 2 }}
                            onChange={(e) => setValue(e.target.value)}
                        >
                            {status.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    <Typography variant="h4" color="primary" sx={{ lineHeight: '24px', display: 'block', mr: 2 }}>
                        {data && abbreviateValue(data.spaces.length)} space(s)
                    </Typography>
                </Stack>
            </Grid>

            {loading
                ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
                      <Grid key={item} item xs={12} sm={6} md={4} lg={3}>
                          <SpacesPlaceholder />
                      </Grid>
                  ))
                : spaces}

            <Grid item xs={12}>
                <Button
                    disableElevation
                    color="secondary"
                    variant="outlined"
                    sx={{
                        borderRadius: '23px',
                        width: '100%'
                    }}
                >
                    Load More
                </Button>
            </Grid>
        </Grid>
    );
};

export default Spaces;
