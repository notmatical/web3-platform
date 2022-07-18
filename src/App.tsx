import { useMemo } from 'react';
import Routes from 'routes';

// project imports
import Locales from 'components/Locales';
import NavigationScroll from 'layout/NavigationScroll';
import Snackbar from 'components/@extended/Snackbar';
import ThemeCustomization from 'themes';

// third-party
import { ConfirmProvider } from 'material-ui-confirm';
import { ToastContainer } from 'react-toastify';

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
                        <ConfirmProvider
                            defaultOptions={{
                                confirmationText: 'Confirm',
                                cancellationButtonProps: { variant: 'outlined' },
                                confirmationButtonProps: { variant: 'contained', color: 'secondary' }
                            }}
                        >
                            <Locales>
                                <NavigationScroll>
                                    <MetaProvider>
                                        <LoaderProvider>
                                            <>
                                                <Routes />
                                                <Snackbar />
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
                                            </>
                                        </LoaderProvider>
                                    </MetaProvider>
                                </NavigationScroll>
                            </Locales>
                        </ConfirmProvider>
                    </ThemeCustomization>
                </HyperspaceProvider>
            </CoinGeckoProvider>
        </WalletContext>
    </AuthProvider>
);

export default App;
