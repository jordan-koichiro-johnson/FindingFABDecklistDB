const puppeteer = require('puppeteer');

const fs = require('fs');



(async () => {

    let listOfLists = []
    const browser = await puppeteer.launch()

    const fabList = await browser.newPage()

    for (let n = 4; n < 36; n++) {
        console.log(n)

        for (let i = 2; i < 52; i++) {
            await fabList.goto(`https://fabtcg.com/decklists/?page=${n}`, {
                waitUntil: 'load',
                // Remove the timeout
                timeout: 0
            })

            let link = await fabList.evaluate((index) => {

                let deckListLink = document.querySelector(`.block-table > table > tbody > tr:nth-child(${index}) > td:nth-child(3) > a`).href

                return deckListLink
            }, i)

            await fabList.goto(link, {
                waitUntil: 'load',
                // Remove the timeout
                timeout: 0
            })

            let list = await fabList.evaluate(() => {
                let list = document.querySelectorAll('table')
                let listArr = []
                for (let i = 0; i < list.length; i++) {
                    let item = list[i].innerText

                    listArr.push(item)
                }
                return listArr
            })
            let listArr = []
            for (let i = 0; i < list.length; i++) {

                listArr.push(list[i])
            }

            listOfLists.push(listArr)
        }

        fs.writeFile(`listJSON${n}.json`, JSON.stringify(listOfLists), function (err) {
            if (err) throw err;
            console.log('File is created successfully.');
        })

    }
    await browser.close()
// })();