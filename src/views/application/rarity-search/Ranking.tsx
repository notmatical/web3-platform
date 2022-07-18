/* eslint-disable */
import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Stack, Button, TextField, Typography } from '@mui/material';

// project imports
import { getIdFromRank, getMetadataFromId, getRankFromId } from 'actions/rarity';
import MainCard from 'components/MainCard';
import './Ranking.css';

// assets
import MagicEden from 'assets/images/icons/magiceden.svg';
import SolScan from 'assets/images/icons/solscan.svg';

// types
interface RankingProps {
    id: number;
    rank: number;
}

const Ranking = ({ id, rank }: RankingProps) => {
    const [metadata, setMetadata] = useState<any>(null);

    useEffect(() => {
        if (rank !== 0) {
            setMetadata(getMetadataFromId(id));
        }
    }, [id]);

    return (
        <>
            {metadata !== null && (
                <div className="rarity-exploer">
                    <div className="viverorc" style={{ backgroundImage: `url(${metadata.image})` }}>
                        <div className="viveinfo">
                            <div>ID: {id}</div>
                            <div>Rank: {rank}</div>
                        </div>
                        <div className="bg-bl">
                            <a href={`https://solscan.io/token/${metadata.mintKey}`} target="_blank">
                                <img src={SolScan} alt="solscan" draggable="false"/ >
                            </a>
                            <a href={`https://magiceden.io/item-details/${metadata.mintKey}`} target="_blank">
                                <img src={MagicEden} alt="magiceden" draggable="false"/>
                            </a>
                        </div>
                    </div>
                    <div className="rarity-exploer-check">
                        <h2>Check your NFTs ranking</h2>
                        <div className="rarity-list">
                            <div className="rarity-item rarity-item-top">
                                <div className="rarity-top">
                                    <label style={{ width: "120px", display: "inline-block" }}>Rarity:</label>
                                    <div className={`helper-${metadata.tier}`}>
                                        <span style={{ textTransform: "uppercase" }}>{metadata.tier}</span>
                                        <span className="num">{metadata.average}%</span>
                                    </div>
                                </div>
                                <div className="rarity-bottom">
                                    <div className={`progress-bar progress-rarity progress-${metadata.tier}`}>
                                        <span style={{ width: `${metadata.average}%` }}></span>
                                    </div>
                                </div>
                            </div>
                            <hr style={{margin: '0px', width: "100%", border: "1px solid rgb(47, 50, 68)"}}/>
                            {metadata.traitsValue.map((item: any, index: number) => (
                                <div className="rarity-item rarity-item-top" key={index}>
                                    <div className="rarity-top">
                                        <div>
                                            <label style={{width: "120px", display: "inline-block"}}>{item.trait_type}:</label>
                                            <b style={{color: "white"}}>{item.value}</b>
                                        </div>
                                        <div>
                                            <span className="helper">{ item.percentage } %</span>
                                        </div>
                                    </div>
                                    <div className="rarity-bottom">
                                        <div className="progress-bar progress-rarity progress-light">
                                            <span style={{width: `${item.percentage}%`}}></span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Ranking;
