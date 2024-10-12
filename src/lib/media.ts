export const openMediaDevices = async (constraints: MediaStreamConstraints) => {
    return navigator.mediaDevices.getUserMedia(constraints);
}

export const getConnectedDevices = async (type: "audioinput" | "audiooutput" | "videoinput") => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === type)
}

const updateCameraList = (cameras: MediaDeviceInfo[]) => {
    const cameraList = document.getElementById('availableCameras') as HTMLSelectElement;
    cameraList.innerHTML = '';
    cameras.forEach(camera => {
        const option = document.createElement('option');
        option.value = camera.deviceId;
        option.text = camera.label;
        cameraList.appendChild(option);
    });
}

export const openCamera = async (cameraId: string, width: number, height: number) => {
    const constraints = {
        audio: true,
        video: {
            deviceId: cameraId,
            width: { ideal: width },
            height: { ideal: height }
        }
    };
    return openMediaDevices(constraints);
}