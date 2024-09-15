import { IncomingMessage } from 'http'
export default function bodyData(req: IncomingMessage): Promise<{[key: string]: any}>
