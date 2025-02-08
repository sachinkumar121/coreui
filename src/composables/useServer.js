import store from '../store';

export default function useServer() {
    const server_options = [
        {
            label: 'ConfigDefault',
            value: import.meta.env.VITE_EXT_BASE_URL
        },
        {
            label: 'Localhost',
            value: 'http://localhost:3001/'
        },
        {
            label: 'EU Production',
            value: 'https://euskyschedwebapi.silverskysoft.com/'
        },
        {
            label: 'EU test',
            value: 'https://euskyschedwebapi.test.silverskysoft.com/'
        },
        {
            label: 'US Production',
            value: 'https://skyschedwebapi.silverskysoft.com/'
        },
        {
            label: 'US test',
            value: 'https://skyschedwebapi.test.silverskysoft.com/'
        }
    ];

    const getSelectedServerObj = () => {
        let server_url = store.state.skysched_global_api_base_url || import.meta.env.VITE_EXT_BASE_URL;
        return server_options.find(so => so.value == server_url);
    }

    return {
        server_options,
        getSelectedServerObj
    }
}