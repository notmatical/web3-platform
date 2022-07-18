import { useTheme } from '@mui/material/styles';
import { Box, FormControlLabel, Grid, Radio, RadioGroup, Stack, Typography } from '@mui/material';

// project
import MainCard from 'components/MainCard';
import useConfig from 'hooks/useConfig';

const ThemeFont = () => {
    const theme = useTheme();

    const { fontFamily, onChangeFontFamily } = useConfig();

    const handleFontChange = (event: any) => {
        onChangeFontFamily(event.target.value);
    };

    const fonts = [
        {
            id: 'inter',
            value: `'Inter', sans-serif`,
            label: 'Inter'
        },
        {
            id: 'roboto',
            value: `'Roboto', sans-serif`,
            label: 'Roboto'
        },
        {
            id: 'poppins',
            value: `'Poppins', sans-serif`,
            label: 'Poppins'
        },
        {
            id: 'urbanist',
            value: `'Urbanist', sans-serif`,
            label: 'Urbanist'
        }
    ];

    return (
        <RadioGroup row aria-label="theme-font" name="color-scheme" value={fontFamily} onChange={handleFontChange}>
            <Grid container spacing={1.15} sx={{ ml: 0 }}>
                {fonts.map((item, index) => (
                    <Grid item key={index}>
                        <FormControlLabel
                            control={<Radio value={item.value} sx={{ display: 'none' }} />}
                            sx={{ display: 'flex', '& .MuiFormControlLabel-label': { flex: 1 } }}
                            label={
                                <MainCard
                                    content={false}
                                    // sx={{ bgcolor: fontFamily === item.value ? theme.palette.secondary.dark : 'secondary.lighter', p: 1 }}
                                    border={false}
                                    boxShadow
                                    {...(fontFamily === item.value && { boxShadow: true, shadow: theme.customShadows.primaryTest })}
                                >
                                    <Box
                                        sx={{ minWidth: 60, bgcolor: 'background.paper', p: 1, '&:hover': { bgcolor: 'background.paper' } }}
                                    >
                                        <Stack spacing={0.5} alignItems="center">
                                            <Typography variant="h5" color="textPrimary" sx={{ fontFamily: item.value }}>
                                                Aa
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {item.label}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                </MainCard>
                            }
                        />
                    </Grid>
                ))}
            </Grid>
        </RadioGroup>
    );
};

export default ThemeFont;
