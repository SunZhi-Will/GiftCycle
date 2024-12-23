export interface ImgurResponse {
    data: {
        id: string;
        link: string;
        deletehash: string;
    };
    success: boolean;
    status: number;
}

export const uploadToImgur = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
            Authorization: `Client-ID ${process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID}`,
        },
        body: formData,
    });

    if (!response.ok) throw new Error('Imgur upload failed');

    const data: ImgurResponse = await response.json();
    return data.data.link;
}; 