
function randomText() {
    let lines = Math.random() * 4;
    let text = ' ';
    for (x = 0; x < lines; x++) {
        text += "<br> ";
    }
    return text;
}

function randomHeight() {
    return Math.floor(Math.random() * 28 * 3) + 28;
}

function randomColor() {
    return Math.floor(Math.random() * 0x1000000).toString(16);
}

$(document).ready(() => {
    let scrollArea = $('#scrollArea')[0];
    let contentContainer = $('#contentContainer')[0];
    let removedHeight = 0;
    const observer = new MutationObserver((list) => {
        list.forEach(x => {
            x.addedNodes.forEach(y => {
                y.style.height = `${y.clientHeight}px`
                // console.log('added: ', y.style.height);
            });
            x.removedNodes.forEach(y => {
                removedHeight += y.style.height.replace('px', '') * 1;
                // console.log('removed: ', y.style.height);
                console.log('removedHeight: ', removedHeight);
            });
        });
    });

    observer.observe(document.getElementById('contentContainer'), {childList: true, subtree: true});

    function addDiv() {
        setTimeout(() => {
            let div = $(`<div class="content" style="background-color: ${randomColor()}">${randomText()}</div>`)[0];
            contentContainer.appendChild(div);
            if (contentContainer.children.length > 10) {
                contentContainer.removeChild(contentContainer.children[0]);
            }
            addDiv();
        }, Math.random() * 500 + 500);
    }

    let prevTimestamp = 0;
    let prevTranslation = Math.floor(scrollArea.clientHeight * 3 / 4);
    let velocity = 0;
    let acceleration = 0;

    contentContainer.style.transform = `translate(0px, ${Math.floor(prevTranslation)}px)`;

    function recalcPosition(timestamp) {
        requestAnimationFrame(recalcPosition);
        // console.log(1000 / (timestamp - prevTimestamp));

        let millis = timestamp - prevTimestamp;
        let height = scrollArea.clientHeight;
        let contentHeight = contentContainer.scrollHeight + removedHeight;
        let lastChild = $('#contentContainer .content:last-child');
        let lastChildHeight = lastChild.length ? lastChild[0].clientHeight : 0;
        let containerTarget = Math.floor(height * 3 / 4);
        let contentTarget = contentHeight - Math.floor(lastChildHeight / 2);
        let target = containerTarget - contentTarget;

        let timeToZeroV = -velocity / 20;
        let positionAtZeroV = prevTranslation + velocity * timeToZeroV + 20 * timeToZeroV * timeToZeroV / 2;

        if (target != prevTranslation) {
            if (positionAtZeroV > target) {
                acceleration = -20;
            } else {
                acceleration = 20;
            }
        } else {
            acceleration = 0;
            velocity = 0;
        }

        velocity = velocity + acceleration * (millis / 1000);
        let newTranslation = Math.max(target, prevTranslation + velocity * millis / 1000);


        let cssTranslation = Math.floor(newTranslation) + removedHeight;
        contentContainer.style.transform = `translate(0px, ${cssTranslation}px)`;
        //console.log(cssTranslation);

        prevTranslation = newTranslation;
        prevTimestamp = timestamp;
    }

    function simulate() {
        addDiv();
        requestAnimationFrame(recalcPosition);
    }

    simulate();
})
