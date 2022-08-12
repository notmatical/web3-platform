import { useRecoilState } from 'recoil';
import EachListing from './EachListing';
import useWebSocket from 'react-use-websocket';
import { Transition } from '@headlessui/react';
import '../SniperPage/transitionStyles.css';
import { allListingAtom } from 'views/cosmic-astro/sniping/recoil/atom/InfinityAtom';

const Listings = ({ buyNow }: any) => {
    const [allListing, setAllListing] = useRecoilState<any[]>(allListingAtom);

    const ws = useWebSocket(`wss://ws.halo-labs.io`, {
        onOpen: () => console.log('opened'),
        shouldReconnect: (closeEvent) => true,
        reconnectAttempts: 10000,
        share: true,
        onMessage: (data) => {
            if (data.data.toString().length > 8) {
                if (allListing.length < 50) {
                    setAllListing([JSON.parse(data.data.toString())].concat(JSON.parse(JSON.stringify(allListing))));
                } else {
                    const newAllListings = JSON.parse(JSON.stringify(allListing));

                    while (newAllListings.length >= 50) {
                        newAllListings.pop();
                    }

                    setAllListing([JSON.parse(data.data.toString())].concat(newAllListings));
                }
            }
        }
    });

    return (
        <ul className="w-full h-full max-h-full overflow-y-auto overflow-x-hidden scrollbar-hide">
            {allListing.map((curr, index) => (
                <Transition
                    show
                    appear
                    enter="transition duration-300 ease"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100  opacity-100"
                    key={`${curr.MEData.tokenMint + String(curr.MEData.price) + String(curr.timeListed)}Filtered`}
                >
                    <EachListing NFTData={curr} buyNow={buyNow} />
                </Transition>
            ))}
        </ul>
    );
};

export default Listings;
