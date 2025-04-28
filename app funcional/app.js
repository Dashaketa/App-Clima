document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '470bd210311d3e9c26257e64753785cf'; // Tu API key
    const searchBtn = document.getElementById('search-btn');
    const cityInput = document.getElementById('city-input');
    
    // Configurar evento de búsqueda
    searchBtn.addEventListener('click', getWeather);
    
    // Permitir búsqueda con Enter
    cityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            getWeather();
        }
    });
    
    async function getWeather() {
        const city = cityInput.value.trim();
        const errorElement = document.getElementById('error-message');
        const weatherContainer = document.getElementById('weather-container');
        
        // Validación básica
        if (!city) {
            showError('Por favor ingresa una ciudad (ej: Madrid,ES)', errorElement, weatherContainer);
            return;
        }
        
        try {
            // Mostrar carga
            searchBtn.disabled = true;
            searchBtn.textContent = 'Buscando...';
            errorElement.textContent = '';
            
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`
            );
            
            if (!response.ok) {
                throw new Error(response.status === 404 ? 'Ciudad no encontrada' : 'Error en la API');
            }
            
            const data = await response.json();
            displayWeather(data);
            weatherContainer.style.display = 'block';
            
        } catch (error) {
            showError(`Error: ${error.message}. Intenta con "Ciudad,País" (ej: London,GB)`, errorElement, weatherContainer);
            console.error('Error al obtener clima:', error);
        } finally {
            searchBtn.disabled = false;
            searchBtn.textContent = 'Buscar Clima';
        }
    }
    
    function displayWeather(data) {
        // Mostrar información principal
        document.getElementById('city-name').textContent = `${data.name}, ${data.sys.country}`;
        document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
        document.getElementById('weather-description').textContent = 
            data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
        
        // Mostrar detalles adicionales
        document.getElementById('humidity').textContent = data.main.humidity;
        document.getElementById('wind-speed').textContent = Math.round(data.wind.speed * 3.6); // m/s a km/h
        document.getElementById('pressure').textContent = data.main.pressure;
        
        // Mostrar icono del clima
        const iconCode = data.weather[0].icon;
        document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        document.getElementById('weather-icon').alt = data.weather[0].description;
    }
    
    function showError(message, errorElement, weatherContainer) {
        errorElement.textContent = message;
        weatherContainer.style.display = 'none';
    }
    
    // Carga inicial con una ciudad por defecto (opcional)
    // cityInput.value = 'Madrid,ES';
    // getWeather();
});