const factionConfig = [
  {
    name: "Bheet",
    stats: {
      health: 1000,
      defense: 100,
      attack: 150,
      support: 100,
    },
  },
  {
    name: "Kooy",
    stats: {
      health: 1500,
      defense: 180,
      attack: 150,
      support: 80,
    },
  },
  {
    name: "Maul",
    stats: {
      health: 1250,
      defense: 150,
      attack: 50,
      support: 150,
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
