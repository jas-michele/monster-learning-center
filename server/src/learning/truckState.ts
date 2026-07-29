import { TruckState,  LearningCategory } from "./types.js";

export function createTruckState(): TruckState {
    return {
        installedParts: [
            {
                part: "front_left_tire",
                category: "letters",
                installed: false,
            },
            {
                part: "front_right_tire",
                category: "numbers",
                installed: false,
            },
            {
                part: "rear_left_tire",
                category: "colors",
                installed: false,
            },
            {
                part: "rear_right_tire",
                category: "shapes",
                installed: false,
            }
        ],
        completed: false
    };
}

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
        completed
    }
}

