// A tiny wrapper around fetch(), borrowed from
// https://kentcdodds.com/blog/replace-axios-with-a-simple-custom-fetch-wrapper

import axios from "axios"

export async function api(endpoint, {body, ...customConfig} = {}) {
    const headers = {'Content-Type': 'application/json'}

    const config = {
        method: body ? 'POST' : 'GET',
        mode: 'no-cors',
        ...customConfig,
        headers: {
            ...headers,
            ...customConfig.headers,
        },
    }

    if (body) {
        config.body = JSON.stringify(body)
    }

    let data
    try {
        console.log(`thing = ${process.env.REACT_APP_API_LINK}`)
        const response = await window.fetch(process.env.REACT_APP_API_LINK + endpoint, config)
        data = await response.json()
        if (response.ok) {
            return data
        }
        throw new Error(response.statusText)
    } catch (err) {
        return Promise.reject(err.message ? err.message : data)
    }
}

api.get = async function (endpoint, token, customConfig = {}) {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    let data = await axios.get(process.env.REACT_APP_API_LINK + endpoint, config);
    return data.data;
}

api.post = async function (endpoint, body, token, customConfig = {}) {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    let data = await axios.post(process.env.REACT_APP_API_LINK + endpoint, body, config);

    return data.data;
}
