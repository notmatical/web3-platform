/* eslint-disable  */

import React from 'react';
import { useRecoilValue } from 'recoil';
import MEMarketLogo from 'assets/images/icons/MEMarketLogo.png';
import solanaLogo from 'assets/images/icons/solana.png';
import { rarityColorCodeAtom, fpAtom } from 'views/cosmic-astro/sniping/recoil/atom/InfinityAtom';
import { Avatar, Box, Button, Chip, Grid, IconButton, ListItem, Typography, useTheme } from '@mui/material';
import { FormattedMessage } from 'react-intl';

const FilteredEachListings = ({ NFTData, buyNow }: any) => {
    const theme = useTheme();
    const rarityColorCode = useRecoilValue<any>(rarityColorCodeAtom);
    const fp = useRecoilValue<any>(fpAtom);
    const elapsedTimeGetter = () => {
        const timedf = Date.now() - NFTData.timeListed;
        // checks if seconds is possible
        const sec_num = parseInt(String(timedf / 1000), 10);
        const hours = Math.floor(sec_num / 3600);
        const minutes = Math.floor((sec_num - hours * 3600) / 60);
        const seconds = sec_num - hours * 3600 - minutes * 60;

        if (hours === 0 && minutes === 0) {
            return `${String(seconds)} secs ago`;
        }
        if (hours === 0 && minutes !== 0) {
            return `${String(minutes)} mins ago`;
        }
        return `${String(hours)} hrs ago`;
    };

    return (
        <ListItem
            sx={{
                overflowY: 'hidden',
                minHeight: '50px',
                minWidth: 0,
                width: '100%',
                maxWidth: '100%',
                color: '#fff',
                borderRadius: '10px',
                padding: '5px',
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
                overflowX: 'hidden',
                placeContent: 'space-evenly'
            }}
        >
            <Grid container>
                <Grid
                    item
                    xs={12}
                    md={4}
                    lg={3}
                    sx={{
                        width: '100%',
                        maxWidth: '100%',
                        display: 'flex',
                        gap: '5px',
                        alignItems: 'center',
                        overflowX: 'hidden',
                        justifyContent: 'space-between',
                        '&.MuiGrid-item': {
                            paddingLeft: 0
                        }
                    }}
                >
                    {/** NFT IMAGE, NAME AND COLLECTION START */}
                    <Box
                        sx={{
                            height: '40px',
                            maxHeight: '40px',
                            color: 'white',
                            gap: '10px',
                            alignItems: 'center',
                            overflow: 'hidden',
                            display: 'flex'
                        }}
                    >
                        <Avatar
                            src={NFTData?.listingInfo?.image ?? ''}
                            alt="?"
                            sx={{
                                minWidth: 40,
                                width: 40,
                                height: 40,
                                padding: 0,
                                margin: 0,
                                background: 'none'
                            }}
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                minWidth: 0,
                                maxWidth: '100%',
                                width: '100%',
                                overflowX: 'hidden'
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    fontSize: '14px',
                                    lineHeight: '21px',
                                    minWidth: 0,
                                    width: '100%',
                                    maxWidth: '100%'
                                }}
                                noWrap
                                component="div"
                            >
                                {NFTData?.listingInfo?.name}
                            </Typography>
                            <Typography
                                sx={{
                                    fontWeight: 400,
                                    fontSize: '12px',
                                    lineHeight: '18px',
                                    minWidth: 0,
                                    width: '100%',
                                    maxWidth: '100%'
                                }}
                                noWrap
                                component="div"
                            >
                                {NFTData?.listingInfo?.collection}
                            </Typography>
                        </Box>
                    </Box>
                    {/** NFT IMAGE, NAME AND COLLECTION END */}
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={8}
                    lg={9}
                    sx={{
                        width: '100%',
                        maxWidth: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        overflow: 'hidden',
                        justifyContent: 'space-between',
                        '&.MuiGrid-item': {
                            xs: {
                                paddingLeft: 0
                            },
                            md: {
                                paddingLeft: '1rem'
                            }
                        }
                    }}
                >
                    <Grid
                        container
                        sx={{
                            '.MuiGrid-item': {
                                paddingLeft: 0
                            }
                        }}
                    >
                        <Grid
                            item
                            xs={12}
                            xl={6}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexDirection: { xs: 'row-reverse', md: 'row' }
                            }}
                        >
                            <Typography
                                component="div"
                                sx={{
                                    color: 'white',
                                    fontWeight: 400,
                                    fontStyle: 'italic',
                                    fontSize: '10px',
                                    lineHeight: '15px',
                                    opacity: 0.5,
                                    display: 'flex',
                                    justifyContent: 'flex-end'
                                }}
                                noWrap
                            >
                                {elapsedTimeGetter()}
                            </Typography>
                            {/** RANKING START */}
                            {'rankingInfo' in NFTData ? (
                                <Box
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        px: '10px',
                                        py: 0
                                    }}
                                >
                                    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', marginRight: '4px' }}>
                                        <Typography
                                            component="div"
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: '12px',
                                                lineHeight: '18px',
                                                color: rarityColorCode[NFTData?.rankingInfo?.rankingCategory]?.color
                                            }}
                                        >
                                            {NFTData?.rankingInfo?.rarity}
                                        </Typography>
                                        <Typography
                                            component="div"
                                            sx={{
                                                fontWeight: 400,
                                                fontSize: '12px',
                                                lineHeight: '18px'
                                            }}
                                        >{`/${String(NFTData?.rankingInfo?.totalSeen)}`}</Typography>
                                    </Box>
                                    <Chip
                                        size="small"
                                        label={rarityColorCode[NFTData?.rankingInfo?.rankingCategory]?.text}
                                        variant="filled"
                                        sx={{
                                            margin: 'auto',
                                            fontWeight: 700,
                                            fontSize: '7px',
                                            lineHeight: '10.5px',
                                            backgroundColor: rarityColorCode[NFTData?.rankingInfo?.rankingCategory]?.color ?? '#969696'
                                        }}
                                    />
                                </Box>
                            ) : (
                                <Box
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        px: '10px',
                                        py: 0,
                                        opacity: 0
                                    }}
                                >
                                    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', marginRight: '4px' }}>
                                        <Typography
                                            component="div"
                                            sx={{ fontWeight: 700, fontSize: '12px', lineHeight: '18px', color: '#888888' }}
                                        >
                                            715
                                        </Typography>
                                        <Typography component="div" sx={{ fontWeight: 400, fontSize: '12px', lineHeight: '18px' }}>
                                            /9611
                                        </Typography>
                                    </Box>
                                    <Chip
                                        size="small"
                                        label="COMMON"
                                        variant="filled"
                                        sx={{
                                            margin: 'auto',
                                            fontWeight: 700,
                                            fontSize: '7px',
                                            lineHeight: '10.5px',
                                            backgroundColor: rarityColorCode[NFTData?.rankingInfo?.rankingCategory]?.color ?? '#969696'
                                        }}
                                    />
                                </Box>
                            )}
                            {/** RANKING END */}
                        </Grid>
                        <Grid item xs={12} xl={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            {/** PRICE START */}

                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    py: '1.5px',
                                    px: '5px',
                                    gap: '5px'
                                }}
                            >
                                {/** MARKETPLACE SYMBOL START */}
                                <IconButton
                                    href={`https://magiceden.io/item-details/${NFTData?.MEData?.tokenMint}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <Avatar
                                        src={MEMarketLogo}
                                        alt="marketLogo"
                                        sx={{
                                            height: 22,
                                            width: 22.16,
                                            background: 'none'
                                        }}
                                    />
                                </IconButton>
                                {/** MARKETPLACE SYMBOL END */}
                                <Typography
                                    component="div"
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: '12px',
                                        lineHeight: '18px'
                                    }}
                                >{`FP: ${
                                    NFTData.listingInfo.collection in fp ? String(fp[NFTData.listingInfo.collection].fp) : 'N/A'
                                }`}</Typography>
                            </Box>
                            {/** PRICE END */}
                            {/** BUT BUTTON START */}
                            <Box
                                sx={{
                                    minHeight: '25px',
                                    maxHeight: '25px',
                                    display: 'flex',
                                    gap: '5px',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Button
                                    sx={{
                                        justifySelf: 'flex-end',
                                        borderRadius: '5px',
                                        color: 'white',
                                        minWidth: { xs: 160, md: 200 },
                                        justifyContent: 'space-between'
                                    }}
                                    size="small"
                                    variant="outlined"
                                    color="secondary"
                                    endIcon={
                                        <Avatar
                                            src={solanaLogo}
                                            alt="SOL"
                                            variant="square"
                                            sx={{ height: 15, width: 15, padding: 0, margin: 0, background: 'none' }}
                                        />
                                    }
                                    onClick={() =>
                                        buyNow(
                                            NFTData?.MEData,
                                            NFTData?.timeListed + NFTData?.MEData?.tokenMint + String(NFTData?.MEData?.price)
                                        )
                                    }
                                >
                                    <Typography component="div" noWrap>
                                        <FormattedMessage id="buy-now" />
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: '40%',
                                            justifyContent: 'flex-end',
                                            textAlign: 'end',
                                            gap: '5px'
                                        }}
                                    >
                                        <Typography
                                            component="div"
                                            sx={{
                                                fontWeigth: 700,
                                                fontSize: '14px',
                                                lineHeight: '21px'
                                            }}
                                            noWrap
                                        >
                                            {NFTData?.MEData?.price}
                                        </Typography>
                                    </Box>
                                </Button>
                            </Box>
                            {/** BUY BUTTON END */}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </ListItem>
    );
};

export default React.memo(FilteredEachListings);
