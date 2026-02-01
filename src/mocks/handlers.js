import { HttpResponse } from "msw"


export const handlers = [
    // Get요청 가로채기
    http.get('api/user', () => {
        return HttpResponse.json({
        })
    }),
]