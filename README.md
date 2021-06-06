# MMM-NAVITIA

MMM-NAVITIA is a MagicMirror² module that displays next trains arriving in a specific train station for Paris region
It is based on Navitia open API (https://www.navitia.io/)

## Features
* Displays the next departures from the stop point specified

## Visuals

## Installation

```bash
git clone
cd MMM-Navitia
npm install
```

## Usage

```
		{
			module:'MMM-Navitia',
			position:'top_right',
			config: 
			{
				navitiaApiKey:"YOUR_NAVITIA_API_KEY", // go to https://www.navitia.io/
				departures:
				[
					{
						// Ligne A
						departureStopPoint:"TRN:SP:DUA8738640", // Stop ID in the file
						departureLine:"TRN:DUA810801041",       // Line ID in the file
						direction:"forward",                    // Direction of the journey : [all, backward, forward]
						limit:5                                 // Number of next departures 
					},
				]
			}
		}
```


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
Copyright (c) [2021] [Michel Dejoux]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.