import React from 'react';

// material-ui
import { Typography } from '@mui/material';

// web3 imports
import { PublicKey } from '@solana/web3.js';

// project imports
import { shortenAddress } from 'utils/utils';

interface ExplorerLinkProps {
    address: string | PublicKey;
    type: string;
    code?: boolean;
    style?: React.CSSProperties;
    length?: number;
}

export const ExplorerLink = ({ address, type, code, style, length }: ExplorerLinkProps) => {
    const eAddress = typeof address === 'string' ? address : address?.toBase58();
    if (!eAddress) return null;

    const eLength = length ?? 9;
    return (
        <a
            href={`https://explorer.solana.com/${type}/${address}`}
            // eslint-disable-next-line react/jsx-no-target-blank
            target="_blank"
            title={eAddress}
            style={style}
            rel="noreferrer"
        >
            {code ? (
                <Typography component="span">
                    {shortenAddress(eAddress, eLength)}
                </Typography>
            ) : (
                shortenAddress(eAddress, eLength)
            )}
        </a>
    )
}