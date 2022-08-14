/* eslint-disable */

import React, { memo, useMemo, useState, PureComponent, useEffect } from 'react';

// material-ui
import { shouldForwardProp } from '@mui/system';
import { useTheme, styled } from '@mui/material/styles';
import { DialogContent, DialogTitle, Divider, Grid, OutlinedInput, InputAdornment, Typography } from '@mui/material';

// project imports
import { Token } from 'types/swap';

// assets
import { IconSearch, IconSquareX } from '@tabler/icons';

// styled components
const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(({ theme }) => ({
    width: '100%',
    marginTop: '0 !important',
    paddingLeft: 16,
    paddingRight: 16,
    '& input': {
        background: 'transparent !important',
        paddingLeft: '4px !important'
    }
}));

const generateSearchTerm = (item: Token, searchValue: string) => {
    const normalizedSearchValue = searchValue.toLowerCase();
    const values = `${item.symbol} ${item.name}`.toLowerCase();

    const isMatchingWithSymbol = item.symbol.toLowerCase().indexOf(normalizedSearchValue) >= 0;
    const matchingSymbolPercent = isMatchingWithSymbol ? normalizedSearchValue.length / item.symbol.length : 0;

    return {
        token: item,
        matchingIdx: values.indexOf(normalizedSearchValue),
        matchingSymbolPercent
    };
};

const startSearch = (items: Token[], searchValue: string) =>
    items
        .map((item) => generateSearchTerm(item, searchValue))
        .filter((item) => item.matchingIdx >= 0)
        .sort((i1, i2) => i1.matchingIdx - i2.matchingIdx)
        .sort((i1, i2) => i2.matchingSymbolPercent - i1.matchingSymbolPercent)
        .map((item) => item.token);

interface SwapTokenSelectProps {
    sortedTokenMints: Token[] | null;
    onClose?: (x?: any) => void;
    onTokenSelect?: (x?: any) => void;
    walletTokens?: Array<any>;
}

const SwapTokenSelect = ({ sortedTokenMints, onClose, onTokenSelect, walletTokens }: SwapTokenSelectProps) => {
    const theme = useTheme();
    
    const [search, setSearch] = useState('');
    const popularTokenSymbols = ['USDC', 'SOL', 'USDT', 'MNGO', 'BTC', 'ETH'];

    // eslint-disable-next-line arrow-body-style
    const popularTokens = useMemo(() => {
        return walletTokens?.length
            ? sortedTokenMints?.filter((token) => {
                const walletMints = walletTokens.map((tok) => tok.account.mint.toString())
                return !token?.name || !token?.symbol
                    ? false
                    : popularTokenSymbols.includes(token.symbol) && walletMints.includes(token.address)
                })
            : sortedTokenMints?.filter((token) => {
                return !token?.name || !token?.symbol
                    ? false
                    : popularTokenSymbols.includes(token.symbol)
                })
    }, [walletTokens]);

    const tokenInfos = useMemo(() => {
        if (sortedTokenMints?.length) {
            const filteredTokens = sortedTokenMints.filter((token) => {
                return !token?.name || !token?.symbol ? false : true
            })

            if (walletTokens?.length) {
                const walletMints = walletTokens.map((tok) => tok.account.mint.toString());
                return filteredTokens.sort((a, b) => walletMints.indexOf(b.address) - walletMints.indexOf(a.address));
            } else {
                return filteredTokens;
            }
        } else {
            return [];
        }
    }, [sortedTokenMints]);

    const handleUpdateSearch = (e: any) => {
        setSearch(e.target.value);
    }

    const sortedTokens = search ? startSearch(tokenInfos, search) : tokenInfos

    return (
        <>
            <DialogTitle>Select a token</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 1 }}>
                <Grid item xs={12}>
                    <OutlineInputStyle
                        id="input-search-header"
                        value={search}
                        onChange={handleUpdateSearch}
                        fullWidth
                        placeholder="Filter by token"
                        startAdornment={
                            <InputAdornment position="start">
                                <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
                            </InputAdornment>
                        }
                        sx={{ marginTop: '24px', marginLeft: 0 }}
                        aria-describedby="search-helper-text"
                        inputProps={{ 'aria-label': 'weight' }}
                    />
                </Grid>

                {/*  */}
            </DialogContent>
        </>
    );
};

export default SwapTokenSelect;
