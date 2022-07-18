export const astroCollection = {
    name: 'Cosmic Astronauts',
    mint: require('../assets/mints/cas-mint.json') as string[],
    creator: 'AV1xJmDHEBSigGA99A8SXqdcSMDR3gNywjCeFwTrtMni',
    mintFile: 'cas-mint'
}

export const honoraryCollection = {
    name: 'CAS Honorary',
    creator: ''
}

export const collections = [astroCollection, honoraryCollection];