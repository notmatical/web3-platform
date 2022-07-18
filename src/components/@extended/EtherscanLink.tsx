import React from 'react';

// material-ui
import { Typography } from '@mui/material';

// project imports
import { shortenAddress } from 'utils/utils';

interface EtherscanLinkProps {
    address: string;
    type: string;
    code?: boolean;
    style?: React.CSSProperties;
    length?: number;
}

export const EtherscanLink = ({ address, type, code, style, length }: EtherscanLinkProps) => {
    if (!address) return null;

    const eLength = length ?? 9;
    return (
        <a
            href={`https://etherscan.io/${type}/${address}`}
            // eslint-disable-next-line react/jsx-no-target-blank
            target="_blank"
            title={address}
            style={style}
            rel="noreferrer"
        >
            {code ? (
                <Typography component="span">
                    {shortenAddress(address, eLength)}
                </Typography>
            ) : (
                shortenAddress(address, eLength)
            )}
        </a>
    )
}