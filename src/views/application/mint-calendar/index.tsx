import React, { useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Theme, useMediaQuery, CircularProgress, Grid, Typography, Box, Dialog, Stack } from '@mui/material';

// assets
import TwitterIcon from '@mui/icons-material/Twitter';
import LanguageIcon from '@mui/icons-material/Language';
import { IconBrandDiscord } from '@tabler/icons';

// third-party
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin from '@fullcalendar/interaction';

// web3
import { useWallet } from '@solana/wallet-adapter-react';

// project imports
import { useToasts } from 'hooks/useToasts';
import MainCard from 'components/cards/MainCard';
import SubCard from 'components/cards/SubCard';
import ViewDropModal from './ViewDropModal';
import CalendarStyled from './CalendarStyled';
import Toolbar from './Toolbar';

// test
import { useQuery, useMutation } from '@apollo/client';
import { mutations, queries } from '../../../graphql/graphql';

// ==============================|| APPLICATION CALENDAR ||============================== //

const MintCalendar = () => {
    const theme = useTheme();

    const { showInfoToast } = useToasts();
    const calendarRef = useRef<FullCalendar>(null);
    const matchSm = useMediaQuery((them: Theme) => them.breakpoints.down('md'));

    const { data, loading, error } = useQuery(queries.GET_DROPS);

    const [events, setEvents] = useState([]);
    const [eventsData, setEventsData] = useState([]);
    const [modalData, setModalData] = useState<any>({});

    // Toolbar Data
    const [date, setDate] = useState(new Date());

    // Modal
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleDateToday = () => {
        const calendarEl = calendarRef.current;

        if (calendarEl) {
            const calendarApi = calendarEl.getApi();

            calendarApi.today();
            setDate(calendarApi.getDate());
        }
    };

    const handleDatePrev = () => {
        const calendarEl = calendarRef.current;

        if (calendarEl) {
            const calendarApi = calendarEl.getApi();

            calendarApi.prev();
            setDate(calendarApi.getDate());
        }
    };

    const handleDateNext = () => {
        const calendarEl = calendarRef.current;

        if (calendarEl) {
            const calendarApi = calendarEl.getApi();

            calendarApi.next();
            setDate(calendarApi.getDate());
        }
    };

    const handleNameClick = ({ event }: any) => {
        handleOpen();
        const filteredEventData = eventsData.filter((eventToBeFiltered: any) => eventToBeFiltered.name === event.title);
        setModalData(filteredEventData[0]);
    };

    useEffect(() => {
        console.log(loading);
        if (!loading) {
            const drops: any = data.getDrops;
            const eventHolder: any = [];
            const eventDataHolder: any = [];

            // Filter Events from Data
            Object.values(drops).map((drop: any) => {
                drop.map((object: any) => {
                    eventDataHolder.push(object);
                    eventHolder.push({ title: object.name, date: object.date });
                });
            });

            setEvents(eventHolder);
            setEventsData(eventDataHolder);
        }
    }, [loading]);

    if (!loading) {
        return (
            <Box sx={{ position: 'relative' }}>
                <CalendarStyled>
                    <Toolbar date={date} onClickNext={handleDateNext} onClickPrev={handleDatePrev} onClickToday={handleDateToday} />
                    <FullCalendar
                        weekends
                        ref={calendarRef}
                        rerenderDelay={10}
                        initialDate={date}
                        dayMaxEventRows={2}
                        eventDisplay="block"
                        events={events}
                        headerToolbar={false}
                        contentHeight={matchSm ? 'auto' : 720}
                        height={matchSm ? 'auto' : 720}
                        eventClick={handleNameClick}
                        plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
                    />
                </CalendarStyled>

                {/* Dialog renders its body even if not open */}
                <Dialog maxWidth="sm" fullWidth onClose={handleClose} open={open} sx={{ '& .MuiDialog-paper': { p: 0 } }}>
                    {open && <ViewDropModal drop={modalData} onCancel={handleClose} />}
                </Dialog>
            </Box>
        );
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} alignItems="center">
                <Stack display="flex" flexDirection="row" justifyContent="center" sx={{ my: 10 }}>
                    <CircularProgress color="secondary" />
                </Stack>
            </Grid>
        </Grid>
    );
};

export default MintCalendar;
