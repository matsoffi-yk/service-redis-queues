import express, { Application, Request, Response } from 'express'
const app: Application = express()

app.get('/', (req: Request, res: Response) => {
    res.json({
        res_code: '0000',
        res_desc: 'Hello world'
    })
})

app.listen(3001, () => {
    console.info('Start Running Port 3001')
})