import { alpha, useTheme } from '@mui/material/styles';
import { CardMedia, FormControlLabel, Grid, Radio, RadioGroup, Stack, Typography } from '@mui/material';

// project
import MainCard from 'components/MainCard';
import useConfig from 'hooks/useConfig';

// third party
import { presetDarkPalettes, presetPalettes } from '@ant-design/colors';

// color import
import theme1 from 'assets/scss/_theme1.module.scss';
import theme2 from 'assets/scss/_theme2.module.scss';
import theme3 from 'assets/scss/_theme3.module.scss';
import theme4 from 'assets/scss/_theme4.module.scss';
import theme5 from 'assets/scss/_theme5.module.scss';
import theme6 from 'assets/scss/_theme6.module.scss';

// assets
import colorLayout from 'assets/images/customization/theme-color.svg';

const ColorScheme = () => {
    const theme = useTheme();

    const { mode, presetColor, onChangePresetColor } = useConfig();

    const colors = mode === 'dark' ? presetDarkPalettes : presetPalettes;
    const { blue } = colors;

    const colorOptions = [
        {
            id: 'default',
            primary: blue[5],
            secondary: blue[0],
            label: 'Theme 1',
            shadow: `0 0 0 2px ${alpha(blue[5], 0.2)}`
        },
        {
            id: 'theme1',
            primary: theme.palette.mode === 'dark' ? theme1.darkPrimaryMain : theme1.primaryMain,
            secondary: theme.palette.mode === 'dark' ? theme1.darkSecondaryMain : theme1.secondaryMain,
            lighter: mode === 'dark' ? '#1c2134' : '#D6E4FF',
            label: 'Theme 2',
            shadow: `0 0 0 2px ${alpha(mode === 'dark' ? '#305bdd' : '#3366FF', 0.2)}`
        },
        {
            id: 'theme2',
            primary: theme.palette.mode === 'dark' ? theme2.darkPrimaryMain : theme2.primaryMain,
            secondary: theme.palette.mode === 'dark' ? theme2.darkSecondaryMain : theme2.secondaryMain,
            lighter: mode === 'dark' ? '#1c2134' : '#D6E4FF',
            label: 'Theme 3',
            shadow: `0 0 0 2px ${alpha(mode === 'dark' ? '#655ac8' : '#7265E6', 0.2)}`
        },
        {
            id: 'theme3',
            primary: theme.palette.mode === 'dark' ? theme3.darkPrimaryMain : theme3.primaryMain,
            secondary: theme.palette.mode === 'dark' ? theme3.darkSecondaryMain : theme3.secondaryMain,
            lighter: mode === 'dark' ? '#1c2134' : '#D6E4FF',
            label: 'Theme 4',
            shadow: `0 0 0 2px ${alpha(mode === 'dark' ? '#0a7d3e' : '#068e44', 0.2)}`
        },
        {
            id: 'theme4',
            primary: theme.palette.mode === 'dark' ? theme4.darkPrimaryMain : theme4.primaryMain,
            secondary: theme.palette.mode === 'dark' ? theme4.darkSecondaryMain : theme4.secondaryMain,
            lighter: mode === 'dark' ? '#1c2134' : '#D6E4FF',
            label: 'Theme 5',
            shadow: `0 0 0 2px ${alpha(mode === 'dark' ? '#5d7dcb' : '#3c64d0', 0.2)}`
        },
        {
            id: 'theme5',
            primary: theme.palette.mode === 'dark' ? theme5.darkPrimaryMain : theme5.primaryMain,
            secondary: theme.palette.mode === 'dark' ? theme5.darkSecondaryMain : theme5.secondaryMain,
            lighter: mode === 'dark' ? '#1c2134' : '#D6E4FF',
            label: 'Theme 6',
            shadow: `0 0 0 2px ${alpha(mode === 'dark' ? '#d26415' : '#f27013', 0.2)}`
        },
        {
            id: 'theme6',
            primary: theme.palette.mode === 'dark' ? theme6.darkPrimaryMain : theme6.primaryMain,
            secondary: theme.palette.mode === 'dark' ? theme6.darkSecondaryMain : theme6.secondaryMain,
            lighter: mode === 'dark' ? '#1c2134' : '#D6E4FF',
            label: 'Theme 7',
            shadow: `0 0 0 2px ${alpha(mode === 'dark' ? '#288d99' : '#2aa1af', 0.2)}`
        }
    ];

    const handlePresetColorChange = (event: any) => {
        onChangePresetColor(event.target.value);
    };

    return (
        <RadioGroup row aria-label="color-scheme" name="color-scheme" value={presetColor} onChange={handlePresetColorChange}>
            <Grid container spacing={3} sx={{ ml: 0, justifyContent: 'space-around' }}>
                {colorOptions.map((color, index) => (
                    <Grid item key={index}>
                        <FormControlLabel
                            control={<Radio value={color.id} sx={{ display: 'none' }} />}
                            sx={{ display: 'flex', '& .MuiFormControlLabel-label': { flex: 1 } }}
                            label={
                                <MainCard
                                    content={false}
                                    sx={{ bgcolor: presetColor === color.id ? color.lighter : 'secondary.lighter', p: 1 }}
                                    border={false}
                                    boxShadow
                                    {...(presetColor === color.id && { boxShadow: true, shadow: theme.customShadows.primaryTest })}
                                >
                                    <Stack spacing={1.5} alignItems="center">
                                        <CardMedia
                                            component="img"
                                            src={colorLayout}
                                            alt="Vertical"
                                            sx={{
                                                border: `1px solid ${color.secondary}`,
                                                borderRadius: 1,
                                                bgcolor: color.secondary,
                                                width: 40,
                                                height: 40
                                            }}
                                        />
                                        <Typography variant="caption">{color.label}</Typography>
                                    </Stack>
                                </MainCard>
                            }
                        />
                    </Grid>
                ))}
            </Grid>
        </RadioGroup>
    );
};

export default ColorScheme;
