let mediaStream = null;
export function Scanner() {
    return new Promise((resolve, reject) => {
            let video = document.getElementById("vid");
            video.style.display = "block"
            navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    facingMode: "environment"
                }
            })
            .then(stream => {
                mediaStream = stream;
                video.srcObject = stream;
                video.addEventListener("playing", () => {
                    startQuagga();
                });
            })
            .catch(error => {
                reject("❌ Error accessing webcam:", error);
            });
        Quagga.onDetected(result => {
            const barcode = result.codeResult.code;
            resolve(barcode); 
        });
    });
}

export function stopScanner() {
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        Quagga.stop();
        document.getElementById("vid").style.display = "none";
    }
}

function startQuagga() {
    Quagga.init({
        numOfWorkers: 5,
        locate: true,
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector("#vid"),
            constraints: {
                width: 1920, 
                height: 1080,
                facingMode: "environment"
            },
            frequency: 10, 
            willReadFrequently: true
        },
        decoder: {
            readers: [
                "upc_reader"
            ]
        },
        locate: true,
        locator: {
            patchSize: "large",  
            halfSample: false  
        },
    }, function (err) {
        if (err) {
            return;
        }
        Quagga.start();
    });
}