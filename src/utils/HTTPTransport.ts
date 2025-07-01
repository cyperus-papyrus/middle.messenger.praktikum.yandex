enum HTTPMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
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
        this.baseUrl = baseUrl;
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

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const requestUrl = isGet && data
                ? `${fullUrl}${this.queryStringify(data as Record<string, unknown>)}`
                : fullUrl;

            xhr.open(method, requestUrl);
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        resolve(xhr.responseText
                            ? JSON.parse(xhr.responseText) as T
                            : null as unknown as T);
                    } catch {
                        reject(new Error('Invalid JSON response'));
                    }
                } else {
                    reject(new Error(`Request failed with status ${xhr.status}`));
                }
            };

            xhr.onabort = () => reject(new Error('Request aborted'));
            xhr.onerror = () => reject(new Error('Network error'));
            xhr.ontimeout = () => reject(new Error('Request timed out'));
            xhr.timeout = 5000;

            if (isGet || !data) {
                xhr.send();
            } else {
                xhr.send(JSON.stringify(data));
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
