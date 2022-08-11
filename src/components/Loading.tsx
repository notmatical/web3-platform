import { HashLoader } from 'react-spinners';

export default function Loading(props: { size?: number; color?: string }) {
    const { size = 32, color = '#3c23cd' } = props;
    return <HashLoader size={size} color={color} />;
}
