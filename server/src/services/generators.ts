import pupeteer from 'puppeteer'

export function generateUrlFriendlyToken(length: number = 10): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        token += characters[randomIndex];
    }
    return token;
}

export function dateByString (date: string){
    const [year, month, day] = date.split('-').map(Number)

    return new Date(year, month-1, day)
}

export async function generateBdayPhoto (userId: number) {
    const browser = await pupeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage()

    await page.goto(`http://localhost:3000/photoserver/bday/${userId}`)
    await page.setViewport({ width: 1500, height: 2100 })
    const screenshotBuffer = await page.screenshot({ fullPage: true })
    await browser.close()

    return screenshotBuffer
}