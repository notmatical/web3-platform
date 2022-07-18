// material ui
import { useTheme } from '@mui/material/styles';
import { CardMedia, FormControlLabel, Grid, PaletteMode, Radio, RadioGroup, Stack, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import useConfig from 'hooks/useConfig';

// assets
import defaultLayout from 'assets/images/customization/default.svg';
import darkLayout from 'assets/images/customization/dark.svg';

const ThemeModeLayout = () => {
    const theme = useTheme();

    const { mode, onChangeMode } = useConfig();

    const handleModeChange = (event: any) => {
        onChangeMode(event.target.value as PaletteMode);
    };

    // onChange={(e) => onChangeMode(e.target.value as PaletteMode)}

    return (
        <RadioGroup row aria-label="theme-mode" name="theme-mode" value={mode} onChange={handleModeChange}>
            <Grid container spacing={1.75} sx={{ ml: 0 }}>
                <Grid item>
                    <FormControlLabel
                        control={<Radio value="light" sx={{ display: 'none' }} />}
                        sx={{ display: 'flex', '& .MuiFormControlLabel-label': { flex: 1 } }}
                        label={
                            <MainCard
                                content={false}
                                sx={{ bgcolor: mode === 'light' ? 'primary.lighter' : 'secondary.lighter', p: 1 }}
                                border={false}
                                {...(mode === 'light' && { boxShadow: true, shadow: theme.customShadows.primaryTest })}
                            >
                                <Stack spacing={1.25} alignItems="center">
                                    <CardMedia
                                        component="img"
                                        src={defaultLayout}
                                        alt="Mode"
                                        sx={{ borderRadius: 1, width: 64, height: 64 }}
                                    />
                                    <Typography variant="caption">Light</Typography>
                                </Stack>
                            </MainCard>
                        }
                    />
                </Grid>
                <Grid item>
                    <FormControlLabel
                        control={<Radio value="dark" sx={{ display: 'none' }} />}
                        sx={{ display: 'flex', '& .MuiFormControlLabel-label': { flex: 1 } }}
                        label={
                            <MainCard
                                content={false}
                                sx={{ bgcolor: mode === 'dark' ? 'primary.lighter' : 'secondary.lighter', p: 1 }}
                                border={false}
                                {...(mode === 'dark' && { boxShadow: true, shadow: theme.customShadows.primaryTest })}
                            >
                                <Stack spacing={1.25} alignItems="center">
                                    <CardMedia
                                        component="img"
                                        src={darkLayout}
                                        alt="vert"
                                        sx={{ borderRadius: 1, width: 64, height: 64 }}
                                    />
                                    <Typography variant="caption">Dark</Typography>
                                </Stack>
                            </MainCard>
                        }
                    />
                </Grid>
            </Grid>
        </RadioGroup>
    );
};

export default ThemeModeLayout;
