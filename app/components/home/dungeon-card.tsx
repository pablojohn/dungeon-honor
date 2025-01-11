import React from "react";

interface CardProps {
  name: string;
  mythic_level: number;
}

const imageMap: { [key: string]: string } = {
  "Ara-Kara, City of Echoes": "https://render.worldofwarcraft.com/us/zones/ara-kara-city-of-echoes-small.jpg",
  "City of Threads": "https://render.worldofwarcraft.com/us/zones/city-of-threads-small.jpg",
  "Grim Batol": "https://render.worldofwarcraft.com/us/zones/grim-batol-small.jpg",
  "Mists of Tirna Scithe": "https://render.worldofwarcraft.com/us/zones/mists-of-tirna-scithe-small.jpg",
  "Siege of Boralus": "https://render.worldofwarcraft.com/us/zones/siege-of-boralus-small.jpg",
  "The Dawnbreaker": "https://render.worldofwarcraft.com/us/zones/the-dawnbreaker-small.jpg",
  "The Necrotic Wake": "https://render.worldofwarcraft.com/us/zones/the-necrotic-wake-small.jpg",
  "The Stonevault": "https://render.worldofwarcraft.com/us/zones/the-stonevault-small.jpg"
};

export const DungeonCard: React.FC<CardProps> = ({ name, mythic_level }) => {
  const backgroundImage = imageMap[name] || null; // Use null if no match

  return (
    <div className="w-full h-full overflow-hidden rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-white shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg ${}"
      style={backgroundImage ? { backgroundImage: `url('${backgroundImage}')` } : undefined}>
      <div className="text-center">
        <h2 className="text-xl font-extrabold text-blue-400">{name}</h2>
        <p className="mt-2 text-lg text-gray-300">
          Mythic Level: <span className="font-medium text-gray-400">{mythic_level}</span>
        </p>
      </div>
    </div>
  );
};
