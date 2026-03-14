import { type NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    return new NextResponse(
        `
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Hosting Suspended</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background-color: black;
                    color: red;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    text-align: center;
                }
                .container {
                    padding: 20px;
                }
                h1 {
                    font-size: 2rem;
                    margin-bottom: 1rem;
                    font-weight: 500;
                }
                p {
                    font-size: 1.2rem;
                    color: #fff;
                    opacity: 0.8;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Услуги хостинга приостановлены.</h1>
                <p>Для восстановления доступа обратитесь к администратору (Error: Payment Required)</p>
            </div>
        </body>
        </html>
        `,
        {
            status: 402,
            headers: {
                'content-type': 'text/html; charset=utf-8',
            },
        }
    )
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}

