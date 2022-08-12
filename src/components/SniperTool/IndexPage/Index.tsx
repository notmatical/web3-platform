/* eslint-disable react/button-has-type */
import SlopeLogo from '../../../assets/images/icons/SlopeLogo.png';
import FilterIcon from '../../../assets/images/icons/FilterIcon.png';
import { useWallet } from '@solana/wallet-adapter-react';
import '../rainbow.css';
import Listings from './Listings';

const Index = ({ buyNow }: any) => {
    const wallet = useWallet();

    const attemptBuy = async (MEData: any, identifier: any) => {
        if (wallet.publicKey) {
            await buyNow(MEData, identifier);
        }
    };

    return (
        <div className="h-full max-h-full w-full max-w-full grid grid-cols-3 gap-0">
            <div className="col-start-2 col-span-1 h-full max-h-full justify-self-center pt-[46px]">
                <div className="flex flex-col gap-[22px] items-center">
                    {/** ME & ACCESS BUTTON END */}
                    {/** LIVE LISTINGS START */}
                    <div className="min-w-[560px] max-w-[40vw] h-[45vh] max-h-[45vh] bg-[#12132D] rounded-[10px] flex flex-col">
                        {/** FILTER AND LIVE DIV START */}
                        <div className="w-full max-w-full h-[53px] max-h-[53px] rounded-t-[10px] px-[30px] py-[16px] border-liveListing-box border-transparent border-solid border-2 border-b-0 grid grid-cols-3 content-center">
                            <button className="h-[25px] w-[78.4px] py-[5px] px-[11px] rounded-[5px] font-poppins font-[700] text-[10px] leading-[15px] text-white border-filter-button border-transparent border-solid border-2 flex items-center gap-[10px] cursor-not-allowed">
                                <img src={FilterIcon} alt={FilterIcon} className="h-[10px] w-[8.4px]" />
                                <div>FILTERS</div>
                            </button>
                            <div className="justify-self-center flex gap-[6.5px] items-center text-white font-poppins font-[700] text-[12px] leading-[18px]">
                                <span className="flex h-[9px] w-[9px]">
                                    <span className="animate-ping absolute inline-flex h-[9px] w-[9px] rounded-full bg-[#FF0000] opacity-75" />
                                    <span className="relative inline-flex rounded-full h-[9px] w-[9px] bg-[#FF0000]" />
                                </span>
                                <div>LIVE</div>
                            </div>
                        </div>
                        {/** FILTER AND LIVE DIV END */}
                        {/** LISTINGS START */}
                        <div
                            className="min-h-0 h-full max-h-full w-full max-w-full bg-[#181A39] p-[30px] rounded-[10px]"
                            style={{ border: '2px solid rgba(95, 98, 119, 0.3)' }}
                        >
                            <Listings buyNow={attemptBuy} />
                        </div>
                        {/** LISTINGS END */}
                    </div>
                    {/** LIVE LISTINGS END */}
                </div>
                {/** SLOPE WARNING START */}
                <div className="w-full max-w-full flex m-auto mt-[10px] text-white font-alef font-[400] text-[10px] leading-[13.62px]">
                    <div className="m-auto flex items-center gap-[5px]">
                        <img src={SlopeLogo} alt={SlopeLogo} className="w-[15px] h-[15px]" />
                        Use Slope Wallet For Auto-Approve Transactions.
                    </div>
                </div>
                {/** SLOPE WARNING ENNDS */}
            </div>
        </div>
    );
};

export default Index;
