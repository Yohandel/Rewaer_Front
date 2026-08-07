import { API_URL } from "../config/api";


export const getImageUrl = (
    image?: string | null
) => {

    if (!image)
        return "/images/no-image.png";

    return `${API_URL}${image}`;
};