const csv = require('csv-parser')
const fs = require('fs');
const results = [];

const writeStream = fs.createWriteStream('./formatted-data.json')

writeStream.on('close', () =>
    console.log('Data formatted en written to formatted-data.json'))
fs.createReadStream('./dataset.csv')
    .pipe(csv({separator: ';'}))
    .on('data', (data) => results.push(data))
    .on('end', () => {
        const onlyMedals = results.filter(filterMedals);
        const sortedData = sortPerYear(onlyMedals);

        countNumberOfMedals(sortedData);

        const modifiedArray = sortedData.map(
            ({noc, years}) => ({
                noc,
                years: years.map(
                    ({year, eventsWithGoldenMedal, eventsWithSilverMedal, eventsWithBronzeMedal}) => ({
                        year,
                        g: eventsWithGoldenMedal.length,
                        s: eventsWithSilverMedal.length,
                        b: eventsWithBronzeMedal.length
                    }))
            })
        )

        writeStream.write(JSON.stringify(modifiedArray));
        writeStream.end();
    });


function filterMedals(data) {
    if (data.medal) return data
}

function sortPerYear(data) {
    const mappedData = [];

    for (let i = 0; i < data.length; i++) {
        const noc = mappedData.find(mappedData => mappedData.noc === data[i].noc);
        if (noc) {
            const year = noc.years.find(year => year.year === data[i].year)
            if (year) year.participants.push(data[i])
            else noc.years.push({
                year: data[i].year,
                participants: [data[i]]
            })
        } else {
            mappedData.push({
                noc: data[i].noc,
                years: [{
                    year: data[i].year,
                    participants: [data[i]]
                }]
            })
        }
    }
    return mappedData.sort((a, b) => {
        if (a.noc > b.noc) return 1
        else if (a.noc < b.noc) return -1
        return 0;
    });
}

function countNumberOfMedals(data) {
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].years.length; j++) {
            data[i].years[j].eventsWithGoldenMedal = []
            data[i].years[j].eventsWithSilverMedal = []
            data[i].years[j].eventsWithBronzeMedal = []

            for (let k = 0; k < data[i].years[j].participants.length; k++) {
                if (data[i].years[j].participants[k].medal.toUpperCase() === 'GOLD' && !data[i].years[j].eventsWithGoldenMedal.find(event => event === data[i].years[j].participants[k].event)) data[i].years[j].eventsWithGoldenMedal.push(data[i].years[j].participants[k].event)
                if (data[i].years[j].participants[k].medal.toUpperCase() === 'SILVER' && !data[i].years[j].eventsWithSilverMedal.find(event => event === data[i].years[j].participants[k].event)) data[i].years[j].eventsWithSilverMedal.push(data[i].years[j].participants[k].event)
                if (data[i].years[j].participants[k].medal.toUpperCase() === 'BRONZE' && !data[i].years[j].eventsWithBronzeMedal.find(event => event === data[i].years[j].participants[k].event)) data[i].years[j].eventsWithBronzeMedal.push(data[i].years[j].participants[k].event)
            }
        }
    }
}