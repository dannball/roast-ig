import { igApi } from 'insta-fetcher';

const rand = (array) => array[Math.floor(Math.random() * array.length)];

export const extractDataInstagram = async (username) => {
    try {
        const { COOKIE_INSTAGRAM } = process.env;
        if (!COOKIE_INSTAGRAM) throw new Error("Empty cookie instagram!");
        const IGAPI = new igApi(rand((COOKIE_INSTAGRAM || '').split('|')));
        const result = await IGAPI.fetchUserV2(username);
        const resultPost = await IGAPI.fetchUserPostsV2(username);
        return {
            ...result,
            post: resultPost.edges.slice(0, 15)
        };
    } catch(err) {
        console.error(err)
    }
}