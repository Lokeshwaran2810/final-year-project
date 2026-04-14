export const PATIENTS = [
    {
        id: "P-101",
        name: "Jai Adithia",
        age: 35,
        gender: "Male",
        bedNumber: "ICU-001",
        diagnosis: "Dehydration",
        ivType: "0.9% NaCl",
        totalVolume: 1000, // mL
    },
    {
        id: "P-102",
        name: "Leslie Alexander",
        age: 42,
        gender: "Female",
        bedNumber: "ICU-002",
        diagnosis: "Post-Surgery",
        ivType: "Ringer Lactate",
        totalVolume: 500,
    },
    {
        id: "P-103",
        name: "Robert Fox",
        age: 56,
        gender: "Male",
        bedNumber: "ICU-003",
        diagnosis: "Infection",
        ivType: "Antibiotics",
        totalVolume: 200,
    },
    {
        id: "P-104",
        name: "Annette Black",
        age: 29,
        gender: "Female",
        bedNumber: "Gen-104",
        diagnosis: "Vitamin Deficiency",
        ivType: "Multivitamins",
        totalVolume: 100,
    }
];

export const generateMockData = (patients) => {
    return patients.map(patient => {
        // Randomly simulate slight fluctuations or issues
        const isCritical = Math.random() > 0.95;
        const isWarning = Math.random() > 0.85;

        let status = "Normal";
        let flowRate = 100 + Math.floor(Math.random() * 10); // Base 150 ml/hr
        let dripRate = 50 + Math.floor(Math.random() * 5); // Base 50 gtt/min

        if (isCritical) {
            status = "Critical"; // e.g. Occlusion
            flowRate = 0;
            dripRate = 0;
        } else if (isWarning) {
            status = "Warning"; // e.g. Low Battery or Near Empty
            // Flow rate might be normal but status warns
        }

        // Calculate volume infused based on a simulated "start time" (mock logic)
        // For dynamic updates, we'll just handle incremental updates in the context

        return {
            ...patient,
            status,
            flowRate,
            dripRate,
            volumeInfused: 0, // Will be updated in context
            timeLeft: 0, // Will be calculated
            battery: 80 + Math.floor(Math.random() * 20),
            alerts: status !== "Normal" ? [status] : []
        };
    });
};
