/* eslint-disable react/button-has-type */
import React from 'react';
import MEMarketLogo from '../../../assets/images/icons/MEMarketLogo.png';
import solanaLogo from '../../../assets/images/icons/solana.png';

const EachListing = ({ NFTData, buyNow }: any) => (
    <li className="h-[50px] max-h-[50px] min-w-0 w-full max-w-full text-white hover:bg-[#12132D] rounded-[10px] p-[5px] flex gap-[15px] items-center overflow-x-hidden place-content-evenly">
        {/** NFT IMAGE, NAME AND COLLECTION START */}
        <div className="h-[40px] max-h-[40px] min-w-[160px] max-w-[160px] text-white gap-[10px] items-center overflow-x-hidden flex">
            <div className="min-w-[40px] min-h-[40px] max-h-[40px] max-w-[40px]">
                <img
                    src={NFTData.listingInfo.image}
                    alt={NFTData.listingInfo.image}
                    className="w-[40px] max-w-[40px] aspect-square p-0 m-0 rounded"
                />
            </div>
            <div className="flex flex-col min-w-0 max-w-full w-full overflow-x-hidden">
                <div className="font-poppins font-[700] text-[14px] leading-[21px] min-w-0 w-full max-w-full truncate">
                    {NFTData.listingInfo.name}
                </div>
                <div className="font-poppins font-[400] text-[12px] leading-[18px] min-w-0 w-full max-w-full truncate">
                    {NFTData.listingInfo.collection}
                </div>
            </div>
        </div>
        {/** NFT IMAGE, NAME AND COLLECTION END */}
        {/** RANKING START */}
        <div className="hidden h-full flex flex-col px-[10px] py-0">
            <div className="h-full font-poppins flex items-center">
                <div className="font-[700] text-[12px] leading-[18px] text-[#888888]">715</div>
                <div className="font-[400] text-[12px] leading-[18px]">{'/' + '9611'}</div>
            </div>
            <div className="m-auto h-full py-0 px-[5px] flex gap-[10px] items-center justify-center rounded-[10px] bg-[#888888] font-poppins font-[700] text-[7px] leading-[10.5px]">
                COMMON
            </div>
        </div>
        {/** RANKING END */}
        {/** MARKETPLACE SYMBOL START */}
        <img src={MEMarketLogo} alt="marketLogo" className="h-[22px] w-[22.16px]" />
        {/** MARKETPLACE SYMBOL END */}
        {/** PRICE START */}
        <div className="grow flex items-center justify-center gap-[5px] pr-[20px] min-w-0 overflow-x-hidden">
            <div className="font-poppins font-[700] text-[12px] leading-[18px] truncate">{NFTData.MEData.price}</div>
            <img src={solanaLogo} alt="SOL" className="h-[15px] w-[15px] p-0 m-0" />
        </div>
        {/** PRICE END */}
        {/** BUT BUTTON START */}
        <button
            className="w-[88px] min-w-[88px] max-w-[88px] min-h-[25px] max-h-[25px] justify-self-end flex items-center justify-center buynow-filter-button border-transparent border-solid border-2 transition duration-150 px-[10px] py-[5px] gap-[5px] rounded-[5px]"
            onClick={() => buyNow(NFTData.MEData, NFTData.timeListed + NFTData.MEData.tokenMint + String(NFTData.MEData.price))}
        >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 7.5C0 3.63401 3.13401 0.5 7 0.5C10.866 0.5 14 3.63401 14 7.5C14 11.366 10.866 14.5 7 14.5C3.13401 14.5 0 11.366 0 7.5ZM6.36364 1.80768V3.36364C6.36364 3.71509 6.64855 4 7 4C7.35145 4 7.63636 3.71509 7.63636 3.36364V1.80768C10.291 2.10114 12.3989 4.20897 12.6923 6.86364H10.8182C10.4667 6.86364 10.1818 7.14855 10.1818 7.5C10.1818 7.85145 10.4667 8.13636 10.8182 8.13636H12.6923C12.3989 10.791 10.291 12.8989 7.63636 13.1923V11.6364C7.63636 11.2849 7.35145 11 7 11C6.64855 11 6.36364 11.2849 6.36364 11.6364V13.1923C3.70897 12.8989 1.60114 10.791 1.30768 8.13636H2.86364C3.21509 8.13636 3.5 7.85145 3.5 7.5C3.5 7.14855 3.21509 6.86364 2.86364 6.86364H1.30768C1.60114 4.20897 3.70897 2.10114 6.36364 1.80768Z"
                    fill="white"
                />
            </svg>

            <div className="font-poppins font-[700] text-[10px] leading-[15px] w-full">BUY NOW</div>
        </button>
        {/** BUT BUTTON END */}
    </li>
);

export default React.memo(EachListing);
