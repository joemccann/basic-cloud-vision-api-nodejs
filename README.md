# Basic Cloud Vision API Demo for Node.js

## DISCLAIMER

DO NOT USE THIS FOR PRODUCTION USE. 

This is only for demonstration/learning purposes.

## Installation

```sh
npm i
```
You'll need to create a `service-key.json` file and save it in this root directory. You get it from your authentication/permissions settings in your Google Cloud Account.

Read more here:

https://github.com/GoogleCloudPlatform/gcloud-node/blob/master/docs/authentication.md

## Usage

```sh
node face img/joe-at-le-labo.jpg output/joe-highlighted.jpg
```

The above command will take the file `joe-at-le-labo.jpg` in the `img` directory and save a highlighted image in the `output` directory with the file name `joe-highlighted.jpg`.

## 1337 H4x0r Tip for Mac Users

Since it takes some to connect over the network and use the actual image API, run this on your Mac:
```sh
(time node face img/joe-at-le-labo.jpg output/joe-highlighted.jpg && say done) || say error
```
This way you can let it run for how ever long it needs to take, check reddit, and then be notified when it's done or has an error.

You can also see how long it takes with the `time` function.

## License

MIT