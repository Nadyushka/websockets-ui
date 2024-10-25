export const prepareJsonResponse = (type: string, data: string): string => {
    return JSON.stringify({
        type,
        data,
        id: 0
    })
}
