// @ts-nocheck
// for some reason, PhpStorm tsc checks are complaining about this file. I don't know why. For some reason
// it thinks I haven't configured tsconfig correctly.

import {Client, Location, LocationFilterTypes, ServiceTypes} from "./lib/client";

const cbp = new Client();

const query = {
    filterTimestampBy: LocationFilterTypes.Before,
    timestamp: "2053-03-14",
    minimum: 1,
    serviceName: ServiceTypes.GlobalEntry
}

const filter = (location: Location) => {
    const whitelist = [
        "Las Vegas Enrollment Center",
        "Los Angeles International Global Entry EC",
        "Detroit Enrollment Center Global Entry",
        "Seatac International Airport Global Entry EC",
        "Fairbanks Enrollment Center"
    ]

    return whitelist.includes(location.name)
}

async function doQuery() {
    const locations = await cbp.slotsAsLocations(query)
    const filtered = locations.filter(filter)
    console.log(`Found ${locations.length} locations, filter match: ${filtered.length}.`)

    filtered.forEach(async f => {
        console.log(`Checking slots for ${f.name}...`)
        const slots = await cbp.slots({locationId: f.id})
        console.log(`${slots.length} slots. First slot: ${slots[0].startTimestamp}`)
    })
}

doQuery()
