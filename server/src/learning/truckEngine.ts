import {
     TruckState,
     TruckPart,
    LearningCategory
 } from "./types.js";

 export function installPart(

    truck: TruckState,

    category: LearningCategory

 ): TruckState {

    const installedParts = truck.installedParts.map((part) => {

        if (part.category !== category) {
            return part;
        }

        return {
            ...part,

            installed: true,
        };

    });

    const completed = installedParts.every(
        (part) => part.installed
    );

    return {

        installedParts,

        completed,
    };

    
 }