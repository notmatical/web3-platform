/* eslint-disable */
import { MouseEventHandler, useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/styles';

// project import
import Avatar from 'components/@extended/Avatar';
import SkeletonProductPlaceholder from 'components/cards/Skeleton/ProductPlaceholder';

import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

interface NftAvatarCardProps {
    image: string;
    chooseAvatar: Function;
}

const NftAvatarCard = ({ image, chooseAvatar }: NftAvatarCardProps) => {
    const theme = useTheme();

    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <>
            {isLoading ? (
                <SkeletonProductPlaceholder />
            ) : (
                <div onClick={() => chooseAvatar(image)}>
                    <Avatar
                        alt="NFT Avatar"
                        src={image}
                        sx={{
                            borderRadius: '8px',
                            '&:hover': {
                                cursor: 'pointer',
                                transition: 'all .2s ease-in-out',
                                filter: 'brightness(0.2)'
                            },
                            width: { xs: 72, sm: 72, md: 130 },
                            height: { xs: 72, sm: 72, md: 120 }
                        }}
                    />
                </div>
            )}
        </>
    );
};

export default NftAvatarCard;
