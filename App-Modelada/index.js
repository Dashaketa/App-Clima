// Este código NO usa 'temp-box' ni otros IDs incorrectos
document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '470bd210311d3e9c26257e64753785cf';
    const searchBtn = document.getElementById('search-btn');
    const cityInput = document.getElementById('city-input');

    searchBtn.addEventListener('click', getWeather);
    cityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') getWeather();
    });

    // Obtener el clima de la ubicación actual
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getWeatherByCoords(lat, lon);
            }, () => {
                const errorElement = document.getElementById('error-message');
                const weatherContainer = document.getElementById('weather-container');
                showError('No se pudo obtener tu ubicación. Intenta con una ciudad.', errorElement, weatherContainer);
            });
        } else {
            const errorElement = document.getElementById('error-message');
            const weatherContainer = document.getElementById('weather-container');
            showError('Geolocalización no es compatible con tu navegador.', errorElement, weatherContainer);
        }
    }

    // Obtener el clima usando las coordenadas
    async function getWeatherByCoords(lat, lon) {
        const errorElement = document.getElementById('error-message');
        const weatherContainer = document.getElementById('weather-container');
        
        try {
            searchBtn.disabled = true;
            searchBtn.textContent = 'Buscando...';
            errorElement.textContent = '';

            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`
            );

            if (!response.ok) throw new Error(response.status === 404 ? 'Ciudad no encontrada' : 'Error en la API');

            const data = await response.json();
            displayWeather(data);
            getForecast(`${data.name},${data.sys.country}`); // <-- Añade esta línea

            weatherContainer.style.display = 'grid';
        } catch (error) {
            showError(`Error: ${error.message}. Intenta con "Ciudad,País" (ej: London,GB)`, errorElement, weatherContainer);
        } finally {
            searchBtn.disabled = false;
            searchBtn.innerHTML = '<img src="image/buscar.svg" alt="Buscar" class="w-6 h-4">';
        }
    }

    // Obtener el clima con el nombre de la ciudad
    async function getWeather() {
        const city = cityInput.value.trim();
        const errorElement = document.getElementById('error-message');
        const weatherContainer = document.getElementById('weather-container');

        if (!city) {
            showError('Por favor ingresa una ciudad (ej: Madrid,ES)', errorElement, weatherContainer);
            return;
        }

        try {
            searchBtn.disabled = true;
            searchBtn.textContent = 'Buscando...';
            errorElement.textContent = '';

            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`
            );

            if (!response.ok) throw new Error(response.status === 404 ? 'Ciudad no encontrada' : 'Error en la API');

            const data = await response.json();
            displayWeather(data);
            weatherContainer.style.display = 'grid';
            getForecast(city); // <-- ESTA LÍNEA NUEVA para mostrar el pronóstico

        } catch (error) {
            showError(`Error: ${error.message}. Intenta con "Ciudad,País" (ej: London,GB)`, errorElement, weatherContainer);
        } finally {
            searchBtn.disabled = false;
            searchBtn.innerHTML = '<img src="image/buscar.svg" alt="Buscar" class="w-6 h-4">';
        }
    }

    // Mostrar los datos del clima
    function displayWeather(data) {
        document.getElementById('city-name').textContent = `${data.name}, ${data.sys.country}`;
        document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
        document.getElementById('weather-description').textContent =
            data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
        document.getElementById('humidity').textContent = data.main.humidity;
        document.getElementById('wind-speed').textContent = Math.round(data.wind.speed * 3.6);
        document.getElementById('pressure').textContent = data.main.pressure;

        const iconCode = data.weather[0].icon;
        const icon = document.getElementById('weather-icon');
        icon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        icon.alt = data.weather[0].description;
    }

    // Mostrar error en caso de falla
    function showError(message, errorElement, weatherContainer) {
        errorElement.textContent = message;
        weatherContainer.style.display = 'none';
    }

    // Llamamos a getLocation cuando se carga la página para obtener el clima de la ubicación actual
    getLocation();
});
