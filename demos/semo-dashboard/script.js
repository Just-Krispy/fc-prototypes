// Good Morning SEMO Dashboard - Script
(function () {
    'use strict';

    // ====== Dark/Light Mode Toggle ======
    function initTheme() {
        var saved = localStorage.getItem('semo-theme');
        if (saved) {
            document.documentElement.setAttribute('data-theme', saved);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        var toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.addEventListener('click', function () {
                var current = document.documentElement.getAttribute('data-theme');
                var next = current === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', next);
                localStorage.setItem('semo-theme', next);
                toggle.setAttribute('aria-label', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
            });
        }

        // Listen for OS theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
                if (!localStorage.getItem('semo-theme')) {
                    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    // Set greeting based on time of day
    function setGreeting() {
        var hour = new Date().getHours();
        var greeting;
        if (hour < 12) greeting = 'Good Morning, Greg';
        else if (hour < 17) greeting = 'Good Afternoon, Greg';
        else greeting = 'Good Evening, Greg';

        var el = document.getElementById('greeting');
        if (el) el.textContent = greeting;
    }

    // Set formatted date
    function setDate() {
        var now = new Date();
        var options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        var formatted = now.toLocaleDateString('en-US', options);
        var el = document.getElementById('current-date');
        if (el) el.textContent = formatted;
    }

    // Fetch weather from wttr.in
    function fetchWeather() {
        var url = 'https://wttr.in/Cape_Girardeau_MO?format=j1';

        fetch(url)
            .then(function (res) { return res.json(); })
            .then(function (data) {
                renderWeather(data);
            })
            .catch(function () {
                renderWeatherFallback();
            });
    }

    function renderWeather(data) {
        var current = data.current_condition[0];
        var forecast = data.weather || [];

        // Current conditions
        var tempF = current.temp_F;
        var desc = current.weatherDesc[0].value;
        var humidity = current.humidity;
        var windMph = current.windspeedMiles;
        var windDir = current.winddir16Point;
        var precipMm = current.precipMM;

        document.getElementById('weather-temp').textContent = tempF + '\u00B0F';
        document.getElementById('weather-desc').textContent = desc;
        document.getElementById('weather-humidity').textContent = humidity + '%';
        document.getElementById('weather-wind').textContent = windMph + ' mph ' + windDir;
        document.getElementById('weather-precip').textContent = precipMm + ' mm';

        // 3-day forecast
        var forecastEl = document.getElementById('forecast');
        var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var html = '';

        for (var i = 0; i < Math.min(3, forecast.length); i++) {
            var day = forecast[i];
            var dateObj = new Date(day.date);
            var dayName = i === 0 ? 'Today' : days[dateObj.getDay()];
            var high = day.maxtempF;
            var low = day.mintempF;
            var dayDesc = day.hourly[4].weatherDesc[0].value;

            html += '<div class="forecast-day" role="group" aria-label="' + dayName + ' forecast">';
            html += '<div class="forecast-day-name">' + dayName + '</div>';
            html += '<div class="forecast-day-temp">' + high + '\u00B0/' + low + '\u00B0</div>';
            html += '<div class="forecast-day-desc">' + dayDesc + '</div>';
            html += '</div>';
        }

        forecastEl.innerHTML = html;

        // Ag-relevant alerts
        checkAgAlerts(current, forecast);

        // Show content, hide loading
        document.getElementById('weather-loading').style.display = 'none';
        document.getElementById('weather-content').style.display = 'block';
    }

    function checkAgAlerts(current, forecast) {
        var alerts = [];
        var tempF = parseInt(current.temp_F, 10);

        // Frost warning
        if (tempF <= 36) {
            alerts.push('Frost advisory: Current temp ' + tempF + '\u00B0F. Protect sensitive crops.');
        }

        // Check forecast for freeze/rain
        for (var i = 0; i < Math.min(3, forecast.length); i++) {
            var day = forecast[i];
            var minTemp = parseInt(day.mintempF, 10);
            var totalPrecip = 0;

            for (var h = 0; h < day.hourly.length; h++) {
                totalPrecip += parseFloat(day.hourly[h].precipMM || 0);
            }

            if (minTemp <= 32) {
                var dateObj = new Date(day.date);
                var dayName = i === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                alerts.push('Freeze warning ' + dayName + ': Low of ' + minTemp + '\u00B0F expected.');
            }

            if (totalPrecip > 15) {
                var dateObj2 = new Date(day.date);
                var dayName2 = i === 0 ? 'Today' : dateObj2.toLocaleDateString('en-US', { weekday: 'short' });
                alerts.push('Heavy rain ' + dayName2 + ': ' + totalPrecip.toFixed(1) + 'mm expected. Field conditions may be impacted.');
            }
        }

        var alertsEl = document.getElementById('weather-alerts');
        if (alerts.length > 0) {
            var html = '';
            for (var j = 0; j < alerts.length; j++) {
                html += '<div class="weather-alert" role="alert">' + alerts[j] + '</div>';
            }
            alertsEl.innerHTML = html;
        }
    }

    function renderWeatherFallback() {
        document.getElementById('weather-loading').innerHTML =
            '<div style="color:var(--text-muted, #999);font-size:13px;">Weather data temporarily unavailable.<br>Check <a href="https://wttr.in/Cape_Girardeau_MO" target="_blank" rel="noopener noreferrer" style="color:var(--weather-fallback-link, #5B8F22);">wttr.in</a> directly.</div>';
    }

    // Init
    initTheme();
    setGreeting();
    setDate();
    fetchWeather();
})();
