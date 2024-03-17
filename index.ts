import express, { Application, NextFunction, Request, Response } from 'express'
import queue from './queue'

// -------------------- EXPRESS
const app: Application = express()

// กำหนดเส้นทางการใช้งาน Express
app.use(express.json())

// สร้าง middleware สำหรับเพิ่ม job เข้าคิว
const testQueueService = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const text = req.body.text
        await queue.testQueue.add({ text }) // เพิ่ม job เข้าคิว
        res.locals.text = text
        next()
    } catch (err) {
        console.log(err)
        next(err) // ส่ง error ไปยัง middleware ถัดไป
    }
}

// เส้นทางสำหรับเพิ่ม job เข้าคิว
app.get('/',
    testQueueService(),
    async (req: Request, res: Response, next: NextFunction) => {
        res.json({
            res_code: '0000',
            res_desc: res.locals.text
        })
    }
)

// เส้นทางสำหรับดึงข้อมูล job จากคิว
app.get('/jobs', async (req: Request, res: Response) => {
    try {
        const jobs = await queue.testQueue.getJobs() // ดึงข้อมูล job จากคิว
        res.json(jobs)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

// เริ่มต้น Express server
const PORT = 3001
app.listen(PORT, () => {
    console.info(`Server is running on port ${PORT}`)
    queue.workerQueue() // เรียกใช้ workerQueue เมื่อ server เริ่มต้น
})
