/* eslint-disable  */

import { Box } from '@mui/material';
import { useDetectClickOutside } from 'react-detect-click-outside';
import { useRecoilValue } from 'recoil';
import { searchResultAtom } from 'views/cosmic-astro/sniping/recoil/atom/HaloLabsAtom';
import '../rainbow.css';
import EachSearchResult from './EachSearchResult';

const SearchResults = ({ closeSearch, addCollection }: any) => {
    const ref = useDetectClickOutside({ onTriggered: closeSearch });
    const searchResult = useRecoilValue(searchResultAtom);

    return (
        <Box
            ref={ref}
            sx={{
                minWidth: '100%',
                maxWidth: '100%',
                minHeight: '100%',
                maxHeight: '100%',
                overflowY: 'auto',
                scrollbarWidth: 0,
                borderColor: 'transparent',
                borderStyle: 'solid',
                borderWidth: 0,
                background: 'transparent !important',
                padding: '22px 17px',
                borderRadius: '10px',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}
            className="scrollbar-hide search-border"
        >
            {searchResult.map((curr: any) => (
                <EachSearchResult key={curr.symbol} collectionData={curr} addCollection={addCollection} />
            ))}
        </Box>
    );
};

export default SearchResults;
