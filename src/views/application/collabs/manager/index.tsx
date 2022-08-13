/* eslint-disable */
import { useState, ReactElement } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Box, Dialog, Button, Avatar, Typography } from '@mui/material';

// project imports
import { useToasts } from 'hooks/useToasts';
import { gridSpacing } from 'store/constant';
import SpacesPlaceholder from 'components/cards/Skeleton/SpacesPlaceholder';
import ProjectCard from './ProjectCard';
import AddProjectForm from './AddProjectForm';

// web3 imports
import { useWallet } from '@solana/wallet-adapter-react';

// assets
import AddIcon from '@mui/icons-material/Add';
import { CloseCircleOutlined } from '@ant-design/icons';

// third party
import { FormikValues } from 'formik';

// test
import { useQuery, useMutation } from '@apollo/client';
import * as db from 'database/graphql/graphql';

const ProjectManage = () => {
    const theme = useTheme();
    const { publicKey } = useWallet();
    const { showInfoToast } = useToasts();

    const { data: user } = useQuery(db.queries.GET_USER, { variables: { wallet: publicKey }, fetchPolicy: 'network-only' });
    const { data, loading, error } = useQuery(db.queries.GET_PROJECTS, { fetchPolicy: 'network-only' });
    const [AddProject] = useMutation(db.mutations.ADD_PROJECT);

    // modal/dialog related shit
    const [isModalOpen, setIsModalOpen] = useState(false);

    const guildId: string = '939996609918427207';
    const handleProjectCreate = async (projectData: FormikValues) => {
        const { name, description, template, spots, mintPrice, mintDate, mintSupply, discord, twitter } = projectData;
        AddProject({
            variables: { guildId, name, description, template, spots, mintPrice, mintDate, mintSupply, discord, twitter }
        }).then(
            (res) => {
                console.log(res);
            },
            (err) => {
                console.log(err);
            }
        );
        showInfoToast(`You've added a new project: ${projectData.name}`);
        handleModalClose();
    };

    const handleAddProject = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    let proposalResult: ReactElement | ReactElement[] = <></>;
    if (data && data.projects && data.projects.length > 0) {
        proposalResult = data.projects.map((project: any, index: any) => {
            console.log(project.managers);
            if (project.managers.indexOf(user.id)) {
                return project &&
                    <Grid key={index} item xs={12} md={3} lg={3}>
                        <ProjectCard project={project} loading={loading} />
                    </Grid>
            }
        });
    } else {
        proposalResult = (
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
                            No Manageable Projects Found
                        </Typography>
                        <Typography variant="subtitle2" color="inherit">
                            There are no projects that you manage to display.
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
                        <Button disableElevation color="secondary" variant="contained" startIcon={<AddIcon />} onClick={handleAddProject}>
                            New Project
                        </Button>
                    </Box>

                    <Typography variant="h4" color="primary" sx={{ lineHeight: '24px', display: 'block', mr: 2 }}>
                        1.2K space(s)
                    </Typography>
                </Stack>
            </Grid>

            {loading
                ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
                      <Grid key={item} item xs={12} sm={6} md={4} lg={3}>
                          <SpacesPlaceholder />
                      </Grid>
                  ))
                : proposalResult}

            {/* Dialog renders its body even if not open */}
            <Dialog maxWidth="sm" fullWidth onClose={handleModalClose} open={isModalOpen} sx={{ '& .MuiDialog-paper': { p: 0 } }}>
                {isModalOpen && <AddProjectForm onCancel={handleModalClose} handleCreate={handleProjectCreate} />}
            </Dialog>
        </Grid>
    );
};

export default ProjectManage;
