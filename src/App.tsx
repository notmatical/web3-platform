import { useMemo } from 'react';
import Routes from 'routes';

// project imports
import Locales from 'components/Locales';
import NavigationScroll from 'layout/NavigationScroll';
import ThemeCustomization from 'themes';

// third-party
import { ToastContainer } from 'react-toastify';
import { RecoilRoot } from 'recoil';

// providers
import { MetaProvider } from 'contexts/meta/meta';
import { CoinGeckoProvider } from 'contexts/CoinGecko';

// auth provider
import { AuthProvider } from 'contexts/AuthContext';
import { WalletContext } from 'contexts/WalletContext';
import { LoaderProvider } from 'components/BoxLoader';
import { HyperspaceProvider } from 'contexts/HyperspaceContext';

const App = () => (
    <AuthProvider>
        <WalletContext>
            <CoinGeckoProvider>
                <HyperspaceProvider>
                    <ThemeCustomization>
                        <Locales>
                            <NavigationScroll>
                                <MetaProvider>
                                    <LoaderProvider>
                                        <RecoilRoot>
                                            <Routes />
                                            <ToastContainer
                                                position="bottom-right"
                                                autoClose={5000}
                                                hideProgressBar={false}
                                                newestOnTop={false}
                                                draggable={false}
                                                pauseOnHover={false}
                                                theme="colored"
                                                limit={5}
                                            />
                                        </RecoilRoot>
                                    </LoaderProvider>
                                </MetaProvider>
                            </NavigationScroll>
                        </Locales>
                    </ThemeCustomization>
                </HyperspaceProvider>
            </CoinGeckoProvider>
        </WalletContext>
    </AuthProvider>
);

export default App;
