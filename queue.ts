import Queue, { Job, QueueOptions } from 'bull'

// -------------------- QUEUES
// กำหนดค่า Redis และ QueueOptions
const queueOptions: QueueOptions = {
    redis: { host: '127.0.0.1', port: 6379 },
    defaultJobOptions: {
        removeOnComplete: true,  // ลบ job ออกจากคิวเมื่อ job สำเร็จ
        removeOnFail: true,      // ลบ job ออกจากคิวเมื่อ job ล้มเหลว
        attempts: 3              // จำนวนครั้งที่จะพยายามทำงานอีกครั้งหลังจากล้มเหลว
    }
}

// สร้างคิว testQueue
const testQueue: any = new Queue('Test_Queue', queueOptions)

// สร้าง process handler สำหรับ job ในคิว
const testQueueProcess = async (job: Job) => {
    await new Promise(resolve => setTimeout(resolve, 5000))
    console.log(job.data)
}

// สร้าง worker queue
const workerQueue = () => {
    testQueue.process(5, testQueueProcess) // กำหนด concurrency เป็น 5

    // เพิ่ม event listener สำหรับคิว
    testQueue.on('active', (job: Job) => {
        console.info(`### testQueue ${job.id} ACTIVE ###`)
    })

    testQueue.on('completed', (job: Job) => {
        console.info(`### testQueue ${job.id} completed ###`)
        job.remove() // ลบ job เมื่อเสร็จสิ้น
    })

    testQueue.on('failed', (job: Job, err: Error) => {
        console.info(`### testQueue ${job.id} failed ###`)
        console.log(err)
        job.remove() // ลบ job เมื่อเกิดข้อผิดพลาด
    })

    testQueue.on('error', (err: Error) => {
        console.info(`### testQueue ERROR ###`)
        console.log(err)
    })
}

export default {
    testQueue,
    workerQueue,
}