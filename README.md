# Description

The app has only one page with a searchbox, where you can write the city name and get
a weather dashboard on it.

# Project structure

The `app/` folder is composed by three subfolders:

- `component`, contains all the custom components used by the application
- `model`, contains the models/entities of the application (based on an MVC pattern)
- `service`, contains the data service used by the app to fetch weather and geolocation data

In the `environment/` folder there are the environment variables (e.g. the API key).

# Build and run

To build the app is recommended to use Docker. On Linux:

`docker build -t geckoweather .`

and to run it

`docker run -dp 4200:4200 --name app geckoweather`

and to stop it

`docker stop app`

# Alternative way to build and run

`npm install && npm start`
