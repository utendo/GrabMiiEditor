let nnidInput = document.getElementById('nnid');
let posename = document.getElementById('posename');

let theme = new Audio("./assets/theme.mp3");
theme.volume = 0.5;
theme.loop = true;

function startGenerator() {
    playClick();
    if(nnidInput.value != "") {
        $("#intro").fadeOut();
        setTimeout(() => {
            $("#loading")
                .css("display", "flex")
                .hide()
                .fadeIn();

                theme.play();

            getPoses();
        }, 350);
    }
}

function playClick() {
    let uiAudio = new Audio("./assets/switch_006.ogg");
    uiAudio.play();
}

let whash;

function getPoses() {
    $.get( "https://api-grabmii.utendo.me/all?id=" + nnidInput.value, function( data ) {
        let json = data;

        try {
            let poses = json.miis.mii.images.image;

            for(poseID in poses) {
                poses[poseID].url = poses[poseID].url.replace("http://", "https://");
                poses[poseID].url = poses[poseID].url.replace("images.account", "secure.cdn");
            }
            
            whash = json.miis.mii.data;
    
            let whole_body = poses.find(face => face.type === "whole_body");
            let standard = poses.find(face => face.type === "standard");
            let nnid = nnidInput.value;
    
            poses.splice(poses.indexOf(whole_body), 1);
            poses.splice(poses.indexOf(standard), 1);
    
            $("#posecount").text(poses.length);
    
            // apply pose and name
            document.getElementById("pose").src = whole_body.url;
            $("#user-name").text(nnid);
    
            $("#poses").html("");
    
            // show all poses
            for(poseID in poses) {
                pose = poses[poseID];
    
                $("#poses").append(`
                    <div class="pose" onclick="playClick();" onmouseover="showName('${pose.type}');" onmouseout="outName();">
                        <img src="${poses[poseID].url}" alt="${pose.type}">
                    </div>
                `);
            }

            $("#loading").hide();
            $("#final")
                .css("display", "flex")
                .hide()
                .fadeIn();
        }
        catch {
            $("#loading").fadeOut();
            setTimeout(() => {
                $("#error")
                    .css("display", "flex")
                    .hide()
                    .fadeIn();
                setTimeout(() => {
                    $("#error").hide();
                    theme.pause();
                    theme.currentTime = 0;
                    $("#intro").fadeIn();
                }, 2000);
            }, 300);
        }
    });
}

function copyWhash() {
    navigator.clipboard.writeText(whash);
}

function showName(name) {
    $("#posename").text(name)
    $("#posename").show();
}

function outName() {
    $("#posename").hide();
}

function resetGen() {
    $("#final").fadeOut();

    setTimeout(() => {
        theme.pause();
        theme.currentTime = 0;

        $("#intro").fadeIn();
    }, 1000);
}