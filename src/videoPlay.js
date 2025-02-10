

export function webcam(){
    
document.addEventListener("DOMContentLoaded", ()=>{
    let button = document.getElementById("button");
    let video = document.getElementById("vid");
    
    button.addEventListener("click", ()=> {
      navigator.mediaDevices.getUserMedia({video: true}).then(stream=>{
        video.srcObject = stream;
        video.addEventListener("loadedmetadata", ()=> {
          video.play();
        });
      }).catch(alert);
    })

});

}