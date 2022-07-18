// material-ui
import { Button, ButtonGroup, Grid, IconButton, Stack, Tooltip, Typography, GridProps } from '@mui/material';

// third-party
import { format } from 'date-fns';

// assets
import { IconChevronLeft, IconChevronRight, IconLayoutGrid, IconTemplate, IconLayoutList, IconListNumbers } from '@tabler/icons';

// ==============================|| CALENDAR TOOLBAR ||============================== //

interface ToolbarProps {
    date: number | Date;
    onClickNext: () => void;
    onClickPrev: () => void;
    onClickToday: () => void;
    sx?: GridProps['sx'];
}

const Toolbar = ({ date, onClickNext, onClickPrev, onClickToday, sx, ...others }: ToolbarProps) => (
    <Grid alignItems="center" container justifyContent="space-between" spacing={3} {...others} sx={{ pb: 3 }}>
        <Grid item>
            <Button variant="outlined" onClick={onClickToday}>
                Today
            </Button>
        </Grid>
        <Grid item>
            <Stack direction="row" alignItems="center" spacing={3}>
                <IconButton onClick={onClickPrev} size="large">
                    <IconChevronLeft />
                </IconButton>
                <Typography variant="h3" color="textPrimary">
                    {format(date, 'MMMM yyyy')}
                </Typography>
                <IconButton onClick={onClickNext} size="large">
                    <IconChevronRight />
                </IconButton>
            </Stack>
        </Grid>
    </Grid>
);

export default Toolbar;
