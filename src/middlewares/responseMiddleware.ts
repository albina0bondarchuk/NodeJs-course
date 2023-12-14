/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request } from 'express'

const responceMiddleware = (req: Request, res: any, next: NextFunction) => {
    res.badRequest = (message = {}) => {
        res.status(400).json(message)
    }

    res.forbidden = (message = {}) => {
        res.status(403).json(message)
    }

    res.notFound = (message = {}) => {
        res.status(404).json(message)
    }

    res.serverError = (message = {}) => {
        res.status(500).json(message)
    }

    res.successRequest = (data = {}) => {
        res.status(200).json(data)
    }

    next()
}

export default responceMiddleware
