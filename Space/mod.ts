import * as log from "https://deno.land/std/log/mod.ts";
import  * as _ from "https://raw.githubusercontent.com/lodash/lodash/es/lodash.js"



interface Launch{
    flightNumber : number;
    mission : string;
    rocket : string;
    customers : Array<string>;
}

const launches = new Map<number, Launch>();

export async function downloadLaunchData(){

    log.info("Downloading launch data...")
    const response = await fetch("https://api.spacexdata.com/v3/launches",{
        method: "GET",
    });

    if(!response.ok){
        log.warning("Problem while downloading launch data")
        throw new Error("launch data download failed")
    }


    const launchData = await response.json();
    for(const data of launchData){
        const payloads = data["rocket"]["second_stage"]["payloads"];
        const customers = _.flatMap(payloads,(payload : any)=>{
            return payload["customers"];
        })
        const flight={
            flightNumber : data["flight_number"],
            mission : data["mission_name"],
            rocket : data["rocket"]["rocket_name"],
            customers : customers
        };

        launches.set(flight.flightNumber, flight);

        log.info(JSON.stringify(flight))
    }
    //console.log(launchData)
}

//If we need to export the function to be used as a stand alone module
if(import.meta.main){
    await downloadLaunchData();
    log.info(JSON.stringify(import.meta))
    log.info(`Downloaded data for ${launches.size} SpaceX launches`)
    
}

