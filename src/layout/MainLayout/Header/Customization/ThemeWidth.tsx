import { useTheme } from '@mui/material/styles';
import { CardMedia, FormControlLabel, Grid, Radio, RadioGroup, Stack, Typography } from '@mui/material';

// project
import MainCard from 'components/MainCard';
import useConfig from 'hooks/useConfig';

// assets
import defaultLayout from 'assets/images/customization/default.svg';
import containerLayout from 'assets/images/customization/container.svg';

const ThemeWidth = () => {
    const theme = useTheme();

    const { container, onChangeContainer } = useConfig();

    return (
        <RadioGroup row aria-label="theme-width" name="theme-width" value={container} onChange={onChangeContainer}>
            <Grid container spacing={1.75} sx={{ ml: 0 }}>
                <Grid item>
                    <FormControlLabel
                        control={<Radio value="fluid" sx={{ display: 'none' }} />}
                        sx={{ display: 'flex', '& .MuiFormControlLabel-label': { flex: 1 } }}
                        label={
                            <MainCard
                                content={false}
                                sx={{ bgcolor: !container ? 'primary.lighter' : 'secondary.lighter', p: 1 }}
                                border={false}
                                boxShadow
                                {...(!container && { boxShadow: true, shadow: theme.customShadows.primaryTest })}
                            >
                                <Stack spacing={1.25} alignItems="center">
                                    <CardMedia
                                        component="img"
                                        src={defaultLayout}
                                        alt="Width"
                                        sx={{ borderRadius: 1, width: 64, height: 64 }}
                                    />
                                    <Typography variant="caption">Fluid</Typography>
                                </Stack>
                            </MainCard>
                        }
                    />
                </Grid>
                <Grid item>
                    <FormControlLabel
                        control={<Radio value="fluid" sx={{ display: 'none' }} />}
                        sx={{ display: 'flex', '& .MuiFormControlLabel-label': { flex: 1 } }}
                        label={
                            <MainCard
                                content={false}
                                sx={{ bgcolor: container ? 'primary.lighter' : 'secondary.lighter', p: 1 }}
                                border={false}
                                boxShadow
                                {...(container && { boxShadow: true, shadow: theme.customShadows.primaryTest })}
                            >
                                <Stack spacing={1.25} alignItems="center">
                                    <CardMedia
                                        component="img"
                                        src={containerLayout}
                                        alt="Vertical"
                                        sx={{ borderRadius: 1, width: 64, height: 64 }}
                                    />
                                    <Typography variant="caption">Container</Typography>
                                </Stack>
                            </MainCard>
                        }
                    />
                </Grid>
            </Grid>
        </RadioGroup>
    );
};

export default ThemeWidth;
