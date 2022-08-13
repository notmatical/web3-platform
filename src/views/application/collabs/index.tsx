/* eslint-disable */

import { useEffect, useState, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Grid, Stack, Box, Dialog, TextField, MenuItem, InputAdornment, OutlinedInput, Button, Avatar, Typography } from '@mui/material';

// project imports
import useAuth from 'hooks/useAuth';
import { gridSpacing } from 'store/constant';
import AnimateButton from 'components/@extended/AnimateButton';
import SubmitRequestForm from './SubmitRequestForm';
import ProjectCard from './ProjectCard';

// assets
import { IconSearch } from '@tabler/icons';
import { CloseCircleOutlined } from '@ant-design/icons';
import { shouldForwardProp } from '@mui/system';

// test
import { useQuery, useMutation } from '@apollo/client';
import * as db from 'database/graphql/graphql';

// third-party
import { FormikValues } from 'formik';

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
        value: 'pre-mint',
        label: 'Pre Mint'
    },
    {
        value: 'post-mint',
        label: 'Post Mint'
    }
];

const Collabs = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const { data, loading, error } = useQuery(db.queries.GET_PROJECTS, { fetchPolicy: 'network-only' });

    const [AddProject] = useMutation(db.mutations.ADD_PROJECT);

    const [value, setValue] = useState('all');
    const [search, setSearch] = useState<string | undefined>('');
    const handleSearch = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) => {
        const newString = event?.target.value;
        setSearch(newString);

        if (newString) {
            console.log('new', newString);
        } else {
            console.log('old');
        }
    };

    const manage = () => {
        navigate('/collabs/manage', { replace: true });
    };

    // modal/dialog related
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleProposalCreate = async (collabData: FormikValues) => {
        console.log(collabData);
        handleModalClose();
    };

    const handleRequestCollab = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    let projects: ReactElement | ReactElement[] = <></>;
    if (data && data.projects && data.projects.length > 0) {
        projects = data.projects.map((project: any, index: any) => (
            <Grid key={index} item xs={4} md={3} lg={3}>
                <ProjectCard project={project} loading={loading} submitRequest={handleRequestCollab} />
            </Grid>
        ));
    } else {
        projects = (
            <Grid item xs={12}>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ borderRadius: 3, padding: 4, border: '1px solid rgba(213, 217, 233, 0.2)' }}
                >
                    <Stack alignItems="center">
                        <Avatar
                            variant="rounded"
                            sx={{
                                borderRadius: '9999px',
                                width: '80px !important',
                                height: '80px !important',
                                backgroundColor: theme.palette.dark.main,
                                color: theme.palette.secondary.dark,
                                mb: 2
                            }}
                        >
                            <CloseCircleOutlined style={{ fontSize: 32 }} />
                        </Avatar>
                        <Typography variant="h3" color="inherit">
                            No Projects Found
                        </Typography>
                        <Typography variant="subtitle2" color="inherit">
                            There are no projects to display.
                        </Typography>
                    </Stack>
                </Box>
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
                            onChange={handleSearch}
                            placeholder="Search"
                            startAdornment={
                                <InputAdornment position="start">
                                    <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
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

                    <Box display="flex" flexDirection="row" sx={{ gap: 2 }}>
                        <AnimateButton>
                            <Button disableRipple color="secondary" variant="contained" onClick={manage}>
                                Manage Projects
                            </Button>
                        </AnimateButton>
                        <AnimateButton>
                            <Button disableRipple color="secondary" variant="contained" onClick={handleRequestCollab}>
                                Apply for Collabs
                            </Button>
                        </AnimateButton>
                    </Box>
                </Stack>
            </Grid>

            {/* {loading
                ? [1, 2, 3, 4, 5, 6].map((item) => (
                      <Grid key={item} item xs={12} sm={6} md={4} lg={3}>
                          <CollabsPlaceholder />
                      </Grid>
                  ))
                : projects} */}

            {data &&
                data.projects &&
                data.projects.length > 0 &&
                value === 'all' &&
                data.projects.map((project: any, index: any) => (
                    <Grid key={index} item xs={4} md={3} lg={3}>
                        <ProjectCard project={project} loading={loading} submitRequest={handleRequestCollab} />
                    </Grid>
                ))}

            {data &&
                data.projects &&
                data.projects.length > 0 &&
                value === 'pre-mint' &&
                data.projects.map((project: any, index: any) => {
                    return !project.isPostMint &&
                        <Grid key={index} item xs={4} md={3} lg={3}>
                            <ProjectCard project={project} loading={loading} submitRequest={handleRequestCollab} />
                        </Grid>
                })}

            {data &&
                data.projects &&
                data.projects.length > 0 &&
                value === 'post-mint' &&
                data.projects.map((project: any, index: any) => {
                    return project.isPostMint &&
                        <Grid key={index} item xs={4} md={3} lg={3}>
                            <ProjectCard project={project} loading={loading} submitRequest={handleRequestCollab} />
                        </Grid>
                })}

            {data && data.projects && data.projects.length > 6 && (
                <Grid item xs={12}>
                    <Button disableElevation color="secondary" variant="outlined" sx={{ width: '100%' }}>
                        Load More
                    </Button>
                </Grid>
            )}

            {/* Dialog renders its body even if not open */}
            <Dialog
                maxWidth="sm"
                fullWidth
                onClose={handleModalClose}
                open={isModalOpen}
                sx={{ '& .MuiDialog-paper': { p: 0 } }}
            >
                {isModalOpen && (
                    <SubmitRequestForm project={data.project} onCancel={handleModalClose} handleCreate={handleProposalCreate} />
                )}
            </Dialog>
        </Grid>
    );
};

export default Collabs;
