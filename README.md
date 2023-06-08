# Scratch map

How much of the world have you seen ?

Make your own scratch-map style with this tool.

<img width="400" alt="Screen Shot 2020-10-05 at 5 13 46 PM" src="https://user-images.githubusercontent.com/11202803/95226437-39a27300-07fd-11eb-97c0-cd91a6c7a4e4.png">
<img width="400" alt="Screen Shot 2020-10-06 at 4 21 45 PM" src="https://user-images.githubusercontent.com/11202803/95226621-740c1000-07fd-11eb-8ace-f7745aca1785.png">


## How ?

Note: Your data never leaves your device.

### 1. Download your location history from Google

Head to https://takeout.google.com and request a download of your location history.

<img width="1440" alt="Screen Shot 2020-10-06 at 2 23 02 PM" src="https://user-images.githubusercontent.com/11202803/95226888-bdf4f600-07fd-11eb-8511-3ecbc20c3c76.png">


### 2. Find the right json file

Unzip the contents of the Takeout archive. At the root of the `Location History` folder you should have a file named `location history.json`. This file might be located or named differently depending on your region and locale.

### 3. Drop the file in the interface.

If you want to launch this app locally from the repo:
- `$ git clone git@github.com:benjamintd/scratch-map.git`
- `$ cd scratch-map && yarn && yarn start`

Otherwise you can head to https://scratch.benmaps.fr.

Drag and drop the json file onto the map, then wait for it to display your scratch map. The data is processed locally and never leaves your device.

