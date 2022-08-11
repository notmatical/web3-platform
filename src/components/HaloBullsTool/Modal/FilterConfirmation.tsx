import { priceAtom, quantityAtom } from 'views/cosmic-astro/sniping/recoil/atom/SniperToolAtom';
import { useRecoilValue } from 'recoil';

const FilterConfirmation = () => {
    const quantity = useRecoilValue(quantityAtom);
    const price = useRecoilValue(priceAtom);

    return (
        <div className="text-lg flex flex-col">
            <div className="font-bold">You have chosen the following parameters:</div>
            <div className="flex">
                <div className="font-bold">Quantity:&nbsp;</div>
                <div>{quantity}</div>
            </div>
            <div className="flex">
                <div className="font-bold">Price:&nbsp;</div>
                <div>{`◎ ${String(Number(price.max).toPrecision(4))}`}</div>
            </div>
        </div>
    );
};

export default FilterConfirmation;
