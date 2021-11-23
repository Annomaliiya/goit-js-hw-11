const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "24480892-2cf9ff0ac9dbac3af2a958edd";

export const fetchImages = query => {

    return fetch(
        `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`,
    ).then(response => {
        if (!response.ok) {
            throw new Error(response.status);
        }

        return response.json();
    });
};
