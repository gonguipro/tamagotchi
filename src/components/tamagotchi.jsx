import React, { useState, useEffect } from 'react';
import tamagotchiGif from "../assets/tamagotchi.gif";
import gameOverGif from "../assets/gameOver.gif";

export function Tamagotchi() {
    const [hunger, setHunger] = useState(() => {
        const savedHunger = localStorage.getItem('hunger');
        return savedHunger ? parseInt(savedHunger) : 50;
    });
    const [happiness, setHappiness] = useState(() => {
        const savedHappiness = localStorage.getItem('happiness');
        return savedHappiness ? parseInt(savedHappiness) : 50;
    });
    const [health, setHealth] = useState(() => {
        const savedHealth = localStorage.getItem('health');
        return savedHealth ? parseInt(savedHealth) : 100;
    });
    const [hygiene, setHygiene] = useState(() => {
        const savedHygiene = localStorage.getItem('hygiene');
        return savedHygiene ? parseInt(savedHygiene) : 70;
    });
    const [energy, setEnergy] = useState(() => {
        const savedEnergy = localStorage.getItem('energy');
        return savedEnergy ? parseInt(savedEnergy) : 50;
    });
    const [gameOver, setGameOver] = useState(() => {
        const savedGameOver = localStorage.getItem('gameOver');
        return savedGameOver === 'true' ? true : false;
    });
    const [level, setLevel] = useState(() => {
        const savedLevel = localStorage.getItem('level');
        return savedLevel ? parseInt(savedLevel) : 1;
    });
    const [levelProgress, setLevelProgress] = useState(() => {
        const savedProgress = localStorage.getItem('levelProgress');
        return savedProgress ? parseInt(savedProgress) : 0;
    });
    const [coins, setCoins] = useState(() => {
        const savedCoins = localStorage.getItem('coins');
        return savedCoins ? parseInt(savedCoins) : 0;
    });
    const [inventory, setInventory] = useState({
        redBull: 0,  // 🧃 Redbull
        food: 0,     // 🍕 Comida
        shower: 0,   // 🚿 Ducha
        sleep: 0     // 🛏️ Cama
    });

    const checkForRewards = () => {
        if (hunger === 100 || happiness === 100 || health === 100 || hygiene === 100 || energy === 100) {
            setCoins(prev => {
                const newCoins = prev + 1;
                localStorage.setItem('coins', newCoins);
                return newCoins;
            });
        }
    };

    useEffect(() => {
        checkForRewards();
    }, [hunger, happiness, health, hygiene, energy]);

    const buyItem = (item) => {
        if (coins >= 1) {
            setCoins(prev => {
                const newCoins = prev - 1;
                localStorage.setItem('coins', newCoins);
                return newCoins;
            });

            setInventory(prevInventory => {
                const newInventory = { ...prevInventory };
                newInventory[item] += 1;
                return newInventory;
            });

            // Aplicar el efecto del objeto comprado
            if (item === 'redBull') {
                setEnergy(prev => Math.min(prev + 30, 100));
                setHealth(prev => Math.max(prev - 40, 0));
            } else if (item === 'food') {
                setHunger(prev => Math.min(prev + 20, 100));
                setHealth(prev => Math.min(prev + 5, 100));
                setEnergy(prev => Math.min(prev + 5, 100));
            } else if (item === 'shower') {
                setHygiene(prev => Math.min(prev + 10, 100));
                setHealth(prev => Math.min(prev + 5, 100));
                setHappiness(prev => Math.min(prev + 2, 100));
            } else if (item === 'sleep') {
                setHealth(prev => Math.min(prev + 10, 100));
                setEnergy(prev => Math.min(prev + 10, 100));
                setHappiness(prev => Math.max(prev - 5, 0));
            }
        }
    };

    useEffect(() => {
        if (gameOver) return;

        const intervalTime = level >= 5 ? 1500 : 3000;
        const hungerDecrement = level >= 5 ? 2 : 1;
        const happinessDecrement = level >= 5 ? 2 : 1;
        const healthDecrement = level >= 5 ? 2 : 1;
        const hygieneDecrement = level >= 5 ? 2 : 1;
        const energyDecrement = level >= 5 ? 2 : 1;

        const timer = setInterval(() => {
            setHunger((prev) => Math.max(prev - hungerDecrement, 0));
            setHappiness((prev) => Math.max(prev - happinessDecrement, 0));
            setHealth((prev) => Math.max(prev - healthDecrement, 0));
            setHygiene((prev) => Math.max(prev - hygieneDecrement, 0));
            setEnergy((prev) => Math.max(prev - energyDecrement, 0));

            setLevelProgress((prev) => {
                const newProgress = prev + 1;
                return newProgress >= 100 ? 100 : newProgress;
            });
        }, intervalTime);

        return () => clearInterval(timer);
    }, [level, gameOver]);

    useEffect(() => {
        if (levelProgress === 100) {
            setLevel((prev) => prev + 1);
            setLevelProgress(0);
            localStorage.setItem('level', level + 1);
            localStorage.setItem('levelProgress', 0);
        }
    }, [levelProgress]);

    // Verificación de Game Over
    useEffect(() => {
        // Comprobamos si alguno de los estados llegó a cero
        if (hunger <= 0 || happiness <= 0 || health <= 0 || hygiene <= 0 || energy <= 0) {
            setGameOver(true);
            localStorage.setItem('gameOver', 'true');
        }
    }, [hunger, happiness, health, hygiene, energy]);

    const getProgressColor = (value) => {
        if (value > 60) return "bg-green-500";
        if (value > 20) return "bg-yellow-500";
        return "bg-red-500";
    };

    const getStatusMessage = () => {
        if (hunger < 20) {
            return "¡Tengo Hambre!😟";
        } else if (happiness < 20) {
            return "Estoy triste 😢";
        } else if (health < 20) {
            return "No me siento bien 😷";
        } else if (hygiene < 20) {
            return "Necesito una duchita 🛁";
        } else if (energy < 20) {
            return "Dame una redbull 🧃";
        } else if (hunger < 10 || happiness < 10 || health < 10 || hygiene < 10 || energy < 10) {
            return "Me voy a morir chupapi 💀";
        } else {
            return "¡Estoy feliz! 😊";
        }
    };

    const feed = () => {
        setHunger(prev => Math.min(prev + 20, 100));
        setHealth(prev => Math.min(prev + 5, 100));
        setEnergy(prev => Math.min(prev + 5, 100));
    };

    const play = () => {
        setHappiness(prev => Math.min(prev + 20, 100));
        setEnergy(prev => Math.max(prev - 10, 0));
        setHealth(prev => Math.max(prev - 5, 0));
    };

    const sleep = () => {
        setHealth(prev => Math.min(prev + 10, 100));
        setEnergy(prev => Math.min(prev + 10, 100));
        setHappiness(prev => Math.max(prev - 5, 0));
    };

    const clean = () => {
        setHygiene(prev => Math.min(prev + 20, 100));
        setHappiness(prev => Math.min(prev + 5, 100));
        setHealth(prev => Math.min(prev + 5, 100));
    };

    if (gameOver) {
        return (
            <div className='w-full h-screen overflow-hidden relative'>
                <img src={gameOverGif} alt="gameOverGif" className='w-full h-full object-cover' />
                <button
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = '/';
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition absolute bottom-10 left-1/2 transform -translate-x-1/2">
                    Volver al Inicio
                </button>
            </div>
        );
    }

    return (
        <div className='p-4 bg-white rounded-lg shadow-md w-80'>
            <div className='mb-4'>
                <label className='block font-medium mb-1 text-center'>LVL {level}</label>
                <div className='bg-gray-300 h-4 rounded overflow-hidden'>
                    <div className="bg-blue-500 h-full" style={{ width: `${levelProgress}%` }}></div>
                </div>
            </div>

            <img src={tamagotchiGif} alt="tamagotchi" />
            <p className='text-center text-lg font-semibold mb-4'>{getStatusMessage()}</p>

            {/* Barras de progreso */}
            <div className='mb-4'>
                <label className="block font-medium mb-1">Hambre:</label>
                <div className='bg-gray-300 h-4 rounded overflow-hidden'>
                    <div className={`${getProgressColor(hunger)} h-full`} style={{ width: `${hunger}%` }}></div>
                </div>
            </div>

            <div className='mb-4'>
                <label className="block font-medium mb-1">Felicidad:</label>
                <div className='bg-gray-300 h-4 rounded overflow-hidden'>
                    <div className={`${getProgressColor(happiness)} h-full`} style={{ width: `${happiness}%` }}></div>
                </div>
            </div>

            <div className='mb-4'>
                <label className='block font-medium mb-1'>Salud:</label>
                <div className='bg-gray-300 h-4 rounded overflow-hidden'>
                    <div className={`${getProgressColor(health)} h-full`} style={{ width: `${health}%` }}></div>
                </div>
            </div>

            <div className='mb-4'>
                <label className='block font-medium mb-1'>Higiene:</label>
                <div className='bg-gray-300 h-4 rounded overflow-hidden'>
                    <div className={`${getProgressColor(hygiene)} h-full`} style={{ width: `${hygiene}%` }}></div>
                </div>
            </div>

            <div className='mb-4'>
                <label className='block font-medium mb-1'>Energia:</label>
                <div className='bg-gray-300 h-4 rounded overflow-hidden'>
                    <div className={`${getProgressColor(energy)} h-full`} style={{ width: `${energy}%` }}></div>
                </div>
            </div>

            {/* Mostrar Monedas */}
            <div className='mb-4'>
                <label className='block font-medium mb-1'>Monedas 💰:</label>
                <div className="text-center text-xl font-semibold">{coins} 💰</div>
            </div>

            {/* Tienda de objetos */}
            <div className='mb-4'>
                <label className='block font-medium mb-1'>Tienda 🛒:</label>
                <div className='flex space-x-2'>
                    <button onClick={() => buyItem('food')} className='px-2 py-2 bg-orange-500 text-white rounded'>
                        🍕 Comida
                    </button>
                    <button onClick={() => buyItem('redBull')} className='px-2 py-2 bg-blue-500 text-white rounded'>
                        🧃 Redbull
                    </button>
                    <button onClick={() => buyItem('shower')} className='px-2 py-2 bg-teal-500 text-white rounded'>
                        🚿 Ducha
                    </button>
                    <button onClick={() => buyItem('sleep')} className='px-2 py-2 bg-purple-500 text-white rounded'>
                        🛏️ Cama
                    </button>
                </div>
            </div>

            {/* Botones de interacción */}
            <div className='flex space-x-2 mt-4'>
                <button onClick={feed} className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition'>
                    Feed
                </button>
                <button onClick={play} className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition'>
                    Play
                </button>
                <button onClick={sleep} className='px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition'>
                    Sleep
                </button>
                <button onClick={clean} className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition'>
                    Clean
                </button>
            </div>
        </div>
    );
}
