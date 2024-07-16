export const fetchWrapper = (url: string): Promise<Response> => {
    return fetch(url)
}