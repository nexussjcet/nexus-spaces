export const imageFormat = async (fileList: File[]): Promise<{type: "image", image: string}[]> => {
    const files: {type: "image", image: string}[] = [];
    for await (const file of fileList) {
        const promise = new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve({
                    type: "image",
                    image: reader.result?.toString().split(",")[1],
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
        await promise.then((data: any) => files.push(data));
    };
    return files;
};

export const textFormat = async (message: string): Promise<{type: "text", text: string}[]> => {
    const text: { type: "text", text: string}[] = [];
    text.push({
        type: "text",
        text: message
    });
    return text;
}