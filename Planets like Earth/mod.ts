//Program to find habitable planets around the universe using Nasa data

import {join} from "https://deno.land/std/path/mod.ts";
import {BufReader} from "https://deno.land/std/io/bufio.ts"
import {parse} from  "https://deno.land/std/encoding/csv.ts"
import  * as _ from "https://raw.githubusercontent.com/lodash/lodash/es/lodash.js"





interface Planet{                      //For type assertion
    [key : string] : string
}

async function loadPlanetsData(){
    const path = join(".","kepler_exoplanets_nasa.csv")
    const file = await Deno.open(path);
    const bufReader = new BufReader(file);
    const result = await parse(bufReader,{
        header : true,
        comment :"#",
    });

    Deno.close(file.rid);
    const planets = (result as Array<Planet>).filter((planet)=>{
        const massPlanet= Number(planet["koi_smass"])
        const planetaryRadius = Number(planet["koi_prad"])
        const radiusPlanet = Number(planet["koi_srad"])
    
        return planet["koi_disposition"] === "CONFIRMED" && 
        planetaryRadius > 0.5 && 
        planetaryRadius < 1.5 && 
        massPlanet > 0.78 && massPlanet < 1.04 &&
        radiusPlanet >0.99 && radiusPlanet <1.01;
      });

    return planets.map((planet)=>{
        return _.pick(planet,[
            "koi_prad",
            "koi_smass",
            "koi_srad",
            "kepler_name",
            "koi_count",
            "koi_steff"
        ])
    });
}

const newEarths= await loadPlanetsData();
console.log(`${newEarths.length} habitable planets found!!!!`)

for(const data of newEarths){
    console.log(data)
}