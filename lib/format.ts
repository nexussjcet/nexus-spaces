export const imageFormat = async (fileList: File[]): Promise<{type: "image", image: string}[]> => {
    const files: {type: "image", image: string}[] = [];
    for (const file of fileList) {
        console.log(JSON.stringify(file))
        const promise = new Promise((resolve, reject) => {
            file.arrayBuffer()
                .then((buffer) => {
                    const base64Image = Buffer.from(buffer).toString("base64");
                    resolve({
                        type: "image",
                        image: base64Image,
                    });
                })
                .catch(reject);
        });
        await promise.then((data: any) => files.push(data));
    }
    return files;
};

export const textFormat = async (message: string): Promise<{type: "text", text: string}[]> => {
    const text: {type: "text", text: string}[] = [];
    text.push({
        type: "text",
        text: message
    });
    return text;
}