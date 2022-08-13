import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Stack, Typography, CardContent, Grid, Button, Alert, TextField, Dialog } from '@mui/material';

// web3 imports
import { useWallet } from '@solana/wallet-adapter-react';

// project imports
import { gridSpacing } from 'store/constant';
import { useToasts } from 'hooks/useToasts';
import SkeletonProductPlaceholder from 'components/cards/Skeleton/ProductPlaceholder';
import MainCard from 'components/cards/MainCard';

// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, FormikValues } from 'formik';
import ReactMarkdown from 'react-markdown';

// graphql
import { useQuery, useMutation } from '@apollo/client';
import * as db from 'database/graphql/graphql';
import SelectVoteSystem from './SelectVoteSystem';

// test
const testMarkdown = `A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done

A table:

| a | b |
| - | - |
`;

// constant
const getInitialValues = () => {
    const newProposal = {
        title: '',
        body: '',
        discussion: null
    };

    return newProposal;
};

enum STEPS {
    BASIC_INFO = 0,
    VOTE_SETUP = 1
}

// styled
const ChoiceInput = styled(TextField)(() => ({
    '& fieldset': {
        borderRadius: '24px'
    }
}));

const ProposalCreate = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { symbol } = useParams();

    const [step, setStep] = useState(STEPS.BASIC_INFO);
    const [count, setCount] = useState(0);
    const [isPreview, setIsPreview] = useState(false);

    const { showInfoToast, showErrorToast } = useToasts();
    const { publicKey, signMessage } = useWallet();

    // modal/dialog related shit
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleProposalCreate = async (projectData: FormikValues) => {
        const { title, body, discussion } = projectData;
        const author = publicKey?.toBase58();
        const postedIn = data.space.id;

        showInfoToast(`You have added a new proposal: ${projectData.title}`);
        handleModalClose();
    };

    const handleAddProposal = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    // form
    const ProposalSchema = Yup.object().shape({
        title: Yup.string().max(128).required('Please specify a title for this proposal.'),
        body: Yup.string().max(14000).nullable(),
        discussion: Yup.string().max(255).nullable()
    });

    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: ProposalSchema,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            try {
                const data = {
                    title: values.title,
                    body: values.body,
                    discussion: values.discussion
                };

                console.log(data);

                resetForm();
                setSubmitting(false);
            } catch (error) {
                console.error(error);
            }
        }
    });

    const { values, errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

    // GRAPHQL QUERIES
    // eslint-disable-next-line object-shorthand
    const { data, loading } = useQuery(db.queries.GET_SPACE, { variables: { symbol }, fetchPolicy: 'cache-and-network' });

    return (
        <>
            {loading ? (
                <SkeletonProductPlaceholder />
            ) : (
                <>
                    <Stack
                        direction="row"
                        justifyContent="space-around"
                        alignItems="flex-start"
                        sx={{
                            mr: 'auto',
                            gap: 2,
                            flexDirection: { xs: 'column', md: 'row', lg: 'row' }
                        }}
                    >
                        <Grid item xs={12} md={8} lg={8}>
                            {step === STEPS.BASIC_INFO && (
                                <Typography
                                    variant="h4"
                                    color="primary"
                                    onClick={() => navigate(`/spaces/${symbol}`, { replace: true })}
                                    sx={{
                                        ml: 1,
                                        mb: '16px',
                                        '&:hover': {
                                            cursor: 'pointer',
                                            color: theme.palette.primary.light,
                                            transition: 'all .1s ease-in-out'
                                        }
                                    }}
                                >
                                    Go Back
                                </Typography>
                            )}

                            {isPreview ? (
                                <>
                                    <Grid container justifyContent="center">
                                        <Grid item xs={12} md={12} lg={12}>
                                            <Typography variant="h1" color="inherit" sx={{ ml: 1, mb: '8px' }}>
                                                {values.title}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={12} sx={{ mt: 2 }}>
                                            <ReactMarkdown>{values.body}</ReactMarkdown>
                                        </Grid>
                                    </Grid>
                                </>
                            ) : (
                                <>
                                    <FormikProvider value={formik}>
                                        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                                            <Grid container spacing={gridSpacing} justifyContent="center">
                                                {step === STEPS.BASIC_INFO && (
                                                    <>
                                                        <Grid item xs={12} md={12} lg={12}>
                                                            <Alert variant="outlined" severity="info">
                                                                You need to actively hold an NFT in order to submit a proposal.
                                                            </Alert>
                                                        </Grid>

                                                        <Grid item xs={12} md={12} lg={12}>
                                                            <Typography variant="h5" color="primary" sx={{ ml: 1, mb: '8px' }}>
                                                                Title
                                                            </Typography>
                                                            <TextField
                                                                fullWidth
                                                                {...getFieldProps('title')}
                                                                error={Boolean(touched.title && errors.title)}
                                                                helperText={touched.title && errors.title}
                                                            />
                                                        </Grid>

                                                        <Grid item xs={12} md={12} lg={12}>
                                                            <Box display="flex" flexDirection="row" justifyContent="space-between">
                                                                <Typography variant="h5" color="primary" sx={{ ml: 1, mb: '8px' }}>
                                                                    Description (optional)
                                                                </Typography>
                                                                <Typography variant="h5" color="primary" sx={{ ml: 1, mb: '8px' }}>
                                                                    {count} / 14,000
                                                                </Typography>
                                                            </Box>

                                                            <TextField
                                                                fullWidth
                                                                multiline
                                                                rows={6}
                                                                {...getFieldProps('body')}
                                                                error={Boolean(touched.body && errors.body)}
                                                                helperText={touched.body && errors.body}
                                                            />
                                                            <Typography variant="caption" display="block" sx={{ ml: 2, mt: 1 }}>
                                                                Describe in detail the reasoning behind your proposal.
                                                            </Typography>
                                                        </Grid>

                                                        <Grid item xs={12} md={12} lg={12}>
                                                            <Typography variant="h5" color="primary" sx={{ ml: 1, mb: '8px' }}>
                                                                Discussion (optional)
                                                            </Typography>
                                                            <TextField
                                                                fullWidth
                                                                {...getFieldProps('discussion')}
                                                                error={Boolean(touched.discussion && errors.discussion)}
                                                                helperText={touched.discussion && errors.discussion}
                                                            />
                                                            <Typography variant="caption" display="block" sx={{ ml: 2, mt: 1 }}>
                                                                Provide a link to a discussion page regarding this proposal.
                                                            </Typography>
                                                        </Grid>
                                                    </>
                                                )}

                                                {step === STEPS.VOTE_SETUP && (
                                                    <>
                                                        <Grid item xs={12} md={12} lg={12}>
                                                            <MainCard
                                                                title="Voting"
                                                                sx={{
                                                                    background: 'none !important',
                                                                    color: theme.palette.primary.light,
                                                                    borderColor: 'rgba(213, 217, 233, 0.2)'
                                                                }}
                                                            >
                                                                <Grid container spacing={1} flexDirection="column">
                                                                    <Grid item sx={{ mb: 2 }}>
                                                                        <Button
                                                                            variant="outlined"
                                                                            color="primary"
                                                                            fullWidth
                                                                            disableElevation
                                                                            disableRipple
                                                                            onClick={handleAddProposal}
                                                                            sx={{
                                                                                fontWeight: '600',
                                                                                justifyContent: 'flex-start',
                                                                                borderRadius: '24px',
                                                                                mr: 2
                                                                            }}
                                                                        >
                                                                            Voting System
                                                                            <Typography variant="h5" sx={{ ml: 2 }}>
                                                                                Single Choice Voting
                                                                            </Typography>
                                                                        </Button>
                                                                    </Grid>

                                                                    <Grid item>
                                                                        <ChoiceInput fullWidth />
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <ChoiceInput label="Optional" fullWidth />
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <ChoiceInput label="Optional" fullWidth />
                                                                    </Grid>
                                                                </Grid>
                                                            </MainCard>
                                                        </Grid>
                                                    </>
                                                )}
                                            </Grid>
                                        </Form>
                                    </FormikProvider>
                                </>
                            )}
                        </Grid>

                        <Grid item xs={12} md={4} lg={4}>
                            <MainCard
                                sx={{
                                    background: 'none !important',
                                    color: theme.palette.primary.light,
                                    borderColor: 'rgba(213, 217, 233, 0.2)',
                                    [theme.breakpoints.up('xs')]: {
                                        mt: 3
                                    },
                                    [theme.breakpoints.up('md')]: {
                                        mt: 3
                                    },
                                    [theme.breakpoints.up('lg')]: {
                                        mb: 2
                                    }
                                }}
                            >
                                <CardContent sx={{ p: '0px !important', justifyContent: 'center' }}>
                                    <Box display="flex" flexDirection="column" justifyContent="center">
                                        <Grid container spacing={1} flexDirection="column">
                                            {step === STEPS.BASIC_INFO ? (
                                                <Grid item>
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        fullWidth
                                                        disableElevation
                                                        disableRipple
                                                        onClick={(e) => setIsPreview(!isPreview)}
                                                        sx={{
                                                            borderRadius: '24px'
                                                        }}
                                                    >
                                                        {isPreview ? 'Edit' : 'Preview'}
                                                    </Button>
                                                </Grid>
                                            ) : (
                                                <Grid item>
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        fullWidth
                                                        disableElevation
                                                        disableRipple
                                                        onClick={(e) => setStep(STEPS.BASIC_INFO)}
                                                        sx={{
                                                            borderRadius: '24px'
                                                        }}
                                                    >
                                                        Back
                                                    </Button>
                                                </Grid>
                                            )}
                                            <Grid item>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    fullWidth
                                                    disableElevation
                                                    disableRipple
                                                    disabled={Boolean(!touched.title && errors.title)}
                                                    onClick={(e) => {
                                                        setStep(STEPS.VOTE_SETUP);
                                                        setIsPreview(false);
                                                    }}
                                                    sx={{
                                                        borderRadius: '24px'
                                                    }}
                                                >
                                                    {step === STEPS.VOTE_SETUP ? 'Publish' : 'Continue'}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </CardContent>

                                {/* Dialog renders its body even if not open */}
                                <Dialog
                                    maxWidth="sm"
                                    fullWidth
                                    onClose={handleModalClose}
                                    open={isModalOpen}
                                    sx={{
                                        '& .MuiDialog-paper': {
                                            p: 0,
                                            maxWidth: '400px'
                                        }
                                    }}
                                >
                                    {isModalOpen && <SelectVoteSystem onCancel={handleModalClose} handleCreate={handleProposalCreate} />}
                                </Dialog>
                            </MainCard>
                        </Grid>
                    </Stack>
                </>
            )}
        </>
    );
};

export default ProposalCreate;
