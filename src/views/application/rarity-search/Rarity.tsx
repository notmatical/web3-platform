import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Stack, Button, TextField, Typography } from '@mui/material';

// project imports
import { getIdFromRank, getRankFromId } from 'actions/rarity';
import MainCard from 'components/MainCard';
import Ranking from './Ranking';
import './Rarity.css';

const RaritySearch = () => {
    const theme = useTheme();

    const [tab, setTab] = useState<string>('ranking');
    const [rank, setRank] = useState<number>(1);
    const [id, setId] = useState<number>(getIdFromRank(1));

    const onChangeId = (newId: number) => {
        if (Number.isNaN(newId)) {
            setRank(getRankFromId(1));
        } else {
            setId(newId);
            setRank(getRankFromId(newId));
        }
    };

    const onChangeRank = (newRank: number) => {
        if (Number.isNaN(newRank)) {
            setId(getIdFromRank(1));
        } else {
            setRank(newRank);
            setId(getIdFromRank(newRank));
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <MainCard border={false}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Box
                            sx={{
                                pr: 2,
                                mr: 2,
                                borderRadius: 2,
                                backgroundColor: '#09080d',
                                padding: 1
                            }}
                        >
                            <Button
                                sx={{ ml: 1, textTransform: 'uppercase', fontWeight: 600 }}
                                variant={tab === 'ranking' ? 'contained' : 'text'}
                                color={tab === 'ranking' ? 'secondary' : 'primary'}
                                onClick={() => setTab('ranking')}
                            >
                                Ranking
                            </Button>
                            <Button
                                sx={{ ml: 1, textTransform: 'uppercase', fontWeight: 600 }}
                                variant={tab === 'attributes' ? 'contained' : 'text'}
                                color={tab === 'attributes' ? 'secondary' : 'primary'}
                                onClick={() => setTab('attributes')}
                            >
                                Attributes
                            </Button>
                        </Box>
                        {tab === 'ranking' && (
                            <div style={{ display: 'flex' }}>
                                <div className="input-group">
                                    <div className="input-text">id:</div>
                                    <div className="input-d">
                                        <input
                                            type="number"
                                            min="1"
                                            style={{ width: '60px' }}
                                            value={id}
                                            onChange={(e) => onChangeId(e.target.valueAsNumber)}
                                        />
                                    </div>
                                </div>
                                <div className="input-group" style={{ marginLeft: '10px' }}>
                                    <div className="input-text">rank:</div>
                                    <div className="input-d">
                                        <input
                                            type="number"
                                            min="1"
                                            style={{ width: '60px' }}
                                            value={rank}
                                            onChange={(e) => onChangeRank(e.target.valueAsNumber)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </Box>
                    {tab === 'ranking' && <Ranking id={id} rank={rank} />}
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default RaritySearch;
