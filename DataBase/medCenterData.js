const config = require("config");
const PORT = config.get("port");

const imgUrl = `http://localhost:${PORT}`;

const medCenterData = [
    {
        id_medcenter: new Date().getTime(),
        name: "Nordin",
        address: "Minsk, st. Surganova, 47B",
        photo: `${imgUrl}/Assets/medCentersImg/NORDIN.jpg`,
        description:
            "Nordin is a modern multidisciplinary medical center in Minsk.",
        services: [
            "Oncology",
            "Immunology",
            "Cardiology",
            "Proctology",
            "Psychology",
            "Rheumatology",
            "Urology",
            "Traumatology",
            "Andrology",
        ],
        medStaff: ["id_doctor"],
        location: {
            lat: 53.932475,
            lon: 27.57843,
        },
    },
    {
        id_medcenter: new Date().getTime(),
        name: "LODE",
        address: "Minsk, Independence, 58A",
        photo: `${imgUrl}/Assets/medCentersImg/LODE.jpg`,
        description:
            'The multidisciplinary medical company "LODE" has been operating since 1992. For almost 30 years of activity, the centers have received many awards in their industry and, most importantly, popular confidence and recognition.',
        services: [
            "Oncology",
            "Immunology",
            "Cardiology",
            "Proctology",
            "Psychology",
            "Rheumatology",
            "Urology",
            "Traumatology",
            "Andrology",
        ],
        medStaff: ["id_doctor"],
        location: {
            lat: 53.900601,
            lon: 27.558972,
        },

        // logo: photo.LODE_LOGO
    },
    {
        id_medcenter: new Date().getTime(),
        name: "Alfamed",
        address: "Minsk, Independence Avenue, 85",
        photo: `${imgUrl}/Assets/medCentersImg/ALFAMED.jpg`,
        description:
            'Medical Center "Alfamed-95" is a private unitary enterprise that opened its doors to patients in 2001. The medical center provides a full range of medical services for residents of the capital and guests of Minsk, delighting with impeccable service and an individual approach to each patient.',
        services: ["id_service"],
        medStaff: ["id_doctor"],
        location: {
            lat: 53.923359,
            lon: 27.602722,
        },
    },
    {
        id_medcenter: new Date().getTime(),
        name: "Doctor Profi",
        address: "Minsk, d.Kopische, st.Lopatin, 7a",
        photo: `${imgUrl}/Assets/medCentersImg/DOCTOR_PROFI.png`,
        description:
            'The multidisciplinary medical company "LODE" has been operating since 1992. For almost 30 years of activity, the centers have received many awards in their industry and, most importantly, popular confidence and recognition.',
        services: ["id_service"],
        medStaff: ["id_doctor"],
        location: {
            lat: 53.960064,
            lon: 27.67016,
        },
    },
    {
        id_medcenter: new Date().getTime(),
        name: "SYNLAB",
        address: "Minsk, st. Academic, 26",
        photo: `${imgUrl}/Assets/medCentersImg/SYNLAB.jpg`,
        description:
            "The SINLAB medical diagnostic laboratory has been operating since 2002 and for over 16 years we have been an independent laboratory in the Republic of Belarus.",
        services: ["id_service"],
        medStaff: ["id_doctor"],
        location: {
            lat: 53.877502,
            lon: 27.488474,
        },
    },
];

module.exports = medCenterData;
