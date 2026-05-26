import api from './axiosClient';

export async function getSocialLinks() {
    const reponse = await api.get('/me/sociallinks');

    return response.data;
}

export async function getSocialLink(socialLinkId) {
    const reponse = await api.get(`/me/sociallinks/${socialLinkId}`);

    return response.data;
}

export async function createSocialLink(payload) {
    const response = await api.post('/me/sociallinks', {
        name: payload.name
    })

    return response.data;
}

export async function deleteSocialLink(socialLinkId) {
    const response = await api.delete(`/me/sociallinks/${socialLinkId}`);

    return response.data;
}