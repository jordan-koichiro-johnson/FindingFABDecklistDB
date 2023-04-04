const fs = require('fs')
const axios = require('axios')
const querystring = require('querystring')
const url = 'http://127.0.0.1:8090/api/collections/decklists/records?page=1&perPage=30'




const heroes = [
    "uzuri", "arakni", "riptide", "yoji", "emperor", "dromai", "fai", "iyslander", "azalea", "benji", "boltyn", "bravo", "briar", "chane", "dash", "data doll", "star of the show", "dorinthea", "genis", "ira", "kano", "kassai", "katsu", "kavdaen", "kayo", "levia", "lexi", "oldhim", "prism", "rhinar", "shiyana", "valda", "viserai"
]

let listOfDecklists = []

fs.readFile('listJSON.json', (err, data) => {
    if (err) {
        console.error(err);
    } else {





        const jsonData = JSON.parse(data);


        for (let n = 0; n < jsonData.length; n++) {
            let playerName
            let heroFlag = false
            let heroName
            let format
            let equips
            let cards
            let greys
            let reds
            let yellows
            let blues
            let decklist = []
            let deckMetaData = jsonData[n][0].toLowerCase()

            for (let i = 0; i < heroes.length; i++) {
                if (deckMetaData.includes(heroes[i])) {
                    heroFlag = true
                    heroName = heroes[i]
                    break
                }
            }
            let start = 17
            let end = deckMetaData.indexOf("\n")
            let result = deckMetaData.substring(start, end)
            if (deckMetaData.includes('blitz')) {
                format = 'blitz'
            }
            if (deckMetaData.includes("classic constructed")) {
                format = 'cc'
            }
            if (deckMetaData.includes("cc")) {
                format = 'cc'
            }
            playerName = result
            equips = jsonData[n][1].split('\n')
            equips.shift()

            for (let i = 2; i < jsonData[n].length; i++) {
                if (jsonData[n][i]) {
                    cards = jsonData[n][i].split('\n')
                    cards.shift()
                    if (jsonData[n][i].includes('Pitch 1')) {
                        reds = cards
                    }
                    else if (jsonData[n][i].includes('Pitch 2')) {
                        yellows = cards
                    }
                    else if (jsonData[n][i].includes('Pitch 3')) {
                        blues = cards
                    }
                    else {
                        greys = cards
                    }
                }
            }
            let deckObj = {
                Author: playerName,
                Hero: heroName,
                Format: format,
                Equips: equips,
                Reds: reds,
                Yellows: yellows,
                Blues: blues,
                Greys: greys
            }
            decklist.push(deckObj)
            listOfDecklists.push(decklist)
            axios.post(url, { deck: deckObj }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }

        // fs.writeFile(`listofdecklists1.json`, JSON.stringify(listOfDecklists), { flag: 'w' }, function (err) {
        //     if (err) throw err;
        //     console.log('File is created successfully.');

        // })
    }
})