const factionConfig = [
  {
    name: "Bheet",
    stats: {
      health: 1000,
      attack: 200,
      defense: 70,
      support: 20,
    },
  },
  {
    name: "Kooy",
    stats: {
      health: 1550,
      attack: 80,
      defense: 120,
      support: 150,
    },
  },
  {
    name: "Maul",
    stats: {
      health: 2100,
      attack: 20,
      defense: 180,
      support: 80,
    },
  }
];

export const getShipStats = (factionId) => {
  if (factionConfig[factionId]) {
    return factionConfig[factionId].stats;
  }
  return {};
};

export const getFactionName = (ifactionId) => {
  if (factionConfig[factionId]) {
    return factionConfig[factionId].name;
  }
  return "";
};
