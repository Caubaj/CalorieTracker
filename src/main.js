import './style.css';

// import { webcam } from './videoPlay.js'; 

// webcam();

import './style.css';

window.onload = function () {
    let video = document.getElementById("vid");

    if (!video) {
        console.error("❌ Video element not found!");
        return;
    }

    navigator.mediaDevices.getUserMedia({
        video: {
            width: { ideal: 1920 },  // ✅ Full HD resolution for better barcode clarity
            height: { ideal: 1080 },
            facingMode: "environment", // ✅ Use back camera for scanning
            focusMode: "continuous"
        }
    })
    .then(stream => {
        video.srcObject = stream;
        video.addEventListener("playing", () => {
            console.log("✅ Video is playing at high resolution!");
            setTimeout(startQuagga, 500);
        });
    })
    .catch(error => {
        console.error("❌ Error accessing webcam:", error);
    });
};

// ✅ Function to Start Quagga After Video is Ready
function startQuagga() {
    Quagga.init({
        numOfWorkers: 2,
        locate: true,
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector("#vid"),
            constraints: {
                width: 1920,  // ✅ High resolution
                height: 1080,
                facingMode: "environment"
            },
            frequency: 5,  // ✅ Process every 5th frame for better performance
            willReadFrequently: true
        },
        decoder: {
            readers: [
                "upc_reader"
            ]
        },
        locate: true,
        locator: {
            patchSize: "large",  // ✅ Increase barcode detection area
            halfSample: false   // ✅ Keep full resolution for better accuracy
        },
        debug: true,
        drawBoundingBox: true,
        drawScanline: true
    }, function (err) {
        if (err) {
            console.error("❌ QuaggaJS error:", err);
            return;
        }
        console.log("✅ Quagga initialized successfully!");
        Quagga.start();
    });
}

// ✅ Log If Quagga Detects Any Barcode-Like Shapes
Quagga.onProcessed(result => {
    if (result) {
        console.log("🔍 Processing frame...");
        if (result.boxes && result.boxes.length > 0) {
            console.log("📦 Possible barcode detected:", result.boxes);
        } else {
            console.log("⚠️ No barcode-like shape detected.");
        }
    }
});

let lastScannedCode = "";
let scanCooldown = false;  // Prevents scanning multiple times in a row

Quagga.onDetected(result => {
    let barcode = result.codeResult.code;

    // ✅ Ignore duplicate scans within 2 seconds
    if (scanCooldown || barcode === lastScannedCode) {
        console.log("⚠️ Duplicate scan ignored:", barcode);
        return;
    }

    lastScannedCode = barcode;
    scanCooldown = true;  // ✅ Activate cooldown

    console.log("✅ Scanned Barcode:", barcode);
    document.getElementById("output").innerText = "Scanned: " + barcode;
    alert("✅ Scanned Barcode: " + barcode);

    setTimeout(() => {
        scanCooldown = false; // ✅ Allow scanning again after cooldown
    }, 2000); // 2 seconds cooldown
});










