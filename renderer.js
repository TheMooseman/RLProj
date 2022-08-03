const setFolderButton = document.getElementById('folderchooser');
const folderInput = document.getElementById('selectedFolder');
const selectMenu = document.getElementById('replayList');
const select = document.querySelector('select');

select.onchange = (e) => {
    const selectedVals = [...e.target.selectedOptions].map(o => o.value)
    selectedVals.forEach(element => {
        replaySelected(element);
    });
}

function GetFolderPath(){
    window.api.openDialog();
}

setFolderButton.addEventListener('click', () =>{
    GetFolderPath();
});

function itemSelected(chosen){
    console.log(chosen);
}

function replaySelected(replay){
    if(replay){
        //window.api.replayInfo(replay);
    }
}

/* API/PRELOAD FUNCS */

window.api.onRetPath((data) => {
    folderInput.outerText = data;
    window.api.listReplays(data);
});

window.api.addReplay((data) => {
    let replayList = document.getElementById('replayList');
    let newReplay = document.createElement('option');
    newReplay.appendChild(document.createTextNode(data[0]));
    newReplay.text = data[0];
    newReplay.title = data[1];
    newReplay.textContent = data[0];
    newReplay.setAttribute('class', 'replayObj');
    replayList.appendChild(newReplay);

    //console.log(data);
})

window.api.retReplayInfo((data) => {
    //console.log(data);
})
