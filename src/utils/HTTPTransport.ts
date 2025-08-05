export const mainURL = `https://ya-praktikum.tech/api/v2`

export enum HTTPMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

export enum HttpStatus {
    Ok = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    Conflict = 409,
    InternalServerError = 500,
}

type RequestOptions = {
    method: HTTPMethod;
    data?: unknown;
    headers?: Record<string, string>;
};

type HTTPFunction = <T>(url: string, data?: unknown) => Promise<T>;

export default class HTTPTransport {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = `${mainURL}${baseUrl}`;
    }

    private createMethod(method: HTTPMethod): HTTPFunction {
        return <T>(url: string, data?: unknown) => {
            return this.request<T>(url, { method, data });
        };
    }

    public get = this.createMethod(HTTPMethod.GET);
    public post = this.createMethod(HTTPMethod.POST);
    public put = this.createMethod(HTTPMethod.PUT);
    public delete = this.createMethod(HTTPMethod.DELETE);

    private request<T>(url: string, options: RequestOptions): Promise<T> {
        const { method, data } = options;
        const fullUrl = `${this.baseUrl}${url}`;
        const isGet = method === HTTPMethod.GET;
        const isFormData = data instanceof FormData;

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const requestUrl = isGet && data
                ? `${fullUrl}${this.queryStringify(data as Record<string, unknown>)}`
                : fullUrl;

            xhr.open(method, requestUrl);
            xhr.withCredentials = true;
            if (!isFormData) {
                xhr.setRequestHeader('Content-Type', 'application/json');
            }
            xhr.onload = () => {
                switch (xhr.status) {
                    case HttpStatus.Ok:
                    case HttpStatus.Created:
                        if (xhr.responseText === "OK") {
                            resolve(null as unknown as T);
                        } else {
                            try {
                                resolve(JSON.parse(xhr.responseText) as T);
                            } catch {
                                reject(new Error('Invalid JSON response'));
                            }
                        }
                        break;
                    case HttpStatus.NoContent:
                        resolve(null as unknown as T);
                        break;

                    case HttpStatus.BadRequest:
                        reject(new Error(`Bad Request (${xhr.status})`));
                        break;
                    case HttpStatus.Unauthorized:
                        reject(new Error(`Unauthorized (${xhr.status})`));
                        break;
                    case HttpStatus.Forbidden:
                        reject(new Error(`Forbidden (${xhr.status})`));
                        break;
                    case HttpStatus.NotFound:
                        reject(new Error(`Not Found (${xhr.status})`));
                        break;
                    case HttpStatus.Conflict:
                        reject(new Error(`Conflict (${xhr.status})`));
                        break;
                    case HttpStatus.InternalServerError:
                        reject(new Error(`Internal Server Error (${xhr.status})`));
                        break;

                    default:
                        if (xhr.status >= 200 && xhr.status < 300) {
                            resolve(xhr.responseText as unknown as T);
                        } else {
                            reject(new Error(`Unhandled status: ${xhr.status}`));
                        }
                }
            };
            xhr.onabort = () => reject(new Error('Request aborted'));
            xhr.onerror = () => reject(new Error('Network error'));
            xhr.ontimeout = () => reject(new Error('Request timed out'));
            xhr.timeout = 5000;

            if (isGet || !data) {
                xhr.send();
            } else {
                if (isFormData) {
                    xhr.send(data as FormData);
                } else {
                    xhr.send(JSON.stringify(data));
                }
            }
        });
    }

    private queryStringify(data: Record<string, unknown>): string {
        return Object.entries(data).reduce((query, [key, value], index) => {
            const prefix = index === 0 ? '?' : '&';
            const encodedValue = encodeURIComponent(String(value));
            return `${query}${prefix}${key}=${encodedValue}`;
        }, '');
    }
}
