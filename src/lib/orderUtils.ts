export const generateOrderNumber = (): string => {
    const prefix = "NV"; 
    const randomNum = Math.floor(Math.random() * 1000000);
    return `${prefix}${randomNum}`;
};