import { WalletBalanceAtom } from 'views/cosmic-astro/sniping/recoil/atom/SniperToolAtom';
import { useRecoilValue } from 'recoil';

const WalletBalanceLow = () => {
    const walletBalance = useRecoilValue(WalletBalanceAtom);
    return (
        <div className="text-white flex flex-col">
            <div className="text-[#DABC40]">Wallet balance is too low.</div>
            <div>{`Current wallet balance: ◎ ${Number(walletBalance).toPrecision(4)}`}</div>
        </div>
    );
};

export default WalletBalanceLow;
