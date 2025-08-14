import { NextFunction, Response, Request } from "express"
import { allowedOrigins } from ".."

export const CorsPermission = (req: Request, res: Response, next: NextFunction) =>{
  const origin = req.headers.origin
  const referer = req.headers.referer

  const isOriginAllowed = origin && allowedOrigins.includes(origin)
  const isRefererAllowed = referer && allowedOrigins.some(url => referer.startsWith(url))

  if (!origin && !referer) {
    return next();
  }

  if (isOriginAllowed || isRefererAllowed){
    next()
  }
  else{
    res.status(403).json({message: 'Acesso negado'})
  }
}