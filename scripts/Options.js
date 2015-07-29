var numberOfPlayers = 0; //player0 and player1 - third and fourth player

var playerControlsData = (function(){
    var selectedPlayersControls = Object.create({});

    Object.defineProperty(selectedPlayersControls, 'init', {
        value: function(){
            this.leftControls = [];
            this.rightControls = [];

            return this;
        }
    });

    Object.defineProperty(selectedPlayersControls, 'addLeftControl', {
        value: function(value){
            this.leftControls.push(value);
        }
    });

    Object.defineProperty(selectedPlayersControls, 'addRightControl', {
        value: function(value){
            this.rightControls.push(value);
        }
    });

    return selectedPlayersControls;
}());

var controlsData = Object.create(playerControlsData).init();

var displayOptionsMenu = (function(){
    var addPlayerButton = document.getElementById('addPlayer'),
        saveButton = document.getElementById('save'),
        backButton = document.getElementById('back');

    var form = document.getElementById('form');

    form.style.display = 'block';
    addPlayerButton.style.display = 'block';
    saveButton.style.display = 'block';
    backButton.style.display = 'block';

    addPlayerButton.onclick = function(){
        if(numberOfPlayers === 2){
            alert('Maximum Four Players Allowed!');
            return;
        }

        var nameInput = document.createElement('input'),
            nameInputSpan = document.createElement('span'),
            nameSpan = document.createElement('span'),
            leftControlInput = document.createElement('input'),
            leftControlInputSpan = document.createElement('span'),
            leftControlSpan = document.createElement('span'),
            rightControlInput = document.createElement('input'),
            rightControlInputSpan = document.createElement('span'),
            rightControlSpan = document.createElement('span');

        nameInput.setAttribute('type', 'text');
        nameInput.style.display = 'none';
        nameInputSpan.setAttribute('id', 'player' + numberOfPlayers);
        nameInputSpan.innerHTML = 'Dobby';
        nameSpan.innerHTML = "Please enter nickname.";


        form.appendChild(nameInput);
        form.appendChild(nameInputSpan);
        form.appendChild(nameSpan);
        form.appendChild(document.createElement('br'));

        leftControlInput.setAttribute('type', 'text');
        leftControlInput.style.display = 'none';
        leftControlInputSpan.setAttribute('id', 'leftControlPlayer' + numberOfPlayers);
        leftControlInputSpan.innerHTML = 'Enter key';
        leftControlSpan.innerHTML = "Move Left!";

        form.appendChild(leftControlInput);
        form.appendChild(leftControlInputSpan);
        form.appendChild(leftControlSpan);
        form.appendChild(document.createElement('br'));

        rightControlInput.setAttribute('type', 'text');
        rightControlInput.style.display = 'none';
        rightControlInputSpan.setAttribute('id', 'rightControlPlayer' + numberOfPlayers);
        rightControlInputSpan.innerHTML = 'Enter key';
        rightControlSpan.innerHTML = 'Move right!';

        form.appendChild(rightControlInput);
        form.appendChild(rightControlInputSpan);
        form.appendChild(rightControlSpan);
        form.appendChild(document.createElement('br'));

        nameInputSpan.addEventListener('click', function(ev){
            this.style.display = 'none';
            nameInput.style.display = 'inline-block';
            nameInput.setAttribute('autofocus', 'autofocus');
        }, false);

        nameInput.addEventListener('keydown', function(ev) {
            if(ev.keyCode === 13) { //enter is pressed!
                nameInputSpan.innerHTML = this.value;
                this.style.display = 'none';
                nameInputSpan.style.display = 'inline-block';
            }
        }, false);

        setMovementElements(leftControlInput, leftControlInputSpan, 'left');
        setMovementElements(rightControlInput, rightControlInputSpan, 'right');

        function setMovementElements(controlInput, controlInputSpan, direction){
            controlInput.addEventListener('keydown', function(ev) {
                controlInputSpan.innerHTML = String.fromCharCode(ev.keyCode);
                controlInputSpan.style.display = 'inline-block';
                controlInput.style.display = 'none';
                if(direction === 'left'){
                    controlsData.addLeftControl(ev.keyCode);
                }
                else if(direction === 'right'){
                    controlsData.addRightControl(ev.keyCode);
                }
            }, false);

            controlInputSpan.addEventListener('click', function(ev){
                controlInputSpan.style.display = 'none';
                controlInput.style.display = 'inline-block';
                controlInput.setAttribute('autofocus', 'autofocus');
            }, false);
        }

        numberOfPlayers++;
    }

    backButton.onclick = function(ev){
        form.style.display = 'none';
        addPlayerButton.style.display = 'none';
        saveButton.style.display = 'none';
        backButton.style.display = 'none';

        form.innerHTML = '';
        numberOfPlayers = 0;
        displayMenu(gameField, gameFieldCtx);
    };

    saveButton.onclick = function(){
        var isThirdPlayerExistent = Boolean(document.getElementById('player0')),
            isFourthPlayerExistent = Boolean(document.getElementById('player1'));

        if(isThirdPlayerExistent){
            if(!AllFieldsAreFilled(0)){
                alert('Must enter all fields!');
                return;
            }
            InsertPlayer(0);
        }

        if(isFourthPlayerExistent){
            if(!AllFieldsAreFilled(1)){
                alert('Must enter all fields!');
                return;
            }

            InsertPlayer(1);
        }

        alert('Done.');
    };

    function AllFieldsAreFilled(playerId){
        var name = document.getElementById('player' + playerId),
            leftControl = document.getElementById('leftControlPlayer' + playerId),
            rightControl = document.getElementById('rightControlPlayer' + playerId);

        if(leftControl.innerHTML === 'Enter key' || rightControl.innerHTML === 'Enter key'){
            return false;
        }

        return true;
    }

    function InsertPlayer(id){
        var name = document.getElementById('player' + id),
            playerExists = playersToAdd.some(function(element){
                return element.id === id;
            });

        if(!playerExists) {
            playersToAdd.push({
                id: id,
                name: name.innerHTML,
                moveLeft: controlsData.leftControls[id],
                moveRight: controlsData.rightControls[id]
            });
        }
    }
});