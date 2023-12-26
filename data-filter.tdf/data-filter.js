const csv = require('csv-parser')
const fs = require('fs');
const {parse, format} = require("date-fns");

let biggestMargin = 0;
let smallestMargin = 100;

let longestRace = 0;
let shortestRace = 10000;

let ridersWithMoreThanOneWin = 0;

const writeStream = fs.createWriteStream('./formatted-data.json')
    .on('error', (err) => console.log(err))
    .on('close', () => console.log('Data formatted and written to formatted-data.json'))

Promise.all([
    readAndParseCSV('tdf_stages.csv'),
    readAndParseCSV('tdf_winners.csv'),
]).then((data) => {
    const stages = mapNumberOfStages(data[0]);
    const winners = data[1].map(d => mapWinners(d, stages));

    const riders = {};
    winners.forEach((obj) => {
        const winnerName = obj.winner.name;
        riders[winnerName] = (riders[winnerName] || 0) + 1;
    });

    const ridersWithMoreThanOneWin = Object.keys(riders).filter((name) => riders[name] > 1);

    console.log('margins: ')
    console.log(`Biggest margin: ${biggestMargin}`)
    console.log(`Smallest margin: ${smallestMargin}`)
    console.log()
    console.log('distance: ')
    console.log(`Longest race: ${longestRace}`)
    console.log(`Shortest race: ${shortestRace}`)
    console.log()
    console.log(`Number of riders with more than one win: ${ridersWithMoreThanOneWin.length}`)
    console.log('---')

    writeStream.write(JSON.stringify(winners));
    writeStream.end();
})

function mapNumberOfStages(stages) {
    let yearCounts = {};

    for (let i = 0; i < stages.length; i++) {
        const year = format(parse(stages[i].Date, 'yyyy-MM-dd', new Date()), 'yyyy')

        if (yearCounts[year]) yearCounts[year]++
        else yearCounts[year] = 1

    }
    return yearCounts;
}

function mapWinners(winner, stages) {
    if (parseFloat(winner.time_margin) > biggestMargin) biggestMargin = parseFloat(winner.time_margin)
    if (parseFloat(winner.time_margin) < smallestMargin) smallestMargin = parseFloat(winner.time_margin)
    if (parseFloat(winner.distance) > longestRace) longestRace = parseFloat(winner.distance)
    if (parseFloat(winner.distance) < shortestRace) shortestRace = parseFloat(winner.distance)

    return {
        edition: winner.edition,
        year: format(parse(winner.start_date, 'yyyy-MM-dd', new Date()), 'yyyy'),
        distance: parseFloat(winner.distance),
        totalStages: stages[format(parse(winner.start_date, 'yyyy-MM-dd', new Date()), 'yyyy')],
        stageWins: parseInt(winner.stage_wins),
        stagesLed: parseInt(winner.stages_led),
        marginNumber: parseFloat(winner.time_margin),
        margin: formatHours(winner.time_margin),
        time: formatHours(winner.time_overall),
        winner: {
            name: winner.winner_name,
            nationality: winner.nationality.trim(),
            team: winner.winner_team
        }
    }
}

function formatHours(hours) {
    if (isNaN(hours) || hours < 0) {
        return "Invalid input";
    }

    const totalSeconds = hours * 3600; // Convert hours to seconds
    return formatTime(totalSeconds);
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.round(seconds % 60);

    return {hours, minutes, seconds: remainingSeconds};
}

async function readAndParseCSV(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
}