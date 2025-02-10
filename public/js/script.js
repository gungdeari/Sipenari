let model;
const labels = ['Baris', 'Barong', 'Condong', 'Janger', 'Kecak', 'Pendet Penyambutan', 'Rejang Sari'];

// Load model
async function loadModel() {
    try {
        model = await tf.loadGraphModel('tfjs_model/model.json');
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Error loading model:', error); 
    }
}

//loadModel 
window.onload = function() {
    loadModel(); 
};


// Fungsi untuk menampilkan popup
const openPopupBtn = document.getElementById('open-popup-btn');
const closePopupBtn = document.getElementById('close-popup-btn');
const popup = document.getElementById('popup');

// Event listener untuk membuka popup
openPopupBtn.addEventListener('click', function() {
    popup.style.display = 'flex'; 
});

// Event listener untuk menutup popup
closePopupBtn.addEventListener('click', function() {
    popup.style.display = 'none'; 
});

// Tutup popup 
window.addEventListener('click', function(event) {
    if (event.target === popup) {
        popup.style.display = 'none'; 
    }
});

function toggleMenu() {
    const navigation = document.querySelector('.navigation');
    navigation.classList.toggle('active');
};


// Image Normalization
function preprocessImage(imgElement) {
    return tf.tidy(() => {
        let tensor = tf.browser.fromPixels(imgElement)
            .resizeNearestNeighbor([150, 150]) 
            .toFloat(); 

        let normalizedTensor = tensor.div(tf.scalar(255.0));
        let batchedTensor = normalizedTensor.expandDims(0);

        return batchedTensor;
    });
}


let cameraStream = null;

function closeCamera() {
    const video = document.getElementById('camera-stream');
    const cameraContainer = document.getElementById('camera-container');

    // Hentikan aliran kamera jika ada
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }

    video.srcObject = null; 
    cameraContainer.style.display = 'none'; 
    video.style.display = 'block'; 
}

function openCamera() {
    const cameraContainer = document.getElementById('camera-container');
    const video = document.getElementById('camera-stream');
    const captureBtn = document.getElementById('capture-btn');
    const scanBtn = document.getElementById('scan-btn');
    const imgElement = document.getElementById('image-preview');
    const resultBox = document.getElementById('result-box');

    // Tutup kamera sebelumnya jika masih berjalan
    closeCamera();

    // Sembunyikan elemen lain saat membuka kamera
    imgElement.style.display = 'none';
    imgElement.src = '';
    scanBtn.style.display = 'none';
    resultBox.style.display = 'none';

    // Mulai aliran kamera baru
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            cameraStream = stream;
            video.srcObject = stream;
            video.style.display = 'block'; 
            video.play();
            cameraContainer.style.display = 'flex'; 
            captureBtn.style.display = 'block'; 
        })
        .catch((error) => {
            console.error("Error membuka kamera:", error);
            alert("Tidak dapat mengakses kamera.");
        });
}

function openUpload() {
    closeCamera(); // Hentikan kamera saat berpindah ke opsi upload
    const cameraContainer = document.getElementById('camera-container');
    const imgElement = document.getElementById('image-preview');
    const scanBtn = document.getElementById('scan-btn');
    const resultBox = document.getElementById('result-box');

    // Sembunyikan video stream dan reset elemen gambar
    cameraContainer.style.display = 'none';
    imgElement.style.display = 'none';
    imgElement.src = '';
    scanBtn.style.display = 'none';
    resultBox.style.display = 'none';

    // Tampilkan input file untuk unggah gambar
    document.getElementById('file-input').click();
}

function captureImage() {
    const video = document.getElementById('camera-stream');
    const canvas = document.createElement('canvas');
    const imgElement = document.getElementById('image-preview');
    const cameraContainer = document.getElementById('camera-container');

    // Atur ukuran canvas berdasarkan ukuran video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    // Sembunyikan kontainer kamera setelah capture
    cameraContainer.style.display = 'none';

    // Set preview ke elemen img dan tampilkan
    imgElement.src = canvas.toDataURL('image/png');
    imgElement.style.display = 'block'; 

    // Sembunyikan video stream dan tombol capture setelah mengambil gambar
    video.style.display = 'none';
    document.getElementById('capture-btn').style.display = 'none';

    // Tampilkan tombol klasifikasi setelah gambar di-capture
    document.getElementById('scan-btn').style.display = 'inline-block';
}

function previewImage(event) {
    const file = event.target.files[0];
    const imgElement = document.getElementById('image-preview');

    if (file) {
        const reader = new FileReader();

        // Reset src dari elemen img untuk menghindari masalah caching
        imgElement.src = '';

        reader.onload = function(e) {
            imgElement.src = e.target.result;
            imgElement.style.display = 'block';
        };
        reader.readAsDataURL(file);

        // Sembunyikan stream video kamera jika aktif dan stop camera stream
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            document.getElementById('camera-stream').style.display = 'none';
        }

        // Tampilkan tombol klasifikasi jika gambar telah di-preview
        document.getElementById('scan-btn').style.display = 'inline-block';
    } else {
        alert("File tidak valid. Silakan unggah gambar yang sesuai.");
    }
}



// Fungsi klasifikasi gambar
async function classifyImage() {
    // Cek jika model sudah diload
    if (!model) {
        alert('Model belum siap. Harap tunggu sebentar.');
        return;
    }

    // Ambil elemen gambar untuk diklasifikasi
    const imgElement = document.getElementById('image-preview');
    if (imgElement.src === '#' || imgElement.style.display === 'none') {
        alert('Harap unggah atau ambil gambar terlebih dahulu.');
        return;
    }

    // Preprocess gambar untuk klasifikasi
    const tensor = preprocessImage(imgElement);

    try {
        // Prediksi dengan model
        const predictions = await model.predict(tensor).data();
        console.log('Predictions:', predictions);

        // Dapatkan prediksi tertinggi
        const highestPredictionIndex = predictions.indexOf(Math.max(...predictions));
        const highestPredictionLabel = labels[highestPredictionIndex];
        const highestPredictionScore = (predictions[highestPredictionIndex] * 100).toFixed(2);

        // Tampilkan hasil jika confidence > 80%
        if (highestPredictionScore < 80) {
            document.getElementById('result').innerText = `Tari tidak dikenal`;
            document.getElementById("telusuri-btn").style.display = "none";
        } else {
            document.getElementById('result').innerHTML = `Ini adalah Tari <b>${highestPredictionLabel}</b> `;
            document.getElementById("telusuri-btn").href = `/detail/${highestPredictionLabel.toLowerCase()}`;
            document.getElementById("telusuri-btn").style.display = "inline-block";
        }

        // Log setiap label dan skornya
        labels.forEach((label, index) => {
            const predictionPercentage = (predictions[index] * 100).toFixed(2);
            console.log(`${label}: ${predictionPercentage}%`);
        });

    } catch (error) {
        console.error('Error saat melakukan prediksi:', error);
        document.getElementById('result').innerText = 'Terjadi kesalahan saat melakukan prediksi. Coba lagi.';
    }

    // Tampilkan kotak hasil
    document.getElementById("result-box").style.display = "block";
}
