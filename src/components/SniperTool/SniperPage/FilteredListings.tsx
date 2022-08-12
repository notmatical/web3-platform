/* eslint-disable  */

import { useRecoilValue } from 'recoil';
import { filteredListingAtom } from 'views/cosmic-astro/sniping/recoil/atom/InfinityAtom';
import FilteredEachListings from './FilteredEachListings';
import { Transition } from '@headlessui/react';
import './transitionStyles.css';
import { List } from '@mui/material';

const FilteredListings = ({ buyNow }: any) => {
    const filteredListing = useRecoilValue(filteredListingAtom);

    return (
        <List
            sx={{
                width: '100%',
                height: '100%',
                maxHeight: '100%',
                overflowY: 'auto',
                overflowX: 'hidden',
                '& .MuiListItem-root:hover': {
                    backgroundColor: '#bb86fc22'
                }
            }}
            className="scrollbar-hide"
        >
            {filteredListing.map((curr, index) => (
                <Transition
                    show
                    appear
                    enter="transition duration-300 ease"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100  opacity-100"
                    key={`${curr?.MEData?.tokenMint + String(curr?.MEData?.price) + String(curr?.timeListed)}Filtered`}
                >
                    <FilteredEachListings NFTData={curr} buyNow={buyNow} />
                </Transition>
            ))}
        </List>
    );
};

export default FilteredListings;
