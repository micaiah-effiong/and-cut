function JsRecorder(stream) {
  if (!new.target) {
    return JsRecorder.init();
  }

  this.recorder = new MediaRecorder(stream);
  this.dataChunk = [];
  this.recorder.addEventListener("dataavailable", (event) => {
    this.dataChunk.push(event.data);
  });
}

JsRecorder.prototype.start = function () {
  this.recorder.start();
};

JsRecorder.prototype.stop = function () {
  this.recorder.stop();
};

JsRecorder.prototype.getRecordData = function () {
  return new Blob(this.dataChunk);
};

JsRecorder.prototype.playAudio = function () {
  const blobData = new Blob(this.dataChunk);
  const fr = new FileReader();
  fr.readAsDataURL(blobData);
  const audio = new Audio();
  fr.onload = () => {
    audio.src = fr.result.replace(
      "application/octet-stream",
      this.recorder.mimeType
    ) /*URL.createObjectURL(blobData)*/;
    // console.log(audio.src);
    audio.play();
  };
};

JsRecorder.init = async function () {
  try {
    let stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    return new JsRecorder(stream);
  } catch (err) {
    throw err;
  }
};

let myRec;
JsRecorder().then((rec) => (myRec = rec));
