import axios from 'axios';

export const startGame = async () => {
    const response = (await axios.get("http://localhost:3000/")).data
    
    return response;
};

export const playCard = async (cardIndex) => {
    const response = await axios.get(`http://localhost:3000/playcard/${cardIndex}`)
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            return error.response;
        })
    return response.data;
};

export const switchPlayer = async () => {
    const response = (await axios.get("http://localhost:3000/changeplayer")).data

    return response;
};

export const restartGame = async () => {
    const response = (await axios.get("http://localhost:3000/restartgame")).data
    
    return response;
};
