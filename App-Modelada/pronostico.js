// pronostico.js
const apiKey = '470bd210311d3e9c26257e64753785cf';

// Obtener el pronóstico de 5 días
async function getForecast(city) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = ''; // Limpiar pronósticos anteriores

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=es`
        );

        if (!response.ok) throw new Error('No se pudo obtener el pronóstico');

        const data = await response.json();
        const forecastList = data.list;

        // Filtramos para mostrar solo una vez por día (ejemplo: alrededor de las 12:00 PM)
        const dailyForecasts = forecastList.filter(item => item.dt_txt.includes('12:00:00'));

        dailyForecasts.forEach(forecast => {
            const date = new Date(forecast.dt_txt);
            const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });
            const temp = Math.round(forecast.main.temp);
            const description = forecast.weather[0].description;
            const iconCode = forecast.weather[0].icon;

            const card = document.createElement('div');
            card.className = `
            bg-blue-200 bg-opacity-20 backdrop-blur-lg rounded-xl shadow-md p-4 
            flex flex-col items-center justify-center text-center 
             h-48          /* Tamaño fijo */
               /* Evita que se encojan */
            hover:scale-105 transition-transform
         `;            card.innerHTML = `
                <h3 class="text-lg font-semibold capitalize">${dayName}</h3>
                <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${description}" class="w-16 h-16">
                <p class="text-xl font-bold">${temp}°C</p>
                <p class="capitalize">${description}</p>
            `;

            forecastContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Error al obtener el pronóstico:', error);
        forecastContainer.innerHTML = '<p class="text-red-500">No se pudo cargar el pronóstico.</p>';
    }
}
