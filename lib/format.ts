// This function will take in an array of File objects and convert them to base64 strings (for LLM compatibility)
export const base64 = async (fileList: File[]): Promise<string[]> => {
    const files: string[] = [];
    for await (const file of fileList) {
        const promise = new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result?.toString().split(",")[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
        await promise.then((data: any) => files.push(data));
    };
    return files;
};