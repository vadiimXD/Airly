export default async function requester(url: string, method: string, headers?: boolean, body?: {}) {
    let options: any = {}

    if (method == "GET") {
        return await fetch(url)
    }

    options.method = method

    if (headers) {
        options.headers = {
            'Content-Type': 'application/json'
        }
    }

    if (body) {
        options.body = JSON.stringify(body)
    }

    return await fetch(url, options)
}